import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useLeaveTypes } from '@/hooks/leave/useLeaveTypes';
import { TeamMember } from '@/components/dashboard/types';

interface EditLeaveCalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  date: string;
  currentHours: number;
  currentLeaveTypeId?: string;
  onSave: (memberId: string, date: string, hours: number, leaveTypeId?: string) => void;
}

export const EditLeaveCalendarDialog: React.FC<EditLeaveCalendarDialogProps> = ({
  open,
  onOpenChange,
  member,
  date,
  currentHours,
  currentLeaveTypeId,
  onSave
}) => {
  const { leaveTypes, isLoading: isLoadingLeaveTypes } = useLeaveTypes();
  const [hours, setHours] = useState<number>(currentHours);
  const [leaveTypeId, setLeaveTypeId] = useState<string>(currentLeaveTypeId || '');

  // Reset state when dialog opens with new data
  useEffect(() => {
    if (open) {
      setHours(currentHours);
      setLeaveTypeId(currentLeaveTypeId || (leaveTypes.length > 0 ? leaveTypes[0].id : ''));
    }
  }, [open, currentHours, currentLeaveTypeId, leaveTypes]);

  // Set default leave type when leave types load
  useEffect(() => {
    if (!leaveTypeId && leaveTypes.length > 0) {
      setLeaveTypeId(leaveTypes[0].id);
    }
  }, [leaveTypes, leaveTypeId]);

  if (!member) return null;

  const getUserInitials = (): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarUrl = (): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  const getMemberDisplayName = (): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

  const formattedDate = date ? format(new Date(date + 'T00:00:00'), 'EEEE, MMMM d, yyyy') : '';

  const handleSave = () => {
    if (member) {
      onSave(member.id, date, hours, hours > 0 ? leaveTypeId : undefined);
      onOpenChange(false);
    }
  };

  const handleQuickSet = (value: number) => {
    setHours(value);
  };

  const selectedLeaveType = leaveTypes.find(lt => lt.id === leaveTypeId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Edit Leave
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Member Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={getAvatarUrl()} alt={getMemberDisplayName()} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{getMemberDisplayName()}</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          {/* Leave Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="leave-type">Leave Type</Label>
            <Select value={leaveTypeId} onValueChange={setLeaveTypeId} disabled={isLoadingLeaveTypes}>
              <SelectTrigger id="leave-type">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((lt) => (
                  <SelectItem key={lt.id} value={lt.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: lt.color || '#3B82F6' }}
                      />
                      <span>{lt.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hours Input */}
          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hours
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="hours"
                type="number"
                min={0}
                max={8}
                step={0.5}
                value={hours}
                onChange={(e) => setHours(Math.min(8, Math.max(0, parseFloat(e.target.value) || 0)))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">/ 8 hours</span>
            </div>
          </div>

          {/* Quick Set Buttons */}
          <div className="flex gap-2">
            <Button 
              variant={hours === 8 ? "default" : "outline"} 
              size="sm" 
              onClick={() => handleQuickSet(8)}
              className="flex-1"
            >
              Full Day (8h)
            </Button>
            <Button 
              variant={hours === 4 ? "default" : "outline"} 
              size="sm" 
              onClick={() => handleQuickSet(4)}
              className="flex-1"
            >
              Half Day (4h)
            </Button>
            <Button 
              variant={hours === 0 ? "destructive" : "outline"} 
              size="sm" 
              onClick={() => handleQuickSet(0)}
              className="flex-1"
            >
              Clear
            </Button>
          </div>

          {/* Preview */}
          {hours > 0 && selectedLeaveType && (
            <div className="p-3 border rounded-lg bg-card">
              <p className="text-sm text-muted-foreground mb-1">Preview:</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-6 rounded flex items-center justify-center text-sm font-bold text-white"
                  style={{ 
                    backgroundColor: selectedLeaveType.color || '#3B82F6',
                    opacity: hours >= 8 ? 1 : 0.5
                  }}
                >
                  {hours}
                </div>
                <span className="text-sm text-foreground">
                  {selectedLeaveType.name} - {hours >= 8 ? 'Full Day' : 'Partial Day'}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
