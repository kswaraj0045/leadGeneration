import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AuthenticatedRequest, AuthUserPayload } from '../types/index.js';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Extract from HTTP-only cookie first, fallback to Authorization header
  let token = req.cookies?.viaset_token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to access this resource.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
  }
};

export const optionalAuthenticateToken = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  let token = req.cookies?.viaset_token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as AuthUserPayload;
      req.user = decoded;
    } catch {
      // Ignore token verification error for optional auth
    }
  }
  next();
};
