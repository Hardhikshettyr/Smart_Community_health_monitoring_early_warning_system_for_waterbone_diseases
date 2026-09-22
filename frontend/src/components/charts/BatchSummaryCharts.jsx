import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export function BatchSummaryCharts({ summaryData }) {
  if (!summaryData) return null;

  const verdictCounts = summaryData.verdictCounts || {
    Safe: summaryData.safeCount || 0,
    Marginal: summaryData.marginalCount || 0,
    Unsafe: summaryData.unsafeCount || 0,
    'Critically Unsafe': summaryData.criticalCount || 0
  };

  const pieData = [
    { name: 'Safe to Drink', value: verdictCounts.Safe || 0, color: '#10B981' },
    { name: 'Requires Caution', value: verdictCounts.Marginal || 0, color: '#F59E0B' },
    { name: 'Unsafe', value: verdictCounts.Unsafe || 0, color: '#F97316' },
    { name: 'Critical Risk', value: verdictCounts['Critically Unsafe'] || 0, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const topViolationsData = summaryData.topViolations || [
    { issue: 'High Cloudiness (Turbidity)', count: 14 },
    { issue: 'Acid-Base Variation (pH)', count: 9 },
    { issue: 'High Disinfectant (Chloramines)', count: 6 },
    { issue: 'Elevated Mineral Hardness', count: 4 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Verdict Breakdown Pie Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col items-center">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-1">
          Safety Verdict Distribution
        </h4>
        <p className="text-xs text-slate-400 mb-4">Percentage breakdown across all uploaded samples</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sky-300">{item.value} Water Samples</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Violations Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col items-center">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-1">
          Most Common Safety Variations
        </h4>
        <p className="text-xs text-slate-400 mb-4">Frequency of parameter guideline exceedances</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topViolationsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="issue"
                tick={{ fill: '#64748B', fontSize: 10 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs">
                        <p className="font-bold">{item.issue}</p>
                        <p className="text-amber-300">{item.count} Samples Affected</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#0EA5E9" radius={[8, 8, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default BatchSummaryCharts;
