import express, { Response } from 'express';
import XLSX from 'xlsx';
import { query } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { generateExcel, uploadToCloud, sendEmail, sendLineNotify } from '../services/notifications';
import { v4 as uuidv4 } from 'uuid';

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

// Create material request
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { construction_category_id, items, notes, company_id } = req.body;

    if (!construction_category_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: '施工類別和材料項目必填' });
    }

    // Handle company_id - if it's from environment variable (starts with "env_"), don't save to DB
    // but we'll use it in Excel generation
    let dbCompanyId = null;
    let envCompanyInfo = null;
    
    if (company_id) {
      if (typeof company_id === 'string' && company_id.startsWith('env_')) {
        // This is an environment variable company, extract info from COMPANIES
        const envIndex = parseInt(company_id.replace('env_', ''));
        if (process.env.COMPANIES) {
          try {
            const companiesData = JSON.parse(process.env.COMPANIES);
            const companiesArray = Array.isArray(companiesData) ? companiesData : [companiesData];
            if (companiesArray[envIndex]) {
              envCompanyInfo = {
                name: companiesArray[envIndex].name || companiesArray[envIndex].company_name || '',
                tax_id: companiesArray[envIndex].tax_id || companiesArray[envIndex].company_tax_id || ''
              };
            }
          } catch (error) {
            console.warn('無法解析環境變數公司資訊:', error);
          }
        }
        // Don't save env company ID to database
        dbCompanyId = null;
      } else {
        // This is a database company
        dbCompanyId = company_id;
      }
    }

    // Generate request number
    const requestNumber = `MR-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Get database client for transaction
    const { getClient } = await import('../db/connection');
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Create request
      const requestResult = await client.query(
        `INSERT INTO material_requests 
         (user_id, company_id, request_number, construction_category_id, notes, status)
         VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
        [req.user?.id, dbCompanyId, requestNumber, construction_category_id, notes || null]
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
      
      // If environment variable company was selected, override company info
      if (envCompanyInfo) {
        fullRequest.company_name = envCompanyInfo.name;
        fullRequest.company_tax_id = envCompanyInfo.tax_id;
      }

      // Generate Excel
      const excelBuffer = await generateExcel(fullRequest);

      // Generate filename: 工區＋叫料單＋時間＿（工程類別）
      // 例如：三總-叫料單-20251201_(消防電).xlsx
      const generateFilename = (request: any): string => {
        const createdDate = new Date(request.created_at);
        const dateStr = `${createdDate.getFullYear()}${String(createdDate.getMonth() + 1).padStart(2, '0')}${String(createdDate.getDate()).padStart(2, '0')}`;
        
        // 從送貨地址提取工區名稱
        let siteName = '叫料單';
        if (fullRequest.delivery_address) {
          const parts = fullRequest.delivery_address.split(' - ');
          if (parts.length > 0) {
            siteName = parts[0].trim();
          }
        }
        
        // 使用施工類別
        const category = request.construction_category_name || '工程';
        
        // 格式：工區-叫料單-日期_(類別).xlsx
        return `${siteName}-叫料單-${dateStr}_(${category}).xlsx`;
      };
      
      const filename = generateFilename(fullRequest);

      // Upload to cloud
      let cloudFileId = null;
      let excelFileUrl = null;
      try {
        const cloudResult = await uploadToCloud(excelBuffer, filename);
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
          filename
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

    const fullRequest = await getFullRequest(parseInt(id));

    if (!fullRequest || fullRequest.user_id !== req.user?.id) {
      return res.status(404).json({ error: '找不到叫料單' });
    }

    const excelBuffer = await generateExcel(fullRequest);

    // Generate filename: 工區＋叫料單＋時間＿（工程類別）
    const createdDate = new Date(fullRequest.created_at);
    const dateStr = `${createdDate.getFullYear()}${String(createdDate.getMonth() + 1).padStart(2, '0')}${String(createdDate.getDate()).padStart(2, '0')}`;
    
    // 從送貨地址提取工區名稱
    let siteName = '叫料單';
    try {
      const addressResult = await query(
        'SELECT address FROM addresses WHERE user_id = $1 AND is_default = true LIMIT 1',
        [fullRequest.user_id]
      );
      if (addressResult.rows.length > 0 && addressResult.rows[0].address) {
        const parts = addressResult.rows[0].address.split(' - ');
        if (parts.length > 0) {
          siteName = parts[0].trim();
        }
      }
    } catch (error) {
      console.warn('取得工區名稱失敗:', error);
    }
    
    const category = fullRequest.construction_category_name || '工程';
    const filename = `${siteName}-叫料單-${dateStr}_(${category}).xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.send(excelBuffer);
  } catch (error) {
    console.error('產生Excel錯誤:', error);
    res.status(500).json({ error: '產生Excel失敗' });
  }
});

// Helper function to get full request with items
async function getFullRequest(requestId: number) {
  const requestResult = await query(
    `SELECT 
      mr.*,
      cc.name as construction_category_name,
      u.name as user_name,
      u.email as user_email,
      c.name as company_name,
      c.tax_id as company_tax_id
    FROM material_requests mr
    LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
    LEFT JOIN users u ON mr.user_id = u.id
    LEFT JOIN companies c ON mr.company_id = c.id
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

