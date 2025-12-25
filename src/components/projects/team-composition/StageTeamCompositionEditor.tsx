import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Users, DollarSign, CalendarDays } from 'lucide-react';
import { ResourceSelector } from './ResourceSelector';
import { TeamCompositionTable } from './TeamCompositionTable';
import { useStageTeamComposition } from '@/hooks/useStageTeamComposition';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  const handleAddResource = (data: {
    referenceId: string;
    referenceType: 'role' | 'member';
    plannedQuantity: number;
    plannedHoursPerPerson: number;
  }) => {
    saveItem({
      ...data,
      rateSnapshot: 0 // TODO: Fetch rate from office_rates based on reference
    });
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
      {/* Stage Tabs */}
      <Tabs value={selectedStageId} onValueChange={setSelectedStageId}>
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 p-1">
          {stages.map((stage) => {
            const stageWeeks = contractedWeeks[stage.id] || 0;
            return (
              <TabsTrigger
                key={stage.id}
                value={stage.id}
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {stage.code || stage.name}
                {stageWeeks > 0 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {stageWeeks}w
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {stages.map((stage) => (
          <TabsContent key={stage.id} value={stage.id} className="space-y-4 mt-4">
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

            {/* Resource Selector */}
            <ResourceSelector onAdd={handleAddResource} isLoading={isSaving} />

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
              />
            )}

            {/* Stage Summary */}
            <Card className="bg-muted/30">
              <CardContent className="py-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Headcount</p>
                      <p className="text-lg font-semibold">{stageTotals.headcount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Hours</p>
                      <p className="text-lg font-semibold">{stageTotals.totalHours}</p>
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
