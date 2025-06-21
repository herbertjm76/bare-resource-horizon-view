
import React from 'react';
import { ColumnMappingInterface } from '../ColumnMappingInterface';
import { ImportProgressTracker } from '../ImportProgressTracker';
import { ImportUploadStep } from './ImportUploadStep';
import { ImportCompleteStep } from './ImportCompleteStep';
import { useExcelImport } from './useExcelImport';

interface ImportDialogContentProps {
  onComplete: () => void;
}

export const ImportDialogContent: React.FC<ImportDialogContentProps> = ({
  onComplete
}) => {
  const {
    currentStep,
    excelData,
    headers,
    importProgress,
    importErrors,
    importWarnings,
    importSuggestions,
    handleFileUpload,
    handleMappingComplete,
    downloadTemplate,
    setCurrentStep
  } = useExcelImport(onComplete);

  switch (currentStep) {
    case 'upload':
      return (
        <ImportUploadStep
          onFileUpload={handleFileUpload}
          onDownloadTemplate={downloadTemplate}
        />
      );

    case 'mapping':
      return (
        <ColumnMappingInterface
          headers={headers}
          sampleData={excelData.slice(0, 3)}
          onMappingComplete={handleMappingComplete}
          onCancel={() => setCurrentStep('upload')}
        />
      );

    case 'progress':
      return (
        <ImportProgressTracker
          progress={importProgress}
          errors={importErrors}
          warnings={importWarnings}
          suggestions={importSuggestions}
        />
      );

    case 'complete':
      return (
        <ImportCompleteStep
          importErrors={importErrors}
          importWarnings={importWarnings}
          importSuggestions={importSuggestions}
          onClose={onComplete}
        />
      );

    default:
      return null;
  }
};
