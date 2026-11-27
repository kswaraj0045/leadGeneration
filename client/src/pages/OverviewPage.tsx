import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Search,
  Sparkles,
  Bookmark,
  Zap,
  Globe2,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  ChevronRight,
  Activity,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Company } from '../types';
import { VerificationBadge } from '../components/common/Badge';
import { CompanyDetailModal } from '../components/company/CompanyDetailModal';

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<any>(null);
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [overviewRes, companiesRes] = await Promise.all([
          api.get('/analytics/overview').catch(() => null),
          api.get('/companies', { params: { limit: 6 } }).catch(() => null),
        ]);

        if (overviewRes?.data?.success) {
          setAnalytics(overviewRes.data.data);
        }
        if (companiesRes?.data?.success) {
          setRecentCompanies(companiesRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load overview data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const kpis = analytics?.kpis || {
    totalCompanies: 28,
    verifiedCompanies: 24,
    claimedCompanies: 4,
    verificationRate: 86,
  };

  const industries = [
    { name: 'Semiconductor Foundries', count: 4, share: '14%', icon: Cpu, color: 'text-teal-600', bg: 'bg-teal-50' },
    { name: 'Fabless IC Design Houses', count: 5, share: '18%', icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'OSAT Packaging & Test', count: 4, share: '14%', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'High-Density Interconnect PCBs', count: 5, share: '18%', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Electronics Manufacturing (EMS)', count: 5, share: '18%', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Passive & Active Components', count: 5, share: '18%', icon: Globe2, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const corridors = [
    { name: 'India (Bengaluru, Sanand, Noida, TN)', count: 12, flag: 'IN', status: 'Expanding High-Growth' },
    { name: 'Taiwan (Hsinchu Science Park, Tainan)', count: 5, flag: 'TW', status: 'Advanced Node Hub' },
    { name: 'United States (Silicon Valley, Austin)', count: 4, flag: 'US', status: 'Architecture & Design' },
    { name: 'Japan & South Korea', count: 4, flag: 'JP', status: 'Substrates & Packaging' },
    { name: 'Europe (Dresden, Cambridge)', count: 3, flag: 'EU', status: 'Automotive & Mixed-Signal' },
  ];

  const intelligenceBulletins = [
    {
      id: '1',
      date: 'Today, 09:30',
      tag: 'CAPACITY ALERT',
      title: 'TSMC N3 / N4 Wafer Allocation for Automotive Q3',
      summary: 'Automotive microcontrollers shift from legacy 28nm planar to 16nm FinFET, improving lead times by 14%.',
    },
    {
      id: '2',
      date: 'Yesterday',
      tag: 'INFRASTRUCTURE',
      title: 'Kaynes Semicon Sanand OSAT Commences BGA Line Testing',
      summary: 'Commercial pilot runs for multi-chip ball grid array packages underway with certified cleanroom Class 100.',
    },
    {
      id: '3',
      date: 'Nov 24',
      tag: 'STANDARDS',
      title: 'IPC-A-610 Class 3 Mandate for Aerospace Avionics EMS',
      summary: 'New qualification checks deployed to search filters for defense and mission-critical PCB assemblies.',
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* TOP WELCOME & TELEMETRY BANNER */}
        <div className="bg-white rounded-xl border border-saas-border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry Active
              </span>
              <span className="text-xs text-saas-secondary font-mono">DB v2026.11</span>
            </div>
            <h1 className="text-2xl font-bold text-saas-primary tracking-tight">
              Executive Supply-Chain Workspace
            </h1>
            <p className="text-sm text-saas-secondary mt-1">
              Welcome back, <strong className="text-saas-primary font-semibold">{user?.fullName || 'Intelligence Analyst'}</strong>. 
              Review real-time semiconductor ecosystem telemetry, verified vendor nodes, and sourcing pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/app/matching')}
              className="px-3.5 py-2 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles size={14} />
              Run Sourcing Matcher
            </button>
            <button
              onClick={() => navigate('/app/discovery')}
              className="px-3.5 py-2 rounded-lg bg-saas-bg hover:bg-slate-200/80 text-saas-primary border border-saas-border text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Search size={14} />
              Browse Companies
            </button>
          </div>
        </div>

        {/* METRICS / KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-saas-border shadow-xs">
            <div className="flex items-center justify-between text-saas-secondary mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Indexed Profiles</span>
              <Cpu size={16} className="text-saas-accent" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-saas-primary font-mono">{kpis.totalCompanies}</span>
              <span className="text-xs text-emerald-600 font-medium">+100% verified</span>
            </div>
            <p className="text-[11px] text-saas-secondary mt-1">Authentic industry entities</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-saas-border shadow-xs">
            <div className="flex items-center justify-between text-saas-secondary mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Supply Verticals</span>
              <Layers size={16} className="text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-saas-primary font-mono">6</span>
              <span className="text-xs text-indigo-600 font-medium">Foundry to EMS</span>
            </div>
            <p className="text-[11px] text-saas-secondary mt-1">Full end-to-end stack</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-saas-border shadow-xs">
            <div className="flex items-center justify-between text-saas-secondary mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Matching Heuristics</span>
              <Sparkles size={16} className="text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-saas-primary font-mono">100%</span>
              <span className="text-xs text-amber-600 font-medium">Transparent</span>
            </div>
            <p className="text-[11px] text-saas-secondary mt-1">Multi-factor explainability</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-saas-border shadow-xs">
            <div className="flex items-center justify-between text-saas-secondary mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Global Corridors</span>
              <Globe2 size={16} className="text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-saas-primary font-mono">5</span>
              <span className="text-xs text-emerald-600 font-medium">Cross-border</span>
            </div>
            <p className="text-[11px] text-saas-secondary mt-1">India, Taiwan, USA, JP, EU</p>
          </div>
        </div>

        {/* 2-COLUMN MAIN INTELLIGENCE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: VERTICAL TAXONOMY & RECENT COMPANIES TABLE */}
          <div className="lg:col-span-2 space-y-6">
            {/* ECOSYSTEM VERTICAL BREAKDOWN */}
            <div className="bg-white rounded-xl border border-saas-border p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-saas-primary uppercase tracking-wide">
                    Ecosystem Taxonomy Breakdown
                  </h2>
                  <p className="text-xs text-saas-secondary">
                    Distribution of indexed facilities across technical domains
                  </p>
                </div>
                <Link
                  to="/app/industries"
                  className="text-xs font-semibold text-saas-accent hover:underline flex items-center gap-1"
                >
                  Explore Taxonomy <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industries.map((ind) => {
                  const Icon = ind.icon;
                  return (
                    <Link
                      key={ind.name}
                      to={`/app/discovery?category=${encodeURIComponent(ind.name)}`}
                      className="p-3 rounded-lg border border-saas-border hover:border-saas-accent/40 hover:bg-slate-50/70 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-md ${ind.bg} ${ind.color} flex items-center justify-center`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-saas-primary group-hover:text-saas-accent transition-colors">
                            {ind.name}
                          </div>
                          <div className="text-[11px] text-saas-secondary font-mono">
                            {ind.count} verified entities ({ind.share})
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-saas-secondary group-hover:text-saas-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* RECENTLY INDEXED VERIFIED COMPANIES TABLE */}
            <div className="bg-white rounded-xl border border-saas-border shadow-xs overflow-hidden">
              <div className="p-4 border-b border-saas-border flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-saas-primary uppercase tracking-wide">
                    Recently Indexed Verified Entities
                  </h2>
                  <p className="text-xs text-saas-secondary">
                    Audited semiconductor manufacturers, designers, and assemblers
                  </p>
                </div>
                <Link
                  to="/app/discovery"
                  className="text-xs font-semibold text-saas-accent hover:underline flex items-center gap-1"
                >
                  View All {kpis.totalCompanies} Entities <ArrowRight size={13} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-saas-bg text-saas-secondary font-semibold border-b border-saas-border">
                    <tr>
                      <th className="py-2.5 px-4">Company Name</th>
                      <th className="py-2.5 px-4">Vertical</th>
                      <th className="py-2.5 px-4">Headquarters</th>
                      <th className="py-2.5 px-4">Core Capability</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-saas-border">
                    {recentCompanies.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-saas-primary">
                          <button
                            onClick={() => setSelectedCompany(c)}
                            className="hover:text-saas-accent text-left transition-colors font-semibold cursor-pointer"
                          >
                            {c.name}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-saas-secondary">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-mono">
                            {c.category?.name || c.companyType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-saas-secondary">
                          {c.hqCity}, {c.hqCountry}
                        </td>
                        <td className="py-3 px-4">
                          {c.capabilities?.[0] ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-mono border border-teal-200/60 max-w-[160px] truncate">
                              <Cpu size={10} className="text-teal-600 shrink-0" />
                              <span className="truncate">{c.capabilities[0].name}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <VerificationBadge status={c.verificationStatus} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedCompany(c)}
                            className="text-xs text-saas-accent hover:underline font-medium cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CORRIDORS & INTELLIGENCE BULLETINS */}
          <div className="space-y-6">
            {/* GEOGRAPHIC CORRIDORS */}
            <div className="bg-white rounded-xl border border-saas-border p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-saas-primary uppercase tracking-wide">
                  Geographic Corridors
                </h2>
                <Link to="/app/geographic" className="text-xs text-saas-accent font-semibold hover:underline">
                  Full Map
                </Link>
              </div>
              <p className="text-xs text-saas-secondary mb-4">
                Active geographic clusters indexed in VIASET
              </p>

              <div className="space-y-3">
                {corridors.map((c) => (
                  <div key={c.name} className="p-3 rounded-lg border border-saas-border bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-saas-primary">{c.name}</span>
                      <span className="text-xs font-mono font-bold text-saas-accent">{c.count} nodes</span>
                    </div>
                    <div className="text-[11px] text-saas-secondary mt-1 flex items-center justify-between">
                      <span>{c.status}</span>
                      <Link
                        to={`/app/discovery?country=${encodeURIComponent(c.flag)}`}
                        className="text-saas-accent hover:underline text-[10px] font-semibold"
                      >
                        Filter
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUPPLY-CHAIN INTELLIGENCE BULLETINS */}
            <div className="bg-white rounded-xl border border-saas-border p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-saas-primary uppercase tracking-wide">
                  Industry Bulletins
                </h2>
                <span className="text-[10px] font-mono text-saas-secondary bg-slate-100 px-1.5 py-0.5 rounded">
                  Curated
                </span>
              </div>
              <p className="text-xs text-saas-secondary mb-4">
                Technical lead time, capacity and regulatory insights
              </p>

              <div className="space-y-3">
                {intelligenceBulletins.map((b) => (
                  <div key={b.id} className="p-3 rounded-lg border border-saas-border bg-white hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                        {b.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{b.date}</span>
                    </div>
                    <h3 className="text-xs font-bold text-saas-primary mb-1">
                      {b.title}
                    </h3>
                    <p className="text-[11px] text-saas-secondary leading-relaxed">
                      {b.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* EXPORT WORKBENCH SHORTCUT */}
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-teal-400">
                <FileSpreadsheet size={18} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">Data Portability</span>
              </div>
              <h3 className="text-sm font-bold mb-1">Export Complete Sourcing Dossier</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Export all 28+ verified semiconductor entities into structured CSV or multi-tab Excel format for procurement workflows.
              </p>
              <div className="flex gap-2">
                <a
                  href="/api/v1/export/csv"
                  download="viaset-semiconductor-companies.csv"
                  className="flex-1 text-center py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-xs transition-colors"
                >
                  Export CSV
                </a>
                <a
                  href="/api/v1/export/excel"
                  download="viaset-semiconductor-companies.xlsx"
                  className="flex-1 text-center py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs shadow-xs transition-colors"
                >
                  Export Excel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </AppLayout>
  );
};
