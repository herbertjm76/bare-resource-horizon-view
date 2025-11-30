/**
 * Shared types for weekly overview, resource scheduling, and member availability
 * Consolidates duplicate type definitions across the codebase
 */

/**
 * Project allocation for a member
 * Used in weekly overview, rundown views, and member availability cards
 */
export interface ProjectAllocation {
  projectId: string;
  projectName: string;
  projectCode: string;
  hours: number;
}

/**
 * Available member data for display in member rows
 */
export interface AvailableMember {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl?: string | null;
  location: string;
  practiceArea: string | null;
  department: string | null;
  weeklyCapacity: number;
  availableHours: number;
  allocatedHours: number;
  utilization: number;
  sectors: string[];
  projectAllocations: ProjectAllocation[];
  memberType: 'active' | 'pre_registered';
}

/**
 * Utilization zones for filtering members
 */
export type UtilizationZone = 'needs-attention' | 'available' | 'at-capacity' | 'over-allocated' | 'all';

/**
 * Zone counts for filter tabs
 */
export interface ZoneCounts {
  'needs-attention': number;
  'available': number;
  'at-capacity': number;
  'over-allocated': number;
  'all': number;
}

/**
 * Member leave data
 */
export interface MemberLeaveData {
  annualLeave: number;
  vacationLeave: number;
  medicalLeave: number;
  publicHoliday: number;
  otherLeave: number;
}

/**
 * Complete member allocation data including projects and leave
 */
export interface MemberAllocationData extends MemberLeaveData {
  resourcedHours: number;
  projectAllocations: ProjectAllocation[];
}
