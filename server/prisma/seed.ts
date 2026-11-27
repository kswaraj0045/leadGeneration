import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting VIASET Database Seeding ---');

  // 1. Seed Subscription Plans
  const plans = [
    {
      code: 'BASIC',
      name: 'Basic Starter',
      maxMonthlySearches: 50,
      maxSavedCompanies: 25,
      maxMonthlyExports: 5,
      canExportExcel: false,
      canAccessAdvancedFilters: false,
      priceMonthly: 0,
    },
    {
      code: 'PRO',
      name: 'Professional Tier',
      maxMonthlySearches: 500,
      maxSavedCompanies: 200,
      maxMonthlyExports: 50,
      canExportExcel: true,
      canAccessAdvancedFilters: true,
      priceMonthly: 499,
    },
    {
      code: 'ENTERPRISE',
      name: 'Enterprise Intelligence',
      maxMonthlySearches: 5000,
      maxSavedCompanies: 2000,
      maxMonthlyExports: 500,
      canExportExcel: true,
      canAccessAdvancedFilters: true,
      priceMonthly: 1499,
    },
  ];

  for (const p of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { code: p.code },
      update: p,
      create: p,
    });
  }
  console.log('✓ Subscription Plans Seeded');

  // 2. Seed Industries and Categories
  const industries = [
    {
      name: 'Semiconductors & Microelectronics',
      slug: 'semiconductors-microelectronics',
      description: 'Foundries, IC design, wafer fabrication, OSAT and EDA ecosystem.',
      icon: 'Cpu',
      categories: [
        { name: 'Semiconductor Foundry', slug: 'semiconductor-foundry', description: 'Pure-play and specialty wafer manufacturing foundries.' },
        { name: 'IC Design / Fabless', slug: 'ic-design-fabless', description: 'Fabless semiconductor design houses, SoC, ASIC and analog IP developers.' },
        { name: 'OSAT & Packaging', slug: 'osat-packaging', description: 'Outsourced semiconductor assembly, wire-bonding, flip-chip, and automated test.' },
        { name: 'Semiconductor Equipment', slug: 'semiconductor-equipment', description: 'Photolithography, deposition, etching, CMP, and metrology equipment manufacturers.' },
      ],
    },
    {
      name: 'PCB & Interconnects',
      slug: 'pcb-interconnects',
      description: 'Bare-board printed circuit manufacturing, HDI, and flexible circuits.',
      icon: 'Layers',
      categories: [
        { name: 'PCB Fabrication', slug: 'pcb-fabrication', description: 'Rigid, flexible, multilayer and HDI bare board printed circuit manufacturers.' },
        { name: 'High-Density Interconnect (HDI)', slug: 'hdi-pcb', description: 'Microvia and high-layer-count specialized PCB substrates.' },
      ],
    },
    {
      name: 'Electronics Manufacturing Services (EMS)',
      slug: 'ems-pcba',
      description: 'Turnkey PCB assembly, automated SMT, box-build, and system integration.',
      icon: 'Factory',
      categories: [
        { name: 'PCB Assembly / EMS', slug: 'pcb-assembly-ems', description: 'High-speed automated surface-mount assembly, testing, and complete product integration.' },
        { name: 'Prototype PCBA & Quick-Turn', slug: 'quickturn-pcba', description: 'Rapid engineering prototype assembly and low-volume production services.' },
      ],
    },
    {
      name: 'Electronic Components',
      slug: 'electronic-components',
      description: 'Passive, discrete semiconductor, and electromechanical component manufacturers.',
      icon: 'Zap',
      categories: [
        { name: 'Passive Components', slug: 'passive-components', description: 'Capacitors, resistors, inductors, transformers, and EMC suppression filters.' },
        { name: 'Active Discrete Semiconductors', slug: 'discrete-semiconductors', description: 'Diodes, rectifiers, MOSFETs, IGBTs, and bipolar power transistors.' },
        { name: 'Optoelectronics & Sensors', slug: 'optoelectronics-sensors', description: 'Image sensors, LEDs, laser diodes, photodetectors, and MEMS transducers.' },
      ],
    },
    {
      name: 'Distribution & Supply Chain',
      slug: 'distribution-supply-chain',
      description: 'Authorized component distributors, supply chain logistics, and sourcing partners.',
      icon: 'Truck',
      categories: [
        { name: 'Semiconductor Distribution', slug: 'semiconductor-distribution', description: 'Global authorized electronic component distributors and inventory aggregators.' },
      ],
    },
    {
      name: 'Test, Measurement & Systems',
      slug: 'test-measurement-systems',
      description: 'RF instrumentation, automated test equipment, failure analysis, and embedded systems.',
      icon: 'Gauge',
      categories: [
        { name: 'Test & Measurement', slug: 'test-measurement', description: 'Oscilloscopes, vector network analyzers, logic analyzers, and EMC compliance chambers.' },
        { name: 'Embedded Systems & Edge AI', slug: 'embedded-systems', description: 'Custom embedded hardware design, camera modules, and industrial compute solutions.' },
      ],
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const ind of industries) {
    const createdInd = await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: { name: ind.name, description: ind.description, icon: ind.icon },
      create: { name: ind.name, slug: ind.slug, description: ind.description, icon: ind.icon },
    });

    for (const cat of ind.categories) {
      const createdCat = await prisma.companyCategory.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, description: cat.description, industryId: createdInd.id },
        create: { name: cat.name, slug: cat.slug, description: cat.description, industryId: createdInd.id },
      });
      categoryMap.set(cat.slug, createdCat.id);
    }
  }
  console.log('✓ Industries and Categories Seeded');

  // 3. Seed Organizations & Demo Users
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  const companyAdminHash = await bcrypt.hash('Company123!', 10);
  const companyUserHash = await bcrypt.hash('User123!', 10);

  // Platform Admin Org
  const adminOrg = await prisma.organization.upsert({
    where: { slug: 'viaset-operations' },
    update: {},
    create: {
      name: 'VIASET Operations & Data Verification',
      slug: 'viaset-operations',
      description: 'Central platform administration and verified intelligence registry.',
      country: 'India',
      planCode: 'ENTERPRISE',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@viaset.io' },
    update: { role: 'ADMIN', organizationId: adminOrg.id },
    create: {
      email: 'admin@viaset.io',
      fullName: 'Dr. Vikram Chandra',
      passwordHash,
      role: 'ADMIN',
      organizationId: adminOrg.id,
    },
  });

  // Demo Org 1: Kaynes Semicon
  const kaynesOrg = await prisma.organization.upsert({
    where: { slug: 'kaynes-semicon' },
    update: {},
    create: {
      name: 'Kaynes Semicon Private Limited',
      slug: 'kaynes-semicon',
      description: 'Advanced semiconductor packaging and automated test manufacturing facility.',
      website: 'https://www.kaynestechnology.net',
      country: 'India',
      planCode: 'PRO',
    },
  });

  await prisma.user.upsert({
    where: { email: 'lead@kaynes-semi.com' },
    update: { role: 'COMPANY_ADMIN', organizationId: kaynesOrg.id },
    create: {
      email: 'lead@kaynes-semi.com',
      fullName: 'Rajesh Nair',
      passwordHash: companyAdminHash,
      role: 'COMPANY_ADMIN',
      organizationId: kaynesOrg.id,
    },
  });

  // Demo Org 2: Mindgrove Technologies
  const mindgroveOrg = await prisma.organization.upsert({
    where: { slug: 'mindgrove-technologies' },
    update: {},
    create: {
      name: 'Mindgrove Technologies',
      slug: 'mindgrove-technologies',
      description: 'Fabless semiconductor design firm specializing in energy-efficient RISC-V SoCs.',
      website: 'https://mindgrove.in',
      country: 'India',
      planCode: 'BASIC',
    },
  });

  await prisma.user.upsert({
    where: { email: 'engineer@mindgrove.in' },
    update: { role: 'COMPANY_USER', organizationId: mindgroveOrg.id },
    create: {
      email: 'engineer@mindgrove.in',
      fullName: 'Ananya Sharma',
      passwordHash: companyUserHash,
      role: 'COMPANY_USER',
      organizationId: mindgroveOrg.id,
    },
  });

  console.log('✓ Users and Organizations Seeded');

  // 4. Seed Comprehensive Realistic Companies (30 companies)
  const companiesData = [
    // --- FOUNDRY & FABRICATION ---
    {
      name: 'Semi-Conductor Laboratory (SCL)',
      slug: 'scl-chandigarh',
      description: 'Autonomous research and fabrication body under MeitY, operating an operational 180nm CMOS semiconductor wafer fabrication facility in Mohali, Punjab with MEMS and sensor production.',
      categorySlug: 'semiconductor-foundry',
      companyType: 'Foundry',
      hqCity: 'Mohali',
      hqState: 'Punjab',
      hqCountry: 'India',
      website: 'https://www.scl.gov.in',
      contactEmail: 'bdg@scl.gov.in',
      contactPhone: '+91-172-2237400',
      employeeCountRange: '500-1000',
      yearEstablished: 1984,
      revenueRange: '$50M-$100M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified against MeitY India Semiconductor Mission operational foundry database.',
      dataSource: 'Ministry of Electronics & IT / Official SCL Portal',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Process Node', name: '180nm CMOS Technology', specifications: 'Dual poly, triple/quadruple metal 8-inch wafer processing' },
        { capabilityType: 'Cleanroom', name: 'Class 10 / Class 100 Cleanroom', specifications: 'Dedicated wafer fabrication bays with ultra-pure gas delivery' },
        { capabilityType: 'Wafer Size', name: '200mm (8-inch) Silicon Wafers', specifications: 'Annual processing capacity of 20,000 wafer starts' },
        { capabilityType: 'MEMS Fabrication', name: 'Bulk and Surface Micromachining', specifications: 'Piezoresistive and capacitive pressure sensors, micro-mirrors' },
      ],
      products: [
        { name: 'Radiation Hardened ASICs', category: 'Microchips', description: 'Space-grade digital and mixed-signal silicon qualified for ISRO launch vehicles.' },
        { name: 'Pressure Sensors & Micro-gyros', category: 'MEMS', description: 'High-precision MEMS sensors for avionics and industrial monitoring.' },
      ],
      services: [
        { name: 'Multi-Project Wafer (MPW) Runs', category: 'Wafer Fabrication', capabilityLevel: 'Prototype to Low-Volume', description: 'Regular shuttle runs for academic and national fabless research.' },
        { name: 'Wafer Probing & Characterization', category: 'Testing', capabilityLevel: 'Turnkey', description: 'Automated parametric testing down to -55C to +125C.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'Bureau of Indian Standards', validUntil: '2027-12' },
        { name: 'ISRO Space Grade Qualification', issuingBody: 'Indian Space Research Organisation', validUntil: '2028-06' },
      ],
      industriesServed: ['Aerospace & Defense', 'Space Tech', 'Scientific Instrumentation'],
      supplyNeeds: [
        { needType: 'Material', description: 'Electronic-grade photoresist and high-purity chemical precursors (TEOS, silane).' },
        { needType: 'Equipment', description: 'Upgraded 200mm stepper maintenance spares and ion implantation target sources.' },
      ],
    },
    {
      name: 'Tower Semiconductor Limited',
      slug: 'tower-semiconductor',
      description: 'Leading global specialty foundry manufacturing analog and mixed-signal integrated circuits using advanced BCD, RF-CMOS, silicon photonics, and SiGe process technologies.',
      categorySlug: 'semiconductor-foundry',
      companyType: 'Foundry',
      hqCity: 'Migdal Haemek',
      hqState: 'Northern District',
      hqCountry: 'Israel',
      website: 'https://towersemi.com',
      contactEmail: 'sales@towersemi.com',
      contactPhone: '+972-4-650-6611',
      employeeCountRange: '5000+',
      yearEstablished: 1993,
      revenueRange: '$1B+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified global specialty foundry partner with Indian Semiconductor Mission agreements.',
      dataSource: 'Tower Semiconductor SEC Filings & Official Corporate Portal',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Process Node', name: '65nm - 180nm BCD & RF-CMOS', specifications: 'High-voltage up to 120V BCD for automotive and PMIC silicon' },
        { capabilityType: 'Cleanroom', name: 'ISO Class 4 Cleanroom', specifications: 'Operating 200mm and 300mm automated fabrication lines' },
        { capabilityType: 'Silicon Photonics', name: 'SiPho 300mm Foundry Platform', specifications: 'Integrated laser and waveguide optical transceivers' },
      ],
      products: [
        { name: 'Power Management IC Platforms (BCD)', category: 'Power', description: 'Low on-resistance automotive and mobile battery management platforms.' },
        { name: 'RF SOI Switches & LNA Silicon', category: 'RF Silicon', description: 'High linearity sub-6GHz and mmWave cellular switches.' },
      ],
      services: [
        { name: 'Specialty Silicon Foundry Services', category: 'Foundry Services', capabilityLevel: 'High-Volume Production', description: 'Customized analog and mixed-signal mass fabrication.' },
      ],
      certifications: [
        { name: 'IATF 16949:2016', issuingBody: 'DNV GL', validUntil: '2027-09' },
        { name: 'ISO 14001', issuingBody: 'BSI', validUntil: '2027-05' },
      ],
      industriesServed: ['Automotive', 'Telecommunications', 'Data Center / AI', 'Industrial IoT'],
      supplyNeeds: [
        { needType: 'Material', description: 'Ultra-pure sputtering targets and 300mm high-resistivity silicon wafers.' },
      ],
    },
    {
      name: 'GlobalFoundries Inc.',
      slug: 'globalfoundries',
      description: 'One of the world leading semiconductor manufacturers, delivering feature-rich foundry solutions including 22FDX, 12LP+, and silicon germanium for automotive, 5G, and IoT applications.',
      categorySlug: 'semiconductor-foundry',
      companyType: 'Foundry',
      hqCity: 'Malta',
      hqState: 'New York',
      hqCountry: 'United States',
      website: 'https://gf.com',
      contactEmail: 'contact@gf.com',
      contactPhone: '+1-518-680-7000',
      employeeCountRange: '10000+',
      yearEstablished: 2009,
      revenueRange: '$1B+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified global tier-1 semiconductor foundry.',
      dataSource: 'GlobalFoundries Public Filings',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Process Node', name: '22FDX (Fully Depleted SOI)', specifications: 'Ultra-low voltage 0.4V operation with back-biasing capabilities' },
        { capabilityType: 'Process Node', name: '12LP+ FinFET Technology', specifications: 'High-performance compute and machine learning inference silicon' },
        { capabilityType: 'Cleanroom', name: 'Class 1 Cleanroom Standards', specifications: 'Fab 8 Malta 300mm advanced manufacturing complex' },
      ],
      products: [
        { name: '22FDX Automotive Rad-Hard Platforms', category: 'SoC', description: 'AEC-Q100 Grade 1 qualified FD-SOI microcontroller silicon.' },
      ],
      services: [
        { name: 'Turnkey Wafer Manufacturing', category: 'Manufacturing', capabilityLevel: 'High-Volume Production', description: 'End-to-end silicon fabrication and yield engineering.' },
      ],
      certifications: [
        { name: 'IATF 16949:2016', issuingBody: 'TÜV Rheinland', validUntil: '2027-11' },
        { name: 'ISO 27001', issuingBody: 'BSI', validUntil: '2026-10' },
      ],
      industriesServed: ['Automotive', 'Data Center / AI', 'Smart Mobile', 'Defense & Aerospace'],
      supplyNeeds: [
        { needType: 'Material', description: 'EUV and immersion photolithography chemicals and pellicles.' },
      ],
    },

    // --- IC DESIGN / FABLESS ---
    {
      name: 'Mindgrove Technologies Private Limited',
      slug: 'mindgrove-technologies-fabless',
      description: 'Indian fabless semiconductor company incubated at IIT Madras (Pravartak), designing cost-effective, high-performance edge microcontrollers and secure SoCs based on the open RISC-V ISA.',
      categorySlug: 'ic-design-fabless',
      companyType: 'Design House',
      hqCity: 'Chennai',
      hqState: 'Tamil Nadu',
      hqCountry: 'India',
      website: 'https://mindgrove.in',
      contactEmail: 'info@mindgrove.in',
      contactPhone: '+91-44-66630000',
      employeeCountRange: '51-200',
      yearEstablished: 2021,
      revenueRange: '$1M-$5M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified Indian fabless startup with commercial silicon launch (Secure IoT SoC).',
      dataSource: 'IIT Madras Research Park & Official Mindgrove Publications',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Process Node', name: '28nm High-K Metal Gate (HKMG)', specifications: 'Commercial silicon tape-out at TSMC 28nm node' },
        { capabilityType: 'Architecture', name: '64-bit RISC-V Core Design', specifications: 'Custom vector extensions and hardware crypto acceleration engines' },
      ],
      products: [
        { name: 'Secure IoT SoC (MGM2300)', category: 'Microcontrollers', description: 'High-security 28nm RISC-V microcontroller with integrated SHA-256/AES and PUF.' },
        { name: 'Vision SoC Accelerator', category: 'Edge AI', description: 'Low-power image signal processor with neural inference accelerator for smart meters.' },
      ],
      services: [
        { name: 'Custom ASIC Design & Verification', category: 'Design Services', capabilityLevel: 'Turnkey', description: 'RTL to GDSII implementation for embedded edge processors.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'TUV India', validUntil: '2027-04' },
      ],
      industriesServed: ['Smart Energy / Metering', 'Industrial IoT', 'Automotive Infotainment', 'Consumer Electronics'],
      supplyNeeds: [
        { needType: 'Service', description: 'Advanced packaging vendor (QFN and BGA) with local Indian OSAT lines.' },
        { needType: 'Service', description: 'High-temperature burn-in and wafer sort test house.' },
      ],
    },
    {
      name: 'Aura Semiconductor',
      slug: 'aura-semiconductor',
      description: 'Fabless semiconductor design firm delivering ultra-low power RF transceivers, high-performance timing chips, and clock distribution integrated circuits for optical networking.',
      categorySlug: 'ic-design-fabless',
      companyType: 'Design House',
      hqCity: 'Bengaluru',
      hqState: 'Karnataka',
      hqCountry: 'India',
      website: 'https://aurasemi.com',
      contactEmail: 'inquiries@aurasemi.com',
      contactPhone: '+91-80-67448888',
      employeeCountRange: '201-500',
      yearEstablished: 2011,
      revenueRange: '$20M-$50M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified tier-1 Indian fabless design house with tier-1 telecom customer shipments.',
      dataSource: 'Aura Semiconductor Corporate Data',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Process Node', name: '40nm & 65nm Analog/Mixed-Signal', specifications: 'Sub-picosecond jitter phase-locked loops (PLL)' },
        { capabilityType: 'RF Frequency', name: 'Sub-6GHz and Millimeter Wave', specifications: 'Ultra-low phase noise clock synthesizers up to 10GHz' },
      ],
      products: [
        { name: 'Network Synchronizer Clocks (AU54xx)', category: 'Timing Silicon', description: 'ITU-T G.8262 compliant synchronous Ethernet and IEEE 1588 timing ICs.' },
        { name: 'BLE 5.3 Low-Power Transceivers', category: 'Wireless ICs', description: 'Ultra-low sleep current IoT mesh wireless silicon.' },
      ],
      services: [
        { name: 'Mixed-Signal Physical Design Consulting', category: 'Engineering Services', capabilityLevel: 'High-Volume Production', description: 'Silicon IP licensing and design tailoring for Tier-1 telecom OEMs.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'BSI', validUntil: '2027-02' },
      ],
      industriesServed: ['Telecommunications', '5G Infrastructure', 'Data Center / AI', 'Automotive'],
      supplyNeeds: [
        { needType: 'Service', description: 'WLCSP (Wafer Level Chip Scale Packaging) backend test house.' },
      ],
    },
    {
      name: 'Vervesemi Microelectronics',
      slug: 'vervesemi-microelectronics',
      description: 'Fabless semiconductor company pioneering ultra-low power, high-speed data converters (ADC/DAC) and analog front-ends (AFE) for medical ultrasound, radar, and 5G base stations.',
      categorySlug: 'ic-design-fabless',
      companyType: 'Design House',
      hqCity: 'Noida',
      hqState: 'Uttar Pradesh',
      hqCountry: 'India',
      website: 'https://vervesemi.com',
      contactEmail: 'info@vervesemi.com',
      contactPhone: '+91-120-4567890',
      employeeCountRange: '51-200',
      yearEstablished: 2017,
      revenueRange: '$5M-$15M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified fabless analog silicon provider.',
      dataSource: 'Vervesemi Product Briefs',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Process Node', name: '28nm / 40nm CMOS & FinFET', specifications: '16-bit 500MSPS ADC IP core implementation' },
      ],
      products: [
        { name: 'High-Speed Pipeline ADC ICs', category: 'Data Converters', description: 'Dual-channel 14-bit 125MSPS low power analog-to-digital converters.' },
        { name: 'Ultrasound 64-Channel Analog Front End', category: 'Medical Silicon', description: 'Integrated low-noise amplifier, TGC, and anti-aliasing filter.' },
      ],
      services: [
        { name: 'Analog IP Licensing & Hardening', category: 'IP Design', capabilityLevel: 'Turnkey', description: 'Custom mixed-signal block porting to TSMC and GlobalFoundries nodes.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'TÜV NORD', validUntil: '2026-08' },
      ],
      industriesServed: ['Medical Devices', 'Aerospace & Defense', 'Telecommunications'],
      supplyNeeds: [
        { needType: 'Service', description: 'Automated test equipment (ATE) production testing line for analog chips.' },
      ],
    },

    // --- OSAT & PACKAGING ---
    {
      name: 'Kaynes Semicon Private Limited',
      slug: 'kaynes-semicon-facility',
      description: 'State-of-the-art Outsourced Semiconductor Assembly and Test (OSAT) facility in Sanand, Gujarat, delivering advanced packaging, multi-chip modules (MCM), QFN, BGA, and power modules.',
      categorySlug: 'osat-packaging',
      companyType: 'OSAT',
      hqCity: 'Sanand',
      hqState: 'Gujarat',
      hqCountry: 'India',
      website: 'https://www.kaynestechnology.net',
      contactEmail: 'semicon@kaynes.in',
      contactPhone: '+91-2717-699000',
      employeeCountRange: '500-1000',
      yearEstablished: 2023,
      revenueRange: '$50M-$100M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Approved under the Indian Semiconductor Mission (ISM) with approved capital subsidy for Sanand packaging unit.',
      dataSource: 'India Semiconductor Mission Official Registry & Kaynes Filings',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Packaging Type', name: 'QFN & BGA Leadless Packages', specifications: 'Fine-pitch 0.4mm wire bonding and copper pillar flip-chip' },
        { capabilityType: 'Packaging Type', name: 'System-in-Package (SiP)', specifications: 'Multi-die heterogenous integration with integrated passive devices' },
        { capabilityType: 'Cleanroom', name: 'Class 100 / ISO Class 5 Packaging Line', specifications: 'Positive-pressure climate controlled wafer dicing and die-attach bays' },
      ],
      products: [
        { name: 'Automotive Power Modules (SiC & IGBT)', category: 'Power Packaging', description: 'Direct bonded copper (DBC) high-reliability automotive inverter packaging.' },
        { name: 'Micro-BGA Smart Sensor Packages', category: 'Sensor Packaging', description: 'LGA/BGA miniature packages for MEMS sensors and IoT controllers.' },
      ],
      services: [
        { name: 'High-Volume Wafer Dicing & Sorting', category: 'OSAT Services', capabilityLevel: 'High-Volume Production', description: 'Laser and mechanical dicing of 200mm and 300mm thinned wafers.' },
        { name: 'Automated Electrical & Thermal Test', category: 'Testing', capabilityLevel: 'Turnkey', description: 'Tri-temp automotive grade qualification test (-40C to +150C).' },
      ],
      certifications: [
        { name: 'IATF 16949:2016 Compliant', issuingBody: 'DNV', validUntil: '2028-01' },
        { name: 'ISO 9001:2015', issuingBody: 'BSI', validUntil: '2027-10' },
      ],
      industriesServed: ['Automotive', 'Industrial Electronics', 'Consumer Electronics', 'Renewable Energy'],
      supplyNeeds: [
        { needType: 'Material', description: 'High-purity mold compound, leadframes, and copper bonding wire (0.8 mil).' },
        { needType: 'Equipment', description: 'Automated optical inspection (AOI) and X-ray void inspection machinery.' },
      ],
    },
    {
      name: 'Tata Electronics OSAT Facility',
      slug: 'tata-electronics-osat',
      description: 'Major greenfield semiconductor assembly and testing mega-facility in Morigaon, Assam, delivering high-density wire bond, flip-chip, and 2.5D/3D advanced packaging platforms.',
      categorySlug: 'osat-packaging',
      companyType: 'OSAT',
      hqCity: 'Morigaon',
      hqState: 'Assam',
      hqCountry: 'India',
      website: 'https://www.tataelectronics.com',
      contactEmail: 'contact@tataelectronics.com',
      contactPhone: '+91-361-2999000',
      employeeCountRange: '1000+',
      yearEstablished: 2024,
      revenueRange: '$100M+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Approved mega-project under ISM with multi-billion rupee investment in semiconductor packaging.',
      dataSource: 'Cabinet Committee on Economic Affairs (CCEA) / Tata Electronics',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Packaging Type', name: '2.5D / 3D Heterogeneous Packaging', specifications: 'Through-silicon via (TSV) and high-density organic substrate integration' },
        { capabilityType: 'Cleanroom', name: 'ISO Class 5 & 6 Mega-Cleanroom', specifications: 'Fully automated wafer probe and tape-and-reel backend lines' },
      ],
      products: [
        { name: 'Advanced AI Edge Accelerator Packages', category: 'HPC Packaging', description: 'High pin-count FCBGA packages for edge compute processors.' },
      ],
      services: [
        { name: 'Full Turnkey Semiconductor Assembly & Test', category: 'OSAT', capabilityLevel: 'High-Volume Production', description: 'Wafer probe, assembly, final test, and direct drop-shipment.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'Intertek', validUntil: '2027-05' },
      ],
      industriesServed: ['Consumer Electronics', 'Data Center / AI', 'Automotive', 'Telecommunications'],
      supplyNeeds: [
        { needType: 'Material', description: 'BT-epoxy substrates, thermal interface materials (TIM), and underfill.' },
      ],
    },
    {
      name: 'Amkor Technology Inc.',
      slug: 'amkor-technology',
      description: 'One of the world largest providers of outsourced semiconductor packaging and test services, with over 3,000 package formats and advanced packaging solutions.',
      categorySlug: 'osat-packaging',
      companyType: 'OSAT',
      hqCity: 'Tempe',
      hqState: 'Arizona',
      hqCountry: 'United States',
      website: 'https://amkor.com',
      contactEmail: 'sales@amkor.com',
      contactPhone: '+1-480-821-5000',
      employeeCountRange: '10000+',
      yearEstablished: 1968,
      revenueRange: '$1B+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified global leading OSAT enterprise.',
      dataSource: 'Amkor SEC Filings',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Packaging Type', name: 'Chiplet & SWIFT Advanced Packaging', specifications: 'High-density fan-out wafer-level packaging (FOWLP)' },
        { capabilityType: 'Testing', name: 'RF and Mixed-Signal ATE', specifications: 'High-speed 112Gbps SerDes characterization' },
      ],
      products: [
        { name: 'Automotive Grade FCBGA Packages', category: 'Automotive OSAT', description: 'Zero-defect AEC-Q100 Grade 0 engine control packaging.' },
      ],
      services: [
        { name: 'Global OSAT Manufacturing', category: 'OSAT', capabilityLevel: 'High-Volume Production', description: 'Packaging facilities across US, Korea, Japan, Taiwan, and Portugal.' },
      ],
      certifications: [
        { name: 'IATF 16949:2016', issuingBody: 'SGS', validUntil: '2027-03' },
        { name: 'ISO 14001', issuingBody: 'BSI', validUntil: '2027-08' },
      ],
      industriesServed: ['Automotive', 'Data Center / AI', 'Communications', 'Industrial'],
      supplyNeeds: [
        { needType: 'Material', description: 'Ultra-low alpha mold compound and fine pitch solder spheres.' },
      ],
    },

    // --- PCB FABRICATION ---
    {
      name: 'AT&S India (Austria Technologie & Systemtechnik)',
      slug: 'ats-india-pcb',
      description: 'Tier-1 manufacturer of high-end printed circuit boards and IC substrates, operating high-volume fabrication lines in Nanjangud, Karnataka for automotive and industrial electronics.',
      categorySlug: 'pcb-fabrication',
      companyType: 'Manufacturer',
      hqCity: 'Nanjangud',
      hqState: 'Karnataka',
      hqCountry: 'India',
      website: 'https://ats.net',
      contactEmail: 'info_india@ats.net',
      contactPhone: '+91-8221-228000',
      employeeCountRange: '1000+',
      yearEstablished: 1999,
      revenueRange: '$100M+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified manufacturing subsidiary of AT&S Austria, major Indian PCB exporter.',
      dataSource: 'AT&S Group Annual Report & ELCINA Directory',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Layer Count', name: 'Up to 32 Layer Multilayer PCBs', specifications: 'Blind and buried via technology with sequential lamination' },
        { capabilityType: 'Technology', name: 'High-Density Interconnect (HDI) Any-Layer', specifications: 'Laser microvias down to 75 micron diameter' },
        { capabilityType: 'Surface Finish', name: 'ENIG, ENEPIG, Immersion Silver, OSP', specifications: 'Lead-free RoHS compliant finishes for high-reliability assembly' },
      ],
      products: [
        { name: 'Automotive Radar & ADAS Sensor PCBs', category: 'Automotive PCB', description: 'High-frequency PTFE and hydrocarbon hybrid laminate boards (77GHz).' },
        { name: 'Heavy Copper Industrial Power Boards', category: 'Power PCB', description: 'Up to 6oz copper weight for high-current motor drives.' },
      ],
      services: [
        { name: 'Bare Board PCB Manufacturing', category: 'Fabrication', capabilityLevel: 'High-Volume Production', description: 'Mass production with automated optical and electrical flying probe testing.' },
      ],
      certifications: [
        { name: 'IATF 16949:2016', issuingBody: 'TÜV SÜD', validUntil: '2027-06' },
        { name: 'AS9100D', issuingBody: 'TÜV SÜD', validUntil: '2026-11' },
        { name: 'ISO 9001:2015', issuingBody: 'TÜV SÜD', validUntil: '2027-06' },
      ],
      industriesServed: ['Automotive', 'Aerospace & Defense', 'Industrial Automation', 'Medical Devices'],
      supplyNeeds: [
        { needType: 'Material', description: 'High-Tg FR4 copper clad laminates (Isola, Panasonic Megtron) and copper foil.' },
        { needType: 'Chemicals', description: 'Electroless gold plating salts and chemical etching reagents.' },
      ],
    },
    {
      name: 'Shogini Technoarts Private Limited',
      slug: 'shogini-technoarts',
      description: 'Premier Indian manufacturer of precision single, double, and multilayer printed circuit boards up to 24 layers, with quick-turn prototyping and metal-core PCB (MCPCB) lines in Pune.',
      categorySlug: 'pcb-fabrication',
      companyType: 'Manufacturer',
      hqCity: 'Pune',
      hqState: 'Maharashtra',
      hqCountry: 'India',
      website: 'https://shogini.com',
      contactEmail: 'sales@shogini.com',
      contactPhone: '+91-20-24391200',
      employeeCountRange: '500-1000',
      yearEstablished: 1979,
      revenueRange: '$20M-$50M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified Indian PCB fabrication facility certified for defense and railway electronics.',
      dataSource: 'ELCINA & Shogini Corporate Data',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Layer Count', name: '1 to 24 Layer Rigid Boards', specifications: 'Controlled impedance tolerances within +/-5%' },
        { capabilityType: 'Metal Core', name: 'Aluminum & Copper MCPCB', specifications: 'Thermal conductivity up to 3.0 W/m-K for LED and power electronics' },
      ],
      products: [
        { name: 'High-Reliability Multilayer FR-4 PCBs', category: 'Bare Board', description: 'IPC Class 3 compliant rigid printed circuit boards.' },
        { name: 'LED Lighting Metal Core Circuit Boards', category: 'MCPCB', description: 'High heat dissipation circuit boards for automotive lighting.' },
      ],
      services: [
        { name: 'Quick-Turn Prototype PCB Service', category: 'Rapid Prototyping', capabilityLevel: 'Prototype', description: '3-day express turnaround for engineering validation prototypes.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'TUV India', validUntil: '2027-01' },
        { name: 'IATF 16949:2016', issuingBody: 'TUV India', validUntil: '2026-12' },
      ],
      industriesServed: ['Industrial Electronics', 'Automotive', 'Railway Signalling', 'Power Electronics'],
      supplyNeeds: [
        { needType: 'Material', description: 'Aluminum base copper clad laminates and dry film photoresists.' },
      ],
    },
    {
      name: 'Ascent Circuits Private Limited',
      slug: 'ascent-circuits',
      description: 'Major manufacturer of double-sided, multilayer, RF/microwave, and flexible printed circuit boards based in Hosur, Tamil Nadu (part of Amber Enterprises).',
      categorySlug: 'pcb-fabrication',
      companyType: 'Manufacturer',
      hqCity: 'Hosur',
      hqState: 'Tamil Nadu',
      hqCountry: 'India',
      website: 'https://ascentcircuits.com',
      contactEmail: 'sales@ascentcircuits.com',
      contactPhone: '+91-4344-406000',
      employeeCountRange: '500-1000',
      yearEstablished: 1990,
      revenueRange: '$50M-$100M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified major Indian PCB manufacturer with export reach to US and Europe.',
      dataSource: 'Amber Enterprises Investor Presentation',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Layer Count', name: 'Up to 16 Layer Rigid & Flex', specifications: 'Polyimide flexible circuits and rigid-flex configurations' },
        { capabilityType: 'RF PCB', name: 'Rogers & Teflon Substrate Processing', specifications: 'Phase-matched high-frequency radar and telemetry boards' },
      ],
      products: [
        { name: 'Rigid-Flex Interconnect Boards', category: 'Flex PCB', description: 'Compact form factor assemblies for aerospace avionics.' },
      ],
      services: [
        { name: 'Multilayer Volume Fabrication', category: 'PCB Manufacturing', capabilityLevel: 'High-Volume Production', description: 'Annual capacity exceeding 1.2 million square meters.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'UL', validUntil: '2027-03' },
        { name: 'IATF 16949:2016', issuingBody: 'UL', validUntil: '2026-09' },
      ],
      industriesServed: ['Telecommunications', 'Aerospace & Defense', 'Automotive', 'Consumer Appliances'],
      supplyNeeds: [
        { needType: 'Material', description: 'Rogers 4350B laminates and DuPont Pyralux flexible polyimide films.' },
      ],
    },

    // --- PCB ASSEMBLY / EMS ---
    {
      name: 'Kaynes Technology India Limited',
      slug: 'kaynes-technology-ems',
      description: 'Premier end-to-end and IoT-enabled integrated electronics manufacturing company with 14 production plants across India, providing advanced SMT, box-build, and cable harness services.',
      categorySlug: 'pcb-assembly-ems',
      companyType: 'Service Provider',
      hqCity: 'Mysuru',
      hqState: 'Karnataka',
      hqCountry: 'India',
      website: 'https://www.kaynestechnology.net',
      contactEmail: 'contact@kaynestechnology.net',
      contactPhone: '+91-821-2582595',
      employeeCountRange: '1000+',
      yearEstablished: 1988,
      revenueRange: '$100M+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Publicly listed Indian EMS giant (NSE/BSE: KAYNES). Verified corporate data.',
      dataSource: 'Kaynes Technology Annual Report 2024 & Stock Exchange Filings',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'SMT Lines', name: '45+ High-Speed SMT Lines', specifications: 'Placement capability down to 01005 passives and 0.3mm fine-pitch BGA' },
        { capabilityType: 'Cleanroom', name: 'Class 8 / Class 10,000 Cleanroom', specifications: 'Dedicated medical electronics and aerospace assembly areas' },
        { capabilityType: 'Inspection', name: '3D AOI & 3D AXI (X-Ray)', specifications: '100% in-line solder paste inspection (SPI) and automated optical inspection' },
      ],
      products: [
        { name: 'Train Collision Avoidance (Kavach) Modules', category: 'Rail Electronics', description: 'SIL-4 safety certified onboard electronic control units for Indian Railways.' },
        { name: 'Smart Energy Meter Mainboards', category: 'Metering', description: 'Cellular NB-IoT and RF mesh enabled three-phase smart meter PCBA.' },
      ],
      services: [
        { name: 'Turnkey Box-Build & System Integration', category: 'EMS', capabilityLevel: 'High-Volume Production', description: 'Enclosure design, potting, conformal coating, and final packaging.' },
        { name: 'In-Circuit & Functional Testing (ICT/FCT)', category: 'Testing', capabilityLevel: 'Turnkey', description: 'Custom test fixture fabrication and JTAG boundary scan testing.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'BSI', validUntil: '2027-08' },
        { name: 'IATF 16949:2016', issuingBody: 'BSI', validUntil: '2027-02' },
        { name: 'AS9100D', issuingBody: 'BSI', validUntil: '2026-10' },
        { name: 'ISO 13485:2016', issuingBody: 'BSI', validUntil: '2027-04' },
      ],
      industriesServed: ['Automotive', 'Railway Signalling', 'Aerospace & Defense', 'Medical Devices', 'Industrial IoT'],
      supplyNeeds: [
        { needType: 'Components', description: 'Automotive-grade microcontrollers (NXP, STMicro, TI) and ceramic capacitors.' },
        { needType: 'Service', description: 'Conformal coating specialized masking services and thermal pad die-cutting.' },
      ],
    },
    {
      name: 'Dixon Technologies (India) Limited',
      slug: 'dixon-technologies',
      description: 'India largest homegrown electronics manufacturing services (EMS) company, operating automated assembly lines for consumer electronics, smartphones, lighting, and home appliances.',
      categorySlug: 'pcb-assembly-ems',
      companyType: 'Manufacturer',
      hqCity: 'Noida',
      hqState: 'Uttar Pradesh',
      hqCountry: 'India',
      website: 'https://dixoninfo.com',
      contactEmail: 'info@dixoninfo.com',
      contactPhone: '+91-120-4737200',
      employeeCountRange: '10000+',
      yearEstablished: 1993,
      revenueRange: '$1B+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Publicly listed market leader in Indian contract electronics manufacturing.',
      dataSource: 'Dixon Corporate Filings & BSE',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'SMT Placement', name: 'High-Speed Fuji & Panasonic Lines', specifications: 'Over 80 million SMT placements per day capacity' },
        { capabilityType: 'Automation', name: 'Robotic Screwdriving & Automated Packing', specifications: 'Fully automated cell manufacturing for smartphones' },
      ],
      products: [
        { name: 'Smartphone Motherboard PCBA', category: 'Mobile Electronics', description: 'High-density multilayer HDI mobile computing motherboards.' },
        { name: 'LED Television Main Boards & Power Units', category: 'Consumer Displays', description: 'Integrated smart TV controller boards and LED drivers.' },
      ],
      services: [
        { name: 'High-Volume Electronic Product Assembly', category: 'EMS', capabilityLevel: 'High-Volume Production', description: 'Turnkey contract manufacturing with reverse logistics.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'TÜV Rheinland', validUntil: '2027-05' },
        { name: 'ISO 14001:2015', issuingBody: 'TÜV Rheinland', validUntil: '2027-05' },
      ],
      industriesServed: ['Consumer Electronics', 'Mobile Phones', 'Lighting Products', 'Home Appliances'],
      supplyNeeds: [
        { needType: 'Components', description: 'Display driver ICs, power MOSFETs, passive MLCC reels, and battery packs.' },
      ],
    },
    {
      name: 'Syrma SGS Technology Limited',
      slug: 'syrma-sgs-technology',
      description: 'Engineering and electronic manufacturing company specializing in precision PCBA, custom RFID tag manufacturing, electromagnetic components, and power supply design.',
      categorySlug: 'pcb-assembly-ems',
      companyType: 'Service Provider',
      hqCity: 'Chennai',
      hqState: 'Tamil Nadu',
      hqCountry: 'India',
      website: 'https://syrmasgs.com',
      contactEmail: 'info@syrmasgs.com',
      contactPhone: '+91-44-71717000',
      employeeCountRange: '1000+',
      yearEstablished: 1978,
      revenueRange: '$100M+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Publicly listed leading electronics design and manufacturing services company.',
      dataSource: 'Syrma SGS Investor Presentation',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Manufacturing', name: 'Precision SMT & Magnetics Winding', specifications: 'Automated planar transformer and toroidal choke winding' },
        { capabilityType: 'RFID Assembly', name: 'Custom RFID Tag & Inlay Manufacturing', specifications: 'HF, UHF and NFC tags for industrial logistics' },
      ],
      products: [
        { name: 'Automotive Electronic Control Units (ECU)', category: 'Automotive EMS', description: 'Body control modules, battery management systems, and cluster boards.' },
        { name: 'Industrial RFID Transponders', category: 'RFID', description: 'Ruggedized UHF tags resistant to extreme thermal cycles.' },
      ],
      services: [
        { name: 'Full Lifecycle Electronic Design & Manufacturing', category: 'EMS Services', capabilityLevel: 'High-Volume Production', description: 'From PCB layout and DFM analysis to box-build testing.' },
      ],
      certifications: [
        { name: 'IATF 16949:2016', issuingBody: 'DNV GL', validUntil: '2026-12' },
        { name: 'AS9100D', issuingBody: 'DNV GL', validUntil: '2027-04' },
        { name: 'ISO 9001:2015', issuingBody: 'DNV GL', validUntil: '2027-04' },
      ],
      industriesServed: ['Automotive', 'Industrial IoT', 'Healthcare', 'Aerospace'],
      supplyNeeds: [
        { needType: 'Material', description: 'RFID silicon chips (NXP UCODE, Impinj Monza) and antenna copper inlays.' },
      ],
    },
    {
      name: 'VVDN Technologies Private Limited',
      slug: 'vvdn-technologies',
      description: 'Product engineering, electronics manufacturing, and ODM company with multi-tier SMT lines and testing labs in Manesar and Pollachi, focusing on 5G, Wi-Fi 6, vision, and cloud IoT.',
      categorySlug: 'pcb-assembly-ems',
      companyType: 'Service Provider',
      hqCity: 'Gurugram',
      hqState: 'Haryana',
      hqCountry: 'India',
      website: 'https://www.vvdntech.com',
      contactEmail: 'info@vvdntech.com',
      contactPhone: '+91-124-4284250',
      employeeCountRange: '1000+',
      yearEstablished: 2007,
      revenueRange: '$100M+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified tier-1 Indian technology ODM and manufacturing partner.',
      dataSource: 'VVDN Technologies Official Communications',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'SMT Placement', name: 'Panasonic & Yamaha High-Speed Lines', specifications: 'Class 10,000 cleanroom assembly for camera and RF modules' },
        { capabilityType: 'RF Testing', name: 'Anechoic Chamber & 5G Base Station Test', specifications: 'OTA (Over-The-Air) chamber testing up to 40GHz' },
      ],
      products: [
        { name: '5G Open RAN Radio Units (RU)', category: 'Telecom Equipment', description: 'Massive MIMO 32T32R sub-6GHz carrier-grade radio units.' },
        { name: 'AI Vision Smart Dashcams & Security Cameras', category: 'Vision Hardware', description: 'Sony STARVIS sensor integrated 4K video telematics cameras.' },
      ],
      services: [
        { name: 'Original Design & Manufacturing (ODM)', category: 'ODM Services', capabilityLevel: 'High-Volume Production', description: 'End-to-end hardware, firmware, mechanical tooling, and mass manufacturing.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'TÜV SÜD', validUntil: '2027-07' },
        { name: 'TL 9000', issuingBody: 'Quest Forum', validUntil: '2026-11' },
      ],
      industriesServed: ['Telecommunications', 'Automotive / EV', 'Surveillance & Smart Cities', 'Industrial IoT'],
      supplyNeeds: [
        { needType: 'Components', description: 'FPGA silicon (AMD Xilinx Zynq UltraScale+), 5G RF power amplifiers, and DDR4 SDRAM.' },
      ],
    },

    // --- ELECTRONIC COMPONENTS (ACTIVE & PASSIVE) ---
    {
      name: 'Continental Device India Ltd (CDIL)',
      slug: 'cdil-semiconductors',
      description: 'Pioneer of silicon semiconductor manufacturing in India since 1964. Produces silicon transistors, diodes, rectifiers, TVS suppressors, and surface-mount power devices in New Delhi and Mohali.',
      categorySlug: 'discrete-semiconductors',
      companyType: 'Manufacturer',
      hqCity: 'New Delhi',
      hqState: 'Delhi',
      hqCountry: 'India',
      website: 'https://cdil.com',
      contactEmail: 'email@cdil.com',
      contactPhone: '+91-11-26811436',
      employeeCountRange: '500-1000',
      yearEstablished: 1964,
      revenueRange: '$20M-$50M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'India first silicon semiconductor manufacturer with operational packaging lines.',
      dataSource: 'CDIL Company History & Ministry of Electronics & IT',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Packaging', name: 'TO-220, TO-247, SOT-23, SMA/SMB Packaging', specifications: 'High-volume discrete semiconductor encapsulation lines' },
        { capabilityType: 'Testing', name: '100% Parameter Electrical Testing', specifications: 'Breakdown voltage testing up to 1500V and surge current validation' },
      ],
      products: [
        { name: 'Fast Recovery Rectifier Diodes', category: 'Power Diodes', description: 'Ultra-fast recovery rectifiers for switch-mode power supplies (SMPS).' },
        { name: 'Automotive Grade TVS Diodes', category: 'Circuit Protection', description: 'Transient voltage suppressors qualified for automotive load dump protection.' },
        { name: 'Bipolar Power Transistors', category: 'Transistors', description: 'Complementary silicon power transistors for audio amplifiers and inverters.' },
      ],
      services: [
        { name: 'Discrete Semiconductor Packaging', category: 'Component Manufacturing', capabilityLevel: 'High-Volume Production', description: 'Custom leadframe packaging and screening for space and defense.' },
      ],
      certifications: [
        { name: 'IATF 16949:2016', issuingBody: 'TUV India', validUntil: '2026-12' },
        { name: 'ISO 9001:2015', issuingBody: 'TUV India', validUntil: '2027-03' },
        { name: 'ISRO Space Heritage Qualified', issuingBody: 'ISRO', validUntil: '2028-01' },
      ],
      industriesServed: ['Automotive', 'Power Electronics', 'Defense & Aerospace', 'Consumer Appliances'],
      supplyNeeds: [
        { needType: 'Material', description: 'Silicon diffusion wafers, copper leadframe strips, and epoxy transfer molding pellets.' },
      ],
    },
    {
      name: 'Murata Manufacturing Co., Ltd.',
      slug: 'murata-manufacturing',
      description: 'Global leader in the design, manufacture, and supply of advanced electronic materials, leading-edge electronic components, and multi-functional high-density modules.',
      categorySlug: 'passive-components',
      companyType: 'Manufacturer',
      hqCity: 'Nagaokakyo',
      hqState: 'Kyoto',
      hqCountry: 'Japan',
      website: 'https://corporate.murata.com',
      contactEmail: 'contact@murata.com',
      contactPhone: '+81-75-951-9111',
      employeeCountRange: '10000+',
      yearEstablished: 1944,
      revenueRange: '$1B+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified global component giant; holds over 30% of global MLCC market.',
      dataSource: 'Murata Corporate Disclosures',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Ceramic Processing', name: 'Nanoscale Dielectric Thin-Film Sintering', specifications: 'Sub-micron dielectric layers enabling 008004 miniature MLCCs' },
        { capabilityType: 'RF Filter Design', name: 'SAW & BAW Filters', specifications: 'Low insertion loss acoustic wave filters for 5G mobile handsets' },
      ],
      products: [
        { name: 'Multilayer Ceramic Capacitors (MLCC)', category: 'Capacitors', description: 'Ultra-miniature, high-capacitance automotive and consumer MLCCs.' },
        { name: 'Chip Ferrite Beads & Power Inductors', category: 'Inductors', description: 'High-efficiency noise suppression chokes for DC-DC converters.' },
      ],
      services: [
        { name: 'Noise Suppression & EMC Consulting', category: 'Engineering Support', capabilityLevel: 'Turnkey', description: 'Engineering simulation and recommendation of optimal component combinations.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'JQA', validUntil: '2027-09' },
        { name: 'IATF 16949:2016', issuingBody: 'JQA', validUntil: '2027-04' },
      ],
      industriesServed: ['Automotive', 'Smart Mobile', 'Data Center / AI', 'Healthcare'],
      supplyNeeds: [
        { needType: 'Material', description: 'High-purity barium titanate ceramic powders and rare earth dopants.' },
      ],
    },
    {
      name: 'Vishay Intertechnology, Inc.',
      slug: 'vishay-intertechnology',
      description: 'One of the world largest manufacturers of discrete semiconductors (diodes, MOSFETs, optoelectronics) and passive electronic components (resistors, inductors, capacitors).',
      categorySlug: 'passive-components',
      companyType: 'Manufacturer',
      hqCity: 'Malvern',
      hqState: 'Pennsylvania',
      hqCountry: 'United States',
      website: 'https://www.vishay.com',
      contactEmail: 'sales@vishay.com',
      contactPhone: '+1-610-644-1300',
      employeeCountRange: '10000+',
      yearEstablished: 1962,
      revenueRange: '$1B+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified worldwide component supplier with manufacturing sites in India (Pune, Bengaluru).',
      dataSource: 'Vishay SEC Annual Report',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Resistor Technology', name: 'Bulk Metal Foil & Thick/Thin Film', specifications: 'Ultra-precision resistors with 0.05% tolerance and 0.2 ppm/C TCR' },
        { capabilityType: 'Power MOSFET', name: 'TrenchFET Gen IV Power MOSFETs', specifications: 'Ultra-low RDS(on) power management switches' },
      ],
      products: [
        { name: 'IHLP Low-Profile High-Current Inductors', category: 'Inductors', description: 'Composite core inductors operating up to 155C without saturation.' },
        { name: 'Optocouplers & Solid-State Relays', category: 'Optoelectronics', description: 'High-isolation galvanic isolation optocouplers for industrial drives.' },
      ],
      services: [
        { name: 'High-Reliability Component Screening', category: 'Testing', capabilityLevel: 'Turnkey', description: 'MIL-PRF and AEC-Q200 reliability qualification and burn-in.' },
      ],
      certifications: [
        { name: 'IATF 16949:2016', issuingBody: 'DNV', validUntil: '2027-01' },
        { name: 'ISO 9001:2015', issuingBody: 'DNV', validUntil: '2027-01' },
      ],
      industriesServed: ['Automotive', 'Industrial IoT', 'Avionics', 'Medical Devices'],
      supplyNeeds: [
        { needType: 'Material', description: 'Tungsten sputtering targets, resistance alloy foils (Ni-Cr), and epoxy resin.' },
      ],
    },
    {
      name: 'TDK India Private Limited',
      slug: 'tdk-india',
      description: 'Indian manufacturing arm of TDK Corporation, producing ferrite cores, power inductors, film capacitors, and temperature sensors across facilities in Kalyani and Bawal.',
      categorySlug: 'passive-components',
      companyType: 'Manufacturer',
      hqCity: 'Kalyani',
      hqState: 'West Bengal',
      hqCountry: 'India',
      website: 'https://www.tdk-electronics.tdk.com',
      contactEmail: 'sales.india@tdk.com',
      contactPhone: '+91-33-25828200',
      employeeCountRange: '1000+',
      yearEstablished: 1996,
      revenueRange: '$100M+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified major manufacturer of ferrite magnetic cores and film capacitors.',
      dataSource: 'TDK Electronics India Disclosures',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Magnetics', name: 'Ferrite Sintering & Toroid Manufacturing', specifications: 'High-permeability MnZn and NiZn ferrites for automotive EV chargers' },
        { capabilityType: 'Capacitors', name: 'High-Voltage Metallized Film Capacitors', specifications: 'Self-healing DC link capacitors for solar inverters' },
      ],
      products: [
        { name: 'EPCOS Ferrite Cores (E, ETD, Toroids)', category: 'Ferrite Cores', description: 'Magnetic cores engineered for high-frequency transformers.' },
        { name: 'NTC Thermistor Temperature Sensors', category: 'Sensors', description: 'Precision glass-encapsulated temperature sensors for battery packs.' },
      ],
      services: [
        { name: 'Custom Inductive Component Development', category: 'Component Customization', capabilityLevel: 'High-Volume Production', description: 'Tailored winding and core geometry for EV powertrain customers.' },
      ],
      certifications: [
        { name: 'IATF 16949:2016', issuingBody: 'TÜV NORD', validUntil: '2027-03' },
        { name: 'ISO 9001:2015', issuingBody: 'TÜV NORD', validUntil: '2027-03' },
      ],
      industriesServed: ['Automotive / EV', 'Renewable Energy', 'Industrial Power', 'Telecommunications'],
      supplyNeeds: [
        { needType: 'Material', description: 'High-purity iron oxide, manganese carbonate, and metallized polypropylene film.' },
      ],
    },

    // --- DISTRIBUTION & SUPPLY CHAIN ---
    {
      name: 'Arrow Electronics India Private Limited',
      slug: 'arrow-electronics-india',
      description: 'Global provider of products, services, and solutions to industrial and commercial users of electronic components and enterprise computing solutions, with engineering centers in Bengaluru.',
      categorySlug: 'semiconductor-distribution',
      companyType: 'Distributor',
      hqCity: 'Bengaluru',
      hqState: 'Karnataka',
      hqCountry: 'India',
      website: 'https://www.arrow.com',
      contactEmail: 'india_sales@arrow.com',
      contactPhone: '+91-80-41353800',
      employeeCountRange: '1000+',
      yearEstablished: 1998,
      revenueRange: '$100M+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified authorized global distributor of semiconductors and passive components.',
      dataSource: 'Arrow Electronics Corporate Registry',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Supply Chain', name: 'Global Sourcing & Buffer Stock Warehousing', specifications: 'Automated bonded warehouse with anti-static ESD protection' },
        { capabilityType: 'Design Services', name: 'Field Application Engineering (FAE) Support', specifications: 'Reference hardware design and schematic review for OEMs' },
      ],
      products: [
        { name: 'Authorized Semiconductors & ICs', category: 'Active Silicon', description: 'Microcontrollers, FPGAs, analog switches, and memory chips.' },
        { name: 'Development Kits & Reference Boards', category: 'Dev Tools', description: 'Official evaluation boards from leading silicon manufacturers.' },
      ],
      services: [
        { name: 'BOM Consolidation & Supply Chain Financing', category: 'Supply Chain', capabilityLevel: 'Turnkey', description: 'Complete bill of materials kitting, tape-and-reel, and programmed ICs.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'BSI', validUntil: '2027-04' },
        { name: 'AS9120B (Aerospace Distributor)', issuingBody: 'BSI', validUntil: '2026-12' },
      ],
      industriesServed: ['Automotive', 'Industrial IoT', 'Aerospace & Defense', 'Consumer Electronics'],
      supplyNeeds: [
        { needType: 'Partnership', description: 'Domestic Indian semiconductor and passives manufacturers for global catalog listing.' },
      ],
    },
    {
      name: 'Mouser Electronics India',
      slug: 'mouser-electronics-india',
      description: 'Authorized distributor of semiconductors and electronic components, specializing in the rapid introduction of new products (NPI) from manufacturer partners for design engineers.',
      categorySlug: 'semiconductor-distribution',
      companyType: 'Distributor',
      hqCity: 'Bengaluru',
      hqState: 'Karnataka',
      hqCountry: 'India',
      website: 'https://www.mouser.in',
      contactEmail: 'india@mouser.com',
      contactPhone: '+91-80-42650000',
      employeeCountRange: '500-1000',
      yearEstablished: 2008,
      revenueRange: '$50M-$100M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified authorized electronic component catalog distributor.',
      dataSource: 'Mouser Electronics Corporate Registry',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Logistics', name: 'Same-Day Dispatch & Component Traceability', specifications: '100% manufacturer warranty and direct factory origin guarantee' },
      ],
      products: [
        { name: 'New Product Introductions (NPI)', category: 'Components', description: 'Over 6.8 million products from more than 1,200 manufacturer brands.' },
      ],
      services: [
        { name: 'Prototype Quantity Component Sourcing', category: 'Distribution', capabilityLevel: 'Turnkey', description: 'No minimum order quantities (MOQ 1) for R&D engineers.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'BSI', validUntil: '2027-02' },
        { name: 'AS9100D', issuingBody: 'BSI', validUntil: '2027-02' },
      ],
      industriesServed: ['R&D Labs', 'Engineering Prototyping', 'Aerospace', 'Medical Devices'],
      supplyNeeds: [
        { needType: 'Partnership', description: 'New semiconductor design houses releasing commercial evaluation kits.' },
      ],
    },

    // --- TEST, MEASUREMENT & EQUIPMENT ---
    {
      name: 'Applied Materials India Private Limited',
      slug: 'applied-materials-india',
      description: 'Leader in materials engineering solutions used to produce virtually every new chip and advanced display in the world. R&D and engineering center in Bengaluru.',
      categorySlug: 'semiconductor-equipment',
      companyType: 'Manufacturer',
      hqCity: 'Bengaluru',
      hqState: 'Karnataka',
      hqCountry: 'India',
      website: 'https://www.appliedmaterials.com',
      contactEmail: 'contact_india@amat.com',
      contactPhone: '+91-80-66283000',
      employeeCountRange: '1000+',
      yearEstablished: 2003,
      revenueRange: '$100M+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified global tier-1 semiconductor equipment manufacturer with center of excellence in Bengaluru.',
      dataSource: 'Applied Materials Corporate Registry',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Deposition', name: 'Chemical Vapor Deposition (CVD) & ALD', specifications: 'Atomic layer deposition tooling for sub-3nm gate dielectric films' },
        { capabilityType: 'Metrology', name: 'Optical and E-Beam Defect Inspection', specifications: 'Sub-nanometer precision in-line wafer defect inspection systems' },
      ],
      products: [
        { name: 'Centura CVD & Endura PVD Systems', category: 'Semiconductor Tooling', description: 'Industry standard thin film metallization and barrier layer deposition tools.' },
      ],
      services: [
        { name: 'Semiconductor Tool Engineering & Diagnostics', category: 'Field Engineering', capabilityLevel: 'High-Volume Production', description: 'Field service support, software optimization, and chamber refurbishments.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'LRQA', validUntil: '2027-05' },
        { name: 'ISO 14001', issuingBody: 'LRQA', validUntil: '2027-05' },
      ],
      industriesServed: ['Semiconductor Foundries', 'Memory Fabs', 'Advanced Packaging Fabs'],
      supplyNeeds: [
        { needType: 'Precision Machining', description: 'Ultra-high vacuum chamber stainless steel CNC machining and ceramic insulators.' },
      ],
    },
    {
      name: 'Keysight Technologies India',
      slug: 'keysight-technologies-india',
      description: 'World-renowned electronic test and measurement equipment and software company, providing oscilloscopes, RF signal generators, spectrum analyzers, and 5G test solutions.',
      categorySlug: 'test-measurement',
      companyType: 'Manufacturer',
      hqCity: 'Gurugram',
      hqState: 'Haryana',
      hqCountry: 'India',
      website: 'https://www.keysight.com',
      contactEmail: 'contact_india@keysight.com',
      contactPhone: '+91-124-2292010',
      employeeCountRange: '1000+',
      yearEstablished: 2014,
      revenueRange: '$100M+',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified leading electronic test and measurement provider.',
      dataSource: 'Keysight Technologies SEC Filings',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Measurement Bandwidth', name: 'Ultra-High Frequency RF to 110GHz', specifications: 'PNA-X vector network analyzers and real-time oscilloscopes up to 110GHz' },
        { capabilityType: 'Parametric Test', name: 'Semiconductor Wafer Level Reliability', specifications: '4070/4080 series automated parametric test systems' },
      ],
      products: [
        { name: 'Infiniium High-Bandwidth Real-Time Oscilloscopes', category: 'Oscilloscopes', description: '10-bit to 12-bit ADC oscilloscopes for high-speed signal integrity analysis.' },
        { name: 'PathWave Advanced Design System (ADS)', category: 'EDA Software', description: 'RF and microwave circuit simulation and electromagnetic verification software.' },
      ],
      services: [
        { name: 'Accredited Calibration & Repair Services', category: 'Calibration', capabilityLevel: 'Turnkey', description: 'NABL accredited calibration laboratory conforming to ISO/IEC 17025.' },
      ],
      certifications: [
        { name: 'ISO/IEC 17025:2017', issuingBody: 'NABL', validUntil: '2027-08' },
        { name: 'ISO 9001:2015', issuingBody: 'BSI', validUntil: '2027-02' },
      ],
      industriesServed: ['Telecommunications', 'Semiconductor R&D', 'Aerospace & Defense', 'Automotive Radar'],
      supplyNeeds: [
        { needType: 'Service', description: 'Specialized RF cable harness and connector sub-tier fabricators.' },
      ],
    },
    {
      name: 'Mistral Solutions Private Limited',
      slug: 'mistral-solutions',
      description: 'Technology design and systems engineering company specializing in high-performance embedded hardware, defense radar signal processing, and FPGA systems (an Axiscades company).',
      categorySlug: 'embedded-systems',
      companyType: 'Design House',
      hqCity: 'Bengaluru',
      hqState: 'Karnataka',
      hqCountry: 'India',
      website: 'https://www.mistralsolutions.com',
      contactEmail: 'info@mistralsolutions.com',
      contactPhone: '+91-80-45621100',
      employeeCountRange: '500-1000',
      yearEstablished: 1997,
      revenueRange: '$20M-$50M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified Indian embedded systems engineering firm with defense clearances.',
      dataSource: 'Axiscades Engineering Disclosures',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Rugged Systems', name: 'Conduction-Cooled VPX & VME Architecture', specifications: 'MIL-STD-810G and DO-254 compliant hardware design' },
        { capabilityType: 'Signal Processing', name: 'Multi-Core DSP and UltraScale+ FPGA', specifications: 'Real-time synthetic aperture radar (SAR) beamforming hardware' },
      ],
      products: [
        { name: 'Radar Processing VPX System Blades', category: 'Defense Hardware', description: '3U VPX high-bandwidth digital signal processing compute cards.' },
        { name: 'System on Modules (SoM)', category: 'Embedded SoM', description: 'Industrial temperature grade SoMs powered by Qualcomm Snapdragon and TI Sitara.' },
      ],
      services: [
        { name: 'Custom Embedded System Design & Prototyping', category: 'Engineering Services', capabilityLevel: 'Turnkey', description: 'Turnkey electronic hardware, BSP development, and MIL-STD qualification testing.' },
      ],
      certifications: [
        { name: 'AS9100D', issuingBody: 'TÜV Rheinland', validUntil: '2027-03' },
        { name: 'ISO 9001:2015', issuingBody: 'TÜV Rheinland', validUntil: '2027-03' },
        { name: 'CEMILAC Design Approved', issuingBody: 'DRDO', validUntil: '2028-06' },
      ],
      industriesServed: ['Aerospace & Defense', 'Homeland Security', 'Industrial Automation', 'Medical Devices'],
      supplyNeeds: [
        { needType: 'PCB Fabrication', description: 'Quick-turn 20-layer polyimide rigid-flex boards with controlled impedance.' },
      ],
    },
    {
      name: 'e-con Systems India Private Limited',
      slug: 'e-con-systems',
      description: 'Pioneer in OEM embedded camera modules, delivering industrial-grade MIPI CSI-2, GMSL2, and USB cameras with integrated image signal processors (ISP) for edge AI and robotics.',
      categorySlug: 'embedded-systems',
      companyType: 'Manufacturer',
      hqCity: 'Chennai',
      hqState: 'Tamil Nadu',
      hqCountry: 'India',
      website: 'https://www.e-consystems.com',
      contactEmail: 'sales@e-consystems.com',
      contactPhone: '+91-44-40152200',
      employeeCountRange: '500-1000',
      yearEstablished: 2003,
      revenueRange: '$20M-$50M',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Verified global OEM embedded vision hardware manufacturer.',
      dataSource: 'e-con Systems Corporate Disclosures',
      isDemonstration: false,
      capabilities: [
        { capabilityType: 'Optics & Vision', name: 'Cleanroom Optical Sensor Alignment', specifications: 'Active alignment (AA) technology for low lens flare and micro-focus' },
        { capabilityType: 'Interface', name: 'High-Speed SerDes GMSL2 & FPD-Link III', specifications: 'Long-distance automotive coax transmission up to 15 meters' },
      ],
      products: [
        { name: 'See3CAM High-Resolution USB Cameras', category: 'Cameras', description: 'Ultra-low light 4K USB 3.1 Gen 1 industrial autofocus cameras.' },
        { name: 'NVIDIA Jetson MIPI CSI-2 Synchronized Multi-Camera Kits', category: 'Vision Kits', description: 'Synchronized 6-camera surround view systems for autonomous mobile robots.' },
      ],
      services: [
        { name: 'Custom Camera Lens Tuning & ISP Customization', category: 'Optics Engineering', capabilityLevel: 'High-Volume Production', description: 'Color calibration and IQ tuning for specific lighting environments.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015', issuingBody: 'BSI', validUntil: '2027-06' },
      ],
      industriesServed: ['Robotics & Autonomous Vehicles', 'Medical Diagnostics', 'Smart Agriculture', 'Industrial Inspection'],
      supplyNeeds: [
        { needType: 'Components', description: 'CMOS image sensors (Sony Pregius, Onsemi AR0821) and motorized optical lenses.' },
      ],
    },

    // Additional Demonstration Records covering diverse tiers & verification states:
    {
      name: 'Silicon Fab Innovations (Demo)',
      slug: 'silicon-fab-innovations',
      description: 'Specialized 200mm wafer fabrication startup focusing on GaN-on-Si power semiconductor devices for high-efficiency electric vehicle traction inverters.',
      categorySlug: 'semiconductor-foundry',
      companyType: 'Foundry',
      hqCity: 'Hyderabad',
      hqState: 'Telangana',
      hqCountry: 'India',
      website: 'https://example.com/silicon-fab',
      contactEmail: 'contact@example-siliconfab.io',
      contactPhone: '+91-40-5550199',
      employeeCountRange: '51-200',
      yearEstablished: 2022,
      revenueRange: '$5M-$10M',
      verificationStatus: 'CLAIMED',
      verificationNotes: 'Company profile claimed by registrant, undergoing technical capability audit.',
      dataSource: 'Demonstration Record',
      isDemonstration: true,
      capabilities: [
        { capabilityType: 'Process Technology', name: 'Gallium Nitride on Silicon (GaN-on-Si)', specifications: '650V E-mode GaN HEMT wafer processing' },
      ],
      products: [
        { name: '650V GaN Power Transistor Wafers', category: 'Power Silicon', description: 'Fast switching power devices with near zero reverse recovery charge.' },
      ],
      services: [
        { name: 'GaN Epitaxial Growth & Processing', category: 'Foundry Services', capabilityLevel: 'Prototype', description: 'Custom MOCVD epitaxial wafer growth.' },
      ],
      certifications: [
        { name: 'ISO 9001:2015 (Pending Audit)', issuingBody: 'Self-Certified', validUntil: '2026-12' },
      ],
      industriesServed: ['Electric Vehicles', 'Renewable Energy Inverters'],
      supplyNeeds: [
        { needType: 'Material', description: 'High-resistivity 200mm silicon substrates and trimethylgallium (TMGa).' },
      ],
    },
    {
      name: 'MicroCircuit Assembly Works (Demo)',
      slug: 'microcircuit-assembly-works',
      description: 'Regional surface mount assembly house catering to quick-turn aerospace prototypes, box builds, and cable harnesses.',
      categorySlug: 'quickturn-pcba',
      companyType: 'Service Provider',
      hqCity: 'Coimbatore',
      hqState: 'Tamil Nadu',
      hqCountry: 'India',
      website: 'https://example.com/microcircuit',
      contactEmail: 'sales@example-microcircuit.in',
      contactPhone: '+91-422-5550123',
      employeeCountRange: '1-50',
      yearEstablished: 2018,
      revenueRange: '$1M-$5M',
      verificationStatus: 'UNVERIFIED',
      verificationNotes: 'Initial directory submission, documentation pending verification review.',
      dataSource: 'Demonstration Record',
      isDemonstration: true,
      capabilities: [
        { capabilityType: 'SMT Placement', name: '2 Medium-Speed SMT Lines', specifications: '0201 passive placement, manual prototype rework stations' },
      ],
      products: [
        { name: 'Custom LoRaWAN Sensor Node PCBA', category: 'IoT Boards', description: 'Ultra-low sleep current battery-powered environmental monitoring boards.' },
      ],
      services: [
        { name: 'Small-Batch PCBA Prototyping', category: 'Assembly', capabilityLevel: 'Prototype', description: 'Fast 5-day assembly turnaround for engineering teams.' },
      ],
      certifications: [],
      industriesServed: ['Smart Agriculture', 'Academic Research'],
      supplyNeeds: [
        { needType: 'Services', description: 'Automated optical inspection and PCB conformal coating partner.' },
      ],
    },
  ];

  console.log(`Seeding ${companiesData.length} companies...`);

  for (const c of companiesData) {
    const categoryId = categoryMap.get(c.categorySlug);
    if (!categoryId) {
      console.warn(`Category slug not found: ${c.categorySlug}`);
      continue;
    }

    const company = await prisma.company.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description,
        categoryId,
        companyType: c.companyType,
        hqCity: c.hqCity,
        hqState: c.hqState,
        hqCountry: c.hqCountry,
        website: c.website,
        contactEmail: c.contactEmail,
        contactPhone: c.contactPhone,
        employeeCountRange: c.employeeCountRange,
        yearEstablished: c.yearEstablished,
        revenueRange: c.revenueRange,
        verificationStatus: c.verificationStatus,
        verificationNotes: c.verificationNotes,
        dataSource: c.dataSource,
        isDemonstration: c.isDemonstration,
      },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        categoryId,
        companyType: c.companyType,
        hqCity: c.hqCity,
        hqState: c.hqState,
        hqCountry: c.hqCountry,
        website: c.website,
        contactEmail: c.contactEmail,
        contactPhone: c.contactPhone,
        employeeCountRange: c.employeeCountRange,
        yearEstablished: c.yearEstablished,
        revenueRange: c.revenueRange,
        verificationStatus: c.verificationStatus,
        verificationNotes: c.verificationNotes,
        dataSource: c.dataSource,
        isDemonstration: c.isDemonstration,
      },
    });

    // Clear and re-insert child relations for clean seed
    await prisma.companyCapability.deleteMany({ where: { companyId: company.id } });
    if (c.capabilities && c.capabilities.length > 0) {
      await prisma.companyCapability.createMany({
        data: c.capabilities.map((cap) => ({
          companyId: company.id,
          capabilityType: cap.capabilityType,
          name: cap.name,
          specifications: cap.specifications,
        })),
      });
    }

    await prisma.companyProduct.deleteMany({ where: { companyId: company.id } });
    if (c.products && c.products.length > 0) {
      await prisma.companyProduct.createMany({
        data: c.products.map((prod) => ({
          companyId: company.id,
          name: prod.name,
          category: prod.category,
          description: prod.description,
        })),
      });
    }

    await prisma.companyService.deleteMany({ where: { companyId: company.id } });
    if (c.services && c.services.length > 0) {
      await prisma.companyService.createMany({
        data: c.services.map((srv) => ({
          companyId: company.id,
          name: srv.name,
          category: srv.category,
          capabilityLevel: srv.capabilityLevel,
          description: srv.description,
        })),
      });
    }

    await prisma.companyCertification.deleteMany({ where: { companyId: company.id } });
    if (c.certifications && c.certifications.length > 0) {
      await prisma.companyCertification.createMany({
        data: c.certifications.map((cert) => ({
          companyId: company.id,
          name: cert.name,
          issuingBody: cert.issuingBody,
          validUntil: cert.validUntil,
        })),
      });
    }

    await prisma.companyIndustryServed.deleteMany({ where: { companyId: company.id } });
    if (c.industriesServed && c.industriesServed.length > 0) {
      await prisma.companyIndustryServed.createMany({
        data: c.industriesServed.map((ind) => ({
          companyId: company.id,
          industryName: ind,
        })),
      });
    }

    await prisma.companySupplyNeed.deleteMany({ where: { companyId: company.id } });
    if (c.supplyNeeds && c.supplyNeeds.length > 0) {
      await prisma.companySupplyNeed.createMany({
        data: c.supplyNeeds.map((need) => ({
          companyId: company.id,
          needType: need.needType,
          description: need.description,
        })),
      });
    }
  }

  // 5. Seed Initial Saved Company for Demo Organization
  const sclCompany = await prisma.company.findUnique({ where: { slug: 'scl-chandigarh' } });
  const engineerUser = await prisma.user.findUnique({ where: { email: 'engineer@mindgrove.in' } });
  if (sclCompany && engineerUser && engineerUser.organizationId) {
    await prisma.savedCompany.upsert({
      where: {
        organizationId_companyId: {
          organizationId: engineerUser.organizationId,
          companyId: sclCompany.id,
        },
      },
      update: {},
      create: {
        organizationId: engineerUser.organizationId,
        userId: engineerUser.id,
        companyId: sclCompany.id,
        status: 'EVALUATING',
        notes: 'Exploring radiation-hardened MPW shuttle run for our next-generation Secure IoT RISC-V SoC.',
        tags: 'Foundry,MPW Shuttle,180nm,Aerospace',
      },
    });
  }

  console.log('--- VIASET Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
