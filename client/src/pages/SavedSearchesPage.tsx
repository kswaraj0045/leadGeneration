import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Play, Trash2, Calendar, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { SavedSearch } from '../types';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Saved Searches & Recent Activity
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Re-run complex multi-facet discovery queries with a single click and review recent organization query patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Saved Queries */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
              Named Saved Searches
            </h2>

            {loading ? (
              <div className="py-10 text-center">
                <RefreshCw size={20} className="animate-spin mx-auto text-teal-600 mb-2" />
                <p className="text-xs text-slate-500">Loading saved queries...</p>
              </div>
            ) : savedSearches.length > 0 ? (
              <div className="space-y-3">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{search.name}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Filters: {JSON.stringify((search as any).queryParams)}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-1">
                        <Calendar size={11} />
                        Saved on {new Date(search.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => rerunSearch((search as any).queryParams)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <Play size={12} />
                        <span>Run Search</span>
                      </button>
                      <button
                        onClick={() => handleDelete(search.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete search"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <Search size={28} className="text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">No saved searches yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Save your filters on the Discovery page using the "Save Search Query" button.
                </p>
              </div>
            )}
          </div>

          {/* Search History */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
              Recent Discovery Log
            </h2>

            {history.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
                {history.map((h) => (
                  <div key={h.id} className="p-3">
                    <p className="font-semibold text-slate-800">{h.queryText || 'Ecosystem Filter'}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
                      <span>{h.user?.fullName}</span>
                      <span>{new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                No recent activity logged.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
