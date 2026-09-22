import React from 'react';
import { getVerdictConfig } from '../../lib/verdictHelpers';
import { CheckCircle2, AlertTriangle, ShieldAlert, AlertOctagon, Download, MapPin, Globe } from 'lucide-react';
import Button from '../ui/Button';

export function VerdictBanner({ verdict, riskScore, location, regionProfile, onDownloadReport, isDownloading }) {
  const config = getVerdictConfig(verdict);

  const renderIcon = () => {
    switch (config.iconName) {
      case 'AlertOctagon':
        return <AlertOctagon className="w-10 h-10 text-rose-600 shrink-0" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-10 h-10 text-orange-600 shrink-0" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-10 h-10 text-amber-600 shrink-0" />;
      default:
        return <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />;
    }
  };

  return (
    <div className={`rounded-3xl border ${config.border} ${config.bgLight} p-6 sm:p-8 shadow-card transition-all duration-300`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
            {renderIcon()}
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${config.badgeBg}`}>
                {config.label}
              </span>

              {location && (
                <span className="text-xs text-slate-500 flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {location}
                </span>
              )}

              {regionProfile && (
                <span className="text-xs text-slate-500 flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200 capitalize">
                  <Globe className="w-3 h-3 text-slate-400" />
                  {regionProfile} Standard
                </span>
              )}
            </div>

            <h2 className={`text-2xl sm:text-3xl font-extrabold font-heading ${config.text} tracking-tight`}>
              {config.summaryText}
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
              {config.subtitle}
            </p>
          </div>
        </div>

        {onDownloadReport && (
          <div className="shrink-0 flex items-center">
            <Button
              variant="outline"
              size="md"
              icon={Download}
              isLoading={isDownloading}
              onClick={onDownloadReport}
              className="bg-white hover:bg-slate-50 shadow-sm"
            >
              Download Full Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerdictBanner;
