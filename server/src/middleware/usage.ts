import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/index.js';
import { SUBSCRIPTION_PLANS } from '../config/index.js';

const prisma = new PrismaClient();

const getCurrentYearMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const trackAndEnforceUsage = (actionType: 'SEARCH' | 'EXPORT' | 'SAVE_COMPANY') => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    // If not authenticated or has no org, let controller handle or pass through
    if (!req.user?.organizationId) {
      next();
      return;
    }

    const orgId = req.user.organizationId;
    const yearMonth = getCurrentYearMonth();

    try {
      // Fetch org's subscription plan
      const org = await prisma.organization.findUnique({
        where: { id: orgId },
        select: { planCode: true },
      });

      const planCode = (org?.planCode as keyof typeof SUBSCRIPTION_PLANS) || 'BASIC';
      const planLimits = SUBSCRIPTION_PLANS[planCode] || SUBSCRIPTION_PLANS.BASIC;

      // Get or create monthly usage record
      let usage = await prisma.monthlyUsage.findUnique({
        where: {
          organizationId_yearMonth: {
            organizationId: orgId,
            yearMonth,
          },
        },
      });

      if (!usage) {
        usage = await prisma.monthlyUsage.create({
          data: {
            organizationId: orgId,
            yearMonth,
            searchesUsed: 0,
            exportsUsed: 0,
            savedCompaniesCount: 0,
          },
        });
      }

      // Check quota limits
      if (actionType === 'SEARCH') {
        if (usage.searchesUsed >= planLimits.maxMonthlySearches) {
          res.status(429).json({
            success: false,
            message: `Monthly search limit reached (${planLimits.maxMonthlySearches} searches for ${planLimits.name}). Please upgrade your plan for higher quotas.`,
            quotaExceeded: true,
            plan: planCode,
          });
          return;
        }

        // Increment searches in background
        await prisma.monthlyUsage.update({
          where: { id: usage.id },
          data: { searchesUsed: { increment: 1 } },
        });
      } else if (actionType === 'EXPORT') {
        if (usage.exportsUsed >= planLimits.maxMonthlyExports) {
          res.status(429).json({
            success: false,
            message: `Monthly data export limit reached (${planLimits.maxMonthlyExports} exports for ${planLimits.name}). Upgrade to Pro or Enterprise for additional exports.`,
            quotaExceeded: true,
            plan: planCode,
          });
          return;
        }

        await prisma.monthlyUsage.update({
          where: { id: usage.id },
          data: { exportsUsed: { increment: 1 } },
        });
      } else if (actionType === 'SAVE_COMPANY') {
        const savedCount = await prisma.savedCompany.count({
          where: { organizationId: orgId },
        });

        if (savedCount >= planLimits.maxSavedCompanies) {
          res.status(429).json({
            success: false,
            message: `Saved companies limit reached (${planLimits.maxSavedCompanies} companies for ${planLimits.name}). Please upgrade to store more potential partners.`,
            quotaExceeded: true,
            plan: planCode,
          });
          return;
        }
      }

      next();
    } catch (err) {
      console.error('Error tracking usage:', err);
      // Fail open to avoid blocking legitimate requests if usage table encounters issue
      next();
    }
  };
};
