import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { usePermissions, type AppRole, type Permission } from '@/hooks/usePermissions';
import { supabase } from '@/integrations/supabase/client';

// Legacy keys (kept for backward compatibility / cleanup)
const LEGACY_ONBOARDING_STORAGE_KEY = 'onboarding_completed';
const LEGACY_ONBOARDING_USER_KEY = 'onboarding_user_id';

const dontShowAgainKey = (companyId: string, userId: string) =>
  `onboarding:dont_show_again:${companyId}:${userId}`;

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
  
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Fetch current user id (needed to persist "Don't show again" per user)
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!isMounted) return;
        setUserId(data.user?.id ?? null);
      } finally {
        if (isMounted) setIsUserLoading(false);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show onboarding unless user explicitly checked "Don't show again"
  useEffect(() => {
    if (!company?.id || isPermissionsLoading || isUserLoading || !userId) return;

    // Clean up legacy flags (older versions marked onboarding as "completed" too aggressively)
    localStorage.removeItem(LEGACY_ONBOARDING_STORAGE_KEY);
    localStorage.removeItem(LEGACY_ONBOARDING_USER_KEY);

    const dismissed = localStorage.getItem(dontShowAgainKey(company.id, userId)) === 'true';

    if (!dismissed) {
      setShowOnboarding(true);
      setIsWelcomeStep(true);
      setCurrentStep(0);
    }
  }, [company?.id, isPermissionsLoading, isUserLoading, userId]);

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
    setShowOnboarding(false);
  }, []);

  const skipTour = useCallback((dontShowAgain: boolean = false) => {
    if (dontShowAgain && company?.id && userId) {
      localStorage.setItem(dontShowAgainKey(company.id, userId), 'true');
    }
    setShowOnboarding(false);
  }, [company?.id, userId]);

  const resetTour = useCallback(() => {
    if (company?.id && userId) {
      localStorage.removeItem(dontShowAgainKey(company.id, userId));
    }
    localStorage.removeItem(LEGACY_ONBOARDING_STORAGE_KEY);
    localStorage.removeItem(LEGACY_ONBOARDING_USER_KEY);
    setShowOnboarding(true);
    setIsWelcomeStep(true);
    setCurrentStep(0);
  }, [company?.id, userId]);

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
