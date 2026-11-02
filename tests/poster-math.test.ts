import { describe, it, expect } from 'vitest';
import {
  clamp,
  springStep,
  stiffness,
  fanAngle,
  featherAngle,
  echoScale,
  pointerDrive,
  settled,
} from '../src/components/layout/PosterFooter/poster-math';

describe('PosterFooter Kinematics Math', () => {
  it('clamp restricts values to [lo, hi]', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('springStep converges toward target', () => {
    let [x, v] = [0, 0];
    const target = 10;
    const k = 100;
    const zeta = 0.72;
    const dt = 1 / 60;

    for (let frame = 0; frame < 120; frame++) {
      [x, v] = springStep(x, v, target, k, zeta, dt);
    }

    expect(Math.abs(x - target)).toBeLessThan(0.05);
    expect(settled(x, v, target)).toBe(true);
  });

  it('stiffness decreases for outer echo feathers', () => {
    expect(stiffness(0)).toBe(200);
    expect(stiffness(1)).toBe(200 / 1.5);
    expect(stiffness(4)).toBe(200 / 3);
    expect(stiffness(4)).toBeLessThan(stiffness(1));
  });

  it('fanAngle returns 0 when closed and scales with spread', () => {
    expect(fanAngle(2, 10, 1, false)).toBe(0);
    expect(fanAngle(0, 10, 1, true)).toBe(0);
    expect(fanAngle(2, 10, 1, true)).toBe(20);
    expect(fanAngle(2, 10, 1.2, true)).toBeCloseTo(24);
  });

  it('featherAngle clamps within [-165, 165]', () => {
    expect(featherAngle(0, 1, 10, 1, 0, true)).toBe(0);
    expect(featherAngle(3, 1, 15, 1, 5, true)).toBe(50);
    expect(featherAngle(10, 1, 30, 1, 50, true)).toBe(165);
    expect(featherAngle(10, -1, 30, 1, -50, true)).toBe(-165);
  });

  it('echoScale increases smoothly with opened progress', () => {
    expect(echoScale(0, 1)).toBe(1);
    expect(echoScale(3, 0)).toBe(1);
    expect(echoScale(3, 1)).toBeCloseTo(1 + 3 * 0.06);
  });

  it('pointerDrive computes bounded swing and spread', () => {
    const center = pointerDrive(0.5, 0.5);
    expect(center.swing).toBe(0);
    expect(center.spread).toBe(1);

    const left = pointerDrive(0, 0.5);
    expect(left.swing).toBe(-18);

    const right = pointerDrive(1, 0.5);
    expect(right.swing).toBe(18);
  });
});
