'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PeacockArt } from './PeacockArt';
import {
  springStep,
  stiffness,
  featherAngle,
  pointerDrive,
  settled,
} from './poster-math';

interface PosterStageProps {
  onReplay?: () => void;
}

export function PosterStage({ onReplay }: PosterStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const peacockSvgRef = useRef<SVGSVGElement>(null);
  const sunCircleRef = useRef<SVGCircleElement>(null);
  const figureGroupRef = useRef<SVGGElement>(null);

  const echoCount = 7;
  const leftRefs = useRef<React.RefObject<SVGGElement | null>[]>([]);
  const rightRefs = useRef<React.RefObject<SVGGElement | null>[]>([]);

  if (leftRefs.current.length !== echoCount) {
    leftRefs.current = Array.from({ length: echoCount }, () => React.createRef());
    rightRefs.current = Array.from({ length: echoCount }, () => React.createRef());
  }

  // Animation state (angles, velocities, targets)
  const animState = useRef({
    swing: 0,
    swingVel: 0,
    spread: 1,
    spreadVel: 0,
    targetSwing: 0,
    targetSpread: 1,
    opened: false,
    isTouch: false,
    active: true,
  });

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);

    // Detect touch
    animState.current.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    let rafId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const state = animState.current;

      // Handle touch idle sway
      if (state.isTouch && !mq.matches) {
        state.targetSwing = Math.sin(now / 1000) * 8;
        state.targetSpread = 1 + Math.sin(now / 1500) * 0.1;
      }

      // Step physics
      const [nextSwing, nextSwingVel] = springStep(
        state.swing,
        state.swingVel,
        state.targetSwing,
        140,
        0.72,
        dt
      );
      state.swing = nextSwing;
      state.swingVel = nextSwingVel;

      const [nextSpread, nextSpreadVel] = springStep(
        state.spread,
        state.spreadVel,
        state.targetSpread,
        120,
        0.75,
        dt
      );
      state.spread = nextSpread;
      state.spreadVel = nextSpreadVel;

      // Update feather transforms via direct DOM refs
      const stepAngle = 14;
      for (let idx = 0; idx < echoCount; idx++) {
        const i = idx + 1;
        const leftEl = leftRefs.current[idx]?.current;
        const rightEl = rightRefs.current[idx]?.current;

        const leftDeg = featherAngle(
          i,
          -1,
          stepAngle,
          state.spread,
          state.swing * (1 - idx * 0.08),
          true
        );
        const rightDeg = featherAngle(
          i,
          1,
          stepAngle,
          state.spread,
          state.swing * (1 - idx * 0.08),
          true
        );

        if (leftEl) leftEl.style.transform = `rotate(${leftDeg}deg)`;
        if (rightEl) rightEl.style.transform = `rotate(${rightDeg}deg)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    if (!mq.matches) {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      mq.removeEventListener('change', handler);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || animState.current.isTouch) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    const drive = pointerDrive(nx, ny);
    animState.current.targetSwing = drive.swing;
    animState.current.targetSpread = drive.spread;
  };

  const handlePointerLeave = () => {
    if (reducedMotion || animState.current.isTouch) return;
    animState.current.targetSwing = 0;
    animState.current.targetSpread = 1;
  };

  const triggerReplay = () => {
    animState.current.swingVel = -45;
    animState.current.spreadVel = -0.5;
    onReplay?.();
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[420px] aspect-[400/380] mx-auto select-none"
    >
      <PeacockArt
        featherRefsLeft={leftRefs.current}
        featherRefsRight={rightRefs.current}
        sunRef={sunCircleRef}
        figureRef={figureGroupRef}
        onSunClick={triggerReplay}
        echoCount={echoCount}
      />
    </div>
  );
}
