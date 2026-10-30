import React from 'react';
import { MadhubaniProduct } from '../types';
import { X, ShoppingBag, Eye, Trash2, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#121212]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#181818] border border-[#303030] shadow-2xl p-6 sm:p-8 no-scrollbar text-white flex flex-col space-y-6 text-left">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#303030] pb-4">
          <div className="space-y-0.5">
            <span className="text-caption-uppercase text-[#da291c] block">
              TELEMETRY COMPARISON ENGINE
            </span>
            <h3 className="text-display-md text-white">
              SIDE-BY-SIDE SPECIFICATION COMPARISON ({products.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8f8f8f] hover:text-white bg-[#212121] hover:bg-[#da291c] transition-colors rounded-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center text-[#8f8f8f] space-y-3">
            <p>No artworks selected for comparison.</p>
            <button onClick={onClose} className="btn-ferrari-outline-dark py-2 px-6 text-xs">
              EXPLORE MASTER CATALOGUE
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#212121] border border-[#303030] p-4 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-4/5 overflow-hidden bg-[#181818] border border-[#303030]">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onRemoveFromCompare(product.id)}
                      className="absolute top-2 right-2 p-1.5 bg-[#181818]/90 text-[#8f8f8f] hover:text-[#da291c] border border-[#303030]"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#da291c] block">
                      {product.style} Technique
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-2">{product.title}</h4>
                  </div>

                  {/* Spec Sheet Table */}
                  <div className="space-y-2 text-xs border-t border-[#303030] pt-3 text-[#969696]">
                    <div>
                      <span className="text-[10px] text-[#666666] uppercase block">Dimensions</span>
                      <span className="text-white font-medium">{product.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#666666] uppercase block">Medium</span>
                      <span className="text-white font-medium">{product.medium}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#666666] uppercase block">Motif Category</span>
                      <span className="text-white font-medium">{product.categoryName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#666666] uppercase block">Price</span>
                      <span className="text-lg font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#303030]">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="btn-ferrari-primary w-full py-2.5 text-xs font-bold"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO BAG</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="btn-ferrari-outline-dark w-full py-2 text-xs font-bold"
                  >
                    VIEW FULL DETAILS
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
