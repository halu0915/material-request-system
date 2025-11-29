import XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { google } from 'googleapis';

// Generate Excel file with company header
export async function generateExcel(request: any, companyName?: string, taxId?: string): Promise<Buffer> {
  const workbook = XLSX.utils.book_new();
  
  // Get company info from environment or use defaults
  const company = companyName || process.env.COMPANY_NAME || '公司名稱';
  const taxIdNumber = taxId || process.env.COMPANY_TAX_ID || '統編：00000000';
  const workArea = request.work_area || request.construction_category_name || '';

  // Main data sheet with company header
  const mainData = [
    // Company header
    [company],
    ['統編：' + taxIdNumber],
    [],
    // Request info
    ['叫料單號', request.request_number],
    ['建立日期', new Date(request.created_at).toLocaleString('zh-TW')],
    ['工區', workArea],
    ['施工類別', request.construction_category_name || ''],
    ['狀態', request.status],
    [],
    // Table header
    ['工區', '施工類別', '材料類別', '單位', '數量', '備註']
  ];

  // Add material items
  for (const item of request.items) {
    mainData.push([
      workArea,
      request.construction_category_name || '',
      item.material_category_name || '',
      item.unit || item.material_unit || '',
      item.quantity,
      item.notes || ''
    ]);
  }

  const mainSheet = XLSX.utils.aoa_to_sheet(mainData);

  // Set column widths
  mainSheet['!cols'] = [
    { wch: 15 }, // 工區
    { wch: 15 }, // 施工類別
    { wch: 15 }, // 材料類別
    { wch: 10 }, // 單位
    { wch: 12 }, // 數量
    { wch: 30 }  // 備註
  ];

  // Merge cells for company header
  if (!mainSheet['!merges']) mainSheet['!merges'] = [];
  mainSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }); // Company name
  mainSheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }); // Tax ID

  XLSX.utils.book_append_sheet(workbook, mainSheet, '叫料單');

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

// Generate report Excel (monthly or date range)
export async function generateReportExcel(requests: any[], startDate?: string, endDate?: string, companyName?: string, taxId?: string): Promise<Buffer> {
  const workbook = XLSX.utils.book_new();
  
  const company = companyName || process.env.COMPANY_NAME || '公司名稱';
  const taxIdNumber = taxId || process.env.COMPANY_TAX_ID || '統編：00000000';
  
  // Report header
  const reportData = [
    [company],
    ['統編：' + taxIdNumber],
    [],
    ['報表期間', startDate && endDate ? `${startDate} 至 ${endDate}` : (startDate ? `自 ${startDate}` : '全部資料')],
    ['報表日期', new Date().toLocaleString('zh-TW')],
    [],
    ['叫料單號', '建立日期', '工區', '施工類別', '材料類別', '材料名稱', '單位', '數量', '備註']
  ];

  // Add all request items
  for (const request of requests) {
    const workArea = request.work_area || request.construction_category_name || '';
    
    if (request.items && request.items.length > 0) {
      for (const item of request.items) {
        reportData.push([
          request.request_number,
          new Date(request.created_at).toLocaleDateString('zh-TW'),
          workArea,
          request.construction_category_name || '',
          item.material_category_name || '',
          item.material_name || '',
          item.unit || item.material_unit || '',
          item.quantity,
          item.notes || ''
        ]);
      }
    } else {
      // If no items, still show request info
      reportData.push([
        request.request_number,
        new Date(request.created_at).toLocaleDateString('zh-TW'),
        workArea,
        request.construction_category_name || '',
        '',
        '',
        '',
        '',
        request.notes || ''
      ]);
    }
  }

  const reportSheet = XLSX.utils.aoa_to_sheet(reportData);

  // Set column widths
  reportSheet['!cols'] = [
    { wch: 20 }, // 叫料單號
    { wch: 15 }, // 建立日期
    { wch: 15 }, // 工區
    { wch: 15 }, // 施工類別
    { wch: 15 }, // 材料類別
    { wch: 20 }, // 材料名稱
    { wch: 10 }, // 單位
    { wch: 12 }, // 數量
    { wch: 30 }  // 備註
  ];

  // Merge cells for header
  if (!reportSheet['!merges']) reportSheet['!merges'] = [];
  reportSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }); // Company name
  reportSheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }); // Tax ID

  XLSX.utils.book_append_sheet(workbook, reportSheet, '報表');

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

