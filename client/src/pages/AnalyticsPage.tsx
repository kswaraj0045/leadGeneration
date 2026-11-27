import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Cpu,
  ShieldCheck,
  Globe,
  Layers,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Zap,
} from 'lucide-react';
import api from '../services/api';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { PlanBadge } from '../components/common/Badge';

const COLORS = ['#0d9488', '#0284c7', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [usage, setUsage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/analytics/overview'), api.get('/analytics/usage')])
      .then(([overRes, useRes]) => {
        if (overRes.data?.success) setData(overRes.data.data);
        if (useRes.data?.success) setUsage(useRes.data.data);
      })
      .catch((err) => console.error('Error fetching analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw size={28} className="animate-spin text-teal-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Aggregating supply-chain metrics...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { kpis, categoryDistribution, countryDistribution, typeDistribution } = data;

  const verificationPieData = [
    { name: 'Verified Enterprise', value: kpis.verifiedCompanies, color: '#0d9488' },
    { name: 'Claimed Submissions', value: kpis.claimedCompanies, color: '#f59e0b' },
    { name: 'Unverified Entries', value: kpis.unverifiedCompanies, color: '#94a3b8' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Semiconductor Supply-Chain Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time database-driven intelligence on industry categories, global supplier distributions, and organization monthly quota utilization.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Companies</span>
              <Cpu size={18} className="text-teal-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 font-mono">{kpis.totalCompanies}</p>
            <p className="text-[11px] text-teal-700 font-mono mt-1">Indexed in Registry</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Verified Records</span>
              <ShieldCheck size={18} className="text-teal-600" />
            </div>
            <p className="text-3xl font-extrabold text-teal-600 font-mono">{kpis.verifiedCompanies}</p>
            <p className="text-[11px] text-slate-500 font-mono mt-1">{kpis.verificationRate}% Verification Ratio</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Industry Verticals</span>
              <Layers size={18} className="text-indigo-600" />
            </div>
            <p className="text-3xl font-extrabold text-indigo-600 font-mono">{categoryDistribution.length}</p>
            <p className="text-[11px] text-slate-500 font-mono mt-1">Full Value Chain</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Global Corridors</span>
              <Globe size={18} className="text-purple-600" />
            </div>
            <p className="text-3xl font-extrabold text-purple-600 font-mono">{countryDistribution.length}</p>
            <p className="text-[11px] text-slate-500 font-mono mt-1">Countries Represented</p>
          </div>
        </div>

        {/* Charts Row 1: Categories & Geographical Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Category Distribution Bar Chart */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Suppliers by Industry Segment</span>
              <span className="text-[11px] font-mono text-slate-400 font-normal">Real Database Count</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="industry" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="companyCount" fill="#0d9488" radius={[4, 4, 0, 0]} name="Companies" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Verification Ratio Pie Chart */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Data Integrity & Verification Status
            </h3>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verificationPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {verificationPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100 font-mono">
              <div>
                <span className="text-[10px] text-teal-600 block">Verified</span>
                <span className="font-bold text-slate-800">{kpis.verifiedCompanies}</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-600 block">Claimed</span>
                <span className="font-bold text-slate-800">{kpis.claimedCompanies}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Unverified</span>
                <span className="font-bold text-slate-800">{kpis.unverifiedCompanies}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Plan Quota Usage */}
        {usage && (
          <div className="bg-navy-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Monthly Subscription Quota Usage</h3>
                  <PlanBadge plan={usage.planCode} />
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Billing Period: {usage.currentMonth.yearMonth} • Tier: {usage.planName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              {/* Searches Quota */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-300">Searches Used</span>
                  <span className="font-bold text-teal-400">
                    {usage.currentMonth.searchesUsed} / {usage.limits.maxMonthlySearches}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (usage.currentMonth.searchesUsed / usage.limits.maxMonthlySearches) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Exports Quota */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-300">Exports Used</span>
                  <span className="font-bold text-teal-400">
                    {usage.currentMonth.exportsUsed} / {usage.limits.maxMonthlyExports}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (usage.currentMonth.exportsUsed / usage.limits.maxMonthlyExports) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Saved Companies Quota */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-300">Saved Companies</span>
                  <span className="font-bold text-teal-400">
                    {usage.currentMonth.savedCompaniesCount} / {usage.limits.maxSavedCompanies}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (usage.currentMonth.savedCompaniesCount / usage.limits.maxSavedCompanies) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
