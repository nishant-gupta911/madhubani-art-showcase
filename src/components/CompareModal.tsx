import React from 'react';
import { MadhubaniProduct } from '../types';
import { X, ShoppingBag, Eye, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';

interface CompareModalProps {
  products: MadhubaniProduct[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: MadhubaniProduct) => void;
  onSelectProduct: (product: MadhubaniProduct) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  products,
  isOpen,
  onClose,
  onRemoveFromCompare,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-paper border-2 border-ink shadow-[4px_4px_0_var(--ink)] p-6 sm:p-8 text-ink flex flex-col space-y-6 text-left">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent block">
              CATALOG ARCHIVE / COMPARISON
            </span>
            <h3 className="font-display tracking-tight text-2xl sm:text-3xl text-ink">
              SIDE-BY-SIDE SPECIFICATION ({products.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-ink hover:text-paper hover:bg-ink border border-ink transition-colors cursor-pointer"
            aria-label="Close comparison modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center text-ink/60 space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest">No artworks selected for comparison.</p>
            <Button onClick={onClose} variant="ink" size="sm">
              EXPLORE MASTER CATALOGUE
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-paper-2 border border-line p-4 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-4/5 overflow-hidden bg-paper border border-line">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onRemoveFromCompare(product.id)}
                      className="absolute top-2 right-2 p-1.5 bg-paper/90 text-ink hover:text-accent border border-line cursor-pointer"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-accent block">
                      {product.style} Technique
                    </span>
                    <h4 className="font-display text-lg font-bold text-ink line-clamp-2">{product.title}</h4>
                  </div>

                  {/* Spec Sheet Table */}
                  <div className="space-y-2 text-xs border-t border-line pt-3">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-ink/60 block">Dimensions</span>
                      <span className="font-mono text-xs font-semibold text-ink">{product.dimensions}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-ink/60 block">Medium</span>
                      <span className="font-mono text-xs font-semibold text-ink">{product.medium}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-ink/60 block">Motif Category</span>
                      <span className="font-mono text-xs font-semibold text-ink">{product.categoryName}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-ink/60 block">Price</span>
                      <span className="font-mono text-base font-bold text-accent">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-line">
                  <Button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                    <span>ADD TO BAG</span>
                  </Button>

                  <Button
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    VIEW FULL DETAILS
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
