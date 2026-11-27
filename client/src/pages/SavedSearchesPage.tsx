import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Play, Trash2, Calendar, RefreshCw, Bookmark, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { SavedSearch } from '../types';
import { AppLayout } from '../components/layout/AppLayout';

export const SavedSearchesPage: React.FC = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [savedRes, historyRes] = await Promise.all([
        api.get('/searches/saved'),
        api.get('/searches/history'),
      ]);
      if (savedRes.data?.success) setSavedSearches(savedRes.data.data);
      if (historyRes.data?.success) setHistory(historyRes.data.data);
    } catch (err) {
      console.error('Error fetching search history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this saved search?')) return;
    try {
      await api.delete(`/searches/saved/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete saved search.');
    }
  };

  const rerunSearch = (queryParams: any) => {
    const params = new URLSearchParams();
    if (queryParams.q) params.set('q', queryParams.q);
    if (queryParams.category && queryParams.category !== 'all') params.set('category', queryParams.category);
    if (queryParams.companyType && queryParams.companyType !== 'all') params.set('companyType', queryParams.companyType);
    if (queryParams.country && queryParams.country !== 'all') params.set('country', queryParams.country);
    if (queryParams.verificationStatus && queryParams.verificationStatus !== 'all') params.set('verificationStatus', queryParams.verificationStatus);

    navigate(`/app/discovery?${params.toString()}`);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-saas-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                Query Management
              </span>
              <span className="text-xs font-mono text-saas-secondary">• {savedSearches.length} Saved Scans</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-saas-primary">
              Saved Queries & Search History
            </h1>
            <p className="text-xs text-saas-secondary mt-0.5">
              Re-execute complex multi-facet parametric searches and review historical supply-chain audit logs.
            </p>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: SAVED SEARCHES & RECENT AUDIT LOGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SAVED SEARCHES */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-saas-primary flex items-center gap-2">
              <Bookmark size={14} className="text-saas-accent" />
              Saved Parameter Queries ({savedSearches.length})
            </h2>

            {loading ? (
              <div className="bg-white rounded-xl border border-saas-border p-8 text-center">
                <RefreshCw size={20} className="animate-spin text-saas-accent mx-auto mb-2" />
                <p className="text-xs text-saas-secondary">Loading saved queries...</p>
              </div>
            ) : savedSearches.length > 0 ? (
              <div className="space-y-3">
                {savedSearches.map((s) => {
                  const qParams = s.queryParamsJson ? JSON.parse(s.queryParamsJson) : (s as any).queryParams || {};
                  return (
                    <div
                      key={s.id}
                      className="bg-white rounded-xl border border-saas-border p-4 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-saas-primary">{s.name}</h3>
                        <div className="flex flex-wrap gap-1 text-[10px] font-mono text-saas-secondary">
                          {qParams.q && <span className="bg-slate-100 px-1.5 py-0.5 rounded">q: {qParams.q}</span>}
                          {qParams.category && qParams.category !== 'all' && (
                            <span className="bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded border border-teal-200">
                              cat: {qParams.category}
                            </span>
                          )}
                          {qParams.country && qParams.country !== 'all' && (
                            <span className="bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200">
                              country: {qParams.country}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => rerunSearch(qParams)}
                          className="px-3 py-1.5 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Execute</span>
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete query"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-saas-border p-8 text-center">
                <p className="text-xs text-saas-secondary">
                  No saved queries yet. Use the "Save Query" button on the Company Discovery page to store frequent searches.
                </p>
              </div>
            )}
          </div>

          {/* AUDIT LOG / RECENT HISTORY */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-saas-primary flex items-center gap-2">
              <History size={14} className="text-indigo-600" />
              Recent Execution Telemetry ({history.length})
            </h2>

            {loading ? (
              <div className="bg-white rounded-xl border border-saas-border p-8 text-center">
                <RefreshCw size={20} className="animate-spin text-saas-accent mx-auto mb-2" />
                <p className="text-xs text-saas-secondary">Loading search logs...</p>
              </div>
            ) : history.length > 0 ? (
              <div className="bg-white rounded-xl border border-saas-border divide-y divide-saas-border shadow-xs overflow-hidden">
                {history.slice(0, 10).map((h) => (
                  <div key={h.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div>
                      <div className="font-semibold text-saas-primary">
                        {h.searchQuery || 'Parametric Facet Query'}
                      </div>
                      <div className="text-[10px] text-saas-secondary font-mono">
                        {new Date(h.createdAt).toLocaleString()} • {h.resultsCount} hits returned
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        rerunSearch(typeof h.filters === 'string' ? JSON.parse(h.filters) : h.filters || {})
                      }
                      className="text-xs text-saas-accent hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      Re-run <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-saas-border p-8 text-center">
                <p className="text-xs text-saas-secondary">No execution telemetry logged yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
