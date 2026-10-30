import React, { useState } from 'react';
import { MadhubaniProduct, FramingOption } from '../types';
import { X, Check, ShoppingBag, Eye, Maximize, Sliders, Palette } from 'lucide-react';

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
  const [selectedRoom, setSelectedRoom] = useState<'penthouse' | 'modernist' | 'atelier'>('penthouse');
  const [selectedFrame, setSelectedFrame] = useState<FramingOption>('black-frame');
  const [scaleSize, setScaleSize] = useState<number>(1);
  const [wallColor, setWallColor] = useState<string>('charcoal');

  if (!isOpen || !product) return null;

  const frameStyles = {
    unframed: 'border border-[#d2d2d2] shadow-md p-1 bg-[#FBF8F1]',
    'black-frame': 'border-[12px] border-[#111111] shadow-2xl p-2 bg-[#ffffff]',
    'teak-frame': 'border-[14px] border-[#5c3a21] shadow-2xl p-2 bg-[#ffffff]',
    'museum-acrylic': 'border-2 border-[#ffffff]/80 shadow-2xl p-3 bg-[#ffffff] backdrop-blur-xs',
  };

  const framePrices = {
    unframed: 0,
    'black-frame': 1490,
    'teak-frame': 2250,
    'museum-acrylic': 3100,
  };

  const roomBackgrounds = {
    penthouse: 'bg-gradient-to-b from-[#2a2a2a] via-[#1f1f1f] to-[#141414]',
    modernist: 'bg-gradient-to-b from-[#3a3a3a] via-[#242424] to-[#121212]',
    atelier: 'bg-gradient-to-b from-[#2e261f] via-[#1f1914] to-[#0f0c0a]',
  };

  const wallTones = {
    charcoal: 'bg-[#222222]',
    warmOchre: 'bg-[#2b251f]',
    pureDark: 'bg-[#141414]',
    museumOffWhite: 'bg-[#ece8df] text-[#181818]',
  };

  const currentTotal = product.price + framePrices[selectedFrame];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#121212]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] overflow-hidden bg-[#181818] border border-[#303030] shadow-2xl rounded-none flex flex-col text-white">
        
        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#303030] bg-[#141414]">
          <div className="space-y-0.5">
            <span className="text-caption-uppercase text-[#da291c] block">
              ATELIER AR WALL SIMULATOR
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              {product.title} • {product.dimensions}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8f8f8f] hover:text-white bg-[#212121] hover:bg-[#da291c] transition-colors rounded-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Interactive Stage Area */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-6 sm:p-12 transition-colors duration-500">
          {/* Room Environment Layer */}
          <div className={`absolute inset-0 ${roomBackgrounds[selectedRoom]}`} />
          
          {/* Subtle Flooring Grid & Ambient Drop Light */}
          <div className="absolute inset-0 bg-radial-at-t from-white/10 via-transparent to-black/80 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          
          {/* Furniture Perspective Reference Layer */}
          <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none opacity-40">
            <div className="w-80 h-10 border-t-2 border-[#555555] bg-gradient-to-b from-[#282828] to-[#181818] flex items-center justify-center text-[10px] uppercase font-mono tracking-widest text-[#888888]">
              MINIMALIST ATELIER CONSOLE TABLE (120 CM)
            </div>
          </div>

          {/* Wall Mounted Artwork Representation */}
          <div 
            className="relative z-10 transition-all duration-300 ease-out"
            style={{
              transform: `scale(${scaleSize})`,
            }}
          >
            <div className={`${frameStyles[selectedFrame]} transition-all duration-300`}>
              <img
                src={product.image}
                alt={product.title}
                className="max-h-[42vh] w-auto object-contain shadow-inner"
              />
            </div>
            
            {/* Dimension Tag */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#181818]/90 text-white text-[10px] font-mono px-2 py-0.5 border border-[#303030] whitespace-nowrap">
              {product.dimensions} • SCALE {Math.round(scaleSize * 100)}%
            </div>
          </div>
        </div>

        {/* Bottom Control Telemetry Console */}
        <div className="bg-[#141414] border-t border-[#303030] p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Frame Style Selectors (4 cols) */}
          <div className="md:col-span-5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#da291c] block">
              CUSTOM BESPOKE FRAMING
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
                  className={`p-2 border text-left transition-colors rounded-none cursor-pointer ${
                    selectedFrame === f.id
                      ? 'bg-[#da291c] border-[#da291c] text-white font-bold'
                      : 'bg-[#181818] border-[#303030] text-[#969696] hover:text-white'
                  }`}
                >
                  <span className="block text-[11px] truncate">{f.name}</span>
                  <span className="text-[10px] text-white/80 block">
                    {f.price === 0 ? 'Included' : `+₹${f.price}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scale & Atmosphere Selector (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8f8f8f] block">
              ROOM ATMOSPHERE & SCALE
            </span>
            <div className="flex items-center gap-2">
              {(['penthouse', 'modernist', 'atelier'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRoom(r)}
                  className={`px-2.5 py-1 text-[11px] uppercase font-bold border transition-colors rounded-none cursor-pointer ${
                    selectedRoom === r
                      ? 'bg-[#ffffff] border-[#ffffff] text-[#181818]'
                      : 'bg-[#181818] border-[#303030] text-[#8f8f8f] hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-[#666666] uppercase">Scale</span>
              <input
                type="range"
                min="0.75"
                max="1.3"
                step="0.05"
                value={scaleSize}
                onChange={(e) => setScaleSize(parseFloat(e.target.value))}
                className="w-full accent-[#da291c] cursor-pointer"
              />
            </div>
          </div>

          {/* Price & Immediate Reservation (4 cols) */}
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col justify-end items-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#303030]">
            <div className="text-right">
              <span className="text-[10px] text-[#666666] uppercase tracking-wider block">CONFIGURED PRICE</span>
              <span className="text-2xl font-bold text-white tracking-tight">
                ₹{currentTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => {
                onAddToCart(product, selectedFrame);
                onClose();
              }}
              className="btn-ferrari-primary w-full py-3.5 text-xs font-bold"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>RESERVE CONFIGURATION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
