
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

interface ImportProgressTrackerProps {
  progress: number;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

export const ImportProgressTracker: React.FC<ImportProgressTrackerProps> = ({
  progress,
  errors,
  warnings,
  suggestions = []
}) => {
  const isComplete = progress === 100;

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold mb-2">
          {isComplete ? 'Import Complete' : 'Importing Projects...'}
        </h3>
        <Progress value={progress} className="w-full mb-2" />
        <p className="text-sm text-gray-600">{progress.toFixed(0)}% complete</p>
      </div>

      {isComplete && (
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <h4 className="font-medium text-red-800">
                  Errors ({errors.length})
                </h4>
              </div>
              <ul className="space-y-1 text-sm text-red-700">
                {errors.slice(0, 5).map((error, index) => (
                  <li key={index} className="break-words">{error}</li>
                ))}
                {errors.length > 5 && (
                  <li className="font-medium">
                    ... and {errors.length - 5} more errors
                  </li>
                )}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <h4 className="font-medium text-yellow-800">
                  Warnings ({warnings.length})
                </h4>
              </div>
              <ul className="space-y-1 text-sm text-yellow-700">
                {warnings.slice(0, 5).map((warning, index) => (
                  <li key={index} className="break-words">{warning}</li>
                ))}
                {warnings.length > 5 && (
                  <li className="font-medium">
                    ... and {warnings.length - 5} more warnings
                  </li>
                )}
              </ul>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-blue-800">
                  Suggestions ({suggestions.length})
                </h4>
              </div>
              <ul className="space-y-1 text-sm text-blue-700">
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <li key={index} className="break-words">{suggestion}</li>
                ))}
                {suggestions.length > 5 && (
                  <li className="font-medium">
                    ... and {suggestions.length - 5} more suggestions
                  </li>
                )}
              </ul>
            </div>
          )}

          {errors.length === 0 && warnings.length === 0 && suggestions.length === 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">
                  All projects imported successfully!
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
