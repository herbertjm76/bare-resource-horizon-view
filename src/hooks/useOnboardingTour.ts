import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { usePermissions, type AppRole, type Permission } from '@/hooks/usePermissions';

const ONBOARDING_STORAGE_KEY = 'onboarding_completed';
const ONBOARDING_USER_KEY = 'onboarding_user_id';

export interface OnboardingTourStep {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  requiredPermission?: Permission;
}

// Role descriptions for the welcome message
export const ROLE_DESCRIPTIONS: Record<AppRole, { title: string; description: string }> = {
  owner: {
    title: 'Owner',
    description: 'You have full access to all features including company settings, team management, project oversight, and resource scheduling.'
  },
  admin: {
    title: 'Administrator',
    description: 'You can manage team members, projects, and resource scheduling. You have access to most features except company-level settings.'
  },
  project_manager: {
    title: 'Project Manager',
    description: 'You can view team information and manage projects and resource allocations for your assigned projects.'
  },
  member: {
    title: 'Team Member',
    description: 'You can view your dashboard, team information, and your own allocations and leave.'
  },
  contractor: {
    title: 'Contractor',
    description: 'You can view your dashboard, assigned projects, and your own allocations.'
  }
};

export const ONBOARDING_STEPS: OnboardingTourStep[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your central command center. Get a quick overview of team utilization, active projects, and key metrics at a glance.',
    route: '/dashboard',
    icon: 'LayoutDashboard',
    requiredPermission: 'view:overview'
  },
  {
    id: 'weekly-overview',
    title: 'Weekly Overview',
    description: 'See your team\'s week at a glance. Track leave, holidays, announcements, and custom cards for the current week.',
    route: '/weekly-overview',
    icon: 'Calendar',
    requiredPermission: 'view:overview'
  },
  {
    id: 'resource-scheduling',
    title: 'Resource Scheduling',
    description: 'The heart of resource management. Allocate team members to projects, manage workloads, and ensure optimal utilization.',
    route: '/resource-scheduling',
    icon: 'CalendarClock',
    requiredPermission: 'view:scheduling'
  },
  {
    id: 'projects',
    title: 'All Projects',
    description: 'Manage your project portfolio. Create, edit, and track all your projects with their stages, budgets, and team assignments.',
    route: '/projects',
    icon: 'FolderKanban',
    requiredPermission: 'view:team'
  },
  {
    id: 'team-members',
    title: 'Team Members',
    description: 'Your people hub. View and manage team profiles, roles, capacities, and organizational structure.',
    route: '/team-members',
    icon: 'Users',
    requiredPermission: 'view:team'
  }
];

export const useOnboardingTour = () => {
  const { company } = useCompany();
  const { role, hasPermission, isLoading: isPermissionsLoading } = usePermissions();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isWelcomeStep, setIsWelcomeStep] = useState(true);

  // Filter steps based on user's permissions
  const filteredSteps = useMemo(() => {
    return ONBOARDING_STEPS.filter(step => {
      if (!step.requiredPermission) return true;
      return hasPermission(step.requiredPermission);
    });
  }, [hasPermission]);

  // Get role info
  const roleInfo = useMemo(() => {
    return ROLE_DESCRIPTIONS[role] || ROLE_DESCRIPTIONS.member;
  }, [role]);
  
  // Check if onboarding should be shown (first-time user)
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!company?.id || isPermissionsLoading) return;
      
      // Check localStorage for onboarding completion
      const completedOnboarding = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      const onboardedUserId = localStorage.getItem(ONBOARDING_USER_KEY);
      
      // Show onboarding if not completed or if it's a different company
      if (!completedOnboarding || onboardedUserId !== company.id) {
        setShowOnboarding(true);
        setIsWelcomeStep(true);
        setCurrentStep(0);
      }
    };
    
    checkOnboardingStatus();
  }, [company?.id, isPermissionsLoading]);

  const startTour = useCallback(() => {
    setIsWelcomeStep(false);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < filteredSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, filteredSteps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < filteredSteps.length) {
      setCurrentStep(step);
    }
  }, [filteredSteps.length]);

  const completeTour = useCallback(() => {
    if (company?.id) {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      localStorage.setItem(ONBOARDING_USER_KEY, company.id);
    }
    setShowOnboarding(false);
  }, [company?.id]);

  const skipTour = useCallback((dontShowAgain: boolean = false) => {
    if (dontShowAgain) {
      completeTour();
    } else {
      // Just hide for this session without persisting
      setShowOnboarding(false);
    }
  }, [completeTour]);

  const resetTour = useCallback(() => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    localStorage.removeItem(ONBOARDING_USER_KEY);
    setShowOnboarding(true);
    setIsWelcomeStep(true);
    setCurrentStep(0);
  }, []);

  return {
    showOnboarding,
    currentStep,
    isWelcomeStep,
    totalSteps: filteredSteps.length,
    currentStepData: filteredSteps[currentStep],
    steps: filteredSteps,
    role,
    roleInfo,
    startTour,
    nextStep,
    prevStep,
    goToStep,
    completeTour,
    skipTour,
    resetTour
  };
};
