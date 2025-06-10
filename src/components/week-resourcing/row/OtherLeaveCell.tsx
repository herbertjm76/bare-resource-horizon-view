
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OtherLeaveCellProps {
  leaveValue: number;
  memberId: string;
  notes: string;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
  onNotesChange: (memberId: string, notes: string) => void;
  className?: string;
}

export const OtherLeaveCell: React.FC<OtherLeaveCellProps> = ({
  leaveValue,
  memberId,
  notes,
  onLeaveInputChange,
  onNotesChange,
  className
}) => {
  const [localValue, setLocalValue] = useState(leaveValue.toString());
  const [localNotes, setLocalNotes] = useState(notes);

  const handleBlur = () => {
    const numValue = parseFloat(localValue) || 0;
    onLeaveInputChange(memberId, 'other', numValue.toString());
  };

  const handleNotesBlur = () => {
    onNotesChange(memberId, localNotes);
  };

  const hasNotes = notes && notes.trim().length > 0;

  return (
    <TableCell className={cn("p-1 text-center", className)}>
      <div className="flex items-center justify-center gap-1">
        <Input
          type="number"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          className="w-12 h-6 text-center text-xs"
          min="0"
          max="40"
          step="0.5"
        />
        <Popover>
          <PopoverTrigger asChild>
            <button 
              className={`p-1 rounded hover:bg-gray-100 ${hasNotes ? 'text-blue-600' : 'text-gray-400'}`}
              title="Add notes"
            >
              <MessageSquare className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add notes about leave..."
                className="text-xs"
                rows={3}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TableCell>
  );
};
