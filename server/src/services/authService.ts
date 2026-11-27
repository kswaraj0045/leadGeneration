import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config, SUBSCRIPTION_PLANS } from '../config/index.js';
import { AuthUserPayload } from '../types/index.js';

const prisma = new PrismaClient();

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    fullName: string;
    organizationName: string;
    country?: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const orgSlug = data.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Math.random().toString(36).substring(2, 6);

    // Create Organization and User atomically
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: data.organizationName,
          slug: orgSlug,
          country: data.country || 'India',
          planCode: 'BASIC',
        },
      });

      // Create first monthly usage record
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      await tx.monthlyUsage.create({
        data: {
          organizationId: org.id,
          yearMonth,
          searchesUsed: 0,
          exportsUsed: 0,
          savedCompaniesCount: 0,
        },
      });

      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase(),
          fullName: data.fullName,
          passwordHash,
          role: 'COMPANY_ADMIN', // First user in an organization is Company Admin
          organizationId: org.id,
        },
        include: { organization: true },
      });

      return { user, org };
    });

    const token = this.generateToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role as any,
      organizationId: result.org.id,
    });

    return { user: result.user, token };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { organization: true },
    });

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new Error('Invalid email or password.');
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      organizationId: user.organizationId,
    });

    return { user, token };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            website: true,
            country: true,
            planCode: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User account not found.');
    }

    return user;
  }

  static generateToken(payload: AuthUserPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: (config.jwtExpiresIn || '7d') as any,
    });
  }
}
