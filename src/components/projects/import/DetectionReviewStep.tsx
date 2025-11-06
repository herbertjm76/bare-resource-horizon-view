import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface DetectionReviewStepProps {
  detectionType: 'people' | 'projects';
  detected: any[];
  confidence: number;
  location: string;
  onConfirm: (finalList: any[]) => void;
  onCancel: () => void;
}

export const DetectionReviewStep: React.FC<DetectionReviewStepProps> = ({
  detectionType,
  detected,
  confidence,
  location,
  onConfirm,
  onCancel
}) => {
  const [items, setItems] = useState(detected);

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xl">✓</span>
              <strong>AI Detection Complete</strong>
              <Badge variant={confidence > 0.8 ? "default" : "secondary"} className="ml-auto">
                {Math.round(confidence * 100)}% confidence
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </AlertDescription>
      </Alert>

      <div>
        <h3 className="text-sm font-medium mb-3">
          Detected {detectionType === 'people' ? 'People' : 'Projects'} ({items.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 group">
              <div className="flex-1">
                {detectionType === 'people' ? (
                  <span className="text-sm font-medium">{item}</span>
                ) : (
                  <div>
                    <span className="text-sm font-medium">{item.code}</span>
                    {item.name && <span className="text-sm text-muted-foreground ml-2">- {item.name}</span>}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(idx)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {items.length === 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            All items removed. Please go back and try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Back
        </Button>
        <Button onClick={() => onConfirm(items)} className="flex-1" disabled={items.length === 0}>
          Confirm & Import ({items.length})
        </Button>
      </div>
    </div>
  );
};
