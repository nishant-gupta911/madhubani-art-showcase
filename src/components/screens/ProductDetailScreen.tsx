'use client';

import React, { useState } from 'react';
import { MadhubaniProduct } from '../../types';
import {
  ArrowLeft, ShoppingBag, Heart, Share2, ZoomIn, Eye,
  ChevronRight, Package, ShieldCheck, Truck, Award, MessageCircle,
  Sparkles, CheckCircle2, MapPin
} from 'lucide-react';
import { MithilaMotif } from '../MithilaMotif';
import { WallVisualizerModal } from '../WallVisualizerModal';
import { siteConfig } from '../../config/site';

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
                <img
                  src={activeImage}
                  alt={p.name || p.title}
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
                    className={`relative w-16 h-20 rounded border overflow-hidden shrink-0 transition-all ${
                      activeImage === thumbUrl
                        ? 'ring-2 ring-vermilion border-vermilion scale-105'
                        : 'border-line opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={thumbUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
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
          <div className="lg:col-span-6 space-y-7">

            {/* Category + Ref */}
            <div className="flex items-center gap-2.5">
              <span className="text-eyebrow font-semibold" style={{ color: 'var(--vermilion)', letterSpacing: '0.14em' }}>
                {p.categoryName}
              </span>
              {p.ref && (
                <>
                  <span style={{ color: 'var(--hairline)' }}>·</span>
                  <span className="text-caption font-mono" style={{ color: 'var(--ink-muted)' }}>
                    Ref: {p.ref}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-display font-bold"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: '1.15' }}
            >
              {p.name || p.title}
            </h1>

            {/* Dimensions & Material preview */}
            <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--ink-soft)' }}>
              <span className="font-medium bg-stone-100 px-2.5 py-1 rounded">Size: {p.dimensions}</span>
              <span className="font-medium bg-stone-100 px-2.5 py-1 rounded">Artisan: Natasha Gupta</span>
              <span className="font-medium bg-stone-100 px-2.5 py-1 rounded">{p.technique || 'Handpainted Freehand'}</span>
            </div>

            {/* Price Box */}
            <div
              className="py-5"
              style={{ borderTop: '1px solid var(--hairline-soft)', borderBottom: '1px solid var(--hairline-soft)' }}
            >
              <div className="flex items-baseline gap-3">
                <span
                  className="font-display font-bold"
                  style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', color: 'var(--ink)', letterSpacing: '-0.02em' }}
                >
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                {p.compareAtPrice && p.compareAtPrice > totalPrice && (
                  <span className="text-body line-through" style={{ color: 'var(--ink-dim)' }}>
                    ₹{p.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-leaf font-medium">All taxes (GST) included</span>
              </div>
              <p className="text-caption mt-1.5" style={{ color: 'var(--ink-muted)' }}>
                {p.type === 'original_painting'
                  ? 'Quantity: 1 (One-of-a-kind original painting)'
                  : `Made to Order (${p.leadTimeDays || 7} to 10 days handpainting lead time)`}
              </p>
            </div>

            {/* Frame Option (if painting) */}
            {p.category === 'paintings' && (
              <div className="space-y-3">
                <p className="text-ui font-medium" style={{ color: 'var(--ink)' }}>
                  Framing Option
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FRAME_OPTIONS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFrame(f.id)}
                      className="p-3 text-left rounded border transition-all text-sm"
                      style={{
                        borderColor: selectedFrame === f.id ? 'var(--vermilion)' : 'var(--hairline)',
                        background: selectedFrame === f.id ? 'var(--vermilion-tint)' : 'var(--ivory)',
                      }}
                    >
                      <p className="font-semibold" style={{ color: selectedFrame === f.id ? 'var(--vermilion)' : 'var(--ink)' }}>
                        {f.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--ink-dim)' }}>
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
                <button
                  onClick={handleAddToCart}
                  disabled={addedToBag || (p.stock === 0 && p.type === 'original_painting')}
                  className="btn btn-primary btn-lg flex-1 justify-center disabled:opacity-50"
                  style={{ background: 'var(--vermilion)', color: '#fff' }}
                >
                  {addedToBag ? (
                    <><CheckCircle2 size={18} /> Added to Cart</>
                  ) : p.stock === 0 && p.type === 'original_painting' ? (
                    <span>Sold (View in Portfolio)</span>
                  ) : (
                    <><ShoppingBag size={18} /> Add to Cart</>
                  )}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className="btn btn-icon border"
                  style={{ width: '52px', height: '52px', borderRadius: '4px', borderColor: 'var(--line)' }}
                  aria-label="Wishlist"
                >
                  <Heart
                    size={20}
                    style={{
                      color: isWishlisted ? 'var(--vermilion)' : 'var(--ink-muted)',
                      fill: isWishlisted ? 'var(--vermilion)' : 'none',
                    }}
                  />
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: p.name, text: p.shortDescription, url: window.location.href }).catch(() => {});
                    }
                  }}
                  className="btn btn-icon border"
                  style={{ width: '52px', height: '52px', borderRadius: '4px', borderColor: 'var(--line)' }}
                  aria-label="Share"
                >
                  <Share2 size={18} style={{ color: 'var(--ink-muted)' }} />
                </button>
              </div>

              {/* Order via WhatsApp Direct Button */}
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full justify-center flex items-center gap-2 border text-sm font-medium py-3 rounded"
                style={{ borderColor: '#25D366', color: '#128C7E', background: '#F0FFF4' }}
              >
                <MessageCircle size={17} style={{ color: '#25D366' }} />
                <span>Order directly on WhatsApp (+91 7870909889)</span>
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
        <section className="py-16 border-t" style={{ background: 'var(--ivory-deep)', borderColor: 'var(--line)' }}>
          <div className="container space-y-8">
            <div>
              <p className="text-eyebrow mb-1" style={{ color: 'var(--vermilion)', letterSpacing: '0.14em' }}>
                Explore More Works
              </p>
              <h2 className="font-display font-semibold text-2xl" style={{ color: 'var(--ink)' }}>
                Related Artworks
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(r => (
                <article
                  key={r.id}
                  className="art-card group cursor-pointer bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all"
                  style={{ borderColor: 'var(--line)' }}
                  onClick={() => {
                    handleSelectProduct(r);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-stone-50">
                    <img src={r.image} alt={r.name || r.title} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3 border-t" style={{ borderColor: 'var(--line)' }}>
                    <p className="text-xs uppercase font-medium" style={{ color: 'var(--vermilion)' }}>{r.categoryShort}</p>
                    <h3 className="font-semibold text-sm line-clamp-1" style={{ color: 'var(--ink)' }}>{r.name || r.title}</h3>
                    <p className="text-xs font-bold mt-1" style={{ color: 'var(--ink)' }}>₹{r.price.toLocaleString('en-IN')}</p>
                  </div>
                </article>
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
