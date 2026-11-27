import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  MapPin,
  Building2,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';

interface Corridor {
  id: string;
  name: string;
  region: string;
  countryCode: string;
  flag: string;
  hubs: string[];
  entityCount: number;
  coreFocus: string;
  specialization: string[];
  regulatoryProgram: string;
  incentives: string;
  companies: string[];
}

export const GeographicInsightsPage: React.FC = () => {
  const [selectedCorridor, setSelectedCorridor] = useState<string>('india');

  const corridors: Corridor[] = [
    {
      id: 'india',
      name: 'India Semiconductor & Electronics Corridor',
      region: 'South Asia',
      countryCode: 'IN',
      flag: '🇮🇳',
      hubs: ['Bengaluru (Silicon Plateau)', 'Sanand / Dholera (Gujarat)', 'Chennai / Sriperumbudur (Tamil Nadu)', 'Noida / Greater Noida (UP)', 'Hyderabad'],
      entityCount: 12,
      coreFocus: 'Fabless IC Design, OSAT Packaging, High-Volume EMS & System Assembly',
      specialization: ['RISC-V Microarchitectures', 'Automotive & Industrial EMS', 'Turnkey BGA Packaging', 'Multilayer High-Reliability PCBs'],
      regulatoryProgram: 'India Semiconductor Mission (ISM) & SPECS',
      incentives: '50% fiscal support for capital expenditure on silicon fabs and ATMP/OSAT packaging units.',
      companies: ['Kaynes Technology', 'Mindgrove Technologies', 'Semi-Conductor Laboratory (SCL)', 'Syrma SGS', 'Dixon Technologies'],
    },
    {
      id: 'taiwan',
      name: 'Taiwan Advanced Silicon Corridor',
      region: 'East Asia',
      countryCode: 'TW',
      flag: '🇹🇼',
      hubs: ['Hsinchu Science Park (HSP)', 'Tainan Science Park (STSP)', 'Taichung (CTSP)'],
      entityCount: 5,
      coreFocus: 'Leading-Edge Foundry Fabrication, Advanced 2.5D/3D OSAT, Substrates',
      specialization: ['3nm / 5nm / 7nm FinFET Nodes', 'CoWoS (Chip-on-Wafer-on-Substrate)', 'High-Density Any-Layer HDI PCBs', 'Pure-play Foundry Ecosystem'],
      regulatoryProgram: 'Taiwan Industrial Innovation Act (Chips Act)',
      incentives: '25% tax credits on annual R&D expenditure and advanced equipment investments.',
      companies: ['TSMC', 'UMC', 'ASE Group', 'Unimicron Technology', 'MediaTek'],
    },
    {
      id: 'usa',
      name: 'United States Microelectronics Hubs',
      region: 'North America',
      countryCode: 'US',
      flag: '🇺🇸',
      hubs: ['Silicon Valley (San Jose, Santa Clara)', 'Austin (Silicon Hills)', 'Phoenix / Chandler (Arizona)', 'Hillsboro (Silicon Forest)'],
      entityCount: 4,
      coreFocus: 'Microprocessor Architecture, EDA Automation, Specialized RF & GaN',
      specialization: ['High-Performance Computing GPUs/CPUs', 'Electronic Design Automation Tools', 'ITAR Defense Microelectronics', 'Analog & Power Management'],
      regulatoryProgram: 'CHIPS and Science Act of 2022',
      incentives: '$52.7 billion in direct manufacturing subsidies and 25% investment tax credit (ITC).',
      companies: ['Qualcomm', 'GlobalFoundries', 'Amkor Technology', 'Vishay Intertechnology'],
    },
    {
      id: 'japan',
      name: 'Japan Precision Semiconductor & Materials Hub',
      region: 'East Asia',
      countryCode: 'JP',
      flag: '🇯🇵',
      hubs: ['Tokyo Metropolitan Area', 'Kumamoto (Silicon Island Kyushu)', 'Osaka / Kyoto Region'],
      entityCount: 4,
      coreFocus: 'Semiconductor Silicon Wafers, MLCC Passives, Photoresists, Packaging Substrates',
      specialization: ['Precision MLCC Capacitors', 'Silicon Ingot & Wafer Slicing', 'Extreme Ultraviolet (EUV) Chemicals', 'Automotive Grade Passives AEC-Q200'],
      regulatoryProgram: 'Japan METI Semiconductor Strategy',
      incentives: 'Up to 50% government co-funding for domestic wafer fabrication and advanced packaging.',
      companies: ['Murata Manufacturing', 'TDK Corporation', 'Tokyo Electron', 'Shin-Etsu Handotai'],
    },
    {
      id: 'europe',
      name: 'European Chips & Automotive Silicon Cluster',
      region: 'Western & Central Europe',
      countryCode: 'EU',
      flag: '🇪🇺',
      hubs: ['Dresden (Silicon Saxony, Germany)', 'Grenoble (Silicon Alps, France)', 'Cambridge / Bristol (UK)', 'Eindhoven (Brainport, Netherlands)'],
      entityCount: 3,
      coreFocus: 'Automotive Microcontrollers, Mixed-Signal, Industrial Power GaN/SiC',
      specialization: ['IATF 16949 Certified Powertrain Chips', 'Extreme Ultraviolet Photolithography Optics', 'High-Tg Specialized PCBs', 'ASIL-D Functional Safety'],
      regulatoryProgram: 'European Chips Act',
      incentives: '€43 billion policy framework aimed at doubling Europe\'s global semiconductor manufacturing share to 20%.',
      companies: ['AT&S (Austria)', 'Infineon Technologies', 'STMicroelectronics', 'NXP'],
    },
  ];

  const active = corridors.find((c) => c.id === selectedCorridor) || corridors[0];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-xl border border-saas-border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-saas-accent bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-semibold">
                Locations & Hubs
              </span>
              <span className="text-xs text-saas-secondary">5 Key Global Regions</span>
            </div>
            <h1 className="text-2xl font-bold text-saas-primary tracking-tight">
              Locations & Manufacturing Hubs
            </h1>
            <p className="text-sm text-saas-secondary mt-1">
              Explore localized production clusters, key hubs, and company density by country.
            </p>
          </div>

          <Link
            to={`/app/discovery?country=${active.countryCode}`}
            className="px-4 py-2 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors shrink-0"
          >
            <Filter size={14} />
            View {active.name.split(' ')[0]} Companies ({active.entityCount})
          </Link>
        </div>

        {/* REGIONAL CORRIDOR SELECTOR PILLS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {corridors.map((c) => {
            const isSelected = c.id === selectedCorridor;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCorridor(c.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-saas-accent shadow-xs ring-2 ring-saas-accent/20'
                    : 'bg-white/80 border-saas-border hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{c.flag}</span>
                    <span className="text-xs font-mono font-bold text-saas-accent">{c.entityCount} Companies</span>
                  </div>
                  <h3 className="text-xs font-bold text-saas-primary leading-tight mb-1">
                    {c.name}
                  </h3>
                  <p className="text-[11px] text-saas-secondary">{c.region}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE CORRIDOR DOSSIER */}
        <div className="bg-white rounded-xl border border-saas-border p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-saas-border gap-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{active.flag}</span>
              <div>
                <h2 className="text-xl font-bold text-saas-primary">{active.name}</h2>
                <p className="text-xs text-saas-secondary mt-1 font-mono">
                  Primary Specialization: <strong className="text-saas-primary">{active.coreFocus}</strong>
                </p>
              </div>
            </div>

            <Link
              to={`/app/discovery?country=${active.countryCode}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-saas-primary hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              Browse Facilities in {active.countryCode}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* KEY HUBS & GEOGRAPHIES */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-saas-primary flex items-center gap-1.5">
                <MapPin size={14} className="text-saas-accent" />
                Key Manufacturing Hubs
              </h3>
              <div className="space-y-2">
                {active.hubs.map((hub, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-saas-border bg-slate-50/60 text-xs text-saas-primary font-medium flex items-center gap-2"
                  >
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>{hub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TECHNICAL SPECIALIZATIONS */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-saas-primary flex items-center gap-1.5">
                <Cpu size={14} className="text-indigo-600" />
                Technical Capabilities
              </h3>
              <div className="space-y-2">
                {active.specialization.map((spec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-saas-border bg-white text-xs text-saas-primary flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REGULATORY FRAMEWORK & INCENTIVES */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-saas-primary flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Government Incentives & Policy
              </h3>
              <div className="p-4 rounded-lg border border-saas-border bg-slate-50/70 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-saas-secondary">Framework</span>
                  <div className="font-bold text-saas-primary mt-0.5">{active.regulatoryProgram}</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-saas-secondary">Incentive Mechanism</span>
                  <p className="text-saas-secondary leading-relaxed mt-0.5">{active.incentives}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-saas-secondary">Indexed Players</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {active.companies.map((co, i) => (
                      <span key={i} className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-saas-border text-saas-primary">
                        {co}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
