import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Bookmark,
  Sparkles,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Building2,
  FileSpreadsheet,
  LayoutGrid,
  List,
  Cpu,
  MapPin,
  Award,
  Layers,
} from 'lucide-react';
import api from '../services/api';
import { Company, CompanyCategory } from '../types';
import { CompanyCard } from '../components/company/CompanyCard';
import { CompanyDetailModal } from '../components/company/CompanyDetailModal';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { VerificationBadge, StageBadge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

export const DiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter state
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [companyType, setCompanyType] = useState(searchParams.get('companyType') || 'all');
  const [country, setCountry] = useState(searchParams.get('country') || 'all');
  const [verificationStatus, setVerificationStatus] = useState(searchParams.get('verificationStatus') || 'all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Save search modal state
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [saveSearchSuccess, setSaveSearchSuccess] = useState(false);

  // Export state
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.get('/companies/categories').then((res) => {
      if (res.data?.success) {
        setCategories(res.data.data);
      }
    });
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 12 };
      if (q.trim()) params.q = q.trim();
      if (category !== 'all') params.category = category;
      if (companyType !== 'all') params.companyType = companyType;
      if (country !== 'all') params.country = country;
      if (verificationStatus !== 'all') params.verificationStatus = verificationStatus;

      const res = await api.get('/companies', { params });
      if (res.data?.success) {
        setCompanies(res.data.data);
        setTotalPages(res.data.meta?.totalPages || 1);
        setTotalCount(res.data.meta?.total || 0);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, category, companyType, country, verificationStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCompanies();
  };

  const clearFilters = () => {
    setQ('');
    setCategory('all');
    setCompanyType('all');
    setCountry('all');
    setVerificationStatus('all');
    setPage(1);
  };

  const handleExport = async (format: 'CSV' | 'EXCEL') => {
    setExporting(true);
    try {
      const response = await api.post(
        `/export/companies?format=${format}`,
        { companyIds: companies.map((c) => c.id) },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `viaset_companies_${format.toLowerCase()}.${format === 'EXCEL' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert(err.message || 'Export failed. Please check plan limits.');
    } finally {
      setExporting(false);
    }
  };

  const handleSaveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/searches/saved', {
        name: searchName,
        queryParams: { q, category, companyType, country, verificationStatus },
      });
      setSaveSearchSuccess(true);
      setTimeout(() => {
        setSaveSearchOpen(false);
        setSaveSearchSuccess(false);
        setSearchName('');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to save search.');
    }
  };

  const hasActiveFilters = q || category !== 'all' || companyType !== 'all' || country !== 'all' || verificationStatus !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                SaaS Intelligence Console
              </span>
              <span className="text-xs font-mono text-slate-500">• 28 Facilities Synced</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Semiconductor & Electronics Registry Matrix
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Query multi-tier verified wafer foundries, packaging facilities, interconnect manufacturers, and EMS turnkey providers.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-300 p-0.5 bg-white">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs font-medium ${
                  viewMode === 'grid' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs font-medium ${
                  viewMode === 'table' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dense Data Matrix View"
              >
                <List size={15} />
              </button>
            </div>

            <button
              onClick={() => setSaveSearchOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Bookmark size={13} className="text-slate-400" />
              <span>Save Query</span>
            </button>

            <button
              onClick={() => handleExport('CSV')}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Download size={13} />
              <span>CSV</span>
            </button>

            <button
              onClick={() => handleExport('EXCEL')}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors"
            >
              <FileSpreadsheet size={13} className="text-teal-700" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Query & Filter Console Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Query by process node (28nm, 180nm), SMT placement, cleanroom standard, or product catalog..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow-xs"
            >
              Run Query
            </button>
          </form>

          {/* Facet Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                Ecosystem Vertical
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">All Ecosystem Verticals</option>
                <option value="semiconductor-foundry">Semiconductor Foundry</option>
                <option value="ic-design-fabless">IC Design / Fabless</option>
                <option value="osat-packaging">OSAT & Packaging</option>
                <option value="pcb-fabrication">PCB Fabrication</option>
                <option value="pcb-assembly-ems">PCB Assembly / EMS</option>
                <option value="passive-components">Passive Components</option>
                <option value="discrete-semiconductors">Discrete Semiconductors</option>
                <option value="semiconductor-distribution">Semiconductor Distribution</option>
                <option value="semiconductor-equipment">Semiconductor Equipment</option>
                <option value="test-measurement">Test & Measurement</option>
                <option value="embedded-systems">Embedded Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                Vendor Facility Type
              </label>
              <select
                value={companyType}
                onChange={(e) => {
                  setCompanyType(e.target.value);
                  setPage(1);
                }}
                className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">All Vendor Types</option>
                <option value="Foundry">Foundry Facility</option>
                <option value="Design House">Fabless Design House</option>
                <option value="OSAT">OSAT Packaging Unit</option>
                <option value="Manufacturer">OEM / Component Maker</option>
                <option value="Service Provider">EMS Turnkey Provider</option>
                <option value="Distributor">Authorized Distributor</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                Regional Corridor
              </label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setPage(1);
                }}
                className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">All Geographic Corridors</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="Israel">Israel</option>
                <option value="Japan">Japan</option>
                <option value="Taiwan">Taiwan</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                Data Provenance / Status
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => {
                  setVerificationStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">All Provenance Statuses</option>
                <option value="VERIFIED">Verified Enterprise Record</option>
                <option value="CLAIMED">Claimed Submission</option>
                <option value="UNVERIFIED">Unverified Directory Record</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-slate-400 text-[10px] font-mono uppercase">Applied Parameters:</span>
              {q && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                  q="{q}"
                  <button onClick={() => setQ('')}><X size={12} /></button>
                </span>
              )}
              {category !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-mono text-[11px] border border-teal-200">
                  vertical:{category}
                  <button onClick={() => setCategory('all')}><X size={12} /></button>
                </span>
              )}
              {companyType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                  type:{companyType}
                  <button onClick={() => setCompanyType('all')}><X size={12} /></button>
                </span>
              )}
              {country !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                  country:{country}
                  <button onClick={() => setCountry('all')}><X size={12} /></button>
                </span>
              )}
              {verificationStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                  status:{verificationStatus}
                  <button onClick={() => setVerificationStatus('all')}><X size={12} /></button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-teal-600 hover:text-teal-800 text-[11px] font-mono font-semibold underline ml-1"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Results Counter & Density Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <p>
            INDEXED FACILITIES: <strong className="text-slate-900">{companies.length}</strong> DISPLAYED / <strong className="text-slate-900">{totalCount}</strong> TOTAL
          </p>
          <span className="text-[11px] text-slate-400">Click row or profile button to open technical audit dossier</span>
        </div>

        {/* RESULTS: DENSE DATA TABLE OR SPEC GRID */}
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw size={24} className="animate-spin mx-auto text-teal-600 mb-2" />
            <p className="text-xs font-mono text-slate-500">Querying verified semiconductor registry...</p>
          </div>
        ) : companies.length > 0 ? (
          viewMode === 'table' ? (
            /* High-Density SaaS Matrix Table */
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Enterprise / Facility</th>
                      <th className="px-4 py-3 font-semibold">Vertical Category</th>
                      <th className="px-4 py-3 font-semibold">Key Technical Capabilities</th>
                      <th className="px-4 py-3 font-semibold">Quality Standards</th>
                      <th className="px-4 py-3 font-semibold">Location</th>
                      <th className="px-4 py-3 font-semibold">Provenance</th>
                      <th className="px-4 py-3 font-semibold text-right">Dossier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {companies.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCompany(c)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900 hover:text-teal-600 transition-colors">{c.name}</p>
                          <span className="text-[10px] font-mono text-slate-400">{c.companyType}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">
                          {c.category?.name || c.companyType}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-xs font-mono text-[10px]">
                            {c.capabilities?.slice(0, 2).map((cap) => (
                              <span key={cap.id} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                {cap.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-500">
                          {c.certifications?.map((cert) => cert.name).slice(0, 2).join(', ') || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {c.hqCity}, {c.hqCountry}
                        </td>
                        <td className="px-4 py-3">
                          <VerificationBadge status={c.verificationStatus} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCompany(c);
                            }}
                            className="px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold"
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
          ) : (
            /* Technical Spec Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onViewDetails={(c) => setSelectedCompany(c)}
                  onSaveToggle={(c) => setSelectedCompany(c)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <Building2 size={36} className="text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Facilities Found Matching Query</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try adjusting your query parameters, broadening node filters, or clearing specific constraints.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-500 transition-colors"
            >
              Reset Query Parameters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pt-4 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-mono text-slate-600 px-3">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      {/* Technical Detail Modal */}
      <CompanyDetailModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onSaveUpdated={() => fetchCompanies()}
      />

      {/* Save Search Modal */}
      {saveSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-1">Save Registry Query</h3>
            <p className="text-xs text-slate-500 mb-4">
              Store this query to re-execute regular supply-chain scans and monitor ecosystem additions.
            </p>

            {saveSearchSuccess && (
              <p className="text-xs text-teal-600 font-semibold mb-3">Query saved to your dashboard!</p>
            )}

            <form onSubmit={handleSaveSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Query Label</label>
                <input
                  type="text"
                  required
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g. 28nm Wafer Foundries & OSAT Packaging"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSaveSearchOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                >
                  Save Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
