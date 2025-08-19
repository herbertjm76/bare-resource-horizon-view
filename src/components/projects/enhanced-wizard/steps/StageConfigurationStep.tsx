import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock } from 'lucide-react';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';
import { ProjectWizardData } from '../ProjectSetupWizard';

interface StageConfigurationStepProps {
  data: ProjectWizardData;
  onUpdate: (updates: Partial<ProjectWizardData>) => void;
}

export const StageConfigurationStep: React.FC<StageConfigurationStepProps> = ({ data, onUpdate }) => {
  const { office_stages } = useOfficeSettings();

  const handleStageSelection = (stageId: string, checked: boolean) => {
    const updatedStages = checked
      ? [...data.selectedStages, stageId]
      : data.selectedStages.filter(id => id !== stageId);
    
    onUpdate({ selectedStages: updatedStages });
    
    // Initialize timeline for new stages
    if (checked && !data.stageTimelines[stageId]) {
      const newTimelines = {
        ...data.stageTimelines,
        [stageId]: { weeks: 4, startDate: '' }
      };
      onUpdate({ stageTimelines: newTimelines });
    }
  };

  const updateStageTimeline = (stageId: string, field: 'weeks' | 'startDate', value: string | number) => {
    const updatedTimelines = {
      ...data.stageTimelines,
      [stageId]: {
        ...data.stageTimelines[stageId],
        [field]: value
      }
    };
    onUpdate({ stageTimelines: updatedTimelines });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Configure Project Stages</h3>
        <p className="text-muted-foreground">
          Select the stages that apply to this project and set their timelines.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Available Stages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {office_stages.map(stage => {
            const isSelected = data.selectedStages.includes(stage.id);
            const timeline = data.stageTimelines[stage.id];
            
            return (
              <div key={stage.id} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={stage.id}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleStageSelection(stage.id, checked as boolean)}
                  />
                  <Label htmlFor={stage.id} className="text-base font-medium">
                    {stage.name}
                  </Label>
                  {stage.color && (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                  )}
                </div>
                
                {isSelected && (
                  <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <Label htmlFor={`${stage.id}-weeks`} className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration (weeks)
                      </Label>
                      <Input
                        id={`${stage.id}-weeks`}
                        type="number"
                        min="1"
                        value={timeline?.weeks || 4}
                        onChange={(e) => updateStageTimeline(stage.id, 'weeks', parseInt(e.target.value) || 1)}
                        placeholder="Enter weeks"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`${stage.id}-start`} className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Start Date (optional)
                      </Label>
                      <Input
                        id={`${stage.id}-start`}
                        type="date"
                        value={timeline?.startDate || ''}
                        onChange={(e) => updateStageTimeline(stage.id, 'startDate', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {data.selectedStages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Timeline Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.selectedStages.map(stageId => {
                const stage = office_stages.find(s => s.id === stageId);
                const timeline = data.stageTimelines[stageId];
                return (
                  <div key={stageId} className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">{stage?.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {timeline?.weeks || 0} weeks
                      {timeline?.startDate && ` (starts ${timeline.startDate})`}
                    </span>
                  </div>
                );
              })}
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <div className="text-sm font-medium">
                  Total Duration: {Object.values(data.stageTimelines).reduce((sum, timeline) => sum + (timeline?.weeks || 0), 0)} weeks
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};