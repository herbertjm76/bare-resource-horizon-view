
import React from "react";
import { TableCell } from "@/components/ui/table";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { EnhancedTooltip } from "../EnhancedTooltip";

interface LeaveBadgeCellProps {
  annualLeave: number;
  holidayHours: number;
  otherLeave?: number;
  remarks?: string;
  leaveDays?: Array<{ date: string; hours: number }>;
  className?: string;
}

export const LeaveBadgeCell: React.FC<LeaveBadgeCellProps> = ({
  annualLeave,
  holidayHours,
  otherLeave = 0,
  remarks = "",
  leaveDays = [],
  className = "",
}) => {
  // Build badge text
  const segments = [
    `A: ${annualLeave}h`,
    `H: ${holidayHours}h`,
    `O: ${otherLeave}h`
  ];
  const leaveStr = segments.join(" ");
  const text = remarks
    ? `${leaveStr} | ${remarks}`
    : leaveStr;

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
        <div className="flex justify-center">
          <StandardizedBadge variant="secondary" size="sm" className="truncate max-w-[104px]">
            {text}
          </StandardizedBadge>
        </div>
      </EnhancedTooltip>
    </TableCell>
  );
};
