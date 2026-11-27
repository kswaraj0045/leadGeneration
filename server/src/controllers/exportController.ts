import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ExportService } from '../services/exportService.js';
import { AuthenticatedRequest } from '../types/index.js';
import { SUBSCRIPTION_PLANS } from '../config/index.js';

const prisma = new PrismaClient();

export class ExportController {
  static async exportCompanies(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const format = (req.query.format as string)?.toUpperCase() || 'CSV';
      const companyIds = req.body?.companyIds as string[] | undefined;

      // Verify org plan permissions
      const orgId = req.user?.organizationId;
      if (orgId) {
        const org = await prisma.organization.findUnique({
          where: { id: orgId },
          select: { planCode: true },
        });
        const planCode = (org?.planCode as keyof typeof SUBSCRIPTION_PLANS) || 'BASIC';
        const plan = SUBSCRIPTION_PLANS[planCode] || SUBSCRIPTION_PLANS.BASIC;

        if (format === 'EXCEL' && !plan.canExportExcel) {
          res.status(403).json({
            success: false,
            message: 'Excel export is available on Professional and Enterprise plans. Please export as CSV or upgrade.',
          });
          return;
        }
      }

      const where: any = {};
      if (companyIds && companyIds.length > 0) {
        where.id = { in: companyIds };
      }

      const companies = await prisma.company.findMany({
        where,
        take: 200,
        include: {
          category: true,
          capabilities: true,
          certifications: true,
          products: true,
        },
      });

      const formatted = companies.map((c) => ExportService.formatCompanyForExport(c));

      if (format === 'EXCEL') {
        const buffer = await ExportService.toExcel(formatted, 'VIASET_Companies');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="viaset_companies_export.xlsx"');
        res.send(buffer);
        return;
      }

      const csvData = ExportService.toCSV(formatted);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="viaset_companies_export.csv"');
      res.send(csvData);
    } catch (err) {
      next(err);
    }
  }

  static async exportSaved(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.organizationId) {
        res.status(400).json({ success: false, message: 'Organization required' });
        return;
      }

      const format = (req.query.format as string)?.toUpperCase() || 'CSV';

      const savedRecords = await prisma.savedCompany.findMany({
        where: { organizationId: req.user.organizationId },
        include: {
          company: {
            include: {
              category: true,
              capabilities: true,
              certifications: true,
              products: true,
            },
          },
        },
      });

      const formatted = savedRecords.map((s) =>
        ExportService.formatCompanyForExport(s.company, { status: s.status, notes: s.notes })
      );

      if (format === 'EXCEL') {
        const buffer = await ExportService.toExcel(formatted, 'Saved_Pipeline');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="viaset_saved_partners.xlsx"');
        res.send(buffer);
        return;
      }

      const csvData = ExportService.toCSV(formatted);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="viaset_saved_partners.csv"');
      res.send(csvData);
    } catch (err) {
      next(err);
    }
  }
}
