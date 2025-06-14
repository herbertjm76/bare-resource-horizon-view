
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { ExcelProcessor } from './services/ExcelProcessor';
import { ColumnMappingInterface } from './ColumnMappingInterface';
import { ImportProgressTracker } from './ImportProgressTracker';
import { toast } from 'sonner';

interface ExcelImportDialogProps {
  onImportComplete: () => void;
}

type ImportStep = 'upload' | 'mapping' | 'progress' | 'complete';

export const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({
  onImportComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [excelData, setExcelData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [importProgress, setImportProgress] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const processor = new ExcelProcessor();
      const result = await processor.parseExcelFile(file);
      
      setExcelData(result.data);
      setHeaders(result.headers);
      setCurrentStep('mapping');
      toast.success('Excel file uploaded successfully');
    } catch (error) {
      toast.error('Failed to parse Excel file');
      console.error('Excel parsing error:', error);
    }
  };

  const handleMappingComplete = (mapping: Record<string, string>) => {
    setColumnMapping(mapping);
    setCurrentStep('progress');
    startImport(mapping);
  };

  const startImport = async (mapping: Record<string, string>) => {
    try {
      const processor = new ExcelProcessor();
      const result = await processor.importProjects(excelData, mapping, (progress) => {
        setImportProgress(progress);
      });

      setImportErrors(result.errors);
      
      if (result.success) {
        setCurrentStep('complete');
        toast.success(`Successfully imported ${result.successCount} projects`);
        onImportComplete();
      } else {
        toast.error('Import completed with errors');
      }
    } catch (error) {
      toast.error('Import failed');
      console.error('Import error:', error);
    }
  };

  const resetDialog = () => {
    setCurrentStep('upload');
    setExcelData([]);
    setHeaders([]);
    setColumnMapping({});
    setImportProgress(0);
    setImportErrors([]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetDialog, 300); // Reset after dialog closes
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Projects from Excel
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'upload' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Upload an Excel file containing project data. The file should include columns for project information like name, code, status, etc.
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Upload Excel File</p>
                <p className="text-sm text-gray-500">
                  Supported formats: .xlsx, .xls
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
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
        )}

        {currentStep === 'mapping' && (
          <ColumnMappingInterface
            headers={headers}
            sampleData={excelData.slice(0, 3)}
            onMappingComplete={handleMappingComplete}
            onCancel={() => setCurrentStep('upload')}
          />
        )}

        {currentStep === 'progress' && (
          <ImportProgressTracker
            progress={importProgress}
            errors={importErrors}
          />
        )}

        {currentStep === 'complete' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="text-green-600 text-lg font-semibold mb-2">
                Import Complete!
              </div>
              <p className="text-gray-600">
                Your projects have been successfully imported.
              </p>
              {importErrors.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <p className="font-medium text-yellow-800">
                    {importErrors.length} rows had issues:
                  </p>
                  <ul className="mt-2 text-left text-yellow-700">
                    {importErrors.slice(0, 5).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {importErrors.length > 5 && (
                      <li>• And {importErrors.length - 5} more...</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
