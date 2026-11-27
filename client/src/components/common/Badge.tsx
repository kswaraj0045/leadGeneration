import React from 'react';
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { VerificationStatus, SubscriptionPlanCode } from '../../types';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  const iconSize = isSm ? 12 : 13;

  if (status === 'VERIFIED') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5] ${padding}`}
        title="Verified Enterprise Facility"
      >
        <ShieldCheck size={iconSize} className="text-[#12B76A]" />
        <span>Verified</span>
      </span>
    );
  }

  if (status === 'CLAIMED') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89] ${padding}`}
        title="Claimed by company, audit pending"
      >
        <Clock size={iconSize} className="text-[#F79009]" />
        <span>Claimed</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#F2F4F7] text-[#475467] border border-[#EAECF0] ${padding}`}
      title="Unverified Directory Submission"
    >
      <AlertCircle size={iconSize} className="text-[#98A2B3]" />
      <span>Unverified</span>
    </span>
  );
};

export const PlanBadge: React.FC<{ plan: SubscriptionPlanCode }> = ({ plan }) => {
  const styles: Record<SubscriptionPlanCode, string> = {
    BASIC: 'bg-[#F2F4F7] text-[#344054] border-[#EAECF0]',
    PRO: 'bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]',
    ENTERPRISE: 'bg-saas-accent-subtle text-saas-accent border-saas-accent-border font-semibold',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded border ${styles[plan] || styles.BASIC}`}>
      {plan}
    </span>
  );
};

export const StageBadge: React.FC<{ stage: string; size?: 'sm' | 'md' }> = ({ stage }) => {
  const styles: Record<string, string> = {
    IDENTIFIED: 'bg-slate-100 text-slate-700 border-slate-200',
    EVALUATING: 'bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]',
    CONTACTED: 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]',
    PARTNER: 'bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5] font-semibold',
    SUPPLIER: 'bg-[#F9F5FF] text-[#6941C6] border-[#E9D7FE] font-semibold',
    APPROVED: 'bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5] font-semibold',
    DISQUALIFIED: 'bg-red-50 text-red-700 border-red-200',
    ARCHIVED: 'bg-[#F2F4F7] text-[#475467] border-[#EAECF0]',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded border ${styles[stage] || styles.EVALUATING}`}>
      {stage}
    </span>
  );
};
