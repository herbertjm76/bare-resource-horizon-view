
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ImportUploadStepProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, orientation: 'columns' | 'rows') => void;
  onDownloadTemplate: () => void;
}

export const ImportUploadStep: React.FC<ImportUploadStepProps> = ({
  onFileUpload,
  onDownloadTemplate
}) => {
  const [orientation, setOrientation] = useState<'columns' | 'rows'>('columns');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload(event, orientation);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Upload an Excel file containing project data. For best results, use our template or ensure your data format matches.
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-sm font-medium mb-3 block">Data Orientation</Label>
        <RadioGroup value={orientation} onValueChange={(v) => setOrientation(v as 'columns' | 'rows')}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="columns" id="columns" />
            <Label htmlFor="columns" className="font-normal cursor-pointer">
              Columns (Standard) - Headers in first row, data below
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rows" id="rows" />
            <Label htmlFor="rows" className="font-normal cursor-pointer">
              Rows (Transposed) - Headers in first column, data to the right
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-center mb-4">
        <Button
          variant="outline"
          onClick={onDownloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Upload Excel File</p>
          <p className="text-sm text-gray-500">
            Supported formats: .xlsx, .xls, .csv
          </p>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
            id="excel-upload"
          />
          <label htmlFor="excel-upload">
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </span>
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
};
