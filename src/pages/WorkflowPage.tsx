import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { ProcessDiagram } from '@/components/workflow/ProcessDiagram';

export const WorkflowPage: React.FC = () => {
  return (
    <StandardLayout title="Getting Started - App Workflow">
      <ProcessDiagram />
    </StandardLayout>
  );
};