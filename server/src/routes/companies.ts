import express, { Response } from 'express';
import { query } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all companies for current user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM companies WHERE user_id = $1 ORDER BY is_default DESC, name ASC',
      [req.user?.id]
    );
    res.json({ companies: result.rows });
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

