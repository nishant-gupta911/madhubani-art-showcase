'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MadhubaniProduct, MithilaStyle } from '../../types';
import { ArrowRight, Star, ShoppingBag, Eye, ArrowUpRight, Quote } from 'lucide-react';
import { MithilaMotif, SectionEyebrow } from '../MithilaMotif';
import { siteConfig } from '../../config/site';

interface HomeScreenProps {
  products: MadhubaniProduct[];
  onSelectProduct?: (p: MadhubaniProduct) => void;
  onNavigateToShop?: (category?: string, style?: MithilaStyle) => void;
  onNavigateToAbout?: () => void;
  onAddToCart?: (p: MadhubaniProduct) => void;
  onQuickView?: (p: MadhubaniProduct) => void;
}

const TRADITIONS: { name: MithilaStyle; tagline: string; desc: string; img: string; count: number }[] = [
  { name: 'Bharni',  tagline: 'Vibrant Pigment Density',  desc: 'Solid-fill tradition with double-line soot borders. Bold organic ochre, vermilion, and indigo.',         img: '/madu/3.jpeg',  count: 18 },
  { name: 'Kachni',  tagline: 'Pure Line Precision',       desc: 'Micro-hatching strokes in black soot. Zero solid fills — only rhythmic parallel line frequency.',       img: '/madu/12.jpeg', count: 14 },
  { name: 'Tantrik', tagline: 'Sacred Cosmic Geometry',    desc: 'Metaphysical yantras, solar alignments, and deity energy matrices in esoteric cosmological form.',       img: '/madu/24.jpeg', count: 12 },
  { name: 'Godna',   tagline: 'Folk Tattoo Concentrics',   desc: 'Ancient tribal body-ink vocabulary rendered on paper — concentric totems and protective flora.',         img: '/madu/14.jpeg', count: 8  },
  { name: 'Kohbar',  tagline: 'Nuptial Sanctuary Art',      desc: 'Ceremonial bridal chamber paintings with lotus rosettes, twin carp, bamboo stalks and solar blessings.', img: '/madu/22.jpeg', count: 16 },
];

const TRUST_PILLARS = [
  { title: 'Handpainted by Natasha Gupta', body: `Every single piece is personally sketched and painted by Natasha Gupta in ${siteConfig.origin}, preserving authentic Mithila tradition.`, icon: '✦' },
  { title: 'GI-Tagged Heritage Art',      body: 'Madhubani (Mithila) art is a protected Geographical Indication of Bihar, celebrated for millennia.', icon: '✦' },
  { title: 'Museum-Grade Packaging',       body: 'Framed art protected with corner shields and archival wrapping. Free shipping across India on orders above ₹1,499.', icon: '✦' },
  { title: 'Direct from the Artist',       body: 'Zero middlemen, honest pricing, and transparent craftsmanship. Custom sizes and motifs available on request.', icon: '✦' },
];

const HERO_ARTWORKS = [
  { src: '/madu/49.jpeg', title: 'Mahishasura Mardini', style: 'Tantrik' },
  { src: '/madu/50.jpeg', title: 'Ardhanarishvara',     style: 'Bharni' },
  { src: '/madu/22.jpeg', title: 'Sacred Kohbar Garden', style: 'Kohbar' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products, onSelectProduct, onNavigateToShop, onNavigateToAbout, onAddToCart, onQuickView,
}) => {
  const featured    = products.filter(p => p.isFeatured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNew).slice(0, 6);
  const [heroIdx,   setHeroIdx]   = useState(0);
  const [addedId,   setAddedId]   = useState<string | null>(null);
  const heroTimer = useRef<number | null>(null);

  const navigateShop = (category?: string, style?: MithilaStyle) => {
    if (onNavigateToShop) onNavigateToShop(category, style);
    else if (typeof window !== 'undefined') {
      window.location.href = category ? `/shop/category/${category}` : '/shop';
    }
  };

  const navigateAbout = () => {
    if (onNavigateToAbout) onNavigateToAbout();
    else if (typeof window !== 'undefined') window.location.href = '/about';
  };

  const selectProduct = (p: MadhubaniProduct) => {
    if (onSelectProduct) onSelectProduct(p);
    else if (typeof window !== 'undefined') window.location.href = `/shop/${p.slug || p.id}`;
  };

  const quickView = (p: MadhubaniProduct) => {
    if (onQuickView) onQuickView(p);
    else if (typeof window !== 'undefined') window.location.href = `/shop/${p.slug || p.id}`;
  };

  // Auto-cycle hero artwork
  useEffect(() => {
    heroTimer.current = window.setInterval(() => {
      setHeroIdx(i => (i + 1) % HERO_ARTWORKS.length);
    }, 5500);
    return () => { if (heroTimer.current) clearInterval(heroTimer.current); };
  }, []);

  const handleAddToCart = (p: MadhubaniProduct) => {
    if (onAddToCart) onAddToCart(p);
    else if (typeof window !== 'undefined') window.location.href = `/shop/${p.slug || p.id}`;
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const hero = HERO_ARTWORKS[heroIdx];

  return (
    <div className="band-ivory">

      {/* ════════════════════════════════════════════════════════════
          HERO — Cinematic split: editorial left + artwork right
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 'min(92vh, 860px)' }}>
        {/* Background artwork — full bleed on mobile, right panel on desktop */}
        <div className="absolute inset-0 lg:left-[44%]">
          {HERO_ARTWORKS.map((hw, i) => (
            <img
              key={hw.src}
              src={hw.src}
              alt={hw.title}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover object-center transition-opacity duration-1000"
              style={{ opacity: i === heroIdx ? 1 : 0, position: 'absolute', inset: 0 }}
            />
          ))}
          {/* Gradient: full overlay on mobile, left fade on desktop */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, var(--ivory) 0%, rgba(250,246,239,0.92) 30%, rgba(250,246,239,0.4) 55%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0 lg:hidden"
            style={{ background: 'rgba(250,246,239,0.82)' }}
          />
        </div>

        {/* Editorial Left Panel */}
        <div
          className="relative z-10 container flex flex-col justify-center"
          style={{ minHeight: 'inherit', paddingTop: '4rem', paddingBottom: '4rem' }}
        >
          <div className="max-w-xl space-y-7 animate-fade-up">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-px" style={{ background: 'var(--vermilion)' }} />
              <span className="text-eyebrow" style={{ color: 'var(--vermilion)', letterSpacing: '0.18em' }}>
                2,500 years of unbroken tradition
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1
                className="font-display font-bold leading-none"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)', letterSpacing: '-0.02em', color: 'var(--ink)' }}
              >
                Sacred Art
                <br />
                <span style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--vermilion)' }}>
                  of Mithila.
                </span>
              </h1>
            </div>

            {/* Body */}
            <p className="text-body-lg" style={{ color: 'var(--ink-soft)', maxWidth: '440px' }}>
              Madhubani art, handpainted by Natasha Gupta in {siteConfig.origin}. Discover original framed paintings,
              wearable handloom dupattas, and handcrafted artisan accessories.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigateShop()}
                className="btn btn-primary btn-lg"
              >
                Explore Shop ({products.length} Artworks)
                <ArrowRight size={16} />
              </button>
              <button
                onClick={navigateAbout}
                className="btn btn-outline btn-lg"
              >
                Our Heritage
              </button>
            </div>

            {/* Trust micro-stats */}
            <div
              className="flex flex-wrap gap-8 pt-6"
              style={{ borderTop: '1px solid var(--hairline-soft)' }}
            >
              {[
                { n: '80',     label: 'Unique originals' },
                { n: '100%',   label: 'Natural pigments' },
                { n: '5★',     label: 'Collector rated' },
              ].map(m => (
                <div key={m.n}>
                  <div
                    className="font-display font-bold"
                    style={{ fontSize: '1.75rem', color: 'var(--ink)', lineHeight: 1 }}
                  >
                    {m.n}
                  </div>
                  <div className="text-caption mt-1" style={{ color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero artwork caption (desktop only) */}
        <div
          className="absolute bottom-8 right-8 z-10 hidden lg:flex items-center gap-3 px-4 py-2.5"
          style={{ background: 'rgba(250,246,239,0.9)', border: '1px solid var(--hairline-soft)', borderRadius: '2px' }}
        >
          <div
            className="w-1 h-8 rounded-full"
            style={{ background: 'var(--vermilion)' }}
          />
          <div>
            <p className="text-ui" style={{ color: 'var(--ink)', fontSize: '0.75rem' }}>{hero.title}</p>
            <p className="text-caption" style={{ color: 'var(--ink-muted)' }}>{hero.style} Style · Jitwarpur, Bihar</p>
          </div>
        </div>

        {/* Hero selector dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2 lg:hidden">
          {HERO_ARTWORKS.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === heroIdx ? '24px' : '6px',
                height: '6px',
                background: i === heroIdx ? 'var(--vermilion)' : 'rgba(26,18,9,0.25)',
              }}
            />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MARQUEE TRUST BAR
          ════════════════════════════════════════════════════════════ */}
      <div
        className="overflow-hidden py-4"
        style={{ borderTop: '1px solid var(--hairline-soft)', borderBottom: '1px solid var(--hairline-soft)', background: 'var(--ivory-deep)' }}
      >
        <div className="flex animate-marquee whitespace-nowrap gap-0">
          {[...Array(2)].map((_, repeat) => (
            <div key={repeat} className="flex items-center gap-0 shrink-0">
              {[
                '100% Handcrafted',
                'Natural Earth Pigments Only',
                'Individual Provenance Certificate',
                'Free Express Shipping Above ₹1,999',
                'Worldwide Insured Courier',
                'Museum-Grade Packaging',
                'Direct from Artisan Families',
                'Zero Synthetic Dyes',
              ].map((t, i) => (
                <React.Fragment key={i}>
                  <span className="text-eyebrow px-8" style={{ color: 'var(--ink-muted)', fontSize: '0.625rem', letterSpacing: '0.15em' }}>
                    {t}
                  </span>
                  <span style={{ color: 'var(--vermilion)', opacity: 0.5, fontSize: '0.5rem' }}>✦</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          FEATURED MASTERPIECES — 4-col editorial grid
          ════════════════════════════════════════════════════════════ */}
      <section className="py-20 band-ivory">
        <div className="container space-y-12">
          <div className="flex items-end justify-between gap-4">
            <SectionEyebrow
              eyebrow="Curated Selection"
              headline={<>Featured<br className="hidden sm:block" /> Masterpieces</>}
            />
            <button
              onClick={() => navigateShop()}
              className="btn btn-outline btn-sm hidden sm:flex shrink-0 items-center gap-2"
            >
              View Collection ({products.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div className="product-grid">
            {featured.map((p, i) => (
              <article
                key={p.id}
                className="art-card group animate-fade-up"
                style={{ animationDelay: `${i * 0.055}s`, borderRadius: '4px' }}
              >
                {/* Image container */}
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '4/5', background: 'var(--ivory-deep)', cursor: 'pointer' }}
                  onClick={() => selectProduct(p)}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="art-img w-full h-full object-cover"
                  />

                  {/* Hover overlay */}
                  <div className="card-actions">
                    <div className="flex gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); quickView(p); }}
                        className="btn btn-outline btn-sm"
                        style={{ background: 'rgba(250,246,239,0.95)', border: 'none', color: 'var(--ink)' }}
                      >
                        <Eye size={13} /> Quick View
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleAddToCart(p); }}
                        className="btn btn-primary btn-sm"
                        aria-label={`Add ${p.name || p.title} to Cart`}
                      >
                        <ShoppingBag size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="badge badge-warm">{p.style}</span>
                  </div>
                  {p.isNew && (
                    <span className="badge badge-vermilion absolute top-3 right-3">New</span>
                  )}
                  {addedId === p.id && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(176,48,32,0.9)' }}
                    >
                      <p className="text-eyebrow text-white">Added to cart</p>
                    </div>
                  )}
                </div>

                {/* Card info */}
                <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--hairline-soft)' }}>
                  <p className="text-caption" style={{ color: 'var(--ink-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {p.categoryShort}
                  </p>
                  <h3
                    className="font-display font-semibold leading-snug line-clamp-2 cursor-pointer"
                    style={{ fontSize: '1rem', color: 'var(--ink)', transition: 'color 0.2s' }}
                    onClick={() => selectProduct(p)}
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
                  {/* Price row */}
                  <div
                    className="flex items-center justify-between pt-2"
                    style={{ borderTop: '1px solid var(--hairline-soft)' }}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-semibold" style={{ fontSize: '1.125rem', color: 'var(--ink)' }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      {p.originalPrice && (
                        <span className="text-caption line-through" style={{ color: 'var(--ink-dim)' }}>
                          ₹{p.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="btn btn-primary btn-xs"
                      style={{ padding: '0.4rem 0.75rem' }}
                      aria-label={`Add ${p.title} to cart`}
                    >
                      <ShoppingBag size={12} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="flex sm:hidden justify-center">
            <button onClick={() => navigateShop()} className="btn btn-outline btn-lg">
              View Collection ({products.length}) <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          HERITAGE STORY — Immersive split section
          ════════════════════════════════════════════════════════════ */}
      <section
        className="py-24"
        style={{ background: 'var(--night)', color: 'var(--ivory)' }}
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left — editorial copy */}
            <div className="lg:col-span-5 space-y-8">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px" style={{ background: 'rgba(250,246,239,0.3)' }} />
                <span className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.5)', letterSpacing: '0.18em' }}>
                  Provenance & Tradition
                </span>
              </div>

              <div className="space-y-4">
                <h2
                  className="font-display font-bold"
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: '1.1', letterSpacing: '-0.02em', color: 'var(--ivory)' }}
                >
                  Art born from<br />
                  <span style={{ fontStyle: 'italic', fontWeight: 600, color: 'rgba(250,246,239,0.6)' }}>
                    a royal decree.
                  </span>
                </h2>
                <p className="text-body" style={{ color: 'rgba(250,246,239,0.65)', maxWidth: '400px' }}>
                  King Janaka commissioned the village artists of Mithila to paint all of Bihar for the divine wedding of Princess Sita and Lord Rama. For 2,500 years, this knowledge has passed mother to daughter — unbroken.
                </p>
              </div>

              {/* Pillars */}
              <ul className="space-y-5">
                {[
                  { t: 'Original Handpainted Art', s: 'Handcrafted individually by artist Natasha Gupta in Bihar' },
                  { t: 'Fine Freehand Linework', s: 'Detailed double-line borders and motifs painted with fine brushes and traditional nibs' },
                  { t: 'Damage-Proof Secure Packaging', s: 'Sturdy protective packaging with insured delivery across India' },
                ].map(item => (
                  <li key={item.t} className="flex items-start gap-4">
                    <div
                      className="shrink-0 flex items-center justify-center rounded-sm mt-0.5"
                      style={{ width: '20px', height: '20px', background: 'rgba(176,48,32,0.3)', border: '1px solid rgba(176,48,32,0.5)' }}
                    >
                      <span style={{ color: 'var(--vermilion)', fontSize: '10px' }}>✦</span>
                    </div>
                    <div>
                      <p className="text-ui font-semibold" style={{ color: 'var(--ivory)' }}>{item.t}</p>
                      <p className="text-body-sm mt-0.5" style={{ color: 'rgba(250,246,239,0.5)' }}>{item.s}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={navigateAbout}
                className="btn btn-ghost-light btn-lg"
              >
                Read our full heritage story <ArrowRight size={16} />
              </button>
            </div>

            {/* Right — art mosaic */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-3">
                {/* Large featured image */}
                <div
                  className="row-span-2 overflow-hidden cursor-pointer group relative"
                  style={{ borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}
                  onClick={() => selectProduct(products.find(p => p.image === '/madu/49.jpeg') || products[0])}
                >
                  <img
                    src="/madu/49.jpeg"
                    alt="Featured Madhubani artwork"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ minHeight: '300px' }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                    style={{ background: 'linear-gradient(to top, rgba(16,11,4,0.7) 0%, transparent 50%)' }}
                  >
                    <span className="text-eyebrow text-white" style={{ fontSize: '0.6rem' }}>View artwork →</span>
                  </div>
                </div>

                {/* Smaller images */}
                {['/madu/22.jpeg', '/madu/14.jpeg'].map((src, i) => (
                  <div
                    key={i}
                    className="overflow-hidden cursor-pointer group relative"
                    style={{ borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', aspectRatio: '1' }}
                    onClick={() => selectProduct(products.find(p => p.image === src) || products[i + 1])}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>

              {/* Motif accent */}
              <div className="mt-5 flex justify-center opacity-30">
                <MithilaMotif type="fish-pair" color="rgba(250,246,239,0.8)" width={80} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FIVE TRADITIONS — Style explorer
          ════════════════════════════════════════════════════════════ */}
      <section className="py-24 band-deep">
        <div className="container space-y-14">
          <SectionEyebrow
            eyebrow="Five Lineage Disciplines"
            headline={<>Mithila's Living<br />Traditions</>}
            subhead="Each style carries its own symbolic canon, technical vocabulary, and spiritual meaning — passed mother to daughter for centuries."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TRADITIONS.map((d, i) => (
              <button
                key={d.name}
                onClick={() => navigateShop(undefined, d.name)}
                className="group text-left flex flex-col overflow-hidden"
                style={{
                  background: 'var(--ivory)',
                  border: '1px solid var(--hairline-soft)',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--vermilion)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(176,48,32,0.12)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--hairline-soft)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '1', background: 'var(--ivory-deep)' }}>
                  <img
                    src={d.img}
                    alt={d.name}
                    loading="lazy"
                    className="art-img w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: 'rgba(16,11,4,0.18)', opacity: 0 }}
                  />
                  {/* Number badge */}
                  <span
                    className="absolute bottom-3 left-3 text-eyebrow text-white"
                    style={{ fontSize: '0.55rem', opacity: 0.9 }}
                  >
                    0{i + 1}
                  </span>
                </div>

                {/* Text */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <p className="text-eyebrow" style={{ color: 'var(--vermilion)', fontSize: '0.575rem' }}>
                    {d.tagline}
                  </p>
                  <h3
                    className="font-display font-semibold"
                    style={{ fontSize: '1.125rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}
                  >
                    {d.name}
                  </h3>
                  <p className="text-body-sm flex-1 leading-relaxed" style={{ color: 'var(--ink-muted)', fontSize: '0.75rem' }}>
                    {d.desc}
                  </p>
                  <div
                    className="flex items-center gap-1.5 mt-2 group-hover:gap-2.5 transition-all duration-300"
                    style={{ color: 'var(--vermilion)' }}
                  >
                    <span className="text-eyebrow" style={{ fontSize: '0.575rem' }}>
                      {d.count} artworks
                    </span>
                    <ArrowUpRight size={12} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          NEW ARRIVALS — Horizontal scroll
          ════════════════════════════════════════════════════════════ */}
      {newArrivals.length > 0 && (
        <section className="py-20 band-ivory">
          <div className="container space-y-10">
            <div className="flex items-end justify-between gap-4">
              <SectionEyebrow
                eyebrow="Just Added"
                headline="New Arrivals"
              />
              <button
                onClick={() => navigateShop()}
                className="btn btn-outline btn-sm hidden sm:flex items-center gap-2 shrink-0"
              >
                See all <ArrowRight size={13} />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {newArrivals.map(p => (
                <article
                  key={p.id}
                  className="art-card group shrink-0"
                  style={{ width: '220px', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => selectProduct(p)}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: '4/5', background: 'var(--ivory-deep)' }}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="art-img w-full h-full object-cover"
                    />
                    <span className="badge badge-vermilion absolute top-2.5 left-2.5">New</span>
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <p className="text-caption" style={{ color: 'var(--ink-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.6rem' }}>
                      {p.style}
                    </p>
                    <h4
                      className="font-display font-semibold line-clamp-2"
                      style={{ fontSize: '0.9375rem', color: 'var(--ink)', lineHeight: '1.25' }}
                    >
                      {p.title}
                    </h4>
                    <p className="font-display font-semibold" style={{ fontSize: '1rem', color: 'var(--ink)' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          CRAFTSMANSHIP PILLARS
          ════════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: 'var(--ivory-warm)' }}>
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <span className="w-10 h-px" style={{ background: 'var(--hairline)' }} />
              <MithilaMotif type="peacock-eye" color="var(--vermilion)" width={28} height={28} />
              <span className="w-10 h-px" style={{ background: 'var(--hairline)' }} />
            </div>
            <SectionEyebrow
              eyebrow="Why Collect With Us"
              headline={<>Craftsmanship.<br /><span style={{ fontStyle: 'italic' }}>Integrity.</span></>}
              subhead="Every artwork you receive is a direct connection to a living tradition — not a reproduction, not a print."
              align="center"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                className="p-6 space-y-4"
                style={{
                  background: 'var(--ivory)',
                  border: '1px solid var(--hairline-soft)',
                  borderRadius: '4px',
                }}
              >
                <div className="space-y-1">
                  <span style={{ color: 'var(--vermilion)', fontSize: '0.875rem' }}>✦</span>
                  <h3
                    className="font-display font-semibold"
                    style={{ fontSize: '1.0625rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}
                  >
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-body-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>

          {/* Motif divider */}
          <div className="flex justify-center">
            <MithilaMotif type="lotus-divider" color="var(--ink-muted)" width={300} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          AUTHENTIC PROVENANCE & ARTIST PLEDGE
          ════════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: 'var(--night)', color: 'var(--ivory)' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <SectionEyebrow
              eyebrow="The Artisan Pledge"
              headline="Honest Heritage, Zero Compromise"
              align="center"
              light
            />

            <div
              className="px-8 py-10 relative"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px',
              }}
            >
              <MithilaMotif type="four-corners" color="rgba(176,48,32,0.5)" />

              <blockquote
                className="font-display"
                style={{ fontSize: 'clamp(1.125rem, 2vw, 1.45rem)', fontStyle: 'italic', color: 'rgba(250,246,239,0.9)', lineHeight: '1.6', letterSpacing: '-0.01em' }}
              >
                "Every painting, dupatta, and accessory in this collection is created by hand with devotion.
                No machine prints, no inflated markups, and no false claims. Madhubani art is sacred to our roots,
                and each piece carries the genuine living culture of Mithila."
              </blockquote>

              <footer className="mt-8 space-y-1">
                <p className="font-display font-semibold" style={{ color: 'var(--ivory)', fontSize: '1.05rem' }}>
                  Natasha Gupta
                </p>
                <p className="text-eyebrow" style={{ color: 'var(--vermilion)', fontSize: '0.62rem', letterSpacing: '0.14em' }}>
                  Founder & Artist · Vernika Enterprises
                </p>
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA BAND
          ════════════════════════════════════════════════════════════ */}
      <section
        className="py-28"
        style={{
          background: 'var(--ivory-warm)',
          borderTop: '1px solid var(--hairline-soft)',
        }}
      >
        <div className="container text-center space-y-8 max-w-2xl mx-auto">
          {/* Motif decoration */}
          <div className="flex justify-center">
            <MithilaMotif type="fish-pair" color="var(--vermilion)" width={72} />
          </div>

          <div className="space-y-4">
            <p className="text-eyebrow" style={{ color: 'var(--vermilion)', letterSpacing: '0.18em' }}>
              The Complete Archive
            </p>
            <h2
              className="font-display font-bold"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: '1.08' }}
            >
              Explore all 80<br />
              <span style={{ fontStyle: 'italic', fontWeight: 600 }}>sacred artworks.</span>
            </h2>
            <p className="text-body" style={{ color: 'var(--ink-muted)', maxWidth: '400px', margin: '0 auto' }}>
              Filter by motif, style, price, and availability. Every purchase directly supports master artisan families in Jitwarpur, Bihar.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => navigateShop()} className="btn btn-primary btn-lg">
              Browse All Artworks <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigateShop('kohbar_ceremonial', 'Kohbar')}
              className="btn btn-outline btn-lg"
            >
              Wedding &amp; Kohbar Art
            </button>
          </div>

          {/* Bottom motif */}
          <div className="pt-4">
            <MithilaMotif type="diamond-chain" color="var(--vermilion)" width="180px" height={10} className="mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
};
