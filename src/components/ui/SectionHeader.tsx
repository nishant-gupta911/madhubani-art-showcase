import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({
  kicker,
  title,
  linkHref,
  linkLabel = 'VIEW ALL',
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`mb-8 pb-4 border-b border-line flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${className}`}>
      <div>
        {kicker && (
          <div className="font-mono text-[11px] tracking-[0.24em] uppercase text-accent font-semibold mb-1">
            {kicker}
          </div>
        )}
        <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-tight uppercase leading-[0.9]">
          {title}
        </h2>
      </div>

      {linkHref && (
        <Link
          href={linkHref}
          className="inline-flex items-center gap-1 font-mono text-xs tracking-[0.18em] uppercase text-ink-muted hover:text-accent font-semibold transition-colors pb-1 shrink-0"
        >
          <span>{linkLabel}</span>
          <ArrowUpRight size={14} className="text-accent" />
        </Link>
      )}
    </div>
  );
}
