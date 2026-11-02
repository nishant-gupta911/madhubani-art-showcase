'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface PrintCardProps {
  id: string;
  refCode?: string;
  name: string;
  slug: string;
  image: string;
  pricePaise: number;
  category?: string;
  isOriginal?: boolean;
  stock?: number;
  priority?: boolean;
}

export function PrintCard({
  refCode = 'FIG.',
  name,
  slug,
  image,
  pricePaise,
  isOriginal = false,
  stock = 1,
  priority = false,
}: PrintCardProps) {
  const isSoldOut = isOriginal && stock <= 0;
  const priceFormatted = `₹${(pricePaise / 100).toLocaleString('en-IN')}`;

  return (
    <article className="group relative flex flex-col bg-paper border border-line p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-[3px_3px_0_var(--accent)]">
      {/* 4:5 Archival Art Matting Mount */}
      <Link href={`/shop/${slug}`} className="block relative aspect-[4/5] bg-paper-2 border border-line overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority={priority}
        />

        {/* SOLD Woodblock Stamp */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-ink/30 flex items-center justify-center p-4">
            <span className="font-display text-accent bg-paper px-4 py-1.5 border-2 border-accent text-xl tracking-wider uppercase -rotate-6 shadow-[2px_2px_0_var(--ink)]">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Framing Tag if Original */}
        {isOriginal && !isSoldOut && (
          <div className="absolute top-2 left-2 bg-paper/95 border border-line px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase text-ink">
            ORIGINAL · 1 OF 1
          </div>
        )}
      </Link>

      {/* Monospace Caption Row */}
      <div className="mt-3 pt-2 border-t border-line flex items-baseline justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link href={`/shop/${slug}`} className="block group-hover:text-accent transition-colors">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted block truncate">
              {refCode}
            </span>
            <h3 className="font-sans font-medium text-xs sm:text-sm text-ink truncate mt-0.5 leading-snug">
              {name}
            </h3>
          </Link>
        </div>

        <div className="shrink-0 text-right">
          <span className="font-mono font-bold text-xs sm:text-sm text-ink">
            {priceFormatted}
          </span>
        </div>
      </div>
    </article>
  );
}
