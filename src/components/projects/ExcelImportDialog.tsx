
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, Download } from 'lucide-react';
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
  const [importWarnings, setImportWarnings] = useState<string[]>([]);

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
      setImportWarnings(result.warnings || []);
      
      if (result.success) {
        setCurrentStep('complete');
        toast.success(`Successfully imported ${result.successCount} projects`);
        onImportComplete();
      } else {
        setCurrentStep('complete');
        if (result.successCount > 0) {
          toast.warning(`Imported ${result.successCount} projects with ${result.errors.length} errors`);
        } else {
          toast.error('Import failed');
        }
      }
    } catch (error) {
      toast.error('Import failed');
      console.error('Import error:', error);
    }
  };

  const downloadTemplate = () => {
    const processor = new ExcelProcessor();
    const csvContent = processor.generateTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  const resetDialog = () => {
    setCurrentStep('upload');
    setExcelData([]);
    setHeaders([]);
    setColumnMapping({});
    setImportProgress(0);
    setImportErrors([]);
    setImportWarnings([]);
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
              Upload an Excel file containing project data. For best results, use our template or ensure your columns match the expected format.
            </div>
            
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                onClick={downloadTemplate}
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
            warnings={importWarnings}
          />
        )}

        {currentStep === 'complete' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className={`text-lg font-semibold mb-2 ${
                importErrors.length > 0 ? 'text-red-600' : 
                importWarnings.length > 0 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                Import Complete!
              </div>
              <p className="text-gray-600">
                Your projects have been processed.
              </p>
              {(importErrors.length > 0 || importWarnings.length > 0) && (
                <div className="mt-4 space-y-2">
                  {importErrors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                      <p className="font-medium text-red-800">
                        {importErrors.length} rows had errors
                      </p>
                    </div>
                  )}
                  {importWarnings.length > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <p className="font-medium text-yellow-800">
                        {importWarnings.length} rows had warnings
                      </p>
                    </div>
                  )}
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
