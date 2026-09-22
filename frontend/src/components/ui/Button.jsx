import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary: 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white shadow-md shadow-sky-600/20 focus:ring-sky-500 hover:shadow-lg hover:shadow-sky-600/30 active:scale-[0.98]',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md focus:ring-slate-700 active:scale-[0.98]',
    outline: 'border border-slate-200 hover:border-sky-300 bg-white hover:bg-sky-50/50 text-slate-700 hover:text-sky-700 focus:ring-sky-500 shadow-sm active:scale-[0.98]',
    ghost: 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/60 focus:ring-sky-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md focus:ring-rose-500 active:scale-[0.98]',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md focus:ring-emerald-500 active:scale-[0.98]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold rounded-2xl',
    xl: 'px-8 py-4 text-lg gap-3 font-semibold rounded-2xl'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
