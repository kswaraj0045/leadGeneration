import Papa from 'papaparse';
import ExcelJS from 'exceljs';

export interface ExportableCompany {
  'Company Name': string;
  'Industry Category': string;
  'Company Type': string;
  'City': string;
  'State': string;
  'Country': string;
  'Website': string;
  'Contact Email': string;
  'Contact Phone': string;
  'Employee Count': string;
  'Year Established': number | string;
  'Verification Status': string;
  'Data Source': string;
  'Capabilities': string;
  'Certifications': string;
  'Products': string;
  'Pipeline Status'?: string;
  'Notes'?: string;
}

export class ExportService {
  static formatCompanyForExport(company: any, savedInfo?: any): ExportableCompany {
    const caps = (company.capabilities || []).map((c: any) => c.name).join('; ');
    const certs = (company.certifications || []).map((c: any) => c.name).join('; ');
    const prods = (company.products || []).map((p: any) => p.name).join('; ');

    return {
      'Company Name': company.name,
      'Industry Category': company.category?.name || 'General',
      'Company Type': company.companyType,
      'City': company.hqCity,
      'State': company.hqState,
      'Country': company.hqCountry,
      'Website': company.website || 'N/A',
      'Contact Email': company.contactEmail || 'N/A',
      'Contact Phone': company.contactPhone || 'N/A',
      'Employee Count': company.employeeCountRange || 'N/A',
      'Year Established': company.yearEstablished || 'N/A',
      'Verification Status': company.verificationStatus,
      'Data Source': company.dataSource,
      'Capabilities': caps || 'None listed',
      'Certifications': certs || 'None listed',
      'Products': prods || 'None listed',
      'Pipeline Status': savedInfo?.status || undefined,
      'Notes': savedInfo?.notes || undefined,
    };
  }

  static toCSV(records: ExportableCompany[]): string {
    return Papa.unparse(records);
  }

  static async toExcel(records: ExportableCompany[], sheetTitle = 'Companies'): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'VIASET Intelligence Platform';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(sheetTitle, {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    sheet.columns = [
      { header: 'Company Name', key: 'Company Name', width: 28 },
      { header: 'Industry Category', key: 'Industry Category', width: 24 },
      { header: 'Company Type', key: 'Company Type', width: 16 },
      { header: 'City', key: 'City', width: 16 },
      { header: 'State', key: 'State', width: 16 },
      { header: 'Country', key: 'Country', width: 16 },
      { header: 'Verification Status', key: 'Verification Status', width: 18 },
      { header: 'Capabilities', key: 'Capabilities', width: 35 },
      { header: 'Certifications', key: 'Certifications', width: 24 },
      { header: 'Products', key: 'Products', width: 30 },
      { header: 'Website', key: 'Website', width: 25 },
      { header: 'Contact Email', key: 'Contact Email', width: 25 },
      { header: 'Pipeline Status', key: 'Pipeline Status', width: 16 },
      { header: 'Notes', key: 'Notes', width: 30 },
    ];

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F766E' }, // Teal accent
    };

    records.forEach((rec) => {
      sheet.addRow(rec);
    });

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }
}
