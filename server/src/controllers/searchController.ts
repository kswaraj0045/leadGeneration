import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { savedSearchSchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../types/index.js';

const prisma = new PrismaClient();

export class SearchController {
  static async listSaved(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.organizationId) {
        res.status(400).json({ success: false, message: 'Organization required' });
        return;
      }

      const savedSearches = await prisma.savedSearch.findMany({
        where: { organizationId: req.user.organizationId },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: savedSearches.map((s) => ({
          ...s,
          queryParams: JSON.parse(s.queryParamsJson || '{}'),
        })),
      });
    } catch (err) {
      next(err);
    }
  }

  static async createSaved(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.organizationId) {
        res.status(400).json({ success: false, message: 'Organization required' });
        return;
      }

      const data = savedSearchSchema.parse(req.body);

      const saved = await prisma.savedSearch.create({
        data: {
          organizationId: req.user.organizationId,
          userId: req.user.userId,
          name: data.name,
          queryParamsJson: JSON.stringify(data.queryParams),
          alertFrequency: data.alertFrequency,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Search query saved',
        data: {
          ...saved,
          queryParams: data.queryParams,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSaved(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const existing = await prisma.savedSearch.findUnique({
        where: { id },
      });

      if (!existing || existing.organizationId !== req.user?.organizationId) {
        res.status(404).json({ success: false, message: 'Saved search not found' });
        return;
      }

      await prisma.savedSearch.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Saved search removed',
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.organizationId) {
        res.status(400).json({ success: false, message: 'Organization required' });
        return;
      }

      const history = await prisma.searchHistory.findMany({
        where: { organizationId: req.user.organizationId },
        orderBy: { createdAt: 'desc' },
        take: 15,
        include: {
          user: { select: { fullName: true } },
        },
      });

      res.json({
        success: true,
        data: history,
      });
    } catch (err) {
      next(err);
    }
  }
}
