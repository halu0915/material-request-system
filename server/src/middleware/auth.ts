import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// Helper function to get user ID from request
export function getUserId(req: AuthRequest): number | null {
  return (req.user as any)?.id || null;
}

export const authenticateToken: any = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthRequest;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: '需要認證令牌' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    authReq.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };
    next();
  } catch (error) {
    res.status(403).json({ error: '無效的令牌' });
  }
};

export const generateToken = (user: { id: number; email: string; name?: string }): string => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

