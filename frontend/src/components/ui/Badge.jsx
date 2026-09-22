import React from 'react';

export function Badge({ children, variant = 'sky', className = '' }) {
  const variants = {
    sky: 'bg-sky-100 text-sky-800 border-sky-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.sky} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
