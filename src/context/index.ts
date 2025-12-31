/**
 * Context module exports
 * Consolidated context providers and hooks
 */

// Company context
export { CompanyProvider, useCompany } from './CompanyContext';
export type { Company, CompanyContextType, Profile } from './types';

// Office settings context
export { OfficeSettingsProvider, OfficeSettingsContext } from './officeSettings/OfficeSettingsContext';
export { useOfficeSettings } from './officeSettings/useOfficeSettings';
export type { 
  Role, 
  Rate, 
  Location, 
  Department, 
  PracticeArea, 
  ProjectStage, 
  ProjectStatus, 
  ProjectType,
  OfficeSettingsContextType 
} from './officeSettings/types';

// Project form context
export { ProjectFormProvider, useProjectFormContext } from './ProjectFormContext';
export type { 
  Project, 
  ResourceAllocation, 
  MemberAllocation, 
  ProjectFormState, 
  StageFee,
  ManagerOption,
  OfficeOption,
  StageOption,
  TeamMember,
  WeeklyMemberData,
  WeeklyProjectAllocation,
  DashboardMetrics,
  UtilizationData,
  LeaveType,
  LeaveRequest
} from './types';
