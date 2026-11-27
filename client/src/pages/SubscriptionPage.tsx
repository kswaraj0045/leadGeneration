import React, { useState, useEffect } from 'react';
import { Check, Shield, Zap, Sparkles, Building2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { PlanBadge } from '../components/common/Badge';
import { SubscriptionPlanCode } from '../types';

export const SubscriptionPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>('BASIC');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user?.organization?.planCode) {
      setCurrentPlan(user.organization.planCode);
    }
  }, [user]);

  const plans: {
    code: SubscriptionPlanCode;
    name: string;
    price: string;
    description: string;
    features: string[];
    popular?: boolean;
    current: boolean;
  }[] = [
    {
      code: 'BASIC',
      name: 'Basic Starter',
      price: 'Free',
      description: 'Ideal for engineering students and academic researchers exploring the semiconductor ecosystem.',
      features: [
        '50 Monthly Company Searches',
        '25 Saved Pipeline Companies',
        '5 CSV Exports / Month',
        'Standard Industry Filters',
        'Basic Matching Heuristics',
      ],
      current: currentPlan === 'BASIC',
    },
    {
      code: 'PRO',
      name: 'Professional Tier',
      price: '₹499 / month',
      description: 'Purpose-built for semiconductor startups, fabless design teams, and procurement engineers.',
      features: [
        '500 Monthly Company Searches',
        '200 Saved Pipeline Companies',
        '50 Full Excel & CSV Exports',
        'Advanced Process Node & Cleanroom Filters',
        'Custom Heuristic Weight Adjustments',
        'Priority Supplier Ingestion',
      ],
      popular: true,
      current: currentPlan === 'PRO',
    },
    {
      code: 'ENTERPRISE',
      name: 'Enterprise Intelligence',
      price: '₹1,499 / month',
      description: 'Designed for tier-1 OEMs, foundries, and multi-user procurement divisions.',
      features: [
        '5,000 Monthly Searches',
        '2,000 Saved Pipeline Companies',
        '500 Full Excel & CSV Exports',
        'Multi-User Team Management',
        'Custom Data Ingestion API',
        'Dedicated Verification Specialist',
      ],
      current: currentPlan === 'ENTERPRISE',
    },
  ];

  const handleSimulatePlanSwitch = async (planCode: string) => {
    if (!user?.organizationId) return;
    setUpdating(true);
    try {
      await api.patch(`/admin/organizations/${user.organizationId}/plan`, { planCode });
      setCurrentPlan(planCode);
      await refreshProfile();
      alert(`Organization subscription updated to ${planCode} (simulated payment)!`);
    } catch (err: any) {
      alert(err.message || 'Error updating plan.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
            <Zap size={14} className="text-teal-600" />
            <span>Configurable Tiered SaaS Access</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-saas-primary">
            Subscription & Usage Quotas
          </h1>
          <p className="text-xs text-saas-secondary mt-2 leading-relaxed">
            Choose the subscription tier that aligns with your organization's semiconductor supply-chain discovery and sourcing volume. (Academic Demo: Instant Simulated Switch)
          </p>
        </div>

        {/* 3 TIERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.code}
              className={`rounded-2xl p-6 transition-all flex flex-col justify-between ${
                p.popular
                  ? 'bg-white border-2 border-saas-accent shadow-md relative'
                  : 'bg-white border border-saas-border shadow-xs'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-saas-accent text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Most Popular for Engineering
                </span>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-saas-primary">{p.name}</h3>
                    <p className="text-xs text-saas-secondary mt-1">{p.description}</p>
                  </div>
                  {p.current && <PlanBadge plan={p.code} />}
                </div>

                <div className="mb-6 pb-6 border-b border-saas-border">
                  <span className="text-3xl font-extrabold text-saas-primary">{p.price}</span>
                  {p.code !== 'BASIC' && <span className="text-xs text-saas-secondary font-mono"> / billed monthly</span>}
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-saas-secondary">
                    Included Platform Quotas:
                  </p>
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-saas-primary">
                      <Check size={14} className="text-saas-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {p.current ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-500 font-semibold text-xs border border-slate-200 cursor-not-allowed"
                  >
                    Active Organization Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSimulatePlanSwitch(p.code)}
                    disabled={updating}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-xs cursor-pointer ${
                      p.popular
                        ? 'bg-saas-accent hover:bg-teal-700 text-white'
                        : 'bg-saas-primary hover:bg-slate-800 text-white'
                    }`}
                  >
                    {updating ? 'Switching...' : `Switch to ${p.name}`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
