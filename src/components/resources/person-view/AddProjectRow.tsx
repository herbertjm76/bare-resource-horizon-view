import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { toUTCDateKey } from '@/utils/dateKey';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { WeekInfo } from '../hooks/useGridWeeks';
import { UnifiedAddProjectPopup } from '@/components/shared/UnifiedAddProjectPopup';

interface AddProjectRowProps {
  personId: string;
  resourceType: 'active' | 'pre_registered';
  existingProjectIds: string[];
  weeks: WeekInfo[];
  onProjectAdded: () => void;
}

export const AddProjectRow: React.FC<AddProjectRowProps> = ({
  personId,
  resourceType,
  existingProjectIds,
  weeks,
  onProjectAdded
}) => {
  const { company } = useCompany();
  const [isAdding, setIsAdding] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleProjectSelected = async (projectId: string) => {
    if (!projectId || !company?.id) return;

    try {
      // Find the first non-previous week (current period), or fallback to first week
      const targetWeek = weeks.find(w => !w.isPreviousWeek) || weeks[0];
      
      if (!targetWeek?.weekStartDate) {
        toast.error('No visible weeks to add allocation');
        return;
      }
      
      const allocationDateKey = toUTCDateKey(targetWeek.weekStartDate);

      const { error } = await supabase
        .from('project_resource_allocations')
        .insert({
          project_id: projectId,
          resource_id: personId,
          resource_type: resourceType,
          allocation_date: allocationDateKey,
          hours: 0,
          company_id: company.id,
        });

      if (error) throw error;

      toast.success('Project added');
      onProjectAdded();
      setIsAdding(false);
      setPopupOpen(false);
    } catch (error: any) {
      console.error('Error adding project:', error);
      toast.error(error?.message ? `Failed to add project: ${error.message}` : 'Failed to add project');
    }
  };

  if (!isAdding) {
    return (
      <tr className="workload-resource-row">
        <td
          className="workload-resource-cell project-resource-column"
          colSpan={weeks.length + 1}
          style={{
            position: 'sticky',
            left: '0',
            zIndex: 10,
            padding: '8px 16px',
            borderRight: '2px solid rgba(156, 163, 175, 0.8)',
            borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsAdding(true);
              setPopupOpen(true);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="workload-resource-row">
      <td
        className="workload-resource-cell project-resource-column"
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '0',
          zIndex: 10,
          padding: '8px 16px',
          borderRight: '2px solid rgba(156, 163, 175, 0.8)',
          borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
        }}
      >
        <div className="flex items-center gap-2">
          <UnifiedAddProjectPopup
            open={popupOpen}
            onOpenChange={(open) => {
              setPopupOpen(open);
              if (!open) setIsAdding(false);
            }}
            existingProjectIds={existingProjectIds}
            variant="popover"
            showAllocationInput={false}
            onProjectSelected={handleProjectSelected}
            onProjectCreated={onProjectAdded}
            trigger={
              <Button
                variant="outline"
                role="combobox"
                className="h-8 flex-1 justify-between"
              >
                Select project...
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsAdding(false);
              setPopupOpen(false);
            }}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </td>
      {weeks.map((week) => {
        const weekKey = toUTCDateKey(week.weekStartDate);
        return (
          <td
            key={weekKey}
            className="workload-resource-cell week-column"
            style={{
              width: '80px',
              minWidth: '80px',
              maxWidth: '80px',
              borderRight: '1px solid rgba(156, 163, 175, 0.6)',
              borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
            }}
          />
        );
      })}
    </tr>
  );
};
