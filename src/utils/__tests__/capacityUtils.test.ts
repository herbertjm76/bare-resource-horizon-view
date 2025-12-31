import { describe, it, expect } from 'vitest';
import { getMemberCapacity, calculateUtilization, calculateAvailableHours } from '../capacityUtils';

describe('capacityUtils', () => {
  describe('getMemberCapacity', () => {
    it('returns member capacity when provided', () => {
      expect(getMemberCapacity(35, 40)).toBe(35);
    });

    it('returns company workWeekHours when member capacity is null', () => {
      expect(getMemberCapacity(null, 40)).toBe(40);
    });

    it('returns company workWeekHours when member capacity is undefined', () => {
      expect(getMemberCapacity(undefined, 40)).toBe(40);
    });

    it('returns 0 when member capacity is 0 (not fallback)', () => {
      expect(getMemberCapacity(0, 40)).toBe(0);
    });

    it('handles non-standard work weeks', () => {
      expect(getMemberCapacity(null, 32)).toBe(32);
      expect(getMemberCapacity(null, 45)).toBe(45);
    });
  });

  describe('calculateUtilization', () => {
    it('calculates correct utilization percentage', () => {
      expect(calculateUtilization(20, 40)).toBe(50);
    });

    it('returns 100 for full utilization', () => {
      expect(calculateUtilization(40, 40)).toBe(100);
    });

    it('returns 0 for no allocation', () => {
      expect(calculateUtilization(0, 40)).toBe(0);
    });

    it('handles over-allocation (>100%)', () => {
      expect(calculateUtilization(50, 40)).toBe(125);
    });

    it('returns 0 when capacity is 0', () => {
      expect(calculateUtilization(20, 0)).toBe(0);
    });

    it('returns 0 when capacity is negative', () => {
      expect(calculateUtilization(20, -10)).toBe(0);
    });

    it('rounds to nearest integer', () => {
      expect(calculateUtilization(33, 40)).toBe(83); // 82.5 rounds to 83
      expect(calculateUtilization(17, 40)).toBe(43); // 42.5 rounds to 43
    });
  });

  describe('calculateAvailableHours', () => {
    it('calculates available hours correctly', () => {
      expect(calculateAvailableHours(40, 30)).toBe(10);
    });

    it('returns 0 when fully allocated', () => {
      expect(calculateAvailableHours(40, 40)).toBe(0);
    });

    it('returns full capacity when nothing allocated', () => {
      expect(calculateAvailableHours(40, 0)).toBe(40);
    });

    it('returns 0 when over-allocated (not negative)', () => {
      expect(calculateAvailableHours(40, 50)).toBe(0);
    });

    it('handles decimal values', () => {
      expect(calculateAvailableHours(40, 35.5)).toBe(4.5);
    });
  });
});
