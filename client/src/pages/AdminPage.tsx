import React, { useState, useEffect } from 'react';
import {
  Shield,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building,
  Activity,
  Search,
  Check,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import { Company, User, Organization, VerificationStatus } from '../types';
import { AppLayout } from '../components/layout/AppLayout';
import { VerificationBadge, PlanBadge } from '../components/common/Badge';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'companies' | 'users' | 'import' | 'audit'>('companies');
  const [stats, setStats] = useState<any | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // CSV Import State
  const [csvContent, setCsvContent] = useState('');
  const [previewResult, setPreviewResult] = useState<any | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, compRes, usersRes, orgsRes, auditRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/companies?limit=100'),
        api.get('/admin/users'),
        api.get('/admin/organizations'),
        api.get('/admin/audit-logs'),
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (compRes.data?.success) setCompanies(compRes.data.data);
      if (usersRes.data?.success) setUsers(usersRes.data.data);
      if (orgsRes.data?.success) setOrgs(orgsRes.data.data);
      if (auditRes.data?.success) setAuditLogs(auditRes.data.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyToggle = async (companyId: string, currentStatus: VerificationStatus) => {
    const newStatus: VerificationStatus = currentStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
    const notes = prompt(`Enter verification review notes for this company:`, `Verified by platform administrator on ${new Date().toLocaleDateString()}`);
    if (notes === null) return;

    try {
      await api.patch(`/companies/${companyId}/verify`, {
        status: newStatus,
        notes,
      });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status.');
    }
  };

  const handleUpdatePlan = async (orgId: string, planCode: string) => {
    try {
      await api.patch(`/admin/organizations/${orgId}/plan`, { planCode });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update plan.');
    }
  };

  const handlePreviewImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;

    try {
      const res = await api.post('/admin/import/preview', { csvContent });
      if (res.data?.success) {
        setPreviewResult(res.data.data);
      }
    } catch (err: any) {
      alert(err.message || 'CSV parse failed');
    }
  };

  const handleCommitImport = async () => {
    if (!previewResult || previewResult.validRows.length === 0) return;
    setImporting(true);
    setImportMessage(null);

    try {
      const res = await api.post('/admin/import/commit', {
        rows: previewResult.validRows,
      });

      if (res.data?.success) {
        setImportMessage(`Import successful! Added ${res.data.data.created} companies.`);
        setCsvContent('');
        setPreviewResult(null);
        fetchAdminData();
      }
    } catch (err: any) {
      alert(err.message || 'Import commit failed');
    } finally {
      setImporting(false);
    }
  };

  const sampleCsvTemplate = `name,companyType,hqCountry,hqCity,website,description,yearEstablished,categorySlug
Kaynes Semicon,MANUFACTURER,India,Sanand,https://kaynes-semicon.io,"Advanced packaging and OSAT manufacturing facility in Sanand.",2024,osat-packaging
Mindgrove Technologies,SERVICE_PROVIDER,India,Bengaluru,https://mindgrove.in,"Fabless IC design house designing secure RISC-V edge IoT SoCs.",2021,ic-design-fabless`;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-saas-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                Platform Super-Admin
              </span>
              <span className="text-xs font-mono text-saas-secondary">• System Access Control</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-saas-primary">
              Platform Administration Portal
            </h1>
            <p className="text-xs text-saas-secondary mt-0.5">
              Review supplier verification requests, administer user organizations, ingest batch CSV dossiers, and inspect security audit logs.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-saas-border bg-white hover:bg-slate-50 text-xs font-semibold text-saas-primary transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh State</span>
          </button>
        </div>

        {/* METRICS ROW */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-saas-border shadow-xs">
              <span className="text-[11px] font-medium uppercase text-saas-secondary">Total Companies</span>
              <div className="text-xl font-bold text-saas-primary font-mono mt-1">{stats.totalCompanies}</div>
              <span className="text-[10px] text-teal-700 font-mono">{stats.verifiedCompanies} verified audits</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-saas-border shadow-xs">
              <span className="text-[11px] font-medium uppercase text-saas-secondary">Registered Users</span>
              <div className="text-xl font-bold text-saas-primary font-mono mt-1">{stats.totalUsers}</div>
              <span className="text-[10px] text-indigo-700 font-mono">{stats.adminUsers} platform admins</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-saas-border shadow-xs">
              <span className="text-[11px] font-medium uppercase text-saas-secondary">Organizations</span>
              <div className="text-xl font-bold text-saas-primary font-mono mt-1">{stats.totalOrganizations}</div>
              <span className="text-[10px] text-blue-700 font-mono">Isolated multi-tenant</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-saas-border shadow-xs">
              <span className="text-[11px] font-medium uppercase text-saas-secondary">Security Audit Logs</span>
              <div className="text-xl font-bold text-saas-primary font-mono mt-1">{stats.totalAuditLogs}</div>
              <span className="text-[10px] text-amber-700 font-mono">Immutable traceability</span>
            </div>
          </div>
        )}

        {/* ADMIN TAB NAVIGATION */}
        <div className="flex border-b border-saas-border space-x-6 text-xs font-semibold">
          {[
            { id: 'companies', label: 'Company Verification Matrix' },
            { id: 'users', label: 'Users & Subscriptions' },
            { id: 'import', label: 'Batch CSV Ingestion Engine' },
            { id: 'audit', label: 'Security & Action Audit Logs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-saas-accent text-saas-accent'
                  : 'border-transparent text-saas-secondary hover:text-saas-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: COMPANY VERIFICATION MATRIX */}
        {activeTab === 'companies' && (
          <div className="bg-white rounded-xl border border-saas-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-saas-border text-xs">
                <thead className="bg-saas-bg text-saas-secondary font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">Company Name</th>
                    <th className="px-4 py-3 text-left">Vertical</th>
                    <th className="px-4 py-3 text-left">Headquarters</th>
                    <th className="px-4 py-3 text-left">Current Audit Status</th>
                    <th className="px-4 py-3 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-saas-border">
                  {companies.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-saas-primary">{c.name}</td>
                      <td className="px-4 py-3 text-saas-secondary font-mono text-[11px]">{c.category?.name || c.companyType}</td>
                      <td className="px-4 py-3 text-saas-secondary">{c.hqCity}, {c.hqCountry}</td>
                      <td className="px-4 py-3">
                        <VerificationBadge status={c.verificationStatus} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleVerifyToggle(c.id, c.verificationStatus)}
                          className={`px-3 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                            c.verificationStatus === 'VERIFIED'
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-teal-600 bg-teal-50 text-teal-800 hover:bg-teal-100'
                          }`}
                        >
                          {c.verificationStatus === 'VERIFIED' ? 'Revoke Audit' : 'Approve Audit'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USERS & SUBSCRIPTIONS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-saas-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-saas-border text-xs">
                <thead className="bg-saas-bg text-saas-secondary font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">Full Name & Email</th>
                    <th className="px-4 py-3 text-left">System Role</th>
                    <th className="px-4 py-3 text-left">Organization</th>
                    <th className="px-4 py-3 text-left">Assigned Subscription Tier</th>
                    <th className="px-4 py-3 text-right">Plan Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-saas-border">
                  {users.map((u) => {
                    const org = orgs.find((o) => o.id === u.organizationId);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-bold text-saas-primary">{u.fullName}</div>
                          <div className="text-saas-secondary font-mono text-[11px]">{u.email}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-saas-primary">{u.role}</td>
                        <td className="px-4 py-3 text-saas-secondary">{org?.name || 'Unassigned'}</td>
                        <td className="px-4 py-3">
                          <PlanBadge plan={org?.planCode || 'BASIC'} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {org && (
                            <select
                              value={org.planCode}
                              onChange={(e) => handleUpdatePlan(org.id, e.target.value)}
                              className="px-2 py-1 bg-white border border-saas-border rounded text-[11px] font-mono focus:outline-none focus:border-saas-accent cursor-pointer"
                            >
                              <option value="BASIC">BASIC</option>
                              <option value="PRO">PRO</option>
                              <option value="ENTERPRISE">ENTERPRISE</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BATCH CSV INGESTION ENGINE */}
        {activeTab === 'import' && (
          <div className="bg-white rounded-xl border border-saas-border p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-saas-primary">Batch Company Ingestion Engine</h3>
              <p className="text-xs text-saas-secondary mt-0.5">
                Bulk ingest semiconductor and electronics companies with automated schema validation, category matching, and deduplication.
              </p>
            </div>

            {importMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
                {importMessage}
              </div>
            )}

            <form onSubmit={handlePreviewImport} className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-saas-primary">CSV Payload (Header row required)</label>
                <button
                  type="button"
                  onClick={() => setCsvContent(sampleCsvTemplate)}
                  className="text-xs text-saas-accent hover:underline font-semibold cursor-pointer"
                >
                  Load Sample CSV Template
                </button>
              </div>

              <textarea
                rows={6}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="Paste CSV rows here..."
                className="w-full p-3 font-mono text-xs bg-saas-bg border border-saas-border rounded-lg focus:outline-none focus:border-saas-accent resize-none text-saas-primary"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-saas-primary hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Parse & Validate CSV
                </button>
              </div>
            </form>

            {previewResult && (
              <div className="pt-4 border-t border-saas-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-saas-primary">
                    Validation: {previewResult.validRows.length} valid / {previewResult.errors.length} errors
                  </span>
                  <button
                    type="button"
                    disabled={importing || previewResult.validRows.length === 0}
                    onClick={handleCommitImport}
                    className="px-4 py-1.5 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {importing ? 'Importing...' : `Commit ${previewResult.validRows.length} Valid Companies`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-saas-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-saas-border text-xs">
                <thead className="bg-saas-bg text-saas-secondary font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">Action</th>
                    <th className="px-4 py-3 text-left">Target Entity</th>
                    <th className="px-4 py-3 text-left">Admin User</th>
                    <th className="px-4 py-3 text-left">Details</th>
                    <th className="px-4 py-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-saas-border font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-teal-700">{log.action}</td>
                      <td className="px-4 py-3 text-saas-secondary">{log.entityType} ({log.entityId?.substring(0, 8)}...)</td>
                      <td className="px-4 py-3 text-saas-primary">{log.userEmail || 'System'}</td>
                      <td className="px-4 py-3 text-saas-secondary truncate max-w-xs">{log.detailsJson}</td>
                      <td className="px-4 py-3 text-right text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
