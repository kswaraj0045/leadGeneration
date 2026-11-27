import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Activity,
  Zap,
  Building2,
  Globe2,
  ArrowRight,
  CheckCircle2,
  Award,
  Filter,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';

interface IndustryDomain {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: any;
  color: string;
  badgeBg: string;
  companyCount: number;
  technicalParameters: string[];
  certifications: string[];
  keyPlayers: string[];
}

export const IndustryExplorerPage: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('foundry');

  const domains: IndustryDomain[] = [
    {
      id: 'foundry',
      name: 'Semiconductor Foundries',
      slug: 'semiconductor-foundry',
      description: 'Pure-play and integrated front-end wafer fabrication facilities manufacturing microchips from silicon and wide bandgap (GaN, SiC) wafers.',
      icon: Cpu,
      color: 'text-teal-600',
      badgeBg: 'bg-teal-50 border-teal-200 text-teal-800',
      companyCount: 4,
      technicalParameters: [
        'Process Node Technology (3nm, 5nm, 7nm, 16nm FinFET, 28nm HKMG, 65nm, 180nm Planar)',
        'Wafer Sizes (300mm / 12-inch, 200mm / 8-inch, 150mm / 6-inch)',
        'Substrate Material (Monocrystalline Silicon, Silicon-on-Insulator SOI, Silicon Carbide SiC, Gallium Nitride GaN)',
        'Cleanroom Standards (ISO Class 1, Class 10, Class 100)',
      ],
      certifications: ['IATF 16949 (Automotive)', 'ISO 9001:2015', 'ISO 14001', 'ISO 27001 (IP Security)'],
      keyPlayers: ['TSMC (Taiwan Semiconductor)', 'UMC', 'GlobalFoundries', 'Semi-Conductor Laboratory (SCL Mohali)'],
    },
    {
      id: 'fabless',
      name: 'Fabless IC Design Houses',
      slug: 'ic-design-fabless',
      description: 'Semiconductor architecture, micro-architecture, logic synthesis, physical design, and verification companies producing custom silicon and ASICs.',
      icon: Layers,
      color: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      companyCount: 5,
      technicalParameters: [
        'ISA & Microarchitecture (RISC-V 32/64-bit, ARM Cortex, Custom DSP cores)',
        'Silicon Complexity (Multi-core SoC, Mixed-Signal, RF Transceiver, Analog Front-End)',
        'EDA Toolchain Verification (Synopsys, Cadence, Siemens EDA, OpenROAD)',
        'Target Markets (Industrial IoT, Automotive ECU, Edge AI, Power Management ICs)',
      ],
      certifications: ['ISO 9001', 'ISO 26262 (ASIL-D Automotive Functional Safety)', 'Common Criteria EAL5+'],
      keyPlayers: ['Mindgrove Technologies', 'Ineda Systems', 'MosChip Technologies', 'MediaTek', 'Qualcomm'],
    },
    {
      id: 'osat',
      name: 'OSAT Packaging & Test',
      slug: 'osat-packaging',
      description: 'Outsourced Semiconductor Assembly and Test providers handling wafer bumping, wire bonding, flip-chip, advanced 2.5D/3D packaging, and ATE electrical testing.',
      icon: Activity,
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 border-blue-200 text-blue-800',
      companyCount: 4,
      technicalParameters: [
        'Packaging Formats (BGA, FCBGA, QFN, WLCSP, SiP System-in-Package, Multi-Chip Modules)',
        'Interconnect Tech (Copper Wire Bonding, Gold Wire, Solder Bump, Copper Pillar)',
        'Testing Modalities (Automated Test Equipment ATE, Wafer Sort / Probe, Burn-in, Environmental Screening)',
        'Cleanroom Specification (Class 100, Class 1,000)',
      ],
      certifications: ['IATF 16949', 'AEC-Q100 Qualification', 'ISO 9001', 'ANSI/ESD S20.20'],
      keyPlayers: ['ASE Group', 'Amkor Technology', 'Kaynes Semicon (Sanand)', 'Tata Electronics OSAT'],
    },
    {
      id: 'hdi_pcb',
      name: 'High-Density Interconnect PCBs',
      slug: 'pcb-fabrication',
      description: 'Precision printed circuit board fabricators capable of microvias, stacked vias, ultra-fine pitch trace/space, and high-frequency RF substrates.',
      icon: Zap,
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
      companyCount: 5,
      technicalParameters: [
        'Layer Count (4 to 32+ Layers, Any-Layer HDI, Blind & Buried Microvias)',
        'Minimum Trace / Space (3 mil / 3 mil, down to 1.5 mil / 1.5 mil)',
        'Substrate Laminates (FR-4 High-Tg, Rogers 4350B, Isola, Polyimide Flex-Rigid)',
        'Surface Finishes (ENIG, ENEPIG, Immersion Silver, OSP, Hard Gold)',
      ],
      certifications: ['IPC-6012 Class 3 / 3A (Aerospace/Defense)', 'UL 94V-0', 'ISO 9001', 'AS9100D'],
      keyPlayers: ['Unimicron Technology', 'AT&S', 'Shogini Technoarts', 'Epitome Components'],
    },
    {
      id: 'ems',
      name: 'Electronics Manufacturing Services (EMS)',
      slug: 'pcb-assembly-ems',
      description: 'Turnkey electronics contract manufacturers offering surface-mount technology (SMT), automated optical inspection (AOI), conformal coating, and box-build assembly.',
      icon: Building2,
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      companyCount: 5,
      technicalParameters: [
        'Component Placement Capability (SMT 01005 chips, 0.3mm pitch BGA, PoP Package-on-Package)',
        'Inspection Systems (3D Solder Paste Inspection SPI, 3D AOI, 3D Computed Tomography X-Ray)',
        'Assembly Scope (PCBA Turnkey, Through-Hole THT, Robotic Conformal Coating, System Box-Build)',
        'Production Capacity (High-Mix Low-Volume to High-Volume Consumer / Automotive)',
      ],
      certifications: ['IATF 16949 (Automotive)', 'ISO 13485 (Medical Devices)', 'IPC-A-610 Class 3', 'AS9100D'],
      keyPlayers: ['Foxconn / Hon Hai', 'Kaynes Technology India', 'Syrma SGS Technology', 'Dixon Technologies'],
    },
    {
      id: 'components',
      name: 'Passive & Active Components',
      slug: 'passive-components',
      description: 'Manufacturers and precision distributors of discrete semiconductors, MLCC capacitors, resistors, inductors, crystals, and automotive power passives.',
      icon: Globe2,
      color: 'text-purple-600',
      badgeBg: 'bg-purple-50 border-purple-200 text-purple-800',
      companyCount: 5,
      technicalParameters: [
        'Capacitor Technologies (Multi-layer Ceramic MLCC 0201 to 1210, Tantalum, Aluminum Polymer)',
        'Resistor Tolerances (Thin-Film 0.05% Precision, Thick-Film Current Sense, AEC-Q200 Grade)',
        'Magnetic Components (High-current Power Inductors, Common Mode Chokes, Planar Transformers)',
        'Discrete Semiconductors (Schottky Diodes, MOSFETs, TVS Surge Protection, GaN FETs)',
      ],
      certifications: ['AEC-Q200 (Passives Automotive)', 'AEC-Q101 (Discretes)', 'ISO 9001', 'RoHS / REACH Compliant'],
      keyPlayers: ['Murata Manufacturing', 'TDK Corporation', 'Yageo Corporation', 'Vishay Intertechnology'],
    },
  ];

  const activeDomain = domains.find((d) => d.id === selectedDomain) || domains[0];
  const ActiveIcon = activeDomain.icon;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-xl border border-saas-border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-saas-accent bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-semibold">
                Intelligence Taxonomy
              </span>
              <span className="text-xs text-saas-secondary">6 Standard Industry Domains</span>
            </div>
            <h1 className="text-2xl font-bold text-saas-primary tracking-tight">
              Semiconductor & Electronics Industry Explorer
            </h1>
            <p className="text-sm text-saas-secondary mt-1">
              Explore technical taxonomy specifications, manufacturing criteria, and indexed vendors across the supply chain.
            </p>
          </div>

          <Link
            to={`/app/discovery?category=${encodeURIComponent(activeDomain.name)}`}
            className="px-4 py-2 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
          >
            <Filter size={14} />
            Filter {activeDomain.name} ({activeDomain.companyCount})
          </Link>
        </div>

        {/* 6 DOMAIN SELECTOR CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {domains.map((dom) => {
            const Icon = dom.icon;
            const isSelected = dom.id === selectedDomain;
            return (
              <button
                key={dom.id}
                onClick={() => setSelectedDomain(dom.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-white border-saas-accent shadow-xs ring-2 ring-saas-accent/20'
                    : 'bg-white/80 border-saas-border hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className={`w-8 h-8 rounded-lg ${dom.badgeBg} flex items-center justify-center mb-2.5`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="text-xs font-bold text-saas-primary leading-tight mb-1">
                    {dom.name}
                  </h3>
                </div>
                <div className="text-[11px] font-mono text-saas-secondary mt-2 flex items-center justify-between">
                  <span>{dom.companyCount} Entities</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-saas-accent" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* DETAILED ACTIVE DOMAIN DOSSIER */}
        <div className="bg-white rounded-xl border border-saas-border p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-saas-border gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${activeDomain.badgeBg} flex items-center justify-center shrink-0`}>
                <ActiveIcon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-saas-primary">{activeDomain.name}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-saas-secondary">
                    {activeDomain.companyCount} Audited Companies
                  </span>
                </div>
                <p className="text-xs text-saas-secondary mt-1 leading-relaxed max-w-3xl">
                  {activeDomain.description}
                </p>
              </div>
            </div>

            <Link
              to={`/app/discovery?category=${encodeURIComponent(activeDomain.name)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-saas-primary hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              Browse All {activeDomain.name}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TECHNICAL CAPABILITIES TRACKED */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-saas-primary flex items-center gap-1.5">
                <Sliders size={14} className="text-saas-accent" />
                Indexed Technical Parameters
              </h3>
              <div className="space-y-2">
                {activeDomain.technicalParameters.map((param, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-saas-border bg-slate-50/60 text-xs text-saas-primary flex items-start gap-2"
                  >
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{param}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AUDIT & QUALITY CERTIFICATIONS */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-saas-primary flex items-center gap-1.5">
                <Award size={14} className="text-indigo-600" />
                Mandatory & Preferred Standards
              </h3>
              <div className="space-y-2">
                {activeDomain.certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-saas-border bg-white text-xs text-saas-primary flex items-center justify-between"
                  >
                    <span className="font-semibold">{cert}</span>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                      Audited
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* BENCHMARK ECOSYSTEM PLAYERS */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-saas-primary flex items-center gap-1.5">
                <Building2 size={14} className="text-teal-600" />
                Benchmark Ecosystem Entities
              </h3>
              <div className="space-y-2">
                {activeDomain.keyPlayers.map((player, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-saas-border bg-white flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-saas-primary">{player}</span>
                    <Link
                      to={`/app/discovery?q=${encodeURIComponent(player.split(' ')[0])}`}
                      className="text-xs text-saas-accent hover:underline flex items-center gap-1 font-medium"
                    >
                      Find Profile <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
