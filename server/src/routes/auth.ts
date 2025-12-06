import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { query } from '../db/connection';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('無法取得電子郵件'), undefined);
      }

      let result = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      let user;
      if (result.rows.length === 0) {
        // Create new user
        result = await query(
          `INSERT INTO users (email, name, provider, provider_id, avatar_url)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [
            email,
            profile.displayName,
            'google',
            profile.id,
            profile.photos?.[0]?.value
          ]
        );
        user = result.rows[0];
      } else {
        user = result.rows[0];
      }

      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }));
}

// Register endpoint
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: '此電子郵件已被使用' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, name, provider)
       VALUES ($1, $2, $3, $4) RETURNING id, email, name, created_at`,
      [email, passwordHash, name || null, 'local']
    );

    const user = result.rows[0];
    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    res.status(201).json({
      message: '註冊成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: any) {
    console.error('註冊錯誤:', error);
    res.status(500).json({ error: '註冊失敗' });
  }
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check trial account
    if (email === process.env.TRIAL_EMAIL && password === process.env.TRIAL_PASSWORD) {
      let trialUser = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (trialUser.rows.length === 0) {
        // Create trial account
        const passwordHash = await bcrypt.hash(password, 10);
        const trialExpires = new Date();
        trialExpires.setDate(trialExpires.getDate() + 30); // 30 days trial

        trialUser = await query(
          `INSERT INTO users (email, password_hash, name, provider, is_trial, trial_expires_at)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [email, passwordHash, '試用帳號', 'local', true, trialExpires]
        );
      }

      const user = trialUser.rows[0];
      const token = generateToken({ id: user.id, email: user.email, name: user.name });

      return res.json({
        message: '登入成功',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isTrial: user.is_trial
        }
      });
    }

    // Regular login
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: '電子郵件或密碼錯誤' });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return res.status(401).json({ error: '請使用第三方登入' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: '電子郵件或密碼錯誤' });
    }

    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    res.json({
      message: '登入成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isTrial: user.is_trial
      }
    });
  } catch (error: any) {
    console.error('登入錯誤:', error);
    res.status(500).json({ error: '登入失敗' });
  }
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const token = generateToken({ id: user.id, email: user.email, name: user.name });

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      res.status(500).json({ error: '認證失敗' });
    }
  }
);

// Apple OAuth (簡化版，實際需要更複雜的配置)
router.post('/apple', async (req: Request, res: Response) => {
  // Apple OAuth 需要更複雜的實現，這裡先返回錯誤
  res.status(501).json({ error: 'Apple 登入功能開發中' });
});

// Guest authentication endpoint
router.post('/guest', async (req: Request, res: Response) => {
  try {
    // Try to reuse existing guest user from the same session/browser
    // First, check if there's a token in the request (from Authorization header)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        
        // Verify user exists and is a guest user
        const userResult = await query(
          'SELECT id, email, name FROM users WHERE id = $1 AND provider = $2',
          [decoded.id, 'guest']
        );
        
        if (userResult.rows.length > 0) {
          // Reuse existing guest user
          const user = userResult.rows[0];
          const newToken = generateToken({ id: user.id, email: user.email, name: user.name });
          return res.json({
            message: '訪客帳號已存在',
            token: newToken,
            user: {
              id: user.id,
              email: user.email,
              name: user.name
            }
          });
        }
      } catch (tokenError) {
        // Token invalid or expired, continue to create/reuse guest user
        console.log('Token 驗證失敗，將創建或重用訪客帳號');
      }
    }
    
    // If no valid token, try to reuse the most recent guest user (within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const existingResult = await query(
      `SELECT id, email, name FROM users 
       WHERE provider = $1 AND created_at > $2 
       ORDER BY created_at DESC LIMIT 1`,
      ['guest', sevenDaysAgo]
    );
    
    if (existingResult.rows.length > 0) {
      // Reuse existing guest user
      const user = existingResult.rows[0];
      const newToken = generateToken({ id: user.id, email: user.email, name: user.name });
      return res.json({
        message: '訪客帳號已重用',
        token: newToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    }
    
    // Create new guest user only if no recent guest user exists
    const guestEmail = `guest_${Date.now()}@guest.local`;
    const guestName = '訪客使用者';
    
    const result = await query(
      `INSERT INTO users (email, name, provider)
       VALUES ($1, $2, $3) RETURNING id, email, name`,
      [guestEmail, guestName, 'guest']
    );

    const user = result.rows[0];
    const newToken = generateToken({ id: user.id, email: user.email, name: user.name });

    res.json({
      message: '訪客帳號建立成功',
      token: newToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: any) {
    console.error('建立訪客帳號錯誤:', error);
    res.status(500).json({ error: '建立訪客帳號失敗' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT id, email, name, provider, avatar_url, is_trial FROM users WHERE id = $1',
      [req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到使用者' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '取得使用者資訊失敗' });
  }
});

export default router;
