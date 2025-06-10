
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface CurrentStageIndicatorProps {
  currentStage: string;
  allStages: Array<{ id: string; name: string; color?: string }>;
  completionPercentage?: number;
}

export const CurrentStageIndicator: React.FC<CurrentStageIndicatorProps> = ({
  currentStage,
  allStages,
  completionPercentage = 0
}) => {
  const currentStageIndex = allStages.findIndex(stage => stage.name === currentStage);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Current Project Stage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">{currentStage}</span>
          <Badge variant="default">
            {completionPercentage.toFixed(0)}% Complete
          </Badge>
        </div>
        
        <div className="space-y-2">
          {allStages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = stage.name === currentStage;
            const isPending = index > currentStageIndex;
            
            return (
              <div
                key={stage.id}
                className={`flex items-center gap-3 p-2 rounded ${
                  isCurrent ? 'bg-primary/10 border border-primary/20' : ''
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className={`h-4 w-4 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
                <span
                  className={`text-sm ${
                    isCurrent ? 'font-medium text-primary' : 
                    isCompleted ? 'text-muted-foreground line-through' : 
                    'text-muted-foreground'
                  }`}
                >
                  {stage.name}
                </span>
                {stage.color && (
                  <div
                    className="w-3 h-3 rounded-full ml-auto"
                    style={{ backgroundColor: stage.color }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
