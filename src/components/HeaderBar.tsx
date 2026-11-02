'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ScreenType } from '../types';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface HeaderBarProps {
  currentScreen?: ScreenType;
  onSelectScreen?: (s: ScreenType) => void;
  cartCount?: number;
  wishlistCount?: number;
  onSearch?: (q: string) => void;
  user?: { name: string; email: string } | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

const NAV_LINKS: { id: ScreenType; label: string }[] = [
  { id: 'shop',      label: 'Shop' },
  { id: 'portfolio', label: 'Portfolio (PDF)' },
  { id: 'about',     label: 'About the Art' },
  { id: 'contact',   label: 'Commissions' },
];

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentScreen = 'home',
  onSelectScreen,
  cartCount = 0,
  wishlistCount = 0,
  user = null,
  onOpenAuth = () => {},
  onLogout = () => {},
}) => {
  const navigate = (s: ScreenType) => {
    if (onSelectScreen) {
      onSelectScreen(s);
    } else if (typeof window !== 'undefined') {
      window.location.href = s === 'home' ? '/' : `/${s === 'portfolio' ? 'gallery' : s}`;
    }
  };

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [scrolled,     setScrolled]     = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on screen change
  useEffect(() => { setMobileOpen(false); }, [currentScreen]);

  const isActive = (id: ScreenType) => currentScreen === id;

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-line selection:bg-accent selection:text-paper">
        {/* ─── Announcement Bar (Ink background with mono micro-type) ─── */}
        <div className="bg-ink text-paper py-2 text-center border-b border-line">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase font-medium px-4">
            FREE SHIPPING ACROSS INDIA OVER ₹1,499 · FRAMED PAINTINGS SHIP FREE · HANDPAINTED BY NATASHA GUPTA
          </p>
        </div>

        {/* ─── Main Nav Bar ─── */}
        <div className="container">
          <div className="flex items-center justify-between h-16 sm:h-[68px]">

            {/* Logo: Screen-Printed Poster Wordmark */}
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-3 shrink-0 text-left cursor-pointer group"
              aria-label="Vernika Enterprises Homepage"
            >
              <div className="w-9 h-9 border border-line bg-paper p-0.5 flex items-center justify-center shrink-0 group-hover:shadow-[2px_2px_0_var(--accent)] transition-all">
                <Image src="/vernika-enterprises.webp" alt="Vernika Logo" width={32} height={32} priority />
              </div>
              <div className="leading-none">
                <div className="font-display text-xl sm:text-2xl tracking-tight text-ink uppercase group-hover:text-accent transition-colors">
                  VERNIKA
                </div>
                <div className="font-mono text-[9px] tracking-[0.26em] text-accent uppercase font-medium mt-0.5">
                  MITHILA ART GALLERY
                </div>
              </div>
            </button>

            {/* Desktop Nav in Monospace */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className={`relative py-1 font-mono text-xs tracking-[0.2em] uppercase font-semibold transition-colors cursor-pointer ${
                    isActive(link.id)
                      ? 'text-accent'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {link.label}
                  {isActive(link.id) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(o => !o)}
                className="w-9 h-9 border border-line flex items-center justify-center text-ink hover:text-accent hover:border-ink transition-colors cursor-pointer"
                aria-label="Search Catalog"
              >
                <Search size={15} />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => navigate('profile')}
                className="w-9 h-9 border border-line flex items-center justify-center text-ink hover:text-accent hover:border-ink transition-colors relative cursor-pointer"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart size={15} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-paper font-mono text-[9px] font-bold flex items-center justify-center rounded-none border border-ink">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart: CART [ 2 ] */}
              <button
                onClick={() => navigate('cart')}
                className={`flex items-center gap-2 px-3 py-1.5 border font-mono text-xs tracking-[0.16em] uppercase font-bold transition-all cursor-pointer ${
                  cartCount > 0
                    ? 'bg-accent text-paper border-accent shadow-[2px_2px_0_var(--ink)] hover:bg-accent-hover'
                    : 'bg-paper text-ink border-ink hover:shadow-[2px_2px_0_var(--accent)] hover:-translate-x-[1px] hover:-translate-y-[1px]'
                }`}
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingBag size={14} />
                <span>CART [ {cartCount} ]</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="w-9 h-9 border border-line flex md:hidden items-center justify-center text-ink hover:border-ink transition-colors cursor-pointer ml-1"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          {/* Search Bar — expands below nav */}
          {searchOpen && (
            <div
              className="pb-4 animate-fade-up"
              style={{ borderTop: '1px solid var(--hairline-soft)', paddingTop: '1rem' }}
            >
              <div className="relative max-w-xl">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--ink-muted)' }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search artworks, motifs, styles…"
                  aria-label="Search artworks, motifs, styles"
                  className="input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '8rem' }}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate('shop');
                      setSearchOpen(false);
                    }
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                />
                <button
                  onClick={() => { if (searchQuery.trim()) { navigate('shop'); setSearchOpen(false); } }}
                  className="btn btn-primary btn-sm absolute right-1 top-1/2 -translate-y-1/2"
                >
                  Search
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex items-center gap-2 mt-2.5 flex-wrap text-xs text-stone-500">
                <span className="font-medium text-stone-400">Popular:</span>
                {['Radha Krishna', 'Peacock', 'Fish', 'Tree of Life', 'Surya', 'Wall Hanging'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate('shop');
                      setSearchOpen(false);
                    }}
                    className="px-2 py-0.5 rounded-full border border-stone-200 hover:border-stone-400 hover:text-stone-800 transition-colors bg-white/60"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ─── Mobile Menu Drawer ────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] bg-paper paper-grain-bg text-ink flex flex-col justify-between p-6">
          {/* Drawer Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-line">
              <button
                onClick={() => { navigate('home'); setMobileOpen(false); }}
                className="flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 border border-line bg-paper p-0.5 flex items-center justify-center">
                  <Image src="/vernika-enterprises.webp" alt="Vernika Logo" width={28} height={28} />
                </div>
                <div>
                  <div className="font-display text-2xl uppercase tracking-tight text-ink leading-none">
                    VERNIKA
                  </div>
                  <div className="font-mono text-[9px] tracking-widest text-accent uppercase font-medium mt-0.5">
                    MITHILA ART GALLERY
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 border border-line flex items-center justify-center text-ink hover:text-accent cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav Links in Monospace */}
            <nav className="flex flex-col mt-6 divide-y divide-line">
              <button
                onClick={() => { navigate('home'); setMobileOpen(false); }}
                className={`py-4 text-left font-mono text-sm tracking-[0.24em] uppercase font-bold flex items-center justify-between ${
                  isActive('home') ? 'text-accent' : 'text-ink'
                }`}
              >
                <span>01 / HOME EXHIBITION</span>
                <span className="text-accent font-normal">→</span>
              </button>

              {NAV_LINKS.map((link, idx) => (
                <button
                  key={link.id}
                  onClick={() => { navigate(link.id); setMobileOpen(false); }}
                  className={`py-4 text-left font-mono text-sm tracking-[0.24em] uppercase font-bold flex items-center justify-between ${
                    isActive(link.id) ? 'text-accent' : 'text-ink'
                  }`}
                >
                  <span>{`0${idx + 2} / ${link.label}`}</span>
                  <span className="text-accent font-normal">→</span>
                </button>
              ))}

              <button
                onClick={() => { navigate('cart'); setMobileOpen(false); }}
                className="py-4 text-left font-mono text-sm tracking-[0.24em] uppercase font-bold flex items-center justify-between text-accent"
              >
                <span>06 / CART [ {cartCount} ]</span>
                <ShoppingBag size={16} />
              </button>
            </nav>
          </div>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-line font-mono text-xs tracking-wider text-ink-muted">
            <p className="uppercase text-ink font-semibold">Natasha Gupta Studio</p>
            <p className="mt-1">Faridabad, Haryana · Ships Across India</p>
            <p className="mt-2 text-accent">WhatsApp: +{siteConfig.contact.phone}</p>
          </div>
        </div>
      )}
    </>
  );
};
