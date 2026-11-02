import React, { forwardRef } from 'react';

export interface PeacockArtProps {
  featherRefsLeft?: React.RefObject<SVGGElement | null>[];
  featherRefsRight?: React.RefObject<SVGGElement | null>[];
  sunRef?: React.RefObject<SVGCircleElement | null>;
  figureRef?: React.RefObject<SVGGElement | null>;
  onSunClick?: () => void;
  echoCount?: number;
}

/**
 * Clean vector Madhubani Peacock (Mayura).
 * Front-facing folk geometry, double outlines, hatched body plumage,
 * and N fanned tail feathers pivoted at the tail base.
 */
export const PeacockArt = forwardRef<SVGSVGElement, PeacockArtProps>(
  (
    {
      featherRefsLeft = [],
      featherRefsRight = [],
      sunRef,
      figureRef,
      onSunClick,
      echoCount = 7,
    },
    ref
  ) => {
    // Pivot coordinates for tail base
    const pivotX = 200;
    const pivotY = 280;

    return (
      <svg
        ref={ref}
        viewBox="0 0 400 380"
        className="w-full h-full select-none overflow-visible"
        role="region"
        aria-label="Interactive Madhubani Peacock Stage"
      >
        {/* ── 1. The Surya Sun Disc (Clickable replay trigger) ── */}
        <g
          onClick={onSunClick}
          className="cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          role="button"
          tabIndex={0}
          aria-label="Replay entrance animation"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSunClick?.();
            }
          }}
        >
          {/* Surya Sun Rays Disc */}
          <circle
            ref={sunRef as any}
            cx="200"
            cy="150"
            r="120"
            fill="var(--accent)"
            className="transition-opacity duration-300 opacity-95"
          />
          {/* Sun Ray Teeth */}
          <circle
            cx="200"
            cy="150"
            r="126"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
        </g>

        {/* ── 2. Tail Feather Echo Wings ── */}
        {/* Left Feathers (echoes 1 to N) */}
        {Array.from({ length: echoCount }).map((_, idx) => {
          const i = idx + 1;
          const refEl = featherRefsLeft[idx];
          return (
            <g
              key={`feather-left-${i}`}
              ref={refEl as any}
              style={{ transformOrigin: `${pivotX}px ${pivotY}px` }}
              className="will-change-transform"
            >
              {/* Slender Madhubani Feather Blade */}
              <path
                d={`M ${pivotX} ${pivotY} Q ${pivotX - 50 - i * 14} ${pivotY - 90} ${pivotX - 90 - i * 16} ${pivotY - 180} Q ${pivotX - 60 - i * 10} ${pivotY - 140} ${pivotX} ${pivotY}`}
                fill="var(--paper)"
                stroke="var(--ink)"
                strokeWidth="1.8"
              />
              {/* Fine Hatching & Eye */}
              <circle
                cx={pivotX - 90 - i * 16}
                cy={pivotY - 180}
                r="7"
                fill="var(--accent)"
                stroke="var(--ink)"
                strokeWidth="1.5"
              />
              <circle
                cx={pivotX - 90 - i * 16}
                cy={pivotY - 180}
                r="3"
                fill="var(--turmeric)"
              />
            </g>
          );
        })}

        {/* Right Feathers (echoes 1 to N) */}
        {Array.from({ length: echoCount }).map((_, idx) => {
          const i = idx + 1;
          const refEl = featherRefsRight[idx];
          return (
            <g
              key={`feather-right-${i}`}
              ref={refEl as any}
              style={{ transformOrigin: `${pivotX}px ${pivotY}px` }}
              className="will-change-transform"
            >
              <path
                d={`M ${pivotX} ${pivotY} Q ${pivotX + 50 + i * 14} ${pivotY - 90} ${pivotX + 90 + i * 16} ${pivotY - 180} Q ${pivotX + 60 + i * 10} ${pivotY - 140} ${pivotX} ${pivotY}`}
                fill="var(--paper)"
                stroke="var(--ink)"
                strokeWidth="1.8"
              />
              <circle
                cx={pivotX + 90 + i * 16}
                cy={pivotY - 180}
                r="7"
                fill="var(--accent)"
                stroke="var(--ink)"
                strokeWidth="1.5"
              />
              <circle
                cx={pivotX + 90 + i * 16}
                cy={pivotY - 180}
                r="3"
                fill="var(--turmeric)"
              />
            </g>
          );
        })}

        {/* Central Anchor Feather (Fixed, Index 0) */}
        <g>
          <path
            d={`M ${pivotX} ${pivotY} Q ${pivotX - 25} 120 ${pivotX} 60 Q ${pivotX + 25} 120 ${pivotX} ${pivotY}`}
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <circle cx={pivotX} cy="65" r="9" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx={pivotX} cy="65" r="4" fill="var(--turmeric)" />
        </g>

        {/* ── 3. Peacock Body & Crown Figure ── */}
        <g ref={figureRef as any}>
          {/* S-curve Neck and Torso */}
          <path
            d={`M 186 280 Q 180 230 188 190 Q 192 165 200 155 Q 208 165 212 190 Q 220 230 214 280 Z`}
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth="2.5"
          />

          {/* Body Hatching (Kachni fine line work) */}
          <path d="M 186 215 Q 200 220 214 215" stroke="var(--ink)" strokeWidth="1.2" fill="none" />
          <path d="M 185 230 Q 200 236 215 230" stroke="var(--ink)" strokeWidth="1.2" fill="none" />
          <path d="M 184 245 Q 200 252 216 245" stroke="var(--ink)" strokeWidth="1.2" fill="none" />
          <path d="M 185 260 Q 200 268 215 260" stroke="var(--ink)" strokeWidth="1.2" fill="none" />

          {/* Scalloped Breast Plumage */}
          <path d="M 194 175 Q 200 180 206 175" stroke="var(--ink)" strokeWidth="1.2" fill="none" />
          <path d="M 191 185 Q 200 192 209 185" stroke="var(--ink)" strokeWidth="1.2" fill="none" />

          {/* Head & Crown */}
          <circle cx="200" cy="142" r="14" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
          {/* Eye (Almond shape) */}
          <path d="M 194 142 Q 200 137 206 142 Q 200 147 194 142 Z" fill="var(--ink)" />
          <circle cx="200" cy="142" r="1.5" fill="var(--paper)" />

          {/* Sharp Beak */}
          <path d="M 198 147 L 200 158 L 202 147 Z" fill="var(--ink)" />

          {/* Royal Crest Feathers (Kalgi) */}
          <line x1="200" y1="128" x2="200" y2="108" stroke="var(--ink)" strokeWidth="1.8" />
          <circle cx="200" cy="106" r="3.5" fill="var(--turmeric)" stroke="var(--ink)" strokeWidth="1" />

          <line x1="196" y1="129" x2="188" y2="112" stroke="var(--ink)" strokeWidth="1.8" />
          <circle cx="187" cy="110" r="3.5" fill="var(--turmeric)" stroke="var(--ink)" strokeWidth="1" />

          <line x1="204" y1="129" x2="212" y2="112" stroke="var(--ink)" strokeWidth="1.8" />
          <circle cx="213" cy="110" r="3.5" fill="var(--turmeric)" stroke="var(--ink)" strokeWidth="1" />

          {/* Stylized Claws on Ground */}
          <line x1="192" y1="280" x2="188" y2="295" stroke="var(--ink)" strokeWidth="2" />
          <line x1="208" y1="280" x2="212" y2="295" stroke="var(--ink)" strokeWidth="2" />
        </g>
      </svg>
    );
  }
);

PeacockArt.displayName = 'PeacockArt';
