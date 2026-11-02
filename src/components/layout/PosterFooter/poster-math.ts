/**
 * Pure physics & kinematics math for the screen-printed peacock echo wheel.
 * Decoupled from React for zero-overhead animation and deterministic unit testing.
 */

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function springStep(
  x: number,
  v: number,
  target: number,
  k: number,
  zeta: number,
  dt: number
): [number, number] {
  const c = 2 * zeta * Math.sqrt(k);
  const a = k * (target - x) - c * v;
  const vNext = v + a * dt;
  const xNext = x + vNext * dt;
  return [xNext, vNext];
}

export function stiffness(i: number): number {
  return 200 / (1 + 0.5 * i);
}

export function fanAngle(i: number, step: number, spread: number, open: boolean): number {
  return open && i > 0 ? i * step * spread : 0;
}

export function featherAngle(
  i: number,
  dir: number,
  step: number,
  spread: number,
  swing: number,
  open: boolean
): number {
  if (i === 0) return 0;
  const base = dir * fanAngle(i, step, spread, open);
  return clamp(base + swing, -165, 165);
}

export function echoScale(i: number, opened: number): number {
  return 1 + i * 0.06 * clamp(opened, 0, 1);
}

export function pointerDrive(
  nx: number,
  ny: number
): { swing: number; spread: number } {
  return {
    swing: clamp((nx - 0.5) * 2, -1, 1) * 18,
    spread: clamp(1 + (0.5 - ny) * 0.5, 0.74, 1.24),
  };
}

export function settled(
  x: number,
  v: number,
  target: number,
  eps: number = 0.02
): boolean {
  return Math.abs(x - target) < eps && Math.abs(v) < eps * 6;
}
