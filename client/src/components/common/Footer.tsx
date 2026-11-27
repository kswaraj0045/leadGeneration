import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Database, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Cpu size={18} />
              </div>
              <span className="font-bold text-white text-base tracking-tight">VIASET</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specialized B2B supply-chain intelligence and partner discovery platform purpose-built for the semiconductor, microelectronics, and advanced PCB ecosystem.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-400/90 font-mono">
              <ShieldCheck size={14} />
              <span>Verified Industry Intelligence</span>
            </div>
          </div>

          {/* Ecosystem Verticals */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Industry Verticals
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/app/discovery?category=semiconductor-foundry" className="hover:text-teal-300">Semiconductor Foundries</Link></li>
              <li><Link to="/app/discovery?category=ic-design-fabless" className="hover:text-teal-300">Fabless IC Design Houses</Link></li>
              <li><Link to="/app/discovery?category=osat-packaging" className="hover:text-teal-300">OSAT Packaging & Test</Link></li>
              <li><Link to="/app/discovery?category=pcb-fabrication" className="hover:text-teal-300">High-Density Interconnect PCBs</Link></li>
              <li><Link to="/app/discovery?category=pcb-assembly-ems" className="hover:text-teal-300">Electronics Manufacturing Services</Link></li>
              <li><Link to="/app/discovery?category=passive-components" className="hover:text-teal-300">Passive & Active Components</Link></li>
            </ul>
          </div>

          {/* Platform Capabilities */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/app/matching" className="hover:text-teal-300">Explainable Matching Engine</Link></li>
              <li><Link to="/app/discovery" className="hover:text-teal-300">Multi-Facet Parameter Search</Link></li>
              <li><Link to="/app/workspace" className="hover:text-teal-300">Supplier Sourcing Pipeline</Link></li>
              <li><Link to="/app/analytics" className="hover:text-teal-300">Supply-Chain Analytics</Link></li>
              <li><Link to="/app/subscription" className="hover:text-teal-300">Enterprise Subscription Plans</Link></li>
              <li><Link to="/admin" className="hover:text-teal-300">Data Verification Portal</Link></li>
            </ul>
          </div>

          {/* Academic Attribution & Standards */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Project & Standards
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Major Academic Project — Final-Year B.Tech Computer Engineering. Built following industry-grade SaaS architecture, relational database normalization, and explainable scoring heuristics.
            </p>
            <div className="flex flex-col gap-1 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5"><Layers size={13} className="text-slate-400" /> React 18 / TypeScript / Tailwind</span>
              <span className="flex items-center gap-1.5"><Database size={13} className="text-slate-400" /> Node.js / Prisma ORM / SQLite</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VIASET Intelligence Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">
            Designed for Semiconductor & Electronics Supply-Chain Discovery
          </p>
        </div>
      </div>
    </footer>
  );
};
