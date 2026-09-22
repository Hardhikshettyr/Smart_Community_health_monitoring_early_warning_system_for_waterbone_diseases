import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function RecommendationList({ recommendations = [], verdict = 'Safe' }) {
  const defaultRecs = {
    'Safe': [
      'Water sample complies with health safety limits — safe for immediate drinking and cooking.',
      'Maintain routine source inspection and clean storage containers regularly.',
      'Schedule a periodic follow-up safety check in 3-6 months.'
    ],
    'Marginal': [
      'Boil water vigorously for at least 3 minutes before drinking or preparing food.',
      'Use a standard activated carbon pitcher filter to reduce excess minerals and chloramines.',
      'Inspect storage tanks and pipeline junctions for minor sediment accumulation.',
      'Retest source within 14 days to monitor safety stability.'
    ],
    'Unsafe': [
      'DO NOT consume this water directly without boiling and multi-stage filtration.',
      'Switch to certified bottled or purified emergency water supplies for drinking and infants.',
      'Notify your local water management officer or community health representative.',
      'Conduct a thorough deep-clean of storage tanks and inlet pipes.'
    ],
    'Critically Unsafe': [
      'EMERGENCY ADVISORY: Immediately stop using this water for drinking, cooking, or bathing.',
      'Distribute emergency clean water supplies to all affected household members.',
      'Report critical contamination reading to public health authorities immediately.',
      'Require professional chemical and microbial sanitization before reusing source.'
    ]
  };

  const listToDisplay = recommendations.length > 0 ? recommendations : defaultRecs[verdict] || defaultRecs['Safe'];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
        <ArrowRight className="w-4 h-4 text-sky-600" />
        Recommended Safety Actions
      </h3>

      <div className="space-y-3">
        {listToDisplay.map((rec, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {rec}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendationList;
