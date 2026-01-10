import { describe, it, expect } from 'vitest';
import {
  parseInputToHours,
  hoursToInputDisplay,
  formatHoursForDisplay,
  validateAllocationHours,
  validateTotalAllocation,
  getAllocationInputConfig,
  verifyRoundTrip
} from './allocationInput';

describe('parseInputToHours', () => {
  const capacity = 40;

  describe('hours mode', () => {
    it('parses valid integer hours', () => {
      expect(parseInputToHours('10', capacity, 'hours')).toBe(10);
      expect(parseInputToHours('0', capacity, 'hours')).toBe(0);
      expect(parseInputToHours('40', capacity, 'hours')).toBe(40);
    });

    it('parses valid decimal hours', () => {
      expect(parseInputToHours('10.5', capacity, 'hours')).toBe(10.5);
      expect(parseInputToHours('0.5', capacity, 'hours')).toBe(0.5);
    });

    it('handles empty and invalid input', () => {
      expect(parseInputToHours('', capacity, 'hours')).toBe(0);
      expect(parseInputToHours('  ', capacity, 'hours')).toBe(0);
      expect(parseInputToHours('-', capacity, 'hours')).toBe(0);
      expect(parseInputToHours('abc', capacity, 'hours')).toBe(0);
      expect(parseInputToHours('-5', capacity, 'hours')).toBe(0);
    });
  });

  describe('percentage mode', () => {
    it('converts percentage to hours correctly', () => {
      // 25% of 40h = 10h
      expect(parseInputToHours('25', capacity, 'percentage')).toBe(10);
      // 50% of 40h = 20h
      expect(parseInputToHours('50', capacity, 'percentage')).toBe(20);
      // 100% of 40h = 40h
      expect(parseInputToHours('100', capacity, 'percentage')).toBe(40);
    });

    it('handles decimal percentages', () => {
      // 25.5% of 40h = 10.2h
      expect(parseInputToHours('25.5', capacity, 'percentage')).toBe(10.2);
    });

    it('handles over 100% for overtime', () => {
      // 125% of 40h = 50h
      expect(parseInputToHours('125', capacity, 'percentage')).toBe(50);
    });

    it('handles empty and invalid input', () => {
      expect(parseInputToHours('', capacity, 'percentage')).toBe(0);
      expect(parseInputToHours('abc', capacity, 'percentage')).toBe(0);
    });
  });
});

describe('hoursToInputDisplay', () => {
  const capacity = 40;

  describe('hours mode', () => {
    it('displays whole numbers without decimals', () => {
      expect(hoursToInputDisplay(10, capacity, 'hours')).toBe('10');
      expect(hoursToInputDisplay(40, capacity, 'hours')).toBe('40');
    });

    it('displays decimals when present', () => {
      expect(hoursToInputDisplay(10.5, capacity, 'hours')).toBe('10.5');
    });

    it('returns empty string for zero/negative', () => {
      expect(hoursToInputDisplay(0, capacity, 'hours')).toBe('');
      expect(hoursToInputDisplay(-1, capacity, 'hours')).toBe('');
    });
  });

  describe('percentage mode', () => {
    it('converts hours to percentage', () => {
      // 10h of 40h = 25%
      expect(hoursToInputDisplay(10, capacity, 'percentage')).toBe('25');
      // 20h of 40h = 50%
      expect(hoursToInputDisplay(20, capacity, 'percentage')).toBe('50');
      // 40h of 40h = 100%
      expect(hoursToInputDisplay(40, capacity, 'percentage')).toBe('100');
    });

    it('handles decimals', () => {
      // 10.2h of 40h = 25.5%
      expect(hoursToInputDisplay(10.2, capacity, 'percentage')).toBe('25.5');
    });

    it('returns empty string for zero', () => {
      expect(hoursToInputDisplay(0, capacity, 'percentage')).toBe('');
    });
  });
});

describe('formatHoursForDisplay', () => {
  const capacity = 40;

  it('adds suffix in hours mode', () => {
    expect(formatHoursForDisplay(10, capacity, 'hours')).toBe('10h');
    expect(formatHoursForDisplay(10.5, capacity, 'hours')).toBe('10.5h');
    expect(formatHoursForDisplay(0, capacity, 'hours')).toBe('0h');
  });

  it('adds suffix in percentage mode', () => {
    expect(formatHoursForDisplay(10, capacity, 'percentage')).toBe('25%');
    expect(formatHoursForDisplay(10.2, capacity, 'percentage')).toBe('25.5%');
    expect(formatHoursForDisplay(0, capacity, 'percentage')).toBe('0%');
  });
});

describe('validateAllocationHours', () => {
  const capacity = 40;

  it('accepts valid hours within limits', () => {
    expect(validateAllocationHours(10, capacity, 200).isValid).toBe(true);
    expect(validateAllocationHours(40, capacity, 200).isValid).toBe(true);
    expect(validateAllocationHours(80, capacity, 200).isValid).toBe(true);
  });

  it('rejects hours exceeding limit', () => {
    // 100h is 250% of 40h capacity, exceeds 200%
    const result = validateAllocationHours(100, capacity, 200);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('200%');
  });

  it('rejects negative hours', () => {
    expect(validateAllocationHours(-1, capacity, 200).isValid).toBe(false);
  });
});

describe('validateTotalAllocation', () => {
  const capacity = 40;

  it('validates total including other projects and leave', () => {
    // 10h project + 20h other + 5h leave = 35h = 87.5%
    const result = validateTotalAllocation(10, 20, 5, capacity, 200);
    expect(result.isValid).toBe(true);
    expect(result.totalHours).toBe(35);
  });

  it('rejects when total exceeds limit', () => {
    // 50h project + 40h other + 0h leave = 90h = 225%
    const result = validateTotalAllocation(50, 40, 0, capacity, 200);
    expect(result.isValid).toBe(false);
    expect(result.totalPercent).toBeGreaterThan(200);
  });
});

describe('getAllocationInputConfig', () => {
  it('returns percentage config', () => {
    const config = getAllocationInputConfig('percentage', 40);
    expect(config.step).toBe(1);
    expect(config.max).toBe(300);
  });

  it('returns hours config', () => {
    const config = getAllocationInputConfig('hours', 40);
    expect(config.step).toBe(0.5);
    expect(config.max).toBe(120); // 3 * 40
  });
});

describe('round-trip consistency (THE CRITICAL TEST)', () => {
  const capacity = 40;
  const testCases = [
    { hours: 0, desc: 'zero' },
    { hours: 10, desc: 'simple integer' },
    { hours: 10.5, desc: 'half hour' },
    { hours: 40, desc: 'full capacity' },
    { hours: 50, desc: 'overtime' },
    { hours: 8, desc: '1 day (20%)' },
    { hours: 4, desc: 'half day (10%)' },
  ];

  describe('hours mode round-trip', () => {
    testCases.forEach(({ hours, desc }) => {
      if (hours > 0) {
        it(`${desc}: hours -> display -> parse -> hours`, () => {
          const display = hoursToInputDisplay(hours, capacity, 'hours');
          const parsed = parseInputToHours(display, capacity, 'hours');
          expect(parsed).toBeCloseTo(hours, 1);
        });
      }
    });
  });

  describe('percentage mode round-trip', () => {
    testCases.forEach(({ hours, desc }) => {
      if (hours > 0) {
        it(`${desc}: hours -> display -> parse -> hours`, () => {
          const display = hoursToInputDisplay(hours, capacity, 'percentage');
          const parsed = parseInputToHours(display, capacity, 'percentage');
          // Allow small tolerance due to percentage conversion
          expect(parsed).toBeCloseTo(hours, 1);
        });
      }
    });
  });

  it('verifyRoundTrip utility works', () => {
    expect(verifyRoundTrip(10, capacity, 'hours')).toBe(true);
    expect(verifyRoundTrip(10, capacity, 'percentage')).toBe(true);
    expect(verifyRoundTrip(40, capacity, 'percentage')).toBe(true);
  });

  describe('the "10 becomes 70%" bug scenario', () => {
    it('10h in hours mode stays 10h', () => {
      const input = '10';
      const parsed = parseInputToHours(input, capacity, 'hours');
      expect(parsed).toBe(10);
      
      const displayBack = hoursToInputDisplay(parsed, capacity, 'hours');
      expect(displayBack).toBe('10');
    });

    it('10% in percentage mode becomes 4h', () => {
      const input = '10';
      const parsed = parseInputToHours(input, capacity, 'percentage');
      expect(parsed).toBe(4); // 10% of 40h = 4h
      
      const displayBack = hoursToInputDisplay(parsed, capacity, 'percentage');
      expect(displayBack).toBe('10'); // Shows 10% again
    });

    it('entering 10 with 40h capacity in percentage mode should NOT produce 70%', () => {
      const input = '10';
      const capacity = 40;
      
      // User enters 10 (meaning 10%)
      const hoursStored = parseInputToHours(input, capacity, 'percentage');
      expect(hoursStored).toBe(4); // 10% of 40 = 4h
      
      // When displaying back, should show 10% not 70%
      const displayValue = hoursToInputDisplay(hoursStored, capacity, 'percentage');
      expect(displayValue).toBe('10');
      expect(displayValue).not.toBe('70');
    });
  });
});
