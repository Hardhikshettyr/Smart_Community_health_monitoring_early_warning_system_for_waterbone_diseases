import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  padding = 'p-6',
  ...props
}) {
  const baseClasses = 'bg-white rounded-2xl border border-slate-100 shadow-card';
  const glassClasses = glass ? 'glass-panel' : '';
  const hoverClasses = hoverEffect ? 'shadow-card-hover hover:border-sky-200' : '';

  return (
    <div className={`${baseClasses} ${glassClasses} ${hoverClasses} ${padding} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-bold text-slate-900 tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-sm text-slate-500 mt-1 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export default Card;
