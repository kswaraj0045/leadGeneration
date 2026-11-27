import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Search,
  Filter,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Sparkles,
  MapPin,
  Cpu,
  BadgeCheck,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';

interface Opportunity {
  id: string;
  rfqNumber: string;
  title: string;
  postedBy: string;
  buyerType: string;
  vertical: string;
  targetGeometry: string;
  volumeRequirement: string;
  certificationsRequired: string[];
  status: 'OPEN' | 'REVIEWING' | 'SOURCED';
  postedDate: string;
  deadline: string;
  summary: string;
}

export const OpportunitiesPage: React.FC = () => {
  const [selectedVertical, setSelectedVertical] = useState<string>('all');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [proposalSent, setProposalSent] = useState(false);

  const opportunities: Opportunity[] = [
    {
      id: 'OPP-2026-001',
      rfqNumber: 'RFQ-SEMI-28NM-09',
      title: '28nm HKMG Wafer Fab Capacity for Custom Edge AI Microcontroller',
      postedBy: 'Mindgrove Technologies',
      buyerType: 'Fabless IC Design',
      vertical: 'Semiconductor Foundries',
      targetGeometry: '28nm High-k Metal Gate (HKMG)',
      volumeRequirement: 'Pilot run 5,000 wafers/quarter scaling to 20,000',
      certificationsRequired: ['ISO 9001', 'AEC-Q100 Qualification Support'],
      status: 'OPEN',
      postedDate: 'Nov 22, 2026',
      deadline: 'Dec 15, 2026',
      summary: 'Seeking foundry partner with validated 28nm HKMG process for 32-bit RISC-V edge AI SoC with embedded SRAM and hardware crypto accelerator.',
    },
    {
      id: 'OPP-2026-002',
      rfqNumber: 'RFQ-EMS-IATF-44',
      title: 'Turnkey SMT Assembly for Automotive 800V EV Battery Management Board',
      postedBy: 'ElectroDrive Propulsion Systems',
      buyerType: 'Automotive Tier-1 OEM',
      vertical: 'Electronics Manufacturing Services (EMS)',
      targetGeometry: '01005 passives, 0.4mm pitch BGA, Selective Soldering',
      volumeRequirement: '50,000 units/annum',
      certificationsRequired: ['IATF 16949', 'IPC-A-610 Class 3', 'ISO 14001'],
      status: 'OPEN',
      postedDate: 'Nov 25, 2026',
      deadline: 'Dec 20, 2026',
      summary: 'Requirement for certified EMS facility capable of 3D SPI, 3D AOI, potting and robotic conformal coating for dual-redundant BMS master controllers.',
    },
    {
      id: 'OPP-2026-003',
      rfqNumber: 'RFQ-PCB-HDI-18',
      title: '14-Layer Any-Layer HDI PCB Fabrication with Rogers 4350B Dielectric',
      postedBy: 'AeroWave Telecommunications',
      buyerType: 'Telecommunications OEM',
      vertical: 'High-Density Interconnect PCBs',
      targetGeometry: '3 mil / 3 mil trace/space, Stacked Microvias, ENIG finish',
      volumeRequirement: '12,000 panels / year',
      certificationsRequired: ['IPC-6012 Class 3', 'UL 94V-0', 'AS9100D'],
      status: 'REVIEWING',
      postedDate: 'Nov 18, 2026',
      deadline: 'Dec 05, 2026',
      summary: 'High-frequency 5G mmWave antenna board with hybrid FR-4 / Rogers construction requiring controlled impedance +/- 5% and microvia reliability testing.',
    },
    {
      id: 'OPP-2026-004',
      rfqNumber: 'RFQ-OSAT-BGA-12',
      title: 'OSAT Packaging & ATE Testing for Multi-Chip QFN-64 Module',
      postedBy: 'Ineda Silicon Systems',
      buyerType: 'Fabless IC Design',
      vertical: 'OSAT Packaging & Test',
      targetGeometry: 'QFN-64 (9x9mm, 0.5mm pitch) with copper wire bonding',
      volumeRequirement: '100,000 packaged chips/month',
      certificationsRequired: ['ISO 9001', 'ANSI/ESD S20.20', 'Cleanroom Class 1000'],
      status: 'OPEN',
      postedDate: 'Nov 20, 2026',
      deadline: 'Dec 18, 2026',
      summary: 'Outsourced packaging and final electrical probe testing for integrated sensor interface ASIC with high temperature burn-in testing capability.',
    },
    {
      id: 'OPP-2026-005',
      rfqNumber: 'RFQ-COMP-PASSIVE-07',
      title: 'Annual Procurement of AEC-Q200 Grade MLCC Capacitors (0402 & 0603)',
      postedBy: 'Syrma SGS Procurement',
      buyerType: 'EMS Contract Manufacturer',
      vertical: 'Passive & Active Components',
      targetGeometry: '0402 10uF 16V X7R, 0603 22uF 25V X7R',
      volumeRequirement: '5,000,000 pieces across 4 quarters',
      certificationsRequired: ['AEC-Q200', 'RoHS / REACH Compliant', 'PPAP Level 3'],
      status: 'SOURCED',
      postedDate: 'Nov 10, 2026',
      deadline: 'Nov 30, 2026',
      summary: 'Direct manufacturer supply agreement for high-reliability automotive ceramic capacitors with guaranteed reel traceabilities and lead time locks.',
    },
  ];

  const filtered = selectedVertical === 'all'
    ? opportunities
    : opportunities.filter((o) => o.vertical === selectedVertical);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-xl border border-saas-border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-saas-accent bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-semibold">
                Sourcing Demand Board
              </span>
              <span className="text-xs text-saas-secondary">5 Active Industry RFQs</span>
            </div>
            <h1 className="text-2xl font-bold text-saas-primary tracking-tight">
              Semiconductor & Electronics Sourcing Opportunities
            </h1>
            <p className="text-sm text-saas-secondary mt-1">
              Live capacity and component RFQs posted by verified OEMs, IC designers, and procurement managers.
            </p>
          </div>

          <Link
            to="/app/matching"
            className="px-4 py-2 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors shrink-0"
          >
            <Sparkles size={14} />
            Match Sourcing Criteria
          </Link>
        </div>

        {/* VERTICAL FILTERS */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-saas-border">
          <span className="text-xs font-semibold text-saas-secondary px-2 flex items-center gap-1.5">
            <Filter size={13} />
            Filter by Domain:
          </span>
          {['all', 'Semiconductor Foundries', 'Electronics Manufacturing Services (EMS)', 'High-Density Interconnect PCBs', 'OSAT Packaging & Test', 'Passive & Active Components'].map((vert) => (
            <button
              key={vert}
              onClick={() => setSelectedVertical(vert)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedVertical === vert
                  ? 'bg-saas-primary text-white shadow-xs'
                  : 'bg-saas-bg text-saas-secondary hover:text-saas-primary'
              }`}
            >
              {vert === 'all' ? 'All RFQs' : vert}
            </button>
          ))}
        </div>

        {/* RFQ TABLE / LIST */}
        <div className="bg-white rounded-xl border border-saas-border shadow-xs overflow-hidden">
          <div className="p-4 border-b border-saas-border flex items-center justify-between">
            <h2 className="text-xs font-bold text-saas-primary uppercase tracking-wide">
              Active RFQs & Capacity Inquiries ({filtered.length})
            </h2>
            <span className="text-xs text-saas-secondary font-mono">
              Direct B2B Sourcing Leads
            </span>
          </div>

          <div className="divide-y divide-saas-border">
            {filtered.map((opp) => (
              <div
                key={opp.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-saas-accent bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      {opp.rfqNumber}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {opp.vertical}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        opp.status === 'OPEN'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : opp.status === 'REVIEWING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {opp.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-saas-primary">{opp.title}</h3>

                  <p className="text-xs text-saas-secondary leading-relaxed">
                    {opp.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-saas-secondary pt-1">
                    <span className="flex items-center gap-1 font-medium text-saas-primary">
                      <Building2 size={13} className="text-saas-accent" />
                      {opp.postedBy} ({opp.buyerType})
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Cpu size={12} className="text-indigo-600" />
                      {opp.targetGeometry}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar size={12} className="text-slate-400" />
                      Deadline: {opp.deadline}
                    </span>
                  </div>

                  {opp.certificationsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {opp.certificationsRequired.map((cert, i) => (
                        <span key={i} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedOpp(opp);
                      setProposalSent(false);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-saas-primary hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    Respond to RFQ
                    <ArrowRight size={13} />
                  </button>
                  <Link
                    to={`/app/matching`}
                    className="px-3 py-2 rounded-lg bg-saas-bg hover:bg-slate-200 text-saas-primary border border-saas-border text-xs font-semibold shadow-xs transition-colors"
                  >
                    Match Suppliers
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RFQ RESPONSE DRAWER / MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-saas-border shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-saas-accent font-bold">{selectedOpp.rfqNumber}</span>
                <h3 className="text-base font-bold text-saas-primary mt-0.5">{selectedOpp.title}</h3>
                <p className="text-xs text-saas-secondary">Issued by {selectedOpp.postedBy}</p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>

            {proposalSent ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
                <CheckCircle2 size={28} className="text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">RFQ Response Submitted</h4>
                <p className="text-xs text-emerald-700">
                  Your capability statement and technical parameters have been routed to the procurement contact at {selectedOpp.postedBy}.
                </p>
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setProposalSent(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-saas-primary mb-1">
                    Your Company / Representation
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kaynes Semicon Sourcing Division"
                    className="w-full px-3 py-2 text-xs border border-saas-border rounded-lg focus:outline-none focus:border-saas-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-saas-primary mb-1">
                    Capability Alignment Statement
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detail your production node, lead times, cleanroom certification, or relevant qualification standards..."
                    className="w-full px-3 py-2 text-xs border border-saas-border rounded-lg focus:outline-none focus:border-saas-accent resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpp(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-saas-border text-xs text-saas-secondary hover:text-saas-primary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send size={13} />
                    Submit Response
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};
