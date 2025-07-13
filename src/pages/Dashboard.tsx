
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useEnhancedDashboardAuth } from '@/hooks/useEnhancedDashboardAuth';
import { DashboardLoading } from './dashboard/components/DashboardLoading';
import { DashboardLayout } from './dashboard/components/DashboardLayout';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { useCompany } from '@/context/CompanyContext';

const Dashboard: React.FC = () => {
  const { loading } = useEnhancedDashboardAuth();
  const { isSubdomainMode } = useCompany();

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <>
      <DemoModeIndicator />
      <DashboardLayout />
    </>
  );
};

export default Dashboard;
