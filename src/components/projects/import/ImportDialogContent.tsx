import React from 'react';
import { ImportProgressTracker } from '../ImportProgressTracker';
import { ImportUploadStep } from './ImportUploadStep';
import { ImportCompleteStep } from './ImportCompleteStep';
import { DetectionTypeStep } from './DetectionTypeStep';
import { DetectionReviewStep } from './DetectionReviewStep';
import { DataPreviewStep } from './DataPreviewStep';
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
    proceedToPreview,
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
          onConfirm={proceedToPreview}
          onCancel={() => setCurrentStep('detection')}
          onRefine={refineDetection}
        />
      ) : null;

    case 'preview':
      return detectionResult ? (
        <DataPreviewStep
          detectedData={detectionResult.detected}
          detectionType={detectionType}
          onConfirm={confirmAndImport}
          onBack={() => setCurrentStep('review')}
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
