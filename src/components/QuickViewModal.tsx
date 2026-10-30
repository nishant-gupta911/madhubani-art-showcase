import React from 'react';
import { MadhubaniProduct } from '../types';
import { X, ShoppingBag, Eye, Heart, Star } from 'lucide-react';
import { MithilaMotif } from './MithilaMotif';

interface QuickViewModalProps {
  product: MadhubaniProduct;
  wishlist: string[];
  onClose: () => void;
  onAddToCart: (p: MadhubaniProduct) => void;
  onToggleWishlist: (id: string) => void;
  onViewFull: (p: MadhubaniProduct) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product, wishlist, onClose, onAddToCart, onToggleWishlist, onViewFull,
}) => {
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center p-4"
      style={{ background: 'rgba(16,11,4,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar animate-fade-up"
        style={{
          background: 'var(--ivory)',
          border: '1px solid var(--hairline)',
          borderRadius: '4px',
          boxShadow: '0 20px 50px rgba(16,11,4,0.25)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <MithilaMotif type="four-corners" color="var(--vermilion)" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 btn btn-icon"
          style={{ background: 'var(--ivory-deep)', borderColor: 'var(--hairline-soft)' }}
          aria-label="Close modal"
        >
          <X size={15} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div
            className="relative overflow-hidden flex items-center justify-center p-4"
            style={{ background: 'var(--ivory-deep)', borderRight: '1px solid var(--hairline-soft)', minHeight: '320px' }}
          >
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[350px] w-auto object-contain"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1">
              <span className="badge badge-warm">{product.style}</span>
              {product.isNew && <span className="badge badge-vermilion">NEW</span>}
            </div>
          </div>

          {/* Info */}
          <div className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex flex-wrap gap-1.5">
                <span className="text-eyebrow" style={{ color: 'var(--vermilion)', letterSpacing: '0.12em', fontSize: '0.6rem' }}>
                  {product.categoryShort}
                </span>
              </div>

              <h2
                className="font-display font-semibold leading-tight"
                style={{ fontSize: '1.5rem', color: 'var(--ink)' }}
              >
                {product.title}
              </h2>

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star
                      key={s}
                      size={12}
                      className={s <= Math.round(product.rating) ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                </div>
                <span className="text-caption" style={{ color: 'var(--ink-muted)' }}>
                  ({product.reviewsCount} reviews)
                </span>
              </div>

              <p className="text-body-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {product.shortDescription}
              </p>

              <div className="space-y-1 text-caption" style={{ color: 'var(--ink-muted)' }}>
                <div><span className="font-semibold" style={{ color: 'var(--ink-soft)' }}>Dimensions: </span>{product.dimensions}</div>
                <div><span className="font-semibold" style={{ color: 'var(--ink-soft)' }}>Medium: </span>{product.medium}</div>
                <div>
                  <span
                    className="font-semibold"
                    style={{
                      color: product.stock === 0 ? 'var(--ink-dim)' : product.stock === 1 ? 'var(--turmeric)' : 'var(--leaf)'
                    }}
                  >
                    {product.stock === 0 ? 'SOLD OUT' : product.stock === 1 ? `Only 1 original remaining` : `${product.stock} available`}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-caption line-through" style={{ color: 'var(--ink-dim)' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-4" style={{ borderTop: '1px solid var(--hairline-soft)' }}>
              <button
                onClick={() => { onAddToCart(product); onClose(); }}
                disabled={product.stock === 0}
                className="btn btn-primary w-full justify-center"
              >
                <ShoppingBag size={14} /> Add to Collection
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onViewFull(product); onClose(); }}
                  className="btn btn-outline btn-sm justify-center"
                >
                  <Eye size={12} /> Full Detail
                </button>
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="btn btn-outline btn-sm justify-center"
                  style={{
                    borderColor: isWishlisted ? 'var(--vermilion)' : 'var(--hairline)',
                    background: isWishlisted ? 'var(--vermilion-tint)' : 'transparent',
                    color: isWishlisted ? 'var(--vermilion)' : 'var(--ink-soft)',
                  }}
                >
                  <Heart size={12} style={{ fill: isWishlisted ? 'var(--vermilion)' : 'none' }} />
                  {isWishlisted ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
