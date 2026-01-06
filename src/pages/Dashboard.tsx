
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLoading } from './dashboard/components/DashboardLoading';
import { DashboardLayout } from './dashboard/components/DashboardLayout';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { OnboardingTour } from '@/components/onboarding';
import { useCompany } from '@/context/CompanyContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { supabase } from '@/integrations/supabase/client';

const Dashboard: React.FC = () => {
  const { loading } = useCompany();
  const { profile: demoProfile, isDemoMode } = useDemoAuth();
  const [userName, setUserName] = useState<string | undefined>(undefined);

  // Fetch the real user's name for onboarding
  useEffect(() => {
    if (isDemoMode) {
      setUserName(demoProfile?.first_name || undefined);
      return;
    }

    const fetchUserName = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.first_name) {
          setUserName(profile.first_name);
        }
      }
    };

    fetchUserName();
  }, [isDemoMode, demoProfile?.first_name]);

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <>
      <DemoModeIndicator />
      {/* Show onboarding tour for new users (skip in demo mode) */}
      {!isDemoMode && <OnboardingTour userName={userName} />}
      <DashboardLayout />
    </>
  );
};

export default Dashboard;
