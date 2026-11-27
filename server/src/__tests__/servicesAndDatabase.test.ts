import { describe, it, expect } from 'vitest';
import { CompanyService } from '../services/companyService.js';
import { AuthService } from '../services/authService.js';
import { ImportService } from '../services/importService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('VIASET Database & Service Layer Tests', () => {
  it('retrieves seeded companies from SQLite database', async () => {
    const result = await CompanyService.findCompanies({ limit: 10 });
    expect(result.companies).toBeDefined();
    expect(result.companies.length).toBeGreaterThan(0);
    expect(result.pagination.total).toBeGreaterThanOrEqual(20);
  });

  it('filters companies by category correctly', async () => {
    const result = await CompanyService.findCompanies({ category: 'semiconductor-foundry' });
    expect(result.companies.length).toBeGreaterThan(0);
    result.companies.forEach((c) => {
      expect(c.category?.slug).toBe('semiconductor-foundry');
    });
  });

  it('filters companies by text query on capabilities', async () => {
    const result = await CompanyService.findCompanies({ q: '28nm' });
    expect(result.companies.length).toBeGreaterThan(0);
  });

  it('fetches complete taxonomy tree with categories and company counts', async () => {
    const taxonomy = await CompanyService.getTaxonomy();
    expect(taxonomy.length).toBeGreaterThan(0);
    const foundryInd = taxonomy.find((t) => t.slug === 'semiconductors-microelectronics');
    expect(foundryInd).toBeDefined();
    expect(foundryInd?.categories.length).toBeGreaterThan(0);
  });

  it('authenticates seeded Platform Admin via AuthService', async () => {
    const { user, token } = await AuthService.login('admin@viaset.io', 'Admin123!');
    expect(user).toBeDefined();
    expect(user.role).toBe('ADMIN');
    expect(token).toBeDefined();

    const profile = await AuthService.getProfile(user.id);
    expect(profile.email).toBe('admin@viaset.io');
    expect(profile.organization?.name).toBe('VIASET Operations & Data Verification');
  });

  it('validates CSV dataset import and detects duplicates correctly', async () => {
    const sampleCsv = `name,categorySlug,companyType,hqCity,hqState,hqCountry,description
Semi-Conductor Laboratory (SCL),semiconductor-foundry,Foundry,Mohali,Punjab,India,"Existing duplicate company"
Bharat Innovative Photonics,semiconductor-foundry,Foundry,Hyderabad,Telangana,India,"New silicon photonics fab"`;

    const preview = await ImportService.previewCSV(sampleCsv);
    expect(preview.totalRows).toBe(2);
    expect(preview.duplicateRows.length).toBe(1); // SCL is already in the database
    expect(preview.validRows.length).toBe(1); // Bharat Innovative Photonics is new
    expect(preview.duplicateRows[0].row.name).toBe('Semi-Conductor Laboratory (SCL)');
    expect(preview.validRows[0].name).toBe('Bharat Innovative Photonics');
  });
});
