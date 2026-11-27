import { describe, it, expect } from 'vitest';
import { AuthService } from '../services/authService.js';
import { registerSchema, loginSchema, companyQuerySchema } from '../validators/index.js';

describe('Validators & Auth Utilities', () => {
  it('validates correct registration payload', () => {
    const valid = {
      email: 'test@foundry.io',
      password: 'StrongPassword123!',
      fullName: 'Engineer Sharma',
      organizationName: 'Bharat Semi Fab',
      country: 'India',
    };
    const parsed = registerSchema.parse(valid);
    expect(parsed.email).toBe('test@foundry.io');
    expect(parsed.fullName).toBe('Engineer Sharma');
  });

  it('rejects invalid email or weak password', () => {
    expect(() =>
      registerSchema.parse({
        email: 'not-an-email',
        password: 'short',
        fullName: 'A',
        organizationName: '',
      })
    ).toThrow();
  });

  it('generates valid JWT token with user payload', () => {
    const token = AuthService.generateToken({
      userId: 'usr-123',
      email: 'user@semi.io',
      role: 'COMPANY_ADMIN',
      organizationId: 'org-456',
    });

    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('parses company search query parameters with defaults', () => {
    const query = companyQuerySchema.parse({
      q: 'GaN',
      page: '2',
      limit: '20',
    });

    expect(query.q).toBe('GaN');
    expect(query.page).toBe(2);
    expect(query.limit).toBe(20);
    expect(query.sortBy).toBe('createdAt');
    expect(query.sortOrder).toBe('desc');
  });
});
