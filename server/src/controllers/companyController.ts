import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../services/companyService.js';
import { companyQuerySchema, verifyCompanySchema, companyCreateUpdateSchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../types/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CompanyController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = companyQuerySchema.parse(req.query);
      const userOrgId = req.user?.organizationId || null;

      const result = await CompanyService.findCompanies(filters as any, userOrgId);

      res.json({
        success: true,
        data: result.companies,
        meta: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getByIdOrSlug(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slugOrId } = req.params;
      const userOrgId = req.user?.organizationId || null;

      const company = await CompanyService.getCompanyBySlugOrId(slugOrId, userOrgId);

      res.json({
        success: true,
        data: company,
      });
    } catch (err) {
      next(err);
    }
  }

  static async suggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string) || '';
      const suggestions = await CompanyService.getSearchSuggestions(q);
      res.json({
        success: true,
        data: suggestions,
      });
    } catch (err) {
      next(err);
    }
  }

  static async categories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taxonomy = await CompanyService.getTaxonomy();
      res.json({
        success: true,
        data: taxonomy,
      });
    } catch (err) {
      next(err);
    }
  }

  static async verify(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, notes } = verifyCompanySchema.parse(req.body);

      const updated = await CompanyService.verifyCompany(
        id,
        status,
        notes,
        req.user?.userId,
        req.user?.email
      );

      res.json({
        success: true,
        message: `Company verification status updated to ${status}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = companyCreateUpdateSchema.parse(req.body);
      const slug =
        data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') +
        '-' +
        Math.random().toString(36).substring(2, 6);

      const created = await prisma.company.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          categoryId: data.categoryId,
          companyType: data.companyType,
          hqCity: data.hqCity,
          hqState: data.hqState,
          hqCountry: data.hqCountry,
          website: data.website || null,
          contactEmail: data.contactEmail || null,
          contactPhone: data.contactPhone || null,
          employeeCountRange: data.employeeCountRange || null,
          yearEstablished: data.yearEstablished || null,
          revenueRange: data.revenueRange || null,
          verificationStatus: data.verificationStatus || 'UNVERIFIED',
          verificationNotes: data.verificationNotes || null,
          dataSource: data.dataSource || 'Administrative Entry',
          isDemonstration: data.isDemonstration ?? false,
          capabilities: data.capabilities
            ? {
                createMany: {
                  data: data.capabilities.map((c) => ({
                    capabilityType: c.capabilityType,
                    name: c.name,
                    specifications: c.specifications,
                  })),
                },
              }
            : undefined,
          products: data.products
            ? {
                createMany: {
                  data: data.products.map((p) => ({
                    name: p.name,
                    category: p.category,
                    description: p.description,
                    partNumberOrSpec: p.partNumberOrSpec,
                  })),
                },
              }
            : undefined,
          services: data.services
            ? {
                createMany: {
                  data: data.services.map((s) => ({
                    name: s.name,
                    category: s.category,
                    description: s.description,
                    capabilityLevel: s.capabilityLevel,
                  })),
                },
              }
            : undefined,
          certifications: data.certifications
            ? {
                createMany: {
                  data: data.certifications.map((cert) => ({
                    name: cert.name,
                    issuingBody: cert.issuingBody,
                    validUntil: cert.validUntil,
                  })),
                },
              }
            : undefined,
          industriesServed: data.industriesServed
            ? {
                createMany: {
                  data: data.industriesServed.map((ind) => ({
                    industryName: ind,
                  })),
                },
              }
            : undefined,
        },
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: req.user?.userId,
          userEmail: req.user?.email,
          action: 'COMPANY_CREATE',
          entityType: 'Company',
          entityId: created.id,
          detailsJson: JSON.stringify({ name: created.name }),
        },
      });

      res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: created,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await prisma.company.delete({ where: { id } });

      await prisma.auditLog.create({
        data: {
          userId: req.user?.userId,
          userEmail: req.user?.email,
          action: 'COMPANY_DELETE',
          entityType: 'Company',
          entityId: id,
          detailsJson: JSON.stringify({ name: deleted.name }),
        },
      });

      res.json({
        success: true,
        message: 'Company deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}
