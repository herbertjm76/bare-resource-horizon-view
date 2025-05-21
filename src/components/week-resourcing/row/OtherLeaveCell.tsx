
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
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
  const [inputValue, setInputValue] = useState<string>(leaveValue.toString());
  const [notesValue, setNotesValue] = useState<string>(notes);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesValue(e.target.value);
  };
  
  const handleSave = () => {
    onLeaveInputChange(memberId, 'sick', inputValue);
    onNotesChange(memberId, notesValue);
    setIsOpen(false);
  };
  
  return (
    <TableCell className="leave-cell text-center p-1 border-r">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="w-full h-full flex justify-center items-center cursor-pointer">
            {leaveValue > 0 ? (
              <div className="w-6 h-6 rounded-full bg-gray-250 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">{leaveValue}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Other Leave</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hours</label>
              <Input
                type="number"
                min="0"
                max="40"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={notesValue}
                onChange={handleNotesChange}
                placeholder="Add details about the leave..."
                className="resize-none h-20"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TableCell>
  );
};
