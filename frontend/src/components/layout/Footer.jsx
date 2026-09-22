import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Shield, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <Droplets className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold font-heading text-white tracking-tight">AquaSentinel</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Instant, science-backed water safety analysis designed for families, health workers, and public health officers worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-emerald-400" />
              Verified Public Health Guidelines Compliant
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/check" className="hover:text-sky-400 transition-colors">
                  Check Water Sample
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sky-400 transition-colors">
                  Reliability & Science
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-sky-400 transition-colors">
                  Analysis Timeline
                </Link>
              </li>
              <li>
                <Link to="/bulk-check" className="hover:text-sky-400 transition-colors">
                  Community Bulk Analysis
                </Link>
              </li>
            </ul>
          </div>

          {/* Health & Safety */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Health Guidance</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                Drinking Water Safety Limits
              </li>
              <li className="hover:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                Boil Water Advisories Guide
              </li>
              <li className="hover:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                Community Filtration Methods
              </li>
              <li className="hover:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                Symptom Reporting Protocol
              </li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Public Safety</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              If you suspect severe water contamination in your local supply, notify your local municipal health authority immediately.
            </p>
            {/* <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">Emergency Water Line</p>
              <p className="text-sky-400">1-800-SAFE-WATER</p>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AquaSentinel Public Health Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed for public health and community safety</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
