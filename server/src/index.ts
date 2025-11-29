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
  const clientBuildPath = findClientBuild();
  
  if (clientBuildPath) {
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
      const indexPath = path.join(clientBuildPath!, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('發送 index.html 錯誤:', err);
          next(err);
        }
      });
    });
    
    console.log('✅ 前端靜態文件服務已啟動');
  } else {
    console.warn('⚠️  前端構建文件未找到，只提供 API 服務');
    // If client build doesn't exist, just show API info
    app.get('/', (req, res) => {
      res.json({
        message: '叫料系統 API 服務運行中',
        version: '1.0.0',
        status: 'ok',
        endpoints: {
          health: '/health',
          api: '/api',
          note: '前端尚未構建或構建文件未找到'
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
