import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Valid work email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name is required'),
  organizationName: z.string().min(2, 'Organization name is required'),
  country: z.string().optional().default('India'),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const companyQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  companyType: z.string().optional(),
  country: z.string().optional(),
  certification: z.string().optional(),
  verificationStatus: z.enum(['UNVERIFIED', 'CLAIMED', 'VERIFIED']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(12),
  sortBy: z.enum(['name', 'yearEstablished', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const matchingQuerySchema = z.object({
  targetServices: z.array(z.string()).optional().default([]),
  targetProducts: z.array(z.string()).optional().default([]),
  targetCapabilities: z.array(z.string()).optional().default([]),
  preferredCountries: z.array(z.string()).optional().default([]),
  preferredIndustries: z.array(z.string()).optional().default([]),
  requiredCertifications: z.array(z.string()).optional().default([]),
  customWeights: z
    .object({
      capabilities: z.number().min(0).max(1).optional(),
      products: z.number().min(0).max(1).optional(),
      industry: z.number().min(0).max(1).optional(),
      location: z.number().min(0).max(1).optional(),
      certifications: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export const saveCompanySchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  status: z.enum(['EVALUATING', 'CONTACTED', 'PARTNER', 'SUPPLIER', 'ARCHIVED']).optional().default('EVALUATING'),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export const updateSavedCompanySchema = z.object({
  status: z.enum(['EVALUATING', 'CONTACTED', 'PARTNER', 'SUPPLIER', 'ARCHIVED']).optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export const savedSearchSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  queryParams: z.record(z.any()),
  alertFrequency: z.enum(['NONE', 'DAILY', 'WEEKLY']).optional().default('NONE'),
});

export const verifyCompanySchema = z.object({
  status: z.enum(['UNVERIFIED', 'CLAIMED', 'VERIFIED']),
  notes: z.string().optional(),
});

export const companyCreateUpdateSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  description: z.string().min(10, 'Detailed description is required'),
  categoryId: z.string().min(1, 'Valid category is required'),
  companyType: z.string().min(2, 'Company type is required'),
  hqCity: z.string().min(2, 'City is required'),
  hqState: z.string().min(2, 'State or province is required'),
  hqCountry: z.string().min(2, 'Country is required'),
  website: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional().or(z.literal('')),
  employeeCountRange: z.string().optional(),
  yearEstablished: z.number().int().optional(),
  revenueRange: z.string().optional(),
  verificationStatus: z.enum(['UNVERIFIED', 'CLAIMED', 'VERIFIED']).optional(),
  verificationNotes: z.string().optional(),
  dataSource: z.string().optional(),
  isDemonstration: z.boolean().optional(),
  products: z.array(z.object({ name: z.string(), category: z.string().optional(), description: z.string().optional(), partNumberOrSpec: z.string().optional() })).optional(),
  services: z.array(z.object({ name: z.string(), category: z.string().optional(), description: z.string().optional(), capabilityLevel: z.string().optional() })).optional(),
  capabilities: z.array(z.object({ capabilityType: z.string(), name: z.string(), specifications: z.string().optional() })).optional(),
  certifications: z.array(z.object({ name: z.string(), issuingBody: z.string().optional(), validUntil: z.string().optional() })).optional(),
  industriesServed: z.array(z.string()).optional(),
  supplyNeeds: z.array(z.object({ needType: z.string(), description: z.string() })).optional(),
});
