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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  
  // Check if client build exists before serving
  if (fs.existsSync(clientBuildPath) && fs.existsSync(path.join(clientBuildPath, 'index.html'))) {
    app.use(express.static(clientBuildPath));
    
    app.get('*', (req, res, next) => {
      // Don't serve client files for API routes
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
    // If client build doesn't exist, just show API info
    app.get('/', (req, res) => {
      res.json({
        message: '叫料系統 API 服務運行中',
        version: '1.0.0',
        status: 'ok',
        endpoints: {
          health: '/health',
          api: '/api',
          docs: 'API 服務已啟動，前端尚未構建'
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
