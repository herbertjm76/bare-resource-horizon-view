
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';

export const DashboardLayout: React.FC = () => {
  return (
    <StandardLayout>
      <DashboardMetrics />
    </StandardLayout>
  );
};
