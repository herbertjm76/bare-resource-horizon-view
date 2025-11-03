
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '@/context/CompanyContext';
import { useAuthorization } from '@/hooks/useAuthorization';
import { OfficeSettingsContent } from '@/components/settings/OfficeSettingsContent';
import { OfficeSettingsLoadingState } from '@/components/settings/OfficeSettingsLoadingState';
import { OfficeSettingsErrorState } from '@/components/settings/OfficeSettingsErrorState';

export const OfficeSettingsPageContent: React.FC = () => {
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
        isAuthorized={isAuthorized}
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

  return <OfficeSettingsContent onRefresh={handleRefresh} />;
};
