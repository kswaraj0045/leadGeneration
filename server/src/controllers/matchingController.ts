import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { matchingQuerySchema } from '../validators/index.js';
import { matchingEngine } from '../services/matchingEngine.js';
import { AuthenticatedRequest } from '../types/index.js';

const prisma = new PrismaClient();

export class MatchingController {
  static async match(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const criteria = matchingQuerySchema.parse(req.body);

      // Load companies with all nested relations required for matching
      const companies = await prisma.company.findMany({
        include: {
          category: {
            select: { name: true, slug: true },
          },
          capabilities: true,
          products: true,
          services: true,
          certifications: true,
          industriesServed: true,
        },
      });

      // Execute rule-based explainable matching engine
      const rankedResults = matchingEngine.evaluate(companies as any, criteria);

      // Save to SearchHistory if user belongs to an organization
      if (req.user?.organizationId) {
        await prisma.searchHistory.create({
          data: {
            organizationId: req.user.organizationId,
            userId: req.user.userId,
            queryText: `Matching Query (${[
              ...criteria.targetCapabilities,
              ...criteria.targetProducts,
              ...criteria.targetServices,
            ].join(', ')})`,
            filtersJson: JSON.stringify(criteria),
            resultCount: rankedResults.length,
          },
        });
      }

      res.json({
        success: true,
        data: {
          matches: rankedResults,
          totalEvaluated: companies.length,
          appliedWeights: criteria.customWeights || {
            capabilities: 0.35,
            products: 0.25,
            industry: 0.20,
            location: 0.10,
            certifications: 0.10,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
