
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ColumnMappingCard } from './columnMapping/ColumnMappingCard';
import { DataPreviewCard } from './columnMapping/DataPreviewCard';
import { MappingStatusCard } from './columnMapping/MappingStatusCard';
import { ColumnMappingHeader } from './columnMapping/ColumnMappingHeader';
import { AIMapping } from './columnMapping/AIMapping';
import { useColumnMapping } from './columnMapping/useColumnMapping';
import { useAIMapping } from './columnMapping/useAIMapping';
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

  const { isLoadingAI, aiSuggestions, aiConfidence, getAISuggestions } = useAIMapping();

  const handleAISuggestions = async () => {
    const result = await getAISuggestions(headers, sampleData);
    if (result && result.mappings) {
      // Apply AI mappings
      Object.entries(result.mappings).forEach(([columnIndex, targetField]) => {
        handleMappingChange(columnIndex, targetField);
      });
    }
  };

  // Auto-trigger AI suggestions on mount
  useEffect(() => {
    if (headers.length > 0 && sampleData.length > 0) {
      handleAISuggestions();
    }
  }, []);

  const handleComplete = () => {
    if (validateMapping()) {
      onMappingComplete(mapping);
    }
  };

  return (
    <div className="space-y-6">
      <ColumnMappingHeader onDownloadTemplate={downloadTemplate} />

      <AIMapping 
        onGetAISuggestions={handleAISuggestions}
        isLoading={isLoadingAI}
        suggestions={aiSuggestions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ColumnMappingCard
          headers={headers}
          mapping={mapping}
          onMappingChange={handleMappingChange}
          confidence={aiConfidence}
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
