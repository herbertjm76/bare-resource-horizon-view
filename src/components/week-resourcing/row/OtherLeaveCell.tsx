
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(leaveValue === 0 ? '' : leaveValue.toString());
  const [notesValue, setNotesValue] = useState(notes || '');
  
  const handleSave = () => {
    onLeaveInputChange(memberId, 'other', inputValue);
    onNotesChange(memberId, notesValue);
    setOpen(false);
  };
  
  return (
    <TableCell className="relative p-0 text-center border-r">
      <div className="p-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-center gap-1 cursor-pointer">
              <span className="text-sm">{leaveValue || '0'}</span>
              {notes && (
                <span className="text-xs text-muted-foreground ml-1" title="Has notes">
                  <Edit2 className="h-3 w-3" />
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="center">
            <div className="space-y-3 p-2">
              <div className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="otherLeave" className="text-xs font-medium">
                    Other Leave (hours)
                  </label>
                  <Input
                    id="otherLeave"
                    className="w-full h-8"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    type="number"
                    min="0"
                    max="40"
                    placeholder="0"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label htmlFor="leaveNotes" className="text-xs font-medium">
                    Notes
                  </label>
                  <Textarea
                    id="leaveNotes"
                    className="w-full min-h-[80px]"
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    placeholder="Add notes about this leave..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="sm" variant="default" onClick={handleSave} className="gap-1">
                  <Check className="h-3 w-3" /> Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TableCell>
  );
};
