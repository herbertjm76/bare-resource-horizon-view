import React, { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface MultiLeaveBadgeCellProps {
  annualLeave: number;
  holidayHours: number;
  otherLeave: number;
  remarks?: string;
  leaveDays?: Array<{ date: string; hours: number }>;
  className?: string;
  editableOther?: boolean;
  onOtherLeaveChange?: (value: number) => void;
}

export const MultiLeaveBadgeCell: React.FC<MultiLeaveBadgeCellProps> = ({
  annualLeave,
  holidayHours,
  otherLeave = 0,
  remarks = "",
  className = "",
  editableOther = false,
  onOtherLeaveChange,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [localOther, setLocalOther] = useState(otherLeave.toString());

  const handleOtherBlur = () => {
    const parsed = Math.max(0, parseFloat(localOther) || 0);
    setEditMode(false);
    if (onOtherLeaveChange) onOtherLeaveChange(parsed);
  };

  return (
    <TableCell className={cn("text-center border-r border-gray-200 px-2 py-1", className)}>
      <div className="flex flex-col gap-1 items-center">
        <div className="flex gap-2 items-end">
          {/* Annual Leave */}
          <div className="flex flex-col items-center">
            <Badge variant="outline" className="w-10 h-8 flex items-center justify-center text-base font-bold text-blue-700 border-blue-200 bg-blue-50">
              {annualLeave}
            </Badge>
            <span className="text-[10px] mt-0.5 text-blue-700 font-medium">Annual</span>
          </div>
          {/* Holiday Leave */}
          <div className="flex flex-col items-center">
            <Badge variant="outline" className="w-10 h-8 flex items-center justify-center text-base font-bold text-yellow-700 border-yellow-200 bg-yellow-50">
              {holidayHours}
            </Badge>
            <span className="text-[10px] mt-0.5 text-yellow-700 font-medium">Holiday</span>
          </div>
          {/* Other Leave */}
          <div className="flex flex-col items-center">
            {!editableOther || !onOtherLeaveChange ? (
              <>
                <Badge variant="outline" className="w-10 h-8 flex items-center justify-center text-base font-bold text-purple-700 border-purple-200 bg-purple-50">
                  {otherLeave}
                </Badge>
                <span className="text-[10px] mt-0.5 text-purple-700 font-medium">Other</span>
              </>
            ) : editMode ? (
              <>
                <Input
                  autoFocus
                  type="number"
                  value={localOther}
                  min={0}
                  max={40}
                  step={0.5}
                  className="w-10 h-8 text-center text-base border-purple-300 focus:border-purple-500"
                  onChange={e => setLocalOther(e.target.value.replace(/[^0-9.]/g, ""))}
                  onBlur={handleOtherBlur}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  style={{ padding: 0 }}
                />
                <span className="text-[10px] mt-0.5 text-purple-700 font-medium">Other</span>
              </>
            ) : (
              <>
                <button
                  className="focus:outline-none"
                  tabIndex={0}
                  onClick={() => setEditMode(true)}
                  aria-label="Edit other leave"
                  style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                >
                  <Badge variant="outline" className="w-10 h-8 flex items-center justify-center text-base font-bold text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100 cursor-pointer transition">
                    {otherLeave}
                  </Badge>
                </button>
                <span className="text-[10px] mt-0.5 text-purple-700 font-medium">Other</span>
              </>
            )}
          </div>
        </div>
        {remarks && (
          <span className="text-xs text-gray-500 mt-1 truncate max-w-[128px]">{remarks}</span>
        )}
      </div>
    </TableCell>
  );
};
