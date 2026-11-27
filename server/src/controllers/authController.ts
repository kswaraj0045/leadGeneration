import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { registerSchema, loginSchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../types/index.js';

const COOKIE_NAME = 'viaset_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);
      const { user, token } = await AuthService.register(validated);

      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            organizationId: user.organizationId,
            organization: (user as any).organization,
          },
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);
      const { user, token } = await AuthService.login(validated.email, validated.password);

      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
      res.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            organizationId: user.organizationId,
            organization: user.organization,
          },
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie(COOKIE_NAME);
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthenticated' });
        return;
      }
      const user = await AuthService.getProfile(req.user.userId);
      res.json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }
}
