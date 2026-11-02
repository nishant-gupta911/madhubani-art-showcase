'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Seal, Barcode, WaveLine } from '@/components/ui/Ornaments';
import { PosterStage } from './PosterStage.client';

interface PosterFooterProps {
  variant?: 'poster' | 'compact';
  sellerCity?: string;
  sellerState?: string;
}

export function PosterFooter({
  variant = 'poster',
  sellerCity = siteConfig.sellerCity || 'Faridabad',
  sellerState = siteConfig.sellerState || 'Haryana',
}: PosterFooterProps) {
  const isCompact = variant === 'compact';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-paper border-t border-line text-ink selection:bg-accent selection:text-paper relative overflow-hidden">
      {/* ── 1. Top Header Row: Seal | Origin Label | Barcode ── */}
      <div className="container py-6 border-b border-line flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Seal size={52} />
          <div className="hidden sm:block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted leading-tight">
            <span>STUDIO ARCHIVE</span>
            <span className="block text-accent font-semibold">ORIGINAL FOLK ART</span>
          </div>
        </div>

        <div className="text-center">
          <span className="font-mono text-xs sm:text-sm tracking-[0.26em] uppercase text-ink font-semibold">
            HANDPAINTED IN {sellerCity.toUpperCase()}, {sellerState.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Barcode width={110} />
        </div>
      </div>

      {/* ── 2. Full Poster Stage (Only for variant="poster") ── */}
      {!isCompact && (
        <div className="container pt-8 pb-4 relative">
          <PosterStage />
        </div>
      )}

      {/* ── 3. Giant Condensed Wordmark Band ── */}
      <div className="w-full bg-ink text-paper py-3 sm:py-5 border-y border-line overflow-hidden select-none">
        <div className="container flex items-center justify-between">
          <h2 className="font-display text-5xl sm:text-7xl md:text-9xl text-paper tracking-tight uppercase leading-none font-normal">
            VERNIKA
          </h2>
          <span className="hidden md:block font-mono text-xs tracking-[0.3em] uppercase text-turmeric font-semibold pr-4">
            MITHILA ART GALLERY · NATASHA GUPTA
          </span>
        </div>
      </div>

      {/* ── 4. Real Link Columns (Server-Rendered for SEO & no-JS) ── */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Col 1: Shop */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs tracking-[0.24em] uppercase text-accent font-semibold">
              01 / SHOP
            </h3>
            <ul className="space-y-2 font-mono text-xs tracking-wider uppercase text-ink-soft">
              <li>
                <Link href="/shop/category/paintings" className="hover:text-accent transition-colors">
                  Paintings
                </Link>
              </li>
              <li>
                <Link href="/shop/category/dupattas" className="hover:text-accent transition-colors">
                  Dupattas & Apparel
                </Link>
              </li>
              <li>
                <Link href="/shop/category/bags_and_files" className="hover:text-accent transition-colors">
                  Bags & Organizers
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-accent transition-colors">
                  Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Learn */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs tracking-[0.24em] uppercase text-accent font-semibold">
              02 / HERITAGE
            </h3>
            <ul className="space-y-2 font-mono text-xs tracking-wider uppercase text-ink-soft">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Natasha Gupta
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  Mithila Art Tradition
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-accent transition-colors">
                  Art Portfolio (PDF)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Assistance */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs tracking-[0.24em] uppercase text-accent font-semibold">
              03 / ORDERS
            </h3>
            <ul className="space-y-2 font-mono text-xs tracking-wider uppercase text-ink-soft">
              <li>
                <Link href="/track" className="hover:text-accent transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-accent transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-accent transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-accent transition-colors">
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs tracking-[0.24em] uppercase text-accent font-semibold">
              04 / TRUST
            </h3>
            <ul className="space-y-2 font-mono text-xs tracking-wider uppercase text-ink-soft">
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-accent transition-colors">
                  Grievance Officer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Custom Commissions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Studio Direct Contact */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-line">
            <h3 className="font-mono text-xs tracking-[0.24em] uppercase text-accent font-semibold">
              05 / REACH US
            </h3>
            <div className="font-mono text-xs tracking-wider space-y-2 text-ink-soft">
              <p>Studio: {sellerCity}, {sellerState}</p>
              <p>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors block text-ink font-semibold"
                >
                  WhatsApp: +{siteConfig.contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-accent transition-colors block text-ink"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Wave Scallop Ground Line ── */}
      <WaveLine className="mt-2" />

      {/* ── 6. Bottom Legal Bar ── */}
      <div className="container py-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] tracking-widest uppercase text-ink-muted">
        <div>
          © {currentYear} VERNIKA ENTERPRISES · ALL RIGHTS RESERVED
        </div>
        <div className="flex items-center gap-4">
          <span>GENUINE MITHILA ART</span>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-accent transition-colors font-semibold"
          >
            TOP ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
