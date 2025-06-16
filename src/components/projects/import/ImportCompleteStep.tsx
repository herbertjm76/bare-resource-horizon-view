
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImportCompleteStepProps {
  importErrors: string[];
  importWarnings: string[];
  onClose: () => void;
}

export const ImportCompleteStep: React.FC<ImportCompleteStepProps> = ({
  importErrors,
  importWarnings,
  onClose
}) => {
  return (
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
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
