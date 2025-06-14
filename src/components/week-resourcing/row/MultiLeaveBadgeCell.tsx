
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EnhancedTooltip } from '../EnhancedTooltip';

interface MultiLeaveBadgeCellProps {
  annualLeave: number;
  holidayHours: number;
  otherLeave: number;
  remarks: string;
  leaveDays: Array<{ date: string; hours: number }>;
  className?: string;
  editableOther?: boolean;
  onOtherLeaveChange?: (value: number) => void;
  compact?: boolean;
}

export const MultiLeaveBadgeCell: React.FC<MultiLeaveBadgeCellProps> = ({
  annualLeave,
  holidayHours,
  otherLeave,
  remarks,
  leaveDays,
  className = "",
  editableOther = false,
  onOtherLeaveChange,
  compact = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(otherLeave.toString());

  const handleOtherLeaveEdit = () => {
    if (editableOther) {
      setIsEditing(true);
      setLocalValue(otherLeave.toString());
    }
  };

  const handleOtherLeaveBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(localValue) || 0;
    if (onOtherLeaveChange) {
      onOtherLeaveChange(numValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOtherLeaveBlur();
    }
  };

  // Build consolidated leave text
  const segments = [
    `A: ${annualLeave}h`,
    `H: ${holidayHours}h`,
    `O: ${otherLeave}h`
  ];
  const leaveStr = segments.join(' ');
  const text = remarks ? `${leaveStr} | ${remarks}` : leaveStr;

  if (compact) {
    return (
      <TableCell className={`text-center border-r border-gray-200 leave-column ${className}`}>
        <EnhancedTooltip
          type="total"
          totalUsedHours={annualLeave + holidayHours + otherLeave}
          weeklyCapacity={annualLeave + holidayHours + otherLeave}
          annualLeave={annualLeave}
          holidayHours={holidayHours}
          leaveDays={leaveDays}
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex gap-0.5">
              {annualLeave > 0 && (
                <Badge variant="outline" className="compact-leave-badge bg-blue-50 text-blue-700 border-blue-200">
                  A:{annualLeave}
                </Badge>
              )}
              {holidayHours > 0 && (
                <Badge variant="outline" className="compact-leave-badge bg-yellow-50 text-yellow-700 border-yellow-200">
                  H:{holidayHours}
                </Badge>
              )}
              {(otherLeave > 0 || editableOther) && (
                editableOther && isEditing ? (
                  <Input
                    type="number"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleOtherLeaveBlur}
                    onKeyPress={handleKeyPress}
                    className="w-8 h-4 text-[9px] p-0 text-center"
                    autoFocus
                  />
                ) : (
                  <Badge 
                    variant="outline" 
                    className={`compact-leave-badge bg-purple-50 text-purple-700 border-purple-200 ${editableOther ? 'cursor-pointer hover:bg-purple-100' : ''}`}
                    onClick={handleOtherLeaveEdit}
                  >
                    O:{otherLeave}
                  </Badge>
                )
              )}
            </div>
          </div>
        </EnhancedTooltip>
      </TableCell>
    );
  }

  return (
    <TableCell className={`text-center border-r border-gray-200 ${className}`}>
      <EnhancedTooltip
        type="total"
        totalUsedHours={annualLeave + holidayHours + otherLeave}
        weeklyCapacity={annualLeave + holidayHours + otherLeave}
        annualLeave={annualLeave}
        holidayHours={holidayHours}
        leaveDays={leaveDays}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap gap-1 justify-center">
            {annualLeave > 0 && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
                Annual: {annualLeave}h
              </Badge>
            )}
            {holidayHours > 0 && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                Holiday: {holidayHours}h
              </Badge>
            )}
            {(otherLeave > 0 || editableOther) && (
              editableOther && isEditing ? (
                <Input
                  type="number"
                  value={localValue}
                  onChange={(e) => setLocalValue(e.target.value)}
                  onBlur={handleOtherLeaveBlur}
                  onKeyPress={handleKeyPress}
                  className="w-16 h-8 text-xs text-center"
                  autoFocus
                />
              ) : (
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-1 bg-purple-50 text-purple-700 border-purple-200 ${editableOther ? 'cursor-pointer hover:bg-purple-100' : ''}`}
                  onClick={handleOtherLeaveEdit}
                >
                  Other: {otherLeave}h
                </Badge>
              )
            )}
          </div>
          {remarks && (
            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200 max-w-[200px] truncate">
              {remarks}
            </Badge>
          )}
        </div>
      </EnhancedTooltip>
    </TableCell>
  );
};
