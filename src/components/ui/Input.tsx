import React, { InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-paper border ${
              error ? 'border-accent ring-1 ring-accent' : 'border-line focus:border-ink focus:ring-2 focus:ring-accent'
            } px-3.5 py-2.5 text-[16px] text-ink placeholder:text-ink-muted/50 rounded-none transition-all outline-none font-sans ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="flex items-center gap-1 font-mono text-[11px] text-accent mt-1 tracking-wider uppercase font-medium">
            <AlertCircle size={13} className="shrink-0" />
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="font-mono text-[11px] text-ink-muted mt-1 tracking-wider">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
