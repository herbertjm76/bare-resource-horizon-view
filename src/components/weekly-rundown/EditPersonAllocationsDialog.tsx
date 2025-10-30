import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResourceAllocationsDB } from '@/hooks/allocations/useResourceAllocationsDB';
import { toast } from 'sonner';
import { format, startOfWeek } from 'date-fns';

interface EditPersonAllocationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: any;
  projectId?: string;
  selectedWeek: Date;
}

export const EditPersonAllocationsDialog: React.FC<EditPersonAllocationsDialogProps> = ({
  open,
  onOpenChange,
  person,
  projectId,
  selectedWeek
}) => {
  const [hours, setHours] = useState<Record<string, number>>({});
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekKey = format(weekStart, 'yyyy-MM-dd');

  const handleSave = async (projectId: string, projectName: string) => {
    try {
      const hoursValue = hours[projectId] || 0;
      if (hoursValue > 0) {
        // Here you would call your API to save the allocation
        toast.success(`Updated allocation for ${projectName}`);
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save allocation');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Allocations - {person.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground mb-4">
            Week: {format(weekStart, 'MMM dd, yyyy')}
          </div>

          {person.projects && person.projects.length > 0 ? (
            <div className="space-y-3">
              {person.projects.map((project: any) => (
                <div key={project.id} className="flex items-center justify-between gap-4 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{project.name}</p>
                    <p className="text-sm text-muted-foreground">Current: {project.hours}h</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="168"
                      placeholder={project.hours.toString()}
                      value={hours[project.id] || ''}
                      onChange={(e) => setHours({ ...hours, [project.id]: parseFloat(e.target.value) || 0 })}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">hours</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleSave(project.id, project.name)}
                      disabled={!hours[project.id]}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No projects allocated
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
