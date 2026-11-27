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
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { Company, CompanyCategory } from '../types';
import { CompanyCard } from '../components/company/CompanyCard';
import { CompanyDetailModal } from '../components/company/CompanyDetailModal';
import { AppLayout } from '../components/layout/AppLayout';
import { VerificationBadge, StageBadge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

export const DiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

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
      
      let effectiveCategory = category;
      if (category !== 'all' && categories.length > 0) {
        const found = categories.find(
          (c) => c.slug.toLowerCase() === category.toLowerCase() || c.name.toLowerCase() === category.toLowerCase()
        );
        if (found) effectiveCategory = found.slug;
      }
      if (effectiveCategory !== 'all') params.category = effectiveCategory;

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
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-saas-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                Company Directory
              </span>
              <span className="text-xs font-mono text-saas-secondary">• {totalCount} Verified Companies</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-saas-primary">
              Company Discovery
            </h1>
            <p className="text-xs text-saas-secondary mt-0.5">
              Search and discover verified semiconductor manufacturers, design houses, packaging units, and electronics assembly providers.
            </p>
          </div>

          {/* ACTION TOOLBAR */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-saas-border p-0.5 bg-white">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs font-medium cursor-pointer ${
                  viewMode === 'table' ? 'bg-saas-primary text-white shadow-xs' : 'text-saas-secondary hover:text-saas-primary'
                }`}
                title="Table View"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs font-medium cursor-pointer ${
                  viewMode === 'grid' ? 'bg-saas-primary text-white shadow-xs' : 'text-saas-secondary hover:text-saas-primary'
                }`}
                title="Card View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            <button
              onClick={() => setSaveSearchOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-saas-primary text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Bookmark size={13} className="text-saas-secondary" />
              <span>Save Search</span>
            </button>

            <button
              onClick={() => handleExport('CSV')}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-saas-primary text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Download size={13} />
              <span>CSV</span>
            </button>

            <button
              onClick={() => handleExport('EXCEL')}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-saas-primary text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={13} />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER WORKBENCH */}
        <div className="bg-white rounded-xl border border-saas-border p-4 shadow-xs space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-saas-secondary" size={16} />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by company name, service, product, or location..."
                className="w-full pl-9 pr-4 py-2 bg-saas-bg border border-saas-border rounded-lg text-xs text-saas-primary placeholder:text-slate-400 focus:outline-none focus:border-saas-accent focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-saas-accent hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Filter size={14} />
              Search
            </button>
          </form>

          {/* FACET DROPDOWNS */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-saas-border text-xs">
            {/* Category */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-white border border-saas-border rounded-lg text-xs text-saas-primary focus:outline-none focus:border-saas-accent"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Type */}
            <select
              value={companyType}
              onChange={(e) => {
                setCompanyType(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-white border border-saas-border rounded-lg text-xs text-saas-primary focus:outline-none focus:border-saas-accent"
            >
              <option value="all">All Company Types</option>
              <option value="MANUFACTURER">Manufacturer</option>
              <option value="SUPPLIER">Supplier / Distributor</option>
              <option value="SERVICE_PROVIDER">Service Provider / Design House</option>
              <option value="BUYER">Buyer / OEM</option>
            </select>

            {/* Country */}
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-white border border-saas-border rounded-lg text-xs text-saas-primary focus:outline-none focus:border-saas-accent"
            >
              <option value="all">All Locations</option>
              <option value="IN">India</option>
              <option value="TW">Taiwan</option>
              <option value="US">United States</option>
              <option value="JP">Japan</option>
              <option value="AT">Austria / Europe</option>
            </select>

            {/* Verification Status */}
            <select
              value={verificationStatus}
              onChange={(e) => {
                setVerificationStatus(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-white border border-saas-border rounded-lg text-xs text-saas-primary focus:outline-none focus:border-saas-accent"
            >
              <option value="all">All Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="CLAIMED">Claimed Profiles</option>
              <option value="UNVERIFIED">Unverified</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 border border-red-200 font-medium transition-colors cursor-pointer"
              >
                <X size={12} />
                Clear Filters
              </button>
            )}

            <span className="ml-auto text-xs font-mono text-saas-secondary">
              Showing <strong>{companies.length}</strong> of <strong>{totalCount}</strong> companies
            </span>
          </div>
        </div>

        {/* RESULTS VIEWPORT */}
        {loading ? (
          <div className="bg-white rounded-xl border border-saas-border p-12 text-center">
            <RefreshCw size={24} className="animate-spin text-saas-accent mx-auto mb-2" />
            <p className="text-xs text-saas-secondary">Filtering normalized company intelligence...</p>
          </div>
        ) : companies.length > 0 ? (
          viewMode === 'table' ? (
            /* DENSE DATA MATRIX VIEW */
            <div className="bg-white rounded-xl border border-saas-border shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-saas-bg text-saas-secondary font-semibold border-b border-saas-border">
                    <tr>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Services & Capabilities</th>
                      <th className="px-4 py-3">Certifications</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-saas-border">
                    {companies.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCompany(c)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <div className="font-bold text-saas-primary hover:text-saas-accent transition-colors">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-saas-secondary truncate max-w-xs">
                            {c.description}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">
                            {c.category?.name || c.companyType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-saas-secondary">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400 shrink-0" />
                            {c.hqCity}, {c.hqCountry}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {c.capabilities?.slice(0, 2).map((cap) => (
                              <span
                                key={cap.id}
                                className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-mono border border-teal-200/60 truncate max-w-[120px]"
                                title={cap.name}
                              >
                                {cap.name}
                              </span>
                            ))}
                            {(c.capabilities?.length || 0) > 2 && (
                              <span className="text-[10px] text-saas-secondary">
                                +{(c.capabilities?.length || 0) - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {c.certifications?.slice(0, 2).map((cert) => (
                              <span
                                key={cert.id}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200"
                              >
                                {cert.name}
                              </span>
                            ))}
                          </div>
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
                            className="px-2.5 py-1 rounded border border-saas-border text-saas-primary hover:bg-slate-100 text-[11px] font-semibold cursor-pointer"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* TECHNICAL SPEC GRID */
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
          <div className="bg-white rounded-xl border border-saas-border p-12 text-center max-w-lg mx-auto">
            <Building2 size={36} className="text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-saas-primary">No Companies Found</h3>
            <p className="text-xs text-saas-secondary mt-1 mb-4">
              Try adjusting your search terms or clearing some filters to see more results.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-saas-accent text-white text-xs font-semibold hover:bg-teal-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="pt-4 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-saas-primary disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-mono text-saas-secondary px-3">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-saas-primary disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <CompanyDetailModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onSaveUpdated={() => fetchCompanies()}
      />

      {/* SAVE SEARCH MODAL */}
      {saveSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-saas-border max-w-md w-full p-6 shadow-xl animate-in fade-in">
            <h3 className="text-base font-bold text-saas-primary mb-1">Save Search</h3>
            <p className="text-xs text-saas-secondary mb-4">
              Save this search query to quickly run it again later from your workspace.
            </p>

            {saveSearchSuccess && (
              <p className="text-xs text-teal-600 font-semibold mb-3">Search saved successfully!</p>
            )}

            <form onSubmit={handleSaveSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-saas-primary mb-1">Search Name</label>
                <input
                  type="text"
                  required
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g. PCB Assembly Providers in India"
                  className="w-full px-3 py-2 border border-saas-border rounded-lg text-xs font-mono text-saas-primary focus:outline-none focus:border-saas-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSaveSearchOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-saas-border text-xs text-saas-secondary hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
