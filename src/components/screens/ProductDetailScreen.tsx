import React, { useState } from 'react';
import { MadhubaniProduct } from '../../types';
import {
  ArrowLeft, Star, ShoppingBag, Heart, Share2, ZoomIn, Eye,
  ChevronRight, Package, ShieldCheck, Truck, Award, MessageCircle,
} from 'lucide-react';
import { MithilaMotif } from '../MithilaMotif';
import { CertificateModal } from '../CertificateModal';
import { WallVisualizerModal } from '../WallVisualizerModal';

interface ProductDetailScreenProps {
  product: MadhubaniProduct;
  products: MadhubaniProduct[];
  wishlist: string[];
  cartCount: number;
  onBack: () => void;
  onAddToCart: (p: MadhubaniProduct) => void;
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (p: MadhubaniProduct) => void;
  onNavigateToContact: () => void;
}

const FRAME_OPTIONS = [
  { id: 'none',    label: 'Unframed',      note: 'Ships rolled',  addPrice: 0    },
  { id: 'black',   label: 'Black Lacquer', note: '+₹1,200',       addPrice: 1200 },
  { id: 'teak',    label: 'Teak Wood',     note: '+₹1,800',       addPrice: 1800 },
  { id: 'acrylic', label: 'Float Acrylic', note: '+₹2,400',       addPrice: 2400 },
];

const DUMMY_REVIEWS = [
  { author: 'Priya S.',  loc: 'Mumbai',     rating: 5, date: 'Jul 2026', text: 'Absolutely museum quality. Arrived in beautiful packaging — looks spectacular on our living room wall.' },
  { author: 'David M.', loc: 'London, UK', rating: 5, date: 'Jun 2026', text: 'The natural pigments have an incredible warmth. Cannot believe this is handmade. Provenance certificate included is a lovely touch.' },
];

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product: p, products, wishlist, cartCount,
  onBack, onAddToCart, onToggleWishlist, onSelectProduct, onNavigateToContact,
}) => {
  const [selectedFrame, setSelectedFrame] = useState('none');
  const [addedToBag,    setAddedToBag]    = useState(false);
  const [activeTab,     setActiveTab]     = useState<'overview' | 'details' | 'reviews'>('overview');
  const [zoomOpen,      setZoomOpen]      = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [wallVisualizerOpen, setWallVisualizerOpen] = useState(false);

  const isWishlisted = wishlist.includes(p.id);
  const framePrice   = FRAME_OPTIONS.find(f => f.id === selectedFrame)?.addPrice ?? 0;
  const totalPrice   = p.price + framePrice;

  const related = products
    .filter(r => r.id !== p.id && (r.style === p.style || r.category === p.category))
    .slice(0, 4);

  const handleAddToCart = () => {
    onAddToCart(p);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2200);
  };

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh' }}>

      {/* ─── Breadcrumb ───────────────────────────────────────────── */}
      <div style={{ background: 'var(--ivory-deep)', borderBottom: '1px solid var(--hairline-soft)' }}>
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-caption" style={{ color: 'var(--ink-dim)' }}>
            <button
              onClick={onBack}
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
            <span className="line-clamp-1" style={{ color: 'var(--ink)' }}>{p.title}</span>
          </nav>
        </div>
      </div>

      {/* ─── Main Product Area ────────────────────────────────────── */}
      <div className="container py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ═══ LEFT — Artwork image ════════════════════════════════ */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">

            {/* Gallery frame */}
            <div
              className="relative corner-mark"
              style={{ background: 'var(--ivory-deep)', padding: '24px', borderRadius: '4px', border: '1px solid var(--hairline-soft)' }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-contain"
                  style={{ cursor: 'zoom-in' }}
                  onClick={() => setZoomOpen(true)}
                />
                {/* Image interactive actions */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => setWallVisualizerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer shadow-xs hover:bg-[var(--ivory)] transition-colors"
                    style={{ background: 'rgba(250,246,239,0.92)', border: '1px solid var(--hairline-soft)', borderRadius: '2px' }}
                    title="View artwork on a virtual wall"
                  >
                    <Eye size={12} style={{ color: 'var(--ink)' }} />
                    <span className="text-caption font-medium" style={{ color: 'var(--ink)' }}>Wall View</span>
                  </button>
                  <button
                    onClick={() => setZoomOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer shadow-xs hover:bg-[var(--ivory)] transition-colors"
                    style={{ background: 'rgba(250,246,239,0.92)', border: '1px solid var(--hairline-soft)', borderRadius: '2px' }}
                    title="Zoom in on painting details"
                  >
                    <ZoomIn size={12} style={{ color: 'var(--ink)' }} />
                    <span className="text-caption font-medium" style={{ color: 'var(--ink)' }}>Zoom</span>
                  </button>
                </div>
              </div>

              {/* Corner motif overlaid */}
              <div className="absolute inset-3 pointer-events-none">
                <MithilaMotif type="four-corners" color="var(--vermilion)" width="100%" height="100%" />
              </div>
            </div>

            {/* Info strip below image */}
            <div
              className="mt-4 flex items-center justify-between px-4 py-3"
              style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '3px' }}
            >
              <div className="flex items-center gap-2">
                <span className="badge badge-warm">{p.style} Style</span>
                {p.isNew && <span className="badge badge-vermilion">New</span>}
              </div>
              <p className="text-caption" style={{ color: 'var(--ink-muted)' }}>
                {p.dimensions}
              </p>
            </div>
          </div>

          {/* ═══ RIGHT — Product details ══════════════════════════════ */}
          <div className="lg:col-span-6 space-y-7">

            {/* Category + Style */}
            <div className="flex items-center gap-2.5">
              <span className="text-eyebrow" style={{ color: 'var(--vermilion)', letterSpacing: '0.16em' }}>
                {p.categoryShort}
              </span>
              <span style={{ color: 'var(--hairline)', fontSize: '1rem' }}>·</span>
              <span className="text-eyebrow" style={{ color: 'var(--ink-muted)', letterSpacing: '0.16em' }}>
                {p.medium.split(' ')[0]} Medium
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display font-bold"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: '1.12' }}
            >
              {p.title}
            </h1>

            {/* Stars + reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} className={s <= Math.round(p.rating) ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <span className="text-body-sm" style={{ color: 'var(--ink-muted)' }}>
                {p.rating} · {p.reviewsCount} collector reviews
              </span>
            </div>

            {/* Description */}
            <p className="text-body leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {p.shortDescription}
            </p>

            {/* Price */}
            <div
              className="py-5"
              style={{ borderTop: '1px solid var(--hairline-soft)', borderBottom: '1px solid var(--hairline-soft)' }}
            >
              <div className="flex items-baseline gap-3">
                <span
                  className="font-display font-bold"
                  style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', color: 'var(--ink)', letterSpacing: '-0.02em' }}
                >
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                {p.originalPrice && (
                  <span className="text-body line-through" style={{ color: 'var(--ink-dim)' }}>
                    ₹{p.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-caption mt-1.5" style={{ color: 'var(--ink-muted)' }}>
                {p.stock === 1 ? 'Last original available' : `${p.stock} available`} · One-of-one artwork
              </p>
            </div>

            {/* Frame selector */}
            <div className="space-y-3">
              <p className="text-ui" style={{ color: 'var(--ink)' }}>
                Framing Option
                <span className="ml-2 text-caption" style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>
                  (affects final price)
                </span>
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {FRAME_OPTIONS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFrame(f.id)}
                    className="frame-option"
                    style={{
                      borderColor: selectedFrame === f.id ? 'var(--vermilion)' : 'var(--hairline)',
                      background: selectedFrame === f.id ? 'var(--vermilion-tint)' : 'var(--ivory)',
                    }}
                  >
                    <p
                      className="text-ui font-semibold"
                      style={{ color: selectedFrame === f.id ? 'var(--vermilion)' : 'var(--ink)' }}
                    >
                      {f.label}
                    </p>
                    <p className="text-caption mt-0.5" style={{ color: 'var(--ink-dim)' }}>
                      {f.note}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={addedToBag}
                className="btn btn-primary btn-lg flex-1 justify-center"
                style={{ opacity: addedToBag ? 0.85 : 1 }}
              >
                {addedToBag ? (
                  <><ShieldCheck size={16} /> Added to Collection</>
                ) : (
                  <><ShoppingBag size={16} /> Add to Collection</>
                )}
              </button>
              <button
                onClick={() => onToggleWishlist(p.id)}
                className="btn btn-icon"
                style={{ width: '52px', height: '52px', borderRadius: '3px' }}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart
                  size={18}
                  style={{
                    color: isWishlisted ? 'var(--vermilion)' : 'var(--ink-muted)',
                    fill: isWishlisted ? 'var(--vermilion)' : 'none',
                    transition: 'all 0.2s',
                  }}
                />
              </button>
              <button className="btn btn-icon" style={{ width: '52px', height: '52px', borderRadius: '3px' }} aria-label="Share">
                <Share2 size={18} style={{ color: 'var(--ink-muted)' }} />
              </button>
            </div>

            {/* Shipping/trust microcopy */}
            <div
              className="grid grid-cols-2 gap-3 py-5"
              style={{ borderTop: '1px solid var(--hairline-soft)' }}
            >
              {[
                { icon: Truck,       text: 'Free shipping above ₹1,999' },
                { icon: Award,       text: 'Provenance certificate included (Preview)', onClick: () => setCertificateOpen(true) },
                { icon: Package,     text: 'Museum-grade archival packaging' },
                { icon: ShieldCheck, text: '7-day easy returns on all orders' },
              ].map(({ icon: Icon, text, onClick }) => (
                <div
                  key={text}
                  onClick={onClick}
                  className={`flex items-start gap-2.5 ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                >
                  <Icon size={14} style={{ color: 'var(--vermilion)', flexShrink: 0, marginTop: '2px' }} />
                  <span className={`text-caption leading-snug ${onClick ? 'underline decoration-dotted' : ''}`} style={{ color: 'var(--ink-muted)' }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Commission CTA */}
            <button
              onClick={onNavigateToContact}
              className="w-full flex items-center justify-between px-5 py-4 transition-colors duration-150"
              style={{
                background: 'var(--ivory-deep)',
                border: '1px solid var(--hairline-soft)',
                borderRadius: '3px',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--vermilion)'; e.currentTarget.style.background = 'var(--vermilion-tint)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hairline-soft)'; e.currentTarget.style.background = 'var(--ivory-deep)'; }}
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={16} style={{ color: 'var(--vermilion)' }} />
                <div className="text-left">
                  <p className="text-ui font-semibold" style={{ color: 'var(--ink)' }}>Commission a similar piece</p>
                  <p className="text-caption" style={{ color: 'var(--ink-muted)' }}>
                    Work directly with our artisan families for a custom artwork
                  </p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--ink-muted)', flexShrink: 0 }} />
            </button>

            {/* Details tabs */}
            <div style={{ borderTop: '1px solid var(--hairline-soft)' }}>
              <div className="flex border-b" style={{ borderColor: 'var(--hairline-soft)' }}>
                {(['overview', 'details', 'reviews'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 py-3 text-ui capitalize transition-all duration-150"
                    style={{
                      color: activeTab === tab ? 'var(--vermilion)' : 'var(--ink-muted)',
                      borderBottom: activeTab === tab ? '2px solid var(--vermilion)' : '2px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="pt-5">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <p className="text-body leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                      {p.longDescription}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(p.tags || []).map(tag => (
                        <span key={tag} className="badge badge-warm">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <dl className="space-y-3">
                    {[
                      { label: 'Dimensions',   value: p.dimensions },
                      { label: 'Medium',        value: p.medium },
                      { label: 'Style',         value: `${p.style} (Mithila tradition)` },
                      { label: 'Availability',  value: `${p.stock} original${p.stock !== 1 ? 's' : ''} available` },
                      { label: 'Origin',        value: 'Jitwarpur, Madhubani, Bihar, India' },
                      { label: 'Pigments',      value: 'Natural earth and botanical pigments only' },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-start gap-4 py-2.5"
                        style={{ borderBottom: '1px solid var(--hairline-soft)' }}
                      >
                        <dt className="text-caption shrink-0" style={{ color: 'var(--ink-muted)', width: '120px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {label}
                        </dt>
                        <dd className="text-body-sm" style={{ color: 'var(--ink-soft)' }}>{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-5">
                    {DUMMY_REVIEWS.map((r, i) => (
                      <div
                        key={i}
                        className="p-5 space-y-3"
                        style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '3px' }}
                      >
                        <div className="flex items-center gap-2">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={12} className={s <= r.rating ? 'star-filled' : 'star-empty'} />
                          ))}
                        </div>
                        <p className="text-body-sm leading-relaxed" style={{ color: 'var(--ink-soft)', fontStyle: 'italic' }}>
                          "{r.text}"
                        </p>
                        <div>
                          <p className="text-ui font-semibold" style={{ color: 'var(--ink)' }}>{r.author}</p>
                          <p className="text-caption" style={{ color: 'var(--ink-dim)' }}>{r.loc} · {r.date} · Verified</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Related Artworks ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          className="py-16"
          style={{ background: 'var(--ivory-deep)', borderTop: '1px solid var(--hairline-soft)' }}
        >
          <div className="container space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-eyebrow mb-1" style={{ color: 'var(--vermilion)', letterSpacing: '0.18em' }}>
                  You Might Also Like
                </p>
                <h2 className="font-display font-semibold" style={{ fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                  Related Artworks
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(r => (
                <article
                  key={r.id}
                  className="art-card group cursor-pointer"
                  style={{ borderRadius: '4px' }}
                  onClick={() => onSelectProduct(r)}
                >
                  <div
                    className="overflow-hidden"
                    style={{ aspectRatio: '4/5', background: 'var(--ivory)' }}
                  >
                    <img
                      src={r.image}
                      alt={r.title}
                      loading="lazy"
                      className="art-img w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3.5 space-y-1.5" style={{ borderTop: '1px solid var(--hairline-soft)' }}>
                    <span className="badge badge-warm">{r.style}</span>
                    <h3
                      className="font-display font-semibold line-clamp-2"
                      style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: '1.3' }}
                    >
                      {r.title}
                    </h3>
                    <p className="font-display font-semibold" style={{ color: 'var(--ink)', fontSize: '1rem' }}>
                      ₹{r.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Zoom Modal ───────────────────────────────────────────── */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: 'rgba(16,11,4,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={() => setZoomOpen(false)}
        >
          <button
            className="absolute top-6 right-6 btn btn-icon-dark"
            style={{ width: '42px', height: '42px' }}
            onClick={() => setZoomOpen(false)}
          >
            ✕
          </button>
          <img
            src={p.image}
            alt={p.title}
            className="max-w-full max-h-[90vh] object-contain"
            style={{ borderRadius: '3px' }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
      {/* ─── Certificate Modal ────────────────────────────────────── */}
      <CertificateModal
        product={p}
        isOpen={certificateOpen}
        onClose={() => setCertificateOpen(false)}
      />

      {/* ─── Wall Visualizer Modal ──────────────────────────────────── */}
      <WallVisualizerModal
        product={p}
        isOpen={wallVisualizerOpen}
        onClose={() => setWallVisualizerOpen(false)}
        onAddToCart={item => onAddToCart(item)}
      />
    </div>
  );
};
