import { Company, CompanyCapability, CompanyProduct, CompanyService, CompanyCertification, CompanyIndustryServed } from '@prisma/client';

export interface CompanyWithRelations extends Company {
  capabilities: CompanyCapability[];
  products: CompanyProduct[];
  services: CompanyService[];
  certifications: CompanyCertification[];
  industriesServed: CompanyIndustryServed[];
  category?: { name: string; slug: string };
}

export interface MatchingWeights {
  capabilities: number;
  products: number;
  industry: number;
  location: number;
  certifications: number;
}

export interface MatchingRequirements {
  targetServices?: string[];
  targetProducts?: string[];
  targetCapabilities?: string[];
  preferredCountries?: string[];
  preferredIndustries?: string[];
  requiredCertifications?: string[];
  customWeights?: Partial<MatchingWeights>;
}

export interface MatchBreakdown {
  capabilitiesScore: number;
  productsScore: number;
  industryScore: number;
  locationScore: number;
  certificationsScore: number;
}

export interface CompanyMatchResult {
  company: CompanyWithRelations;
  totalScore: number; // 0 to 100
  breakdown: MatchBreakdown;
  matchReasons: string[];
  gapNotes: string[];
}

export class TransparentMatchingEngine {
  private defaultWeights: MatchingWeights = {
    capabilities: 0.35,
    products: 0.25,
    industry: 0.20,
    location: 0.10,
    certifications: 0.10,
  };

  /**
   * Evaluates and ranks companies against requirement criteria using an explainable, weighted algorithm.
   */
  public evaluate(companies: CompanyWithRelations[], req: MatchingRequirements): CompanyMatchResult[] {
    const weights: MatchingWeights = {
      ...this.defaultWeights,
      ...(req.customWeights || {}),
    };

    // Normalize weights to sum to 1.0
    const totalWeight =
      weights.capabilities +
      weights.products +
      weights.industry +
      weights.location +
      weights.certifications;

    const normalizedWeights: MatchingWeights = {
      capabilities: weights.capabilities / totalWeight,
      products: weights.products / totalWeight,
      industry: weights.industry / totalWeight,
      location: weights.location / totalWeight,
      certifications: weights.certifications / totalWeight,
    };

    const results: CompanyMatchResult[] = companies.map((company) => {
      return this.scoreCompany(company, req, normalizedWeights);
    });

    // Rank descending by totalScore
    return results.sort((a, b) => b.totalScore - a.totalScore);
  }

  private scoreCompany(
    company: CompanyWithRelations,
    req: MatchingRequirements,
    weights: MatchingWeights
  ): CompanyMatchResult {
    const matchReasons: string[] = [];
    const gapNotes: string[] = [];

    // 1. Capabilities & Services Matching (Weight: 35%)
    let capabilitiesScore = 100;
    const targetCaps = [...(req.targetCapabilities || []), ...(req.targetServices || [])];
    if (targetCaps.length > 0) {
      let matchedCount = 0;
      targetCaps.forEach((target) => {
        const targetLower = target.toLowerCase();
        const capMatched = company.capabilities.some(
          (c) =>
            c.name.toLowerCase().includes(targetLower) ||
            (c.specifications && c.specifications.toLowerCase().includes(targetLower)) ||
            c.capabilityType.toLowerCase().includes(targetLower)
        );
        const srvMatched = company.services.some(
          (s) =>
            s.name.toLowerCase().includes(targetLower) ||
            (s.description && s.description.toLowerCase().includes(targetLower)) ||
            (s.category && s.category.toLowerCase().includes(targetLower))
        );

        if (capMatched || srvMatched) {
          matchedCount++;
          matchReasons.push(`Provides technical capability or service: "${target}"`);
        } else {
          gapNotes.push(`Does not explicitly list capability/service: "${target}"`);
        }
      });
      capabilitiesScore = Math.round((matchedCount / targetCaps.length) * 100);
    }

    // 2. Products Matching (Weight: 25%)
    let productsScore = 100;
    const targetProds = req.targetProducts || [];
    if (targetProds.length > 0) {
      let matchedCount = 0;
      targetProds.forEach((prod) => {
        const prodLower = prod.toLowerCase();
        const matched = company.products.some(
          (p) =>
            p.name.toLowerCase().includes(prodLower) ||
            (p.description && p.description.toLowerCase().includes(prodLower)) ||
            (p.category && p.category.toLowerCase().includes(prodLower)) ||
            (p.partNumberOrSpec && p.partNumberOrSpec.toLowerCase().includes(prodLower))
        );
        if (matched) {
          matchedCount++;
          matchReasons.push(`Manufactures product: "${prod}"`);
        } else {
          gapNotes.push(`Catalog does not list: "${prod}"`);
        }
      });
      productsScore = Math.round((matchedCount / targetProds.length) * 100);
    }

    // 3. Industry Segment Matching (Weight: 20%)
    let industryScore = 100;
    const targetIndustries = req.preferredIndustries || [];
    if (targetIndustries.length > 0) {
      let matchedCount = 0;
      targetIndustries.forEach((ind) => {
        const indLower = ind.toLowerCase();
        const matched =
          company.industriesServed.some((s) => s.industryName.toLowerCase().includes(indLower)) ||
          company.companyType.toLowerCase().includes(indLower) ||
          (company.category?.name && company.category.name.toLowerCase().includes(indLower));

        if (matched) {
          matchedCount++;
          matchReasons.push(`Serves requested market sector: "${ind}"`);
        } else {
          gapNotes.push(`Does not specifically focus on: "${ind}"`);
        }
      });
      industryScore = Math.round((matchedCount / targetIndustries.length) * 100);
    }

    // 4. Geographical / Location Fit (Weight: 10%)
    let locationScore = 100;
    const preferredCountries = req.preferredCountries || [];
    if (preferredCountries.length > 0) {
      const match = preferredCountries.some(
        (c) =>
          company.hqCountry.toLowerCase() === c.toLowerCase() ||
          company.hqState.toLowerCase() === c.toLowerCase() ||
          company.hqCity.toLowerCase() === c.toLowerCase()
      );
      if (match) {
        locationScore = 100;
        matchReasons.push(`Headquartered in preferred location: ${company.hqCity}, ${company.hqCountry}`);
      } else {
        locationScore = 30; // Partial score for global reach
        gapNotes.push(`Location is outside target regions (located in ${company.hqCountry})`);
      }
    }

    // 5. Certifications Compliance (Weight: 10%)
    let certificationsScore = 100;
    const reqCerts = req.requiredCertifications || [];
    if (reqCerts.length > 0) {
      let matchedCount = 0;
      reqCerts.forEach((cert) => {
        const certLower = cert.toLowerCase();
        const matched = company.certifications.some((c) =>
          c.name.toLowerCase().includes(certLower)
        );
        if (matched) {
          matchedCount++;
          matchReasons.push(`Holds required quality certification: "${cert}"`);
        } else {
          gapNotes.push(`Missing compliance certificate: "${cert}"`);
        }
      });
      certificationsScore = Math.round((matchedCount / reqCerts.length) * 100);
    }

    // Calculate weighted total score
    const totalScore = Math.round(
      capabilitiesScore * weights.capabilities +
        productsScore * weights.products +
        industryScore * weights.industry +
        locationScore * weights.location +
        certificationsScore * weights.certifications
    );

    return {
      company,
      totalScore: Math.min(100, Math.max(0, totalScore)),
      breakdown: {
        capabilitiesScore,
        productsScore,
        industryScore,
        locationScore,
        certificationsScore,
      },
      matchReasons,
      gapNotes,
    };
  }
}

export const matchingEngine = new TransparentMatchingEngine();
