import React from 'react';
import { HeaderBar } from '@/components/HeaderBar';
import { AlertCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, lastUpdated = 'October 2026', children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ivory)' }}>
      <HeaderBar
        cartCount={0}
        wishlistCount={0}
        currentScreen="home"
      />

      <main className="flex-1 container max-w-3xl py-12 px-4">
        {/* Mandatory Draft Notice */}
        <div className="mb-8 p-4 rounded-md bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <strong className="font-semibold text-sm">[DRAFT — Needs Legal Review]</strong>
            <p>
              This document is a operational draft prepared for Vernika Enterprises.
              It must be reviewed by legal counsel and certified against applicable Indian e-commerce laws (Consumer Protection Act 2019, E-Commerce Rules 2020) prior to commercial scale.
            </p>
          </div>
        </div>

        <article className="bg-white p-8 md:p-12 rounded-lg border border-ivory-dimmed shadow-sm prose prose-stone max-w-none">
          <h1 className="font-display font-bold text-3xl text-ink mb-1">{title}</h1>
          <p className="text-xs text-ink-muted mb-8 pb-4 border-b border-gray-100">
            Last Updated: {lastUpdated} • {siteConfig.name} by {siteConfig.artist}
          </p>

          <div className="space-y-6 text-sm text-ink-soft leading-relaxed">
            {children}
          </div>
        </article>
      </main>
    </div>
  );
}
