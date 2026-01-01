
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '@/context/CompanyContext';
import { useAuthorization } from '@/hooks/useAuthorization';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { OfficeSettingsContent } from '@/components/settings/OfficeSettingsContent';
import { OfficeSettingsLoadingState } from '@/components/settings/OfficeSettingsLoadingState';
import { OfficeSettingsErrorState } from '@/components/settings/OfficeSettingsErrorState';
import { logger } from '@/utils/logger';

export const OfficeSettingsPageContent: React.FC = () => {
  const { company, loading: companyLoading, refreshCompany, error: companyError } = useCompany();
  const navigate = useNavigate();
  const { isDemoMode } = useDemoAuth();
  const { loading: authLoading, error: authError, isAuthorized } = useAuthorization({
    requiredRole: ['owner', 'admin'], 
    redirectTo: '/dashboard',
    recheckOnFocus: false,
  });
  
  // In demo mode, skip authorization check
  const effectiveIsAuthorized = isDemoMode || isAuthorized;
  const isLoading = !isDemoMode && ((!isAuthorized && authLoading) || (companyLoading && !company));
  const error = isDemoMode ? null : (authError || companyError);
  
  const handleRefresh = () => {
    logger.debug('Manually refreshing company data from OfficeSettings');
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

  if (!isLoading && (!effectiveIsAuthorized || (!isDemoMode && !company))) {
    return (
      <OfficeSettingsErrorState
        isAuthorized={effectiveIsAuthorized}
        onNavigateToDashboard={handleNavigateToDashboard}
        onRefresh={handleRefresh}
      />
    );
  }

  return <OfficeSettingsContent onRefresh={handleRefresh} />;
};
