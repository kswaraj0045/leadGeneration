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
    { label: 'Overview', path: '/app/overview', icon: Cpu },
    { label: 'Discovery', path: '/app/discovery', icon: Search },
    { label: 'Matching', path: '/app/matching', icon: Sparkles },
    { label: 'Pipeline', path: '/app/workspace', icon: Bookmark },
    { label: 'Analytics', path: '/app/analytics', icon: BarChart3 },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ label: 'Admin Portal', path: '/admin', icon: Shield });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-saas-border text-saas-primary shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-8">
            <Link to={isAuthenticated ? '/app/overview' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-saas-accent text-white flex items-center justify-center shrink-0 shadow-xs">
                <Cpu size={18} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-base text-saas-primary group-hover:text-saas-accent transition-colors">
                    VIASET
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[9px] font-mono tracking-widest uppercase font-semibold">
                    B2B SaaS
                  </span>
                </div>
                <span className="text-[10px] text-saas-secondary tracking-wider font-mono -mt-0.5">
                  Supply-Chain Intelligence
                </span>
              </div>
            </Link>

            {/* Public Links */}
            {!isAuthenticated && (
              <div className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-saas-secondary">
                <a href="#capabilities" className="hover:text-saas-primary transition-colors">
                  Capabilities
                </a>
                <a href="#taxonomy" className="hover:text-saas-primary transition-colors">
                  Taxonomy
                </a>
                <a href="#matcher" className="hover:text-saas-primary transition-colors">
                  Matching Matrix
                </a>
                <a href="#pricing" className="hover:text-saas-primary transition-colors">
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
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        active
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'text-saas-secondary hover:text-saas-primary hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={14} className={active ? 'text-teal-700' : 'text-saas-secondary'} />
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
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-saas-bg border border-saas-border hover:bg-slate-100 transition-colors text-left cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-saas-accent text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-bold text-saas-primary leading-tight">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-saas-secondary font-mono -mt-0.5">
                      {user.organization?.name || user.role}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-saas-secondary" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-saas-border shadow-xl py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-3 border-b border-saas-border">
                      <div className="text-xs font-bold text-saas-primary">{user.fullName}</div>
                      <div className="text-[11px] text-saas-secondary font-mono truncate">{user.email}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <PlanBadge plan={user.organization?.planCode || 'BASIC'} />
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1 text-xs">
                      <Link
                        to="/app/overview"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-saas-primary hover:bg-slate-50"
                      >
                        <Cpu size={14} className="text-saas-accent" />
                        <span>Workspace Overview</span>
                      </Link>
                      <Link
                        to="/app/discovery"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-saas-primary hover:bg-slate-50"
                      >
                        <Search size={14} className="text-saas-accent" />
                        <span>Company Discovery</span>
                      </Link>
                      <Link
                        to="/app/workspace"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-saas-primary hover:bg-slate-50"
                      >
                        <Bookmark size={14} className="text-saas-accent" />
                        <span>Sourcing Pipeline</span>
                      </Link>
                      <Link
                        to="/app/subscription"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-saas-primary hover:bg-slate-50"
                      >
                        <Building2 size={14} className="text-saas-accent" />
                        <span>Subscription Quotas</span>
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-amber-700 hover:bg-amber-50 font-semibold"
                        >
                          <Shield size={14} />
                          <span>Admin Portal</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-saas-border">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-semibold cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-saas-secondary hover:text-saas-primary hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-saas-accent hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Launch Console</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
