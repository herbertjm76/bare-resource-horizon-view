import { useState } from 'react';
import { toast } from 'sonner';
import { MatrixParser, type MatrixParseResult } from '../services/matrixParser';
import { MatrixImporter } from '../services/matrixImporter';

type ImportStep = 'upload' | 'preview' | 'progress' | 'complete';

export const useMatrixImport = (onComplete?: () => void) => {
  const [step, setStep] = useState<ImportStep>('upload');
  const [matrixData, setMatrixData] = useState<MatrixParseResult | null>(null);
  const [weekStartDate, setWeekStartDate] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast.info('Parsing matrix file...');
      const result = await MatrixParser.parseMatrixFile(file);
      setMatrixData(result);
      
      // Set default week start date to today's Monday
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      setWeekStartDate(monday.toISOString().split('T')[0]);
      
      toast.success(`Found ${result.projects.length} projects and ${result.people.length} people`);
      setStep('preview');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse matrix file');
      console.error(error);
    }
  };

  const startImport = async () => {
    if (!matrixData) return;

    setStep('progress');
    setProgress(0);
    
    try {
      const result = await MatrixImporter.importMatrix(
        matrixData,
        weekStartDate,
        setProgress
      );

      setErrors(result.errors);
      setWarnings(result.warnings);
      setSuggestions(result.suggestions);
      
      if (result.success) {
        toast.success(`Imported ${result.successCount} project(s) with allocations`);
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
    setMatrixData(null);
    setWeekStartDate('');
    setProgress(0);
    setErrors([]);
    setWarnings([]);
    setSuggestions([]);
  };

  return {
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
  };
};
