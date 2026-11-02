import React from 'react';

/**
 * MithilaMotif — Madhubani / Mithila-inspired SVG decorative system
 *
 * Motifs are rooted in authentic Mithila visual vocabulary:
 * fish (matsya), lotus, peacock eye, vine leaf, folk geometry
 *
 * Usage:
 *   <MithilaMotif type="divider" />
 *   <MithilaMotif type="lotus-divider" color="var(--accent)" />
 *   <MithilaMotif type="fish-pair" width={80} />
 */

interface MotifProps {
  type:
    | 'divider'
    | 'lotus-divider'
    | 'fish-pair'
    | 'corner-tl'
    | 'corner-br'
    | 'four-corners'
    | 'peacock-eye'
    | 'vine-row'
    | 'diamond-chain';
  color?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const MithilaMotif: React.FC<MotifProps> = ({
  type,
  color = 'currentColor',
  width,
  height,
  className = '',
}) => {
  switch (type) {

    /* ─── Divider: double line with central diamond ─────────────── */
    case 'divider':
      return (
        <svg
          viewBox="0 0 400 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={width ?? '100%'}
          height={height ?? 16}
          className={className}
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <line x1="0" y1="4" x2="176" y2="4" stroke={color} strokeWidth="0.75" strokeOpacity="0.5" />
          <line x1="0" y1="12" x2="176" y2="12" stroke={color} strokeWidth="0.75" strokeOpacity="0.25" />
          <polygon points="200,2 210,8 200,14 190,8" fill={color} fillOpacity="0.7" />
          <line x1="224" y1="4" x2="400" y2="4" stroke={color} strokeWidth="0.75" strokeOpacity="0.5" />
          <line x1="224" y1="12" x2="400" y2="12" stroke={color} strokeWidth="0.75" strokeOpacity="0.25" />
        </svg>
      );

    /* ─── Lotus divider ──────────────────────────────────────────── */
    case 'lotus-divider':
      return (
        <svg
          viewBox="0 0 320 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={width ?? 320}
          height={height ?? 28}
          className={className}
          aria-hidden="true"
        >
          {/* Center lotus */}
          <path d="M160 24 C160 24 148 16 148 10 C148 6 152 4 156 6 C158 7 159 9 160 11 C161 9 162 7 164 6 C168 4 172 6 172 10 C172 16 160 24 160 24Z" fill={color} fillOpacity="0.6" />
          <path d="M160 22 L160 8" stroke={color} strokeWidth="0.75" strokeOpacity="0.4" />
          {/* Left lotus small */}
          <path d="M120 22 C120 22 112 17 112 13 C112 10 114.5 9 117 10.5 C118 11.2 119 12.8 120 14 C121 12.8 122 11.2 123 10.5 C125.5 9 128 10 128 13 C128 17 120 22 120 22Z" fill={color} fillOpacity="0.4" />
          {/* Right lotus small */}
          <path d="M200 22 C200 22 192 17 192 13 C192 10 194.5 9 197 10.5 C198 11.2 199 12.8 200 14 C201 12.8 202 11.2 203 10.5 C205.5 9 208 10 208 13 C208 17 200 22 200 22Z" fill={color} fillOpacity="0.4" />
          {/* Lines */}
          <line x1="0" y1="22" x2="104" y2="22" stroke={color} strokeWidth="0.75" strokeOpacity="0.35" />
          <line x1="136" y1="22" x2="184" y2="22" stroke={color} strokeWidth="0.75" strokeOpacity="0.35" />
          <line x1="216" y1="22" x2="320" y2="22" stroke={color} strokeWidth="0.75" strokeOpacity="0.35" />
          {/* Small dots */}
          <circle cx="108" cy="22" r="1.5" fill={color} fillOpacity="0.5" />
          <circle cx="212" cy="22" r="1.5" fill={color} fillOpacity="0.5" />
        </svg>
      );

    /* ─── Fish pair (matsya — auspicious symbol) ─────────────────── */
    case 'fish-pair':
      return (
        <svg
          viewBox="0 0 80 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={width ?? 80}
          height={height ?? 32}
          className={className}
          aria-hidden="true"
        >
          {/* Fish 1 — swimming right */}
          <path d="M8 8 C14 4 26 6 28 12 C30 18 18 22 12 20 C6 18 2 12 8 8Z" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.7" />
          <path d="M4 10 C2 8 0 12 2 14 C4 16 6 14 4 10Z" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" />
          <circle cx="26" cy="10" r="1.2" fill={color} fillOpacity="0.7" />
          <path d="M14 9 C16 8 18 9 18 11" stroke={color} strokeWidth="0.7" strokeOpacity="0.5" />
          <path d="M14 13 C16 13 18 13 18 15" stroke={color} strokeWidth="0.7" strokeOpacity="0.5" />
          {/* Fish 2 — swimming left (mirrored) */}
          <path d="M72 8 C66 4 54 6 52 12 C50 18 62 22 68 20 C74 18 78 12 72 8Z" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.7" />
          <path d="M76 10 C78 8 80 12 78 14 C76 16 74 14 76 10Z" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" />
          <circle cx="54" cy="10" r="1.2" fill={color} fillOpacity="0.7" />
          <path d="M66 9 C64 8 62 9 62 11" stroke={color} strokeWidth="0.7" strokeOpacity="0.5" />
          <path d="M66 13 C64 13 62 13 62 15" stroke={color} strokeWidth="0.7" strokeOpacity="0.5" />
          {/* Lotus between them */}
          <path d="M40 22 C40 22 35 17 35 14 C35 11 37 10 39 11.5 C39.7 12 40 13 40 14 C40 13 40.3 12 41 11.5 C43 10 45 11 45 14 C45 17 40 22 40 22Z" fill={color} fillOpacity="0.6" />
          <path d="M40 22 L40 12" stroke={color} strokeWidth="0.75" strokeOpacity="0.4" />
        </svg>
      );

    /* ─── Corner ornament (top-left) ─────────────────────────────── */
    case 'corner-tl':
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={width ?? 48}
          height={height ?? 48}
          className={className}
          aria-hidden="true"
        >
          {/* Outer L */}
          <path d="M2 2 L2 46" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
          <path d="M2 2 L46 2" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
          {/* Inner L */}
          <path d="M8 8 L8 30" stroke={color} strokeWidth="0.6" strokeOpacity="0.35" />
          <path d="M8 8 L30 8" stroke={color} strokeWidth="0.6" strokeOpacity="0.35" />
          {/* Corner vine motif */}
          <path d="M2 2 C2 2 12 4 14 12 C16 20 8 28 8 28" stroke={color} strokeWidth="0.75" strokeOpacity="0.4" fill="none" />
          {/* Small leaf accents */}
          <ellipse cx="12" cy="10" rx="3" ry="5" stroke={color} strokeWidth="0.7" fill="none" strokeOpacity="0.4" transform="rotate(30 12 10)" />
          <ellipse cx="7" cy="20" rx="2.5" ry="4" stroke={color} strokeWidth="0.7" fill="none" strokeOpacity="0.35" transform="rotate(-15 7 20)" />
          {/* Diamond accent */}
          <polygon points="2,2 5,8 2,14 -1,8" fill={color} fillOpacity="0" />
          <circle cx="2" cy="2" r="2" fill={color} fillOpacity="0.7" />
        </svg>
      );

    /* ─── Corner ornament (bottom-right) ─────────────────────────── */
    case 'corner-br':
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={width ?? 48}
          height={height ?? 48}
          className={className}
          aria-hidden="true"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path d="M2 2 L2 46" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
          <path d="M2 2 L46 2" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
          <path d="M8 8 L8 30" stroke={color} strokeWidth="0.6" strokeOpacity="0.35" />
          <path d="M8 8 L30 8" stroke={color} strokeWidth="0.6" strokeOpacity="0.35" />
          <path d="M2 2 C2 2 12 4 14 12 C16 20 8 28 8 28" stroke={color} strokeWidth="0.75" strokeOpacity="0.4" fill="none" />
          <ellipse cx="12" cy="10" rx="3" ry="5" stroke={color} strokeWidth="0.7" fill="none" strokeOpacity="0.4" transform="rotate(30 12 10)" />
          <circle cx="2" cy="2" r="2" fill={color} fillOpacity="0.7" />
        </svg>
      );

    /* ─── Four-corners frame ──────────────────────────────────────── */
    case 'four-corners':
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={width ?? '100%'}
          height={height ?? '100%'}
          className={`absolute inset-0 pointer-events-none ${className}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* TL */}
          <path d="M0 0 L0 18 M0 0 L18 0" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M4 4 L4 14 M4 4 L14 4" stroke={color} strokeWidth="0.75" strokeOpacity="0.35" />
          <circle cx="0" cy="0" r="2.5" fill={color} fillOpacity="0.8" />
          {/* TR */}
          <path d="M100 0 L100 18 M100 0 L82 0" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M96 4 L96 14 M96 4 L86 4" stroke={color} strokeWidth="0.75" strokeOpacity="0.35" />
          <circle cx="100" cy="0" r="2.5" fill={color} fillOpacity="0.8" />
          {/* BL */}
          <path d="M0 100 L0 82 M0 100 L18 100" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M4 96 L4 86 M4 96 L14 96" stroke={color} strokeWidth="0.75" strokeOpacity="0.35" />
          <circle cx="0" cy="100" r="2.5" fill={color} fillOpacity="0.8" />
          {/* BR */}
          <path d="M100 100 L100 82 M100 100 L82 100" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M96 96 L96 86 M96 96 L86 96" stroke={color} strokeWidth="0.75" strokeOpacity="0.35" />
          <circle cx="100" cy="100" r="2.5" fill={color} fillOpacity="0.8" />
        </svg>
      );

    /* ─── Peacock eye motif ───────────────────────────────────────── */
    case 'peacock-eye':
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={width ?? 36}
          height={height ?? 36}
          className={className}
          aria-hidden="true"
        >
          {/* Outer ellipse */}
          <ellipse cx="18" cy="18" rx="16" ry="16" stroke={color} strokeWidth="1" strokeOpacity="0.5" fill="none" />
          {/* Middle */}
          <ellipse cx="18" cy="18" rx="10" ry="10" stroke={color} strokeWidth="0.75" strokeOpacity="0.4" fill="none" />
          {/* Iris */}
          <circle cx="18" cy="18" r="5" fill={color} fillOpacity="0.6" />
          <circle cx="18" cy="18" r="2" fill={color} fillOpacity="0.9" />
          {/* Rays */}
          {[0,45,90,135,180,225,270,315].map((deg, i) => (
            <line
              key={i}
              x1="18"
              y1="18"
              x2={18 + 14 * Math.cos((deg * Math.PI) / 180)}
              y2={18 + 14 * Math.sin((deg * Math.PI) / 180)}
              stroke={color}
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          ))}
        </svg>
      );

    /* ─── Vine row ────────────────────────────────────────────────── */
    case 'vine-row':
      return (
        <svg
          viewBox="0 0 280 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={width ?? '100%'}
          height={height ?? 24}
          className={className}
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path
            d="M0 12 C20 4 30 20 50 12 C70 4 80 20 100 12 C120 4 130 20 150 12 C170 4 180 20 200 12 C220 4 230 20 250 12 C270 4 280 20 280 12"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.4"
            fill="none"
          />
          {/* Leaf buds */}
          {[50, 100, 150, 200, 250].map((x, i) => (
            <ellipse
              key={i}
              cx={x}
              cy={12}
              rx={4}
              ry={7}
              stroke={color}
              strokeWidth="0.75"
              fill="none"
              strokeOpacity="0.4"
              transform={`rotate(${i % 2 === 0 ? 25 : -25} ${x} 12)`}
            />
          ))}
        </svg>
      );

    /* ─── Diamond chain ───────────────────────────────────────────── */
    case 'diamond-chain':
      return (
        <svg
          viewBox="0 0 240 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={width ?? '100%'}
          height={height ?? 10}
          className={className}
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <line x1="0" y1="5" x2="240" y2="5" stroke={color} strokeWidth="0.5" strokeOpacity="0.25" />
          {[20, 60, 100, 140, 180, 220].map((x, i) => (
            <polygon
              key={i}
              points={`${x},2 ${x + 6},5 ${x},8 ${x - 6},5`}
              fill={color}
              fillOpacity={i === 3 ? 0.7 : 0.3}
            />
          ))}
        </svg>
      );

    default:
      return null;
  }
};

/**
 * SectionEyebrow — standardized eyebrow + headline block
 */
interface EyebrowProps {
  eyebrow: string;
  headline: React.ReactNode;
  subhead?: React.ReactNode;
  align?: 'left' | 'center';
  light?: boolean; // on dark background
}
export const SectionEyebrow: React.FC<EyebrowProps> = ({
  eyebrow,
  headline,
  subhead,
  align = 'left',
  light = false,
}) => (
  <div className={`space-y-3 ${align === 'center' ? 'text-center' : ''}`}>
    <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
      <span className="w-6 h-px" style={{ background: light ? 'rgba(250,246,239,0.5)' : 'var(--vermilion)' }} />
      <span className={`text-eyebrow ${light ? 'text-ivory/60' : 'text-vermilion'}`}>{eyebrow}</span>
      {align === 'center' && (
        <span className="w-6 h-px" style={{ background: light ? 'rgba(250,246,239,0.5)' : 'var(--vermilion)' }} />
      )}
    </div>
    <h2 className={`text-headline ${light ? 'text-ivory' : 'text-ink'}`}>{headline}</h2>
    {subhead && (
      <p className={`text-body-lg max-w-xl ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-ivory/70' : 'text-ink-muted'}`}>
        {subhead}
      </p>
    )}
  </div>
);
