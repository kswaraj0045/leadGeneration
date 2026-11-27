import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/index.js';
import { SUBSCRIPTION_PLANS } from '../config/index.js';

const prisma = new PrismaClient();

export class AnalyticsController {
  static async getOverview(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalCompanies,
        verifiedCompanies,
        claimedCompanies,
        unverifiedCompanies,
        industries,
        countriesRaw,
        companyTypesRaw,
        topCapabilitiesRaw,
      ] = await Promise.all([
        prisma.company.count(),
        prisma.company.count({ where: { verificationStatus: 'VERIFIED' } }),
        prisma.company.count({ where: { verificationStatus: 'CLAIMED' } }),
        prisma.company.count({ where: { verificationStatus: 'UNVERIFIED' } }),
        prisma.industry.findMany({
          select: {
            name: true,
            slug: true,
            categories: {
              select: {
                name: true,
                slug: true,
                _count: { select: { companies: true } },
              },
            },
          },
        }),
        prisma.company.groupBy({
          by: ['hqCountry'],
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 8,
        }),
        prisma.company.groupBy({
          by: ['companyType'],
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
        }),
        prisma.companyCapability.groupBy({
          by: ['capabilityType'],
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
        }),
      ]);

      const categoryDistribution = industries.map((ind) => ({
        industry: ind.name,
        companyCount: ind.categories.reduce((acc, c) => acc + c._count.companies, 0),
        categories: ind.categories.map((c) => ({ name: c.name, count: c._count.companies })),
      }));

      const countryDistribution = countriesRaw.map((c) => ({
        country: c.hqCountry,
        count: c._count.id,
      }));

      const typeDistribution = companyTypesRaw.map((t) => ({
        type: t.companyType,
        count: t._count.id,
      }));

      res.json({
        success: true,
        data: {
          kpis: {
            totalCompanies,
            verifiedCompanies,
            claimedCompanies,
            unverifiedCompanies,
            verificationRate: totalCompanies > 0 ? Math.round((verifiedCompanies / totalCompanies) * 100) : 0,
          },
          categoryDistribution,
          countryDistribution,
          typeDistribution,
          topCapabilityTypes: topCapabilitiesRaw.map((cap) => ({ type: cap.capabilityType, count: cap._count.id })),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUsage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.organizationId) {
        res.status(400).json({ success: false, message: 'Organization required' });
        return;
      }

      const org = await prisma.organization.findUnique({
        where: { id: req.user.organizationId },
        select: { planCode: true, name: true },
      });

      const planCode = (org?.planCode as keyof typeof SUBSCRIPTION_PLANS) || 'BASIC';
      const plan = SUBSCRIPTION_PLANS[planCode] || SUBSCRIPTION_PLANS.BASIC;

      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      let usage = await prisma.monthlyUsage.findUnique({
        where: {
          organizationId_yearMonth: {
            organizationId: req.user.organizationId,
            yearMonth,
          },
        },
      });

      const savedCount = await prisma.savedCompany.count({
        where: { organizationId: req.user.organizationId },
      });

      res.json({
        success: true,
        data: {
          planCode,
          planName: plan.name,
          limits: {
            maxMonthlySearches: plan.maxMonthlySearches,
            maxSavedCompanies: plan.maxSavedCompanies,
            maxMonthlyExports: plan.maxMonthlyExports,
            canExportExcel: plan.canExportExcel,
            canAccessAdvancedFilters: plan.canAccessAdvancedFilters,
          },
          currentMonth: {
            yearMonth,
            searchesUsed: usage?.searchesUsed || 0,
            exportsUsed: usage?.exportsUsed || 0,
            savedCompaniesCount: savedCount,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
