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
  Clock,
  Layers,
  Cpu,
} from 'lucide-react';
import api from '../services/api';
import { SavedCompany, PipelineStage } from '../types';
import { AppLayout } from '../components/layout/AppLayout';
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
      alert(err.message || 'Failed to update pipeline stage.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove company from your supplier pipeline?')) return;
    try {
      await api.delete(`/saved/${id}`);
      fetchSaved();
    } catch (err: any) {
      alert(err.message || 'Failed to remove saved company.');
    }
  };

  const handleExport = async (format: 'CSV' | 'EXCEL') => {
    if (savedList.length === 0) return;
    setExporting(true);
    try {
      const res = await api.post(
        `/export/companies?format=${format}`,
        { companyIds: savedList.map((s) => s.companyId) },
        { responseType: 'blob' }
      );
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sourcing_pipeline_${format.toLowerCase()}.${format === 'EXCEL' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert(err.message || 'Export failed.');
    } finally {
      setExporting(false);
    }
  };

  const stages: { label: string; value: string }[] = [
    { label: 'All Pipeline Suppliers', value: 'ALL' },
    { label: 'Identified', value: 'IDENTIFIED' },
    { label: 'Contacted', value: 'CONTACTED' },
    { label: 'Evaluating', value: 'EVALUATING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Disqualified', value: 'DISQUALIFIED' },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-saas-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                Vendor Management System
              </span>
              <span className="text-xs font-mono text-saas-secondary">• {savedList.length} Tracked Suppliers</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-saas-primary">
              Supplier Sourcing Pipeline
            </h1>
            <p className="text-xs text-saas-secondary mt-0.5">
              Manage qualification status, internal engineering audit notes, and engagement workflows for shortlisted suppliers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('CSV')}
              disabled={exporting || savedList.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-saas-primary text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('EXCEL')}
              disabled={exporting || savedList.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-saas-primary text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={13} />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* STAGE TABS */}
        <div className="flex flex-wrap gap-1.5 bg-white p-2 rounded-xl border border-saas-border">
          {stages.map((st) => (
            <button
              key={st.value}
              onClick={() => setStatusFilter(st.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st.value
                  ? 'bg-saas-primary text-white shadow-xs'
                  : 'bg-white text-saas-secondary hover:text-saas-primary hover:bg-slate-50'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* PIPELINE LIST */}
        {loading ? (
          <div className="bg-white rounded-xl border border-saas-border p-12 text-center">
            <RefreshCw size={24} className="animate-spin text-saas-accent mx-auto mb-2" />
            <p className="text-xs text-saas-secondary">Loading pipeline suppliers...</p>
          </div>
        ) : savedList.length > 0 ? (
          <div className="space-y-4">
            {savedList.map((item) => {
              const isEditing = editingId === item.id;
              const company = item.company;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-saas-border p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-saas-primary">
                          {company.name}
                        </h3>
                        <VerificationBadge status={company.verificationStatus} size="sm" />
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {company.category?.name || company.companyType}
                        </span>
                        <StageBadge stage={item.status} size="sm" />
                      </div>

                      <div className="flex items-center gap-3 text-xs text-saas-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          {company.hqCity}, {company.hqCountry}
                        </span>
                        {company.yearEstablished && (
                          <span>Est. {company.yearEstablished}</span>
                        )}
                        {item.user && (
                          <span className="text-[11px] font-mono text-slate-400">
                            Saved by: {item.user.fullName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-saas-secondary max-w-3xl leading-relaxed">
                        {company.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => (isEditing ? setEditingId(null) : handleStartEdit(item))}
                        className="px-2.5 py-1.5 rounded-lg border border-saas-border hover:bg-slate-50 text-xs font-semibold text-saas-primary flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 size={13} className="text-saas-secondary" />
                        <span>{isEditing ? 'Cancel Edit' : 'Edit Stage / Notes'}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove from pipeline"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* INLINE EDIT FORM */}
                  {isEditing ? (
                    <div className="pt-4 border-t border-saas-border bg-slate-50/70 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-saas-primary mb-1">
                            Pipeline Qualification Stage
                          </label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as PipelineStage)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-saas-border rounded-lg font-mono focus:outline-none focus:border-saas-accent"
                          >
                            <option value="IDENTIFIED">IDENTIFIED (Initial Shortlist)</option>
                            <option value="CONTACTED">CONTACTED (RFI / NDA Sent)</option>
                            <option value="EVALUATING">EVALUATING (Audit / Spec Review)</option>
                            <option value="APPROVED">APPROVED (Qualified Vendor List)</option>
                            <option value="DISQUALIFIED">DISQUALIFIED (Does Not Meet Specs)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-saas-primary mb-1">
                            Internal Project Tags (Comma Separated)
                          </label>
                          <input
                            type="text"
                            value={editTags}
                            onChange={(e) => setEditTags(e.target.value)}
                            placeholder="e.g. Project-Avionics, Q3-Delivery, Automotive-BMS"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-saas-border rounded-lg focus:outline-none focus:border-saas-accent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-saas-primary mb-1">
                          Engineering Audit & Negotiation Notes
                        </label>
                        <textarea
                          rows={3}
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Document NDA status, sample evaluations, lead time quotes, or yield test notes..."
                          className="w-full px-3 py-2 text-xs bg-white border border-saas-border rounded-lg focus:outline-none focus:border-saas-accent resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-lg border border-saas-border text-xs text-saas-secondary hover:bg-slate-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-4 py-1.5 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={13} />
                          Save Pipeline State
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* NOTES & TAGS PREVIEW */
                    (item.notes || item.tags) && (
                      <div className="pt-3 border-t border-saas-border flex flex-col md:flex-row md:items-center justify-between text-xs gap-2">
                        {item.notes && (
                          <div className="text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-saas-border max-w-2xl font-mono text-[11px]">
                            <strong>Audit Notes:</strong> {item.notes}
                          </div>
                        )}
                        {item.tags && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.split(',').map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                <Tag size={10} className="text-teal-600" />
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-saas-border p-12 text-center max-w-lg mx-auto">
            <Bookmark size={36} className="text-saas-accent mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold text-saas-primary">No Suppliers in Pipeline</h3>
            <p className="text-xs text-saas-secondary mt-1 mb-4">
              Explore the Registry Matrix or run the Matching Engine to shortlist and track qualified semiconductor partners.
            </p>
            <a
              href="/app/discovery"
              className="inline-block px-4 py-2 rounded-lg bg-saas-accent text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
            >
              Discover Suppliers
            </a>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
