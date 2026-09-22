import React from 'react';
import { getRiskSeverityBadge } from '../../lib/verdictHelpers';
import { Activity, ShieldAlert, HeartPulse, Info } from 'lucide-react';

export function DiseaseRiskList({ diseaseRisks = [] }) {
  if (!diseaseRisks || diseaseRisks.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-500" />
          Health Impact Assessment
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
          No heightened waterborne pathogen or chemical toxicity health risks were detected in this sample profile.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          Potential Waterborne Health Risks
        </h3>
        <span className="text-xs text-slate-400 font-medium">Based on biological & chemical correlation</span>
      </div>

      <div className="space-y-3">
        {diseaseRisks.map((item, idx) => {
          const diseaseName = item.disease || item.name || 'Waterborne Pathogen Risk';
          const severity = item.severity || item.riskLevel || 'Moderate';
          const badge = getRiskSeverityBadge(severity);
          const description = item.description || item.reason || 'Elevated risk associated with specific chemical or turbidity imbalances.';

          return (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-sm font-bold text-slate-900">{diseaseName}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DiseaseRiskList;
