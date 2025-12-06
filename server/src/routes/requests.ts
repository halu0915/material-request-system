import express, { Response } from 'express';
import XLSX from 'xlsx';
import { query } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { generateExcel, uploadToCloud, sendEmail, sendLineNotify } from '../services/notifications';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Helper function to extract site name (工區) - 只從地址中提取工區，不包含詳細地址
function extractSiteName(deliveryAddress?: string): string {
  if (!deliveryAddress) return '';
  
  // 優先使用 " - " 分割（空格+破折號+空格）
  const parts = deliveryAddress.split(' - ');
  if (parts.length > 1 && parts[0].trim()) {
    // 如果有 " - "，第一部分就是工區
    return parts[0].trim();
  }
  
  // 如果沒有 " - "，嘗試用 "-" 分割（無空格）
  const parts2 = deliveryAddress.split('-');
  if (parts2.length > 1 && parts2[0].trim()) {
    return parts2[0].trim();
  }
  
  // 如果地址中沒有分隔符，嘗試從地址中提取常見的工區名稱
  const commonSites = ['三總', '金山', '關西', '新竹', '台北', '台中', '高雄'];
  for (const site of commonSites) {
    if (deliveryAddress.includes(site)) {
      return site;
    }
  }
  
  return '';
}

// Helper function to generate filename: 工區＋叫料單＋時間＿（工程類別）
function generateFilename(request: any): string {
  const createdDate = new Date(request.created_at);
  const dateStr = `${createdDate.getFullYear()}${String(createdDate.getMonth() + 1).padStart(2, '0')}${String(createdDate.getDate()).padStart(2, '0')}`;
  
  // 提取工區（只使用工區，不包含地址）
  const siteName = extractSiteName(request.delivery_address);
  
  const categoryName = request.construction_category_name || '未分類';
  const sitePrefix = siteName ? `${siteName}-` : '';
  
  return `${sitePrefix}叫料單-${dateStr}_(${categoryName}).xlsx`;
}

// Get all requests
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT 
        mr.*,
        cc.name as construction_category_name,
        u.name as user_name,
        u.email as user_email,
        c.name as company_name,
        c.tax_id as company_tax_id,
        a.address as delivery_address,
        a.contact_person,
        a.contact_phone,
        COALESCE(SUM(mri.quantity), 0) as total_quantity,
        STRING_AGG(DISTINCT m.name, ', ') as material_names
      FROM material_requests mr
      LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
      LEFT JOIN users u ON mr.user_id = u.id
      LEFT JOIN companies c ON mr.company_id = c.id
      LEFT JOIN addresses a ON mr.address_id = a.id
      LEFT JOIN material_request_items mri ON mr.id = mri.request_id
      LEFT JOIN materials m ON mri.material_id = m.id
      WHERE mr.user_id = $1
      GROUP BY mr.id, cc.name, u.name, u.email, c.name, c.tax_id, a.address, a.contact_person, a.contact_phone
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
        u.email as user_email,
        c.name as company_name,
        c.tax_id as company_tax_id,
        a.address as delivery_address,
        a.contact_person,
        a.contact_phone
      FROM material_requests mr
      LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
      LEFT JOIN users u ON mr.user_id = u.id
      LEFT JOIN companies c ON mr.company_id = c.id
      LEFT JOIN addresses a ON mr.address_id = a.id
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
    const { construction_category_id, items, notes, company_id, address_id } = req.body;

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
         (user_id, company_id, address_id, request_number, construction_category_id, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
        [req.user?.id, dbCompanyId, address_id || null, requestNumber, construction_category_id, notes || null]
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
    const { company_id } = req.query; // 可選的公司 ID 參數

    const fullRequest = await getFullRequest(parseInt(id));

    if (!fullRequest || fullRequest.user_id !== req.user?.id) {
      return res.status(404).json({ error: '找不到叫料單' });
    }

    // 如果提供了 company_id，覆蓋公司資訊
    if (company_id) {
      let selectedCompanyName = '';
      let selectedCompanyTaxId = '';

      const companyIdStr = String(company_id);
      
      if (companyIdStr.startsWith('env_')) {
        // 環境變數公司
        const envIndex = parseInt(companyIdStr.replace('env_', ''));
        if (process.env.COMPANIES) {
          try {
            const companiesData = JSON.parse(process.env.COMPANIES);
            const companiesArray = Array.isArray(companiesData) ? companiesData : [companiesData];
            if (companiesArray[envIndex]) {
              selectedCompanyName = companiesArray[envIndex].name || companiesArray[envIndex].company_name || '';
              selectedCompanyTaxId = companiesArray[envIndex].tax_id || companiesArray[envIndex].company_tax_id || '';
              console.log('從環境變數獲取公司資訊:', { selectedCompanyName, selectedCompanyTaxId, envIndex });
            }
          } catch (error) {
            console.warn('無法解析環境變數公司資訊:', error);
          }
        }
      } else {
        // 數據庫公司
        const companyIdNum = parseInt(companyIdStr);
        if (!isNaN(companyIdNum)) {
          try {
            const companyResult = await query(
              'SELECT name, tax_id FROM companies WHERE id = $1 AND user_id = $2',
              [companyIdNum, req.user?.id]
            );
            if (companyResult.rows.length > 0) {
              selectedCompanyName = companyResult.rows[0].name || '';
              selectedCompanyTaxId = companyResult.rows[0].tax_id || '';
              console.log('從數據庫獲取公司資訊:', { selectedCompanyName, selectedCompanyTaxId, companyIdNum });
            } else {
              console.warn('找不到公司，ID:', companyIdNum, '用戶ID:', req.user?.id);
            }
          } catch (error) {
            console.error('查詢公司資訊失敗:', error);
          }
        } else {
          console.warn('無效的公司 ID:', companyIdStr);
        }
      }

      // 覆蓋公司資訊（只要有公司名稱就覆蓋）
      if (selectedCompanyName) {
        fullRequest.company_name = selectedCompanyName;
        fullRequest.company_tax_id = selectedCompanyTaxId || '';
        // 清除 company_id，確保 generateExcel 使用覆蓋的資訊
        fullRequest.company_id = null;
        console.log('已覆蓋公司資訊:', { company_name: fullRequest.company_name, company_tax_id: fullRequest.company_tax_id });
      } else {
        console.warn('無法獲取公司資訊，company_id:', company_id);
      }
    }

    const excelBuffer = await generateExcel(fullRequest);

    // Generate filename: 工區＋叫料單＋時間＿（工程類別）
    const filename = generateFilename(fullRequest);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.send(excelBuffer);
  } catch (error) {
    console.error('產生Excel錯誤:', error);
    res.status(500).json({ error: '產生Excel失敗' });
  }
});

// Delete material request
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

    // Delete request (cascade will delete items due to ON DELETE CASCADE)
    await query('DELETE FROM material_requests WHERE id = $1 AND user_id = $2', [id, req.user?.id]);

    res.json({ message: '叫料單已刪除' });
  } catch (error: any) {
    console.error('刪除叫料單錯誤:', error);
    res.status(500).json({ error: '刪除叫料單失敗' });
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
      c.tax_id as company_tax_id,
      a.address as delivery_address,
      a.contact_person,
      a.contact_phone
    FROM material_requests mr
    LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
    LEFT JOIN users u ON mr.user_id = u.id
    LEFT JOIN companies c ON mr.company_id = c.id
    LEFT JOIN addresses a ON mr.address_id = a.id
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

