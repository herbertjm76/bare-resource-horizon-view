
import { useState } from 'react';
import { ExcelProcessor } from '../services/ExcelProcessor';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type ImportStep = 'upload' | 'preview' | 'progress' | 'complete';

interface AIAnalysisResult {
  mapping: Record<string, string>;
  confidence: Record<string, number>;
  suggestions: string[];
}

export const useExcelImport = (onImportComplete: () => void) => {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [excelData, setExcelData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [importSuggestions, setImportSuggestions] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast.info('Analyzing Excel file with AI...');
      const processor = new ExcelProcessor();
      const result = await processor.parseExcelFile(file);
      
      setExcelData(result.data);
      setHeaders(result.headers);

      // Call AI to analyze structure
      const { data: aiResult, error } = await supabase.functions.invoke('import-excel-ai', {
        body: { 
          headers: result.headers,
          sampleData: result.data.slice(0, 3)
        }
      });

      if (error || !aiResult) {
        toast.error('AI analysis failed. Please try again.');
        console.error('AI analysis error:', error);
        return;
      }

      const detectedMapping: Record<string, string> = {};
      Object.entries(aiResult.mappings || {}).forEach(([colIdx, field]) => {
        detectedMapping[colIdx] = field as string;
      });

      setColumnMapping(detectedMapping);
      setAiAnalysis({
        mapping: detectedMapping,
        confidence: aiResult.confidence || {},
        suggestions: aiResult.suggestions || []
      });

      toast.success('AI analysis complete');
      setCurrentStep('preview');
    } catch (error) {
      toast.error('Failed to parse Excel file');
      console.error('Excel parsing error:', error);
    }
  };

  const confirmAndImport = () => {
    setCurrentStep('progress');
    startImport(columnMapping);
  };

  const startImport = async (mapping: Record<string, string>) => {
    try {
      const processor = new ExcelProcessor();
      const result = await processor.importProjects(excelData, mapping, (progress) => {
        setImportProgress(progress);
      });

      setImportErrors(result.errors);
      setImportWarnings(result.warnings || []);
      setImportSuggestions(result.suggestions || []);
      
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
    setImportSuggestions([]);
  };

  return {
    currentStep,
    excelData,
    headers,
    aiAnalysis,
    importProgress,
    importErrors,
    importWarnings,
    importSuggestions,
    handleFileUpload,
    confirmAndImport,
    downloadTemplate,
    resetDialog,
    setCurrentStep
  };
};
