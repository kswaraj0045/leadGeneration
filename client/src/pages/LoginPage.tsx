import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Lock, Mail, ArrowRight, AlertCircle, Shield, User, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/app/overview');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      navigate('/app/overview');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 flex items-center justify-center mx-auto mb-4">
              <Cpu size={28} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Sign In to VIASET Platform
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Access semiconductor supply-chain intelligence and opportunity workspace
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-2">
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              ⚡ Quick 1-Click Demo Logins:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@viaset.io', 'Admin123!')}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-teal-500 text-left text-xs text-slate-700 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-amber-500" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Platform Admin</span>
                    <span className="text-[10px] text-slate-500">Dr. Vikram Chandra (Full Admin Privileges)</span>
                  </div>
                </div>
                <span className="text-[10px] text-teal-600 font-mono group-hover:underline">Fill &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('lead@kaynes-semi.com', 'Company123!')}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-teal-500 text-left text-xs text-slate-700 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Building size={14} className="text-indigo-500" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Company Admin (Pro Plan)</span>
                    <span className="text-[10px] text-slate-500">Rajesh Nair (Kaynes Semicon)</span>
                  </div>
                </div>
                <span className="text-[10px] text-teal-600 font-mono group-hover:underline">Fill &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('engineer@mindgrove.in', 'User123!')}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-teal-500 text-left text-xs text-slate-700 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <User size={14} className="text-teal-500" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Engineering User (Basic)</span>
                    <span className="text-[10px] text-slate-500">Ananya Sharma (Mindgrove Tech)</span>
                  </div>
                </div>
                <span className="text-[10px] text-teal-600 font-mono group-hover:underline">Fill &rarr;</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-all shadow-sm shadow-teal-500/20 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Authenticating session...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-slate-600">
              Don't have an enterprise account?{' '}
              <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-500">
                Register Organization
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
