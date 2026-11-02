import React from 'react';
import { siteConfig } from '@/config/site';

/** Registration cross mark (+) */
export function RegistrationMark({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`inline-flex items-center justify-center font-mono text-ink-muted text-xs select-none opacity-60 ${className}`}
    >
      +
    </div>
  );
}

/** Madhubani Wave Scallop line (water motif floor border) */
export function WaveLine({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`w-full overflow-hidden select-none leading-none ${className}`}>
      <svg
        className="w-full h-3.5 text-line fill-none stroke-current"
        viewBox="0 0 1200 14"
        preserveAspectRatio="none"
      >
        <path
          d="M 0,7 Q 15,0 30,7 T 60,7 T 90,7 T 120,7 T 150,7 T 180,7 T 210,7 T 240,7 T 270,7 T 300,7 T 330,7 T 360,7 T 390,7 T 420,7 T 450,7 T 480,7 T 510,7 T 540,7 T 570,7 T 600,7 T 630,7 T 660,7 T 690,7 T 720,7 T 750,7 T 780,7 T 810,7 T 840,7 T 870,7 T 900,7 T 930,7 T 960,7 T 990,7 T 1020,7 T 1050,7 T 1080,7 T 1110,7 T 1140,7 T 1170,7 T 1200,7"
          strokeWidth="1.5"
        />
        <path
          d="M 0,11 Q 15,4 30,11 T 60,11 T 90,11 T 120,11 T 150,11 T 180,11 T 210,11 T 240,11 T 270,11 T 300,11 T 330,11 T 360,11 T 390,11 T 420,11 T 450,11 T 480,11 T 510,11 T 540,11 T 570,11 T 600,11 T 630,11 T 660,11 T 690,11 T 720,11 T 750,11 T 780,11 T 810,11 T 840,11 T 870,11 T 900,11 T 930,11 T 960,11 T 990,11 T 1020,11 T 1050,11 T 1080,11 T 1110,11 T 1140,11 T 1170,11 T 1200,11"
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

/** Circular exhibition seal */
export function Seal({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center rounded-full border border-line p-1 bg-paper select-none ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
        <path
          id="seal-text-path"
          d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          fill="none"
        />
        <text className="font-mono text-[9.5px] uppercase tracking-[0.26em] fill-ink font-semibold">
          <textPath href="#seal-text-path" startOffset="0%">
            VERNIKA ENTERPRISES · MADHUBANI ·
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display text-accent text-2xl font-bold leading-none">
        V
      </div>
    </div>
  );
}

/** Tactile barcode ornament referencing WhatsApp digits */
export function Barcode({ width = 120, height = 48, className = '' }: { width?: number; height?: number; className?: string }) {
  const phone = siteConfig.contact.phone.replace(/\D/g, '') || '917870909889';

  return (
    <div
      aria-hidden="true"
      style={{ width }}
      className={`inline-flex flex-col items-center select-none ${className}`}
    >
      <svg viewBox="0 0 120 32" className="w-full h-8 text-ink fill-current">
        {/* Generates consistent barcode stripe pattern */}
        <rect x="2" y="0" width="3" height="30" />
        <rect x="8" y="0" width="1.5" height="30" />
        <rect x="13" y="0" width="4" height="30" />
        <rect x="20" y="0" width="1.5" height="30" />
        <rect x="24" y="0" width="2" height="30" />
        <rect x="29" y="0" width="3.5" height="30" />
        <rect x="36" y="0" width="1" height="30" />
        <rect x="40" y="0" width="4" height="30" />
        <rect x="47" y="0" width="2" height="30" />
        <rect x="52" y="0" width="1.5" height="30" />
        <rect x="57" y="0" width="3" height="30" />
        <rect x="63" y="0" width="2" height="30" />
        <rect x="68" y="0" width="4" height="30" />
        <rect x="75" y="0" width="1.5" height="30" />
        <rect x="80" y="0" width="3" height="30" />
        <rect x="86" y="0" width="1" height="30" />
        <rect x="90" y="0" width="4" height="30" />
        <rect x="97" y="0" width="2" height="30" />
        <rect x="102" y="0" width="1.5" height="30" />
        <rect x="107" y="0" width="3" height="30" />
        <rect x="113" y="0" width="2" height="30" />
      </svg>
      <div className="flex items-center justify-between w-full font-mono text-[9px] tracking-widest text-ink-muted mt-0.5">
        <span>WHATSAPP</span>
        <span>+{phone.slice(0, 2)} {phone.slice(2, 7)}</span>
      </div>
    </div>
  );
}
