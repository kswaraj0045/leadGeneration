import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Cpu,
  Search,
  Sparkles,
  Bookmark,
  History,
  BarChart3,
  Shield,
  LogOut,
  ChevronDown,
  ArrowRight,
  Database,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PlanBadge } from './Badge';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Intelligence Console', path: '/app/discovery', icon: Search },
    { label: 'Matching Matrix', path: '/app/matching', icon: Sparkles },
    { label: 'Sourcing Pipeline', path: '/app/workspace', icon: Bookmark },
    { label: 'Search Queries', path: '/app/searches', icon: History },
    { label: 'Analytics', path: '/app/analytics', icon: BarChart3 },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ label: 'Admin Portal', path: '/admin', icon: Shield });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-8">
            <Link to={isAuthenticated ? '/app/discovery' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:border-teal-400 group-hover:bg-teal-500/20 transition-all">
                <Cpu size={20} className="text-teal-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-lg text-white group-hover:text-teal-300 transition-colors">
                    VIASET
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[9px] font-mono tracking-widest uppercase">
                    SaaS Platform
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-wider font-mono -mt-0.5">
                  Supply-Chain Intelligence
                </span>
              </div>
            </Link>

            {/* Public Links */}
            {!isAuthenticated && (
              <div className="hidden lg:flex items-center space-x-6 text-xs font-medium text-slate-300">
                <a href="#capabilities" className="hover:text-teal-300 transition-colors">
                  Capabilities
                </a>
                <a href="#matcher" className="hover:text-teal-300 transition-colors">
                  Matching Engine
                </a>
                <a href="#matrix" className="hover:text-teal-300 transition-colors">
                  Intelligence Matrix
                </a>
                <a href="#pricing" className="hover:text-teal-300 transition-colors">
                  Enterprise Plans
                </a>
              </div>
            )}

            {/* Main Nav Links (Authenticated) */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        active
                          ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon size={14} className={active ? 'text-teal-400' : 'text-slate-400'} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right section: Auth controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 transition-colors text-left"
                >
                  <div className="w-6 h-6 rounded-md bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs font-mono">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-bold text-slate-200 leading-tight">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px] font-mono">
                      {user.organization?.name || 'Organization'}
                    </span>
                  </div>
                  {user.organization?.planCode && (
                    <div className="hidden lg:block ml-1">
                      <PlanBadge plan={user.organization.planCode} />
                    </div>
                  )}
                  <ChevronDown size={14} className="text-slate-400 ml-1" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Profile</p>
                      <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-400 font-mono truncate">{user.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 font-mono border border-slate-700">
                          {user.role}
                        </span>
                        {user.organization?.planCode && (
                          <PlanBadge plan={user.organization.planCode} />
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/app/subscription"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      >
                        <BarChart3 size={15} className="text-slate-400" />
                        <span>SaaS Quotas & Billing</span>
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-300 hover:bg-slate-800/80"
                        >
                          <Shield size={15} className="text-amber-400" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/app/discovery"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/30"
                >
                  <span>Launch Platform</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
