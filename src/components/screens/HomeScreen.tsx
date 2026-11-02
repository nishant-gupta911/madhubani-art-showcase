'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MadhubaniProduct } from '../../types';
import { Button } from '@/components/ui/Button';
import { PrintCard } from '@/components/ui/PrintCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MarqueeTicker } from '@/components/ui/MarqueeTicker';
import { Seal, Barcode, RegistrationMark } from '@/components/ui/Ornaments';
import { ArrowRight, ArrowUpRight, ShieldCheck, Truck, Sparkles, HeartHandshake } from 'lucide-react';
import { siteConfig } from '../../config/site';

interface HomeScreenProps {
  products: MadhubaniProduct[];
  onSelectProduct?: (p: MadhubaniProduct) => void;
  onNavigateToShop?: (category?: string) => void;
  onNavigateToAbout?: () => void;
  onAddToCart?: (p: MadhubaniProduct) => void;
  onQuickView?: (p: MadhubaniProduct) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ products }) => {
  const featured = products.filter((p) => p.isFeatured).slice(0, 8);
  const paintings = products.filter((p) => p.category === 'paintings').slice(0, 4);

  return (
    <div className="w-full bg-paper text-ink overflow-x-hidden selection:bg-accent selection:text-paper">

      {/* ══════════════════════════════════════════════════════════════════
          1. POSTER HERO — Archival Exhibition Gallery Screen-Print
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-line overflow-hidden">
        {/* Subtle decorative registration marks at corners */}
        <div className="container relative">
          <div className="absolute top-0 left-4"><RegistrationMark /></div>
          <div className="absolute top-0 right-4"><RegistrationMark /></div>

          {/* Exhibition Top Kicker */}
          <div className="text-center mb-4">
            <span className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-accent font-semibold inline-block border-b border-line pb-1">
              ORIGINAL MITHILA FOLK ART · STUDIO OF NATASHA GUPTA
            </span>
          </div>

          {/* Giant Condensed Headline */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-display text-5xl sm:text-7xl md:text-9xl tracking-tight text-ink uppercase leading-[0.88] select-none">
              HANDPAINTED <br className="hidden sm:inline" />
              <span className="text-accent">MADHUBANI</span>
            </h1>
            <p className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-ink-muted mt-3 max-w-xl mx-auto">
              INDIVIDUALLY DRAWN WITH BAMBOO & NIB · NATURAL PIGMENTS · SIGNED ARCHIVAL PRINTS
            </p>
          </div>

          {/* Poster Centerpiece: Arch-Framed Art with Surya Sun Disc */}
          <div className="relative max-w-3xl mx-auto my-6 sm:my-10 flex flex-col items-center">
            {/* The Surya Sun Disc Aura */}
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 md:w-[480px] aspect-square rounded-full bg-accent/90 -z-10 shadow-[0_0_60px_rgba(184,50,31,0.25)] select-none"
            />

            {/* Arch-Framed Painting Mount */}
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/5] bg-paper-2 border-2 border-ink p-3 shadow-[4px_4px_0_var(--ink)]">
              <div className="relative w-full h-full overflow-hidden border border-line">
                <Image
                  src="/products/hero-49.webp"
                  alt="Featured Madhubani Artwork by Natasha Gupta"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 500px"
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-paper/95 border border-line px-3 py-1.5 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
                  <span>PLATE 49 · TANTRIK DEITY</span>
                  <span className="text-accent font-bold">ORIGINAL 1 OF 1</span>
                </div>
              </div>
            </div>

            {/* Ornaments Flanking */}
            <div className="w-full flex items-center justify-between max-w-xl mt-6 px-4">
              <Seal size={48} />
              <div className="flex items-center gap-3">
                <Link href="/shop">
                  <Button variant="primary" size="md">
                    SHOP PAINTINGS
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button variant="ghost" size="md">
                    EXPLORE GALLERY
                  </Button>
                </Link>
              </div>
              <Barcode width={95} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. TRUST STRIP IN MONOSPACE (Truthful, honest guarantees)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-paper-2 py-4 border-b border-line">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono text-xs tracking-[0.2em] uppercase text-ink">
            <div className="flex items-center justify-center gap-2">
              <span className="text-accent font-bold">✦</span>
              <span>100% HANDPAINTED</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-accent font-bold">✦</span>
              <span>DIRECT FROM ARTIST</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-accent font-bold">✦</span>
              <span>INSURED INDIA SHIPPING</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-accent font-bold">✦</span>
              <span>GIFT-READY PACKAGING</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. CATEGORY TILES AS THREE LARGE POSTERS
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 border-b border-line">
        <div className="container">
          <SectionHeader
            kicker="01 / DISCIPLINES"
            title="THREE HANDCRAFTED MEDIUMS"
            linkHref="/shop"
            linkLabel="EXPLORE ALL MEDIUMS"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Poster 1: Paintings */}
            <article className="group bg-paper border border-line p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--accent)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-line font-mono text-xs tracking-widest text-ink-muted">
                  <span>SERIES 01</span>
                  <span className="text-accent font-bold">FRAMED ART</span>
                </div>
                <Link href="/shop/category/paintings" className="block relative aspect-[4/5] my-4 border border-line overflow-hidden bg-paper-2">
                  <Image
                    src="/products/1.webp"
                    alt="Madhubani Paintings"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <h3 className="font-display text-3xl text-ink uppercase tracking-tight">
                  FRAMED PAINTINGS
                </h3>
                <p className="font-sans text-xs text-ink-soft mt-1 leading-relaxed">
                  Authentic Mithila canvases and handmade paper paintings framed with double archival fillets.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-line">
                <Link
                  href="/shop/category/paintings"
                  className="font-mono text-xs tracking-widest text-accent font-bold uppercase inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>VIEW PAINTINGS</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>

            {/* Poster 2: Dupattas */}
            <article className="group bg-paper border border-line p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--accent)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-line font-mono text-xs tracking-widest text-ink-muted">
                  <span>SERIES 02</span>
                  <span className="text-accent font-bold">WEARABLE ART</span>
                </div>
                <Link href="/shop/category/dupattas" className="block relative aspect-[4/5] my-4 border border-line overflow-hidden bg-paper-2">
                  <Image
                    src="/products/31.webp"
                    alt="Handpainted Dupattas"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <h3 className="font-display text-3xl text-ink uppercase tracking-tight">
                  DUPATTAS & TEXTILES
                </h3>
                <p className="font-sans text-xs text-ink-soft mt-1 leading-relaxed">
                  Hand-draped fine cotton and tussar silk dupattas painted with intricate floral and aquatic borders.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-line">
                <Link
                  href="/shop/category/dupattas"
                  className="font-mono text-xs tracking-widest text-accent font-bold uppercase inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>VIEW TEXTILES</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>

            {/* Poster 3: Bags & Files */}
            <article className="group bg-paper border border-line p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--accent)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-line font-mono text-xs tracking-widest text-ink-muted">
                  <span>SERIES 03</span>
                  <span className="text-accent font-bold">DAILY CARRY</span>
                </div>
                <Link href="/shop/category/bags_and_files" className="block relative aspect-[4/5] my-4 border border-line overflow-hidden bg-paper-2">
                  <Image
                    src="/products/80.webp"
                    alt="Handpainted Bags and Files"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <h3 className="font-display text-3xl text-ink uppercase tracking-tight">
                  BAGS & ORGANIZERS
                </h3>
                <p className="font-sans text-xs text-ink-soft mt-1 leading-relaxed">
                  Heavy canvas laptop totes, wall organizers, and document folders adorned with sacred Mithila motifs.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-line">
                <Link
                  href="/shop/category/bags_and_files"
                  className="font-mono text-xs tracking-widest text-accent font-bold uppercase inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>VIEW ACCESSORIES</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. FEATURED PRINTS GALLERY GRID
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 border-b border-line bg-paper-2">
        <div className="container">
          <SectionHeader
            kicker="02 / CURATION"
            title="FEATURED GALLERY PRINTS"
            linkHref="/shop"
            linkLabel="VIEW COMPLETE CATALOG"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p, idx) => (
              <PrintCard
                key={p.id}
                id={p.id}
                refCode={`FIG. 0${idx + 1}`}
                name={p.title || p.name || 'Madhubani Artwork'}
                slug={p.slug || p.id}
                image={p.image}
                pricePaise={p.pricePaise || p.price * 100}
                category={p.category}
                isOriginal={p.category === 'paintings'}
                stock={p.stock}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. MOTIF MARQUEE TICKER
          ══════════════════════════════════════════════════════════════════ */}
      <MarqueeTicker />

      {/* ══════════════════════════════════════════════════════════════════
          6. MEET NATASHA — Honest Solo Artist Monograph
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 border-b border-line bg-paper">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Frame: Photo coming soon placeholder */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] bg-paper-2 border-2 border-ink p-4 shadow-[4px_4px_0_var(--accent)] flex flex-col justify-between">
                <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-accent font-semibold flex justify-between">
                  <span>STUDIO PORTRAIT</span>
                  <span>NATASHA GUPTA</span>
                </div>

                <div className="border border-dashed border-ink/40 w-full h-64 flex flex-col items-center justify-center text-center p-6 bg-paper/50">
                  <div className="w-12 h-12 rounded-full border border-ink/30 flex items-center justify-center font-display text-accent text-xl font-bold mb-2">
                    N
                  </div>
                  <span className="font-mono text-xs tracking-widest uppercase text-ink font-semibold">
                    ARTIST STUDIO PHOTOGRAPH
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-ink-muted mt-1 uppercase">
                    [ PHOTO COMING SOON ]
                  </span>
                </div>

                <div className="font-mono text-[10px] tracking-wider text-ink-muted text-right">
                  FARIDABAD, HARYANA
                </div>
              </div>
            </div>

            {/* Story Editorial */}
            <div className="lg:col-span-7 space-y-6">
              <div className="font-mono text-xs tracking-[0.24em] uppercase text-accent font-semibold">
                03 / THE ARTIST
              </div>
              <h2 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight leading-[0.92]">
                PRESERVING THE SACRED LINES OF MITHILA
              </h2>
              <div className="font-sans text-sm sm:text-base text-ink-soft space-y-4 leading-relaxed">
                <p>
                  Natasha Gupta practices traditional Madhubani art independently from her studio in Faridabad. Rooted in the ancient visual language of Bihar’s Mithila region, her work bridges centuries-old ritual symbology with modern archival presentation.
                </p>
                <p>
                  Every artwork begins with raw handmade paper or handwoven fabric. Using bamboo pens, fine nibs, and pigmented inks, she draws without preliminary stencils — each leaf, fish scale, and peacock feather emerging organically through steady devotion.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link href="/about">
                  <Button variant="ink" size="md">
                    READ ARTIST MONOGRAPH
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" size="md">
                    COMMISSION ARTWORK
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          7. PROCESS STRIP — Three-Step Craft Truth
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-paper-2 border-b border-line">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs tracking-wider">
            <div className="border border-line p-5 bg-paper">
              <span className="text-accent font-bold text-sm block mb-1">01 / DRAWING</span>
              <h4 className="font-display text-xl uppercase text-ink mb-1">BAMBOO & NIB LINES</h4>
              <p className="text-ink-soft font-sans text-xs leading-normal">
                Double soot outlines and rhythmic kachni micro-hatching executed by hand.
              </p>
            </div>

            <div className="border border-line p-5 bg-paper">
              <span className="text-accent font-bold text-sm block mb-1">02 / COLOR</span>
              <h4 className="font-display text-xl uppercase text-ink mb-1">VIBRANT PIGMENTS</h4>
              <p className="text-ink-soft font-sans text-xs leading-normal">
                Rich vermilion, haldi ochre, lampblack, and neel mineral tones.
              </p>
            </div>

            <div className="border border-line p-5 bg-paper">
              <span className="text-accent font-bold text-sm block mb-1">03 / ARCHIVE</span>
              <h4 className="font-display text-xl uppercase text-ink mb-1">MUSEUM-GRADE FRAMING</h4>
              <p className="text-ink-soft font-sans text-xs leading-normal">
                Archival mats, reinforced corner guards, and secure insured delivery across India.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
