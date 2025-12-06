import express, { Response } from 'express';
import { query } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all companies for current user (including environment variable companies)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Get user's custom companies from database
    const dbResult = await query(
      'SELECT *, false as is_from_env FROM companies WHERE user_id = $1 ORDER BY is_default DESC, name ASC',
      [req.user?.id]
    );
    
    // Get companies from environment variable
    const envCompanies: any[] = [];
    if (process.env.COMPANIES) {
      try {
        // COMPANIES 可能是 JSON 格式的數組
        const companiesData = JSON.parse(process.env.COMPANIES);
        if (Array.isArray(companiesData)) {
          companiesData.forEach((company: any, index: number) => {
            envCompanies.push({
              id: `env_${index}`, // 使用特殊 ID 標記來自環境變數
              name: company.name || company.company_name || '',
              tax_id: company.tax_id || company.company_tax_id || '',
              is_default: company.is_default || false,
              is_from_env: true, // 標記為環境變數公司
              user_id: null,
              created_at: null,
              updated_at: null
            });
          });
        } else if (typeof companiesData === 'object') {
          // 如果是單一公司對象
          envCompanies.push({
            id: 'env_0',
            name: companiesData.name || companiesData.company_name || '',
            tax_id: companiesData.tax_id || companiesData.company_tax_id || '',
            is_default: companiesData.is_default || false,
            is_from_env: true,
            user_id: null,
            created_at: null,
            updated_at: null
          });
        }
      } catch (error) {
        console.warn('無法解析 COMPANIES 環境變數:', error);
      }
    }
    
    // 合併環境變數公司和數據庫公司
    // 環境變數公司優先顯示
    const allCompanies = [...envCompanies, ...dbResult.rows];
    
    res.json({ companies: allCompanies });
  } catch (error: any) {
    console.error('取得公司列表錯誤:', error);
    res.status(500).json({ error: '取得公司列表失敗' });
  }
});

// Get single company
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM companies WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到公司' });
    }

    res.json({ company: result.rows[0] });
  } catch (error: any) {
    console.error('取得公司錯誤:', error);
    res.status(500).json({ error: '取得公司失敗' });
  }
});

// Create company
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, tax_id, is_default } = req.body;

    if (!name) {
      return res.status(400).json({ error: '公司名稱必填' });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await query('UPDATE companies SET is_default = FALSE WHERE user_id = $1', [req.user?.id]);
    }

    const result = await query(
      `INSERT INTO companies (user_id, name, tax_id, is_default)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user?.id, name, tax_id || null, is_default || false]
    );

    res.status(201).json({ company: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: '公司名稱已存在' });
    }
    console.error('建立公司錯誤:', error);
    res.status(500).json({ error: '建立公司失敗' });
  }
});

// Update company
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // 檢查是否為環境變數公司（ID 以 env_ 開頭）
    if (id.startsWith('env_')) {
      return res.status(403).json({ error: '環境變數中的公司不可修改' });
    }
    
    const { name, tax_id, is_default } = req.body;

    if (!name) {
      return res.status(400).json({ error: '公司名稱必填' });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await query('UPDATE companies SET is_default = FALSE WHERE user_id = $1 AND id != $2', [req.user?.id, id]);
    }

    const result = await query(
      `UPDATE companies SET 
         name = $1, 
         tax_id = $2, 
         is_default = $3, 
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [name, tax_id || null, is_default || false, id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到公司' });
    }

    res.json({ company: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: '公司名稱已存在' });
    }
    console.error('更新公司錯誤:', error);
    res.status(500).json({ error: '更新公司失敗' });
  }
});

// Delete company
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // 檢查是否為環境變數公司（ID 以 env_ 開頭）
    if (id.startsWith('env_')) {
      return res.status(403).json({ error: '環境變數中的公司不可刪除' });
    }

    const result = await query(
      'DELETE FROM companies WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到公司' });
    }

    res.status(204).send(); // No content
  } catch (error: any) {
    console.error('刪除公司錯誤:', error);
    res.status(500).json({ error: '刪除公司失敗' });
  }
});

export default router;
