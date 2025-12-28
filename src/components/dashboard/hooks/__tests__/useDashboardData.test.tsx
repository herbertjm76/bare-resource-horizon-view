import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDashboardData } from '../useDashboardData';
import React from 'react';

// Mock useCompanyId
vi.mock('@/hooks/useCompanyId', () => ({
  useCompanyId: vi.fn()
}));

// Mock dashboard queries
vi.mock('@/hooks/queries/useDashboardQueries', () => ({
  useDashboardTeamMembers: vi.fn(),
  useDashboardPreRegistered: vi.fn(),
  useDashboardProjects: vi.fn(),
  useDashboardTeamComposition: vi.fn(),
  useDashboardHolidays: vi.fn(),
  useDashboardMetrics: vi.fn()
}));

// Mock standardized utilization data
vi.mock('@/hooks/useStandardizedUtilizationData', () => ({
  useStandardizedUtilizationData: vi.fn()
}));

// Mock aggregated data
vi.mock('../useAggregatedData', () => ({
  useAggregatedData: vi.fn()
}));

// Mock utility functions
vi.mock('../utils/utilizationCalculations', () => ({
  getUtilizationStatus: vi.fn().mockReturnValue('healthy'),
  generateUtilizationTrends: vi.fn().mockReturnValue({ days7: 0, days30: 0, days90: 0 })
}));

import { useCompanyId } from '@/hooks/useCompanyId';
import {
  useDashboardTeamMembers,
  useDashboardPreRegistered,
  useDashboardProjects,
  useDashboardTeamComposition,
  useDashboardHolidays,
  useDashboardMetrics
} from '@/hooks/queries/useDashboardQueries';
import { useStandardizedUtilizationData } from '@/hooks/useStandardizedUtilizationData';
import { useAggregatedData } from '../useAggregatedData';

const mockUseCompanyId = useCompanyId as ReturnType<typeof vi.fn>;
const mockUseDashboardTeamMembers = useDashboardTeamMembers as ReturnType<typeof vi.fn>;
const mockUseDashboardPreRegistered = useDashboardPreRegistered as ReturnType<typeof vi.fn>;
const mockUseDashboardProjects = useDashboardProjects as ReturnType<typeof vi.fn>;
const mockUseDashboardTeamComposition = useDashboardTeamComposition as ReturnType<typeof vi.fn>;
const mockUseDashboardHolidays = useDashboardHolidays as ReturnType<typeof vi.fn>;
const mockUseDashboardMetrics = useDashboardMetrics as ReturnType<typeof vi.fn>;
const mockUseStandardizedUtilizationData = useStandardizedUtilizationData as ReturnType<typeof vi.fn>;
const mockUseAggregatedData = useAggregatedData as ReturnType<typeof vi.fn>;

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

const setupDefaultMocks = () => {
  mockUseCompanyId.mockReturnValue({
    companyId: 'company-123',
    isLoading: false,
    isReady: true,
    error: null
  });

  mockUseDashboardTeamMembers.mockReturnValue({
    data: [],
    isLoading: false,
    refetch: vi.fn()
  });

  mockUseDashboardPreRegistered.mockReturnValue({
    data: [],
    refetch: vi.fn()
  });

  mockUseDashboardProjects.mockReturnValue({
    data: [],
    isLoading: false,
    refetch: vi.fn()
  });

  mockUseDashboardTeamComposition.mockReturnValue({
    data: [],
    isLoading: false
  });

  mockUseDashboardHolidays.mockReturnValue({
    data: [],
    isLoading: false
  });

  mockUseDashboardMetrics.mockReturnValue({
    data: {
      activeProjects: 0,
      activeResources: 0,
      utilizationTrends: { days7: 0, days30: 0, days90: 0 },
      projectsByStatus: [],
      projectsByStage: [],
      projectsByLocation: [],
      projectsByPM: [],
      totalRevenue: 0,
      avgProjectValue: 0
    },
    isLoading: false
  });

  mockUseStandardizedUtilizationData.mockReturnValue({
    memberUtilizations: [],
    teamSummary: { teamUtilizationRate: 0 },
    isLoading: false
  });

  mockUseAggregatedData.mockReturnValue({
    transformedStaffData: [],
    totalTeamSize: 0,
    mockData: {},
    smartInsightsData: []
  });
};

describe('useDashboardData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  it('should return loading state when company is loading', () => {
    mockUseCompanyId.mockReturnValue({
      companyId: undefined,
      isLoading: true,
      isReady: false,
      error: null
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should return loading state when team data is loading', () => {
    mockUseDashboardTeamMembers.mockReturnValue({
      data: [],
      isLoading: true,
      refetch: vi.fn()
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should return loading state when projects are loading', () => {
    mockUseDashboardProjects.mockReturnValue({
      data: [],
      isLoading: true,
      refetch: vi.fn()
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should return loading state when metrics are loading', () => {
    mockUseDashboardMetrics.mockReturnValue({
      data: null,
      isLoading: true
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should not be loading when all data is loaded', () => {
    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should return team members data', () => {
    const mockTeamMembers = [
      { id: '1', first_name: 'John', last_name: 'Doe' },
      { id: '2', first_name: 'Jane', last_name: 'Smith' }
    ];

    mockUseDashboardTeamMembers.mockReturnValue({
      data: mockTeamMembers,
      isLoading: false,
      refetch: vi.fn()
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.teamMembers).toEqual(mockTeamMembers);
  });

  it('should return projects data', () => {
    const mockProjects = [
      { id: '1', name: 'Project A', status: 'active' },
      { id: '2', name: 'Project B', status: 'completed' }
    ];

    mockUseDashboardProjects.mockReturnValue({
      data: mockProjects,
      isLoading: false,
      refetch: vi.fn()
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.projects).toEqual(mockProjects);
  });

  it('should handle different time ranges', () => {
    const { result: weekResult } = renderHook(() => useDashboardData('week'), {
      wrapper: createWrapper()
    });
    expect(weekResult.current).toBeDefined();

    const { result: monthResult } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });
    expect(monthResult.current).toBeDefined();

    const { result: quarterResult } = renderHook(() => useDashboardData('3months'), {
      wrapper: createWrapper()
    });
    expect(quarterResult.current).toBeDefined();
  });

  it('should provide setSelectedOffice function', () => {
    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(typeof result.current.setSelectedOffice).toBe('function');
    expect(result.current.selectedOffice).toBe('All Offices');
  });

  it('should provide refetch function that calls all refetch methods', async () => {
    const refetchTeam = vi.fn().mockResolvedValue({});
    const refetchPreReg = vi.fn().mockResolvedValue({});
    const refetchProjects = vi.fn().mockResolvedValue({});

    mockUseDashboardTeamMembers.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: refetchTeam
    });

    mockUseDashboardPreRegistered.mockReturnValue({
      data: [],
      refetch: refetchPreReg
    });

    mockUseDashboardProjects.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: refetchProjects
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    await result.current.refetch();

    expect(refetchTeam).toHaveBeenCalled();
    expect(refetchPreReg).toHaveBeenCalled();
    expect(refetchProjects).toHaveBeenCalled();
  });

  it('should return utilization data from standardized source', () => {
    const mockTeamSummary = { teamUtilizationRate: 75 };
    const mockMemberUtilizations = [
      { id: '1', utilizationRate: 80, totalAllocatedHours: 32, weeklyCapacity: 40 }
    ];

    mockUseStandardizedUtilizationData.mockReturnValue({
      memberUtilizations: mockMemberUtilizations,
      teamSummary: mockTeamSummary,
      isLoading: false
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.teamSummary).toEqual(mockTeamSummary);
    expect(result.current.currentUtilizationRate).toBe(75);
  });

  it('should combine team members and pre-registered members for calculations', () => {
    const mockTeamMembers = [
      { id: '1', first_name: 'John', last_name: 'Doe' }
    ];
    const mockPreRegistered = [
      { id: '2', first_name: 'Jane', last_name: 'Smith' }
    ];

    mockUseDashboardTeamMembers.mockReturnValue({
      data: mockTeamMembers,
      isLoading: false,
      refetch: vi.fn()
    });

    mockUseDashboardPreRegistered.mockReturnValue({
      data: mockPreRegistered,
      refetch: vi.fn()
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.teamMembers).toEqual(mockTeamMembers);
    expect(result.current.preRegisteredMembers).toEqual(mockPreRegistered);
  });

  it('should return holidays data', () => {
    const mockHolidays = [
      { id: '1', name: 'Christmas', date: '2024-12-25' },
      { id: '2', name: 'New Year', date: '2025-01-01' }
    ];

    mockUseDashboardHolidays.mockReturnValue({
      data: mockHolidays,
      isLoading: false
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.holidays).toEqual(mockHolidays);
  });

  it('should return default metrics when data is null', () => {
    mockUseDashboardMetrics.mockReturnValue({
      data: null,
      isLoading: false
    });

    const { result } = renderHook(() => useDashboardData('month'), {
      wrapper: createWrapper()
    });

    expect(result.current.activeProjects).toBe(0);
    expect(result.current.activeResources).toBe(0);
  });
});
