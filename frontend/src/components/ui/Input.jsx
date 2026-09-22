import React from 'react';
import { HelpCircle } from 'lucide-react';

export function Input({
  label,
  helperText,
  tooltip,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            {label}
          </label>
          {tooltip && (
            <div className="group relative flex items-center cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-sky-600 transition-colors" />
              <div className="absolute right-0 bottom-full mb-2 hidden w-64 rounded-xl bg-slate-900 p-3 text-xs text-slate-200 shadow-xl group-hover:block z-50 pointer-events-none">
                {tooltip}
                <div className="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 hover:border-slate-300 focus:border-sky-500'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;
