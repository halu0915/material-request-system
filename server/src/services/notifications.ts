import XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { google } from 'googleapis';
import { query } from '../db/connection';

// Generate Excel file
export async function generateExcel(request: any): Promise<Buffer> {
  const workbook = XLSX.utils.book_new();

  // Get company info from request or environment
  let companyName = '';
  let companyTaxId = '';
  
  // 優先使用選擇的公司資訊
  if (request.company_name && request.company_tax_id) {
    companyName = request.company_name;
    companyTaxId = request.company_tax_id;
  } else {
    // 如果沒有選擇公司，使用環境變數 COMPANY_NAME
    companyName = process.env.COMPANY_NAME || '金鴻空調機電工程有限公司';
    companyTaxId = process.env.COMPANY_TAX_ID || '16272724';
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

  // Format date - 格式: YYYYMMDD HHMM
  const createdDate = new Date(request.created_at);
  const dateTimeStr = `${createdDate.getFullYear()}${String(createdDate.getMonth() + 1).padStart(2, '0')}${String(createdDate.getDate()).padStart(2, '0')} ${String(createdDate.getHours()).padStart(2, '0')}${String(createdDate.getMinutes()).padStart(2, '0')}`;

  // Helper function to convert any value to string
  const toString = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Sheet 1: 叫料單 - 必須遵循12欄位順序
  // 1. 編號, 2. 訂單代碼, 3. 日期時間, 4. 聯絡電話, 5. 備註, 6. 狀態, 
  // 7. 數量, 8. 型號/規格, 9. 單位, 10. 單價, 11. 類別, 12. 其他資訊
  const requestData = [
    ['編號', '訂單代碼', '日期時間', '聯絡電話', '備註', '狀態', '數量', '型號/規格', '單位', '單價', '類別', '其他資訊']
  ];

  // Add material items - 每個材料項目一行
  for (const item of request.items) {
    // Get material specification if available
    let materialSpec = '';
    let materialPrice = ''; // 單價，目前數據庫中沒有此欄位，使用空字串
    try {
      const materialResult = await query(
        'SELECT specification FROM materials WHERE id = $1',
        [item.material_id]
      );
      if (materialResult.rows.length > 0) {
        materialSpec = toString(materialResult.rows[0].specification || '');
      }
    } catch (error) {
      // Ignore error, use empty values
    }

    // 按照12欄位順序排列，所有值轉換為字串
    requestData.push([
      toString(companyTaxId),                    // 1. 編號 (公司統編)
      toString(request.request_number),          // 2. 訂單代碼 (叫料單號)
      toString(dateTimeStr),                     // 3. 日期時間
      toString(contactPhone),                    // 4. 聯絡電話
      toString(request.notes || item.notes || ''), // 5. 備註
      toString(request.status),                  // 6. 狀態
      toString(item.quantity),                  // 7. 數量 (轉為字串)
      toString(materialSpec),                   // 8. 型號/規格
      toString(item.unit || item.material_unit || ''), // 9. 單位 (轉為字串)
      toString(materialPrice),                  // 10. 單價 (轉為字串)
      toString(item.material_category_name || ''), // 11. 類別 (材料類別)
      toString(siteName || '')                  // 12. 其他資訊 (工區)
    ]);
  }

  const requestSheet = XLSX.utils.aoa_to_sheet(requestData);
  XLSX.utils.book_append_sheet(workbook, requestSheet, '叫料單');

  // Sheet 2: 月份統計 - 格式: YYYYMM (如 202511)
  const currentMonth = createdDate.getMonth() + 1;
  const currentYear = createdDate.getFullYear();
  const monthKey = `${currentYear}${String(currentMonth).padStart(2, '0')}`; // 如 "202511"
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
        COALESCE(mri.unit, m.unit) as unit,
        mr.status
      FROM material_request_items mri
      INNER JOIN material_requests mr ON mri.request_id = mr.id
      INNER JOIN materials m ON mri.material_id = m.id
      LEFT JOIN material_categories mc ON m.material_category_id = mc.id
      WHERE mr.user_id = $1 
        AND mr.created_at >= $2 
        AND mr.created_at <= $3
      GROUP BY mc.name, m.name, m.specification, COALESCE(mri.unit, m.unit), mr.status
      ORDER BY mc.name, m.name`,
      [request.user_id, monthStart, monthEnd]
    );

    monthlyStats = statsResult.rows;
  } catch (error) {
    console.warn('取得月統計失敗:', error);
  }

  // 月份統計格式：日期, 分類, 數量, 狀態
  const monthlyData = [
    ['日期', '分類', '數量', '狀態']
  ];

  for (const stat of monthlyStats) {
    monthlyData.push([
      toString(monthKey),                        // 日期 (YYYYMM)
      toString(stat.material_category_name || stat.material_name || ''), // 分類
      toString(stat.total_quantity || 0),       // 數量 (轉為字串)
      toString(stat.status || '')                // 狀態
    ]);
  }

  const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
  XLSX.utils.book_append_sheet(workbook, monthlySheet, monthKey);

  // 根據新格式規範，只需要兩個分頁：叫料單和月份統計
  // 不再需要圖片連結分頁

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

