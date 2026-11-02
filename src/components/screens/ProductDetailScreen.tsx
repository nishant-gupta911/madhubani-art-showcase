'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MadhubaniProduct } from '../../types';
import {
  ArrowLeft, ShoppingBag, Heart, Share2, ZoomIn, Eye,
  ChevronRight, Package, ShieldCheck, Truck, Award, MessageCircle,
  Sparkles, CheckCircle2, MapPin
} from 'lucide-react';
import { MithilaMotif } from '../MithilaMotif';
import { siteConfig } from '../../config/site';
import { Button } from '@/components/ui/Button';
import { PrintCard } from '@/components/ui/PrintCard';

const WallVisualizerModal = dynamic(
  () => import('../WallVisualizerModal').then(m => m.WallVisualizerModal),
  { ssr: false }
);

interface ProductDetailScreenProps {
  product: MadhubaniProduct;
  products: MadhubaniProduct[];
  wishlist?: string[];
  cartCount?: number;
  onBack?: () => void;
  onAddToCart?: (p: MadhubaniProduct) => void;
  onToggleWishlist?: (id: string) => void;
  onSelectProduct?: (p: MadhubaniProduct) => void;
  onNavigateToContact?: () => void;
}

const FRAME_OPTIONS = [
  { id: 'framed',   label: 'Framed in Sleek Black (Ready to Hang)', note: 'Included with Cream Mat', addPrice: 0 },
  { id: 'rolled',   label: 'Unframed Rolled in Archival Tube',      note: 'Save ₹300',              addPrice: -300 },
];

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product: p, products, wishlist = [], cartCount = 0,
  onBack, onAddToCart, onToggleWishlist, onSelectProduct, onNavigateToContact,
}) => {
  const [selectedFrame, setSelectedFrame] = useState(p.category === 'paintings' ? 'framed' : 'rolled');
  const [activeImage, setActiveImage] = useState(p.image);
  const [addedToBag, setAddedToBag] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'story' | 'details'>('overview');
  const [wallVisualizerOpen, setWallVisualizerOpen] = useState(false);

  // Pincode estimator state
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  const isWishlisted = wishlist.includes(p.id);
  const frameAdjustment = p.category === 'paintings' && selectedFrame === 'rolled' ? -300 : 0;
  const totalPrice = Math.max(100, p.price + frameAdjustment);

  const galleryList = (p.galleryImages && p.galleryImages.length > 0)
    ? p.galleryImages
    : [p.image];

  const related = products
    .filter(r => r.id !== p.id && (r.category === p.category || r.subCategory === p.subCategory))
    .slice(0, 4);

  const handleBack = () => {
    if (onBack) onBack();
    else if (typeof window !== 'undefined') window.location.href = '/shop';
  };

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(p);
    else if (typeof window !== 'undefined') window.location.href = '/cart';
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2200);
  };

  const handleToggleWishlist = () => {
    if (onToggleWishlist) onToggleWishlist(p.id);
  };

  const handleSelectProduct = (r: MadhubaniProduct) => {
    if (onSelectProduct) onSelectProduct(r);
    else if (typeof window !== 'undefined') window.location.href = `/shop/${r.slug || r.id}`;
  };

  const handleNavigateToContact = () => {
    if (onNavigateToContact) onNavigateToContact();
    else if (typeof window !== 'undefined') window.location.href = '/contact';
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    const pin = pincode.trim();
    if (pin.startsWith('80') || pin.startsWith('84') || pin.startsWith('85')) {
      setPincodeResult('Express Delivery: 2–3 business days (Bihar local dispatch)');
    } else if (pin.startsWith('11') || pin.startsWith('40') || pin.startsWith('56') || pin.startsWith('60') || pin.startsWith('70')) {
      setPincodeResult('Standard Express: 3–5 business days to Metro hubs');
    } else {
      setPincodeResult('Standard Courier: 5–7 business days with door delivery');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Natasha, I am interested in purchasing "${p.title || p.name}" (Ref: ${p.ref || p.id}) priced at ₹${totalPrice.toLocaleString('en-IN')}. Please share availability and payment details.`
  );

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh' }}>

      {/* ─── Breadcrumb ───────────────────────────────────────────── */}
      <div style={{ background: 'var(--ivory-deep)', borderBottom: '1px solid var(--hairline-soft)' }}>
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-caption" style={{ color: 'var(--ink-dim)' }}>
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 transition-colors duration-150"
              style={{ color: 'var(--ink-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--vermilion)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-muted)')}
            >
              <ArrowLeft size={12} />
              The Collection
            </button>
            <ChevronRight size={10} style={{ opacity: 0.4 }} />
            <span style={{ color: 'var(--ink-muted)' }}>{p.categoryShort}</span>
            <ChevronRight size={10} style={{ opacity: 0.4 }} />
            <span className="line-clamp-1 font-medium" style={{ color: 'var(--ink)' }}>{p.name || p.title}</span>
          </nav>
        </div>
      </div>

      {/* ─── Main Product Area ────────────────────────────────────── */}
      <div className="container py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ═══ LEFT — Artwork image gallery ══════════════════════════ */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">

            {/* Gallery frame */}
            <div
              className="relative corner-mark rounded-lg overflow-hidden border shadow-sm"
              style={{ background: 'var(--ivory-deep)', padding: '20px', borderColor: 'var(--hairline-soft)' }}
            >
              <div className="relative overflow-hidden flex items-center justify-center bg-stone-50" style={{ aspectRatio: '4/5' }}>
                <Image
                  src={activeImage}
                  alt={p.name || p.title}
                  priority
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="w-full h-full object-contain transition-all duration-300"
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <span className="badge badge-warm text-xs px-2.5 py-1">
                    {p.categoryShort}
                  </span>
                  {p.type === 'original_painting' && (
                    <span className="badge badge-vermilion text-xs px-2.5 py-1">
                      One-of-a-kind Original
                    </span>
                  )}
                  {p.type === 'made_to_order' && (
                    <span className="badge text-xs px-2.5 py-1 bg-amber-600/90 text-white">
                      Made to Order ({p.leadTimeDays || 7}d)
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                  {p.category === 'paintings' && (
                    <button
                      onClick={() => setWallVisualizerOpen(true)}
                      className="px-3 py-1.5 rounded-full bg-white/90 shadow text-xs font-medium flex items-center gap-1.5 hover:bg-white text-ink"
                    >
                      <Eye size={13} style={{ color: 'var(--vermilion)' }} />
                      <span>View on Wall</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail selector when multiple shots exist */}
            {galleryList.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {galleryList.map((thumbUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(thumbUrl)}
                    aria-label={`View image thumbnail ${idx + 1}`}
                    className={`relative w-16 h-20 rounded border overflow-hidden shrink-0 transition-all ${
                      activeImage === thumbUrl
                        ? 'ring-2 ring-vermilion border-vermilion scale-105'
                        : 'border-line opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={thumbUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Handmade authenticity disclaimer note */}
            <div className="p-3.5 rounded border text-xs leading-relaxed" style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
              <span className="font-semibold text-vermilion">Handmade Notice: </span>
              Each piece is individually handpainted by Natasha Gupta. As with all authentic handmade folk art, natural variations in stroke density, motif placement, and pigment tones occur and are celebrated as marks of original artistry.
            </div>
          </div>

          {/* ═══ RIGHT — Product details ══════════════════════════════ */}
          <div className="lg:col-span-6 space-y-6">

            {/* Category + Ref */}
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.24em] text-accent uppercase font-bold">
              <span>{p.categoryName}</span>
              {p.ref && (
                <>
                  <span className="text-ink-muted">·</span>
                  <span className="text-ink-muted">REF: {p.ref}</span>
                </>
              )}
            </div>

            {/* Title in condensed display font */}
            <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight leading-[0.92]">
              {p.name || p.title}
            </h1>

            {/* Monospace Quick Specs Badges */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-ink-soft">
              <span className="border border-line bg-paper px-2.5 py-1">SIZE: {p.dimensions}</span>
              <span className="border border-line bg-paper px-2.5 py-1">ARTIST: NATASHA GUPTA</span>
              <span className="border border-line bg-paper px-2.5 py-1 text-accent font-semibold">{p.technique || 'HANDPAINTED'}</span>
            </div>

            {/* Price Box */}
            <div className="py-4 border-y border-line">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl sm:text-5xl text-ink leading-none">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                {p.compareAtPrice && p.compareAtPrice > totalPrice && (
                  <span className="font-mono text-sm line-through text-ink-muted">
                    ₹{p.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="font-mono text-xs text-leaf font-bold uppercase tracking-wider">
                  ALL TAXES (GST) INCLUDED
                </span>
              </div>
              <p className="font-mono text-xs text-ink-muted mt-2 tracking-wide uppercase">
                {p.type === 'original_painting'
                  ? 'QUANTITY: 1 OF 1 (ORIGINAL WORK)'
                  : `MADE TO ORDER (${p.leadTimeDays || 7} DAYS LEAD TIME)`}
              </p>
            </div>

            {/* Frame Option (if painting) */}
            {p.category === 'paintings' && (
              <div className="space-y-2">
                <p className="font-mono text-xs tracking-widest text-ink font-semibold uppercase">
                  FRAMING SELECTION
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FRAME_OPTIONS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFrame(f.id)}
                      className={`p-3 text-left border transition-all cursor-pointer ${
                        selectedFrame === f.id
                          ? 'border-ink bg-paper shadow-[2px_2px_0_var(--accent)]'
                          : 'border-line bg-paper-2 hover:border-ink'
                      }`}
                    >
                      <p className={`font-mono text-xs uppercase font-bold ${
                        selectedFrame === f.id ? 'text-accent' : 'text-ink'
                      }`}>
                        {f.label}
                      </p>
                      <p className="font-mono text-[10px] text-ink-muted mt-1 uppercase">
                        {f.note}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs: Add to Cart + WhatsApp Order */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={addedToBag || (p.stock === 0 && p.type === 'original_painting')}
                  className="flex-1"
                >
                  {addedToBag ? (
                    <span className="flex items-center gap-2"><CheckCircle2 size={16} /> ADDED TO CART</span>
                  ) : p.stock === 0 && p.type === 'original_painting' ? (
                    <span>SOLD OUT (ORIGINAL 1 OF 1)</span>
                  ) : (
                    <span className="flex items-center gap-2"><ShoppingBag size={16} /> ADD TO CART</span>
                  )}
                </Button>

                <button
                  onClick={handleToggleWishlist}
                  className="w-14 border border-line bg-paper flex items-center justify-center text-ink hover:border-ink transition-colors cursor-pointer"
                  aria-label="Wishlist"
                >
                  <Heart
                    size={18}
                    style={{
                      color: isWishlisted ? 'var(--accent)' : 'var(--ink-muted)',
                      fill: isWishlisted ? 'var(--accent)' : 'none',
                    }}
                  />
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: p.name, text: p.shortDescription, url: window.location.href }).catch(() => {});
                    }
                  }}
                  className="w-14 border border-line bg-paper flex items-center justify-center text-ink hover:border-ink transition-colors cursor-pointer"
                  aria-label="Share"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Order via WhatsApp Direct Button */}
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full justify-center flex items-center gap-2 border border-[#25D366] text-[#075E54] bg-[#F0FFF4] py-3 text-xs font-mono tracking-widest uppercase font-bold hover:brightness-95 transition-all"
              >
                <MessageCircle size={16} />
                <span>ORDER DIRECTLY ON WHATSAPP (+91 {siteConfig.contact.phone})</span>
              </a>
            </div>

            {/* Pincode Delivery Estimator */}
            <div className="p-4 rounded-lg border space-y-3" style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
                <MapPin size={14} style={{ color: 'var(--vermilion)' }} />
                <span>Estimate Delivery to Your Location</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode (e.g. 110001)"
                  className="input flex-1 text-sm bg-white border px-3 py-2 rounded"
                  style={{ borderColor: 'var(--line)' }}
                />
                <button type="submit" className="btn btn-sm btn-outline text-xs px-4" style={{ borderColor: 'var(--vermilion)', color: 'var(--vermilion)' }}>
                  Check
                </button>
              </form>
              {pincodeResult && (
                <p className="text-xs font-medium" style={{ color: pincodeResult.startsWith('Please') ? 'var(--vermilion)' : 'var(--leaf)' }}>
                  {pincodeResult}
                </p>
              )}
            </div>

            {/* Trust features list */}
            <div className="grid grid-cols-2 gap-3 py-4 border-t" style={{ borderColor: 'var(--line)' }}>
              {[
                { icon: Truck, text: 'Free delivery above ₹1,499' },
                { icon: Award, text: p.technique ? `${p.technique} Tradition` : 'Authentic Mithila Craftsmanship' },
                { icon: Package, text: 'Museum-grade protective packaging' },
                { icon: ShieldCheck, text: 'Cash on Delivery (COD) available' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-start gap-2.5"
                >
                  <Icon size={14} style={{ color: 'var(--vermilion)', flexShrink: 0, marginTop: '2px' }} />
                  <span className="text-caption" style={{ color: 'var(--ink-muted)' }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Tabs: Overview, The Story, Specifications */}
            <div style={{ borderTop: '1px solid var(--line)' }}>
              <div className="flex border-b" style={{ borderColor: 'var(--line)' }}>
                {(['overview', 'story', 'details'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 py-3 text-xs uppercase font-semibold tracking-wider transition-all"
                    style={{
                      color: activeTab === tab ? 'var(--vermilion)' : 'var(--ink-muted)',
                      borderBottom: activeTab === tab ? '2px solid var(--vermilion)' : '2px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >
                    {tab === 'story' ? 'The Story of this Motif' : tab}
                  </button>
                ))}
              </div>

              <div className="pt-5">
                {activeTab === 'overview' && (
                  <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    <p>{p.longDescription || p.shortDescription}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(p.tags || []).map(tag => (
                        <span key={tag} className="badge badge-warm text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'story' && (
                  <div className="p-4 rounded-lg space-y-3 border" style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} style={{ color: 'var(--vermilion)' }} />
                      <h4 className="font-display font-semibold text-base" style={{ color: 'var(--ink)' }}>
                        Cultural Significance & Lore
                      </h4>
                    </div>
                    <p className="text-sm leading-relaxed italic" style={{ color: 'var(--ink-soft)' }}>
                      "{p.story || 'Madhubani art is an auspicious visual language where every bird, fish, tree, and deity communicates sacred blessings of prosperity, longevity, and joy.'}"
                    </p>
                  </div>
                )}

                {activeTab === 'details' && (
                  <dl className="space-y-2.5 text-sm">
                    {[
                      { label: 'Artwork Ref', value: p.ref || p.id },
                      { label: 'Dimensions', value: p.dimensions },
                      { label: 'Medium', value: p.medium },
                      { label: 'Material', value: p.material || 'Handmade bamboo-pulp paper / handloom fabric' },
                      { label: 'Technique', value: p.technique ? `${p.technique} (Mithila folk style)` : 'Handpainted freehand' },
                      { label: 'Origin', value: siteConfig.origin },
                      { label: 'Artist', value: 'Natasha Gupta' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start gap-4 py-2 border-b" style={{ borderColor: 'var(--line)' }}>
                        <dt className="text-xs uppercase font-medium shrink-0" style={{ color: 'var(--ink-muted)', width: '130px' }}>
                          {label}
                        </dt>
                        <dd className="font-medium text-xs" style={{ color: 'var(--ink)' }}>{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>

            {/* Custom Commission Prompt */}
            <div className="p-4 rounded border flex items-center justify-between" style={{ background: 'var(--ivory-deep)', borderColor: 'var(--line)' }}>
              <div>
                <p className="font-semibold text-xs" style={{ color: 'var(--ink)' }}>Want a custom size, color or framed suite?</p>
                <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>Natasha Gupta accepts custom bespoke commissions.</p>
              </div>
              <button onClick={handleNavigateToContact} className="btn btn-sm btn-outline text-xs px-3" style={{ borderColor: 'var(--vermilion)', color: 'var(--vermilion)' }}>
                Request Custom Piece
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Related Products ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-16 border-t border-line bg-paper-2">
          <div className="container space-y-8">
            <div className="border-b border-line pb-4">
              <span className="font-mono text-xs tracking-[0.24em] text-accent uppercase font-bold">
                CURATED COMPANIONS
              </span>
              <h2 className="font-display text-4xl uppercase text-ink mt-1">
                RELATED GALLERY PRINTS
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {related.map((r, idx) => (
                <PrintCard
                  key={r.id}
                  id={r.id}
                  refCode={`PLATE ${String(idx + 1).padStart(2, '0')}`}
                  name={r.name || r.title}
                  slug={r.slug || r.id}
                  image={r.image}
                  pricePaise={r.price * 100}
                  category={r.category}
                  isOriginal={r.category === 'paintings'}
                  stock={r.stock ?? 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      {wallVisualizerOpen && (
        <WallVisualizerModal
          product={p}
          isOpen={wallVisualizerOpen}
          onClose={() => setWallVisualizerOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};
