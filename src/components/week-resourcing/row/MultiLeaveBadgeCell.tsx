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
  compact?: boolean; // NEW
}

export const MultiLeaveBadgeCell: React.FC<MultiLeaveBadgeCellProps> = ({
  annualLeave,
  holidayHours,
  otherLeave = 0,
  remarks = "",
  className = "",
  editableOther = false,
  onOtherLeaveChange,
  compact = false
}) => {
  const [editMode, setEditMode] = useState(false);
  const [localOther, setLocalOther] = useState(otherLeave.toString());

  const handleOtherBlur = () => {
    const parsed = Math.max(0, parseFloat(localOther) || 0);
    setEditMode(false);
    if (onOtherLeaveChange) onOtherLeaveChange(parsed);
  };

  // use "badge-compact" style when compact
  const badgeClass = compact
    ? "w-6 h-6 flex items-center justify-center text-[11px] font-bold px-0 py-0 border border-2"
    : "w-10 h-8 flex items-center justify-center text-base font-bold px-1 py-0 border-2";
  const badgeLabelClass = compact
    ? "text-[9px] mt-0.5 leading-none font-normal h-3 truncate max-w-[40px]"
    : "text-[10px] mt-0.5 font-medium";

  return (
    <TableCell className={cn("text-center border-r border-gray-200", className)} style={compact ? { minWidth: 52, padding: 0 } : {}}>
      <div className={cn("flex flex-col gap-1 items-center", compact ? "min-w-[52px]" : "")}>
        <div className={cn("flex gap-1 items-end", compact ? "" : "gap-2")}>
          {/* Annual Leave */}
          <div className="flex flex-col items-center">
            <Badge
              variant="outline"
              className={cn(badgeClass, "text-blue-700 border-blue-200 bg-blue-50", compact && "min-w-[20px]")}
            >
              {annualLeave}
            </Badge>
            <span className={cn(badgeLabelClass, "text-blue-700")}>A</span>
          </div>
          {/* Holiday Leave */}
          <div className="flex flex-col items-center">
            <Badge
              variant="outline"
              className={cn(badgeClass, "text-yellow-700 border-yellow-200 bg-yellow-50", compact && "min-w-[20px]")}
            >
              {holidayHours}
            </Badge>
            <span className={cn(badgeLabelClass, "text-yellow-700")}>H</span>
          </div>
          {/* Other Leave */}
          <div className="flex flex-col items-center">
            {!editableOther || !onOtherLeaveChange ? (
              <>
                <Badge
                  variant="outline"
                  className={cn(badgeClass, "text-purple-700 border-purple-200 bg-purple-50", compact && "min-w-[20px]")}
                >
                  {otherLeave}
                </Badge>
                <span className={cn(badgeLabelClass, "text-purple-700")}>O</span>
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
                  className={cn(
                    badgeClass,
                    "border-purple-300 focus:border-purple-500"
                  )}
                  style={{
                    width: compact ? 24 : 40,
                    height: compact ? 24 : 32,
                    padding: 0,
                    textAlign: "center",
                    fontSize: 11
                  }}
                  onChange={e => setLocalOther(e.target.value.replace(/[^0-9.]/g, ""))}
                  onBlur={handleOtherBlur}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
                <span className={cn(badgeLabelClass, "text-purple-700")}>O</span>
              </>
            ) : (
              <>
                <button
                  className="focus:outline-none"
                  tabIndex={0}
                  onClick={() => setEditMode(true)}
                  aria-label="Edit other leave"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    width: compact ? 24 : 40,
                    height: compact ? 24 : 32
                  }}
                >
                  <Badge
                    variant="outline"
                    className={cn(badgeClass, "text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100 cursor-pointer transition")}
                  >
                    {otherLeave}
                  </Badge>
                </button>
                <span className={cn(badgeLabelClass, "text-purple-700")}>O</span>
              </>
            )}
          </div>
        </div>
        {remarks && !compact && (
          <span className="text-xs text-gray-500 mt-1 truncate max-w-[128px]">{remarks}</span>
        )}
      </div>
    </TableCell>
  );
};
