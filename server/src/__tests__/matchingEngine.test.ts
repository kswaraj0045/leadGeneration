import { describe, it, expect } from 'vitest';
import { TransparentMatchingEngine, CompanyWithRelations } from '../services/matchingEngine.js';

describe('TransparentMatchingEngine', () => {
  const engine = new TransparentMatchingEngine();

  const mockCompanies: CompanyWithRelations[] = [
    {
      id: 'comp-1',
      name: 'Alpha Semi Foundry',
      slug: 'alpha-semi-foundry',
      description: 'Foundry in India producing 28nm chips',
      categoryId: 'cat-1',
      companyType: 'Foundry',
      hqCity: 'Mohali',
      hqState: 'Punjab',
      hqCountry: 'India',
      website: 'https://alphasemi.com',
      contactEmail: 'sales@alphasemi.com',
      contactPhone: null,
      employeeCountRange: '500-1000',
      yearEstablished: 2010,
      revenueRange: '$50M-$100M',
      verificationStatus: 'VERIFIED',
      verificationNotes: null,
      dataSource: 'Registry',
      isDemonstration: false,
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      capabilities: [
        { id: 'cap-1', companyId: 'comp-1', capabilityType: 'Process Node', name: '28nm HKMG', specifications: '300mm wafer line', createdAt: new Date() },
        { id: 'cap-2', companyId: 'comp-1', capabilityType: 'Cleanroom', name: 'Class 10 Cleanroom', specifications: null, createdAt: new Date() },
      ],
      products: [
        { id: 'prod-1', companyId: 'comp-1', name: 'RISC-V Microcontrollers', category: 'Microcontrollers', description: 'Low power', partNumberOrSpec: 'RV64', createdAt: new Date() },
      ],
      services: [
        { id: 'srv-1', companyId: 'comp-1', name: 'Wafer Probing', category: 'Testing', description: 'Tri-temp testing', capabilityLevel: 'Production', createdAt: new Date() },
      ],
      certifications: [
        { id: 'cert-1', companyId: 'comp-1', name: 'ISO 9001:2015', issuingBody: 'BSI', validUntil: '2027', createdAt: new Date() },
        { id: 'cert-2', companyId: 'comp-1', name: 'IATF 16949', issuingBody: 'TUV', validUntil: '2027', createdAt: new Date() },
      ],
      industriesServed: [
        { id: 'ind-1', companyId: 'comp-1', industryName: 'Automotive', createdAt: new Date() },
        { id: 'ind-2', companyId: 'comp-1', industryName: 'Industrial IoT', createdAt: new Date() },
      ],
    },
    {
      id: 'comp-2',
      name: 'Beta Packaging Works',
      slug: 'beta-packaging-works',
      description: 'Packaging house in Taiwan',
      categoryId: 'cat-2',
      companyType: 'OSAT',
      hqCity: 'Hsinchu',
      hqState: 'Hsinchu County',
      hqCountry: 'Taiwan',
      website: null,
      contactEmail: null,
      contactPhone: null,
      employeeCountRange: '100-200',
      yearEstablished: 2015,
      revenueRange: '$10M-$20M',
      verificationStatus: 'CLAIMED',
      verificationNotes: null,
      dataSource: 'Registry',
      isDemonstration: false,
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      capabilities: [
        { id: 'cap-3', companyId: 'comp-2', capabilityType: 'Packaging', name: 'QFN Leadless', specifications: null, createdAt: new Date() },
      ],
      products: [],
      services: [
        { id: 'srv-2', companyId: 'comp-2', name: 'QFN Packaging Service', category: 'OSAT', description: 'Wire bond packaging', capabilityLevel: 'Prototype', createdAt: new Date() },
      ],
      certifications: [
        { id: 'cert-3', companyId: 'comp-2', name: 'ISO 9001:2015', issuingBody: 'SGS', validUntil: '2026', createdAt: new Date() },
      ],
      industriesServed: [
        { id: 'ind-3', companyId: 'comp-2', industryName: 'Consumer Electronics', createdAt: new Date() },
      ],
    },
  ];

  it('ranks higher when capabilities, products and location match requirements', () => {
    const results = engine.evaluate(mockCompanies, {
      targetCapabilities: ['28nm HKMG'],
      targetProducts: ['RISC-V Microcontrollers'],
      preferredCountries: ['India'],
      preferredIndustries: ['Automotive'],
      requiredCertifications: ['IATF 16949'],
    });

    expect(results).toHaveLength(2);
    expect(results[0].company.name).toBe('Alpha Semi Foundry');
    expect(results[0].totalScore).toBe(100);
    expect(results[0].matchReasons.length).toBeGreaterThan(0);
    expect(results[0].breakdown.capabilitiesScore).toBe(100);
    expect(results[0].breakdown.locationScore).toBe(100);

    // Beta should rank lower
    expect(results[1].company.name).toBe('Beta Packaging Works');
    expect(results[1].totalScore).toBeLessThan(50);
    expect(results[1].gapNotes.length).toBeGreaterThan(0);
  });

  it('handles empty query parameters gracefully with neutral scoring', () => {
    const results = engine.evaluate(mockCompanies, {});
    expect(results).toHaveLength(2);
    expect(results[0].totalScore).toBe(100);
  });

  it('applies custom weights properly', () => {
    const results = engine.evaluate(mockCompanies, {
      targetCapabilities: ['QFN Leadless'],
      preferredCountries: ['Taiwan'],
      customWeights: {
        capabilities: 0.8,
        location: 0.2,
        products: 0,
        industry: 0,
        certifications: 0,
      },
    });

    expect(results[0].company.name).toBe('Beta Packaging Works');
    expect(results[0].totalScore).toBe(100);
  });
});
