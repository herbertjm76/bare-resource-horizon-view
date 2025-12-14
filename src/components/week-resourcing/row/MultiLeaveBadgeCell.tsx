
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

  // Calculate total leave
  const totalLeave = annualLeave + holidayHours + otherLeave;

  // Build tooltip content with breakdown
  const buildTooltipContent = () => {
    const parts: string[] = [];
    if (annualLeave > 0) parts.push(`Annual: ${annualLeave}h`);
    if (holidayHours > 0) parts.push(`Holiday: ${holidayHours}h`);
    if (otherLeave > 0) parts.push(`Other: ${otherLeave}h`);
    
    // Add leave days breakdown if available
    if (leaveDays && leaveDays.length > 0) {
      parts.push('---');
      leaveDays.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        parts.push(`${dayName}, ${dateStr}: ${day.hours}h`);
      });
    }
    
    return parts.join('\n');
  };

  if (compact) {
    // Don't render anything if no leave
    if (totalLeave === 0 && !editableOther) {
      return (
        <TableCell className={`text-center border-r border-gray-200 leave-column ${className}`}>
          <span className="text-gray-300">—</span>
        </TableCell>
      );
    }

    return (
      <TableCell className={`text-center border-r border-gray-200 leave-column ${className}`}>
        <EnhancedTooltip
          type="total"
          totalUsedHours={totalLeave}
          weeklyCapacity={totalLeave}
          annualLeave={annualLeave}
          holidayHours={holidayHours}
          leaveDays={leaveDays}
        >
          <div className="flex justify-center">
            {editableOther && isEditing ? (
              <Input
                type="number"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleOtherLeaveBlur}
                onKeyPress={handleKeyPress}
                className="w-10 h-5 text-xs p-0 text-center"
                autoFocus
              />
            ) : (
              <Badge 
                variant="outline" 
                className={`text-xs px-2 py-0.5 bg-amber-50 text-amber-700 border-amber-200 font-medium ${editableOther ? 'cursor-pointer hover:bg-amber-100' : ''}`}
                onClick={editableOther ? handleOtherLeaveEdit : undefined}
                title={buildTooltipContent()}
              >
                {totalLeave}h
              </Badge>
            )}
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
