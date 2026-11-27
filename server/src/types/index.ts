import { Request } from 'express';

export type UserRole = 'ADMIN' | 'COMPANY_ADMIN' | 'COMPANY_USER';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  organizationId?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}
