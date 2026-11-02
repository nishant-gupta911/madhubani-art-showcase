'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Download, ChevronLeft, ChevronRight, Maximize2, Grid, BookOpen, ExternalLink, Sparkles, X } from 'lucide-react';
import { SectionEyebrow } from '../MithilaMotif';
import { MadhubaniProduct } from '../../types';
import portfolioManifest from '../../../public/portfolio-pages/index.json';
import catalogMap from '../../../scripts/catalog-map.json';
import { Button } from '@/components/ui/Button';

interface PortfolioScreenProps {
  products: MadhubaniProduct[];
  onSelectProduct?: (p: MadhubaniProduct) => void;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ products, onSelectProduct }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'flipbook' | 'grid'>('flipbook');
  const [activeFilter, setActiveFilter] = useState<'all' | 'paintings' | 'dupattas' | 'bags'>('all');
  const [lightboxPage, setLightboxPage] = useState<number | null>(null);

  const totalPages = portfolioManifest.length;

  // Filter pages by catalog sections
  const filteredPages = useMemo(() => {
    return portfolioManifest.filter(page => {
      const pNum = page.pageNumber;
      if (activeFilter === 'paintings') return pNum >= 2 && pNum <= 30;
      if (activeFilter === 'dupattas') return pNum >= 31 && pNum <= 67;
      if (activeFilter === 'bags') return pNum >= 68 && pNum <= 83;
      return true;
    });
  }, [activeFilter]);

  // Match current page to product ref
  const matchedProduct = useMemo(() => {
    const pageItem = catalogMap.find(item => {
      const num = parseInt(item.filename.split('.')[0], 10);
      return num === currentPage;
    });
    if (!pageItem || pageItem.type === 'brand_page') return null;
    return products.find(p => p.ref === pageItem.ref);
  }, [currentPage, products]);

  const goToPrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') setLightboxPage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]);

  const currentPageData = portfolioManifest[currentPage - 1];

  return (
    <div className="min-h-screen pb-24 bg-paper text-ink selection:bg-accent selection:text-paper">
      {/* ── Header Banner ─────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-10 border-b border-line">
        <div className="container text-center space-y-3">
          <div className="font-mono text-xs tracking-[0.26em] uppercase text-accent font-semibold">
            02 / EXHIBITION GALLERY PORTFOLIO · 84 PLATES
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight leading-none">
            NATASHA GUPTA&apos;S ARTIST PORTFOLIO
          </h1>
          <p className="font-mono text-xs tracking-wider uppercase text-ink-muted mx-auto max-w-xl">
            Explore every artwork from the original Mithila catalog in high-resolution detail.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="/madhubani.pdf"
              download="Vernika_Enterprises_Madhubani_Catalog.pdf"
            >
              <Button variant="ink" size="md">
                <Download size={14} className="mr-2" />
                <span>DOWNLOAD COMPLETE CATALOG (PDF)</span>
              </Button>
            </a>

            <div className="flex border p-1" style={{ borderColor: 'var(--line)', background: 'var(--paper-2)' }}>
              <button
                onClick={() => setViewMode('flipbook')}
                className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors ${
                  viewMode === 'flipbook' ? 'bg-paper text-ink shadow-[1px_1px_0_var(--ink)] font-semibold' : 'text-ink/60'
                }`}
              >
                <BookOpen size={14} className="inline mr-1.5" />
                <span>Page Viewer</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors ${
                  viewMode === 'grid' ? 'bg-paper text-ink shadow-[1px_1px_0_var(--ink)] font-semibold' : 'text-ink/60'
                }`}
              >
                <Grid size={14} className="inline mr-1.5" />
                <span>All Pages ({totalPages})</span>
              </button>
            </div>
          </div>

          {/* Section Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Catalog Pages (84)' },
              { id: 'paintings', label: 'Framed Paintings (p. 2–30)' },
              { id: 'dupattas', label: 'Dupattas & Angvastras (p. 31–67)' },
              { id: 'bags', label: 'Bags & Files (p. 68–83)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id as any);
                  if (tab.id === 'paintings') setCurrentPage(2);
                  if (tab.id === 'dupattas') setCurrentPage(31);
                  if (tab.id === 'bags') setCurrentPage(68);
                  if (tab.id === 'all') setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 text-xs font-mono border transition-all ${
                  activeFilter === tab.id
                    ? 'border-accent bg-accent text-paper font-semibold shadow-[2px_2px_0_var(--ink)]'
                    : 'border-line text-ink/70 hover:border-ink hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mode 1: Interactive Flip-Book / Page Viewer ───────────── */}
      {viewMode === 'flipbook' && (
        <section className="py-12">
          <div className="container max-w-4xl">
            <div
              className="relative rounded-xl border shadow-lg overflow-hidden flex flex-col items-center justify-center p-4 md:p-8"
              style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}
            >
              {/* Page Image */}
              <div
                className="relative max-h-[75vh] w-full flex items-center justify-center cursor-zoom-in"
                onClick={() => setLightboxPage(currentPage)}
              >
                <Image
                  src={currentPageData?.imageUrl || '/portfolio-pages/page-01.webp'}
                  alt={`Vernika Enterprises Catalog Page ${currentPage}`}
                  width={700}
                  height={900}
                  priority
                  className="max-h-[70vh] w-auto object-contain rounded shadow-md border"
                  style={{ borderColor: 'rgba(42,26,20,0.1)' }}
                />

                <button
                  onClick={e => {
                    e.stopPropagation();
                    setLightboxPage(currentPage);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  title="Expand to Fullscreen"
                >
                  <Maximize2 size={16} />
                </button>
              </div>

              {/* Navigation Controls */}
              <div className="w-full flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
                <button
                  onClick={goToPrev}
                  disabled={currentPage <= 1}
                  className="btn btn-sm btn-outline flex items-center gap-1.5 disabled:opacity-40"
                  style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous Page</span>
                </button>

                <div className="flex items-center gap-2">
                  <label htmlFor="page-select" className="text-xs text-ink-soft">Page</label>
                  <select
                    id="page-select"
                    aria-label="Select catalog page number"
                    value={currentPage}
                    onChange={e => setCurrentPage(parseInt(e.target.value, 10))}
                    className="border rounded px-2 py-1 text-xs font-semibold"
                    style={{ borderColor: 'var(--line)', background: 'var(--paper)', color: 'var(--ink)' }}
                  >
                    {portfolioManifest.map(p => (
                      <option key={p.pageNumber} value={p.pageNumber}>
                        {p.pageNumber} of {totalPages}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={goToNext}
                  disabled={currentPage >= totalPages}
                  className="btn btn-sm btn-outline flex items-center gap-1.5 disabled:opacity-40"
                  style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                >
                  <span>Next Page</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Link to Shop Product if Available */}
              {matchedProduct && (
                <div
                  className="mt-6 w-full rounded-lg p-4 border flex flex-wrap items-center justify-between gap-4"
                  style={{ background: 'var(--paper-2)', borderColor: 'var(--accent)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-full bg-vermilion/10 text-vermilion">
                      <Sparkles size={18} style={{ color: 'var(--vermilion)' }} />
                    </span>
                    <div>
                      <p className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--vermilion)' }}>
                        Available in Shop
                      </p>
                      <h4 className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                        {matchedProduct.name || matchedProduct.title}
                      </h4>
                      <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                        ₹{matchedProduct.price.toLocaleString('en-IN')} • {matchedProduct.dimensions}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(matchedProduct);
                      else if (typeof window !== 'undefined') window.location.href = `/shop/${matchedProduct.slug || matchedProduct.id}`;
                    }}
                    className="btn btn-sm inline-flex items-center gap-1.5"
                    style={{ background: 'var(--accent)', color: 'var(--paper)' }}
                  >
                    <span>View Product</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Page Scrub Strip */}
            <div className="mt-8 overflow-x-auto pb-4 scrollbar-thin">
              <div className="flex gap-2">
                {portfolioManifest.map(p => (
                  <button
                    key={p.pageNumber}
                    onClick={() => setCurrentPage(p.pageNumber)}
                    className={`relative shrink-0 w-16 h-22 rounded border overflow-hidden transition-all ${
                      currentPage === p.pageNumber
                        ? 'ring-2 ring-vermilion border-vermilion scale-105'
                        : 'border-line opacity-65 hover:opacity-100'
                    }`}
                  >
                    <Image src={p.thumbUrl} alt={`Thumbnail ${p.pageNumber}`} width={64} height={88} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] text-center font-mono py-0.5">
                      {p.pageNumber}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Mode 2: Masonry Grid of All Catalog Pages ─────────────── */}
      {viewMode === 'grid' && (
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredPages.map(page => (
                <div
                  key={page.pageNumber}
                  onClick={() => {
                    setCurrentPage(page.pageNumber);
                    setViewMode('flipbook');
                  }}
                  className="group relative rounded-lg border overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                  style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-stone-100">
                    <img
                      src={page.thumbUrl}
                      alt={`Page ${page.pageNumber}`}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5 text-center border-t flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
                    <span className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>
                      Page {page.pageNumber}
                    </span>
                    <span className="text-[10px] text-ink-soft">Inspect</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Lightbox Modal ────────────────────────────────────────── */}
      {lightboxPage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxPage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img
              src={portfolioManifest[lightboxPage - 1]?.imageUrl}
              alt={`Page ${lightboxPage}`}
              className="max-h-[82vh] w-auto object-contain rounded shadow-2xl"
            />
            <div className="flex items-center justify-between w-full mt-4 text-white">
              <button
                onClick={() => setLightboxPage(p => Math.max(1, (p ?? 1) - 1))}
                disabled={lightboxPage <= 1}
                className="btn btn-sm btn-outline text-white border-white/30 hover:bg-white/10 disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-sm font-mono">
                Page {lightboxPage} of {totalPages}
              </span>
              <button
                onClick={() => setLightboxPage(p => Math.min(totalPages, (p ?? 1) + 1))}
                disabled={lightboxPage >= totalPages}
                className="btn btn-sm btn-outline text-white border-white/30 hover:bg-white/10 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
