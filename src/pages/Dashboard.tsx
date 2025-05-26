
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDashboardAuth } from './dashboard/hooks/useDashboardAuth';
import { DashboardLoading } from './dashboard/components/DashboardLoading';
import { DashboardLayout } from './dashboard/components/DashboardLayout';
import { useCompany } from '@/context/CompanyContext';

const Dashboard: React.FC = () => {
  const { loading } = useDashboardAuth();
  const { isSubdomainMode } = useCompany();

  if (loading) {
    return <DashboardLoading />;
  }

  return <DashboardLayout />;
};

export default Dashboard;
