'use client';

import React from 'react';

interface MarqueeTickerProps {
  items?: string[];
  className?: string;
}

export function MarqueeTicker({
  items = [
    'FISH (MATSYA)',
    'PEACOCK (MAYURA)',
    'LOTUS (KAMAL)',
    'SUN (SURYA)',
    'TREE OF LIFE',
    'SERRATED LEAF',
    'SACRED RIVER WAVE',
  ],
  className = '',
}: MarqueeTickerProps) {
  const content = items.join('  ·  ');

  return (
    <div
      className={`w-full overflow-hidden border-y border-line bg-paper-2 py-2.5 select-none ${className}`}
      role="region"
      aria-label="Motif ticker"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        <span className="font-mono text-xs sm:text-sm tracking-[0.28em] uppercase text-ink-soft px-4 font-semibold whitespace-nowrap">
          {content}  ·  {content}  ·  
        </span>
        <span className="font-mono text-xs sm:text-sm tracking-[0.28em] uppercase text-ink-soft px-4 font-semibold whitespace-nowrap">
          {content}  ·  {content}  ·  
        </span>
      </div>
    </div>
  );
}
