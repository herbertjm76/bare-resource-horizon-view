/**
 * Allocation Week Rulebook Tests
 * 
 * These tests ensure the canonical week key logic is correct and consistent.
 */

import { describe, it, expect } from 'vitest';
import {
  getAllocationWeekKey,
  getWeekRange,
  generateWeekKeysForPeriod,
  buildAllocationQueryRange,
  assertValidWeekKey,
  compareWeekKeys,
  isWeekKeyInRange,
} from './allocationWeek';

describe('getAllocationWeekKey', () => {
  it('should normalize a Wednesday to the previous Monday (default)', () => {
    // 2026-01-07 is a Wednesday
    const wednesday = new Date('2026-01-07T12:00:00Z');
    const weekKey = getAllocationWeekKey(wednesday, 'Monday');
    expect(weekKey).toBe('2026-01-05'); // Monday
  });

  it('should normalize a Wednesday to the previous Sunday when weekStart is Sunday', () => {
    // 2026-01-07 is a Wednesday
    const wednesday = new Date('2026-01-07T12:00:00Z');
    const weekKey = getAllocationWeekKey(wednesday, 'Sunday');
    expect(weekKey).toBe('2026-01-04'); // Sunday
  });

  it('should return the same date if already on week start', () => {
    // 2026-01-05 is a Monday
    const monday = new Date('2026-01-05T12:00:00Z');
    const weekKey = getAllocationWeekKey(monday, 'Monday');
    expect(weekKey).toBe('2026-01-05');
  });

  it('should handle string input', () => {
    const weekKey = getAllocationWeekKey('2026-01-07', 'Monday');
    expect(weekKey).toBe('2026-01-05');
  });

  it('should handle edge case: Sunday when week starts Monday', () => {
    // 2026-01-11 is a Sunday, should go back to 2026-01-05 (Monday)
    const sunday = new Date('2026-01-11T12:00:00Z');
    const weekKey = getAllocationWeekKey(sunday, 'Monday');
    expect(weekKey).toBe('2026-01-05');
  });

  it('should handle Saturday week start', () => {
    // 2026-01-07 is a Wednesday, should go back to 2026-01-03 (Saturday)
    const wednesday = new Date('2026-01-07T12:00:00Z');
    const weekKey = getAllocationWeekKey(wednesday, 'Saturday');
    expect(weekKey).toBe('2026-01-03');
  });
});

describe('getWeekRange', () => {
  it('should return a 7-day range starting from the week key', () => {
    const range = getWeekRange('2026-01-05');
    expect(range.start).toBe('2026-01-05');
    expect(range.end).toBe('2026-01-11');
  });
});

describe('generateWeekKeysForPeriod', () => {
  it('should generate correct number of week keys', () => {
    const keys = generateWeekKeysForPeriod('2026-01-05', 4, 'Monday');
    expect(keys).toHaveLength(4);
    expect(keys[0]).toBe('2026-01-05');
    expect(keys[1]).toBe('2026-01-12');
    expect(keys[2]).toBe('2026-01-19');
    expect(keys[3]).toBe('2026-01-26');
  });

  it('should normalize start date to week start first', () => {
    // Start from Wednesday, should still begin on Monday
    const keys = generateWeekKeysForPeriod('2026-01-07', 2, 'Monday');
    expect(keys[0]).toBe('2026-01-05');
    expect(keys[1]).toBe('2026-01-12');
  });
});

describe('buildAllocationQueryRange', () => {
  it('should build correct range for 12 weeks', () => {
    const range = buildAllocationQueryRange(
      new Date('2026-01-07T12:00:00Z'),
      12,
      'Monday'
    );
    expect(range.startWeekKey).toBe('2026-01-05');
    // 12 weeks = 11 * 7 = 77 days from start
    expect(range.endWeekKey).toBe('2026-03-23');
  });
});

describe('assertValidWeekKey', () => {
  it('should return true for valid Monday week key', () => {
    expect(assertValidWeekKey('2026-01-05', 'Monday')).toBe(true);
  });

  it('should return false for invalid Monday week key', () => {
    expect(assertValidWeekKey('2026-01-07', 'Monday')).toBe(false);
  });

  it('should return true for valid Sunday week key', () => {
    expect(assertValidWeekKey('2026-01-04', 'Sunday')).toBe(true);
  });
});

describe('compareWeekKeys', () => {
  it('should compare week keys correctly', () => {
    expect(compareWeekKeys('2026-01-05', '2026-01-12')).toBe(-1);
    expect(compareWeekKeys('2026-01-12', '2026-01-05')).toBe(1);
    expect(compareWeekKeys('2026-01-05', '2026-01-05')).toBe(0);
  });
});

describe('isWeekKeyInRange', () => {
  it('should correctly identify keys within range', () => {
    expect(isWeekKeyInRange('2026-01-12', '2026-01-05', '2026-01-19')).toBe(true);
    expect(isWeekKeyInRange('2026-01-05', '2026-01-05', '2026-01-19')).toBe(true);
    expect(isWeekKeyInRange('2026-01-19', '2026-01-05', '2026-01-19')).toBe(true);
  });

  it('should correctly identify keys outside range', () => {
    expect(isWeekKeyInRange('2026-01-04', '2026-01-05', '2026-01-19')).toBe(false);
    expect(isWeekKeyInRange('2026-01-26', '2026-01-05', '2026-01-19')).toBe(false);
  });
});

describe('timezone consistency', () => {
  it('should produce consistent week keys regardless of local timezone offset simulation', () => {
    // Create dates at different "local" times that represent the same UTC day
    const earlyUTC = new Date('2026-01-07T01:00:00Z');
    const lateUTC = new Date('2026-01-07T23:00:00Z');
    
    const key1 = getAllocationWeekKey(earlyUTC, 'Monday');
    const key2 = getAllocationWeekKey(lateUTC, 'Monday');
    
    expect(key1).toBe(key2);
    expect(key1).toBe('2026-01-05');
  });
});
