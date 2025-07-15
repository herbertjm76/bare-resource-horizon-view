
import React from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLoading } from './dashboard/components/DashboardLoading';
import { DashboardLayout } from './dashboard/components/DashboardLayout';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { useCompany } from '@/context/CompanyContext';

const Dashboard: React.FC = () => {
  const { loading } = useCompany();

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
