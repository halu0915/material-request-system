import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { initializeDatabase } from './db/connection';
import authRoutes from './routes/auth';
import materialRoutes from './routes/materials';
import requestRoutes from './routes/requests';
import { errorHandler } from './middleware/errorHandler';
import { findClientBuild } from './utils/findClientBuild';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for frontend to work
}));
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow all origins in production
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Database
initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/requests', requestRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  console.log('🔍 開始尋找前端構建文件...');
  console.log('📁 NODE_ENV:', process.env.NODE_ENV);
  console.log('📁 當前工作目錄:', process.cwd());
  console.log('📁 __dirname:', __dirname);
  
  const clientBuildPath = findClientBuild();
  
  if (clientBuildPath) {
    console.log('✅ 找到前端構建文件，開始設置靜態文件服務...');
    
    // Serve static files
    app.use(express.static(clientBuildPath, {
      maxAge: '1y', // Cache static assets
      etag: true
    }));
    
    // Serve index.html for all non-API routes (SPA routing)
    app.get('*', (req, res, next) => {
      // Don't serve client files for API routes or health check
      if (req.path.startsWith('/api') || req.path === '/health') {
        return next();
      }
      
      // Serve index.html for all other routes (SPA routing)
      const indexPath = path.join(clientBuildPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('發送 index.html 錯誤:', err);
          next(err);
        }
      });
    });
    
    console.log('✅ ✅ ✅ 前端靜態文件服務已啟動！');
  } else {
    console.warn('⚠️ ⚠️ ⚠️  前端構建文件未找到！');
    console.warn('📋 將使用備用 HTML 頁面');
    
    // Serve a simple HTML page as fallback
    const publicPath = path.join(__dirname, '../public');
    if (fs.existsSync(path.join(publicPath, 'index.html'))) {
      app.use(express.static(publicPath));
      console.log('✅ 使用備用 HTML 頁面:', publicPath);
    }
    
    // Fallback: simple HTML response for root
    app.get('/', (req, res, next) => {
      // Try to serve public/index.html first
      const publicHtml = path.join(__dirname, '../public/index.html');
      if (fs.existsSync(publicHtml)) {
        return res.sendFile(publicHtml);
      }
      
      // Otherwise show API info
      res.json({
        message: '叫料系統 API 服務運行中',
        version: '1.0.0',
        status: 'ok',
        endpoints: {
          health: '/health',
          api: '/api',
          guest: '/api/auth/guest - 訪客登入',
          note: '前端尚未構建，但 API 服務正常運行'
        }
      });
    });
  }
}

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`伺服器運行於端口 ${PORT}`);
});

export default app;
