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
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
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
    if (!previewResult || !previewResult.validRows?.length) return;
    setImporting(true);
    setImportMessage(null);

    try {
      const res = await api.post('/admin/import/commit', {
        validRows: previewResult.validRows,
        fileName: 'dataset_admin_import.csv',
      });
      if (res.data?.success) {
        setImportMessage(res.data.message);
        setPreviewResult(null);
        setCsvContent('');
        fetchAdminData();
      }
    } catch (err: any) {
      alert(err.message || 'Import commit failed');
    } finally {
      setImporting(false);
    }
  };

  const loadSampleCSV = () => {
    setCsvContent(`name,categorySlug,companyType,hqCity,hqState,hqCountry,description,capabilities,certifications,products
Sahasra Semiconductors,semiconductor-foundry,Foundry,Bhiwadi,Rajasthan,India,"Memory chip packaging and OSAT manufacturing facility in Rajasthan.","Memory Packaging; MicroSD Wire Bonding; Class 1000 Cleanroom","ISO 9001:2015","NAND Flash Memory ICs"
Ahemon Microelectronics,ic-design-fabless,Design House,Bengaluru,Karnataka,India,"Design house delivering ultra-low power power management ICs.","Analog Layout; 40nm BCD","ISO 9001:2015","Step-Down Buck Regulators"`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-mono uppercase tracking-wider mb-1">
              <Shield size={14} className="text-amber-600" />
              <span>Platform Administrative Center</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Intelligence Registry Management
            </h1>
          </div>

          {stats && (
            <div className="flex items-center gap-4 text-xs font-mono bg-white px-4 py-2 rounded-xl border border-slate-200">
              <span>Companies: <strong>{stats.companiesCount}</strong></span>
              <span>Users: <strong>{stats.usersCount}</strong></span>
              <span>Orgs: <strong>{stats.orgsCount}</strong></span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-6 text-xs font-medium">
          {[
            { id: 'companies', label: `Manage Companies (${companies.length})` },
            { id: 'users', label: `Users & Organizations (${users.length})` },
            { id: 'import', label: 'CSV Ingestion Engine' },
            { id: 'audit', label: `Audit Trail (${auditLogs.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 border-b-2 font-semibold transition-colors ${
                activeTab === t.id
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: COMPANIES & VERIFICATION */}
        {activeTab === 'companies' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Click verification badge to toggle verification status with formal audit trail.</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3 text-left">Company Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{c.name}</td>
                      <td className="px-4 py-3 text-slate-600">{c.category?.name || c.companyType}</td>
                      <td className="px-4 py-3 text-slate-500">{c.hqCity}, {c.hqCountry}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{c.companyType}</td>
                      <td className="px-4 py-3">
                        <VerificationBadge status={c.verificationStatus} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleVerifyToggle(c.id, c.verificationStatus)}
                          className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
                        >
                          {c.verificationStatus === 'VERIFIED' ? 'Revoke Verification' : 'Verify Company'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USERS & ORGANIZATIONS */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Registered Users</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <div key={u.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{u.fullName}</p>
                      <p className="text-slate-500 text-[11px] font-mono">{u.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Organizations & Subscription Tiers</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {orgs.map((org) => (
                  <div key={org.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{org.name}</p>
                      <p className="text-slate-500 text-[11px]">{org.country}</p>
                    </div>
                    <select
                      value={org.planCode}
                      onChange={(e) => handleUpdatePlan(org.id, e.target.value)}
                      className="py-1 px-2 border border-slate-300 rounded text-xs bg-white font-mono"
                    >
                      <option value="BASIC">BASIC</option>
                      <option value="PRO">PRO</option>
                      <option value="ENTERPRISE">ENTERPRISE</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CSV INGESTION ENGINE */}
        {activeTab === 'import' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Ingest Structured Company Dataset</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Import CSV datasets with automatic schema validation, duplicate detection, and preview confirmation.
                </p>
              </div>
              <button
                type="button"
                onClick={loadSampleCSV}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Load Sample Dataset
              </button>
            </div>

            {importMessage && (
              <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{importMessage}</span>
              </div>
            )}

            <form onSubmit={handlePreviewImport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Paste CSV Content (with headers)
                </label>
                <textarea
                  rows={6}
                  required
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="name,categorySlug,companyType,hqCity,hqState,hqCountry,description,capabilities,certifications,products..."
                  className="w-full p-3 font-mono text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
              >
                Validate & Preview Dataset
              </button>
            </form>

            {/* Preview Results */}
            {previewResult && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Dataset Validation Summary</h4>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-teal-600">Valid: {previewResult.validRows.length}</span>
                    <span className="text-amber-600">Duplicates: {previewResult.duplicateRows.length}</span>
                    <span className="text-red-600">Errors: {previewResult.errorRows.length}</span>
                  </div>
                </div>

                {previewResult.duplicateRows.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 space-y-1">
                    <p className="font-semibold">Duplicates Detected (Will Be Skipped):</p>
                    {previewResult.duplicateRows.map((d: any, i: number) => (
                      <p key={i}>• {d.row.name}: {d.reason}</p>
                    ))}
                  </div>
                )}

                {previewResult.errorRows.length > 0 && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 space-y-1">
                    <p className="font-semibold">Validation Errors:</p>
                    {previewResult.errorRows.map((e: any, i: number) => (
                      <p key={i}>• Row {e.row._rowIndex}: {e.errors.join(', ')}</p>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={importing || previewResult.validRows.length === 0}
                    onClick={handleCommitImport}
                    className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium shadow-sm disabled:opacity-50"
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
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3 text-left">Action</th>
                    <th className="px-4 py-3 text-left">Target Entity</th>
                    <th className="px-4 py-3 text-left">Admin User</th>
                    <th className="px-4 py-3 text-left">Details</th>
                    <th className="px-4 py-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-3 font-semibold text-teal-700">{log.action}</td>
                      <td className="px-4 py-3 text-slate-600">{log.entityType} ({log.entityId?.substring(0, 8)}...)</td>
                      <td className="px-4 py-3 text-slate-700">{log.userEmail || 'System'}</td>
                      <td className="px-4 py-3 text-slate-500 truncate max-w-xs">{log.detailsJson}</td>
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
      </main>

      <Footer />
    </div>
  );
};
