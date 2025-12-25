import React, { useState, useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useOfficeStages } from '@/hooks/useOfficeStages';
import { PipelineColumn } from './PipelineColumn';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export const PipelineKanbanBoard: React.FC = () => {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { data: stages, isLoading: stagesLoading } = useOfficeStages();
  const queryClient = useQueryClient();
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(null);
  const [hiddenStages, setHiddenStages] = useState<Set<string>>(new Set());

  const isLoading = projectsLoading || stagesLoading;

  // Group projects by current_stage
  const projectsByStage = useMemo(() => {
    const grouped: Record<string, typeof projects> = {};
    
    // Initialize with empty arrays for each stage
    stages?.forEach((stage) => {
      grouped[stage.name] = [];
    });
    
    // Add "Unassigned" for projects without a stage
    grouped['Unassigned'] = [];
    
    projects?.forEach((project) => {
      const stageName = project.current_stage || 'Unassigned';
      if (grouped[stageName]) {
        grouped[stageName].push(project);
      } else {
        grouped['Unassigned'].push(project);
      }
    });
    
    return grouped;
  }, [projects, stages]);

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggingProjectId(projectId);
    e.dataTransfer.setData('projectId', projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (stageName: string) => {
    setDragOverStage(stageName);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    setDragOverStage(null);
    
    const projectId = e.dataTransfer.getData('projectId');
    if (!projectId) return;

    const project = projects?.find(p => p.id === projectId);
    if (!project || project.current_stage === newStage) {
      setDraggingProjectId(null);
      return;
    }

    // Handle "Unassigned" as empty string in database
    const stageValue = newStage === 'Unassigned' ? '' : newStage;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ current_stage: stageValue })
        .eq('id', projectId);

      if (error) throw error;

      toast.success(`Moved "${project.name}" to ${newStage}`);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      console.error('Error updating project stage:', error);
      toast.error('Failed to update project stage');
    } finally {
      setDraggingProjectId(null);
    }
  };

  const toggleStageVisibility = (stageName: string) => {
    setHiddenStages(prev => {
      const next = new Set(prev);
      if (next.has(stageName)) {
        next.delete(stageName);
      } else {
        next.add(stageName);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Build columns: Unassigned first, then stages in order
  const allColumns = [
    { name: 'Unassigned', color: '#6b7280' },
    ...(stages?.map(s => ({ name: s.name, color: s.color || '#3b82f6' })) || []),
  ];

  const visibleColumns = allColumns.filter(col => !hiddenStages.has(col.name));

  return (
    <div className="space-y-3">
      {/* Stage Visibility Toggle Row */}
      <div className="flex flex-wrap gap-1.5 px-1">
        {allColumns.map(({ name, color }) => {
          const isHidden = hiddenStages.has(name);
          const projectCount = (projectsByStage[name] || []).length;
          return (
            <Toggle
              key={name}
              pressed={!isHidden}
              onPressedChange={() => toggleStageVisibility(name)}
              size="sm"
              className="h-7 px-2 gap-1.5 text-xs data-[state=on]:bg-primary/10 data-[state=on]:text-foreground data-[state=off]:bg-muted/50 data-[state=off]:text-muted-foreground"
            >
              <div 
                className="w-2 h-2 rounded-full shrink-0" 
                style={{ backgroundColor: color, opacity: isHidden ? 0.4 : 1 }}
              />
              <span className={isHidden ? 'line-through opacity-60' : ''}>
                {name}
              </span>
              <span className="text-[10px] opacity-60">({projectCount})</span>
              {isHidden ? (
                <EyeOff className="h-3 w-3 opacity-50" />
              ) : (
                <Eye className="h-3 w-3 opacity-50" />
              )}
            </Toggle>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-1">
        {visibleColumns.map(({ name, color }) => (
          <div
            key={name}
            onDragEnter={() => handleDragEnter(name)}
            onDragLeave={handleDragLeave}
          >
            <PipelineColumn
              title={name}
              status={name}
              projects={projectsByStage[name] || []}
              color={color}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragOver={dragOverStage === name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
