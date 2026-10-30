import React, { useRef } from 'react';
import { MadhubaniProduct } from '../types';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { MithilaMotif } from './MithilaMotif';

interface CertificateModalProps {
  product: MadhubaniProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !product) return null;

  const serialNumber = `MTH-${product.style.toUpperCase()}-2026-${product.filename.replace(/\D/g, '').padStart(3, '0')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(16,11,4,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-10 no-scrollbar flex flex-col space-y-6 text-left"
        style={{
          background: 'var(--ivory)',
          border: '1px solid var(--hairline)',
          borderRadius: '4px',
        }}
      >
        <MithilaMotif type="four-corners" color="var(--vermilion)" />
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--hairline-soft)' }}>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} style={{ color: 'var(--vermilion)' }} />
            <span className="text-eyebrow" style={{ color: 'var(--ink)', fontSize: '0.65rem' }}>
              OFFICIAL ATELIER CERTIFICATE OF PROVENANCE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-outline btn-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={13} />
              <span>PRINT / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="btn btn-icon"
              style={{ width: '2rem', height: '2rem' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* The Printable Archival Certificate Sheet */}
        <div 
          ref={certificateRef}
          className="bg-[#ffffff] text-[#1a1209] p-8 sm:p-12 border-8 double relative overflow-hidden space-y-8 print:p-0 print:border-none"
          style={{ borderColor: 'var(--ink)' }}
        >
          {/* Subtle Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="font-display font-bold text-9xl tracking-widest uppercase">MITHILA</span>
          </div>

          {/* Corner Registration Crosshairs */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[var(--vermilion)]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[var(--vermilion)]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[var(--vermilion)]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[var(--vermilion)]" />

          {/* Certificate Header */}
          <div className="text-center space-y-2 border-b-2 pb-6" style={{ borderColor: 'var(--ink)' }}>
            <span className="text-[10px] font-bold tracking-[2.5px] uppercase block" style={{ color: 'var(--vermilion)' }}>
              KING JANAKA DYNASTIC ARCHIVE • THE ART OF MITHILA
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight uppercase" style={{ color: 'var(--ink)' }}>
              CERTIFICATE OF AUTHENTICITY &amp; PROVENANCE
            </h2>
            <p className="text-xs uppercase tracking-wider font-mono" style={{ color: 'var(--ink-muted)' }}>
              REGISTRY ARCHIVE SERIAL: {serialNumber}
            </p>
          </div>

          {/* Core Telemetry Specification Sheet */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-4 border p-2 bg-[#fdfdfc]" style={{ borderColor: 'var(--hairline-soft)' }}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover border"
                style={{ borderColor: 'var(--hairline-soft)' }}
              />
            </div>

            <div className="sm:col-span-8 space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--ink-muted)' }}>Masterwork Title</span>
                <span className="font-display text-lg font-bold" style={{ color: 'var(--ink)' }}>{product.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t" style={{ borderColor: 'var(--hairline-soft)' }}>
                <div>
                  <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--ink-muted)' }}>Discipline</span>
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>{product.style} Technique</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--ink-muted)' }}>Dimensions</span>
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>{product.dimensions}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--ink-muted)' }}>Medium</span>
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>{product.medium}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--ink-muted)' }}>Origin Studio</span>
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>Jitwarpur Village, Bihar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Declarations & Signatures */}
          <div className="border-t-2 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs" style={{ borderColor: 'var(--ink)' }}>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--ink-muted)' }}>Artisan Master Lineage</span>
              <div className="font-serif italic font-bold text-sm pt-2" style={{ color: 'var(--ink)' }}>
                Mahasundari Devi Guild
              </div>
              <span className="text-[9px] uppercase block" style={{ color: 'var(--ink-dim)' }}>Lead Master Painter</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--ink-muted)' }}>Atelier Registrar Seal</span>
              <div
                className="w-12 h-12 mx-auto border-2 rounded-full flex items-center justify-center font-bold text-[9px] uppercase tracking-tighter"
                style={{ borderColor: 'var(--vermilion)', color: 'var(--vermilion)' }}
              >
                ORIGINAL
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--ink-muted)' }}>Provenance Verification</span>
              <div className="font-mono text-xs font-bold pt-2" style={{ color: 'var(--ink)' }}>
                AUTHENTICATED
              </div>
              <span className="text-[9px] uppercase font-bold block" style={{ color: 'var(--leaf)' }}>100% Organic Pigments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
