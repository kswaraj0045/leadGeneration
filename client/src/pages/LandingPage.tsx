import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Search,
  Sparkles,
  ShieldCheck,
  Layers,
  Factory,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Globe,
  Award,
  ChevronRight,
  TrendingUp,
  Boxes,
  Database,
  BarChart3,
  Terminal,
  Activity,
  FileSpreadsheet,
  Check,
  Lock,
  Bookmark,
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { VerificationBadge, PlanBadge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'foundry' | 'osat' | 'pcb' | 'ems' | 'components'>('foundry');

  const livePreviewData = {
    foundry: [
      { name: 'Semi-Conductor Laboratory (SCL)', node: '180nm CMOS / MEMS', cleanroom: 'Class 10 / ISO 4', location: 'Mohali, India', certs: 'ISO 9001, ISRO Space', status: 'VERIFIED' as const },
      { name: 'Tower Semiconductor Limited', node: '65nm - 180nm BCD & SiPho', cleanroom: 'ISO Class 4', location: 'Migdal Haemek, Israel', certs: 'IATF 16949, ISO 14001', status: 'VERIFIED' as const },
      { name: 'GlobalFoundries Inc.', node: '12LP+ FinFET / 22FDX', cleanroom: 'Class 1 Standards', location: 'Malta, NY, USA', certs: 'IATF 16949, ISO 27001', status: 'VERIFIED' as const },
    ],
    osat: [
      { name: 'Kaynes Semicon Private Limited', node: 'QFN, BGA, Flip-Chip, SiP', cleanroom: 'Class 100 / ISO 5', location: 'Sanand, Gujarat, India', certs: 'IATF 16949 Compliant', status: 'VERIFIED' as const },
      { name: 'Tata Electronics OSAT Facility', node: '2.5D/3D Heterogeneous Packaging', cleanroom: 'ISO Class 5 & 6', location: 'Morigaon, Assam, India', certs: 'ISO 9001:2015', status: 'VERIFIED' as const },
      { name: 'Amkor Technology Inc.', node: 'SWIFT Fan-Out, FCBGA', cleanroom: 'Cleanroom Class 100', location: 'Tempe, AZ, USA', certs: 'IATF 16949, ISO 14001', status: 'VERIFIED' as const },
    ],
    pcb: [
      { name: 'AT&S India', node: 'Up to 32 Layer HDI Any-Layer', cleanroom: 'High-Density Laser Microvia', location: 'Nanjangud, Karnataka, India', certs: 'IATF 16949, AS9100D', status: 'VERIFIED' as const },
      { name: 'Shogini Technoarts Pvt Ltd', node: '1 to 24 Layer Rigid & MCPCB', cleanroom: 'Impedance Controlled (+/-5%)', location: 'Pune, Maharashtra, India', certs: 'IATF 16949, ISO 9001', status: 'VERIFIED' as const },
      { name: 'Ascent Circuits Pvt Ltd', node: 'Rigid-Flex & Rogers RF Substrates', cleanroom: 'High-Frequency PTFE Hybrid', location: 'Hosur, Tamil Nadu, India', certs: 'ISO 9001, IATF 16949', status: 'VERIFIED' as const },
    ],
    ems: [
      { name: 'Kaynes Technology India Ltd', node: '45+ SMT Lines (01005 passives)', cleanroom: 'Class 8 Cleanroom / 3D AOI', location: 'Mysuru, Karnataka, India', certs: 'IATF 16949, AS9100D, ISO 13485', status: 'VERIFIED' as const },
      { name: 'Dixon Technologies (India) Ltd', node: 'High-Speed Automated SMT Cells', cleanroom: 'Over 80M Placements/Day', location: 'Noida, Uttar Pradesh, India', certs: 'ISO 9001, ISO 14001', status: 'VERIFIED' as const },
      { name: 'Syrma SGS Technology Ltd', node: 'Precision SMT & Magnetics Winding', cleanroom: 'High-Density PCBA + RFID', location: 'Chennai, Tamil Nadu, India', certs: 'IATF 16949, AS9100D', status: 'VERIFIED' as const },
    ],
    components: [
      { name: 'Continental Device India Ltd (CDIL)', node: 'Silicon Transistors & TVS Diodes', cleanroom: 'High-Voltage Testing (1500V)', location: 'New Delhi / Mohali, India', certs: 'IATF 16949, ISRO Flight', status: 'VERIFIED' as const },
      { name: 'Murata Manufacturing Co., Ltd.', node: 'Nanoscale MLCC Ceramic Sintering', cleanroom: '008004 Miniature Dielectrics', location: 'Kyoto, Japan', certs: 'IATF 16949, ISO 9001', status: 'VERIFIED' as const },
      { name: 'Vishay Intertechnology, Inc.', node: 'TrenchFET Gen IV Power MOSFETs', cleanroom: 'Bulk Metal Foil / AEC-Q200', location: 'Malvern, PA, USA / Pune', certs: 'IATF 16949, ISO 9001', status: 'VERIFIED' as const },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION: ENTERPRISE SAAS PRESENTATION */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-slate-800 bg-gradient-to-b from-navy-950 via-slate-950 to-slate-900">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status Chip */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-mono shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
              </span>
              <span className="font-semibold tracking-wider uppercase text-[11px]">
                ENTERPRISE SUPPLY-CHAIN INTELLIGENCE PLATFORM
              </span>
            </div>
          </div>

          {/* SaaS Headline & Value Proposition */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Mission-Critical Intelligence for the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-200 to-indigo-300">
                Semiconductor & Electronics
              </span>{' '}
              Ecosystem
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              A specialized B2B SaaS platform connecting global OEMs and engineering leaders with verified wafer foundries, OSAT packaging facilities, advanced PCB fabricators, and EMS providers through <strong>explainable, deterministic capability matching</strong>.
            </p>

            {/* Enterprise CTA Row */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/app/discovery"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-all shadow-lg shadow-teal-600/30 group"
              >
                <span>Launch Intelligence Console</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/app/matching"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all shadow-sm"
              >
                <Sparkles size={16} className="text-teal-400" />
                <span>Execute Compatibility Matcher</span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-lg text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                <span>Demo Accounts Available</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* ENTERPRISE SAAS CONSOLE PREVIEW (REPLACES E-COMMERCE SEARCH BAR) */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Window Top Bar */}
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-slate-500 ml-2">|</span>
                <span className="text-teal-400 flex items-center gap-1.5 font-semibold">
                  <Terminal size={14} />
                  VIASET-INTELLIGENCE-CONSOLE v1.0
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1 text-slate-400">
                  <Activity size={13} className="text-teal-400" /> 28 Qualified Nodes
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Deterministic Matcher: ONLINE</span>
              </div>
            </div>

            {/* Console Sub-header & Metrics Bar */}
            <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                    Wafer Geometries
                  </span>
                  <span className="text-sm font-bold text-white font-mono">12nm to 180nm</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                    Packaging Standards
                  </span>
                  <span className="text-sm font-bold text-teal-400 font-mono">QFN, BGA, SiP, 2.5D</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                    Quality Compliance
                  </span>
                  <span className="text-sm font-bold text-indigo-400 font-mono">IATF 16949 / AS9100D</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                    Cleanroom Standard
                  </span>
                  <span className="text-sm font-bold text-white font-mono">Class 1 to ISO 8</span>
                </div>
              </div>
            </div>

            {/* Live Interactive Tabs in Terminal */}
            <div className="bg-slate-950 px-4 pt-3 flex flex-wrap gap-2 text-xs font-mono border-b border-slate-800">
              {[
                { id: 'foundry', label: 'WAFERS & FOUNDRIES' },
                { id: 'osat', label: 'OSAT & PACKAGING' },
                { id: 'pcb', label: 'HDI PCB FABRICATION' },
                { id: 'ems', label: 'TURNKEY EMS ASSEMBLY' },
                { id: 'components', label: 'COMPONENTS & SILICON' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-t-lg transition-colors font-semibold ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-teal-400 border-t border-x border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live Terminal Data Table */}
            <div className="p-4 sm:p-6 bg-slate-900 overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                    <th className="pb-3 font-semibold">Enterprise / Facility</th>
                    <th className="pb-3 font-semibold">Technical Specification / Node</th>
                    <th className="pb-3 font-semibold">Cleanroom Standard</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Audit Standards</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
                  {livePreviewData[activeTab].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 font-bold text-white font-sans">{row.name}</td>
                      <td className="py-3.5 text-teal-300 font-semibold">{row.node}</td>
                      <td className="py-3.5 text-slate-300">{row.cleanroom}</td>
                      <td className="py-3.5 text-slate-400 font-sans">{row.location}</td>
                      <td className="py-3.5 text-indigo-300">{row.certs}</td>
                      <td className="py-3.5 text-right font-sans">
                        <VerificationBadge status={row.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Showing verified registry sample • 28 enterprise records indexed</span>
                <Link
                  to="/app/discovery"
                  className="text-teal-400 hover:text-teal-300 font-sans font-semibold inline-flex items-center gap-1"
                >
                  <span>Open Full Discovery Matrix</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE SAAS PILLARS (HOW IT WORKS FOR B2B LEADERS) */}
      <section id="capabilities" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-teal-400">
              Core SaaS Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
              Engineered for Enterprise Supply-Chain Diligence
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Replacing scattered directories and manual spreadsheets with centralized technical intelligence, verifiable data provenance, and automated capability evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Deterministic Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-dimensional mathematical compatibility score across capabilities (35%), products (25%), market sector (20%), location (10%), and certifications (10%).
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Verifiable Data Provenance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear distinction between verified enterprise facilities, claimed corporate profiles, and audit records with full data source transparency.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Bookmark size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Sourcing Pipeline (VMS)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track candidate vendors through lifecycle stages: Evaluating, Contacted, Partner, and Approved Supplier with private organization notes and custom tags.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Automated Ingestion & Export</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bulk CSV dataset ingestion with duplicate detection and dry-run preview, plus one-click structured Excel and CSV exports for ERP integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLAINABLE MATCHING ENGINE SPOTLIGHT */}
      <section id="matcher" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono">
                <Sparkles size={14} />
                <span>Transparent Scoring Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Why Transparent Heuristics Beat Black-Box Algorithms
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                In high-reliability semiconductor sourcing (aerospace, automotive, medical), procurement teams cannot rely on unverified AI recommendations. VIASET calculates compatibility with mathematical transparency:
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
                <p className="text-teal-400 font-semibold mb-1">// Deterministic Compatibility Formula</p>
                <p>Compatibility Score = (Cap × 0.35) + (Prod × 0.25) + (Sec × 0.20) + (Geo × 0.10) + (Cert × 0.10)</p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-teal-400 shrink-0" />
                  <span>Explains exactly why each company is recommended (capabilities, line counts, cleanroom grade).</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-teal-400 shrink-0" />
                  <span>Highlights critical capability gaps (e.g., missing IATF 16949 certification or absence of cleanroom Class 10).</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-teal-400 shrink-0" />
                  <span>Configurable weights to prioritize regional proximity, process nodes, or compliance standards.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/app/matching"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/30"
                >
                  <span>Open Algorithmic Workbench</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Scorecard Preview */}
            <div className="lg:col-span-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-slate-400">Match Output Dossier</span>
                <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 font-mono font-bold text-xs">
                  Fit Index: 96%
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Kaynes Semicon Private Limited</h4>
                <p className="text-xs text-slate-400">OSAT Packaging & Automated Test • Sanand, Gujarat, India</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Capabilities Score</span>
                  <span className="text-teal-400 font-bold text-sm">100% (QFN, BGA, SiP)</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Quality Audit</span>
                  <span className="text-indigo-400 font-bold text-sm">100% (IATF 16949)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-teal-500/20 text-xs space-y-2">
                <p className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider font-mono">
                  Why Recommended:
                </p>
                <ul className="space-y-1 text-slate-300 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-teal-400 shrink-0" />
                    Holds high-volume QFN, BGA, and fine-pitch wire bonding packaging lines.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-teal-400 shrink-0" />
                    Automotive-grade tri-temp testing (-40°C to +150°C) with IATF 16949 certification.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE PRICING & TIERS */}
      <section id="pricing" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-teal-400">
              SaaS Subscription Tiers
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
              Predictable Enterprise Licensing
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Configurable usage quotas for search queries, pipeline tracking, and data exports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Basic Starter</h3>
                  <PlanBadge plan="BASIC" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For individual researchers and academic engineers exploring the semiconductor ecosystem.
                </p>
                <p className="text-3xl font-bold font-mono text-white">Free</p>
                <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> 50 Monthly Registry Searches</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> 25 Pipeline Saved Companies</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> 5 CSV Data Exports / Month</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Standard Industry Taxonomy</p>
                </div>
              </div>
              <Link to="/login" className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-center font-semibold text-xs text-slate-200">
                Access Basic Console
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border-2 border-teal-500 shadow-2xl relative space-y-6 flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-500 text-slate-950 font-mono text-[10px] font-bold uppercase tracking-wider">
                Enterprise Recommended
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Professional Tier</h3>
                  <PlanBadge plan="PRO" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For fabless IC startups, hardware procurement divisions, and EMS sourcing leads.
                </p>
                <p className="text-3xl font-bold font-mono text-white">₹499 <span className="text-xs text-slate-400 font-sans font-normal">/ month</span></p>
                <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> 500 Monthly Searches</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> 200 Pipeline Saved Companies</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> 50 Excel (.xlsx) & CSV Exports</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Advanced Process Node & Cleanroom Filters</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Custom Heuristic Weight Sliders</p>
                </div>
              </div>
              <Link to="/login" className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-center font-bold text-xs text-white shadow-md shadow-teal-600/30">
                Launch Pro Sourcing
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Enterprise Tier</h3>
                  <PlanBadge plan="ENTERPRISE" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For Tier-1 electronic OEMs, foundries, and multi-user procurement divisions.
                </p>
                <p className="text-3xl font-bold font-mono text-white">₹1,499 <span className="text-xs text-slate-400 font-sans font-normal">/ month</span></p>
                <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> 5,000 Monthly Searches</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> 2,000 Pipeline Saved Companies</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> 500 Full Excel & CSV Exports</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Multi-User Team Governance</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Automated CSV Ingestion API & Audit Logs</p>
                </div>
              </div>
              <Link to="/login" className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-center font-semibold text-xs text-slate-200">
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE ACTION BAR */}
      <section className="bg-slate-950 py-16 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Ready to Evaluate Verified Semiconductor Partners?
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Sign in with our demonstration accounts to inspect real-time wafer geometries, cleanroom classes, and explainable compatibility scores.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/app/discovery"
              className="px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-600/30"
            >
              Launch Platform Console
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm"
            >
              Access Demo Credentials
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
