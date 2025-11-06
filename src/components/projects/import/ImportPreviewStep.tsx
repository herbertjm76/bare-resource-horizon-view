import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface ImportPreviewStepProps {
  headers: string[];
  aiAnalysis: {
    mapping: Record<string, string>;
    confidence: Record<string, number>;
    suggestions: string[];
  } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ImportPreviewStep: React.FC<ImportPreviewStepProps> = ({
  headers,
  aiAnalysis,
  onConfirm,
  onCancel
}) => {
  if (!aiAnalysis) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to analyze file. Please try uploading again.
        </AlertDescription>
      </Alert>
    );
  }

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      code: 'Project Code',
      name: 'Project Name',
      status: 'Status',
      country: 'Country',
      target_profit_percentage: 'Target Profit %',
      currency: 'Currency',
      project_manager_name: 'Project Manager',
      office_name: 'Office',
      code_and_name: 'Code & Name (Matrix Format)'
    };
    return labels[field] || field;
  };

  const mappedFields = Object.entries(aiAnalysis.mapping).map(([colIdx, field]) => ({
    column: headers[parseInt(colIdx)],
    field: getFieldLabel(field),
    confidence: aiAnalysis.confidence[colIdx] || 0
  }));

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xl">✓</span>
              <strong>AI Detection Complete</strong>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="font-medium">Detected Column Mappings:</p>
              <div className="space-y-2">
                {mappedFields.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                    <span className="font-mono text-xs flex-1">{item.column}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs flex-1">{item.field}</span>
                    <Badge variant={item.confidence > 0.8 ? "default" : "secondary"} className="text-xs">
                      {Math.round(item.confidence * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {aiAnalysis.suggestions.length > 0 && (
              <div className="pt-2 border-t space-y-1">
                <p className="text-xs font-medium text-muted-foreground">AI Suggestions:</p>
                {aiAnalysis.suggestions.map((suggestion, idx) => (
                  <p key={idx} className="text-xs">• {suggestion}</p>
                ))}
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <div className="flex gap-2">
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button onClick={onConfirm} className="flex-1">
          Looks Good - Import
        </Button>
      </div>
    </div>
  );
};
