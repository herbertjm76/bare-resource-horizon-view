import React from 'react';
import { ImportProgressTracker } from '../ImportProgressTracker';
import { ImportUploadStep } from './ImportUploadStep';
import { ImportCompleteStep } from './ImportCompleteStep';
import { ImportPreviewStep } from './ImportPreviewStep';
import { useExcelImport } from './useExcelImport';

interface ImportDialogContentProps {
  onComplete: () => void;
}

export const ImportDialogContent: React.FC<ImportDialogContentProps> = ({
  onComplete
}) => {
  const {
    currentStep,
    headers,
    aiAnalysis,
    importProgress,
    importErrors,
    importWarnings,
    importSuggestions,
    handleFileUpload,
    confirmAndImport,
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

    case 'preview':
      return (
        <ImportPreviewStep
          headers={headers}
          aiAnalysis={aiAnalysis}
          onConfirm={confirmAndImport}
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
