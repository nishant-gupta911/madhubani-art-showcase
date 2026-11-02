import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'indigo' | 'leaf';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-paper text-ink border-line',
    accent: 'bg-accent/10 text-accent border-accent',
    indigo: 'bg-indigo/10 text-indigo border-indigo',
    leaf: 'bg-leaf/10 text-leaf border-leaf',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-mono tracking-[0.18em] uppercase font-semibold ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}
