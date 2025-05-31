
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '@/context/CompanyContext';
import { AppHeader } from '@/components/AppHeader';
import { useAuthorization } from '@/hooks/useAuthorization';
import { OfficeSettingsContent } from '@/components/settings/OfficeSettingsContent';
import { OfficeSettingsLoadingState } from '@/components/settings/OfficeSettingsLoadingState';
import { OfficeSettingsErrorState } from '@/components/settings/OfficeSettingsErrorState';

const HEADER_HEIGHT = 56;

const OfficeSettings = () => {
  const { company, loading: companyLoading, refreshCompany, error: companyError } = useCompany();
  const navigate = useNavigate();
  const { loading: authLoading, error: authError, isAuthorized } = useAuthorization({
    requiredRole: ['owner', 'admin'], 
    redirectTo: '/dashboard'
  });
  
  const isLoading = authLoading || companyLoading;
  const error = authError || companyError;
  
  const handleRefresh = () => {
    console.log('Manually refreshing company data from OfficeSettings');
    refreshCompany();
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <OfficeSettingsLoadingState 
        authLoading={authLoading} 
        error={error} 
      />
    );
  }

  if (!isLoading && (!isAuthorized || !company)) {
    return (
      <OfficeSettingsErrorState
        isAuthorized={isAuthorized}
        onNavigateToDashboard={handleNavigateToDashboard}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <OfficeSettingsContent onRefresh={handleRefresh} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default OfficeSettings;
