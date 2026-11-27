import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  MapPin,
  ExternalLink,
  Trash2,
  Edit3,
  Download,
  Building2,
  FileSpreadsheet,
  Check,
  Tag,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import { SavedCompany, PipelineStage } from '../types';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { VerificationBadge, StageBadge } from '../components/common/Badge';

export const SavedWorkspacePage: React.FC = () => {
  const [savedList, setSavedList] = useState<SavedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<PipelineStage>('EVALUATING');
  const [editTags, setEditTags] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
      const res = await api.get('/saved', { params });
      if (res.data?.success) {
        setSavedList(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching saved companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [statusFilter]);

  const handleStartEdit = (saved: SavedCompany) => {
    setEditingId(saved.id);
    setEditNotes(saved.notes || '');
    setEditStatus(saved.status);
    setEditTags(saved.tags || '');
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.patch(`/saved/${id}`, {
        status: editStatus,
        notes: editNotes,
        tags: editTags,
      });
      setEditingId(null);
      fetchSaved();
    } catch (err: any) {
      alert(err.message || 'Failed to update record.');
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Remove this company from your organization workspace?')) return;
    try {
      await api.delete(`/saved/${id}`);
      fetchSaved();
    } catch (err: any) {
      alert(err.message || 'Failed to remove company.');
    }
  };

  const handleExport = async (format: 'CSV' | 'EXCEL') => {
    setExporting(true);
    try {
      const response = await api.post(
        `/export/saved?format=${format}`,
        {},
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `viaset_saved_partners_${format.toLowerCase()}.${format === 'EXCEL' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert(err.message || 'Failed to export saved list.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Supplier & Partner Pipeline
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Private organization workspace to organize candidate suppliers, add engineering notes, and track relationship lifecycle.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('CSV')}
              disabled={exporting || savedList.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('EXCEL')}
              disabled={exporting || savedList.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet size={14} className="text-teal-600" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Pipeline Stage Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['ALL', 'EVALUATING', 'CONTACTED', 'PARTNER', 'SUPPLIER', 'ARCHIVED'].map((stage) => (
            <button
              key={stage}
              onClick={() => setStatusFilter(stage)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === stage
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        {/* Saved Companies List */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw size={24} className="animate-spin mx-auto text-teal-600 mb-2" />
            <p className="text-xs text-slate-500">Loading saved pipeline records...</p>
          </div>
        ) : savedList.length > 0 ? (
          <div className="space-y-4">
            {savedList.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StageBadge stage={item.status} />
                        <span className="text-xs font-mono text-slate-400">
                          {item.company.category?.name || item.company.companyType}
                        </span>
                        <VerificationBadge status={item.company.verificationStatus} size="sm" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{item.company.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={13} className="text-slate-400" />
                        {item.company.hqCity}, {item.company.hqCountry}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-red-600 text-xs"
                        title="Remove from saved workspace"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Inline Edit Form */}
                  {isEditing ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Pipeline Stage</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as PipelineStage)}
                            className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs"
                          >
                            <option value="EVALUATING">Evaluating</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="PARTNER">Partner</option>
                            <option value="SUPPLIER">Approved Supplier</option>
                            <option value="ARCHIVED">Archived</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Custom Tags</label>
                          <input
                            type="text"
                            value={editTags}
                            onChange={(e) => setEditTags(e.target.value)}
                            placeholder="e.g. 28nm, High Priority"
                            className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Private Notes</label>
                        <textarea
                          rows={3}
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded-md border border-slate-300 text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-4 py-1 rounded-md bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {item.notes && (
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 font-sans">
                          <span className="font-semibold text-slate-500 block text-[10px] uppercase mb-0.5">
                            Private Notes:
                          </span>
                          {item.notes}
                        </div>
                      )}

                      {item.tags && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.tags.split(',').map((t, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-mono">
                              <Tag size={10} className="text-slate-400" />
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Saved by: {item.user?.fullName || 'Organization Member'}</span>
                    <span>Last updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Bookmark size={36} className="text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">Your pipeline is empty</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Explore companies in the Discovery tab or Matching Engine and save promising suppliers to build your sourcing pipeline.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
