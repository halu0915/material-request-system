import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Filter out expected errors (file not found for static files)
  const isExpectedError = 
    err.code === 'ENOENT' && 
    (err.path?.includes('client/dist') || err.path?.includes('index.html'));
  
  if (isExpectedError) {
    // Silently handle expected file not found errors
    // These occur when client build files don't exist and we fall back to backup HTML
    if (!res.headersSent) {
      return next(); // Continue to next middleware (backup HTML handler)
    }
    return;
  }

  // Log unexpected errors
  console.error('錯誤:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: '伺服器內部錯誤',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

