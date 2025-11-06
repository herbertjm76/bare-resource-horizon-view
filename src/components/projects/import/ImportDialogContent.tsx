import React from 'react';
import { ImportProgressTracker } from '../ImportProgressTracker';
import { ImportUploadStep } from './ImportUploadStep';
import { ImportCompleteStep } from './ImportCompleteStep';
import { DetectionTypeStep } from './DetectionTypeStep';
import { DetectionReviewStep } from './DetectionReviewStep';
import { useExcelImport } from './useExcelImport';

interface ImportDialogContentProps {
  onComplete: () => void;
}

export const ImportDialogContent: React.FC<ImportDialogContentProps> = ({
  onComplete
}) => {
  const {
    currentStep,
    detectionType,
    detectionResult,
    importProgress,
    importErrors,
    importWarnings,
    importSuggestions,
    handleFileUpload,
    handleDetection,
    refineDetection,
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

    case 'detection':
      return (
        <DetectionTypeStep
          onDetect={handleDetection}
          onCancel={() => setCurrentStep('upload')}
        />
      );

    case 'review':
      return detectionResult ? (
        <DetectionReviewStep
          detectionType={detectionType}
          detected={detectionResult.detected}
          confidence={detectionResult.confidence}
          location={detectionResult.location}
          onConfirm={confirmAndImport}
          onCancel={() => setCurrentStep('detection')}
          onRefine={refineDetection}
        />
      ) : null;

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
