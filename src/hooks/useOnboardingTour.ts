import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/context/CompanyContext';

const ONBOARDING_STORAGE_KEY = 'onboarding_completed';
const ONBOARDING_USER_KEY = 'onboarding_user_id';

export interface OnboardingTourStep {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
}

export const ONBOARDING_STEPS: OnboardingTourStep[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your central command center. Get a quick overview of team utilization, active projects, and key metrics at a glance.',
    route: '/dashboard',
    icon: 'LayoutDashboard'
  },
  {
    id: 'weekly-overview',
    title: 'Weekly Overview',
    description: 'See your team\'s week at a glance. Track leave, holidays, announcements, and custom cards for the current week.',
    route: '/weekly-overview',
    icon: 'Calendar'
  },
  {
    id: 'resource-scheduling',
    title: 'Resource Scheduling',
    description: 'The heart of resource management. Allocate team members to projects, manage workloads, and ensure optimal utilization.',
    route: '/resource-scheduling',
    icon: 'CalendarClock'
  },
  {
    id: 'projects',
    title: 'All Projects',
    description: 'Manage your project portfolio. Create, edit, and track all your projects with their stages, budgets, and team assignments.',
    route: '/projects',
    icon: 'FolderKanban'
  },
  {
    id: 'team-members',
    title: 'Team Members',
    description: 'Your people hub. View and manage team profiles, roles, capacities, and organizational structure.',
    route: '/team-members',
    icon: 'Users'
  }
];

export const useOnboardingTour = () => {
  const { company } = useCompany();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isWelcomeStep, setIsWelcomeStep] = useState(true);
  
  // Check if onboarding should be shown (first-time user)
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!company?.id) return;
      
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
  }, [company?.id]);

  const startTour = useCallback(() => {
    setIsWelcomeStep(false);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < ONBOARDING_STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  const completeTour = useCallback(() => {
    if (company?.id) {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      localStorage.setItem(ONBOARDING_USER_KEY, company.id);
    }
    setShowOnboarding(false);
  }, [company?.id]);

  const skipTour = useCallback(() => {
    completeTour();
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
    totalSteps: ONBOARDING_STEPS.length,
    currentStepData: ONBOARDING_STEPS[currentStep],
    steps: ONBOARDING_STEPS,
    startTour,
    nextStep,
    prevStep,
    goToStep,
    completeTour,
    skipTour,
    resetTour
  };
};
