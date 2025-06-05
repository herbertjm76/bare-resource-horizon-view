
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { ManualInputCell } from './ManualInputCell';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

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
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const handleNotesSubmit = (newNotes: string) => {
    onNotesChange(memberId, newNotes);
    setIsNotesOpen(false);
  };

  return (
    <TableCell className="text-center border-r p-1 relative">
      <div className="flex items-center justify-center gap-1">
        <div className="flex items-center justify-center">
          <input
            type="number"
            min="0"
            max="40"
            value={leaveValue || ''}
            onChange={(e) => onLeaveInputChange(memberId, 'sick', e.target.value)}
            className="w-12 h-8 text-xs text-center border-2 border-gray-300 rounded-lg bg-gray-50 focus:border-brand-violet focus:bg-white transition-all"
            placeholder="0"
          />
        </div>
        
        <Popover open={isNotesOpen} onOpenChange={setIsNotesOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 w-6 p-0 ${notes ? 'text-brand-violet' : 'text-gray-400'}`}
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Notes</h4>
              <Textarea
                value={notes}
                onChange={(e) => onNotesChange(memberId, e.target.value)}
                placeholder="Add notes about leave..."
                className="min-h-20 text-xs"
              />
              <Button
                size="sm"
                onClick={() => setIsNotesOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TableCell>
  );
};
