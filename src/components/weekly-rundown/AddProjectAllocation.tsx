import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UnifiedAddProjectPopup } from '@/components/shared/UnifiedAddProjectPopup';

interface AddProjectAllocationProps {
  memberId: string;
  weekStartDate: string;
  existingProjectIds: string[];
  onAdd: () => void;
  variant?: 'default' | 'compact';
}

export const AddProjectAllocation: React.FC<AddProjectAllocationProps> = ({
  memberId,
  weekStartDate,
  existingProjectIds,
  onAdd,
  variant = 'default'
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === 'compact' ? (
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full border border-dashed border-muted-foreground/50 hover:border-primary hover:bg-primary/10"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="glass hover:glass-elevated"
        >
          <Plus className="h-3 w-3 mr-1.5" />
          Add Project
        </Button>
      )}

      <UnifiedAddProjectPopup
        open={open}
        onOpenChange={setOpen}
        existingProjectIds={existingProjectIds}
        memberId={memberId}
        weekStartDate={weekStartDate}
        showAllocationInput={true}
        variant="dialog"
        onAllocationAdded={onAdd}
      />
    </>
  );
};
