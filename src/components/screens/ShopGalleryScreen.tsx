'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { MadhubaniProduct, MithilaStyle } from '../../types';
import { Search, X, Star, ShoppingBag, Eye, Heart, SlidersHorizontal, ArrowRight, ChevronDown } from 'lucide-react';
import { MithilaMotif, SectionEyebrow } from '../MithilaMotif';
import { PrintCard } from '@/components/ui/PrintCard';
import { Button } from '@/components/ui/Button';

interface ShopGalleryScreenProps {
  products: MadhubaniProduct[];
  categories: { id: string; name: string; short: string }[];
  styles: MithilaStyle[];
  wishlist?: string[];
  onSelectProduct?: (p: MadhubaniProduct) => void;
  onAddToCart?: (p: MadhubaniProduct) => void;
  onQuickView?: (p: MadhubaniProduct) => void;
  onToggleWishlist?: (id: string) => void;
  initialCategory?: string;
  initialStyle?: MithilaStyle;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const PRICE_RANGES = [
  { label: 'Under ₹1,000',     min: 0,    max: 999  },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 1999 },
  { label: '₹2,000 – ₹3,000', min: 2000, max: 2999 },
  { label: 'Above ₹3,000',    min: 3000, max: Infinity },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured',   label: 'Featured' },
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export const ShopGalleryScreen: React.FC<ShopGalleryScreenProps> = ({
  products, categories, styles, wishlist = [],
  onSelectProduct, onAddToCart, onQuickView, onToggleWishlist,
  initialCategory = 'all', initialStyle,
}) => {
  const [searchQuery,    setSearchQuery]    = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeStyle,    setActiveStyle]    = useState<MithilaStyle | 'all'>(initialStyle ?? 'all');
  const [activePriceIdx, setActivePriceIdx] = useState<number | null>(null);
  const [sortBy,         setSortBy]         = useState<SortOption>('featured');
  const [showFilters,    setShowFilters]    = useState(false);
  const [addedIds,       setAddedIds]       = useState<Set<string>>(new Set());
  const [showSortMenu,   setShowSortMenu]   = useState(false);
  const [visibleCount,   setVisibleCount]   = useState(16);

  const handleSelectProduct = (p: MadhubaniProduct) => {
    if (onSelectProduct) onSelectProduct(p);
    else if (typeof window !== 'undefined') window.location.href = `/shop/${p.slug || p.id}`;
  };

  const handleQuickView = (p: MadhubaniProduct) => {
    if (onQuickView) onQuickView(p);
    else if (typeof window !== 'undefined') window.location.href = `/shop/${p.slug || p.id}`;
  };

  const handleAddToCart = useCallback((p: MadhubaniProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(p);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/shop/${p.slug || p.id}`;
    }
    setAddedIds(prev => {
      const s = new Set(prev);
      s.add(p.id);
      setTimeout(() => setAddedIds(ps => { const ns = new Set(ps); ns.delete(p.id); return ns; }), 1800);
      return s;
    });
  }, [onAddToCart]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.style ? p.style.toLowerCase().includes(q) : false) ||
        (p.categoryShort ? p.categoryShort.toLowerCase().includes(q) : false) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if (activeStyle !== 'all')    list = list.filter(p => p.style === activeStyle);
    if (activePriceIdx !== null) {
      const r = PRICE_RANGES[activePriceIdx];
      list = list.filter(p => p.price >= r.min && p.price <= r.max);
    }
    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'newest':     list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default:           list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [products, searchQuery, activeCategory, activeStyle, activePriceIdx, sortBy]);

  const hasFilters = activeCategory !== 'all' || activeStyle !== 'all' || activePriceIdx !== null || searchQuery.trim();

  const clearAll = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveStyle('all');
    setActivePriceIdx(null);
  };

  const activeCategoryLabel = categories.find(c => c.id === activeCategory)?.short || 'All Artworks';

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh' }}>

      {/* ─── Page Header ────────────────────────────────────────────── */}
      <div
        className="py-12 md:py-16"
        style={{ background: 'var(--night)', color: 'var(--ivory)', borderBottom: '1px solid var(--hairline-dark)' }}
      >
        <div className="container">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-6 h-px" style={{ background: 'rgba(250,246,239,0.3)' }} />
              <span className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.5)', letterSpacing: '0.18em' }}>
                80 Original Artworks
              </span>
            </div>
            <h1
              className="font-display font-bold"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', letterSpacing: '-0.02em', color: 'var(--ivory)', lineHeight: '1.1' }}
            >
              {activeStyle !== 'all' ? `${activeStyle} Paintings` : activeCategoryLabel === 'All Artworks' ? 'The Collection' : activeCategoryLabel}
            </h1>
            <p className="text-body" style={{ color: 'rgba(250,246,239,0.6)', maxWidth: '480px' }}>
              Each piece is a one-of-one original, hand-painted using natural pigments by master artisan families in Jitwarpur, Bihar.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-8 max-w-lg relative">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'rgba(250,246,239,0.4)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search artworks, styles, motifs…"
              aria-label="Search artworks, styles, motifs"
              className="input input-dark w-full"
              style={{ paddingLeft: '2.75rem', paddingRight: searchQuery ? '2.5rem' : '1rem' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'rgba(250,246,239,0.4)' }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Layout ─────────────────────────────────────────────── */}
      <div className="container py-8 md:py-12">
        <div className="flex gap-8 lg:gap-10">

          {/* ─── Sidebar Filters (desktop) ───────────────────────────── */}
          <aside
            className="hidden lg:block shrink-0"
            style={{ width: '240px', position: 'sticky', top: '100px', alignSelf: 'flex-start' }}
          >
            <div className="space-y-1 mb-6">
              <p className="text-eyebrow" style={{ color: 'var(--ink-muted)', fontSize: '0.6rem' }}>Filters</p>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="text-body-sm flex items-center gap-1.5 transition-colors"
                  style={{ color: 'var(--vermilion)' }}
                >
                  <X size={12} /> Clear all
                </button>
              )}
            </div>

            {/* Category filter */}
            <FilterSection title="Category">
              <FilterPill
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                count={products.length}
              >
                All Artworks
              </FilterPill>
              {categories.map(cat => (
                <FilterPill
                  key={cat.id}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id === activeCategory ? 'all' : cat.id)}
                  count={products.filter(p => p.category === cat.id).length}
                >
                  {cat.short}
                </FilterPill>
              ))}
            </FilterSection>

            {/* Style filter */}
            <FilterSection title="Style Discipline">
              <FilterPill
                active={activeStyle === 'all'}
                onClick={() => setActiveStyle('all')}
              >
                All Styles
              </FilterPill>
              {styles.map(style => (
                <FilterPill
                  key={style}
                  active={activeStyle === style}
                  onClick={() => setActiveStyle(activeStyle === style ? 'all' : style)}
                  count={products.filter(p => p.style === style).length}
                >
                  {style}
                </FilterPill>
              ))}
            </FilterSection>

            {/* Price filter */}
            <FilterSection title="Price Range">
              {PRICE_RANGES.map((r, i) => (
                <FilterPill
                  key={r.label}
                  active={activePriceIdx === i}
                  onClick={() => setActivePriceIdx(activePriceIdx === i ? null : i)}
                >
                  {r.label}
                </FilterPill>
              ))}
            </FilterSection>

            {/* Only available */}
            <FilterSection title="Availability">
              <FilterPill active={false} onClick={() => {}}>In Stock</FilterPill>
              <FilterPill active={false} onClick={() => {}}>Featured</FilterPill>
              <FilterPill active={false} onClick={() => {}}>New Arrivals</FilterPill>
            </FilterSection>
          </aside>

          {/* ─── Products area ───────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-line">
              <p className="font-mono text-xs tracking-[0.24em] uppercase text-ink-muted">
                <span className="font-bold text-accent">{filtered.length}</span>
                {' '}PRINTS ARCHIVED
                {hasFilters && ' (FILTERED)'}
              </p>

              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(o => !o)}
                  className="px-3 py-1.5 border border-line bg-paper font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 lg:hidden hover:border-ink transition-colors"
                >
                  <SlidersHorizontal size={13} />
                  FILTERS
                  {hasFilters && (
                    <span className="w-1.5 h-1.5 bg-accent ml-0.5 rounded-none" />
                  )}
                </button>

                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(o => !o)}
                    className="px-3 py-1.5 border border-line bg-paper font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 hover:border-ink transition-colors"
                  >
                    <span>{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                    <ChevronDown size={13} style={{ transform: showSortMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {showSortMenu && (
                    <div
                      className="absolute right-0 top-full mt-1.5 z-50 py-1 min-w-[180px] bg-paper border border-line shadow-[3px_3px_0_var(--ink)]"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                          className={`w-full text-left px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                            sortBy === opt.value ? 'bg-accent/10 text-accent font-bold' : 'text-ink-soft hover:bg-paper-2'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <ActiveFilterTag label={`"${searchQuery}"`} onRemove={() => setSearchQuery('')} />
                )}
                {activeCategory !== 'all' && (
                  <ActiveFilterTag
                    label={categories.find(c => c.id === activeCategory)?.short || ''}
                    onRemove={() => setActiveCategory('all')}
                  />
                )}
                {activeStyle !== 'all' && (
                  <ActiveFilterTag label={activeStyle} onRemove={() => setActiveStyle('all')} />
                )}
                {activePriceIdx !== null && (
                  <ActiveFilterTag
                    label={PRICE_RANGES[activePriceIdx].label}
                    onRemove={() => setActivePriceIdx(null)}
                  />
                )}
              </div>
            )}

            {/* Category pills (desktop quick-filter) */}
            <div className="hidden lg:flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-1.5 border font-mono text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-ink text-paper border-ink shadow-[2px_2px_0_var(--accent)]'
                    : 'bg-paper text-ink-muted border-line hover:border-ink hover:text-ink'
                }`}
              >
                ALL ({products.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id === activeCategory ? 'all' : cat.id)}
                  className={`px-3.5 py-1.5 border font-mono text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-ink text-paper border-ink shadow-[2px_2px_0_var(--accent)]'
                      : 'bg-paper text-ink-muted border-line hover:border-ink hover:text-ink'
                  }`}
                >
                  {cat.short}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filtered.slice(0, visibleCount).map((p, i) => (
                    <PrintCard
                      key={p.id}
                      id={p.id}
                      refCode={`FIG. ${String(i + 1).padStart(2, '0')}`}
                      name={p.title}
                      slug={p.slug || p.id}
                      image={p.image}
                      pricePaise={p.price * 100}
                      category={p.category}
                      isOriginal={p.category === 'paintings'}
                      stock={p.stock ?? 1}
                      priority={i < 4}
                    />
                  ))}
                </div>
                {filtered.length > visibleCount && (
                  <div className="pt-12 flex justify-center">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setVisibleCount(c => c + 16)}
                    >
                      LOAD MORE PRINTS ({Math.min(visibleCount, filtered.length)} OF {filtered.length})
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="py-24 text-center space-y-4 border border-line bg-paper-2 p-8">
                <div className="flex justify-center">
                  <MithilaMotif type="lotus-divider" color="var(--ink-muted)" width={180} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-3xl uppercase text-ink">
                    NO PRINTS FOUND
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                    No artworks match your selected filter criteria
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="ink" size="md" onClick={clearAll}>
                    CLEAR ALL FILTERS
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Sub-components ───────────────────────────────────────────────────────── */

interface ProductCardProps {
  product: MadhubaniProduct;
  isWishlisted: boolean;
  addedToCart: boolean;
  onSelect: (p: MadhubaniProduct) => void;
  onAddToCart: (p: MadhubaniProduct, e: React.MouseEvent) => void;
  onQuickView: (p: MadhubaniProduct) => void;
  onToggleWishlist: (id: string) => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product: p, isWishlisted, addedToCart,
  onSelect, onAddToCart, onQuickView, onToggleWishlist, index,
}) => {
  return (
    <article
      className="art-card group"
      style={{
        borderRadius: '4px',
        animationDelay: `${Math.min(index, 12) * 0.04}s`,
        contentVisibility: index > 3 ? 'auto' : 'visible',
        containIntrinsicSize: index > 3 ? '0 420px' : undefined,
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '4/5', background: 'var(--ivory-deep)', cursor: 'pointer' }}
        onClick={() => onSelect(p)}
      >
        <Image
          src={p.image}
          alt={p.title}
          priority={index === 0}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="art-img w-full h-full object-cover"
        />

        {/* Hover overlay */}
        <div className="card-actions">
          <div className="flex gap-2">
            <button
              onClick={e => { e.stopPropagation(); onQuickView(p); }}
              className="btn btn-sm"
              style={{ background: 'rgba(250,246,239,0.95)', color: 'var(--ink)', border: 'none', gap: '0.35rem' }}
            >
              <Eye size={12} /> Quick View
            </button>
            <button
              onClick={e => onAddToCart(p, e)}
              className="btn btn-primary btn-sm"
              aria-label={`Add ${p.title} to bag`}
              style={{ gap: '0.35rem' }}
            >
              <ShoppingBag size={12} />
            </button>
          </div>
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); onToggleWishlist(p.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background: 'rgba(250,246,239,0.92)',
            border: '1px solid var(--hairline-soft)',
            backdropFilter: 'blur(4px)',
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={13}
            style={{
              color: isWishlisted ? 'var(--vermilion)' : 'var(--ink-muted)',
              fill: isWishlisted ? 'var(--vermilion)' : 'none',
              transition: 'all 0.2s',
            }}
          />
        </button>

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="badge badge-warm">{p.style}</span>
          {p.isNew && <span className="badge badge-vermilion">New</span>}
        </div>

        {/* Added to cart confirmation */}
        {addedToCart && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(176,48,32,0.88)' }}
          >
            <div className="text-center">
              <p className="text-eyebrow text-white" style={{ fontSize: '0.65rem' }}>Added to cart</p>
            </div>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--hairline-soft)' }}>
        <p
          className="text-caption"
          style={{ color: 'var(--ink-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.6rem' }}
        >
          {p.categoryShort}
        </p>
        <h3
          className="font-display font-semibold line-clamp-2 cursor-pointer transition-colors duration-200"
          style={{ fontSize: '0.9375rem', color: 'var(--ink)', lineHeight: '1.3' }}
          onClick={() => onSelect(p)}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--vermilion)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink)')}
        >
          {p.title}
        </h3>

        {/* Dimensions & Medium */}
        <div className="flex items-center gap-1.5 text-caption text-ink-muted">
          <span>{p.dimensions}</span>
          <span>•</span>
          <span>{p.medium}</span>
        </div>

        {/* Price */}
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: '1px solid var(--hairline-soft)' }}
        >
          <div className="flex items-baseline gap-2">
            <span
              className="font-display font-semibold"
              style={{ fontSize: '1.0625rem', color: 'var(--ink)' }}
            >
              ₹{p.price.toLocaleString('en-IN')}
            </span>
            {p.originalPrice && (
              <span className="text-caption line-through" style={{ color: 'var(--ink-dim)' }}>
                ₹{p.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <button
            onClick={e => onAddToCart(p, e)}
            className="btn btn-primary"
            style={{ padding: '0.4rem 0.6rem', fontSize: '0.7rem' }}
            aria-label={`Add ${p.title} to cart`}
          >
            <ShoppingBag size={12} />
          </button>
        </div>
      </div>
    </article>
  );
};

/* Filter Section */
const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="filter-section">
    <p className="text-eyebrow mb-3" style={{ color: 'var(--ink-muted)', fontSize: '0.6rem' }}>{title}</p>
    <div className="space-y-1.5">{children}</div>
  </div>
);

/* Filter Pill */
const FilterPill: React.FC<{
  active: boolean;
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
}> = ({ active, onClick, count, children }) => (
  <button
    onClick={onClick}
    className="w-full text-left flex items-center justify-between px-3 py-2 rounded-sm transition-all duration-150"
    style={{
      background: active ? 'var(--vermilion-tint)' : 'transparent',
      border: `1px solid ${active ? 'var(--vermilion-light)' : 'transparent'}`,
      color: active ? 'var(--vermilion-dark)' : 'var(--ink-muted)',
      fontSize: '0.8125rem',
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    <span>{children}</span>
    {count !== undefined && (
      <span className="text-caption font-medium" style={{ color: active ? 'var(--vermilion-dark)' : 'var(--ink-muted)' }}>
        {count}
      </span>
    )}
  </button>
);

/* Active filter tag */
const ActiveFilterTag: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-body-sm"
    style={{ background: 'var(--vermilion-tint)', border: '1px solid var(--vermilion-light)', color: 'var(--vermilion)' }}
  >
    {label}
    <button onClick={onRemove} aria-label="Remove filter">
      <X size={12} />
    </button>
  </span>
);
