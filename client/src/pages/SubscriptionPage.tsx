import React, { useState, useEffect } from 'react';
import { Check, Shield, Zap, Sparkles, Building2 } from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlanBadge } from '../components/common/Badge';

export const SubscriptionPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>('BASIC');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user?.organization?.planCode) {
      setCurrentPlan(user.organization.planCode);
    }
  }, [user]);

  const plans = [
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 text-xs font-mono uppercase tracking-wider mb-2">
            <Zap size={14} className="text-teal-600" />
            <span>Configurable Tiered SaaS Access</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Subscription & Usage Quotas
          </h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Choose the subscription tier that aligns with your organization's semiconductor supply-chain discovery and sourcing volume. (Academic Demo: Instant Simulated Switch)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p) => (
            <div
              key={p.code}
              className={`bg-white rounded-2xl p-8 border flex flex-col justify-between transition-all relative ${
                p.popular
                  ? 'border-teal-500 shadow-xl ring-2 ring-teal-500/20'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-teal-600 text-white font-mono text-[10px] font-bold tracking-widest uppercase">
                  Most Popular for Sourcing
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                  <PlanBadge plan={p.code as any} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{p.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">{p.price}</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check size={14} className="text-teal-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                {p.current ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-500 font-semibold text-xs border border-slate-200"
                  >
                    Active Organization Plan
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleSimulatePlanSwitch(p.code)}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors shadow-sm"
                  >
                    Switch to {p.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
