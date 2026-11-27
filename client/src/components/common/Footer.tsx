import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Database, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-saas-border text-saas-secondary text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-saas-accent text-white flex items-center justify-center">
                <Cpu size={16} />
              </div>
              <span className="font-extrabold text-saas-primary text-sm tracking-tight">VIASET</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Specialized B2B supply-chain intelligence and partner discovery platform purpose-built for the semiconductor, microelectronics, and advanced packaging ecosystem.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-teal-800 font-mono">
              <ShieldCheck size={14} className="text-teal-600" />
              <span>Verified Industry Intelligence</span>
            </div>
          </div>

          {/* Ecosystem Verticals */}
          <div>
            <h4 className="text-[11px] font-bold text-saas-primary uppercase tracking-wider mb-2.5">
              Industry Verticals
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/app/discovery?category=semiconductor-foundry" className="hover:text-saas-primary">Semiconductor Foundries</Link></li>
              <li><Link to="/app/discovery?category=ic-design-fabless" className="hover:text-saas-primary">Fabless IC Design Houses</Link></li>
              <li><Link to="/app/discovery?category=osat-packaging" className="hover:text-saas-primary">OSAT Packaging & Test</Link></li>
              <li><Link to="/app/discovery?category=pcb-fabrication" className="hover:text-saas-primary">High-Density Interconnect PCBs</Link></li>
              <li><Link to="/app/discovery?category=pcb-assembly-ems" className="hover:text-saas-primary">Electronics Manufacturing Services</Link></li>
              <li><Link to="/app/discovery?category=passive-components" className="hover:text-saas-primary">Passive & Active Components</Link></li>
            </ul>
          </div>

          {/* Platform Capabilities */}
          <div>
            <h4 className="text-[11px] font-bold text-saas-primary uppercase tracking-wider mb-2.5">
              Platform Features
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/app/matching" className="hover:text-saas-primary">Explainable Matching Engine</Link></li>
              <li><Link to="/app/discovery" className="hover:text-saas-primary">Multi-Facet Parameter Search</Link></li>
              <li><Link to="/app/workspace" className="hover:text-saas-primary">Supplier Sourcing Pipeline</Link></li>
              <li><Link to="/app/opportunities" className="hover:text-saas-primary">Business Opportunities</Link></li>
              <li><Link to="/app/analytics" className="hover:text-saas-primary">Supply-Chain Analytics</Link></li>
              <li><Link to="/app/subscription" className="hover:text-saas-primary">Enterprise Subscription Plans</Link></li>
            </ul>
          </div>

          {/* Academic Attribution & Standards */}
          <div>
            <h4 className="text-[11px] font-bold text-saas-primary uppercase tracking-wider mb-2.5">
              Academic Standards
            </h4>
            <p className="text-[11px] leading-relaxed mb-3">
              Major Academic Project — Final-Year B.Tech Computer Engineering. Built following industry-grade SaaS architecture, relational database normalization, and explainable scoring heuristics.
            </p>
            <div className="flex flex-col gap-1 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><Layers size={12} /> React 18 / TypeScript / Tailwind</span>
              <span className="flex items-center gap-1.5"><Database size={12} /> Node.js / Prisma ORM / SQLite</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-saas-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-saas-secondary">
          <p>© {new Date().getFullYear()} VIASET Intelligence Platform. All rights reserved.</p>
          <p className="mt-1 sm:mt-0 font-mono text-[10px] text-slate-400">
            Designed for Semiconductor & Electronics Supply-Chain Discovery
          </p>
        </div>
      </div>
    </footer>
  );
};
