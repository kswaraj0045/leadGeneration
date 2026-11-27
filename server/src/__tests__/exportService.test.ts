import { describe, it, expect } from 'vitest';
import { ExportService } from '../services/exportService.js';

describe('ExportService', () => {
  const mockCompany = {
    name: 'Bharat Semi Test',
    category: { name: 'Semiconductor Foundry' },
    companyType: 'Foundry',
    hqCity: 'Bengaluru',
    hqState: 'Karnataka',
    hqCountry: 'India',
    website: 'https://bharatsemi.example',
    contactEmail: 'info@bharatsemi.example',
    contactPhone: '+91-80-12345678',
    employeeCountRange: '500-1000',
    yearEstablished: 2020,
    verificationStatus: 'VERIFIED',
    dataSource: 'Official ISM',
    capabilities: [{ name: '28nm Node' }, { name: 'ISO Class 5' }],
    certifications: [{ name: 'ISO 9001:2015' }, { name: 'IATF 16949' }],
    products: [{ name: 'MCU-32' }],
  };

  it('formats company record correctly for export', () => {
    const formatted = ExportService.formatCompanyForExport(mockCompany);

    expect(formatted['Company Name']).toBe('Bharat Semi Test');
    expect(formatted['Industry Category']).toBe('Semiconductor Foundry');
    expect(formatted['Capabilities']).toContain('28nm Node; ISO Class 5');
    expect(formatted['Certifications']).toContain('ISO 9001:2015; IATF 16949');
    expect(formatted['Products']).toBe('MCU-32');
  });

  it('generates valid CSV string', () => {
    const formatted = [ExportService.formatCompanyForExport(mockCompany)];
    const csv = ExportService.toCSV(formatted);

    expect(csv).toContain('Bharat Semi Test');
    expect(csv).toContain('Semiconductor Foundry');
    expect(csv).toContain('Company Name');
  });

  it('generates non-empty Excel buffer', async () => {
    const formatted = [ExportService.formatCompanyForExport(mockCompany)];
    const buffer = await ExportService.toExcel(formatted, 'TestSheet');

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(1000);
  });
});
