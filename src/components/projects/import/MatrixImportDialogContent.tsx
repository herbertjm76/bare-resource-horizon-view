import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Calendar } from 'lucide-react';
import { useMatrixImport } from './useMatrixImport';

interface MatrixImportDialogContentProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export const MatrixImportDialogContent: React.FC<MatrixImportDialogContentProps> = ({
  onComplete,
  onCancel
}) => {
  const {
    step,
    matrixData,
    weekStartDate,
    setWeekStartDate,
    progress,
    errors,
    warnings,
    suggestions,
    handleFileUpload,
    startImport,
    resetDialog
  } = useMatrixImport(onComplete);

  const renderUploadStep = () => (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Upload your project matrix Excel file</p>
            <p className="text-sm">AI will automatically detect the structure, including project codes, people names, and allocations.</p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <Label htmlFor="matrix-upload" className="cursor-pointer">
          <span className="text-sm font-medium">Click to upload matrix file</span>
          <Input
            id="matrix-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </Label>
        <p className="text-xs text-muted-foreground mt-2">
          Supports Excel (.xlsx, .xls) files
        </p>
      </div>
    </div>
  );

  const renderPreviewStep = () => {
    const structure = matrixData?.detectedStructure;
    const columnLetter = (idx: number) => String.fromCharCode(65 + idx);

    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-primary text-xl">✓</span>
                <strong>AI Detection Complete</strong>
              </div>
              
              {structure && (
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Detected Structure:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• People names in <strong>Row {structure.peopleRow + 1}</strong>, starting from <strong>Column {columnLetter(structure.peopleStartColumn)}</strong></li>
                    <li>• Project codes in <strong>Column {columnLetter(structure.projectColumn)}</strong></li>
                    <li>• Status in <strong>Column {columnLetter(structure.statusColumn)}</strong></li>
                    <li>• FTE in <strong>Column {columnLetter(structure.fteColumn)}</strong></li>
                    <li>• Data starts at <strong>Row {structure.dataStartRow + 1}</strong></li>
                  </ul>
                </div>
              )}

              <div className="pt-2 border-t">
                <p className="text-sm">
                  Found <strong>{matrixData?.projects.length}</strong> projects and <strong>{matrixData?.people.length}</strong> people
                </p>
                {matrixData?.people && matrixData.people.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    People: {matrixData.people.slice(0, 5).join(', ')}
                    {matrixData.people.length > 5 && ` and ${matrixData.people.length - 5} more`}
                  </p>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="week-start">Week Start Date</Label>
          <div className="flex gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-2" />
            <Input
              id="week-start"
              type="date"
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Allocations will be recorded for the week starting on this date
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => resetDialog()} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={startImport} className="flex-1">
            Looks Good - Import
          </Button>
        </div>
      </div>
    );
  };

  const renderProgressStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Importing projects and allocations...</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-4">
      {suggestions.length > 0 && (
        <Alert>
          <AlertDescription>
            <ul className="list-disc ml-4 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert>
          <AlertDescription>
            <strong>Warnings:</strong>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <strong>Errors:</strong>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={onCancel} className="w-full">
        Close
      </Button>
    </div>
  );

  return (
    <>
      {step === 'upload' && renderUploadStep()}
      {step === 'preview' && renderPreviewStep()}
      {step === 'progress' && renderProgressStep()}
      {step === 'complete' && renderCompleteStep()}
    </>
  );
};
