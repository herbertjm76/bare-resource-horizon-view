import { describe, it, expect } from 'vitest';
import {
  formatAllocation,
  formatUtilization,
  getAllocationLabel,
  getAllocationPlaceholder,
  convertToHours,
  convertFromHours
} from '../displayFormatters';

describe('displayFormatters', () => {
  describe('formatAllocation', () => {
    it('formats as hours when preference is hours', () => {
      expect(formatAllocation(20, 40, 'hours')).toBe('20h');
    });

    it('formats as percentage when preference is percentage', () => {
      expect(formatAllocation(20, 40, 'percentage')).toBe('50%');
    });

    it('handles full allocation as percentage', () => {
      expect(formatAllocation(40, 40, 'percentage')).toBe('100%');
    });

    it('handles 0 hours', () => {
      expect(formatAllocation(0, 40, 'hours')).toBe('0h');
      expect(formatAllocation(0, 40, 'percentage')).toBe('0%');
    });

    it('rounds percentages', () => {
      expect(formatAllocation(33, 40, 'percentage')).toBe('83%'); // 82.5 rounds to 83
    });
  });

  describe('formatUtilization', () => {
    it('always formats as percentage regardless of preference', () => {
      expect(formatUtilization(75, 'hours')).toBe('75%');
      expect(formatUtilization(75, 'percentage')).toBe('75%');
    });

    it('handles over 100% utilization', () => {
      expect(formatUtilization(125, 'hours')).toBe('125%');
    });

    it('rounds to nearest integer', () => {
      expect(formatUtilization(82.6, 'hours')).toBe('83%');
    });
  });

  describe('getAllocationLabel', () => {
    it('returns Hours for hours preference', () => {
      expect(getAllocationLabel('hours')).toBe('Hours');
    });

    it('returns Percentage for percentage preference', () => {
      expect(getAllocationLabel('percentage')).toBe('Percentage');
    });
  });

  describe('getAllocationPlaceholder', () => {
    it('returns hours placeholder for hours preference', () => {
      expect(getAllocationPlaceholder('hours')).toBe('Enter hours');
    });

    it('returns percentage placeholder for percentage preference', () => {
      expect(getAllocationPlaceholder('percentage')).toBe('Enter percentage (0-100)');
    });
  });

  describe('convertToHours', () => {
    it('returns value unchanged for hours preference', () => {
      expect(convertToHours(20, 40, 'hours')).toBe(20);
    });

    it('converts percentage to hours', () => {
      expect(convertToHours(50, 40, 'percentage')).toBe(20);
    });

    it('handles 100% correctly', () => {
      expect(convertToHours(100, 40, 'percentage')).toBe(40);
    });

    it('handles over 100% correctly', () => {
      expect(convertToHours(150, 40, 'percentage')).toBe(60);
    });

    it('handles 0%', () => {
      expect(convertToHours(0, 40, 'percentage')).toBe(0);
    });
  });

  describe('convertFromHours', () => {
    it('returns hours unchanged for hours preference', () => {
      expect(convertFromHours(20, 40, 'hours')).toBe(20);
    });

    it('converts hours to percentage', () => {
      expect(convertFromHours(20, 40, 'percentage')).toBe(50);
    });

    it('handles full capacity correctly', () => {
      expect(convertFromHours(40, 40, 'percentage')).toBe(100);
    });

    it('handles over-allocation correctly', () => {
      expect(convertFromHours(60, 40, 'percentage')).toBe(150);
    });

    it('handles 0 hours', () => {
      expect(convertFromHours(0, 40, 'percentage')).toBe(0);
    });
  });
});
