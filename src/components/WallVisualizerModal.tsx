'use client';

import React, { useState } from 'react';
import { MadhubaniProduct, FramingOption } from '../types';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from './ui/Button';

interface WallVisualizerModalProps {
  product: MadhubaniProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: MadhubaniProduct, framing?: FramingOption) => void;
}

export const WallVisualizerModal: React.FC<WallVisualizerModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<'gallery' | 'living' | 'studio'>('gallery');
  const [selectedFrame, setSelectedFrame] = useState<FramingOption>('black-frame');
  const [scaleSize, setScaleSize] = useState<number>(1);

  if (!isOpen || !product) return null;

  const frameStyles: Record<FramingOption, string> = {
    unframed: 'border border-line shadow-sm p-1.5 bg-paper',
    'black-frame': 'border-[10px] border-ink shadow-xl p-2 bg-paper',
    'teak-frame': 'border-[12px] border-ink/80 shadow-xl p-2 bg-paper',
    'museum-acrylic': 'border-2 border-ink shadow-2xl p-3 bg-paper/95',
  };

  const framePrices: Record<FramingOption, number> = {
    unframed: 0,
    'black-frame': 1490,
    'teak-frame': 2250,
    'museum-acrylic': 3100,
  };

  const roomBackgrounds = {
    gallery: 'bg-paper-2',
    living: 'bg-paper',
    studio: 'bg-paper-2/80',
  };

  const currentTotal = product.price + framePrices[selectedFrame];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-ink/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] overflow-hidden bg-paper border-2 border-ink shadow-[4px_4px_0_var(--ink)] flex flex-col text-ink">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper-2">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent block">
              ATELIER ARCHIVE / WALL SIMULATOR
            </span>
            <h3 className="font-display tracking-tight text-xl sm:text-2xl text-ink">
              {product.title} • {product.dimensions}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-ink hover:text-paper hover:bg-ink border border-ink transition-colors cursor-pointer"
            aria-label="Close wall simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Stage */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-6 sm:p-12 transition-colors duration-500">
          <div className={`absolute inset-0 ${roomBackgrounds[selectedRoom]}`} />
          <div className="absolute bottom-0 inset-x-0 h-28 border-t border-line/40 bg-ink/5 pointer-events-none" />

          {/* Console Table Reference */}
          <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none opacity-60">
            <div className="w-80 h-10 border-t-2 border-ink bg-paper-2 flex items-center justify-center text-[10px] uppercase font-mono tracking-widest text-ink/70">
              BENCH REFERENCE (120 CM)
            </div>
          </div>

          {/* Artwork Stage */}
          <div
            className="relative z-10 transition-all duration-300 ease-out"
            style={{ transform: `scale(${scaleSize})` }}
          >
            <div className={`${frameStyles[selectedFrame]} transition-all duration-300`}>
              <img
                src={product.image}
                alt={product.title}
                className="max-h-[42vh] w-auto object-contain"
              />
            </div>

            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-paper text-ink text-[10px] font-mono px-2 py-0.5 border border-line shadow-xs whitespace-nowrap">
              {product.dimensions} • SCALE {Math.round(scaleSize * 100)}%
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="bg-paper-2 border-t border-line p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Frame Style Selectors */}
          <div className="md:col-span-5 space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent block">
              BESPOKE FRAMING
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'unframed', name: 'Raw Paper', price: 0 },
                { id: 'black-frame', name: 'Matte Black', price: 1490 },
                { id: 'teak-frame', name: 'Teak Wood', price: 2250 },
                { id: 'museum-acrylic', name: 'Museum Glass', price: 3100 },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFrame(f.id as FramingOption)}
                  className={`p-2 border text-left transition-colors font-mono cursor-pointer ${
                    selectedFrame === f.id
                      ? 'bg-ink text-paper border-ink shadow-[2px_2px_0_var(--accent)]'
                      : 'bg-paper border-line text-ink hover:bg-paper-2'
                  }`}
                >
                  <span className="block text-[10px] font-semibold truncate">{f.name}</span>
                  <span className="text-[9px] text-accent block">
                    {f.price === 0 ? 'Included' : `+₹${f.price}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scale & Room Selector */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 block">
              WALL ENVIRONMENT &amp; SCALE
            </span>
            <div className="flex items-center gap-2">
              {(['gallery', 'living', 'studio'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRoom(r)}
                  className={`px-2.5 py-1 text-[10px] uppercase font-mono border transition-colors cursor-pointer ${
                    selectedRoom === r
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-paper border-line text-ink hover:bg-paper-2'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
              <span className="uppercase text-ink/70">Scale</span>
              <input
                type="range"
                min="0.75"
                max="1.3"
                step="0.05"
                value={scaleSize}
                onChange={(e) => setScaleSize(parseFloat(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          {/* Price & Action */}
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col justify-end items-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-line">
            <div className="text-right">
              <span className="font-mono text-[9px] text-ink/60 uppercase tracking-wider block">CONFIGURED PRICE</span>
              <span className="font-mono text-2xl font-bold text-accent tracking-tight">
                ₹{currentTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <Button
              onClick={() => {
                onAddToCart(product, selectedFrame);
                onClose();
              }}
              variant="primary"
              size="md"
              className="w-full"
            >
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              <span>RESERVE CONFIGURATION</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
