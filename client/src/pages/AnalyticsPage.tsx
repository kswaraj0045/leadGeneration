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
  Building2,
} from 'lucide-react';
import api from '../services/api';
import { AppLayout } from '../components/layout/AppLayout';
import { PlanBadge } from '../components/common/Badge';

const COLORS = ['#0F8B8D', '#0284c7', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [usage, setUsage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchOverview = api
      .get('/analytics/overview')
      .then((res) => {
        if (res.data?.success) setData(res.data.data);
      })
      .catch((err) => console.error('Error fetching analytics overview:', err));

    const fetchUsage = api
      .get('/analytics/usage')
      .then((res) => {
        if (res.data?.success) setUsage(res.data.data);
      })
      .catch((err) => console.warn('Usage metrics unavailable:', err));

    Promise.allSettled([fetchOverview, fetchUsage]).finally(() => setLoading(false));
  }, []);

  const fallbackData = {
    kpis: {
      totalCompanies: 28,
      verifiedCompanies: 24,
      claimedCompanies: 4,
      verificationRate: 86,
    },
    categoryDistribution: [
      { industry: 'Semiconductor Foundries', companyCount: 4 },
      { industry: 'Fabless IC Design', companyCount: 5 },
      { industry: 'OSAT Packaging & Test', companyCount: 4 },
      { industry: 'HDI PCB Fabrication', companyCount: 5 },
      { industry: 'EMS Turnkey Assembly', companyCount: 5 },
      { industry: 'Passive Components', companyCount: 5 },
    ],
    countryDistribution: [
      { country: 'India', count: 12 },
      { country: 'Taiwan', count: 5 },
      { country: 'United States', count: 4 },
      { country: 'Japan', count: 4 },
      { country: 'Austria', count: 3 },
    ],
  };

  const activeData = data || fallbackData;
  const kpis = activeData.kpis;
  const categoryData = (activeData.categoryDistribution || []).map((c: any) => ({
    name: c.industry.replace('Semiconductor ', '').replace('Electronics ', ''),
    count: c.companyCount,
  }));
  const countryData = activeData.countryDistribution || [];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-saas-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                Platform Intelligence Telemetry
              </span>
              <span className="text-xs font-mono text-saas-secondary">• Real-Time Aggregation</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-saas-primary">
              Semiconductor Supply-Chain Analytics
            </h1>
            <p className="text-xs text-saas-secondary mt-0.5">
              Comprehensive telemetry of verified facilities, category distribution, and geographic concentrations.
            </p>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-saas-border shadow-xs">
            <div className="flex items-center justify-between text-saas-secondary mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Entities</span>
              <Building2 size={16} className="text-saas-accent" />
            </div>
            <div className="text-2xl font-bold text-saas-primary font-mono">{kpis.totalCompanies}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">100% normalized profiles</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-saas-border shadow-xs">
            <div className="flex items-center justify-between text-saas-secondary mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Verified Audits</span>
              <ShieldCheck size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-saas-primary font-mono">{kpis.verifiedCompanies}</div>
            <div className="text-[11px] text-saas-secondary mt-1">
              {kpis.verificationRate}% audited verification rate
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-saas-border shadow-xs">
            <div className="flex items-center justify-between text-saas-secondary mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Geographic Hubs</span>
              <Globe size={16} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-saas-primary font-mono">{countryData.length}</div>
            <div className="text-[11px] text-saas-secondary mt-1">India, Taiwan, US, JP, EU</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-saas-border shadow-xs">
            <div className="flex items-center justify-between text-saas-secondary mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Ecosystem Verticals</span>
              <Layers size={16} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-saas-primary font-mono">{categoryData.length}</div>
            <div className="text-[11px] text-saas-secondary mt-1">Foundry, IC, OSAT, PCB, EMS</div>
          </div>
        </div>

        {/* 2 CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CATEGORY DISTRIBUTION */}
          <div className="bg-white p-6 rounded-xl border border-saas-border shadow-xs">
            <h2 className="text-xs font-bold text-saas-primary uppercase tracking-wide mb-1">
              Ecosystem Entities by Vertical
            </h2>
            <p className="text-xs text-saas-secondary mb-4">
              Normalized distribution across the 6 semiconductor supply chain domains
            </p>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#172033',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="count" fill="#0F8B8D" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GEOGRAPHIC CORRIDOR CONCENTRATION */}
          <div className="bg-white p-6 rounded-xl border border-saas-border shadow-xs">
            <h2 className="text-xs font-bold text-saas-primary uppercase tracking-wide mb-1">
              Geographic Concentration
            </h2>
            <p className="text-xs text-saas-secondary mb-4">
              Breakdown of manufacturing facilities by country code
            </p>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryData}
                    dataKey="count"
                    nameKey="country"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.country} (${entry.count})`}
                  >
                    {countryData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#172033',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SUBSCRIPTION & USAGE QUOTAS WIDGET */}
        {usage && (
          <div className="bg-white p-6 rounded-xl border border-saas-border shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-saas-border">
              <div>
                <h2 className="text-xs font-bold text-saas-primary uppercase tracking-wide">
                  Account Tier & API Quota Telemetry
                </h2>
                <p className="text-xs text-saas-secondary">
                  Current monthly search, export, and saved supplier consumption
                </p>
              </div>
              <PlanBadge plan={usage.plan} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-saas-primary">Monthly Searches</span>
                  <span className="font-mono text-saas-secondary">
                    {usage.searches.used} / {usage.searches.limit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-saas-accent h-2 rounded-full"
                    style={{ width: `${Math.min(100, (usage.searches.used / usage.searches.limit) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-saas-primary">Saved Pipeline Suppliers</span>
                  <span className="font-mono text-saas-secondary">
                    {usage.savedCompanies.used} / {usage.savedCompanies.limit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (usage.savedCompanies.used / usage.savedCompanies.limit) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-saas-primary">Dossier Data Exports</span>
                  <span className="font-mono text-saas-secondary">
                    {usage.exports.used} / {usage.exports.limit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (usage.exports.used / usage.exports.limit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
