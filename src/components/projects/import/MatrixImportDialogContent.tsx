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

  const renderPreviewStep = () => (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <strong>AI Analysis Complete</strong>
            </div>
            <div className="text-sm space-y-1">
              <p>Found <strong>{matrixData?.projects.length}</strong> projects and <strong>{matrixData?.people.length}</strong> people</p>
              {matrixData?.dateRange && <p>Date range: {matrixData.dateRange}</p>}
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {matrixData && matrixData.people.length > 0 && (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2 text-sm">Detected People:</h4>
          <div className="flex flex-wrap gap-2">
            {matrixData.people.map((person, idx) => (
              <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                {person}
              </span>
            ))}
          </div>
        </div>
      )}

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

      {matrixData && (
        <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
          <h4 className="font-medium mb-2">Projects to Import:</h4>
          <ul className="text-sm space-y-1">
            {matrixData.projects.slice(0, 10).map((project, idx) => (
              <li key={idx} className="flex justify-between">
                <span className="font-mono text-xs">{project.code}</span>
                <span className="truncate ml-2">{project.name}</span>
                <span className="text-muted-foreground ml-2">
                  ({Object.keys(project.allocations).length} allocations)
                </span>
              </li>
            ))}
            {matrixData.projects.length > 10 && (
              <li className="text-muted-foreground">
                ... and {matrixData.projects.length - 10} more
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={() => resetDialog()} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button onClick={startImport} className="flex-1">
          Confirm & Import
        </Button>
      </div>
    </div>
  );

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
