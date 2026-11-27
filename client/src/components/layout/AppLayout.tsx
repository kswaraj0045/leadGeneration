import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Cpu,
  LayoutDashboard,
  Search,
  Sparkles,
  Bookmark,
  History,
  Zap,
  Layers,
  Globe2,
  BarChart3,
  Users,
  Database,
  CreditCard,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  HelpCircle,
  Menu,
  X,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PlanBadge } from '../common/Badge';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/app/discovery?q=${encodeURIComponent(globalSearch.trim())}`);
      setGlobalSearch('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Overview', path: '/app/overview', icon: LayoutDashboard },
        { label: 'Company Discovery', path: '/app/discovery', icon: Search },
        { label: 'Matching Engine', path: '/app/matching', icon: Sparkles },
        { label: 'Sourcing Pipeline', path: '/app/workspace', icon: Bookmark },
        { label: 'Saved Searches', path: '/app/searches', icon: History },
        { label: 'Opportunities', path: '/app/opportunities', icon: Zap },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { label: 'Industry Explorer', path: '/app/industries', icon: Layers },
        { label: 'Geographic Insights', path: '/app/geographic', icon: Globe2 },
        { label: 'Platform Analytics', path: '/app/analytics', icon: BarChart3 },
      ],
    },
  ];

  if (user?.role === 'ADMIN' || user?.role === 'COMPANY_ADMIN') {
    navSections.push({
      title: 'ADMINISTRATION',
      items: [
        ...(user?.role === 'ADMIN' ? [{ label: 'Admin Portal', path: '/admin', icon: Shield }] : []),
        { label: 'Subscription & Usage', path: '/app/subscription', icon: CreditCard },
      ],
    });
  }

  // Breadcrumbs generator
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.includes('/app/overview')) return ['Workspace', 'Overview'];
    if (path.includes('/app/discovery')) return ['Workspace', 'Company Discovery'];
    if (path.includes('/app/matching')) return ['Workspace', 'Matching Engine'];
    if (path.includes('/app/workspace')) return ['Workspace', 'Sourcing Pipeline'];
    if (path.includes('/app/searches')) return ['Workspace', 'Saved Searches'];
    if (path.includes('/app/opportunities')) return ['Workspace', 'Business Opportunities'];
    if (path.includes('/app/industries')) return ['Intelligence', 'Industry Explorer'];
    if (path.includes('/app/geographic')) return ['Intelligence', 'Geographic Insights'];
    if (path.includes('/app/analytics')) return ['Intelligence', 'Platform Analytics'];
    if (path.includes('/app/subscription')) return ['Administration', 'Subscription & Usage'];
    if (path.includes('/admin')) return ['Administration', 'Platform Administration'];
    return ['Platform', 'Workspace'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-saas-bg flex text-saas-primary">
      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* PERSISTENT LEFT SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen bg-white border-r border-saas-border flex flex-col justify-between transition-all duration-200 select-none ${
          sidebarCollapsed ? 'w-18' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* SIDEBAR HEADER */}
        <div>
          <div className="h-16 px-4 border-b border-saas-border flex items-center justify-between">
            <Link to="/app/overview" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-saas-accent text-white flex items-center justify-center shrink-0 shadow-xs">
                <Cpu size={18} />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm tracking-tight text-saas-primary">
                    VIASET
                  </span>
                  <span className="text-[10px] text-saas-secondary font-mono tracking-wider uppercase -mt-0.5">
                    Intelligence SaaS
                  </span>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-1 rounded-md text-saas-secondary hover:text-saas-primary hover:bg-saas-bg transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 rounded-md text-saas-secondary hover:text-saas-primary"
            >
              <X size={18} />
            </button>
          </div>

          {/* ACTIVE ORGANIZATION BADGE */}
          {!sidebarCollapsed && user?.organization && (
            <div className="px-3.5 py-3 border-b border-saas-border bg-slate-50/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 size={14} className="text-saas-secondary shrink-0" />
                  <span className="text-xs font-semibold text-saas-primary truncate">
                    {user.organization.name}
                  </span>
                </div>
                <PlanBadge plan={user.organization.planCode} />
              </div>
            </div>
          )}

          {/* NAVIGATION SECTIONS */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                {!sidebarCollapsed && (
                  <p className="px-2.5 text-[10px] font-bold text-saas-muted tracking-wider uppercase font-mono">
                    {section.title}
                  </p>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                        active
                          ? 'bg-saas-accent-subtle text-saas-accent font-semibold shadow-xs border border-saas-accent-border'
                          : 'text-saas-secondary hover:text-saas-primary hover:bg-saas-border-light'
                      } ${sidebarCollapsed ? 'justify-center' : ''}`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon
                        size={16}
                        className={active ? 'text-saas-accent' : 'text-saas-secondary'}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR FOOTER: USER PROFILE */}
        <div className="p-3 border-t border-saas-border bg-white">
          <div
            className={`flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-saas-border-light transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-saas-border text-saas-primary font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-saas-primary truncate leading-tight">
                    {user?.fullName || 'User Profile'}
                  </p>
                  <p className="text-[10px] text-saas-secondary truncate font-mono">
                    {user?.role}
                  </p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1 rounded-md text-saas-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign out of platform"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP APPLICATION BAR */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-saas-border px-4 sm:px-8 flex items-center justify-between gap-4 shadow-subtle">
          {/* LEFT: MOBILE TOGGLE & BREADCRUMBS */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-saas-border text-saas-secondary hover:text-saas-primary"
            >
              <Menu size={18} />
            </button>

            {/* BREADCRUMBS */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-saas-secondary">
              <span className="text-saas-muted">{breadcrumbs[0]}</span>
              <span className="text-saas-muted">/</span>
              <span className="text-saas-primary font-semibold">{breadcrumbs[1]}</span>
            </nav>
          </div>

          {/* MIDDLE: GLOBAL SEARCH BAR */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <form onSubmit={handleGlobalSearch} className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-saas-muted pointer-events-none"
              />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search companies, process nodes, cleanrooms (e.g. 28nm)..."
                className="w-full pl-9 pr-3 py-1.5 bg-saas-bg border border-saas-border rounded-lg text-xs text-saas-primary placeholder-saas-muted focus:outline-none focus:ring-1 focus:ring-saas-accent focus:bg-white transition-colors"
              />
            </form>
          </div>

          {/* RIGHT: SYSTEM STATUS, NOTIFICATIONS, PROFILE */}
          <div className="flex items-center gap-3 text-xs">
            {/* Live Database Sync Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>28 Verified Facilities</span>
            </div>

            {/* Help / Docs */}
            <a
              href="file:///d:/VIASET/README.md"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-saas-secondary hover:text-saas-primary hover:bg-saas-bg transition-colors"
              title="Documentation & Viva Guide"
            >
              <HelpCircle size={16} />
            </a>

            {/* Notifications */}
            <button
              type="button"
              className="p-1.5 rounded-lg text-saas-secondary hover:text-saas-primary hover:bg-saas-bg transition-colors relative"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-saas-accent" />
            </button>
          </div>
        </header>

        {/* MAIN APPLICATION CONTENT */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
