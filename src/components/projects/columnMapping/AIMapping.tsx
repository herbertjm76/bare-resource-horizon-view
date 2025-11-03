import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIMappingProps {
  onGetAISuggestions: () => void;
  isLoading: boolean;
  suggestions?: string[];
}

export const AIMapping: React.FC<AIMappingProps> = ({
  onGetAISuggestions,
  isLoading,
  suggestions
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI-Powered Mapping</span>
          <Badge variant="secondary" className="text-xs">Smart</Badge>
        </div>
        <Button
          onClick={onGetAISuggestions}
          disabled={isLoading}
          size="sm"
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Auto-Map with AI
            </>
          )}
        </Button>
      </div>
      
      {suggestions && suggestions.length > 0 && (
        <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">AI Suggestions:</p>
          <ul className="text-xs space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
