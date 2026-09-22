import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatRiskScore, getVerdictConfig } from '../../lib/verdictHelpers';

export function RiskGauge({ riskScore = 0, verdict = 'Safe' }) {
  const score = formatRiskScore(riskScore);
  const config = getVerdictConfig(verdict);

  // Gauge data: score out of 100
  const data = [
    { name: 'Risk', value: score },
    { name: 'Remaining', value: Math.max(0, 100 - score) }
  ];

  const getColor = (s) => {
    if (s < 30) return '#10B981'; // safe green
    if (s < 60) return '#F59E0B'; // amber caution
    if (s < 80) return '#F97316'; // orange unsafe
    return '#EF4444'; // rose critical
  };

  const activeColor = getColor(score);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col items-center justify-center text-center">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Overall Risk Index</h4>
      
      <div className="relative w-48 h-32 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              <Cell key="cell-0" fill={activeColor} />
              <Cell key="cell-1" fill="#F1F5F9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-14 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            {score}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1">
            out of 100
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeColor }} />
        <span className="text-xs font-bold text-slate-700 capitalize">
          {score < 30 ? 'Low Health Risk' : score < 60 ? 'Moderate Health Risk' : score < 80 ? 'Elevated Health Risk' : 'Critical Health Hazard'}
        </span>
      </div>

      <p className="text-[11px] text-slate-500 mt-2 max-w-[200px]">
        Calculated from multi-parameter chemical & physical safety thresholds.
      </p>
    </div>
  );
}

export default RiskGauge;
