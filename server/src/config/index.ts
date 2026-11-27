import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET || 'viaset_enterprise_jwt_secret_key_super_secure_b2b_platform_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    code: 'BASIC',
    name: 'Basic Starter',
    maxMonthlySearches: 50,
    maxSavedCompanies: 25,
    maxMonthlyExports: 5,
    canExportExcel: false,
    canAccessAdvancedFilters: false,
    priceMonthly: 0,
  },
  PRO: {
    code: 'PRO',
    name: 'Professional Tier',
    maxMonthlySearches: 500,
    maxSavedCompanies: 200,
    maxMonthlyExports: 50,
    canExportExcel: true,
    canAccessAdvancedFilters: true,
    priceMonthly: 499,
  },
  ENTERPRISE: {
    code: 'ENTERPRISE',
    name: 'Enterprise Intelligence',
    maxMonthlySearches: 5000,
    maxSavedCompanies: 2000,
    maxMonthlyExports: 500,
    canExportExcel: true,
    canAccessAdvancedFilters: true,
    priceMonthly: 1499,
  },
} as const;
