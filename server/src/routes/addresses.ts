import express, { Request, Response } from 'express';
import { query } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all addresses
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.user?.id]
    );
    res.json({ addresses: result.rows });
  } catch (error: any) {
    console.error('取得地址列表錯誤:', error);
    res.status(500).json({ error: '取得地址列表失敗' });
  }
});

// Create address
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, contact_person, contact_phone, is_default } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: '名稱和地址必填' });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [req.user?.id]
      );
    }

    const result = await query(
      `INSERT INTO addresses (user_id, name, address, contact_person, contact_phone, is_default)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user?.id, name, address, contact_person || null, contact_phone || null, is_default || false]
    );

    res.status(201).json({ address: result.rows[0] });
  } catch (error: any) {
    console.error('建立地址錯誤:', error);
    res.status(500).json({ error: '建立地址失敗' });
  }
});

// Update address
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, contact_person, contact_phone, is_default } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: '名稱和地址必填' });
    }

    // Check if address belongs to user
    const checkResult = await query(
      'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: '地址不存在' });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2',
        [req.user?.id, id]
      );
    }

    const result = await query(
      `UPDATE addresses 
       SET name = $1, address = $2, contact_person = $3, contact_phone = $4, is_default = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7 RETURNING *`,
      [name, address, contact_person || null, contact_phone || null, is_default || false, id, req.user?.id]
    );

    res.json({ address: result.rows[0] });
  } catch (error: any) {
    console.error('更新地址錯誤:', error);
    res.status(500).json({ error: '更新地址失敗' });
  }
});

// Delete address
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if address belongs to user
    const checkResult = await query(
      'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: '地址不存在' });
    }

    await query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [id, req.user?.id]);

    res.json({ message: '地址已刪除' });
  } catch (error: any) {
    console.error('刪除地址錯誤:', error);
    res.status(500).json({ error: '刪除地址失敗' });
  }
});

export default router;

