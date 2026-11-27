import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { saveCompanySchema, updateSavedCompanySchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../types/index.js';

const prisma = new PrismaClient();

export class SavedController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.organizationId) {
        res.status(400).json({ success: false, message: 'Organization required' });
        return;
      }

      const status = req.query.status as string;
      const where: any = { organizationId: req.user.organizationId };
      if (status && status !== 'ALL') {
        where.status = status;
      }

      const savedList = await prisma.savedCompany.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: {
          company: {
            include: {
              category: true,
              capabilities: true,
              certifications: true,
            },
          },
          user: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      res.json({
        success: true,
        data: savedList,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.organizationId) {
        res.status(400).json({ success: false, message: 'Organization required' });
        return;
      }

      const data = saveCompanySchema.parse(req.body);

      const saved = await prisma.savedCompany.upsert({
        where: {
          organizationId_companyId: {
            organizationId: req.user.organizationId,
            companyId: data.companyId,
          },
        },
        update: {
          status: data.status,
          notes: data.notes,
          tags: data.tags,
          userId: req.user.userId,
        },
        create: {
          organizationId: req.user.organizationId,
          userId: req.user.userId,
          companyId: data.companyId,
          status: data.status,
          notes: data.notes,
          tags: data.tags,
        },
        include: {
          company: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Company saved to workspace pipeline',
        data: saved,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateSavedCompanySchema.parse(req.body);

      const existing = await prisma.savedCompany.findUnique({
        where: { id },
      });

      if (!existing || existing.organizationId !== req.user?.organizationId) {
        res.status(404).json({ success: false, message: 'Saved record not found or unauthorized' });
        return;
      }

      const updated = await prisma.savedCompany.update({
        where: { id },
        data: {
          ...(data.status ? { status: data.status } : {}),
          ...(data.notes !== undefined ? { notes: data.notes } : {}),
          ...(data.tags !== undefined ? { tags: data.tags } : {}),
        },
        include: {
          company: true,
        },
      });

      res.json({
        success: true,
        message: 'Saved record updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const existing = await prisma.savedCompany.findUnique({
        where: { id },
      });

      if (!existing || existing.organizationId !== req.user?.organizationId) {
        res.status(404).json({ success: false, message: 'Saved record not found' });
        return;
      }

      await prisma.savedCompany.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Company removed from saved list',
      });
    } catch (err) {
      next(err);
    }
  }
}
