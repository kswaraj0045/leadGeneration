import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Search,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Globe,
  Award,
  ChevronRight,
  Boxes,
  Database,
  BarChart3,
  Activity,
  FileSpreadsheet,
  Check,
  Zap,
  Building2,
  Lock,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VerificationBadge, PlanBadge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'foundry' | 'osat' | 'pcb' | 'ems' | 'components'>('foundry');
  const [demoLoggingIn, setDemoLoggingIn] = useState(false);

  const handleQuickDemoLogin = async (email: string) => {
    setDemoLoggingIn(true);
    try {
      await login(email, 'admin123');
      navigate('/app/overview');
    } catch (err: any) {
      alert(err.message || 'Demo login failed');
    } finally {
      setDemoLoggingIn(false);
    }
  };

  const taxonomyPreview = {
    foundry: [
      { name: 'TSMC (Taiwan Semiconductor)', node: '3nm, 5nm, 7nm, 28nm HKMG', cleanroom: 'ISO Class 1 / Class 10', location: 'Hsinchu, Taiwan', certs: 'IATF 16949, ISO 9001' },
      { name: 'Semi-Conductor Laboratory (SCL)', node: '180nm CMOS / MEMS', cleanroom: 'Class 10 Cleanroom', location: 'Mohali, India', certs: 'ISRO Flight, ISO 9001' },
      { name: 'GlobalFoundries Inc.', node: '12LP+ FinFET / 22FDX', cleanroom: 'Class 1 Standards', location: 'Malta, NY, USA', certs: 'IATF 16949, ISO 27001' },
    ],
    osat: [
      { name: 'Kaynes Semicon Private Limited', node: 'QFN, BGA, Flip-Chip, SiP', cleanroom: 'Class 100 / ISO 5', location: 'Sanand, Gujarat, India', certs: 'IATF 16949 Compliant' },
      { name: 'ASE Group (Advanced Semiconductor)', node: '2.5D/3D Heterogeneous Packaging', cleanroom: 'ISO Class 4 & 5', location: 'Kaohsiung, Taiwan', certs: 'IATF 16949, AEC-Q100' },
      { name: 'Amkor Technology Inc.', node: 'SWIFT Fan-Out, FCBGA', cleanroom: 'Cleanroom Class 100', location: 'Tempe, AZ, USA', certs: 'IATF 16949, ISO 14001' },
    ],
    pcb: [
      { name: 'AT&S (Austria Technologie & Systemtechnik)', node: '32-Layer Any-Layer HDI, Microvias', cleanroom: 'Laser Microvia +/- 5%', location: 'Leoben, Austria / Nanjangud', certs: 'IATF 16949, AS9100D' },
      { name: 'Shogini Technoarts Pvt Ltd', node: '1 to 24 Layer Rigid & MCPCB', cleanroom: 'Controlled Impedance', location: 'Pune, Maharashtra, India', certs: 'IATF 16949, ISO 9001' },
      { name: 'Unimicron Technology Corp.', node: 'Substrate-like PCB (SLP) & Rogers RF', cleanroom: 'Cleanroom Class 1,000', location: 'Taoyuan, Taiwan', certs: 'ISO 9001, AS9100D' },
    ],
    ems: [
      { name: 'Kaynes Technology India Ltd', node: '45+ SMT Lines (01005 Placement)', cleanroom: 'Class 8 Cleanroom / 3D AOI', location: 'Mysuru, Karnataka, India', certs: 'IATF 16949, AS9100D, ISO 13485' },
      { name: 'Dixon Technologies (India) Ltd', node: 'High-Speed Automated SMT Cells', cleanroom: 'Over 80M Placements/Day', location: 'Noida, Uttar Pradesh, India', certs: 'ISO 9001, ISO 14001' },
      { name: 'Syrma SGS Technology Ltd', node: 'Precision SMT & Magnetics Winding', cleanroom: 'High-Density PCBA + RFID', location: 'Chennai, Tamil Nadu, India', certs: 'IATF 16949, AS9100D' },
    ],
    components: [
      { name: 'Murata Manufacturing Co., Ltd.', node: 'Nanoscale MLCC Ceramic Sintering', cleanroom: '008004 Miniature Dielectrics', location: 'Kyoto, Japan', certs: 'IATF 16949, AEC-Q200' },
      { name: 'Vishay Intertechnology, Inc.', node: 'TrenchFET Gen IV Power MOSFETs', cleanroom: 'Bulk Metal Foil / Precision', location: 'Malvern, PA, USA / Pune', certs: 'IATF 16949, ISO 9001' },
      { name: 'Continental Device India Ltd (CDIL)', node: 'Silicon Transistors & TVS Diodes', cleanroom: 'High-Voltage Testing (1500V)', location: 'New Delhi / Mohali, India', certs: 'IATF 16949, ISRO Flight' },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-saas-bg text-saas-primary font-sans">
      {/* ENTERPRISE TOP NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-saas-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-saas-accent text-white flex items-center justify-center shrink-0 shadow-xs">
                <Cpu size={18} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-saas-primary">
                    VIASET
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase font-semibold">
                    B2B SaaS
                  </span>
                </div>
                <span className="text-[10px] text-saas-secondary font-mono tracking-wider -mt-0.5">
                  Supply-Chain Intelligence
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-saas-secondary">
              <a href="#capabilities" className="hover:text-saas-primary transition-colors">
                Platform Capabilities
              </a>
              <a href="#taxonomy" className="hover:text-saas-primary transition-colors">
                Industry Taxonomy
              </a>
              <a href="#matcher" className="hover:text-saas-primary transition-colors">
                Matching Matrix
              </a>
              <a href="#pricing" className="hover:text-saas-primary transition-colors">
                Subscription Plans
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/app/overview"
                className="px-4 py-2 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
              >
                Go to Workspace
                <ArrowRight size={13} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-saas-secondary hover:text-saas-primary hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  Launch Console
                  <ArrowRight size={13} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Pill Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-saas-border shadow-xs text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-saas-primary">Enterprise Supply-Chain Intelligence</span>
            <span className="text-slate-300">|</span>
            <span className="text-saas-secondary font-mono">28 Audited Semiconductor Nodes</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-saas-primary leading-[1.18]">
            Semiconductor & Electronics <br className="hidden sm:inline" />
            <span className="text-saas-accent">Supply-Chain Intelligence Platform</span>
          </h1>

          <p className="text-sm sm:text-base text-saas-secondary max-w-2xl mx-auto leading-relaxed">
            Discover verified wafer foundries, packaging houses, HDI PCB fabricators, turnkey EMS assemblers, and electronic component suppliers with multi-factor technical capability matching.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={isAuthenticated ? '/app/overview' : '/app/discovery'}
              className="px-5 py-2.5 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Launch Sourcing Workspace</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/app/discovery"
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-saas-primary border border-saas-border text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Search size={14} className="text-saas-secondary" />
              <span>Browse 28+ Indexed Facilities</span>
            </Link>
          </div>

          {/* DEMO ACCOUNTS QUICK-SWITCH BAR */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="bg-white border border-saas-border rounded-xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <span className="text-[11px] font-mono text-saas-secondary uppercase font-semibold flex items-center gap-1.5">
                <Lock size={12} className="text-saas-accent" />
                Instant Demo Access:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={demoLoggingIn}
                  onClick={() => handleQuickDemoLogin('admin@viaset.io')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-saas-primary font-mono text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  Admin Portal
                </button>
                <button
                  type="button"
                  disabled={demoLoggingIn}
                  onClick={() => handleQuickDemoLogin('lead@kaynes-semi.com')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-saas-primary font-mono text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  Kaynes OSAT
                </button>
                <button
                  type="button"
                  disabled={demoLoggingIn}
                  onClick={() => handleQuickDemoLogin('engineer@mindgrove.in')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-saas-primary font-mono text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  Mindgrove Fabless
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* HIGH-FIDELITY SAAS APPLICATION WORKSPACE PREVIEW (LINEAR / STRIPE STYLE MOCKUP) */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-saas-border shadow-lg overflow-hidden">
            {/* Mockup Window Chrome */}
            <div className="h-10 bg-slate-100/90 border-b border-saas-border px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="ml-3 text-[11px] font-mono text-saas-secondary font-medium">
                  VIASET Intelligence Workspace — Parametric Registry Matrix (28 Audited Entities)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Sync Active
                </span>
              </div>
            </div>

            {/* Mockup App Interface */}
            <div className="flex flex-col md:flex-row min-h-[380px]">
              {/* Sidebar Mockup */}
              <div className="w-full md:w-56 bg-slate-50 border-r border-saas-border p-4 space-y-4 shrink-0 hidden sm:block">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                    WORKSPACE
                  </span>
                  <div className="mt-2 space-y-1">
                    <div className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-saas-secondary">
                      Overview
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-between">
                      <span>Company Discovery</span>
                      <span className="text-[10px] font-mono bg-teal-200/50 px-1 rounded">28</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-saas-secondary">
                      Matching Engine
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-saas-secondary">
                      Sourcing Pipeline
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-saas-secondary">
                      Opportunities
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                    INTELLIGENCE
                  </span>
                  <div className="mt-2 space-y-1 text-xs text-saas-secondary font-semibold">
                    <div className="px-2.5 py-1.5 rounded-lg">Industry Explorer</div>
                    <div className="px-2.5 py-1.5 rounded-lg">Geographic Insights</div>
                    <div className="px-2.5 py-1.5 rounded-lg">Platform Analytics</div>
                  </div>
                </div>
              </div>

              {/* Main Table Preview */}
              <div className="flex-1 p-5 space-y-4 overflow-x-auto">
                {/* Search & Filter Bar Preview */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-saas-border">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="px-3 py-1.5 rounded-lg bg-saas-bg border border-saas-border text-xs text-saas-secondary flex items-center gap-2 w-full sm:w-72">
                      <Search size={13} className="text-slate-400" />
                      <span>28nm HKMG, SMT 01005, Class 100...</span>
                    </div>
                    <span className="text-[11px] font-mono text-saas-secondary bg-slate-100 px-2 py-1 rounded">
                      Filtered: 5/28
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      CSV
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      Excel
                    </span>
                    <Link
                      to="/app/discovery"
                      className="px-3 py-1 rounded-lg bg-saas-primary text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                      Open Full View
                    </Link>
                  </div>
                </div>

                {/* Dense Matrix Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-saas-bg text-saas-secondary font-semibold border-b border-saas-border">
                      <tr>
                        <th className="py-2 px-3">Company Name</th>
                        <th className="py-2 px-3">Vertical</th>
                        <th className="py-2 px-3">Headquarters</th>
                        <th className="py-2 px-3">Core Capability</th>
                        <th className="py-2 px-3">Audit Standards</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-saas-border">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-saas-primary">TSMC (Taiwan Semiconductor)</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-teal-800">Semiconductor Foundry</td>
                        <td className="py-2.5 px-3 text-saas-secondary">Hsinchu, Taiwan</td>
                        <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-mono text-[10px] border border-teal-200">3nm / 5nm / 28nm HKMG</span></td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600">IATF 16949, ISO 9001</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">VERIFIED</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-saas-primary">Kaynes Semicon Private Limited</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-indigo-800">OSAT Packaging & Test</td>
                        <td className="py-2.5 px-3 text-saas-secondary">Sanand, Gujarat, India</td>
                        <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-mono text-[10px] border border-teal-200">QFN, BGA, Flip-Chip, SiP</span></td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600">Cleanroom Class 100</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">VERIFIED</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-saas-primary">Mindgrove Technologies</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-blue-800">Fabless IC Design</td>
                        <td className="py-2.5 px-3 text-saas-secondary">Bengaluru, Karnataka, India</td>
                        <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-mono text-[10px] border border-teal-200">RISC-V 32/64-bit IoT SoC</span></td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600">ISO 9001, ASIL-B Safety</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">VERIFIED</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-saas-primary">AT&S (Austria Technologie & Systemtechnik)</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-amber-800">HDI PCB Fabrication</td>
                        <td className="py-2.5 px-3 text-saas-secondary">Leoben, Austria</td>
                        <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-mono text-[10px] border border-teal-200">32-Layer Any-Layer HDI</span></td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600">AS9100D, IATF 16949</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">VERIFIED</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-saas-primary">Kaynes Technology India Ltd</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-800">Electronics Manufacturing (EMS)</td>
                        <td className="py-2.5 px-3 text-saas-secondary">Mysuru, Karnataka, India</td>
                        <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-mono text-[10px] border border-teal-200">45+ SMT Lines (01005 Passives)</span></td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600">IATF 16949, ISO 13485</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">VERIFIED</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-6xl mx-auto">
          <div className="bg-white p-5 rounded-xl border border-saas-border text-center shadow-xs">
            <div className="text-3xl font-extrabold text-saas-primary font-mono">28+</div>
            <div className="text-xs font-bold text-saas-secondary uppercase tracking-wider mt-1">Verified Entities</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Foundries, OSAT, PCB, EMS</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-saas-border text-center shadow-xs">
            <div className="text-3xl font-extrabold text-saas-primary font-mono">6</div>
            <div className="text-xs font-bold text-saas-secondary uppercase tracking-wider mt-1">Supply Verticals</div>
            <p className="text-[11px] text-slate-400 mt-0.5">End-to-end silicon lifecycle</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-saas-border text-center shadow-xs">
            <div className="text-3xl font-extrabold text-saas-primary font-mono">100%</div>
            <div className="text-xs font-bold text-saas-secondary uppercase tracking-wider mt-1">Explainable Matching</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Deterministic heuristic vectors</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-saas-border text-center shadow-xs">
            <div className="text-3xl font-extrabold text-saas-primary font-mono">150+</div>
            <div className="text-xs font-bold text-saas-secondary uppercase tracking-wider mt-1">Indexed Parameters</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Nodes, cleanrooms, standards</p>
          </div>
        </div>
      </section>

      {/* CORE PLATFORM CAPABILITIES */}
      <section id="capabilities" className="py-16 bg-white border-y border-saas-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-saas-accent bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
              Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-saas-primary">
              Built for Engineering Procurement & Sourcing
            </h2>
            <p className="text-xs sm:text-sm text-saas-secondary">
              Solve the fragmentation of semiconductor vendor discovery with normalized parametric intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-saas-border bg-saas-bg/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-saas-accent border border-teal-200 flex items-center justify-center">
                <Search size={20} />
              </div>
              <h3 className="text-sm font-bold text-saas-primary">Parametric Registry</h3>
              <p className="text-xs text-saas-secondary leading-relaxed">
                Filter facilities by process node (3nm to 180nm), cleanroom standards (Class 1 to Class 1000), substrate chemistry (GaN, SiC, FR-4, Rogers), and automotive certifications.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-saas-border bg-saas-bg/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h3 className="text-sm font-bold text-saas-primary">Explainable Matcher</h3>
              <p className="text-xs text-saas-secondary leading-relaxed">
                Input your technical bill of materials and sourcing constraints. The matching engine computes a weighted fit score with transparent vector breakdowns.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-saas-border bg-saas-bg/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-sm font-bold text-saas-primary">Supplier Pipeline (VMS)</h3>
              <p className="text-xs text-saas-secondary leading-relaxed">
                Organize candidate suppliers into qualification stages: Identified, Contacted, Evaluating, Approved, or Disqualified, with internal negotiation notes.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-saas-border bg-saas-bg/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-sm font-bold text-saas-primary">Data Portability</h3>
              <p className="text-xs text-saas-secondary leading-relaxed">
                Export normalized intelligence dossiers into CSV and multi-tab Excel workbooks ready for corporate ERP and procurement workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRY TAXONOMY PREVIEW */}
      <section id="taxonomy" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase font-bold text-saas-accent bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
              Ecosystem Scope
            </span>
            <h2 className="text-2xl font-bold text-saas-primary mt-2">
              Structured Industry Taxonomy
            </h2>
            <p className="text-xs text-saas-secondary mt-1">
              Select a vertical domain to review benchmark manufacturing nodes and indexed parameters.
            </p>
          </div>

          <Link
            to="/app/industries"
            className="text-xs font-semibold text-saas-accent hover:underline flex items-center gap-1"
          >
            Explore Full Taxonomy <ChevronRight size={14} />
          </Link>
        </div>

        {/* Vertical Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-saas-border">
          {[
            { id: 'foundry', label: 'Wafer Foundries' },
            { id: 'osat', label: 'OSAT Packaging & Test' },
            { id: 'pcb', label: 'HDI PCB Fabrication' },
            { id: 'ems', label: 'EMS Turnkey Assembly' },
            { id: 'components', label: 'Passive & Active Components' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-saas-primary text-white shadow-xs'
                  : 'bg-white text-saas-secondary hover:text-saas-primary hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Vertical Table */}
        <div className="bg-white rounded-xl border border-saas-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-saas-bg text-saas-secondary font-semibold border-b border-saas-border">
                <tr>
                  <th className="py-3 px-4">Benchmark Facility</th>
                  <th className="py-3 px-4">Node / Placement Capability</th>
                  <th className="py-3 px-4">Cleanroom / Process Spec</th>
                  <th className="py-3 px-4">Hub Location</th>
                  <th className="py-3 px-4">Key Certifications</th>
                  <th className="py-3 px-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-saas-border">
                {taxonomyPreview[activeTab].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-saas-primary">{row.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-teal-800">{row.node}</td>
                    <td className="py-3 px-4 text-saas-secondary">{row.cleanroom}</td>
                    <td className="py-3 px-4 text-saas-secondary">{row.location}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-600">{row.certs}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        AUDITED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-16 bg-white border-t border-saas-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-saas-accent bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
              Enterprise Plans
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-saas-primary">
              Predictable Commercial SaaS Pricing
            </h2>
            <p className="text-xs sm:text-sm text-saas-secondary">
              Tiered access for academic evaluation, semiconductor startups, and corporate procurement divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-saas-bg/50 rounded-2xl border border-saas-border p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-saas-primary">Community Starter</h3>
                <p className="text-xs text-saas-secondary mt-1">For students, researchers, and early market analysis.</p>
                <div className="my-6 pb-6 border-b border-saas-border">
                  <span className="text-3xl font-extrabold text-saas-primary">Free</span>
                  <span className="text-xs text-saas-secondary font-mono"> / forever</span>
                </div>
                <div className="space-y-2.5 text-xs text-saas-primary">
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> 50 Monthly Searches</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> 25 Saved Pipeline Suppliers</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> 5 CSV Data Exports</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> Standard Industry Filters</div>
                </div>
              </div>
              <Link
                to="/register"
                className="mt-8 w-full py-2.5 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-xs font-semibold text-saas-primary text-center block"
              >
                Start Free Account
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-saas-accent p-6 flex flex-col justify-between shadow-md relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-saas-accent text-white text-[10px] font-bold uppercase tracking-wider">
                Recommended for Engineering
              </span>
              <div>
                <h3 className="text-base font-bold text-saas-primary">Professional Tier</h3>
                <p className="text-xs text-saas-secondary mt-1">For fabless design houses, startups, and sourcing engineers.</p>
                <div className="my-6 pb-6 border-b border-saas-border">
                  <span className="text-3xl font-extrabold text-saas-primary">₹499</span>
                  <span className="text-xs text-saas-secondary font-mono"> / billed monthly</span>
                </div>
                <div className="space-y-2.5 text-xs text-saas-primary">
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> 500 Monthly Searches</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> 200 Saved Pipeline Suppliers</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> 50 Full Excel & CSV Exports</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> Custom Heuristic Weight Sliders</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> Process Node & Cleanroom Facets</div>
                </div>
              </div>
              <Link
                to="/register"
                className="mt-8 w-full py-2.5 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold text-center block shadow-xs"
              >
                Launch Professional Console
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-saas-bg/50 rounded-2xl border border-saas-border p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-saas-primary">Enterprise Intelligence</h3>
                <p className="text-xs text-saas-secondary mt-1">For tier-1 OEMs, foundries, and multi-user procurement teams.</p>
                <div className="my-6 pb-6 border-b border-saas-border">
                  <span className="text-3xl font-extrabold text-saas-primary">₹1,499</span>
                  <span className="text-xs text-saas-secondary font-mono"> / billed monthly</span>
                </div>
                <div className="space-y-2.5 text-xs text-saas-primary">
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> 5,000 Monthly Searches</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> 2,000 Saved Pipeline Suppliers</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> 500 Full Excel & CSV Exports</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> Multi-User Team Management</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-saas-accent" /> Custom Data Ingestion API</div>
                </div>
              </div>
              <Link
                to="/register"
                className="mt-8 w-full py-2.5 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-xs font-semibold text-saas-primary text-center block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-saas-border py-12 text-xs text-saas-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-saas-accent text-white flex items-center justify-center font-bold">
                <Cpu size={16} />
              </div>
              <span className="font-extrabold text-sm text-saas-primary">VIASET</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Specialized B2B supply-chain intelligence platform for the semiconductor, microelectronics, and advanced packaging ecosystem.
            </p>
            <div className="text-[10px] font-mono text-emerald-700">
              ● 28 Audited Entities Indexed
            </div>
          </div>

          <div>
            <h4 className="font-bold text-saas-primary uppercase tracking-wider text-[11px] mb-3">
              Verticals
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/app/discovery?category=semiconductor-foundry" className="hover:text-saas-primary">Wafer Foundries</Link></li>
              <li><Link to="/app/discovery?category=ic-design-fabless" className="hover:text-saas-primary">Fabless IC Design</Link></li>
              <li><Link to="/app/discovery?category=osat-packaging" className="hover:text-saas-primary">OSAT Packaging & Test</Link></li>
              <li><Link to="/app/discovery?category=pcb-fabrication" className="hover:text-saas-primary">HDI PCB Fabrication</Link></li>
              <li><Link to="/app/discovery?category=pcb-assembly-ems" className="hover:text-saas-primary">EMS Turnkey Assembly</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-saas-primary uppercase tracking-wider text-[11px] mb-3">
              Workspace
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/app/discovery" className="hover:text-saas-primary">Company Discovery</Link></li>
              <li><Link to="/app/matching" className="hover:text-saas-primary">Explainable Matching</Link></li>
              <li><Link to="/app/workspace" className="hover:text-saas-primary">Supplier Pipeline</Link></li>
              <li><Link to="/app/opportunities" className="hover:text-saas-primary">Sourcing Opportunities</Link></li>
              <li><Link to="/app/analytics" className="hover:text-saas-primary">Supply-Chain Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-saas-primary uppercase tracking-wider text-[11px] mb-3">
              Academic & Standards
            </h4>
            <p className="text-[11px] leading-relaxed">
              Major Academic Project — Final-Year B.Tech Computer Engineering. Built following industry-grade SaaS architecture, relational database normalization, and explainable scoring heuristics.
            </p>
            <div className="mt-2 text-[10px] font-mono text-slate-400">
              React 18 / TypeScript / Tailwind / Node / Prisma / SQLite
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-saas-border flex flex-col sm:flex-row items-center justify-between text-[11px]">
          <div>© {new Date().getFullYear()} VIASET Intelligence Platform. All rights reserved.</div>
          <div className="font-mono text-slate-400 mt-2 sm:mt-0">
            Engineered for Semiconductor & Electronics Supply-Chain Discovery
          </div>
        </div>
      </footer>
    </div>
  );
};
