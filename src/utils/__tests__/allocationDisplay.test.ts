import { describe, it, expect } from 'vitest';
import {
  formatAllocationValue,
  formatDualAllocationValue,
  getInputConfig,
  convertInputToHours,
  convertHoursToInputValue,
  formatCapacityValue,
  formatAvailableValue,
  getCapacityLabel,
  formatUtilizationSummary
} from '../allocationDisplay';

describe('allocationDisplay', () => {
  describe('formatAllocationValue', () => {
    describe('hours preference', () => {
      it('formats whole hours with suffix', () => {
        expect(formatAllocationValue(20, 40, 'hours')).toBe('20h');
      });

      it('formats decimal hours with one decimal place', () => {
        expect(formatAllocationValue(20.5, 40, 'hours')).toBe('20.5h');
      });

      it('formats without suffix when specified', () => {
        expect(formatAllocationValue(20, 40, 'hours', false)).toBe('20');
      });

      it('handles 0 hours', () => {
        expect(formatAllocationValue(0, 40, 'hours')).toBe('0h');
      });
    });

    describe('percentage preference', () => {
      it('formats as percentage with suffix', () => {
        expect(formatAllocationValue(20, 40, 'percentage')).toBe('50%');
      });

      it('formats decimal percentages correctly', () => {
        expect(formatAllocationValue(33, 40, 'percentage')).toBe('82.5%');
      });

      it('formats without suffix when specified', () => {
        expect(formatAllocationValue(20, 40, 'percentage', false)).toBe('50');
      });

      it('returns 0% when capacity is 0', () => {
        expect(formatAllocationValue(20, 0, 'percentage')).toBe('0%');
      });

      it('returns 0 without suffix when capacity is 0', () => {
        expect(formatAllocationValue(20, 0, 'percentage', false)).toBe('0');
      });
    });
  });

  describe('formatDualAllocationValue', () => {
    it('formats with percentage first when preference is percentage', () => {
      expect(formatDualAllocationValue(20, 40, 'percentage')).toBe('50% (20h)');
    });

    it('formats with hours first when preference is hours', () => {
      expect(formatDualAllocationValue(20, 40, 'hours')).toBe('20h (50%)');
    });

    it('handles 0 values', () => {
      expect(formatDualAllocationValue(0, 40, 'percentage')).toBe('0% (0h)');
      expect(formatDualAllocationValue(0, 40, 'hours')).toBe('0h (0%)');
    });

    it('handles 0 capacity', () => {
      expect(formatDualAllocationValue(20, 0, 'percentage')).toBe('0% (0h)');
      expect(formatDualAllocationValue(20, 0, 'hours')).toBe('0h (0%)');
    });

    it('formats decimal values correctly', () => {
      expect(formatDualAllocationValue(17.5, 40, 'hours')).toBe('17.5h (43.8%)');
    });
  });

  describe('getInputConfig', () => {
    it('returns percentage config for percentage preference', () => {
      const config = getInputConfig('percentage');
      expect(config.step).toBe(5);
      expect(config.min).toBe(0);
      expect(config.max).toBe(200);
      expect(config.unit).toBe('%');
    });

    it('returns hours config for hours preference', () => {
      const config = getInputConfig('hours');
      expect(config.step).toBe(0.5);
      expect(config.min).toBe(0);
      expect(config.max).toBe(168);
      expect(config.unit).toBe('h');
    });
  });

  describe('convertInputToHours', () => {
    it('returns value unchanged for hours preference', () => {
      expect(convertInputToHours(20, 40, 'hours')).toBe(20);
    });

    it('converts percentage to hours', () => {
      expect(convertInputToHours(50, 40, 'percentage')).toBe(20);
    });

    it('handles over 100%', () => {
      expect(convertInputToHours(150, 40, 'percentage')).toBe(60);
    });
  });

  describe('convertHoursToInputValue', () => {
    it('returns hours unchanged for hours preference', () => {
      expect(convertHoursToInputValue(20, 40, 'hours')).toBe(20);
    });

    it('converts hours to percentage', () => {
      expect(convertHoursToInputValue(20, 40, 'percentage')).toBe(50);
    });

    it('returns 0 when capacity is 0', () => {
      expect(convertHoursToInputValue(20, 0, 'percentage')).toBe(0);
    });
  });

  describe('formatCapacityValue', () => {
    it('returns 100% for percentage preference', () => {
      expect(formatCapacityValue(40, 'percentage')).toBe('100%');
    });

    it('returns hours value for hours preference', () => {
      expect(formatCapacityValue(40, 'hours')).toBe('40h');
    });
  });

  describe('formatAvailableValue', () => {
    it('formats available hours', () => {
      expect(formatAvailableValue(10, 40, 'hours')).toBe('10h');
    });

    it('formats available as percentage', () => {
      expect(formatAvailableValue(10, 40, 'percentage')).toBe('25%');
    });

    it('handles decimal hours', () => {
      expect(formatAvailableValue(10.5, 40, 'hours')).toBe('10.5h');
    });

    it('handles 0 capacity for percentage', () => {
      expect(formatAvailableValue(10, 0, 'percentage')).toBe('0%');
    });
  });

  describe('getCapacityLabel', () => {
    it('returns "of 100%" for percentage preference', () => {
      expect(getCapacityLabel(40, 'percentage')).toBe('of 100%');
    });

    it('returns hours label for hours preference', () => {
      expect(getCapacityLabel(40, 'hours')).toBe('of 40h');
    });
  });

  describe('formatUtilizationSummary', () => {
    it('formats correctly for hours preference', () => {
      expect(formatUtilizationSummary(32, 40, 'hours')).toBe('32h of 40h');
    });

    it('formats correctly for percentage preference', () => {
      expect(formatUtilizationSummary(32, 40, 'percentage')).toBe('80% of 100%');
    });

    it('handles full utilization', () => {
      expect(formatUtilizationSummary(40, 40, 'hours')).toBe('40h of 40h');
      expect(formatUtilizationSummary(40, 40, 'percentage')).toBe('100% of 100%');
    });
  });
});
