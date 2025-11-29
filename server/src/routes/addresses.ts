import express, { Response } from 'express';
import { query } from '../db/connection';
import { authenticateToken, AuthRequest, getUserId } from '../middleware/auth';

const router = express.Router();

// Get all delivery addresses for current user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: '未授權' });
    }
    const result = await query(
      'SELECT * FROM delivery_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [userId]
    );

    res.json({ addresses: result.rows });
  } catch (error) {
    console.error('取得送貨地址錯誤:', error);
    res.status(500).json({ error: '取得送貨地址失敗' });
  }
});

// Create delivery address
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, contact_person, contact_phone, is_default } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: '地址名稱和地址必填' });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: '未授權' });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await query(
        'UPDATE delivery_addresses SET is_default = false WHERE user_id = $1',
        [userId]
      );
    }

    const result = await query(
      `INSERT INTO delivery_addresses (user_id, name, address, contact_person, contact_phone, is_default)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        userId,
        name,
        address,
        contact_person || null,
        contact_phone || null,
        is_default || false
      ]
    );

    res.status(201).json({ address: result.rows[0] });
  } catch (error: any) {
    console.error('建立送貨地址錯誤:', error);
    res.status(500).json({ error: '建立送貨地址失敗' });
  }
});

// Update delivery address
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, contact_person, contact_phone, is_default } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: '地址名稱和地址必填' });
    }

    // Check if address belongs to user
    const checkResult = await query(
      'SELECT id FROM delivery_addresses WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到送貨地址' });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await query(
        'UPDATE delivery_addresses SET is_default = false WHERE user_id = $1 AND id != $2',
        [userId, id]
      );
    }

    const result = await query(
      `UPDATE delivery_addresses 
       SET name = $1, address = $2, contact_person = $3, contact_phone = $4, is_default = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7 RETURNING *`,
      [name, address, contact_person || null, contact_phone || null, is_default || false, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到送貨地址' });
    }

    res.json({ address: result.rows[0] });
  } catch (error: any) {
    console.error('更新送貨地址錯誤:', error);
    res.status(500).json({ error: '更新送貨地址失敗' });
  }
});

// Delete delivery address
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: '未授權' });
    }

    // Check if address belongs to user
    const checkResult = await query(
      'SELECT id FROM delivery_addresses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到送貨地址' });
    }

    // Check if address is used in any requests
    const checkUsage = await query(
      'SELECT id FROM material_requests WHERE delivery_address_id = $1 LIMIT 1',
      [id]
    );

    if (checkUsage.rows.length > 0) {
      return res.status(400).json({ error: '此地址已被使用，無法刪除' });
    }

    const result = await query(
      'DELETE FROM delivery_addresses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到送貨地址' });
    }

    res.json({ message: '送貨地址已刪除', address: result.rows[0] });
  } catch (error) {
    console.error('刪除送貨地址錯誤:', error);
    res.status(500).json({ error: '刪除送貨地址失敗' });
  }
});

export default router;

