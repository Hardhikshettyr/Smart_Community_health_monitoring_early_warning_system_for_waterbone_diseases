import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';

export function ConfidenceIndicator({ confidenceScore = 0.92, isBorderline = false }) {
  const percentage = Math.round(Number(confidenceScore) * 100);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isBorderline ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Analysis Precision</h5>
          <p className="text-sm font-bold text-slate-900 mt-0.5">
            {isBorderline ? 'Borderline Sample — Secondary Verification Recommended' : `${percentage}% High Certainty Rating`}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${isBorderline ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-sky-50 text-sky-800 border-sky-200'}`}>
          {isBorderline ? 'Borderline Reading' : 'High Reliability'}
        </span>
      </div>
    </div>
  );
}

export default ConfidenceIndicator;
