import express, { Response } from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import { query } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';

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
    const { constructionCategory, materialCategory } = req.query;

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
      return res.status(400).json({ error: '名稱必填' });
    }

    const result = await query(
      'INSERT INTO construction_categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );

    res.status(201).json({ category: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: '此施工類別已存在' });
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
      return res.status(400).json({ error: '名稱必填' });
    }

    const result = await query(
      'INSERT INTO material_categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );

    res.status(201).json({ category: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: '此材料類別已存在' });
    }
    console.error('建立材料類別錯誤:', error);
    res.status(500).json({ error: '建立材料類別失敗' });
  }
});

// Create material
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { construction_category_id, material_category_id, name, unit, description } = req.body;

    if (!construction_category_id || !material_category_id || !name) {
      return res.status(400).json({ error: '施工類別、材料類別和材料名稱必填' });
    }

    const result = await query(
      `INSERT INTO materials (construction_category_id, material_category_id, name, unit, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [construction_category_id, material_category_id, name, unit || null, description || null]
    );

    res.status(201).json({ material: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: '此材料已存在' });
    }
    console.error('建立材料錯誤:', error);
    res.status(500).json({ error: '建立材料失敗' });
  }
});

// Import materials from Excel
router.post('/import', authenticateToken, upload.single('file'), async (req, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '請上傳檔案' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const imported: any[] = [];
    const errors: any[] = [];

    for (const row of data as any[]) {
      try {
        const constructionCategory = row['施工類別'] || row['Construction Category'];
        const materialCategory = row['材料類別'] || row['Material Category'];
        const materialName = row['材料名稱'] || row['Material Name'];
        const unit = row['單位'] || row['Unit'] || null;

        if (!constructionCategory || !materialCategory || !materialName) {
          errors.push({ row, error: '缺少必要欄位' });
          continue;
        }

        // Get or create construction category
        let ccResult = await query(
          'SELECT id FROM construction_categories WHERE name = $1',
          [constructionCategory]
        );
        let ccId;
        if (ccResult.rows.length === 0) {
          ccResult = await query(
            'INSERT INTO construction_categories (name) VALUES ($1) RETURNING id',
            [constructionCategory]
          );
        }
        ccId = ccResult.rows[0].id;

        // Get or create material category
        let mcResult = await query(
          'SELECT id FROM material_categories WHERE name = $1',
          [materialCategory]
        );
        let mcId;
        if (mcResult.rows.length === 0) {
          mcResult = await query(
            'INSERT INTO material_categories (name) VALUES ($1) RETURNING id',
            [materialCategory]
          );
        }
        mcId = mcResult.rows[0].id;

        // Create material
        try {
          const materialResult = await query(
            `INSERT INTO materials (construction_category_id, material_category_id, name, unit)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [ccId, mcId, materialName, unit]
          );
          imported.push(materialResult.rows[0]);
        } catch (error: any) {
          if (error.code !== '23505') {
            throw error;
          }
          // Material already exists, skip
        }
      } catch (error: any) {
        errors.push({ row, error: error.message });
      }
    }

    res.json({
      message: `成功匯入 ${imported.length} 筆資料`,
      imported,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('匯入材料錯誤:', error);
    res.status(500).json({ error: '匯入材料失敗' });
  }
});

// Delete material
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;


    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到物料' });
    }

    res.json({ message: '物料已刪除', material: result.rows[0] });
  } catch (error) {
    console.error('刪除物料錯誤:', error);
    res.status(500).json({ error: '刪除物料失敗' });
  }
});

export default router;

