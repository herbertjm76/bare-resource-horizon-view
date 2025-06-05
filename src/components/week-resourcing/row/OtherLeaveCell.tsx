
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface OtherLeaveCellProps {
  leaveValue: number;
  memberId: string;
  notes: string;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
  onNotesChange: (memberId: string, notes: string) => void;
}

export const OtherLeaveCell: React.FC<OtherLeaveCellProps> = ({
  leaveValue,
  memberId,
  notes,
  onLeaveInputChange,
  onNotesChange
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempHours, setTempHours] = useState(leaveValue.toString());
  const [tempNotes, setTempNotes] = useState(notes);

  const handleDialogOpen = () => {
    setTempHours(leaveValue.toString());
    setTempNotes(notes);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    onLeaveInputChange(memberId, 'sick', tempHours);
    onNotesChange(memberId, tempNotes);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setTempHours(leaveValue.toString());
    setTempNotes(notes);
    setIsDialogOpen(false);
  };

  return (
    <TableCell className="text-center border-r p-1">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-8 p-1 bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 text-purple-800 hover:from-purple-200 hover:to-purple-300 hover:border-purple-400 rounded-lg font-medium text-xs"
            onClick={handleDialogOpen}
          >
            <div className="flex items-center justify-center gap-1">
              <span>{leaveValue || 0}h</span>
              {notes && <MessageSquare className="h-3 w-3" />}
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Other Leave Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="40"
                value={tempHours}
                onChange={(e) => setTempHours(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Add notes about leave..."
                className="min-h-20"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TableCell>
  );
};
