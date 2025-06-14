
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ImportProgressTrackerProps {
  progress: number;
  errors: string[];
}

export const ImportProgressTracker: React.FC<ImportProgressTrackerProps> = ({
  progress,
  errors
}) => {
  const isComplete = progress >= 100;
  const hasErrors = errors.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isComplete ? (
              hasErrors ? (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            )}
            Import Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {isComplete && (
            <div className={`p-3 rounded-lg ${
              hasErrors 
                ? 'bg-yellow-50 border border-yellow-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className={`font-medium ${
                hasErrors ? 'text-yellow-800' : 'text-green-800'
              }`}>
                {hasErrors ? 'Import Completed with Issues' : 'Import Completed Successfully'}
              </div>
              <div className={`text-sm mt-1 ${
                hasErrors ? 'text-yellow-700' : 'text-green-700'
              }`}>
                {hasErrors 
                  ? `Import finished but ${errors.length} rows had issues.`
                  : 'All projects have been imported successfully.'
                }
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-5 w-5" />
              Import Issues ({errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {errors.map((error, index) => (
                <div 
                  key={index}
                  className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700"
                >
                  {error}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isComplete && (
        <div className="text-center text-sm text-gray-600">
          Please wait while we import your projects...
        </div>
      )}
    </div>
  );
};
