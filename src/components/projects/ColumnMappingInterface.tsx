
import React from 'react';
import { Button } from '@/components/ui/button';
import { ColumnMappingCard } from './columnMapping/ColumnMappingCard';
import { DataPreviewCard } from './columnMapping/DataPreviewCard';
import { MappingStatusCard } from './columnMapping/MappingStatusCard';
import { ColumnMappingHeader } from './columnMapping/ColumnMappingHeader';
import { useColumnMapping } from './columnMapping/useColumnMapping';
import type { ColumnMappingInterfaceProps } from './columnMapping/types';

export const ColumnMappingInterface: React.FC<ColumnMappingInterfaceProps> = ({
  headers,
  sampleData,
  onMappingComplete,
  onCancel
}) => {
  const {
    mapping,
    handleMappingChange,
    validateMapping,
    downloadTemplate
  } = useColumnMapping();

  const handleComplete = () => {
    if (validateMapping()) {
      onMappingComplete(mapping);
    }
  };

  return (
    <div className="space-y-6">
      <ColumnMappingHeader onDownloadTemplate={downloadTemplate} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ColumnMappingCard
          headers={headers}
          mapping={mapping}
          onMappingChange={handleMappingChange}
        />
        <DataPreviewCard
          headers={headers}
          sampleData={sampleData}
          mapping={mapping}
        />
      </div>

      <MappingStatusCard mapping={mapping} />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Back
        </Button>
        <Button onClick={handleComplete}>
          Start Import
        </Button>
      </div>
    </div>
  );
};
