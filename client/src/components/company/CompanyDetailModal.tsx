import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Calendar,
  Users,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  HelpCircle,
} from 'lucide-react';
import { Company, PipelineStage } from '../../types';
import { VerificationBadge, StageBadge } from '../common/Badge';
import api from '../../services/api';

interface CompanyDetailModalProps {
  company: Company | null;
  onClose: () => void;
  onSaveUpdated?: () => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ company, onClose, onSaveUpdated }) => {
  if (!company) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'capabilities' | 'products' | 'certifications' | 'pipeline'>('overview');
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStage>(
    (company as any).savedDetails?.status || 'EVALUATING'
  );
  const [pipelineNotes, setPipelineNotes] = useState((company as any).savedDetails?.notes || '');
  const [pipelineTags, setPipelineTags] = useState((company as any).savedDetails?.tags || '');
  const [savingPipeline, setSavingPipeline] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSaveToPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPipeline(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await api.post('/saved', {
        companyId: company.id,
        status: pipelineStatus,
        notes: pipelineNotes,
        tags: pipelineTags,
      });
      setSaveSuccess(true);
      if (onSaveUpdated) onSaveUpdated();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save company to pipeline.');
    } finally {
      setSavingPipeline(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono">
                {company.category?.name || company.companyType}
              </span>
              <VerificationBadge status={company.verificationStatus} />
              {company.isDemonstration && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Demo Record
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{company.name}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-slate-400" />
                {company.hqCity}, {company.hqState ? `${company.hqState}, ` : ''}{company.hqCountry}
              </span>
              {company.yearEstablished && (
                <span className="flex items-center gap-1 font-mono">
                  <Calendar size={13} className="text-slate-400" />
                  Est. {company.yearEstablished}
                </span>
              )}
              {company.employeeCountRange && (
                <span className="flex items-center gap-1">
                  <Users size={13} className="text-slate-400" />
                  {company.employeeCountRange} Employees
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex space-x-6 text-xs font-medium bg-white">
          {[
            { id: 'overview', label: 'Company Overview' },
            { id: 'capabilities', label: `Technical Specs (${company.capabilities?.length || 0})` },
            { id: 'products', label: `Products & Services (${(company.products?.length || 0) + (company.services?.length || 0)})` },
            { id: 'certifications', label: `Quality & Standards (${company.certifications?.length || 0})` },
            { id: 'pipeline', label: 'Sourcing Workspace' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Business Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {company.description}
                </p>
              </div>

              {/* Data Verification & Source Audit Card */}
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-teal-900">
                  <ShieldCheck size={16} className="text-teal-600" />
                  <span>Verification & Data Provenance</span>
                </div>
                <p className="text-teal-800">
                  <strong>Verification Status:</strong> {company.verificationStatus}
                  {company.verificationNotes && ` — ${company.verificationNotes}`}
                </p>
                <p className="text-teal-700 font-mono text-[11px]">
                  <strong>Primary Data Source:</strong> {company.dataSource}
                </p>
              </div>

              {/* Contact & Corporate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Official Website</span>
                  <div className="font-medium text-slate-800 flex items-center gap-1.5">
                    <Globe size={14} className="text-slate-400" />
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">
                        {company.website}
                      </a>
                    ) : (
                      <span className="text-slate-400">Unavailable</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Public Contact Email</span>
                  <div className="font-medium text-slate-800 flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" />
                    {company.contactEmail ? (
                      <a href={`mailto:${company.contactEmail}`} className="text-teal-600 hover:underline">
                        {company.contactEmail}
                      </a>
                    ) : (
                      <span className="text-slate-400">Unavailable</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Direct Phone Line</span>
                  <div className="font-medium text-slate-800 flex items-center gap-1.5">
                    <Phone size={14} className="text-slate-400" />
                    <span>{company.contactPhone || 'Unavailable'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Revenue Bracket</span>
                  <div className="font-medium text-slate-800 font-mono">
                    {company.revenueRange || 'Private / Undisclosed'}
                  </div>
                </div>
              </div>

              {/* Industries Served */}
              {company.industriesServed && company.industriesServed.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Market Sectors Served
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {company.industriesServed.map((ind) => (
                      <span key={ind.id} className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
                        {ind.industryName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CAPABILITIES TAB */}
          {activeTab === 'capabilities' && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Manufacturing & Technical Specifications
              </h4>
              {company.capabilities && company.capabilities.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {company.capabilities.map((cap) => (
                    <div key={cap.id} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-teal-500/50 transition-colors flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Cpu size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-bold text-slate-900">{cap.name}</h5>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {cap.capabilityType}
                          </span>
                        </div>
                        {cap.specifications && (
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed font-mono">
                            {cap.specifications}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No specific technical capabilities published yet.</p>
              )}
            </div>
          )}

          {/* PRODUCTS & SERVICES TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Products */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Manufactured Products & Silicon Components
                </h4>
                {company.products && company.products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {company.products.map((p) => (
                      <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-900">{p.name}</h5>
                          {p.category && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {p.category}
                            </span>
                          )}
                        </div>
                        {p.description && (
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{p.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No products listed.</p>
                )}
              </div>

              {/* Services */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Engineering & Turnkey Manufacturing Services
                </h4>
                {company.services && company.services.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {company.services.map((s) => (
                      <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-900">{s.name}</h5>
                          {s.capabilityLevel && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-50 text-teal-700">
                              {s.capabilityLevel}
                            </span>
                          )}
                        </div>
                        {s.description && (
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{s.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No services listed.</p>
                )}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS TAB */}
          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Quality Certifications & Industry Standard Compliance
              </h4>
              {company.certifications && company.certifications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.certifications.map((cert) => (
                    <div key={cert.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Award size={18} />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{cert.name}</h5>
                        {cert.issuingBody && (
                          <p className="text-xs text-slate-500 mt-0.5">Audited by: {cert.issuingBody}</p>
                        )}
                        {cert.validUntil && (
                          <p className="text-[11px] font-mono text-slate-400 mt-1">Valid until: {cert.validUntil}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No formal certifications listed.</p>
              )}
            </div>
          )}

          {/* PIPELINE / WORKSPACE TAB */}
          {activeTab === 'pipeline' && (
            <form onSubmit={handleSaveToPipeline} className="space-y-4 max-w-lg">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-semibold text-slate-800">Sourcing Pipeline:</span> Save this company to your organization's private supplier pipeline to track evaluations, add private engineering notes, and categorize potential partners.
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Company saved to your organization workspace!</span>
                </div>
              )}

              {saveError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{saveError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Pipeline Stage
                </label>
                <select
                  value={pipelineStatus}
                  onChange={(e) => setPipelineStatus(e.target.value as PipelineStage)}
                  className="block w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="EVALUATING">Evaluating</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="PARTNER">Partner</option>
                  <option value="SUPPLIER">Approved Supplier</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={pipelineTags}
                  onChange={(e) => setPipelineTags(e.target.value)}
                  placeholder="e.g. 28nm, MPW Shuttle, QFN, High Priority"
                  className="block w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Private Organization Notes
                </label>
                <textarea
                  rows={4}
                  value={pipelineNotes}
                  onChange={(e) => setPipelineNotes(e.target.value)}
                  placeholder="Record discussions, capability evaluation feedback, NDA status, or pricing estimates..."
                  className="block w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingPipeline}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-all shadow-sm shadow-teal-500/20 disabled:opacity-50"
              >
                <Bookmark size={15} />
                <span>{savingPipeline ? 'Saving...' : 'Save to Pipeline'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Record ID: {company.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
