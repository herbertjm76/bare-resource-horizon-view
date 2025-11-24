
import React, { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTeamExcelImport } from './useTeamExcelImport';
import { TeamColumnMappingInterface } from '../columnMapping/TeamColumnMappingInterface';

interface TeamImportDialogContentProps {
  onComplete: () => void;
}

export const TeamImportDialogContent: React.FC<TeamImportDialogContentProps> = ({ onComplete }) => {
  const [orientation, setOrientation] = useState<'columns' | 'rows'>('columns');

  const {
    step,
    headers,
    columnMapping,
    progress,
    errors,
    warnings,
    suggestions,
    handleFileUpload,
    handleMappingComplete,
    resetDialog
  } = useTeamExcelImport(onComplete);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event, orientation);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Import Team Members from Excel
        </DialogTitle>
        <DialogDescription>
          Upload an Excel file with team member information to pre-register them
        </DialogDescription>
      </DialogHeader>

      {step === 'upload' && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-muted/30">
            <Label className="text-sm font-medium mb-3 block">Data Orientation</Label>
            <RadioGroup value={orientation} onValueChange={(v) => setOrientation(v as 'columns' | 'rows')}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="columns" id="team-columns" />
                <Label htmlFor="team-columns" className="font-normal cursor-pointer">
                  Columns (Standard) - Headers in first row, data below
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rows" id="team-rows" />
                <Label htmlFor="team-rows" className="font-normal cursor-pointer">
                  Rows (Transposed) - Headers in first column, data to the right
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Upload an Excel file (.xlsx) with team member data
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="team-excel-upload"
            />
            <label htmlFor="team-excel-upload">
              <Button asChild>
                <span>Select Excel File</span>
              </Button>
            </label>
          </div>
          <Alert>
            <AlertDescription>
              Expected columns: First Name, Last Name, Email, Job Title, Department, Location, Weekly Capacity, Role
            </AlertDescription>
          </Alert>
        </div>
      )}

      {step === 'mapping' && (
        <TeamColumnMappingInterface
          headers={headers}
          sampleData={[]}
          onMappingComplete={handleMappingComplete}
          onCancel={resetDialog}
          initialMapping={columnMapping}
        />
      )}

      {step === 'progress' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Importing team members...</p>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="space-y-4">
          {suggestions.length > 0 && (
            <Alert>
              <AlertDescription>
                {suggestions.map((s, i) => (
                  <div key={i}>{s}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}
          
          {warnings.length > 0 && (
            <Alert>
              <AlertDescription>
                <strong>Warnings:</strong>
                {warnings.map((w, i) => (
                  <div key={i} className="text-sm">{w}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}
          
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Errors:</strong>
                {errors.map((e, i) => (
                  <div key={i} className="text-sm">{e}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}
          
          <Button onClick={resetDialog} className="w-full">
            Import Another File
          </Button>
        </div>
      )}
    </>
  );
};
