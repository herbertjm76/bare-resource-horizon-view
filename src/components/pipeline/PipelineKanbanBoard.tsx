import React, { useState, useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { PipelineColumn } from './PipelineColumn';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const STATUS_CONFIG = [
  { status: 'Planning', title: 'Planning', color: '#3b82f6' },
  { status: 'In Progress', title: 'In Progress', color: '#8b5cf6' },
  { status: 'On Hold', title: 'On Hold', color: '#f59e0b' },
  { status: 'Complete', title: 'Complete', color: '#22c55e' },
];

export const PipelineKanbanBoard: React.FC = () => {
  const { projects, isLoading } = useProjects();
  const queryClient = useQueryClient();
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(null);

  // Group projects by status
  const projectsByStatus = useMemo(() => {
    const grouped: Record<string, typeof projects> = {};
    
    STATUS_CONFIG.forEach(({ status }) => {
      grouped[status] = [];
    });
    
    projects?.forEach((project) => {
      const status = project.status || 'Planning';
      if (grouped[status]) {
        grouped[status].push(project);
      } else {
        // If status doesn't match any known status, put in Planning
        grouped['Planning'].push(project);
      }
    });
    
    return grouped;
  }, [projects]);

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggingProjectId(projectId);
    e.dataTransfer.setData('projectId', projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (status: string) => {
    setDragOverStatus(status);
  };

  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverStatus(null);
    
    const projectId = e.dataTransfer.getData('projectId');
    if (!projectId) return;

    const project = projects?.find(p => p.id === projectId);
    if (!project || project.status === newStatus) {
      setDraggingProjectId(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      toast.success(`Moved "${project.name}" to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    } finally {
      setDraggingProjectId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-1">
      {STATUS_CONFIG.map(({ status, title, color }) => (
        <div
          key={status}
          onDragEnter={() => handleDragEnter(status)}
          onDragLeave={handleDragLeave}
        >
          <PipelineColumn
            title={title}
            status={status}
            projects={projectsByStatus[status] || []}
            color={color}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragOver={dragOverStatus === status}
          />
        </div>
      ))}
    </div>
  );
};
