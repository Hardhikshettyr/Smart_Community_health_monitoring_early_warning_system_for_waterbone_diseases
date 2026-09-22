import React from 'react';
import { PARAMETER_META } from '../../lib/verdictHelpers';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function ViolationCards({ violations = [], parameters = {} }) {
  if (!violations || violations.length === 0) {
    return (
      <div className="bg-emerald-50/60 rounded-3xl p-6 border border-emerald-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-900">Zero Threshold Violations Detected</h4>
          <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
            All tested physical and chemical factors comply with official drinking water safety guidelines.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          Key Safety Variations ({violations.length})
        </h3>
        <span className="text-xs text-slate-500 font-medium">Compared against public health guidelines</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {violations.map((v, idx) => {
          const paramKey = typeof v === 'string' ? v.toLowerCase() : v.parameter?.toLowerCase() || '';
          const meta = PARAMETER_META[paramKey] || {
            label: v.parameter || v,
            standardRange: 'Standard',
            description: v.explanation || 'Reading departs from normal recommended thresholds.'
          };

          const recordedVal = v.value !== undefined ? v.value : parameters[paramKey] || 'Out of bounds';

          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-amber-300 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{meta.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Recommended limit: {meta.standardRange} {meta.unit}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shrink-0">
                  Recorded: {recordedVal} {meta.unit}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mt-3">
                {v.explanation || meta.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ViolationCards;
