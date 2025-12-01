import XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { google } from 'googleapis';
import { query } from '../db/connection';

// Generate Excel file
export async function generateExcel(request: any): Promise<Buffer> {
  const workbook = XLSX.utils.book_new();

  // Get company info from request or environment or use defaults
  let companyName = process.env.COMPANY_NAME || '金鴻空調機電工程有限公司';
  let companyTaxId = process.env.COMPANY_TAX_ID || '16272724';
  
  // Use company from request if available
  if (request.company_name) {
    companyName = request.company_name;
  }
  if (request.company_tax_id) {
    companyTaxId = request.company_tax_id;
  }

  // Get user's default address and contact info
  let deliveryAddress = '';
  let contactPhone = '';
  try {
    const addressResult = await query(
      'SELECT address, contact_phone FROM addresses WHERE user_id = $1 AND is_default = true LIMIT 1',
      [request.user_id]
    );
    if (addressResult.rows.length > 0) {
      deliveryAddress = addressResult.rows[0].address || '';
      contactPhone = addressResult.rows[0].contact_phone || '';
    }
  } catch (error) {
    console.warn('取得地址資訊失敗:', error);
  }

  // Get site name (工區) - can be extracted from address or use default
  // For now, extract from address if it contains "三總" or similar, otherwise use first part
  let siteName = '';
  if (deliveryAddress) {
    const parts = deliveryAddress.split(' - ');
    if (parts.length > 0) {
      siteName = parts[0].trim();
    }
  }

  // Format date
  const createdDate = new Date(request.created_at);
  const formattedDate = `${createdDate.getFullYear()}/${String(createdDate.getMonth() + 1).padStart(2, '0')}/${String(createdDate.getDate()).padStart(2, '0')} ${String(createdDate.getHours()).padStart(2, '0')}:${String(createdDate.getMinutes()).padStart(2, '0')}`;

  // Sheet 1: 叫料單 (Request Sheet)
  const requestData = [
    [companyName, '', '', '', '', '', '', ''],
    [`統編：${companyTaxId}`, '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['叫料單號', request.request_number, '', '', '', '', '', ''],
    ['建立日期', formattedDate, '', '', '', '', '', ''],
    ['申請人', request.user_name || '', '', '', '', '', '', ''],
    ['聯繫電話', contactPhone, '', '', '', '', '', ''],
    ['送貨地址', deliveryAddress || '', '', '', '', '', '', ''],
    ['狀態', request.status, '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['工區', '施工類別', '材料類別', '材料名稱', '材料規格', '單位', '數量', '備註']
  ];

  // Add material items
  for (const item of request.items) {
    // Get material specification if available
    let materialSpec = '';
    try {
      const materialResult = await query(
        'SELECT specification FROM materials WHERE id = $1',
        [item.material_id]
      );
      if (materialResult.rows.length > 0 && materialResult.rows[0].specification) {
        materialSpec = materialResult.rows[0].specification;
      }
    } catch (error) {
      // Ignore error, use empty spec
    }

    requestData.push([
      siteName || '', // 工區
      request.construction_category_name || '', // 施工類別
      item.material_category_name || '', // 材料類別
      item.material_name || '', // 材料名稱
      materialSpec, // 材料規格
      item.unit || item.material_unit || '', // 單位
      item.quantity, // 數量
      item.notes || '' // 備註
    ]);
  }

  const requestSheet = XLSX.utils.aoa_to_sheet(requestData);
  XLSX.utils.book_append_sheet(workbook, requestSheet, '叫料單');

  // Sheet 2: 月統計 (Monthly Statistics)
  const currentMonth = createdDate.getMonth() + 1;
  const currentYear = createdDate.getFullYear();
  const monthStart = new Date(currentYear, currentMonth - 1, 1);
  const monthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  let monthlyStats: any[] = [];
  try {
    // Query all materials from requests in the current month for this user
    const statsResult = await query(
      `SELECT 
        mc.name as material_category_name,
        m.name as material_name,
        m.specification,
        SUM(mri.quantity) as total_quantity,
        COALESCE(mri.unit, m.unit) as unit
      FROM material_request_items mri
      INNER JOIN material_requests mr ON mri.request_id = mr.id
      INNER JOIN materials m ON mri.material_id = m.id
      LEFT JOIN material_categories mc ON m.material_category_id = mc.id
      WHERE mr.user_id = $1 
        AND mr.created_at >= $2 
        AND mr.created_at <= $3
      GROUP BY mc.name, m.name, m.specification, COALESCE(mri.unit, m.unit)
      ORDER BY mc.name, m.name`,
      [request.user_id, monthStart, monthEnd]
    );

    monthlyStats = statsResult.rows;
  } catch (error) {
    console.warn('取得月統計失敗:', error);
  }

  const monthlyData = [
    ['月統計', '', '', '', ''],
    ['統計月份', `${currentYear}年${currentMonth}月`, '', '', ''],
    ['', '', '', '', ''],
    ['材料類別', '材料名稱', '材料規格', '總數量', '單位']
  ];

  for (const stat of monthlyStats) {
    monthlyData.push([
      stat.material_category_name || '',
      stat.material_name || '',
      stat.specification || '',
      stat.total_quantity || 0,
      stat.unit || ''
    ]);
  }

  const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
  XLSX.utils.book_append_sheet(workbook, monthlySheet, '月統計');

  // Sheet 3: 圖片連結 (Images/Links) - Create empty sheet for now
  const imagesData = [
    ['圖片連結', '', '', ''],
    ['', '', '', ''],
    ['說明', '如果有上傳圖片或連結，將顯示在此處', '', ''],
    ['', '', '', ''],
    ['類型', '名稱', '連結', '備註']
  ];

  // TODO: Add image/link data when feature is implemented
  // For now, just create empty structure

  const imagesSheet = XLSX.utils.aoa_to_sheet(imagesData);
  XLSX.utils.book_append_sheet(workbook, imagesSheet, '圖片連結');

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

// Upload to Google Drive
export async function uploadToCloud(buffer: Buffer, filename: string): Promise<{ fileId: string; url: string }> {
  try {
    if (!process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
      throw new Error('Google Drive 未配置');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileMetadata = {
      name: filename,
      parents: [] // 可以指定資料夾ID
    };

    const media = {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      body: buffer
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });

    // Make file publicly accessible (optional)
    if (response.data.id) {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });
    }

    return {
      fileId: response.data.id || '',
      url: response.data.webViewLink || ''
    };
  } catch (error) {
    console.error('上傳雲端失敗:', error);
    // 如果雲端上傳失敗，返回本地URL
    return {
      fileId: '',
      url: `/api/files/${filename}`
    };
  }
}

// Send email
export async function sendEmail(options: {
  to: string;
  subject: string;
  request: any;
  excelBuffer?: Buffer;
}): Promise<void> {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.warn('郵件服務未配置');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    let html = `
      <h2>叫料單已建立</h2>
      <p><strong>叫料單號：</strong>${options.request.request_number}</p>
      <p><strong>建立日期：</strong>${new Date(options.request.created_at).toLocaleString('zh-TW')}</p>
      <p><strong>施工類別：</strong>${options.request.construction_category_name}</p>
      ${options.request.notes ? `<p><strong>備註：</strong>${options.request.notes}</p>` : ''}
      
      <h3>材料明細</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <th>材料類別</th>
          <th>材料名稱</th>
          <th>數量</th>
          <th>單位</th>
        </tr>
    `;

    for (const item of options.request.items) {
      html += `
        <tr>
          <td>${item.material_category_name || ''}</td>
          <td>${item.material_name || ''}</td>
          <td>${item.quantity}</td>
          <td>${item.unit || item.material_unit || ''}</td>
        </tr>
      `;
    }

    html += '</table>';

    const mailOptions: any = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: html
    };

    if (options.excelBuffer) {
      mailOptions.attachments = [{
        filename: `${options.request.request_number}.xlsx`,
        content: options.excelBuffer
      }];
    }

    await transporter.sendMail(mailOptions);
    console.log('郵件發送成功:', options.to);
  } catch (error) {
    console.error('發送郵件失敗:', error);
    throw error;
  }
}

// Send LINE Notify
export async function sendLineNotify(options: {
  token: string;
  message: string;
  request: any;
}): Promise<void> {
  try {
    let message = `${options.message}\n`;
    message += `叫料單號：${options.request.request_number}\n`;
    message += `施工類別：${options.request.construction_category_name}\n`;
    message += `建立日期：${new Date(options.request.created_at).toLocaleString('zh-TW')}\n\n`;
    message += '材料明細：\n';

    for (const item of options.request.items) {
      message += `- ${item.material_category_name || ''} | ${item.material_name || ''} | 數量：${item.quantity} ${item.unit || item.material_unit || ''}\n`;
    }

    if (options.request.notes) {
      message += `\n備註：${options.request.notes}`;
    }

    await axios.post(
      'https://notify-api.line.me/api/notify',
      `message=${encodeURIComponent(message)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${options.token}`
        }
      }
    );

    console.log('LINE通知發送成功');
  } catch (error) {
    console.error('發送LINE通知失敗:', error);
    throw error;
  }
}

