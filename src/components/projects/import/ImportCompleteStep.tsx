
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

interface ImportCompleteStepProps {
  importErrors: string[];
  importWarnings: string[];
  importSuggestions?: string[];
  onClose: () => void;
}

export const ImportCompleteStep: React.FC<ImportCompleteStepProps> = ({
  importErrors,
  importWarnings,
  importSuggestions = [],
  onClose
}) => {
  const hasErrors = importErrors.length > 0;
  const hasWarnings = importWarnings.length > 0;
  const hasSuggestions = importSuggestions.length > 0;

  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <div className={`text-lg font-semibold mb-2 ${
          hasErrors ? 'text-red-600' : 
          hasWarnings ? 'text-yellow-600' : 'text-green-600'
        }`}>
          Import Complete!
        </div>
        <p className="text-muted-foreground">
          Your projects have been processed.
        </p>
        
        <div className="mt-6 space-y-4 max-h-80 overflow-y-auto">
          {hasErrors && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-left">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <p className="font-medium text-red-800">
                  {importErrors.length} rows had errors
                </p>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {importErrors.slice(0, 3).map((error, index) => (
                  <li key={index} className="break-words">{error}</li>
                ))}
                {importErrors.length > 3 && (
                  <li className="font-medium">... and {importErrors.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
          
          {hasWarnings && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-left">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="font-medium text-yellow-800">
                  {importWarnings.length} rows had warnings
                </p>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {importWarnings.slice(0, 3).map((warning, index) => (
                  <li key={index} className="break-words">{warning}</li>
                ))}
                {importWarnings.length > 3 && (
                  <li className="font-medium">... and {importWarnings.length - 3} more</li>
                )}
              </ul>
            </div>
          )}

          {hasSuggestions && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded text-left">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-600" />
                <p className="font-medium text-blue-800">
                  {importSuggestions.length} helpful suggestions
                </p>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                {importSuggestions.slice(0, 3).map((suggestion, index) => (
                  <li key={index} className="break-words">{suggestion}</li>
                ))}
                {importSuggestions.length > 3 && (
                  <li className="font-medium">... and {importSuggestions.length - 3} more</li>
                )}
              </ul>
            </div>
          )}

          {!hasErrors && !hasWarnings && !hasSuggestions && (
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">
                  All projects imported successfully!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
