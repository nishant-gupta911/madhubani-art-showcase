'use client';

import React, { useState, useEffect } from 'react';
import { ScreenType } from '../types';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown } from 'lucide-react';

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
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        {/* ─── Announcement Bar ─────────────────────────────────── */}
        <div style={{ background: 'var(--vermilion)', color: 'var(--ivory)' }} className="py-2 text-center">
          <p className="text-caption tracking-widest uppercase font-medium" style={{ letterSpacing: '0.14em', fontSize: '0.68rem' }}>
            Free shipping across India on orders above ₹1,499 · All framed paintings ship free · Handpainted by Natasha Gupta
          </p>
        </div>

        {/* ─── Main Nav ─────────────────────────────────────────── */}
        <div className="container">
          <div className="flex items-center justify-between" style={{ height: '68px' }}>

            {/* Logo */}
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-3 shrink-0"
              aria-label="Go to homepage"
            >
              <div className="brand-mark">
                <img src="/vernika-enterprises.png" alt="" />
              </div>
              <div className="hidden sm:block text-left leading-none">
                <div
                  className="font-display font-semibold tracking-tight"
                  style={{ fontSize: '1.15rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}
                >
                  Vernika Enterprises
                </div>
                <div className="text-eyebrow" style={{ fontSize: '0.58rem', color: 'var(--vermilion)', letterSpacing: '0.12em' }}>
                  Handpainted by Natasha Gupta
                </div>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className={`relative px-4 py-2 text-ui transition-colors duration-200 ${
                    isActive(link.id)
                      ? 'text-vermilion'
                      : 'text-ink-soft hover:text-ink'
                  }`}
                  style={{ letterSpacing: '0.03em' }}
                >
                  {link.label}
                  {isActive(link.id) && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-px"
                      style={{ background: 'var(--vermilion)' }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Login / Sign Up */}
              {user ? (
                <button
                  onClick={() => navigate('profile')}
                  className="hidden md:block text-ui font-semibold hover:text-[var(--vermilion)] transition-colors cursor-pointer mr-1"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {user.name}
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="hidden md:block text-ui font-semibold hover:text-[var(--vermilion)] transition-colors cursor-pointer mr-1"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  Sign In
                </button>
              )}

              {/* Search */}
              <button
                onClick={() => setSearchOpen(o => !o)}
                className="btn btn-icon"
                aria-label="Search"
                style={{ width: '2.25rem', height: '2.25rem' }}
              >
                <Search size={15} />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => navigate('profile')}
                className="btn btn-icon relative"
                aria-label={`Wishlist (${wishlistCount} items)`}
                style={{ width: '2.25rem', height: '2.25rem' }}
              >
                <Heart size={15} />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
                    style={{ background: 'var(--vermilion)', fontSize: '0.55rem', fontWeight: '600' }}
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate('cart')}
                className="flex items-center gap-2 relative"
                style={{
                  background: cartCount > 0 ? 'var(--vermilion)' : 'transparent',
                  color: cartCount > 0 ? 'var(--ivory)' : 'var(--ink)',
                  border: `1px solid ${cartCount > 0 ? 'var(--vermilion)' : 'var(--hairline)'}`,
                  borderRadius: '3px',
                  padding: '0.45rem 0.85rem',
                  transition: 'all 0.2s ease',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingBag size={14} />
                <span className="hidden sm:inline">
                  {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'Cart'}
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="btn btn-icon md:hidden ml-1"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                style={{ width: '2.25rem', height: '2.25rem' }}
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
            </div>
          )}
        </div>
      </header>

      {/* ─── Mobile Menu Overlay ────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[200]"
          style={{ background: 'var(--ivory)' }}
        >
          <div className="container py-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <button
                onClick={() => { navigate('home'); setMobileOpen(false); }}
                className="flex items-center gap-3"
              >
                <div className="brand-mark">
                  <img src="/vernika-enterprises.png" alt="" />
                </div>
                <div className="font-display font-semibold" style={{ fontSize: '1.125rem', color: 'var(--ink)' }}>
                  Vernika Enterprises
                </div>
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="btn btn-icon"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => navigate('home')}
                className="text-left py-4 font-display text-2xl font-semibold tracking-tight"
                style={{
                  color: isActive('home') ? 'var(--vermilion)' : 'var(--ink)',
                  borderBottom: '1px solid var(--hairline-soft)',
                }}
              >
                Home
              </button>
              {NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className="text-left py-4 font-display text-2xl font-semibold tracking-tight"
                  style={{
                    color: isActive(link.id) ? 'var(--vermilion)' : 'var(--ink)',
                    borderBottom: '1px solid var(--hairline-soft)',
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Bottom actions */}
            <div className="mt-auto space-y-3">
              <button
                onClick={() => { navigate('cart'); setMobileOpen(false); }}
                className="btn btn-primary w-full btn-lg justify-center"
              >
                <ShoppingBag size={16} />
                View Cart {cartCount > 0 && `(${cartCount})`}
              </button>
              <button
                onClick={() => { navigate('profile'); setMobileOpen(false); }}
                className="btn btn-outline w-full btn-lg justify-center"
              >
                <Heart size={16} />
                My Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </button>
              {user ? (
                <button
                  onClick={() => { onLogout(); setMobileOpen(false); }}
                  className="btn btn-outline w-full btn-lg justify-center text-vermilion"
                  style={{ color: 'var(--vermilion)', borderColor: 'var(--vermilion-light)' }}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { onOpenAuth(); setMobileOpen(false); }}
                  className="btn btn-outline w-full btn-lg justify-center"
                >
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
