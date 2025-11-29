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
import uploadRoutes from './routes/upload';
import addressRoutes from './routes/addresses';
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
app.use('/api/uploads', uploadRoutes);
app.use('/api/addresses', addressRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = findClientBuild();
  const publicPath = path.join(__dirname, '../public');
  const publicHtmlExists = fs.existsSync(path.join(publicPath, 'dashboard.html'));
  
  if (clientBuildPath && fs.existsSync(path.join(clientBuildPath, 'index.html'))) {
    console.log('✅ 找到前端構建文件，路徑:', clientBuildPath);
    
    // Serve static files (CSS, JS, images, etc.)
    // Only set up static middleware if directory exists
    if (fs.existsSync(clientBuildPath)) {
      app.use(express.static(clientBuildPath, {
        maxAge: '1y',
        etag: true,
        fallthrough: true
      }));
    }
    
    // Serve index.html for all non-API routes (SPA routing)
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/health') {
        return next();
      }
      
      const indexPath = path.join(clientBuildPath, 'index.html');
      // Double check file exists before sending
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath, (err) => {
          if (err && (err as any).code !== 'ENOENT') {
            console.error('發送 index.html 錯誤:', err.message);
            next(err);
          }
        });
      } else {
        // File doesn't exist, fall through to backup handler
        next();
      }
    });
    
    console.log('✅ 前端靜態文件服務已啟動');
  } else {
    console.log('ℹ️  前端構建文件未找到，使用備用 HTML 頁面');
    
    // Serve backup HTML from public directory
    if (publicHtmlExists) {
      console.log('✅ 使用備用 HTML 頁面:', publicPath);
      
      // Serve dashboard as main page
      app.get('/', (req, res) => {
        const dashboardPath = path.join(publicPath, 'dashboard.html');
        res.sendFile(dashboardPath);
      });

      app.get('/dashboard.html', (req, res) => {
        const dashboardPath = path.join(publicPath, 'dashboard.html');
        res.sendFile(dashboardPath);
      });

      // Fallback for all other routes (serve dashboard)
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path === '/health') {
          return next();
        }
        const dashboardPath = path.join(publicPath, 'dashboard.html');
        res.sendFile(dashboardPath);
      });
      
      // Serve static files from public directory
      app.use(express.static(publicPath));
    } else {
      console.warn('⚠️  備用 HTML 頁面也不存在');
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
  if (fs.existsSync(path.join(publicPath, 'dashboard.html'))) {
    app.use(express.static(publicPath));
    app.get('/', (req, res) => {
      if (req.path.startsWith('/api')) {
        return;
      }
      res.sendFile(path.join(publicPath, 'dashboard.html'));
    });
  }
}

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`伺服器運行於端口 ${PORT}`);
});

export default app;
