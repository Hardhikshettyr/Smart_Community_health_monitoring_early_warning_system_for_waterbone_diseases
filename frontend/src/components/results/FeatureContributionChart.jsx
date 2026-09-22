import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PARAMETER_META } from '../../lib/verdictHelpers';

export function FeatureContributionChart({ featureContributions = {} }) {
  // Convert feature object or array into formatted chart items with plain-language labels
  const data = Object.entries(featureContributions)
    .map(([key, val]) => {
      const normalizedKey = key.toLowerCase();
      const meta = PARAMETER_META[normalizedKey] || { label: key };
      const impactScore = Math.abs(Number(val));
      return {
        key: normalizedKey,
        name: meta.label,
        impact: Math.round(impactScore * 100) / 100,
        raw: val
      };
    })
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 5);

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Primary Factors Influencing Safety Score
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Top physical and chemical attributes affecting this sample verdict</p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
              width={180}
            />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sky-300">Relative Influence Score: {item.impact}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="impact" radius={[0, 8, 8, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#0EA5E9' : index === 1 ? '#38BDF8' : '#7DD3FC'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FeatureContributionChart;
