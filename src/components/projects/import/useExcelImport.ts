
import { useState } from 'react';
import { ExcelProcessor } from '../services/ExcelProcessor';
import { toast } from 'sonner';

type ImportStep = 'upload' | 'mapping' | 'progress' | 'complete';

export const useExcelImport = (onImportComplete: () => void) => {
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

  return {
    currentStep,
    excelData,
    headers,
    importProgress,
    importErrors,
    importWarnings,
    handleFileUpload,
    handleMappingComplete,
    downloadTemplate,
    resetDialog,
    setCurrentStep
  };
};
