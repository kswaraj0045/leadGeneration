export type UserRole = 'ADMIN' | 'COMPANY_ADMIN' | 'COMPANY_USER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId?: string | null;
  organization?: Organization | null;
  createdAt: string;
}

export type SubscriptionPlanCode = 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  website?: string | null;
  country: string;
  planCode: SubscriptionPlanCode;
  createdAt: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  categories?: CompanyCategory[];
}

export interface CompanyCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  industryId: string;
  industry?: Industry;
  _count?: {
    companies: number;
  };
}

export type VerificationStatus = 'UNVERIFIED' | 'CLAIMED' | 'VERIFIED';

export interface CompanyProduct {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  partNumberOrSpec?: string | null;
}

export interface CompanyService {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  capabilityLevel?: string | null;
}

export interface CompanyCapability {
  id: string;
  capabilityType: string;
  name: string;
  specifications?: string | null;
}

export interface CompanyCertification {
  id: string;
  name: string;
  issuingBody?: string | null;
  validUntil?: string | null;
}

export interface CompanyIndustryServed {
  id: string;
  industryName: string;
}

export interface CompanySupplyNeed {
  id: string;
  needType: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: CompanyCategory;
  companyType: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  website?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  employeeCountRange?: string | null;
  yearEstablished?: number | null;
  revenueRange?: string | null;
  verificationStatus: VerificationStatus;
  verificationNotes?: string | null;
  dataSource: string;
  isDemonstration: boolean;
  logoUrl?: string | null;
  products?: CompanyProduct[];
  services?: CompanyService[];
  capabilities?: CompanyCapability[];
  certifications?: CompanyCertification[];
  industriesServed?: CompanyIndustryServed[];
  supplyNeeds?: CompanySupplyNeed[];
  createdAt: string;
  updatedAt: string;
}

export type PipelineStage = 'EVALUATING' | 'CONTACTED' | 'PARTNER' | 'SUPPLIER' | 'ARCHIVED';

export interface SavedCompany {
  id: string;
  organizationId: string;
  userId: string;
  user?: { id: string; fullName: string; email: string };
  companyId: string;
  company: Company;
  status: PipelineStage;
  notes?: string | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  queryParamsJson: string;
  alertFrequency: string;
  lastRunAt?: string | null;
  createdAt: string;
}

export interface MatchingQueryRequest {
  targetServices?: string[];
  targetProducts?: string[];
  targetCapabilities?: string[];
  preferredCountries?: string[];
  preferredIndustries?: string[];
  requiredCertifications?: string[];
  customWeights?: {
    capabilities?: number;
    products?: number;
    industry?: number;
    location?: number;
    certifications?: number;
  };
}

export interface MatchBreakdown {
  capabilitiesScore: number;
  productsScore: number;
  industryScore: number;
  locationScore: number;
  certificationsScore: number;
}

export interface MatchingResultItem {
  company: Company;
  totalScore: number; // 0 - 100
  breakdown: MatchBreakdown;
  matchReasons: string[];
  gapNotes: string[];
}

export interface MonthlyUsage {
  searchesUsed: number;
  exportsUsed: number;
  savedCompaniesCount: number;
  maxMonthlySearches: number;
  maxSavedCompanies: number;
  maxMonthlyExports: number;
  canExportExcel: boolean;
  canAccessAdvancedFilters: boolean;
  planCode: SubscriptionPlanCode;
}
