
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, Download } from 'lucide-react';

interface ImportUploadStepProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
}

export const ImportUploadStep: React.FC<ImportUploadStepProps> = ({
  onFileUpload,
  onDownloadTemplate
}) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Upload an Excel file containing project data. For best results, use our template or ensure your columns match the expected format.
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
            onChange={onFileUpload}
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
