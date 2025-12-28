import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProjects } from '../useProjects';
import React from 'react';

// Mock useCompanyId
vi.mock('@/hooks/useCompanyId', () => ({
  useCompanyId: vi.fn()
}));

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

import { useCompanyId } from '@/hooks/useCompanyId';
import { supabase } from '@/integrations/supabase/client';

const mockUseCompanyId = useCompanyId as ReturnType<typeof vi.fn>;
const mockSupabase = supabase as unknown as { from: ReturnType<typeof vi.fn> };

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty projects when company is not ready', () => {
    mockUseCompanyId.mockReturnValue({
      companyId: undefined,
      isReady: false,
      isLoading: true,
      error: null
    });

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper()
    });

    expect(result.current.projects).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should not be loading when company has no id and is not loading', () => {
    mockUseCompanyId.mockReturnValue({
      companyId: undefined,
      isReady: false,
      isLoading: false,
      error: null
    });

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper()
    });

    expect(result.current.projects).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should fetch projects when company is ready', () => {
    mockUseCompanyId.mockReturnValue({
      companyId: 'company-123',
      isReady: true,
      isLoading: false,
      error: null
    });

    const mockOrder = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnValue({
      order: mockOrder
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: mockEq
    });

    mockOrder.mockImplementation(() => ({
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    }));

    mockSupabase.from.mockReturnValue({
      select: mockSelect
    });

    renderHook(() => useProjects(), {
      wrapper: createWrapper()
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('projects');
    expect(mockEq).toHaveBeenCalledWith('company_id', 'company-123');
  });

  it('should handle sorting parameters correctly', () => {
    mockUseCompanyId.mockReturnValue({
      companyId: 'company-123',
      isReady: true,
      isLoading: false,
      error: null
    });

    const mockOrder = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnValue({
      order: mockOrder
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: mockEq
    });

    mockOrder.mockImplementation(() => ({
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    }));

    mockSupabase.from.mockReturnValue({
      select: mockSelect
    });

    renderHook(() => useProjects('name', 'desc'), {
      wrapper: createWrapper()
    });

    // Verify that sorting is applied
    expect(mockOrder).toHaveBeenCalled();
  });

  it('should return error when company context has error', () => {
    mockUseCompanyId.mockReturnValue({
      companyId: undefined,
      isReady: false,
      isLoading: false,
      error: 'Company not found'
    });

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper()
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Company not found');
  });

  it('should provide refetch function', () => {
    mockUseCompanyId.mockReturnValue({
      companyId: undefined,
      isReady: false,
      isLoading: false,
      error: null
    });

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper()
    });

    expect(typeof result.current.refetch).toBe('function');
  });
});
