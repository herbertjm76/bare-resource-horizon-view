import { describe, it, expect } from 'vitest';
import { getWeekStart, getWeekEnd, formatWeekRange } from '../weekUtils';

describe('weekUtils', () => {
  describe('getWeekStart', () => {
    describe('with Monday start', () => {
      it('returns Monday for a Wednesday', () => {
        const wednesday = new Date(2025, 0, 15); // Wed Jan 15, 2025
        const result = getWeekStart(wednesday, 'Monday');
        expect(result.getDay()).toBe(1); // Monday
        expect(result.getDate()).toBe(13);
      });

      it('returns same day when given Monday', () => {
        const monday = new Date(2025, 0, 13); // Mon Jan 13, 2025
        const result = getWeekStart(monday, 'Monday');
        expect(result.getDay()).toBe(1);
        expect(result.getDate()).toBe(13);
      });

      it('returns previous Monday for Sunday', () => {
        const sunday = new Date(2025, 0, 19); // Sun Jan 19, 2025
        const result = getWeekStart(sunday, 'Monday');
        expect(result.getDay()).toBe(1);
        expect(result.getDate()).toBe(13);
      });

      it('sets time to midnight', () => {
        const date = new Date(2025, 0, 15, 14, 30, 45);
        const result = getWeekStart(date, 'Monday');
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
      });
    });

    describe('with Sunday start', () => {
      it('returns Sunday for a Wednesday', () => {
        const wednesday = new Date(2025, 0, 15); // Wed Jan 15, 2025
        const result = getWeekStart(wednesday, 'Sunday');
        expect(result.getDay()).toBe(0); // Sunday
        expect(result.getDate()).toBe(12);
      });

      it('returns same day when given Sunday', () => {
        const sunday = new Date(2025, 0, 12); // Sun Jan 12, 2025
        const result = getWeekStart(sunday, 'Sunday');
        expect(result.getDay()).toBe(0);
        expect(result.getDate()).toBe(12);
      });

      it('returns Sunday for Saturday', () => {
        const saturday = new Date(2025, 0, 18); // Sat Jan 18, 2025
        const result = getWeekStart(saturday, 'Sunday');
        expect(result.getDay()).toBe(0);
        expect(result.getDate()).toBe(12);
      });
    });

    describe('with Saturday start', () => {
      it('returns Saturday for a Wednesday', () => {
        const wednesday = new Date(2025, 0, 15); // Wed Jan 15, 2025
        const result = getWeekStart(wednesday, 'Saturday');
        expect(result.getDay()).toBe(6); // Saturday
        expect(result.getDate()).toBe(11);
      });

      it('returns same day when given Saturday', () => {
        const saturday = new Date(2025, 0, 11); // Sat Jan 11, 2025
        const result = getWeekStart(saturday, 'Saturday');
        expect(result.getDay()).toBe(6);
        expect(result.getDate()).toBe(11);
      });
    });
  });

  describe('getWeekEnd', () => {
    it('returns 6 days after week start for Monday-start week', () => {
      const wednesday = new Date(2025, 0, 15);
      const result = getWeekEnd(wednesday, 'Monday');
      expect(result.getDay()).toBe(0); // Sunday
      expect(result.getDate()).toBe(19);
    });

    it('returns 6 days after week start for Sunday-start week', () => {
      const wednesday = new Date(2025, 0, 15);
      const result = getWeekEnd(wednesday, 'Sunday');
      expect(result.getDay()).toBe(6); // Saturday
      expect(result.getDate()).toBe(18);
    });

    it('sets time to end of day', () => {
      const date = new Date(2025, 0, 15);
      const result = getWeekEnd(date, 'Monday');
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('formatWeekRange', () => {
    it('formats week range correctly', () => {
      const date = new Date(2025, 0, 15); // Wed Jan 15, 2025
      const result = formatWeekRange(date, 'Monday');
      // Format depends on locale, but should contain start and end dates
      expect(result).toContain('13');
      expect(result).toContain('19');
      expect(result).toContain('-');
    });

    it('handles cross-month ranges', () => {
      const date = new Date(2025, 0, 29); // Wed Jan 29, 2025
      const result = formatWeekRange(date, 'Monday');
      // Week starts Jan 27, ends Feb 2
      expect(result).toContain('27');
      expect(result).toContain('2');
    });
  });
});
