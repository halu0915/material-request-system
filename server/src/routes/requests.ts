import express, { Response } from 'express';
import XLSX from 'xlsx';
import { query } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { generateExcel, generateReportExcel, uploadToCloud, sendEmail, sendLineNotify } from '../services/notifications';

const router = express.Router();

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

    res.json({ requests: result.rows });
  } catch (error) {
    console.error('取得叫料單錯誤:', error);
    res.status(500).json({ error: '取得叫料單失敗' });
  }
});

// Get single request
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Get request
    const requestResult = await query(
      `SELECT 
        mr.*,
        cc.name as construction_category_name,
        u.name as user_name,
        u.email as user_email
      FROM material_requests mr
      LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
      LEFT JOIN users u ON mr.user_id = u.id
      WHERE mr.id = $1 AND mr.user_id = $2`,
      [id, req.user?.id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到叫料單' });
    }

    // Get request items
    const itemsResult = await query(
      `SELECT 
        mri.*,
        m.name as material_name,
        m.unit as material_unit,
        mc.name as material_category_name
      FROM material_request_items mri
      LEFT JOIN materials m ON mri.material_id = m.id
      LEFT JOIN material_categories mc ON m.material_category_id = mc.id
      WHERE mri.request_id = $1
      ORDER BY mc.name, m.name`,
      [id]
    );

    res.json({
      request: requestResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('取得叫料單錯誤:', error);
    res.status(500).json({ error: '取得叫料單失敗' });
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
    const { construction_category_id, items, notes, work_area } = req.body;

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
         (user_id, request_number, construction_category_id, notes, status, work_area)
         VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING *`,
        [req.user?.id, requestNumber, construction_category_id, notes || null, work_area || null]
      );

      const request = requestResult.rows[0];

      // Create request items
      for (const item of items) {
        await client.query(
          `INSERT INTO material_request_items 
           (request_id, material_id, quantity, unit, notes)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            request.id,
            item.material_id,
            item.quantity,
            item.unit || null,
            item.notes || null
          ]
        );
      }

      await client.query('COMMIT');
      client.release();

      // Get full request data
      const fullRequest = await getFullRequest(request.id);

      // Generate Excel
      const excelBuffer = await generateExcel(fullRequest);

      // Generate filename: 工區+叫料單號+日期
      const workAreaForFile = work_area || '未指定工區';
      const requestDateForFile = new Date(request.created_at);
      const dateStrForFile = `${requestDateForFile.getFullYear()}${String(requestDateForFile.getMonth() + 1).padStart(2, '0')}${String(requestDateForFile.getDate()).padStart(2, '0')}`;
      const excelFilename = `${workAreaForFile}_${requestNumber}_${dateStrForFile}.xlsx`;

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

      // Send email
      try {
        const userResult = await query(
          'SELECT email, name FROM users WHERE id = $1',
          [req.user?.id]
        );
        const user = userResult.rows[0];

        await sendEmail({
          to: user.email,
          subject: `叫料單已建立 - ${requestNumber}`,
          request: fullRequest,
          excelBuffer,
          filename: excelFilename
        });

        await query(
          'UPDATE material_requests SET email_sent = true WHERE id = $1',
          [request.id]
        );
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

// Download Excel for request
router.get('/:id/excel', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { company_name, tax_id } = req.query;

    const fullRequest = await getFullRequest(parseInt(id));

    if (!fullRequest || fullRequest.user_id !== req.user?.id) {
      return res.status(404).json({ error: '找不到叫料單' });
    }

    // Get all requests from the same month for monthly statistics
    const requestDate = new Date(fullRequest.created_at);
    const year = requestDate.getFullYear();
    const month = requestDate.getMonth() + 1;
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    
    const monthlyRequestsResult = await query(
      `SELECT id FROM material_requests 
       WHERE user_id = $1 
         AND created_at >= $2 
         AND created_at <= $3
       ORDER BY created_at`,
      [req.user?.id, startOfMonth, endOfMonth]
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

    // Generate filename: 工區+叫料單號+日期
    const workArea = fullRequest.work_area || '未指定工區';
    const requestDate = new Date(fullRequest.created_at);
    const dateStr = `${requestDate.getFullYear()}${String(requestDate.getMonth() + 1).padStart(2, '0')}${String(requestDate.getDate()).padStart(2, '0')}`;
    const filename = `${workArea}_${fullRequest.request_number}_${dateStr}.xlsx`;

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

// Helper function to get full request with items
async function getFullRequest(requestId: number) {
  const requestResult = await query(
    `SELECT 
      mr.*,
      cc.name as construction_category_name,
      u.name as user_name,
      u.email as user_email
    FROM material_requests mr
    LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
    LEFT JOIN users u ON mr.user_id = u.id
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

