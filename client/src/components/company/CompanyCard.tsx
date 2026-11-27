import React from 'react';
import { Building2, MapPin, Globe, Bookmark, ExternalLink, Cpu, CheckCircle2, ChevronRight, Layers, Award } from 'lucide-react';
import { Company } from '../../types';
import { VerificationBadge, StageBadge } from '../common/Badge';

interface CompanyCardProps {
  company: Company;
  onViewDetails: (company: Company) => void;
  onSaveToggle?: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onViewDetails, onSaveToggle }) => {
  const isSaved = (company as any).isSaved;
  const savedStatus = (company as any).savedStatus;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-500/50 transition-all flex flex-col justify-between p-5 group">
      <div>
        {/* Header: Category & Badges */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded">
              {company.category?.name || company.companyType}
            </span>
            <span className="text-[11px] text-slate-500 font-mono px-1.5 py-0.5 rounded bg-slate-100">
              {company.companyType}
            </span>
          </div>
          <VerificationBadge status={company.verificationStatus} size="sm" />
        </div>

        {/* Company Title */}
        <h3
          onClick={() => onViewDetails(company)}
          className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors cursor-pointer mt-1 line-clamp-1"
          title={company.name}
        >
          {company.name}
        </h3>

        {/* Location & Established */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate max-w-[180px]">{company.hqCity}, {company.hqCountry}</span>
          </span>
          {company.yearEstablished && (
            <span className="text-slate-400 font-mono text-[11px]">Est. {company.yearEstablished}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {company.description}
        </p>

        {/* Key Capabilities Preview */}
        {company.capabilities && company.capabilities.length > 0 && (
          <div className="mb-3 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Services & Capabilities:
            </p>
            <div className="flex flex-wrap gap-1">
              {company.capabilities.slice(0, 3).map((cap) => (
                <span
                  key={cap.id}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200/60"
                  title={cap.specifications || cap.name}
                >
                  <Cpu size={10} className="text-teal-600" />
                  <span className="truncate max-w-[140px]">{cap.name}</span>
                </span>
              ))}
              {company.capabilities.length > 3 && (
                <span className="text-[10px] text-slate-400 self-center">
                  +{company.capabilities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Certifications Preview */}
        {company.certifications && company.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-500 mb-2">
            {company.certifications.slice(0, 2).map((cert) => (
              <span key={cert.id} className="inline-flex items-center gap-1 text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                <Award size={10} className="text-indigo-500" />
                <span>{cert.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSaved && savedStatus ? (
            <StageBadge stage={savedStatus} />
          ) : (
            onSaveToggle && (
              <button
                type="button"
                onClick={() => onSaveToggle(company)}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 transition-colors p-1 rounded hover:bg-slate-50"
                title="Save to discovery pipeline"
              >
                <Bookmark size={14} />
                <span>Save</span>
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(company)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Profile</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
