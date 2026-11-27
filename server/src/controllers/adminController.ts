import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ImportService } from '../services/importService.js';
import { AuthenticatedRequest } from '../types/index.js';

const prisma = new PrismaClient();

export class AdminController {
  static async getStats(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const [companiesCount, usersCount, orgsCount, importsCount, auditLogs] = await Promise.all([
        prisma.company.count(),
        prisma.user.count(),
        prisma.organization.count(),
        prisma.dataImport.count(),
        prisma.auditLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ]);

      res.json({
        success: true,
        data: {
          companiesCount,
          usersCount,
          orgsCount,
          importsCount,
          recentAuditLogs: auditLogs,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async listUsers(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
          organization: {
            select: { id: true, name: true, planCode: true },
          },
        },
      });

      res.json({
        success: true,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listOrganizations(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgs = await prisma.organization.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { members: true, savedCompanies: true },
          },
        },
      });

      res.json({
        success: true,
        data: orgs,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateOrgPlan(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { planCode } = req.body;

      if (!['BASIC', 'PRO', 'ENTERPRISE'].includes(planCode)) {
        res.status(400).json({ success: false, message: 'Invalid plan code' });
        return;
      }

      const updated = await prisma.organization.update({
        where: { id },
        data: { planCode },
      });

      await prisma.auditLog.create({
        data: {
          userId: req.user?.userId,
          userEmail: req.user?.email,
          action: 'ORG_PLAN_UPDATE',
          entityType: 'Organization',
          entityId: id,
          detailsJson: JSON.stringify({ orgName: updated.name, newPlan: planCode }),
        },
      });

      res.json({
        success: true,
        message: `Plan updated to ${planCode}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async previewImport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const csvText = req.body.csvContent;
      if (!csvText || typeof csvText !== 'string') {
        res.status(400).json({ success: false, message: 'CSV content string is required' });
        return;
      }

      const preview = await ImportService.previewCSV(csvText);

      res.json({
        success: true,
        data: preview,
      });
    } catch (err) {
      next(err);
    }
  }

  static async commitImport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { validRows, fileName } = req.body;
      if (!Array.isArray(validRows) || validRows.length === 0) {
        res.status(400).json({ success: false, message: 'No valid rows to commit' });
        return;
      }

      const result = await ImportService.commitImport(
        validRows,
        req.user?.userId,
        req.user?.email,
        fileName
      );

      res.json({
        success: true,
        message: `Successfully imported ${result.importedCount} companies.`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAuditLogs(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      res.json({
        success: true,
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  }
}
