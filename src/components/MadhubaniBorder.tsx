import React from 'react';

interface MadhubaniBorderProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'red' | 'dark' | 'light' | 'hairline';
}

export const MadhubaniBorder: React.FC<MadhubaniBorderProps> = ({
  children,
  className = '',
  variant = 'hairline',
}) => {
  const borderStyles = {
    red: 'border-[var(--vermilion)] bg-[var(--vermilion-tint)] text-[var(--ink)]',
    dark: 'border-[var(--hairline-dark)] bg-[var(--night-soft)] text-[var(--ivory)]',
    light: 'border-[var(--hairline-soft)] bg-[var(--ivory)] text-[var(--ink)]',
    hairline: 'border-[var(--hairline)] bg-[var(--ivory-deep)] text-[var(--ink)]',
  };

  return (
    <div className={`relative p-4 border rounded-sm ${borderStyles[variant]} ${className}`}>
      {/* Precision corner registration crosshairs */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--vermilion)]" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[var(--vermilion)]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[var(--vermilion)]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--vermilion)]" />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
