import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Users, DollarSign, CalendarDays } from 'lucide-react';
import { ResourceSelector } from './ResourceSelector';
import { TeamCompositionTable } from './TeamCompositionTable';
import { useStageTeamComposition } from '@/hooks/useStageTeamComposition';
import { useOfficeStages } from '@/hooks/useOfficeStages';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Stage {
  id: string;
  name: string;
  code?: string;
  contractedWeeks?: number;
}

interface StageTeamCompositionEditorProps {
  projectId: string;
  stages: Stage[];
  showBudget?: boolean;
  onStageUpdate?: () => void;
}

export const StageTeamCompositionEditor: React.FC<StageTeamCompositionEditorProps> = ({
  projectId,
  stages,
  showBudget = false,
  onStageUpdate
}) => {
  const { data: officeStages = [] } = useOfficeStages();
  const [selectedStageId, setSelectedStageId] = useState<string>(stages[0]?.id || '');
  const [contractedWeeks, setContractedWeeks] = useState<Record<string, number>>({});
  const [isUpdatingWeeks, setIsUpdatingWeeks] = useState(false);

  // Fetch initial contracted weeks
  useEffect(() => {
    const fetchContractedWeeks = async () => {
      if (!projectId || stages.length === 0) return;

      const stageNames = stages.map(s => s.name);
      const { data, error } = await supabase
        .from('project_stages')
        .select('id, stage_name, contracted_weeks')
        .eq('project_id', projectId)
        .in('stage_name', stageNames);

      if (error) {
        console.error('Error fetching contracted weeks:', error);
        return;
      }

      const weeksMap: Record<string, number> = {};
      data?.forEach(stage => {
        const matchingStage = stages.find(s => s.name === stage.stage_name);
        if (matchingStage) {
          weeksMap[matchingStage.id] = stage.contracted_weeks || 0;
        }
      });
      setContractedWeeks(weeksMap);
    };

    fetchContractedWeeks();
  }, [projectId, stages]);

  const {
    composition,
    isLoading,
    isSaving,
    isDeleting,
    stageTotals,
    saveItem,
    deleteItem,
  } = useStageTeamComposition(projectId, selectedStageId);

  const selectedStage = stages.find(s => s.id === selectedStageId);
  const currentContractedWeeks = contractedWeeks[selectedStageId] || 0;
  const weeklyDemand = currentContractedWeeks > 0 
    ? Math.round(stageTotals.totalHours / currentContractedWeeks * 10) / 10 
    : 0;

  // Calculate total weeks for proportional timeline bar
  const totalWeeks = useMemo(() => {
    return stages.reduce((sum, stage) => sum + (contractedWeeks[stage.id] || 0), 0);
  }, [stages, contractedWeeks]);

  // Get stage color from office_stages
  const getStageColor = (stageName: string): string => {
    const officeStage = officeStages.find(os => os.name === stageName);
    return officeStage?.color || '#6b7280'; // Default to gray if no color
  };

  const handleAddResource = (data: {
    referenceId: string;
    referenceType: 'role' | 'member';
    plannedQuantity: number;
    plannedHoursPerPerson: number;
    rateSnapshot: number;
  }) => {
    saveItem(data);
  };

  const handleContractedWeeksChange = async (stageId: string, weeks: number) => {
    // Update local state immediately
    setContractedWeeks(prev => ({ ...prev, [stageId]: weeks }));

    // Debounced save to database
    setIsUpdatingWeeks(true);
    try {
      const stage = stages.find(s => s.id === stageId);
      if (!stage) return;

      const { error } = await supabase
        .from('project_stages')
        .update({ contracted_weeks: weeks })
        .eq('project_id', projectId)
        .eq('stage_name', stage.name);

      if (error) throw error;
      onStageUpdate?.();
    } catch (error) {
      console.error('Error updating contracted weeks:', error);
      toast.error('Failed to update contracted weeks');
    } finally {
      setIsUpdatingWeeks(false);
    }
  };

  if (stages.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">Please select project stages first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stage Timeline Bar - Proportional width based on contracted weeks */}
      <div className="flex w-full h-12 rounded-lg overflow-visible mb-3">
        {stages.map((stage, index) => {
          const stageWeeks = contractedWeeks[stage.id] || 0;
          const widthPercent = totalWeeks > 0 
            ? (stageWeeks / totalWeeks) * 100 
            : 100 / stages.length; // Equal width if no weeks set
          const stageColor = getStageColor(stage.name);
          const isSelected = stage.id === selectedStageId;
          const isFirst = index === 0;
          const isLast = index === stages.length - 1;
          
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={cn(
                "relative flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer min-w-[60px]",
                "hover:brightness-110",
                isFirst && "rounded-l-lg",
                isLast && "rounded-r-lg",
                isSelected && "ring-2 ring-foreground ring-offset-2 ring-offset-background z-10"
              )}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: stageColor,
              }}
            >
              <span className="text-sm font-bold text-white drop-shadow-sm truncate px-2">
                {stage.code || stage.name}
              </span>
              {stageWeeks > 0 && (
                <span className="text-sm font-bold text-white/90">
                  {stageWeeks}w
                </span>
              )}

              {/* Arrow indicator for selected stage */}
              {isSelected && (
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px]"
                  style={{ borderTopColor: stageColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Stage Content */}
      {stages.map((stage) => (
        stage.id === selectedStageId && (
          <div key={stage.id} className="space-y-4">
            {/* Stage Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{stage.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Plan team composition for this stage
                </p>
              </div>

              {/* Contracted Weeks Input */}
              <div className="flex items-center gap-3">
                <Label htmlFor="contracted-weeks" className="text-sm whitespace-nowrap">
                  <CalendarDays className="h-4 w-4 inline mr-1.5" />
                  Contracted Weeks
                </Label>
                <Input
                  id="contracted-weeks"
                  type="number"
                  min={0}
                  step={1}
                  value={contractedWeeks[stage.id] || ''}
                  onChange={(e) => handleContractedWeeksChange(stage.id, parseInt(e.target.value) || 0)}
                  className="w-20 text-center"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Resource Selector - now with contracted weeks for calculation */}
            <ResourceSelector 
              onAdd={handleAddResource} 
              isLoading={isSaving}
              contractedWeeks={contractedWeeks[stage.id] || 0}
            />

            {/* Team Composition Table */}
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <TeamCompositionTable
                items={composition}
                onDelete={deleteItem}
                isDeleting={isDeleting}
                showBudget={showBudget}
                contractedWeeks={contractedWeeks[stage.id] || 0}
              />
            )}

            {/* Stage Summary */}
            <Card className="bg-muted/30">
              <CardContent className="py-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Resources</p>
                      <p className="text-lg font-semibold">{composition.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Hours</p>
                      <p className="text-lg font-semibold">{Math.round(stageTotals.totalHours)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Weekly Demand</p>
                      <p className="text-lg font-semibold">
                        {currentContractedWeeks > 0 ? `${weeklyDemand} hrs` : '—'}
                      </p>
                    </div>
                  </div>
                  {showBudget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-lg font-semibold">
                          ${stageTotals.totalBudget.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      ))}
    </div>
  );
};
