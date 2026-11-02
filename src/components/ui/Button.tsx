import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ink' | 'ghost' | 'turmeric';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'ink',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono uppercase tracking-[0.16em] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none border text-center font-semibold';

    const sizeStyles = {
      sm: 'text-[11px] px-3 py-1.5 min-h-[36px]',
      md: 'text-[12px] px-5 py-2.5 min-h-[48px]',
      lg: 'text-[13px] px-7 py-3.5 min-h-[54px]',
    }[size];

    const variantStyles = {
      primary:
        'bg-accent text-paper border-accent shadow-[2px_2px_0_var(--ink)] hover:bg-accent-hover hover:shadow-[3px_3px_0_var(--ink)] hover:-translate-x-[1px] hover:-translate-y-[1px]',
      ink:
        'bg-ink text-paper border-ink shadow-[2px_2px_0_var(--accent)] hover:shadow-[3px_3px_0_var(--accent-hover)] hover:-translate-x-[1px] hover:-translate-y-[1px]',
      ghost:
        'bg-transparent text-ink border-ink hover:bg-paper-2 hover:shadow-[2px_2px_0_var(--accent)] hover:-translate-x-[1px] hover:-translate-y-[1px]',
      turmeric:
        'bg-turmeric text-ink border-ink shadow-[2px_2px_0_var(--ink)] hover:brightness-95 hover:shadow-[3px_3px_0_var(--ink)]',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 border-2 border-paper border-t-transparent rounded-full animate-spin" />
            <span>LOADING...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
