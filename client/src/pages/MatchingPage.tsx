import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Layers,
  MapPin,
  Award,
  ArrowRight,
  RefreshCw,
  Bookmark,
  Building2,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';
import api from '../services/api';
import { MatchingResultItem } from '../types';
import { AppLayout } from '../components/layout/AppLayout';
import { VerificationBadge } from '../components/common/Badge';
import { CompanyDetailModal } from '../components/company/CompanyDetailModal';

export const MatchingPage: React.FC = () => {
  const [targetCapabilities, setTargetCapabilities] = useState<string[]>(['28nm HKMG', 'Class 10 Cleanroom']);
  const [newCapInput, setNewCapInput] = useState('');

  const [targetProducts, setTargetProducts] = useState<string[]>(['RISC-V Microcontrollers']);
  const [newProdInput, setNewProdInput] = useState('');

  const [preferredCountries, setPreferredCountries] = useState<string[]>(['India', 'Taiwan']);
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>(['Automotive', 'Industrial IoT']);
  const [requiredCertifications, setRequiredCertifications] = useState<string[]>(['IATF 16949', 'ISO 9001']);

  const [showWeights, setShowWeights] = useState(false);
  const [customWeights, setCustomWeights] = useState({
    capabilities: 0.35,
    products: 0.25,
    industry: 0.20,
    location: 0.10,
    certifications: 0.10,
  });

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchingResultItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  const runMatchingQuery = async () => {
    setLoading(true);
    try {
      const payload = {
        targetCapabilities,
        targetProducts,
        preferredCountries,
        preferredIndustries,
        requiredCertifications,
        customWeights,
      };

      const res = await api.post('/matching/query', payload);
      if (res.data?.success) {
        setMatches(res.data.data.results);
      }
    } catch (err: any) {
      alert(err.message || 'Matching engine calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  const addCapability = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCapInput.trim() && !targetCapabilities.includes(newCapInput.trim())) {
      setTargetCapabilities([...targetCapabilities, newCapInput.trim()]);
      setNewCapInput('');
    }
  };

  const removeCapability = (item: string) => {
    setTargetCapabilities(targetCapabilities.filter((c) => c !== item));
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProdInput.trim() && !targetProducts.includes(newProdInput.trim())) {
      setTargetProducts([...targetProducts, newProdInput.trim()]);
      setNewProdInput('');
    }
  };

  const removeProduct = (item: string) => {
    setTargetProducts(targetProducts.filter((p) => p !== item));
  };

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-saas-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                Algorithmic Sourcing Engine
              </span>
              <span className="text-xs font-mono text-saas-secondary">• Multi-Factor Explainable Scoring</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-saas-primary">
              Semiconductor Capability Matching Engine
            </h1>
            <p className="text-xs text-saas-secondary mt-0.5">
              Algorithmically ranks wafer foundries, packaging houses, and EMS partners based on technical specifications, process geometries, and geographic criteria.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWeights(!showWeights)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-saas-primary text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Sliders size={14} className="text-saas-accent" />
              <span>{showWeights ? 'Hide Heuristic Weights' : 'Adjust Heuristic Weights'}</span>
            </button>

            <button
              onClick={runMatchingQuery}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              <span>Calculate Matches</span>
            </button>
          </div>
        </div>

        {/* CUSTOM HEURISTIC WEIGHTS DRAWER */}
        {showWeights && (
          <div className="bg-white rounded-xl border border-saas-border p-5 shadow-xs animate-in fade-in space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-saas-primary uppercase tracking-wide">
                  Heuristic Weight Distribution
                </h3>
                <p className="text-[11px] text-saas-secondary">
                  Assign relative priority coefficients to each matching vector (Sum = 1.0)
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-saas-accent bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                Sum: {Math.round((Object.values(customWeights).reduce((a, b) => a + b, 0)) * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
              {Object.entries(customWeights).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-saas-primary capitalize">
                    <span>{key}</span>
                    <span className="font-mono text-saas-accent">{Math.round(val * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={val}
                    onChange={(e) =>
                      setCustomWeights({
                        ...customWeights,
                        [key]: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-COLUMN WORKBENCH: CRITERIA FORM + MATCH RESULTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: CRITERIA INPUT PANEL */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-saas-border p-5 shadow-xs space-y-5">
              <h2 className="text-xs font-bold text-saas-primary uppercase tracking-wide pb-2 border-b border-saas-border">
                Target Sourcing Requirements
              </h2>

              {/* 1. Target Capabilities */}
              <div>
                <label className="block text-xs font-semibold text-saas-primary mb-1">
                  1. Target Capabilities (Node / Geometry)
                </label>
                <form onSubmit={addCapability} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCapInput}
                    onChange={(e) => setNewCapInput(e.target.value)}
                    placeholder="e.g. 28nm, SMT 01005, Class 10 Cleanroom"
                    className="flex-1 px-3 py-1.5 border border-saas-border rounded-lg text-xs focus:outline-none focus:border-saas-accent"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-saas-primary hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-1.5">
                  {targetCapabilities.map((cap) => (
                    <span
                      key={cap}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[11px] font-mono border border-teal-200"
                    >
                      <Cpu size={11} />
                      <span>{cap}</span>
                      <button
                        type="button"
                        onClick={() => removeCapability(cap)}
                        className="text-teal-600 hover:text-teal-900 ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Target Products */}
              <div>
                <label className="block text-xs font-semibold text-saas-primary mb-1">
                  2. Target Products & Domains
                </label>
                <form onSubmit={addProduct} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newProdInput}
                    onChange={(e) => setNewProdInput(e.target.value)}
                    placeholder="e.g. RISC-V SoC, HDI PCB, BGA Module"
                    className="flex-1 px-3 py-1.5 border border-saas-border rounded-lg text-xs focus:outline-none focus:border-saas-accent"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-saas-primary hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-1.5">
                  {targetProducts.map((prod) => (
                    <span
                      key={prod}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[11px] font-mono border border-indigo-200"
                    >
                      <Layers size={11} />
                      <span>{prod}</span>
                      <button
                        type="button"
                        onClick={() => removeProduct(prod)}
                        className="text-indigo-600 hover:text-indigo-900 ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Preferred Geographic Corridors */}
              <div>
                <label className="block text-xs font-semibold text-saas-primary mb-1.5">
                  3. Preferred Geographic Hubs
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: 'India', flag: '🇮🇳' },
                    { code: 'Taiwan', flag: '🇹🇼' },
                    { code: 'United States', flag: '🇺🇸' },
                    { code: 'Japan', flag: '🇯🇵' },
                    { code: 'Austria', flag: '🇦🇹' },
                  ].map((country) => {
                    const active = preferredCountries.includes(country.code);
                    return (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => toggleItem(preferredCountries, setPreferredCountries, country.code)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                          active
                            ? 'bg-saas-primary text-white border-saas-primary'
                            : 'bg-white text-saas-secondary border-saas-border hover:bg-slate-50'
                        }`}
                      >
                        <span>{country.flag}</span>
                        <span>{country.code}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Mandatory Certifications */}
              <div>
                <label className="block text-xs font-semibold text-saas-primary mb-1.5">
                  4. Audited Standards & Certifications
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['IATF 16949', 'ISO 9001', 'ISO 14001', 'IPC-A-610 Class 3', 'AS9100D', 'AEC-Q100', 'Cleanroom Class 100'].map((cert) => {
                    const active = requiredCertifications.includes(cert);
                    return (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => toggleItem(requiredCertifications, setRequiredCertifications, cert)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                          active
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-white text-saas-secondary border-saas-border hover:bg-slate-50'
                        }`}
                      >
                        <Award size={11} />
                        <span>{cert}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={runMatchingQuery}
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-saas-accent hover:bg-teal-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Execute Matching Engine
              </button>
            </div>
          </div>

          {/* RIGHT 2 COLUMNS: MATCH RANKING RESULTS */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-saas-border shadow-xs overflow-hidden">
              <div className="p-4 border-b border-saas-border flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-saas-primary uppercase tracking-wide">
                    Ranked Alignment Matrix ({matches.length})
                  </h2>
                  <p className="text-[11px] text-saas-secondary">
                    Sorted by composite weighted fit score with vector breakdown
                  </p>
                </div>
                {matches.length > 0 && (
                  <span className="text-xs font-mono font-bold text-saas-accent">
                    Top Match: {matches[0]?.totalScore}%
                  </span>
                )}
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <RefreshCw size={24} className="animate-spin text-saas-accent mx-auto mb-2" />
                  <p className="text-xs text-saas-secondary">
                    Calculating weighted Euclidean distances and token overlaps across 28 entities...
                  </p>
                </div>
              ) : matches.length > 0 ? (
                <div className="divide-y divide-saas-border">
                  {matches.map((item, idx) => (
                    <div
                      key={item.company.id}
                      className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </span>
                          <h3
                            onClick={() => setSelectedCompany(item.company)}
                            className="text-sm font-bold text-saas-primary hover:text-saas-accent transition-colors cursor-pointer"
                          >
                            {item.company.name}
                          </h3>
                          <VerificationBadge status={item.company.verificationStatus} size="sm" />
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.company.category?.name || item.company.companyType}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-saas-secondary">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" />
                            {item.company.hqCity}, {item.company.hqCountry}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-md">{item.company.description}</span>
                        </div>

                        {/* EXPLAINABILITY SCORE BREAKDOWN BAR */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px] font-mono">
                          <div className="bg-slate-50 p-1.5 rounded border border-saas-border">
                            <span className="text-slate-400 block text-[9px] uppercase">Cap Match</span>
                            <span className="font-bold text-teal-700">{Math.round(item.breakdown.capabilitiesScore)}%</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded border border-saas-border">
                            <span className="text-slate-400 block text-[9px] uppercase">Prod Match</span>
                            <span className="font-bold text-indigo-700">{Math.round(item.breakdown.productsScore)}%</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded border border-saas-border">
                            <span className="text-slate-400 block text-[9px] uppercase">Industry</span>
                            <span className="font-bold text-blue-700">{Math.round(item.breakdown.industryScore)}%</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded border border-saas-border">
                            <span className="text-slate-400 block text-[9px] uppercase">Corridor</span>
                            <span className="font-bold text-emerald-700">{Math.round(item.breakdown.locationScore)}%</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded border border-saas-border">
                            <span className="text-slate-400 block text-[9px] uppercase">Audit Std</span>
                            <span className="font-bold text-amber-700">{Math.round(item.breakdown.certificationsScore)}%</span>
                          </div>
                        </div>

                        {/* MATCH REASONS */}
                        {item.matchReasons && item.matchReasons.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.matchReasons.slice(0, 3).map((r: string, ri: number) => (
                              <span key={ri} className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <Check size={10} className="text-emerald-600 shrink-0" />
                                <span>{r}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* COMPOSITE SCORE GAUGE & ACTION */}
                      <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 shrink-0 md:border-l md:border-saas-border md:pl-5">
                        <div className="text-center">
                          <div className="text-2xl font-black font-mono text-saas-accent">
                            {item.totalScore}%
                          </div>
                          <span className="text-[10px] uppercase font-mono text-saas-secondary">
                            Composite Fit
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedCompany(item.company)}
                          className="px-3.5 py-1.5 rounded-lg bg-saas-primary hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          Inspect Profile
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center max-w-md mx-auto">
                  <Sparkles size={36} className="text-saas-accent mx-auto mb-2 opacity-50" />
                  <h3 className="text-sm font-bold text-saas-primary">Ready to Compute Matches</h3>
                  <p className="text-xs text-saas-secondary mt-1 mb-4">
                    Select target manufacturing nodes, assembly standards, and geographies in the left workbench, then click "Calculate Matches".
                  </p>
                  <button
                    onClick={runMatchingQuery}
                    className="px-4 py-2 bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                  >
                    Run Sample Sourcing Query
                  </button>
                </div>
              )}
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
