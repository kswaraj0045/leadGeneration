import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CompanyFilterOptions {
  q?: string;
  category?: string;
  companyType?: string;
  country?: string;
  certification?: string;
  verificationStatus?: 'UNVERIFIED' | 'CLAIMED' | 'VERIFIED';
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'yearEstablished' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export class CompanyService {
  static async findCompanies(filters: CompanyFilterOptions, userOrgId?: string | null) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 12));
    const skip = (page - 1) * limit;

    const where: Prisma.CompanyWhereInput = {};

    // Verification status filter
    if (filters.verificationStatus) {
      where.verificationStatus = filters.verificationStatus;
    }

    // Category filter (by slug or categoryId)
    if (filters.category && filters.category !== 'all') {
      where.category = {
        OR: [{ slug: filters.category }, { id: filters.category }],
      };
    }

    // Company type filter
    if (filters.companyType && filters.companyType !== 'all') {
      where.companyType = filters.companyType;
    }

    // Country filter
    if (filters.country && filters.country !== 'all') {
      where.hqCountry = filters.country;
    }

    // Certification filter
    if (filters.certification && filters.certification !== 'all') {
      where.certifications = {
        some: {
          name: {
            contains: filters.certification,
          },
        },
      };
    }

    // Keyword search (name, description, capabilities, products, services)
    if (filters.q && filters.q.trim()) {
      const query = filters.q.trim();
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { hqCity: { contains: query } },
        { hqState: { contains: query } },
        {
          capabilities: {
            some: {
              OR: [{ name: { contains: query } }, { specifications: { contains: query } }],
            },
          },
        },
        {
          products: {
            some: {
              OR: [{ name: { contains: query } }, { description: { contains: query } }],
            },
          },
        },
        {
          services: {
            some: {
              OR: [{ name: { contains: query } }, { description: { contains: query } }],
            },
          },
        },
      ];
    }

    const orderBy: Prisma.CompanyOrderByWithRelationInput = {};
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

    const [total, companies] = await Promise.all([
      prisma.company.count({ where }),
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          capabilities: {
            take: 4,
          },
          products: {
            take: 3,
          },
          services: {
            take: 3,
          },
          certifications: true,
          industriesServed: true,
          savedIn: userOrgId
            ? {
                where: { organizationId: userOrgId },
                select: { id: true, status: true },
              }
            : false,
        },
      }),
    ]);

    const formatted = companies.map((c) => ({
      ...c,
      isSaved: userOrgId ? (c as any).savedIn?.length > 0 : false,
      savedStatus: userOrgId && (c as any).savedIn?.length > 0 ? (c as any).savedIn[0].status : null,
    }));

    return {
      companies: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCompanyBySlugOrId(slugOrId: string, userOrgId?: string | null) {
    const company = await prisma.company.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
      },
      include: {
        category: {
          include: { industry: true },
        },
        capabilities: true,
        products: true,
        services: true,
        certifications: true,
        industriesServed: true,
        supplyNeeds: true,
        savedIn: userOrgId
          ? {
              where: { organizationId: userOrgId },
              include: { user: { select: { fullName: true } } },
            }
          : false,
      },
    });

    if (!company) {
      throw new Error('Company not found.');
    }

    const savedRecord = userOrgId && (company as any).savedIn?.length > 0 ? (company as any).savedIn[0] : null;

    return {
      ...company,
      isSaved: !!savedRecord,
      savedDetails: savedRecord,
    };
  }

  static async getSearchSuggestions(query: string) {
    if (!query || query.trim().length < 2) {
      return { companies: [], capabilities: [], products: [] };
    }

    const q = query.trim();

    const [companies, capabilities, products] = await Promise.all([
      prisma.company.findMany({
        where: { name: { contains: q } },
        select: { id: true, name: true, slug: true, hqCountry: true },
        take: 5,
      }),
      prisma.companyCapability.findMany({
        where: { name: { contains: q } },
        select: { name: true, capabilityType: true },
        distinct: ['name'],
        take: 5,
      }),
      prisma.companyProduct.findMany({
        where: { name: { contains: q } },
        select: { name: true, category: true },
        distinct: ['name'],
        take: 5,
      }),
    ]);

    return {
      companies,
      capabilities: capabilities.map((c) => ({ label: c.name, type: c.capabilityType })),
      products: products.map((p) => ({ label: p.name, category: p.category })),
    };
  }

  static async getTaxonomy() {
    return prisma.industry.findMany({
      include: {
        categories: {
          include: {
            _count: {
              select: { companies: true },
            },
          },
        },
      },
    });
  }

  static async verifyCompany(
    companyId: string,
    verificationStatus: 'UNVERIFIED' | 'CLAIMED' | 'VERIFIED',
    verificationNotes?: string,
    adminUserId?: string,
    adminEmail?: string
  ) {
    const updated = await prisma.company.update({
      where: { id: companyId },
      data: {
        verificationStatus,
        verificationNotes,
        updatedAt: new Date(),
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        userEmail: adminEmail,
        action: 'COMPANY_VERIFY',
        entityType: 'Company',
        entityId: companyId,
        detailsJson: JSON.stringify({
          status: verificationStatus,
          notes: verificationNotes,
          companyName: updated.name,
        }),
      },
    });

    return updated;
  }
}
