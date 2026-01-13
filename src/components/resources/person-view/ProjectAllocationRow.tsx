import React, { useRef, useCallback, useState } from 'react';
import { Trash2, EyeOff } from 'lucide-react';
import { WeekInfo } from '../hooks/useGridWeeks';
import { PersonProject, PersonResourceData } from '@/hooks/usePersonResourceData';
import { useAllocationInput } from '../hooks/useAllocationInput';
import { logger } from '@/utils/logger';
import { toUTCDateKey } from '@/utils/dateKey';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { deleteAllResourceAllocationsForProject } from '@/hooks/allocations/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProjectAllocationRowProps {
  project: PersonProject;
  person: PersonResourceData;
  weeks: WeekInfo[];
  isEven: boolean;
  projectIndex: number;
  selectedDate?: Date;
  periodToShow?: number;
  onLocalAllocationChange?: (projectId: string, weekKey: string, hours: number) => void;
  initialAllocations?: Record<string, number>;
  onProjectRemoved?: () => void;
  onHideProject?: (projectId: string) => void;
  isHidden?: boolean;
}

export const ProjectAllocationRow: React.FC<ProjectAllocationRowProps> = ({
  project,
  person,
  weeks,
  isEven,
  projectIndex,
  selectedDate,
  periodToShow,
  onLocalAllocationChange,
  initialAllocations,
  onProjectRemoved,
  onHideProject,
  isHidden = false
}) => {
  const { company } = useCompany();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const rowBgColor = isEven ? '#f9fafb' : '#ffffff';
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Use pre-loaded allocations from parent as the base
  // The fetchedAllocations from useAllocationInput will be used for real-time updates after saves
  const {
    allocations: fetchedAllocations,
    inputValues,
    isLoading,
    isSaving,
    handleInputChange,
    handleInputBlur
  } = useAllocationInput({
    projectId: project.projectId,
    resourceId: person.personId,
    resourceType: person.resourceType,
    selectedDate,
    periodToShow,
    onAllocationChange: (resourceId, weekKey, hours) => {
      logger.debug(`Person ${resourceId} allocation changed for project ${project.projectId} on week ${weekKey}: ${hours}h`);
      // Update local person totals immediately
      onLocalAllocationChange?.(project.projectId, weekKey, hours);
    }
  });

  // Merge initial allocations with fetched ones (fetched takes priority for real-time updates)
  const allocations = { ...project.allocations, ...fetchedAllocations };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, currentWeekKey: string, currentIndex: number) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < weeks.length) {
          const nextWeekKey = toUTCDateKey(weeks[nextIndex].weekStartDate);
          const nextInput = inputRefs.current[nextWeekKey];
          if (nextInput) {
            nextInput.focus();
            nextInput.select();
          }
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          const prevWeekKey = toUTCDateKey(weeks[prevIndex].weekStartDate);
          const prevInput = inputRefs.current[prevWeekKey];
          if (prevInput) {
            prevInput.focus();
            prevInput.select();
          }
        }
      } else if (e.key === 'Enter') {
        e.currentTarget.blur();
      }
    },
    [weeks]
  );

  const handleDeleteProject = async () => {
    if (!company?.id) return;
    
    setIsDeleting(true);
    try {
      // RULEBOOK: Use canonical API for deleting all allocations
      const success = await deleteAllResourceAllocationsForProject(
        project.projectId,
        person.personId,
        person.resourceType,
        company.id
      );

      if (!success) throw new Error('Failed to delete allocations');

      // Also remove from project_resources if it's an active resource
      if (person.resourceType === 'active') {
        await supabase
          .from('project_resources')
          .delete()
          .eq('project_id', project.projectId)
          .eq('staff_id', person.personId)
          .eq('company_id', company.id);
      } else {
        // For pre-registered, remove from pending_resources
        await supabase
          .from('pending_resources')
          .delete()
          .eq('project_id', project.projectId)
          .eq('invite_id', person.personId)
          .eq('company_id', company.id);
      }

      toast.success(`Removed ${project.projectName} from ${person.firstName}`);
      setShowDeleteDialog(false);
      onProjectRemoved?.();
    } catch (error) {
      logger.error('Failed to remove project:', error);
      toast.error('Failed to remove project');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove <strong>{project.projectName}</strong> from <strong>{person.firstName} {person.lastName}</strong> and delete all their allocations on this project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <tr className="workload-resource-row resource-row group">
        {/* Project info column - Fixed width, sticky */}
        <td 
          className="workload-resource-cell resource-name-column"
          style={{
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            position: 'sticky',
            left: '0',
            zIndex: 10,
            backgroundColor: rowBgColor,
            textAlign: 'left',
            padding: '8px 16px 8px 48px',
            borderRight: '2px solid rgba(156, 163, 175, 0.8)',
            borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
            verticalAlign: 'middle'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: '500', 
                color: '#374151',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {project.projectName}
              </div>
              {project.projectCode && (
                <div style={{ 
                  fontSize: '11px',
                  color: '#6b7280',
                  marginTop: '2px'
                }}>
                  {project.projectCode}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onHideProject?.(project.projectId)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hide row (keeps data)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setShowDeleteDialog(true)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete (removes data)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </td>
      
      {/* Week allocation cells */}
      {weeks.map((week, weekIndex) => {
        const weekKey = toUTCDateKey(week.weekStartDate);
        const allocation = allocations[weekKey] || 0;
        
        return (
          <td 
            key={weekKey}
            className="workload-resource-cell resource-week-column"
            style={{
              width: '80px',
              minWidth: '80px',
              maxWidth: '80px',
              backgroundColor: rowBgColor,
              textAlign: 'center',
              padding: '4px',
              borderRight: '1px solid rgba(229, 231, 235, 0.8)',
              borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
              verticalAlign: 'middle',
              ...(week.isPreviousWeek && {
                opacity: 0.5
              })
            }}
            tabIndex={-1}
            onClick={() => {
              const input = inputRefs.current[weekKey];
              if (input && !input.disabled) {
                input.focus();
                input.select();
              }
            }}
          >
            <input
              ref={(el) => inputRefs.current[weekKey] = el}
              type="number"
              min="0"
              max="200"
              value={inputValues[weekKey] || ''}
              onChange={(e) => handleInputChange(weekKey, e.target.value)}
              onBlur={(e) => handleInputBlur(weekKey, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => handleKeyDown(e, weekKey, weekIndex)}
              disabled={isLoading || week.isPreviousWeek}
              className={`
                w-full h-full px-1 py-1 text-center border-0 bg-transparent
                focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white
                ${allocation > 0 ? 'font-semibold text-primary' : 'text-muted-foreground'}
                ${week.isPreviousWeek ? 'cursor-not-allowed' : ''}
              `}
              style={{
                fontSize: '13px',
                lineHeight: '24px',
                height: '28px',
                width: '100%',
                MozAppearance: 'textfield',
                WebkitAppearance: 'none',
                margin: 0
              }}
              placeholder="0"
            />
          </td>
        );
      })}
      </tr>
    </>
  );
};
