import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Users, DollarSign, CalendarDays, Calendar } from 'lucide-react';
import { ResourceSelector } from './ResourceSelector';
import { TeamCompositionTable } from './TeamCompositionTable';
import { useStageTeamComposition } from '@/hooks/useStageTeamComposition';
import { useOfficeStages } from '@/hooks/useOfficeStages';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useDemoAuth } from '@/hooks/useDemoAuth';

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
  initialStageId?: string;
}

export const StageTeamCompositionEditor: React.FC<StageTeamCompositionEditorProps> = ({
  projectId,
  stages,
  showBudget = false,
  onStageUpdate,
  initialStageId
}) => {
  const { isDemoMode } = useDemoAuth();
  const { data: officeStages = [] } = useOfficeStages();
  const [selectedStageId, setSelectedStageId] = useState<string>(() => {
    const preferred = initialStageId && stages.some(s => s.id === initialStageId) ? initialStageId : undefined;
    return preferred || stages[0]?.id || '';
  });
  const [contractedWeeks, setContractedWeeks] = useState<Record<string, number>>({});
  const [stageStartDates, setStageStartDates] = useState<Record<string, Date | null>>({});
  const [projectTotalWeeks, setProjectTotalWeeks] = useState<number>(0);
  const [isUpdatingWeeks, setIsUpdatingWeeks] = useState(false);

  // If the dialog was opened by clicking a specific stage (e.g., timeline), preselect it.
  useEffect(() => {
    if (!initialStageId) return;
    if (!stages.some(s => s.id === initialStageId)) return;
    setSelectedStageId(initialStageId);
  }, [initialStageId, stages]);

  // Fetch project contract dates and stage contracted weeks
  useEffect(() => {
    // In demo mode, we don't fetch anything from Supabase.
    if (isDemoMode) return;

    const fetchData = async () => {
      if (!projectId || stages.length === 0) return;

      // Fetch project contract dates to calculate total weeks
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('contract_start_date, contract_end_date')
        .eq('id', projectId)
        .maybeSingle();

      if (projectError) {
        // Don't toast here (it's noisy); just log.
        console.error('Error fetching project contract dates:', projectError);
      }

      if (projectData?.contract_start_date && projectData?.contract_end_date) {
        const startDate = new Date(projectData.contract_start_date);
        const endDate = new Date(projectData.contract_end_date);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
        setProjectTotalWeeks(Math.max(0, diffWeeks));
      }

      // Fetch stage contracted weeks and start dates
      const stageNames = stages.map(s => s.name);
      const { data, error } = await supabase
        .from('project_stages')
        .select('id, stage_name, contracted_weeks, start_date')
        .eq('project_id', projectId)
        .in('stage_name', stageNames);

      if (error) {
        console.error('Error fetching contracted weeks:', error);
        return;
      }

      const weeksMap: Record<string, number> = {};
      const datesMap: Record<string, Date | null> = {};
      data?.forEach(stage => {
        const matchingStage = stages.find(s => s.name === stage.stage_name);
        if (matchingStage) {
          weeksMap[matchingStage.id] = stage.contracted_weeks || 0;
          datesMap[matchingStage.id] = stage.start_date ? parseISO(stage.start_date) : null;
        }
      });
      setContractedWeeks(weeksMap);
      setStageStartDates(datesMap);
    };

    fetchData();
  }, [projectId, stages, isDemoMode]);

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

  // Calculate sum of stage weeks for validation
  const stageWeeksSum = useMemo(() => {
    return stages.reduce((sum, stage) => sum + (contractedWeeks[stage.id] || 0), 0);
  }, [stages, contractedWeeks]);

  // Check if stage weeks match project total
  const weeksMatch = projectTotalWeeks > 0 && stageWeeksSum === projectTotalWeeks;
  const hasWeeksConfigured = stageWeeksSum > 0 || projectTotalWeeks > 0;

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

  const handleStartDateChange = async (stageId: string, date: Date | null) => {
    // Update local state immediately
    setStageStartDates(prev => ({ ...prev, [stageId]: date }));

    try {
      const stage = stages.find(s => s.id === stageId);
      if (!stage) return;

      const { error } = await supabase
        .from('project_stages')
        .update({ start_date: date ? format(date, 'yyyy-MM-dd') : null })
        .eq('project_id', projectId)
        .eq('stage_name', stage.name);

      if (error) throw error;
      onStageUpdate?.();
    } catch (error) {
      console.error('Error updating start date:', error);
      toast.error('Failed to update start date');
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
          const widthPercent = stageWeeksSum > 0 
            ? (stageWeeks / stageWeeksSum) * 100 
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

              {/* Arrow indicator for selected stage - behind the ring */}
              {isSelected && (
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] -z-10"
                  style={{ borderTopColor: stageColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Weeks total indicator - shown at stage input level now */}

      {stages.map((stage) => (
        stage.id === selectedStageId && (
          <div key={stage.id} className="space-y-4 animate-fade-in">
            {/* Stage Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">{stage.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Plan team composition for this stage
                </p>
              </div>

              {/* Stage Settings Row */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Start Date Picker */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="start-date" className="text-sm whitespace-nowrap">
                    <Calendar className="h-4 w-4 inline mr-1.5" />
                    Start Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] justify-start text-left font-normal",
                          !stageStartDates[stage.id] && "text-muted-foreground"
                        )}
                      >
                        {stageStartDates[stage.id] ? (
                          format(stageStartDates[stage.id]!, 'MMM d, yyyy')
                        ) : (
                          <span>Pick date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={stageStartDates[stage.id] || undefined}
                        onSelect={(date) => handleStartDateChange(stage.id, date || null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Contracted Weeks Input with total indicator */}
                <div className="flex items-center gap-2">
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
                  {hasWeeksConfigured && (
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      of <span className="font-medium text-foreground">{stageWeeksSum}</span> weeks
                      {projectTotalWeeks > 0 && projectTotalWeeks !== stageWeeksSum && (
                        <span className="text-muted-foreground/70"> ({projectTotalWeeks}w total)</span>
                      )}
                    </span>
                  )}
                </div>
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
