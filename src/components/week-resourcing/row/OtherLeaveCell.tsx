
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';

interface OtherLeaveCellProps {
  leaveValue: number;
  memberId: string;
  notes?: string;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
  onNotesChange?: (memberId: string, notes: string) => void;
}

export const OtherLeaveCell: React.FC<OtherLeaveCellProps> = ({
  leaveValue,
  memberId,
  notes = '',
  onLeaveInputChange,
  onNotesChange
}) => {
  const [localNotes, setLocalNotes] = useState(notes);
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNotes(e.target.value);
  };
  
  const saveNotes = () => {
    if (onNotesChange) {
      onNotesChange(memberId, localNotes);
    }
  };

  return (
    <TableCell className="border-r p-0 text-center w-[120px]">
      <div className="flex items-center">
        <Input
          type="number"
          min="0"
          max="40"
          value={leaveValue || ''}
          onChange={(e) => onLeaveInputChange(memberId, 'other', e.target.value)}
          className="w-12 h-8 text-center p-0 mr-1 bg-[#FEC6A1]"
          placeholder="0"
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full"
            >
              <PencilIcon size={12} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-2">
              <h4 className="font-medium">Other Leave Notes</h4>
              <Textarea 
                placeholder="Enter notes about this leave..." 
                className="min-h-[100px]"
                value={localNotes}
                onChange={handleNotesChange}
              />
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  onClick={saveNotes}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TableCell>
  );
};
