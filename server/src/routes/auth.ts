import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
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
        return done(new Error('無法取得電子郵件'), null);
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
      return done(error, null);
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

