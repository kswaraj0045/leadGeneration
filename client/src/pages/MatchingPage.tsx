import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle,
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
  ChevronUp,
  Search,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import api from '../services/api';
import { MatchingResultItem } from '../types';
import { AppLayout } from '../components/layout/AppLayout';
import { VerificationBadge } from '../components/common/Badge';
import { CompanyDetailModal } from '../components/company/CompanyDetailModal';

export const MatchingPage: React.FC = () => {
  // 1. Required Services
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'PCB Assembly',
    'Electronics Manufacturing',
  ]);
  const [customServiceInput, setCustomServiceInput] = useState('');

  // 2. Products or Components
  const [selectedProducts, setSelectedProducts] = useState<string[]>([
    'Microcontrollers',
  ]);
  const [customProductInput, setCustomProductInput] = useState('');

  // 3. Preferred Locations
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    'India',
  ]);

  // 4. Certifications
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [noCertPreference, setNoCertPreference] = useState(true);

  // Advanced Preferences (Collapsible)
  const [showAdvancedPreferences, setShowAdvancedPreferences] = useState(false);
  const [weights, setWeights] = useState({
    capabilities: 0.35,
    products: 0.25,
    industry: 0.20,
    location: 0.10,
    certifications: 0.10,
  });

  // State
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [matches, setMatches] = useState<MatchingResultItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [savedCompanyIds, setSavedCompanyIds] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Common Presets
  const popularServices = [
    'PCB Assembly',
    'PCB Manufacturing',
    'IC Packaging',
    'Semiconductor Testing',
    'Electronics Manufacturing',
    'PCB Design',
    'Component Distribution',
  ];

  const popularProducts = [
    'Microcontrollers',
    'RISC-V Processors',
    'Semiconductor Components',
    'HDI PCB',
    'BGA Modules',
    'Electronic Components',
  ];

  const popularLocations = [
    { name: 'India', flag: '🇮🇳' },
    { name: 'Taiwan', flag: '🇹🇼' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'Austria', flag: '🇦🇹' },
    { name: 'Germany', flag: '🇩🇪' },
  ];

  const popularCertifications = [
    'IATF 16949 (Automotive)',
    'ISO 9001 (Quality)',
    'ISO 14001 (Environmental)',
    'AS9100D (Aerospace)',
    'IPC-A-610 (Assembly)',
    'Cleanroom Class 100',
  ];

  const toggleSelection = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (customServiceInput.trim() && !selectedServices.includes(customServiceInput.trim())) {
      setSelectedServices([...selectedServices, customServiceInput.trim()]);
      setCustomServiceInput('');
    }
  };

  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (customProductInput.trim() && !selectedProducts.includes(customProductInput.trim())) {
      setSelectedProducts([...selectedProducts, customProductInput.trim()]);
      setCustomProductInput('');
    }
  };

  const handleRunMatching = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const payload = {
        targetCapabilities: selectedServices,
        targetServices: selectedServices,
        targetProducts: selectedProducts,
        preferredCountries: selectedLocations,
        requiredCertifications: noCertPreference ? [] : selectedCertifications,
        customWeights: weights,
      };

      const res = await api.post('/matching/query', payload);
      if (res.data?.success) {
        const results = res.data.data?.matches || res.data.data?.results || [];
        setMatches(results);
      }
    } catch (err: any) {
      console.error('Matching query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (companyId: string) => {
    setSavingId(companyId);
    try {
      await api.post('/saved', {
        companyId,
        status: 'EVALUATING',
        notes: 'Shortlisted from Company Matching',
      });
      setSavedCompanyIds((prev) => [...prev, companyId]);
    } catch (err: any) {
      alert(err.message || 'Could not save company. Please make sure you are signed in.');
    } finally {
      setSavingId(null);
    }
  };

  const handleReset = () => {
    setSelectedServices([]);
    setSelectedProducts([]);
    setSelectedLocations([]);
    setSelectedCertifications([]);
    setNoCertPreference(true);
    setMatches([]);
    setSearched(false);
  };

  const handlePreFillSample = () => {
    setSelectedServices(['PCB Assembly', 'Electronics Manufacturing']);
    setSelectedProducts(['Microcontrollers', 'HDI PCB']);
    setSelectedLocations(['India']);
    setNoCertPreference(true);
    setTimeout(() => {
      handleRunMatching();
    }, 100);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-saas-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-saas-accent bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                Business Partner Discovery
              </span>
              <span className="text-xs text-saas-secondary">
                Find suppliers, manufacturers & partners
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-saas-primary">
              Company Matching
            </h1>
            <p className="text-xs text-saas-secondary mt-0.5">
              Select what your business needs and we will find the most suitable companies across the semiconductor and electronics ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-xs font-semibold text-saas-secondary transition-colors cursor-pointer"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleRunMatching}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )}
              <span>Find Matching Companies</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: SEARCH REQUIREMENTS & MATCHING RESULTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: WHAT ARE YOU LOOKING FOR? (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-xl border border-saas-border p-5 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-saas-primary">
                  What are you looking for?
                </h2>
                <p className="text-xs text-saas-secondary mt-0.5 leading-relaxed">
                  Tell us what your business needs. We'll find companies that match your requirements.
                </p>
              </div>

              {/* 1. REQUIRED SERVICES */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-saas-primary">
                    1. Required Services
                  </label>
                  {selectedServices.length > 0 && (
                    <span className="text-[11px] font-mono text-teal-800 font-semibold">
                      {selectedServices.length} selected
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {popularServices.map((service) => {
                    const isSelected = selectedServices.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleSelection(selectedServices, setSelectedServices, service)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-teal-50 text-teal-900 border border-teal-300 font-semibold'
                            : 'bg-saas-bg hover:bg-slate-100 text-saas-primary border border-saas-border'
                        }`}
                      >
                        {isSelected && <Check size={12} className="text-teal-700" />}
                        <span>{service}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Service Input */}
                <form onSubmit={handleAddCustomService} className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={customServiceInput}
                    onChange={(e) => setCustomServiceInput(e.target.value)}
                    placeholder="Add other service (e.g. SMT 01005)..."
                    className="flex-1 px-3 py-1.5 text-xs bg-saas-bg border border-saas-border rounded-lg text-saas-primary placeholder:text-slate-400 focus:outline-none focus:border-saas-accent focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-saas-primary hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* 2. PRODUCTS OR COMPONENTS */}
              <div className="space-y-2 pt-2 border-t border-saas-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-saas-primary">
                    2. Products or Components
                  </label>
                  {selectedProducts.length > 0 && (
                    <span className="text-[11px] font-mono text-teal-800 font-semibold">
                      {selectedProducts.length} selected
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {popularProducts.map((product) => {
                    const isSelected = selectedProducts.includes(product);
                    return (
                      <button
                        key={product}
                        type="button"
                        onClick={() => toggleSelection(selectedProducts, setSelectedProducts, product)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-teal-50 text-teal-900 border border-teal-300 font-semibold'
                            : 'bg-saas-bg hover:bg-slate-100 text-saas-primary border border-saas-border'
                        }`}
                      >
                        {isSelected && <Check size={12} className="text-teal-700" />}
                        <span>{product}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Product Input */}
                <form onSubmit={handleAddCustomProduct} className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={customProductInput}
                    onChange={(e) => setCustomProductInput(e.target.value)}
                    placeholder="Add other product (e.g. Power MOSFETs)..."
                    className="flex-1 px-3 py-1.5 text-xs bg-saas-bg border border-saas-border rounded-lg text-saas-primary placeholder:text-slate-400 focus:outline-none focus:border-saas-accent focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-saas-primary hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* 3. PREFERRED LOCATIONS */}
              <div className="space-y-2 pt-2 border-t border-saas-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-saas-primary">
                    3. Preferred Locations
                  </label>
                  {selectedLocations.length > 0 ? (
                    <span className="text-[11px] font-mono text-teal-800 font-semibold">
                      {selectedLocations.length} selected
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono">Any location</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {popularLocations.map((loc) => {
                    const isSelected = selectedLocations.includes(loc.name);
                    return (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => toggleSelection(selectedLocations, setSelectedLocations, loc.name)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-saas-primary text-white font-semibold shadow-xs'
                            : 'bg-saas-bg hover:bg-slate-100 text-saas-primary border border-saas-border'
                        }`}
                      >
                        <span>{loc.flag}</span>
                        <span>{loc.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. CERTIFICATIONS */}
              <div className="space-y-2 pt-2 border-t border-saas-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-saas-primary">
                    4. Certifications
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNoCertPreference(!noCertPreference);
                      if (!noCertPreference) setSelectedCertifications([]);
                    }}
                    className={`text-[11px] font-semibold transition-colors cursor-pointer ${
                      noCertPreference ? 'text-teal-700 underline' : 'text-saas-secondary'
                    }`}
                  >
                    {noCertPreference ? '✓ No preference' : 'Set preference'}
                  </button>
                </div>

                {!noCertPreference && (
                  <div className="flex flex-wrap gap-1.5 pt-1 animate-in fade-in">
                    {popularCertifications.map((cert) => {
                      const isSelected = selectedCertifications.includes(cert.split(' ')[0]);
                      const cleanName = cert.split(' ')[0];
                      return (
                        <button
                          key={cert}
                          type="button"
                          onClick={() => toggleSelection(selectedCertifications, setSelectedCertifications, cleanName)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? 'bg-teal-50 text-teal-900 border border-teal-300 font-semibold'
                              : 'bg-saas-bg hover:bg-slate-100 text-saas-secondary border border-saas-border'
                          }`}
                        >
                          {isSelected && <Check size={11} className="text-teal-700" />}
                          <span>{cert}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* COLLAPSIBLE ADVANCED PREFERENCES */}
              <div className="pt-2 border-t border-saas-border">
                <button
                  type="button"
                  onClick={() => setShowAdvancedPreferences(!showAdvancedPreferences)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-saas-secondary hover:text-saas-primary cursor-pointer py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders size={13} className="text-saas-accent" />
                    <span>Advanced Preferences</span>
                  </span>
                  {showAdvancedPreferences ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showAdvancedPreferences && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-saas-border space-y-3 animate-in fade-in">
                    <p className="text-[11px] text-saas-secondary">
                      Fine-tune the importance of each factor in calculating matching scores:
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-saas-secondary">Services Match</span>
                        <span className="font-mono font-bold text-saas-accent">{Math.round(weights.capabilities * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={weights.capabilities}
                        onChange={(e) => setWeights({ ...weights, capabilities: parseFloat(e.target.value) })}
                        className="w-full accent-teal-600"
                      />

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-saas-secondary">Products Match</span>
                        <span className="font-mono font-bold text-saas-accent">{Math.round(weights.products * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={weights.products}
                        onChange={(e) => setWeights({ ...weights, products: parseFloat(e.target.value) })}
                        className="w-full accent-teal-600"
                      />

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-saas-secondary">Location Match</span>
                        <span className="font-mono font-bold text-saas-accent">{Math.round(weights.location * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={weights.location}
                        onChange={(e) => setWeights({ ...weights, location: parseFloat(e.target.value) })}
                        className="w-full accent-teal-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PRIMARY SEARCH BUTTON */}
              <button
                type="button"
                onClick={handleRunMatching}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-saas-accent hover:bg-teal-700 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Finding Matching Companies...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Find Matching Companies</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: MATCHING RESULTS (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {loading ? (
              <div className="bg-white rounded-xl border border-saas-border p-12 text-center shadow-xs">
                <RefreshCw size={28} className="animate-spin text-saas-accent mx-auto mb-3" />
                <h3 className="text-sm font-bold text-saas-primary">Searching company database...</h3>
                <p className="text-xs text-saas-secondary mt-1">
                  Evaluating 28 verified semiconductor and electronics companies against your requirements.
                </p>
              </div>
            ) : searched && matches.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-saas-border">
                  <div>
                    <h2 className="text-sm font-bold text-saas-primary">
                      Matching Companies ({matches.length})
                    </h2>
                    <p className="text-xs text-saas-secondary">
                      Sorted by how closely they match your requirements
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-saas-accent bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    Best Match: {matches[0]?.totalScore}%
                  </span>
                </div>

                <div className="space-y-3">
                  {matches.map((item) => {
                    const company = item.company;
                    const isSaved = savedCompanyIds.includes(company.id);

                    return (
                      <div
                        key={company.id}
                        className="bg-white rounded-xl border border-saas-border p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h3
                                onClick={() => setSelectedCompany(company)}
                                className="text-base font-bold text-saas-primary hover:text-saas-accent transition-colors cursor-pointer"
                              >
                                {company.name}
                              </h3>
                              <VerificationBadge status={company.verificationStatus} size="sm" />
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                              <span>{item.totalScore}% Match</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-saas-secondary">
                            <span className="flex items-center gap-1 font-medium text-saas-primary">
                              <MapPin size={13} className="text-slate-400" />
                              {company.hqCity}, {company.hqCountry}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                              {company.category?.name || company.companyType}
                            </span>
                          </div>

                          <p className="text-xs text-saas-secondary leading-relaxed line-clamp-2">
                            {company.description}
                          </p>

                          {/* PLAIN BUSINESS LANGUAGE MATCH EXPLANATIONS */}
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              Why this company matches:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.matchReasons && item.matchReasons.length > 0 ? (
                                item.matchReasons.map((reason, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-2 py-0.5 rounded"
                                  >
                                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                                    <span>{reason}</span>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-slate-500">
                                  Matches your general industry and geographic requirements.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CARD ACTIONS */}
                        <div className="pt-3 border-t border-saas-border flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setSelectedCompany(company)}
                            className="px-3 py-1.5 rounded-lg bg-saas-bg hover:bg-slate-200 text-saas-primary text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>View Profile</span>
                            <ArrowRight size={13} />
                          </button>

                          <button
                            type="button"
                            disabled={isSaved || savingId === company.id}
                            onClick={() => handleSaveCompany(company.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isSaved
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                : 'bg-white hover:bg-slate-50 text-saas-primary border border-saas-border'
                            }`}
                          >
                            <Bookmark size={13} className={isSaved ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'} />
                            <span>{isSaved ? 'Saved to Pipeline' : 'Save Company'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : searched && matches.length === 0 ? (
              <div className="bg-white rounded-xl border border-saas-border p-12 text-center shadow-xs space-y-3">
                <AlertCircle size={32} className="text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-saas-primary">No companies match all criteria</h3>
                <p className="text-xs text-saas-secondary max-w-md mx-auto leading-relaxed">
                  Try broadening your search by removing a location constraint or selecting fewer specific certifications.
                </p>
                <button
                  type="button"
                  onClick={handlePreFillSample}
                  className="mt-2 px-4 py-2 rounded-lg bg-saas-accent text-white text-xs font-semibold hover:bg-teal-700 transition-colors cursor-pointer"
                >
                  Show Recommended Matches
                </button>
              </div>
            ) : (
              /* BEFORE SEARCHING: HELPFUL EMPTY STATE */
              <div className="bg-white rounded-xl border border-saas-border p-12 text-center shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-saas-accent flex items-center justify-center mx-auto">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-saas-primary">
                    Your matching companies will appear here
                  </h3>
                  <p className="text-xs text-saas-secondary mt-1 max-w-sm mx-auto leading-relaxed">
                    Select your required services, products, and preferred locations on the left, then click <strong>Find Matching Companies</strong>.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handlePreFillSample}
                    className="px-4 py-2 rounded-lg bg-saas-primary hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 mx-auto cursor-pointer transition-colors"
                  >
                    <Search size={14} />
                    <span>Try a Sample Search</span>
                  </button>
                </div>
              </div>
            )}
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
