import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { format, startOfWeek } from 'date-fns';

interface EditProjectAllocationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  selectedWeek: Date;
}

export const EditProjectAllocationsDialog: React.FC<EditProjectAllocationsDialogProps> = ({
  open,
  onOpenChange,
  project,
  selectedWeek
}) => {
  const [hours, setHours] = useState<Record<string, number>>({});
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });

  const handleSave = async (memberId: string, memberName: string) => {
    try {
      const hoursValue = hours[memberId] || 0;
      if (hoursValue > 0) {
        // Here you would call your API to save the allocation
        toast.success(`Updated allocation for ${memberName}`);
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
          <DialogTitle>Edit Team Allocations - {project.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground mb-4">
            Week: {format(weekStart, 'MMM dd, yyyy')}
          </div>

          {project.teamMembers && project.teamMembers.length > 0 ? (
            <div className="space-y-3">
              {project.teamMembers.map((member: any) => (
                <div key={member.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {member.name?.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.name}</p>
                    <p className="text-sm text-muted-foreground">Current: {Math.round(member.hours || 0)}h</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="168"
                      placeholder={Math.round(member.hours || 0).toString()}
                      value={hours[member.id] || ''}
                      onChange={(e) => setHours({ ...hours, [member.id]: parseFloat(e.target.value) || 0 })}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">hours</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleSave(member.id, member.name)}
                      disabled={!hours[member.id]}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No team members allocated
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
