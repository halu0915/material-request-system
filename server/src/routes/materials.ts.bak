import express, { Response } from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import { query } from '../db/connection';
import { authenticateToken, AuthRequest, getUserId } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Get all construction categories
router.get('/construction-categories', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM construction_categories ORDER BY name'
    );
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('取得施工類別錯誤:', error);
    res.status(500).json({ error: '取得施工類別失敗' });
  }
});

// Get all material categories
router.get('/material-categories', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM material_categories ORDER BY name'
    );
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('取得材料類別錯誤:', error);
    res.status(500).json({ error: '取得材料類別失敗' });
  }
});

// Get all materials
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { constructionCategory, materialCategory } = req.query as { constructionCategory?: string; materialCategory?: string };

    let sql = `
      SELECT 
        m.*,
        cc.name as construction_category_name,
        mc.name as material_category_name
      FROM materials m
      LEFT JOIN construction_categories cc ON m.construction_category_id = cc.id
      LEFT JOIN material_categories mc ON m.material_category_id = mc.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (constructionCategory) {
      sql += ` AND m.construction_category_id = $${paramCount}`;
      params.push(constructionCategory);
      paramCount++;
    }

    if (materialCategory) {
      sql += ` AND m.material_category_id = $${paramCount}`;
      params.push(materialCategory);
      paramCount++;
    }

    sql += ' ORDER BY cc.name, mc.name, m.name';

    const result = await query(sql, params);
    res.json({ materials: result.rows });
  } catch (error) {
    console.error('取得材料錯誤:', error);
    res.status(500).json({ error: '取得材料失敗' });
  }
});

// Create construction category
router.post('/construction-categories', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: '類別名稱必填' });
    }

    const result = await query(
      'INSERT INTO construction_categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );

    res.status(201).json({ category: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: '此類別名稱已存在' });
    }
    console.error('建立施工類別錯誤:', error);
    res.status(500).json({ error: '建立施工類別失敗' });
  }
});

// Create material category
router.post('/material-categories', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: '類別名稱必填' });
    }

    const result = await query(
      'INSERT INTO material_categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );

    res.status(201).json({ category: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: '此類別名稱已存在' });
    }
    console.error('建立材料類別錯誤:', error);
    res.status(500).json({ error: '建立材料類別失敗' });
  }
});

// Update construction category
router.put('/construction-categories/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: '類別名稱必填' });
    }

    const result = await query(
      'UPDATE construction_categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到類別' });
    }

    res.json({ category: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: '此類別名稱已存在' });
    }
    console.error('更新施工類別錯誤:', error);
    res.status(500).json({ error: '更新施工類別失敗' });
  }
});

// Update material category
router.put('/material-categories/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: '類別名稱必填' });
    }

    // Check if category is in use
    const checkUsage = await query(
      'SELECT id FROM materials WHERE material_category_id = $1 LIMIT 1',
      [id]
    );

    if (checkUsage.rows.length > 0) {
      return res.status(400).json({ error: '此類別已被使用，無法刪除' });
    }

    const result = await query(
      'UPDATE material_categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到類別' });
    }

    res.json({ category: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: '此類別名稱已存在' });
    }
    console.error('更新材料類別錯誤:', error);
    res.status(500).json({ error: '更新材料類別失敗' });
  }
});

// Delete construction category
router.delete('/construction-categories/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category is in use
    const checkUsage = await query(
      'SELECT id FROM materials WHERE construction_category_id = $1 LIMIT 1',
      [id]
    );

    if (checkUsage.rows.length > 0) {
      return res.status(400).json({ error: '此類別已被使用，無法刪除' });
    }

    const result = await query(
      'DELETE FROM construction_categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到類別' });
    }

    res.json({ message: '類別已刪除', category: result.rows[0] });
  } catch (error) {
    console.error('刪除施工類別錯誤:', error);
    res.status(500).json({ error: '刪除施工類別失敗' });
  }
});

// Delete material category
router.delete('/material-categories/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category is in use
    const checkUsage = await query(
      'SELECT id FROM materials WHERE material_category_id = $1 LIMIT 1',
      [id]
    );

    if (checkUsage.rows.length > 0) {
      return res.status(400).json({ error: '此類別已被使用，無法刪除' });
    }

    const result = await query(
      'DELETE FROM material_categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到類別' });
    }

    res.json({ message: '類別已刪除', category: result.rows[0] });
  } catch (error) {
    console.error('刪除材料類別錯誤:', error);
    res.status(500).json({ error: '刪除材料類別失敗' });
  }
});

// Create material
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
