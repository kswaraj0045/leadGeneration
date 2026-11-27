import Papa from 'papaparse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ParsedCompanyRow {
  name: string;
  categorySlug: string;
  companyType: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  description: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  employeeCountRange?: string;
  yearEstablished?: string;
  capabilities?: string; // Semicolon-separated
  certifications?: string; // Semicolon-separated
  products?: string; // Semicolon-separated
}

export interface CSVPreviewResult {
  totalRows: number;
  validRows: ParsedCompanyRow[];
  duplicateRows: { row: ParsedCompanyRow; reason: string }[];
  errorRows: { row: any; errors: string[] }[];
}

export class ImportService {
  static async previewCSV(csvContent: string): Promise<CSVPreviewResult> {
    const parsed = Papa.parse<ParsedCompanyRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data;
    const validRows: ParsedCompanyRow[] = [];
    const duplicateRows: { row: ParsedCompanyRow; reason: string }[] = [];
    const errorRows: { row: any; errors: string[] }[] = [];

    // Preload categories and existing company names
    const [existingCompanies, categories] = await Promise.all([
      prisma.company.findMany({ select: { name: true, slug: true } }),
      prisma.companyCategory.findMany({ select: { slug: true } }),
    ]);

    const existingNames = new Set(existingCompanies.map((c) => c.name.toLowerCase()));
    const validCatSlugs = new Set(categories.map((c) => c.slug.toLowerCase()));

    rows.forEach((row, index) => {
      const errors: string[] = [];
      if (!row.name || !row.name.trim()) errors.push('Company name is required');
      if (!row.categorySlug || !row.categorySlug.trim()) errors.push('Category slug is required');
      else if (!validCatSlugs.has(row.categorySlug.trim().toLowerCase())) {
        errors.push(`Category "${row.categorySlug}" does not match any known industry category`);
      }
      if (!row.companyType || !row.companyType.trim()) errors.push('Company type is required');
      if (!row.hqCity || !row.hqCity.trim()) errors.push('City is required');
      if (!row.hqCountry || !row.hqCountry.trim()) errors.push('Country is required');
      if (!row.description || !row.description.trim()) errors.push('Description is required');

      if (errors.length > 0) {
        errorRows.push({ row: { ...row, _rowIndex: index + 2 }, errors });
        return;
      }

      // Check duplicates
      if (existingNames.has(row.name.trim().toLowerCase())) {
        duplicateRows.push({
          row,
          reason: `A company with name "${row.name}" already exists in the database.`,
        });
        return;
      }

      validRows.push(row);
    });

    return {
      totalRows: rows.length,
      validRows,
      duplicateRows,
      errorRows,
    };
  }

  static async commitImport(
    validRows: ParsedCompanyRow[],
    userId?: string,
    userEmail?: string,
    fileName = 'dataset_import.csv'
  ) {
    const categories = await prisma.companyCategory.findMany({ select: { id: true, slug: true } });
    const catMap = new Map(categories.map((c) => [c.slug.toLowerCase(), c.id]));

    let importedCount = 0;

    for (const row of validRows) {
      const categoryId = catMap.get(row.categorySlug.trim().toLowerCase());
      if (!categoryId) continue;

      const slug =
        row.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') +
        '-' +
        Math.random().toString(36).substring(2, 6);

      const created = await prisma.company.create({
        data: {
          name: row.name.trim(),
          slug,
          categoryId,
          companyType: row.companyType.trim(),
          hqCity: row.hqCity.trim(),
          hqState: row.hqState?.trim() || '',
          hqCountry: row.hqCountry.trim(),
          description: row.description.trim(),
          website: row.website?.trim() || null,
          contactEmail: row.contactEmail?.trim() || null,
          contactPhone: row.contactPhone?.trim() || null,
          employeeCountRange: row.employeeCountRange?.trim() || null,
          yearEstablished: row.yearEstablished ? parseInt(row.yearEstablished, 10) : null,
          verificationStatus: 'UNVERIFIED',
          dataSource: 'CSV Dataset Ingestion',
          isDemonstration: false,
        },
      });

      // Add capabilities if provided
      if (row.capabilities && row.capabilities.trim()) {
        const caps = row.capabilities.split(';').map((s) => s.trim()).filter(Boolean);
        if (caps.length > 0) {
          await prisma.companyCapability.createMany({
            data: caps.map((c) => ({
              companyId: created.id,
              capabilityType: 'General',
              name: c,
            })),
          });
        }
      }

      // Add certifications if provided
      if (row.certifications && row.certifications.trim()) {
        const certs = row.certifications.split(';').map((s) => s.trim()).filter(Boolean);
        if (certs.length > 0) {
          await prisma.companyCertification.createMany({
            data: certs.map((c) => ({
              companyId: created.id,
              name: c,
            })),
          });
        }
      }

      // Add products if provided
      if (row.products && row.products.trim()) {
        const prods = row.products.split(';').map((s) => s.trim()).filter(Boolean);
        if (prods.length > 0) {
          await prisma.companyProduct.createMany({
            data: prods.map((p) => ({
              companyId: created.id,
              name: p,
            })),
          });
        }
      }

      importedCount++;
    }

    // Record DataImport history
    const dataImport = await prisma.dataImport.create({
      data: {
        fileName,
        fileFormat: 'CSV',
        totalRows: validRows.length,
        importedRows: importedCount,
        failedRows: 0,
        duplicateRows: 0,
        status: 'COMPLETED',
        createdByUserId: userId,
        completedAt: new Date(),
      },
    });

    // Record AuditLog
    await prisma.auditLog.create({
      data: {
        userId,
        userEmail,
        action: 'DATASET_IMPORT',
        entityType: 'DataImport',
        entityId: dataImport.id,
        detailsJson: JSON.stringify({
          fileName,
          importedRows: importedCount,
        }),
      },
    });

    return {
      importedCount,
      dataImportId: dataImport.id,
    };
  }
}
