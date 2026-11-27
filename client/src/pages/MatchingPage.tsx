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
} from 'lucide-react';
import api from '../services/api';
import { MatchingResultItem } from '../types';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { VerificationBadge } from '../components/common/Badge';
import { CompanyDetailModal } from '../components/company/CompanyDetailModal';

export const MatchingPage: React.FC = () => {
  const [targetCapabilities, setTargetCapabilities] = useState<string[]>(['28nm HKMG', 'Class 10 Cleanroom']);
  const [newCapInput, setNewCapInput] = useState('');

  const [targetProducts, setTargetProducts] = useState<string[]>(['RISC-V Microcontrollers']);
  const [newProdInput, setNewProdInput] = useState('');

  const [preferredCountries, setPreferredCountries] = useState<string[]>(['India']);
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>(['Automotive', 'Industrial IoT']);
  const [requiredCertifications, setRequiredCertifications] = useState<string[]>(['IATF 16949']);

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
        setMatches(res.data.data.matches);
      }
    } catch (err: any) {
      alert(err.message || 'Error running matching query.');
    } finally {
      setLoading(false);
    }
  };

  const addCapability = () => {
    if (newCapInput.trim() && !targetCapabilities.includes(newCapInput.trim())) {
      setTargetCapabilities([...targetCapabilities, newCapInput.trim()]);
      setNewCapInput('');
    }
  };

  const removeCapability = (item: string) => {
    setTargetCapabilities(targetCapabilities.filter((c) => c !== item));
  };

  const addProduct = () => {
    if (newProdInput.trim() && !targetProducts.includes(newProdInput.trim())) {
      setTargetProducts([...targetProducts, newProdInput.trim()]);
      setNewProdInput('');
    }
  };

  const removeProduct = (item: string) => {
    setTargetProducts(targetProducts.filter((p) => p !== item));
  };

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles size={14} className="text-teal-600" />
            <span>Deterministic Scoring Algorithm</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Explainable Company Matching Engine
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Configure your technical sourcing requirements below. The transparent rule-based matching engine scores every company across 5 distinct dimensions and breaks down exactly why each candidate was recommended.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Query Builder Form */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Sourcing Requirement Criteria</span>
              <button
                type="button"
                onClick={() => setShowWeights(!showWeights)}
                className="text-xs text-teal-600 hover:text-teal-700 font-mono font-semibold"
              >
                {showWeights ? 'Hide Weights' : 'Adjust Weights'}
              </button>
            </h2>

            {/* Configurable Weights Sliders */}
            {showWeights && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <p className="font-semibold text-slate-700">Heuristic Weights (Normalized):</p>
                <div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span>Capabilities: {Math.round(customWeights.capabilities * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={customWeights.capabilities}
                    onChange={(e) => setCustomWeights({ ...customWeights, capabilities: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span>Products: {Math.round(customWeights.products * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={customWeights.products}
                    onChange={(e) => setCustomWeights({ ...customWeights, products: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span>Location: {Math.round(customWeights.location * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={customWeights.location}
                    onChange={(e) => setCustomWeights({ ...customWeights, location: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
              </div>
            )}

            {/* Target Capabilities */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Capabilities & Nodes
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCapInput}
                  onChange={(e) => setNewCapInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
                  placeholder="e.g. 28nm HKMG, 01005 SMT, Class 10"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={addCapability}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {targetCapabilities.map((cap) => (
                  <span key={cap} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-xs font-mono">
                    {cap}
                    <button onClick={() => removeCapability(cap)} className="hover:text-red-500">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Target Products */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Products & Components
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newProdInput}
                  onChange={(e) => setNewProdInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProduct())}
                  placeholder="e.g. RISC-V Microcontrollers, Power Modules"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={addProduct}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {targetProducts.map((prod) => (
                  <span key={prod} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-mono">
                    {prod}
                    <button onClick={() => removeProduct(prod)} className="hover:text-red-500">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Countries */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Regional Corridors
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['India', 'United States', 'Israel', 'Taiwan', 'Japan', 'Germany'].map((country) => {
                  const selected = preferredCountries.includes(country);
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => toggleItem(preferredCountries, setPreferredCountries, country)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                        selected
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {country}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Market Sectors */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Market Sectors
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Automotive', 'Aerospace & Defense', 'Industrial IoT', 'Medical Devices', 'Telecommunications', 'Consumer Electronics'].map((ind) => {
                  const selected = preferredIndustries.includes(ind);
                  return (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => toggleItem(preferredIndustries, setPreferredIndustries, ind)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {ind}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quality Standards */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Required Quality Standards
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['IATF 16949', 'AS9100D', 'ISO 9001:2015', 'ISO 13485:2016', 'ISRO Space Grade'].map((cert) => {
                  const selected = requiredCertifications.includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleItem(requiredCertifications, setRequiredCertifications, cert)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                        selected
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cert}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={runMatchingQuery}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Evaluating 28 Companies...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Execute Matching Query</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Ranked Match Results */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                Ranked Compatibility Results
              </h2>
              {matches.length > 0 && (
                <span className="text-xs font-mono text-slate-500">
                  {matches.length} candidates evaluated
                </span>
              )}
            </div>

            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((item, index) => {
                  const scoreColor =
                    item.totalScore >= 80
                      ? 'text-teal-600 bg-teal-50 border-teal-200'
                      : item.totalScore >= 50
                      ? 'text-indigo-600 bg-indigo-50 border-indigo-200'
                      : 'text-slate-600 bg-slate-100 border-slate-200';

                  return (
                    <div
                      key={item.company.id}
                      className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                    >
                      {/* Top Bar: Rank, Name, Score */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold font-mono text-slate-400">
                              #{index + 1}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-mono">
                              {item.company.category?.name || item.company.companyType}
                            </span>
                            <VerificationBadge status={item.company.verificationStatus} size="sm" />
                          </div>
                          <h3
                            onClick={() => setSelectedCompany(item.company)}
                            className="text-base font-bold text-slate-900 hover:text-teal-600 cursor-pointer transition-colors"
                          >
                            {item.company.name}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} className="text-slate-400" />
                            {item.company.hqCity}, {item.company.hqCountry}
                          </p>
                        </div>

                        {/* Match Score Badge */}
                        <div className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-base flex flex-col items-center ${scoreColor}`}>
                          <span>{item.totalScore}%</span>
                          <span className="text-[9px] uppercase tracking-wider font-sans font-medium -mt-0.5">Match</span>
                        </div>
                      </div>

                      {/* Dimension Score Bars */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
                        <div className="p-2 rounded bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 text-[10px] block">Capabilities</span>
                          <span className="font-bold text-slate-800">{item.breakdown.capabilitiesScore}%</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 text-[10px] block">Products</span>
                          <span className="font-bold text-slate-800">{item.breakdown.productsScore}%</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 text-[10px] block">Sector</span>
                          <span className="font-bold text-slate-800">{item.breakdown.industryScore}%</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 text-[10px] block">Location</span>
                          <span className="font-bold text-slate-800">{item.breakdown.locationScore}%</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 text-[10px] block">Standards</span>
                          <span className="font-bold text-slate-800">{item.breakdown.certificationsScore}%</span>
                        </div>
                      </div>

                      {/* Explanatory Reasons Breakdown */}
                      {item.matchReasons.length > 0 && (
                        <div className="p-3 rounded-lg bg-teal-50/50 border border-teal-100 text-xs space-y-1">
                          <p className="text-[10px] font-semibold text-teal-800 uppercase tracking-wider">
                            Match Explanations:
                          </p>
                          <ul className="space-y-1 text-slate-700 text-xs">
                            {item.matchReasons.slice(0, 3).map((reason, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 size={13} className="text-teal-600 shrink-0 mt-0.5" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Identified Gaps */}
                      {item.gapNotes.length > 0 && (
                        <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100 text-xs space-y-1">
                          <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">
                            Gaps / Missing Criteria:
                          </p>
                          <ul className="space-y-1 text-slate-600 text-[11px]">
                            {item.gapNotes.slice(0, 2).map((gap, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                                <span>{gap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedCompany(item.company)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700"
                        >
                          <span>Full Profile & Sourcing Workspace</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <Sparkles size={36} className="text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">
                  Ready to compute candidate compatibility
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                  Select your technical requirements on the left and click "Execute Matching Query" to evaluate candidates with transparent mathematical weights.
                </p>
                <button
                  type="button"
                  onClick={runMatchingQuery}
                  className="px-5 py-2.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-500 transition-colors shadow-sm"
                >
                  Run Default Semiconductor Match
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <CompanyDetailModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />

      <Footer />
    </div>
  );
};
