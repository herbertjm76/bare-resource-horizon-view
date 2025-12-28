import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCompanyId } from '../useCompanyId';

// Mock the CompanyContext
const mockUseCompany = vi.fn();

vi.mock('@/context/CompanyContext', () => ({
  useCompany: () => mockUseCompany(),
}));

describe('useCompanyId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    it('returns isReady=false and undefined companyId when loading', () => {
      mockUseCompany.mockReturnValue({
        company: null,
        loading: true,
        error: null,
      });

      const { result } = renderHook(() => useCompanyId());

      expect(result.current.isReady).toBe(false);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.companyId).toBeUndefined();
      expect(result.current.company).toBeNull();
    });

    it('returns isReady=false when loading even if company exists', () => {
      mockUseCompany.mockReturnValue({
        company: { id: 'company-123', name: 'Test Company' },
        loading: true,
        error: null,
      });

      const { result } = renderHook(() => useCompanyId());

      expect(result.current.isReady).toBe(false);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.companyId).toBeUndefined();
      expect(result.current.company).toBeNull();
    });
  });

  describe('ready state', () => {
    it('returns isReady=true and companyId when loaded with valid company', () => {
      const mockCompany = { id: 'company-456', name: 'Ready Company' };
      mockUseCompany.mockReturnValue({
        company: mockCompany,
        loading: false,
        error: null,
      });

      const { result } = renderHook(() => useCompanyId());

      expect(result.current.isReady).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.companyId).toBe('company-456');
      expect(result.current.company).toEqual(mockCompany);
      expect(result.current.error).toBeNull();
    });
  });

  describe('error state', () => {
    it('returns isReady=false when there is an error', () => {
      mockUseCompany.mockReturnValue({
        company: null,
        loading: false,
        error: 'Failed to fetch company',
      });

      const { result } = renderHook(() => useCompanyId());

      expect(result.current.isReady).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.companyId).toBeUndefined();
      expect(result.current.error).toBe('Failed to fetch company');
    });

    it('returns isReady=false when error exists even if company data is present', () => {
      mockUseCompany.mockReturnValue({
        company: { id: 'company-789', name: 'Error Company' },
        loading: false,
        error: 'Some error occurred',
      });

      const { result } = renderHook(() => useCompanyId());

      expect(result.current.isReady).toBe(false);
      expect(result.current.companyId).toBeUndefined();
      expect(result.current.company).toBeNull();
    });
  });

  describe('no company state', () => {
    it('returns isReady=false when no company and not loading', () => {
      mockUseCompany.mockReturnValue({
        company: null,
        loading: false,
        error: null,
      });

      const { result } = renderHook(() => useCompanyId());

      expect(result.current.isReady).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.companyId).toBeUndefined();
      expect(result.current.company).toBeNull();
    });

    it('returns isReady=false when company exists but has no id', () => {
      mockUseCompany.mockReturnValue({
        company: { name: 'No ID Company' }, // Missing id
        loading: false,
        error: null,
      });

      const { result } = renderHook(() => useCompanyId());

      expect(result.current.isReady).toBe(false);
      expect(result.current.companyId).toBeUndefined();
    });
  });

  describe('React Query integration pattern', () => {
    it('provides correct enabled condition for React Query hooks', () => {
      // Simulate loading state
      mockUseCompany.mockReturnValue({
        company: null,
        loading: true,
        error: null,
      });

      const { result, rerender } = renderHook(() => useCompanyId());

      // During loading, queries should be disabled
      expect(result.current.isReady).toBe(false);

      // Simulate loaded state
      mockUseCompany.mockReturnValue({
        company: { id: 'company-ready', name: 'Ready' },
        loading: false,
        error: null,
      });

      rerender();

      // After loading, queries should be enabled
      expect(result.current.isReady).toBe(true);
      expect(result.current.companyId).toBe('company-ready');
    });
  });
});
