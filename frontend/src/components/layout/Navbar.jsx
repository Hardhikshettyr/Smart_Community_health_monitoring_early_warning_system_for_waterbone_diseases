import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Droplets, ShieldCheck, History, FileSpreadsheet, Activity, User, LogOut, Menu, X, Users } from 'lucide-react';
import Button from '../ui/Button';

export function Navbar() {
  const { user, isAuthenticated, isHealthWorkerOrAdmin, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `flex items-center gap-2 text-sm font-semibold transition-colors duration-200 py-1.5 px-3 rounded-xl ${
      isActive(path)
        ? 'text-sky-700 bg-sky-50 font-bold'
        : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform duration-200">
              <Droplets className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-xl font-extrabold font-heading text-slate-900 tracking-tight flex items-center gap-1.5">
                AquaSentinel
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-widest block -mt-1">
                Water Safety Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={linkClasses('/')}>
              Home
            </Link>

            <Link to="/check" className={linkClasses('/check')}>
              Check Water
            </Link>

            <Link to="/about" className={linkClasses('/about')}>
              <ShieldCheck className="w-4 h-4" />
              Reliability & Trust
            </Link>

            {isAuthenticated && (
              <Link to="/history" className={linkClasses('/history')}>
                <History className="w-4 h-4" />
                Past Analysis
              </Link>
            )}

            {isHealthWorkerOrAdmin && (
              <>
                <Link to="/bulk-check" className={linkClasses('/bulk-check')}>
                  <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                  Bulk Analysis
                </Link>

                <Link to="/community-health" className={linkClasses('/community-health')}>
                  <Activity className="w-4 h-4 text-sky-600" />
                  Community Health
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin/history" className={linkClasses('/admin/history')}>
                <Users className="w-4 h-4 text-amber-600" />
                All Records
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.email}</span>
                  {user?.role === 'asha_worker' && (
                    <span className="bg-sky-200 text-sky-900 text-[10px] px-1.5 py-0.5 rounded font-bold">
                      Health Worker
                    </span>
                  )}
                  {user?.role === 'admin' && (
                    <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-bold">
                      Admin
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                  className="text-slate-500 hover:text-rose-600"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={linkClasses('/')}>
            Home
          </Link>
          <Link to="/check" onClick={() => setMobileMenuOpen(false)} className={linkClasses('/check')}>
            Check Water Safety
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={linkClasses('/about')}>
            Reliability & Trust
          </Link>

          {isAuthenticated && (
            <Link to="/history" onClick={() => setMobileMenuOpen(false)} className={linkClasses('/history')}>
              Past Analysis
            </Link>
          )}

          {isHealthWorkerOrAdmin && (
            <>
              <Link to="/bulk-check" onClick={() => setMobileMenuOpen(false)} className={linkClasses('/bulk-check')}>
                Bulk CSV Analysis
              </Link>
              <Link to="/community-health" onClick={() => setMobileMenuOpen(false)} className={linkClasses('/community-health')}>
                Community Health Surveillance
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin/history" onClick={() => setMobileMenuOpen(false)} className={linkClasses('/admin/history')}>
              All Organization Records
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">Signed in as {user?.email}</p>
                <Button variant="danger" size="sm" onClick={handleLogout} className="w-full">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
