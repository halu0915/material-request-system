import express, { Response } from 'express';
import XLSX from 'xlsx';
import { query } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { generateExcel, generateReportExcel, uploadToCloud, sendEmail, sendLineNotify } from '../services/notifications';

const router = express.Router();

// Get companies from environment variables
// Supports two formats:
// 1. Single company: COMPANY_NAME and COMPANY_TAX_ID
// 2. Multiple companies: COMPANIES (JSON array format)
//    Example: COMPANIES=[{"name":"公司1","tax_id":"12345678"},{"name":"公司2","tax_id":"87654321"}]
router.get('/default-company', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const companiesEnv = process.env.COMPANIES;
    let companies: Array<{ name: string; tax_id: string }> = [];
    
    if (companiesEnv) {
      // Try to parse JSON array format
      try {
        const parsed = JSON.parse(companiesEnv);
        if (Array.isArray(parsed)) {
          companies = parsed.map((c: any) => ({
            name: c.name || c.company_name || '',
            tax_id: c.tax_id || c.taxId || ''
          })).filter((c: any) => c.name && c.tax_id);
        }
      } catch (e) {
        console.warn('無法解析 COMPANIES 環境變數，嘗試使用單一公司格式');
      }
    }
    
    // Fallback to single company format if COMPANIES is not set or empty
    if (companies.length === 0) {
      const companyName = process.env.COMPANY_NAME || '';
      const taxId = process.env.COMPANY_TAX_ID || '';
      if (companyName && taxId) {
        companies = [{ name: companyName, tax_id: taxId }];
      }
    }
    
    res.json({
      companies: companies
    });
  } catch (error) {
    console.error('取得環境變數公司資訊錯誤:', error);
    res.status(500).json({ error: '取得環境變數公司資訊失敗' });
  }
});

// Get all requests
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT 
        mr.*,
        cc.name as construction_category_name,
        u.name as user_name,
        u.email as user_email
      FROM material_requests mr
      LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
      LEFT JOIN users u ON mr.user_id = u.id
      WHERE mr.user_id = $1
      ORDER BY mr.created_at DESC`,
      [req.user?.id]
    );

    // Get material items for each request
    const requestsWithItems = await Promise.all(
      result.rows.map(async (request) => {
        const itemsResult = await query(
          `SELECT 
            mri.*,
            m.name as material_name,
            m.unit as material_unit
          FROM material_request_items mri
          LEFT JOIN materials m ON mri.material_id = m.id
          WHERE mri.request_id = $1
          ORDER BY mri.id ASC
          LIMIT 1`,
          [request.id]
        );

        const firstItem = itemsResult.rows[0];
        return {
          ...request,
          first_material_name: firstItem ? (firstItem.material_name || '-') : '-',
          first_material_quantity: firstItem ? (firstItem.quantity || 0) : 0
        };
      })
    );

    res.json({ requests: requestsWithItems });
  } catch (error) {
    console.error('取得叫料單錯誤:', error);
    res.status(500).json({ error: '取得叫料單失敗' });
  }
});

// Get single request
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const fullRequest = await getFullRequest(parseInt(id));

    if (!fullRequest || fullRequest.user_id !== req.user?.id) {
      return res.status(404).json({ error: '找不到叫料單' });
    }

    res.json({ request: fullRequest, items: fullRequest.items });
  } catch (error) {
    console.error('取得叫料單錯誤:', error);
    res.status(500).json({ error: '取得叫料單失敗' });
  }
});

// Delete request
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if request exists and belongs to user
    const checkResult = await query(
      'SELECT id FROM material_requests WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到叫料單' });
    }

    // Delete request (cascade will delete items)
    await query(
      'DELETE FROM material_requests WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    res.json({ message: '叫料單已刪除' });
  } catch (error) {
    console.error('刪除叫料單錯誤:', error);
    res.status(500).json({ error: '刪除叫料單失敗' });
  }
});


// Generate request number: W00111292005
// Format: W + 序號(3位) + MMDD + YYYY
async function generateRequestNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = month + day; // MMDD format
  
  // Get start and end of current month
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);
  
  // Count existing requests in current month
  const countResult = await query(
    `SELECT COUNT(*) as count 
     FROM material_requests 
     WHERE created_at >= $1 AND created_at <= $2`,
    [startOfMonth, endOfMonth]
  );
  
  const currentCount = parseInt(countResult.rows[0].count || '0');
  const sequence = String(currentCount + 1).padStart(3, '0'); // 001, 002, 003...
  
  return `W${sequence}${dateStr}${year}`;
}

// Create material request
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { construction_category_id, items, notes, work_area, applicant_name, contact_phone, delivery_address_id } = req.body;

    if (!construction_category_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: '施工類別和材料項目必填' });
    }

    // Generate request number: W00111292005
    const requestNumber = await generateRequestNumber();

    // Get database client for transaction
    const { getClient } = await import('../db/connection');
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Create request
      const requestResult = await client.query(
        `INSERT INTO material_requests 
         (user_id, request_number, construction_category_id, notes, status, work_area, applicant_name, contact_phone, delivery_address_id)
         VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8) RETURNING *`,
        [
          req.user?.id, 
          requestNumber, 
          construction_category_id, 
          notes || null, 
          work_area || null,
          applicant_name || null,
          contact_phone || null,
          delivery_address_id || null
        ]
      );

      const request = requestResult.rows[0];

      // Create request items
      for (const item of items) {
        await client.query(
          `INSERT INTO material_request_items 
           (request_id, material_id, quantity, unit, notes, image_url, link_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            request.id,
            item.material_id,
            item.quantity,
            item.unit || null,
            item.notes || null,
            item.image_url || null,
            item.link_url || null
          ]
        );
      }

      await client.query('COMMIT');
      client.release();

      // Get full request data
      const fullRequest = await getFullRequest(request.id);

      // Get all requests from the same month up to and including current request creation time
      const requestDate = new Date(fullRequest.created_at);
      const year = requestDate.getFullYear();
      const month = requestDate.getMonth() + 1;
      const startOfMonth = new Date(year, month - 1, 1);
      // Use current request's created_at as the end time (inclusive)
      const currentRequestTime = new Date(fullRequest.created_at);
      
      const monthlyRequestsResult = await query(
        `SELECT id FROM material_requests 
         WHERE user_id = $1 
           AND created_at >= $2 
           AND created_at <= $3
         ORDER BY created_at`,
        [req.user?.id, startOfMonth, currentRequestTime]
      );
      
      const monthlyRequests = [];
      for (const req of monthlyRequestsResult.rows) {
        const fullReq = await getFullRequest(req.id);
        if (fullReq) monthlyRequests.push(fullReq);
      }

      // Generate Excel with monthly statistics
      const excelBuffer = await generateExcel(fullRequest, undefined, undefined, monthlyRequests);

      // Generate filename using helper function
      const excelFilename = generateExcelFilename(fullRequest);

      // Upload to cloud
      let cloudFileId = null;
      let excelFileUrl = null;
      try {
        const cloudResult = await uploadToCloud(excelBuffer, excelFilename);
        cloudFileId = cloudResult.fileId;
        excelFileUrl = cloudResult.url;

        // Update request with file info
        await query(
          'UPDATE material_requests SET excel_file_url = $1, cloud_file_id = $2 WHERE id = $3',
          [excelFileUrl, cloudFileId, request.id]
        );
      } catch (error) {
        console.error('上傳雲端失敗:', error);
      }

      // Send email to configured recipients
      try {
        // Get recipients from environment variable (comma-separated emails)
        // Format: PURCHASE_EMAIL_RECIPIENTS=email1@example.com,email2@example.com,email3@example.com
        const recipientsEnv = process.env.PURCHASE_EMAIL_RECIPIENTS;
        let recipients: string[] = [];
        
        if (recipientsEnv) {
          // Parse comma-separated emails
          recipients = recipientsEnv.split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);
        }
        
        // If no recipients configured, send to the user who created the request
        if (recipients.length === 0) {
          const userResult = await query(
            'SELECT email, name FROM users WHERE id = $1',
            [req.user?.id]
          );
          if (userResult.rows.length > 0) {
            recipients = [userResult.rows[0].email];
          }
        }

        if (recipients.length > 0) {
          // Send email with Excel attachment only
          await sendEmail({
            to: recipients,
            request: fullRequest,
            excelBuffer,
            filename: excelFilename
          });

          await query(
            'UPDATE material_requests SET email_sent = true WHERE id = $1',
            [request.id]
          );
          
          console.log(`郵件已發送給 ${recipients.length} 位收件人:`, recipients.join(', '));
        } else {
          console.warn('未設定郵件收件人，跳過郵件發送');
        }
      } catch (error) {
        console.error('發送郵件失敗:', error);
      }

      // Send LINE notification
      try {
        const lineTokenResult = await query(
          'SELECT access_token FROM user_line_tokens WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
          [req.user?.id]
        );

        if (lineTokenResult.rows.length > 0) {
          await sendLineNotify({
            token: lineTokenResult.rows[0].access_token,
            message: `叫料單 ${requestNumber} 已建立`,
            request: fullRequest
          });

          await query(
            'UPDATE material_requests SET line_notified = true WHERE id = $1',
            [request.id]
          );
        }
      } catch (error) {
        console.error('發送LINE通知失敗:', error);
      }

      res.status(201).json({
        message: '叫料單建立成功',
        request: fullRequest
      });
    } catch (error) {
      await client.query('ROLLBACK');
      client.release();
      throw error;
    }
  } catch (error: any) {
    console.error('建立叫料單錯誤:', error);
    res.status(500).json({ error: '建立叫料單失敗' });
  }
});

// Send email for request manually
router.post('/:id/send-email', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { company_name, tax_id } = req.query;

    const fullRequest = await getFullRequest(parseInt(id));

    if (!fullRequest || fullRequest.user_id !== req.user?.id) {
      return res.status(404).json({ error: '找不到叫料單' });
    }

    // Get all requests from the same month up to and including current request creation time
    const requestDate = new Date(fullRequest.created_at);
    const year = requestDate.getFullYear();
    const month = requestDate.getMonth() + 1;
    const startOfMonth = new Date(year, month - 1, 1);
    // Use current request's created_at as the end time (inclusive)
    const currentRequestTime = new Date(fullRequest.created_at);
    
    const monthlyRequestsResult = await query(
      `SELECT id FROM material_requests 
       WHERE user_id = $1 
         AND created_at >= $2 
         AND created_at <= $3
       ORDER BY created_at`,
      [req.user?.id, startOfMonth, currentRequestTime]
    );
    
    const monthlyRequests = [];
    for (const req of monthlyRequestsResult.rows) {
      const fullReq = await getFullRequest(req.id);
      if (fullReq) monthlyRequests.push(fullReq);
    }

    // Generate Excel buffer with monthly statistics
    const excelBuffer = await generateExcel(
      fullRequest,
      company_name as string,
      tax_id as string,
      monthlyRequests
    );

    // Generate filename using helper function
    const excelFilename = generateExcelFilename(fullRequest);

    // Get recipients from environment variable
    const recipientsEnv = process.env.PURCHASE_EMAIL_RECIPIENTS;
    let recipients: string[] = [];
    
    if (recipientsEnv) {
      recipients = recipientsEnv.split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
    }
    
    // If no recipients configured, send to the user who created the request
    if (recipients.length === 0) {
      const userResult = await query(
        'SELECT email, name FROM users WHERE id = $1',
        [req.user?.id]
      );
      if (userResult.rows.length > 0) {
        recipients = [userResult.rows[0].email];
      }
    }

    if (recipients.length === 0) {
      return res.status(400).json({ error: '未設定郵件收件人' });
    }

    // Send email with Excel attachment only
    try {
      await sendEmail({
        to: recipients,
        request: fullRequest,
        excelBuffer,
        filename: excelFilename
      });

      // Update email_sent status
      await query(
        'UPDATE material_requests SET email_sent = true WHERE id = $1',
        [parseInt(id)]
      );

      res.json({
        message: `郵件已發送給 ${recipients.length} 位收件人`,
        recipients: recipients
      });
    } catch (emailError: any) {
      console.error('發送郵件錯誤:', emailError);
      // Don't update email_sent status if sending failed
      const errorMessage = emailError.message || '請檢查 SMTP 設定和環境變數';
      console.error('錯誤詳情:', {
        message: errorMessage,
        code: emailError.code || 'UNKNOWN',
        command: emailError.command || '無',
        response: emailError.response || '無'
      });
      res.status(500).json({ 
        error: '發送郵件失敗',
        details: errorMessage,
        hint: '請確認已設定 SMTP_HOST, SMTP_USER, SMTP_PASS 環境變數'
      });
      return;
    }
  } catch (error) {
    console.error('處理請求錯誤:', error);
    res.status(500).json({ error: '處理請求失敗' });
  }
});

// Download Excel for request
router.get('/:id/excel', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { company_name, tax_id } = req.query;

    const fullRequest = await getFullRequest(parseInt(id));

    if (!fullRequest || fullRequest.user_id !== req.user?.id) {
      return res.status(404).json({ error: '找不到叫料單' });
    }

    // Get all requests from the same month up to and including current request creation time
    const requestDate = new Date(fullRequest.created_at);
    const year = requestDate.getFullYear();
    const month = requestDate.getMonth() + 1;
    const startOfMonth = new Date(year, month - 1, 1);
    // Use current request's created_at as the end time (inclusive)
    const currentRequestTime = new Date(fullRequest.created_at);
    
    const monthlyRequestsResult = await query(
      `SELECT id FROM material_requests 
       WHERE user_id = $1 
         AND created_at >= $2 
         AND created_at <= $3
       ORDER BY created_at`,
      [req.user?.id, startOfMonth, currentRequestTime]
    );
    
    const monthlyRequests = [];
    for (const req of monthlyRequestsResult.rows) {
      const fullReq = await getFullRequest(req.id);
      if (fullReq) monthlyRequests.push(fullReq);
    }

    const excelBuffer = await generateExcel(
      fullRequest,
      company_name as string,
      tax_id as string,
      monthlyRequests
    );

    // Generate filename using helper function
    const filename = generateExcelFilename(fullRequest);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.send(excelBuffer);
  } catch (error) {
    console.error('產生Excel錯誤:', error);
    res.status(500).json({ error: '產生Excel失敗' });
  }
});

// Generate monthly report
router.get('/reports/monthly/:year/:month', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { year, month } = req.params;
    const { company_name, tax_id } = req.query;

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    const result = await query(
      `SELECT 
        mr.*,
        cc.name as construction_category_name,
        u.name as user_name,
        u.email as user_email
      FROM material_requests mr
      LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
      LEFT JOIN users u ON mr.user_id = u.id
      WHERE mr.user_id = $1 
        AND mr.created_at >= $2 
        AND mr.created_at <= $3
      ORDER BY mr.created_at DESC`,
      [req.user?.id, startDate, endDate]
    );

    const requests = [];
    for (const request of result.rows) {
      const fullRequest = await getFullRequest(request.id);
      if (fullRequest) requests.push(fullRequest);
    }

    const excelBuffer = await generateReportExcel(
      requests,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
      company_name as string,
      tax_id as string
    );

    const filename = `叫料單月報表_${year}年${month}月.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.send(excelBuffer);
  } catch (error) {
    console.error('產生月報表錯誤:', error);
    res.status(500).json({ error: '產生月報表失敗' });
  }
});

// Generate date range report
router.get('/reports/range', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { start_date, end_date, company_name, tax_id } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ error: '請提供開始日期和結束日期' });
    }

    const startDate = new Date(start_date as string);
    const endDate = new Date(end_date as string);
    endDate.setHours(23, 59, 59, 999);

    const result = await query(
      `SELECT 
        mr.*,
        cc.name as construction_category_name,
        u.name as user_name,
        u.email as user_email
      FROM material_requests mr
      LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
      LEFT JOIN users u ON mr.user_id = u.id
      WHERE mr.user_id = $1 
        AND mr.created_at >= $2 
        AND mr.created_at <= $3
      ORDER BY mr.created_at DESC`,
      [req.user?.id, startDate, endDate]
    );

    const requests = [];
    for (const request of result.rows) {
      const fullRequest = await getFullRequest(request.id);
      if (fullRequest) requests.push(fullRequest);
    }

    const excelBuffer = await generateReportExcel(
      requests,
      start_date as string,
      end_date as string,
      company_name as string,
      tax_id as string
    );

    const filename = `叫料單報表_${start_date}_${end_date}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.send(excelBuffer);
  } catch (error) {
    console.error('產生時間區間報表錯誤:', error);
    res.status(500).json({ error: '產生報表失敗' });
  }
});

// Helper function to generate Excel filename
function generateExcelFilename(request: any): string {
  const workArea = request.work_area || '未指定工區';
  const requestDate = new Date(request.created_at);
  const dateStr = `${requestDate.getFullYear()}${String(requestDate.getMonth() + 1).padStart(2, '0')}${String(requestDate.getDate()).padStart(2, '0')}`;
  const constructionCategoryName = request.construction_category_name || '未指定';
  return `${workArea}叫料單_${dateStr}_(${constructionCategoryName}).xlsx`;
}

// Helper function to get full request with items
async function getFullRequest(requestId: number) {
  const requestResult = await query(
    `SELECT 
      mr.*,
      cc.name as construction_category_name,
      u.name as user_name,
      u.email as user_email,
      da.name as delivery_address_name,
      da.address as delivery_address,
      da.contact_person as delivery_contact_person,
      da.contact_phone as delivery_contact_phone
    FROM material_requests mr
    LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
    LEFT JOIN users u ON mr.user_id = u.id
    LEFT JOIN delivery_addresses da ON mr.delivery_address_id = da.id
    WHERE mr.id = $1`,
    [requestId]
  );

  if (requestResult.rows.length === 0) {
    return null;
  }

  const request = requestResult.rows[0];

  const itemsResult = await query(
    `SELECT 
      mri.*,
      m.name as material_name,
      m.specification as material_specification,
      m.unit as material_unit,
      mc.name as material_category_name
    FROM material_request_items mri
    LEFT JOIN materials m ON mri.material_id = m.id
    LEFT JOIN material_categories mc ON m.material_category_id = mc.id
    WHERE mri.request_id = $1
    ORDER BY mc.name, m.name`,
    [requestId]
  );

  return {
    ...request,
    items: itemsResult.rows
  };
}

export default router;

