import React from 'react';
import { HeaderBar } from '@/components/HeaderBar';
import { Footer } from '@/components/Footer';
import { AlertCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, lastUpdated = 'October 2026', children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <HeaderBar
        cartCount={0}
        wishlistCount={0}
        currentScreen="home"
      />

      <main className="flex-1 container max-w-3xl py-12 px-4">
        {/* Mandatory Draft Notice */}
        <div className="mb-8 p-4 border border-ink/40 bg-paper-2 text-ink flex items-start gap-3 shadow-[2px_2px_0_var(--ink)]">
          <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 font-mono">
            <strong className="font-bold text-accent uppercase tracking-wider block">
              [DRAFT — Needs Legal Review]
            </strong>
            <p className="text-ink/80 text-[11px] leading-relaxed">
              Operational draft for Vernika Enterprises. Reviewed against Indian e-commerce consumer guidelines (Consumer Protection Act 2019, E-Commerce Rules 2020) prior to commercial checkout.
            </p>
          </div>
        </div>

        <article className="bg-paper border border-line p-6 sm:p-10 shadow-[3px_3px_0_var(--ink)]">
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-accent mb-1">
            STATUTORY ARCHIVE
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink uppercase tracking-tight mb-2">
            {title}
          </h1>
          <p className="font-mono text-[11px] text-ink/60 uppercase tracking-wider mb-8 pb-4 border-b border-line">
            REVISED: {lastUpdated} • {siteConfig.name} • ARTIST {siteConfig.artist}
          </p>

          <div className="space-y-6 text-sm text-ink/90 leading-relaxed font-sans">
            {children}
          </div>
        </article>
      </main>

      <Footer variant="compact" />
    </div>
  );
}
