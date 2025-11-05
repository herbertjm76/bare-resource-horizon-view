
import { useState } from 'react';
import { toast } from 'sonner';
import { TeamExcelProcessor } from '../services/TeamExcelProcessor';
import { supabase } from '@/integrations/supabase/client';

type ImportStep = 'upload' | 'mapping' | 'progress' | 'complete';

export const useTeamExcelImport = (onComplete?: () => void) => {
  const [step, setStep] = useState<ImportStep>('upload');
  const [excelData, setExcelData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const processor = new TeamExcelProcessor();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await processor.parseExcelFile(file);
      setExcelData(result.data);
      setHeaders(result.headers);
      
      // Get AI suggestions for column mapping
      await getAISuggestions(result.headers, result.data.slice(0, 3));
      
      setStep('mapping');
    } catch (error) {
      toast.error('Failed to parse Excel file');
      console.error(error);
    }
  };

  const getAISuggestions = async (headers: string[], sampleData: any[][]) => {
    try {
      const { data, error } = await supabase.functions.invoke('import-team-excel-ai', {
        body: { headers, sampleData }
      });

      if (error) throw error;

      if (data?.mappings) {
        setColumnMapping(data.mappings);
      }
      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('AI mapping failed:', error);
      setSuggestions(['AI mapping unavailable. Please map columns manually.']);
    }
  };

  const handleMappingComplete = (mapping: Record<string, string>) => {
    setColumnMapping(mapping);
    startImport(mapping);
  };

  const startImport = async (mapping: Record<string, string>) => {
    setStep('progress');
    setProgress(0);
    
    try {
      const result = await processor.importTeamMembers(
        excelData,
        mapping,
        setProgress
      );

      setErrors(result.errors);
      setWarnings(result.warnings);
      setSuggestions(result.suggestions);
      
      if (result.success) {
        toast.success(`Imported ${result.imported} team member(s)`);
        if (result.warnings.length > 0) {
          toast.warning(`${result.warnings.length} warning(s)`);
        }
      } else {
        toast.error('Import failed');
      }
      
      setStep('complete');
      
      if (result.success && onComplete) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (error) {
      toast.error('Import failed');
      console.error(error);
      setErrors([error instanceof Error ? error.message : 'Unknown error']);
      setStep('complete');
    }
  };

  const resetDialog = () => {
    setStep('upload');
    setExcelData([]);
    setHeaders([]);
    setColumnMapping({});
    setProgress(0);
    setErrors([]);
    setWarnings([]);
    setSuggestions([]);
  };

  return {
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
  };
};
