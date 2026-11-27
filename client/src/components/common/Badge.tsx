import React from 'react';
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { VerificationStatus, SubscriptionPlanCode } from '../../types';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const iconSize = isSm ? 12 : 14;

  if (status === 'VERIFIED') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-teal-50 text-teal-700 border border-teal-200/80 ${padding}`}
        title="Verified Enterprise Record"
      >
        <ShieldCheck size={iconSize} className="text-teal-600" />
        <span>Verified</span>
      </span>
    );
  }

  if (status === 'CLAIMED') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${padding}`}
        title="Claimed by company representative, audit pending"
      >
        <Clock size={iconSize} className="text-amber-600" />
        <span>Claimed</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${padding}`}
      title="Unverified Directory Submission"
    >
      <AlertCircle size={iconSize} className="text-slate-400" />
      <span>Unverified</span>
    </span>
  );
};

export const PlanBadge: React.FC<{ plan: SubscriptionPlanCode }> = ({ plan }) => {
  const colors = {
    BASIC: 'bg-slate-100 text-slate-700 border-slate-200',
    PRO: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    ENTERPRISE: 'bg-teal-50 text-teal-800 border-teal-300 font-semibold',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] uppercase tracking-wider rounded border ${colors[plan] || colors.BASIC}`}>
      {plan}
    </span>
  );
};

export const StageBadge: React.FC<{ stage: string }> = ({ stage }) => {
  const colors: Record<string, string> = {
    EVALUATING: 'bg-blue-50 text-blue-700 border-blue-200',
    CONTACTED: 'bg-amber-50 text-amber-700 border-amber-200',
    PARTNER: 'bg-teal-50 text-teal-700 border-teal-200 font-medium',
    SUPPLIER: 'bg-purple-50 text-purple-700 border-purple-200 font-medium',
    ARCHIVED: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded border ${colors[stage] || colors.EVALUATING}`}>
      {stage}
    </span>
  );
};
