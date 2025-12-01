import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import { createTables } from './migrations';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 如果 DATABASE_URL 包含 render.com，則需要 SSL
  ssl: process.env.DATABASE_URL?.includes('render.com') 
    ? { rejectUnauthorized: false } 
    : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false)
});

export const getDB = (): Pool => pool;

export const initializeDatabase = async (): Promise<void> => {
  try {
    await pool.query('SELECT NOW()');
    console.log('資料庫連接成功');
    await createTables();
  } catch (error) {
    console.error('資料庫連接失敗:', error);
    console.warn('⚠️ 服務器將繼續運行，但數據庫功能可能無法使用');
    // Don't throw error in development to allow server to start without DB
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};

export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('執行查詢', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('查詢錯誤', { text, error });
    throw error;
  }
};

export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

