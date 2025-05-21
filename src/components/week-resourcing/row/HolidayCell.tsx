
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface HolidayCellProps {
  holidayHours: number;
  memberId: string;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
}

export const HolidayCell: React.FC<HolidayCellProps> = ({
  holidayHours,
  memberId,
  onLeaveInputChange
}) => {
  const [inputValue, setInputValue] = useState<string>(holidayHours.toString());
  const [isOpen, setIsOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSave = () => {
    onLeaveInputChange(memberId, 'holiday', inputValue);
    setIsOpen(false);
  };
  
  return (
    <TableCell className="leave-cell text-center p-1 border-r">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="w-full h-full flex justify-center items-center cursor-pointer">
            {holidayHours > 0 ? (
              <div className="w-6 h-6 rounded-full bg-gray-250 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">{holidayHours}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Holiday Hours</h4>
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
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TableCell>
  );
};
