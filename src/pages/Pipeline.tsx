import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Layers } from 'lucide-react';
import { PipelineKanbanBoard } from '@/components/pipeline/PipelineKanbanBoard';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';

const Pipeline: React.FC = () => {
  return (
    <StandardLayout>
      <StandardizedPageHeader
        title="Pipeline"
        description="Track projects through their lifecycle stages"
        icon={Layers}
      />
      
      <OfficeSettingsProvider>
        <div className="px-6 py-6">
          <PipelineKanbanBoard />
        </div>
      </OfficeSettingsProvider>
    </StandardLayout>
  );
};

export default Pipeline;
