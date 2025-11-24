
import { useState } from 'react';
import { ExcelProcessor } from '../services/ExcelProcessor';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type ImportStep = 'upload' | 'detection' | 'review' | 'preview' | 'progress' | 'complete';

interface DetectionResult {
  detected: any[];
  confidence: number;
  location: string;
}

export const useExcelImport = (onImportComplete: () => void) => {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [excelData, setExcelData] = useState<any[]>([]);
  const [detectionType, setDetectionType] = useState<'people' | 'projects'>('projects');
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [importSuggestions, setImportSuggestions] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, orientation: 'columns' | 'rows' = 'columns') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast.info('Parsing Excel file...');
      const processor = new ExcelProcessor();
      const result = await processor.parseExcelFile(file, { orientation });
      
      setExcelData(result.data);
      setCurrentStep('detection');
      toast.success('File parsed successfully');
    } catch (error) {
      toast.error('Failed to parse Excel file');
      console.error('Excel parsing error:', error);
    }
  };

  const handleDetection = async (type: 'people' | 'projects', examples: string[], explanation: string) => {
    setDetectionType(type);
    toast.info('AI analyzing data...');

    try {
      const { data: aiResult, error } = await supabase.functions.invoke('import-excel-ai', {
        body: { 
          detectionType: type,
          examples,
          explanation,
          allData: excelData
        }
      });

      if (error || !aiResult) {
        toast.error('AI detection failed. Please try again.');
        console.error('AI detection error:', error);
        return;
      }

      setDetectionResult({
        detected: aiResult.detected || [],
        confidence: aiResult.confidence || 0,
        location: aiResult.location || 'Unknown location'
      });

      toast.success(`Detected ${aiResult.detected?.length || 0} items`);
      setCurrentStep('review');
    } catch (error) {
      toast.error('Failed to analyze data');
      console.error('Detection error:', error);
    }
  };

  const refineDetection = async (message: string, currentList: any[]) => {
    const { data: aiResult, error } = await supabase.functions.invoke('refine-detection', {
      body: { 
        detectionType,
        message,
        currentList,
        allData: excelData
      }
    });

    if (error || !aiResult) {
      throw new Error('Failed to refine detection');
    }

    return {
      detected: aiResult.detected || currentList,
      message: aiResult.message || 'Updated the list based on your request.'
    };
  };

  const proceedToPreview = (finalList: any[]) => {
    setDetectionResult({
      detected: finalList,
      confidence: detectionResult?.confidence || 0,
      location: detectionResult?.location || 'Unknown'
    });
    setCurrentStep('preview');
  };

  const confirmAndImport = async (finalList: any[]) => {
    setCurrentStep('progress');
    toast.info('Starting import...');
    
    try {
      let result;
      
      if (detectionType === 'projects') {
        const processor = new ExcelProcessor();
        
        // Convert object data to array format for importer
        const keys = finalList.length > 0 ? Object.keys(finalList[0]) : [];
        const arrayData = finalList.map(obj => keys.map(key => obj[key]));
        
        // Create column mapping
        const columnMapping: Record<string, string> = {};
        keys.forEach((key, index) => {
          columnMapping[index.toString()] = key;
        });
        
        result = await processor.importProjects(
          arrayData,
          columnMapping,
          (progress) => setImportProgress(progress)
        );
      } else {
        const { TeamExcelProcessor } = await import('@/components/team/services/TeamExcelProcessor');
        const processor = new TeamExcelProcessor();
        
        // Convert object data to array format for importer
        const keys = finalList.length > 0 ? Object.keys(finalList[0]) : [];
        const arrayData = finalList.map(obj => keys.map(key => obj[key]));
        
        // Create column mapping
        const columnMapping: Record<string, string> = {};
        keys.forEach((key, index) => {
          columnMapping[index.toString()] = key;
        });
        
        result = await processor.importTeamMembers(
          arrayData,
          columnMapping,
          (progress) => setImportProgress(progress)
        );
      }
      
      // Store the results
      setImportErrors(result.errors || []);
      setImportWarnings(result.warnings || []);
      setImportSuggestions(result.suggestions || []);
      
      setCurrentStep('complete');
      
      if (result.success && result.imported > 0) {
        toast.success(`Successfully imported ${result.imported} ${detectionType}`);
        onImportComplete();
      } else if (result.errors.length > 0) {
        toast.error('Import completed with errors');
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportErrors([error instanceof Error ? error.message : 'Unknown error occurred']);
      toast.error('Import failed');
      setCurrentStep('complete');
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
    setDetectionResult(null);
    setImportProgress(0);
    setImportErrors([]);
    setImportWarnings([]);
    setImportSuggestions([]);
  };

  return {
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
    resetDialog,
    setCurrentStep
  };
};
