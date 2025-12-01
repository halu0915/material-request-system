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
  const publicPath = path.join(__dirname, '../public');
  const publicHtmlExists = fs.existsSync(path.join(publicPath, 'index.html'));
  
  console.log('📁 備用 HTML 路徑:', publicPath);
  console.log('📁 備用 HTML 存在:', publicHtmlExists);
  
  if (clientBuildPath) {
    console.log('✅ 找到前端構建文件，開始設置靜態文件服務...');
    console.log('📍 前端構建文件路徑:', clientBuildPath);
    
    // Serve static files (CSS, JS, images, etc.) - but don't handle 404s
    app.use(express.static(clientBuildPath, {
      maxAge: '1y', // Cache static assets
      etag: true,
      fallthrough: true // Continue to next middleware if file not found
    }));
    
    // Serve index.html for all non-API routes (SPA routing)
    // This catches all routes that don't match static files
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
    
    // Always try to serve backup HTML
    if (publicHtmlExists) {
      console.warn('📋 將使用備用 HTML 頁面');
      console.log('✅ 備用 HTML 頁面已設置:', publicPath);
      
      // Serve dashboard.html as main page if it exists, otherwise use index.html
      app.get('/', (req, res) => {
        const dashboardPath = path.join(publicPath, 'dashboard.html');
        if (fs.existsSync(dashboardPath)) {
          return res.sendFile(dashboardPath);
        }
        // Fallback to index.html if dashboard doesn't exist
        const backupHtml = path.join(publicPath, 'index.html');
        res.sendFile(backupHtml);
      });

      // Serve dashboard.html route
      app.get('/dashboard.html', (req, res) => {
        const dashboardPath = path.join(publicPath, 'dashboard.html');
        if (fs.existsSync(dashboardPath)) {
          return res.sendFile(dashboardPath);
        }
        res.status(404).send('Dashboard not found');
      });

      // Fallback for all other routes
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path === '/health') {
          return next();
        }
        // Try dashboard first, then index.html
        const dashboardPath = path.join(publicPath, 'dashboard.html');
        if (fs.existsSync(dashboardPath)) {
          return res.sendFile(dashboardPath);
        }
        // Fallback to index.html
        const backupHtml = path.join(publicPath, 'index.html');
        res.sendFile(backupHtml, (err) => {
          if (err) {
            console.error('發送備用 HTML 錯誤:', err);
            next(err);
          }
        });
      });
      
      // Serve static files from public directory (for CSS, JS, images, etc.)
      app.use(express.static(publicPath));
    } else {
      console.warn('⚠️ 備用 HTML 頁面也不存在！');
      // Fallback: simple JSON response for root
      app.get('/', (req, res) => {
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
} else {
  // In development, serve backup HTML if it exists
  const publicPath = path.join(__dirname, '../public');
  if (fs.existsSync(path.join(publicPath, 'index.html'))) {
    app.use(express.static(publicPath));
    app.get('/', (req, res) => {
      if (req.path.startsWith('/api')) {
        return;
      }
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  }
}

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`伺服器運行於端口 ${PORT}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 檢查前端構建文件狀態...');
  console.log('═══════════════════════════════════════════════════════');
  
  if (process.env.NODE_ENV === 'production') {
    const clientPath = path.join(__dirname, '../../client/dist');
    const publicPath = path.join(__dirname, '../public');
    
    console.log('檢查 client/dist:', clientPath);
    console.log('  存在:', fs.existsSync(clientPath));
    if (fs.existsSync(clientPath)) {
      console.log('  index.html:', fs.existsSync(path.join(clientPath, 'index.html')));
    }
    
    console.log('檢查 server/public:', publicPath);
    console.log('  存在:', fs.existsSync(publicPath));
    if (fs.existsSync(publicPath)) {
      console.log('  index.html:', fs.existsSync(path.join(publicPath, 'index.html')));
    }
  }
  console.log('═══════════════════════════════════════════════════════');
});

export default app;
