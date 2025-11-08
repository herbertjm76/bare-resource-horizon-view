import React from "react";
import { TableCell } from "@/components/ui/table";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { EnhancedTooltip } from "../EnhancedTooltip";

interface LeaveProgressBarCellProps {
  annualLeave: number;
  holidayHours: number;
  otherLeave?: number;
  remarks?: string;
  leaveDays?: Array<{ date: string; hours: number }>;
  className?: string;
}

export const LeaveProgressBarCell: React.FC<LeaveProgressBarCellProps> = ({
  annualLeave,
  holidayHours,
  otherLeave = 0,
  remarks = "",
  leaveDays = [],
  className = "",
}) => {
  const totalLeave = annualLeave + holidayHours + otherLeave;
  // Avoid division by zero; all segments 0 width if no leave this week
  const aPct = totalLeave > 0 ? (annualLeave / totalLeave) * 100 : 0;
  const hPct = totalLeave > 0 ? (holidayHours / totalLeave) * 100 : 0;
  const oPct = totalLeave > 0 ? (otherLeave / totalLeave) * 100 : 0;

  // Pick hover background colors for progress bar segments
  const colors = {
    annual: "bg-blue-500",
    holiday: "bg-yellow-500",
    other: "bg-brand-violet",
    empty: "bg-gray-200",
  };

  // Set min width >0px for nonzero leave, to keep labels readable at small values
  const minSegmentWidth = 7;

  return (
    <TableCell className={`text-center border-r border-gray-200 ${className}`}>
      <EnhancedTooltip
        type="total"
        totalUsedHours={totalLeave}
        weeklyCapacity={totalLeave}
        annualLeave={annualLeave}
        holidayHours={holidayHours}
        leaveDays={leaveDays}
      >
        <div className="flex flex-col items-center min-w-[72px]">
          {/* Progress Bar */}
          <div className="flex w-full min-w-[54px] max-w-[108px] h-4 rounded overflow-hidden border border-gray-200 shadow-sm">
            {totalLeave === 0 ? (
              <div className={`flex-1 ${colors.empty}`} />
            ) : (
              <>
                {annualLeave > 0 && (
                  <div
                    className={`${colors.annual}`}
                    style={{
                      width: `${Math.max(aPct, minSegmentWidth)}%`,
                      minWidth: annualLeave ? minSegmentWidth : undefined,
                    }}
                    title={`Annual: ${annualLeave}h`}
                  />
                )}
                {holidayHours > 0 && (
                  <div
                    className={`${colors.holiday}`}
                    style={{
                      width: `${Math.max(hPct, minSegmentWidth)}%`,
                      minWidth: holidayHours ? minSegmentWidth : undefined,
                    }}
                    title={`Holiday: ${holidayHours}h`}
                  />
                )}
                {otherLeave > 0 && (
                  <div
                    className={`${colors.other}`}
                    style={{
                      width: `${Math.max(oPct, minSegmentWidth)}%`,
                      minWidth: otherLeave ? minSegmentWidth : undefined,
                    }}
                    title={`Other: ${otherLeave}h`}
                  />
                )}
              </>
            )}
          </div>
          {/* Legend or leave values */}
          <div className="flex flex-wrap gap-1 justify-center mt-1 text-xs font-medium">
            {annualLeave > 0 && (
              <span className="inline-flex items-center text-blue-600 whitespace-nowrap">A: {annualLeave}h</span>
            )}
            {holidayHours > 0 && (
              <span className="inline-flex items-center text-yellow-500 whitespace-nowrap">H: {holidayHours}h</span>
            )}
            {otherLeave > 0 && (
              <span className="inline-flex items-center text-brand-violet whitespace-nowrap">O: {otherLeave}h</span>
            )}
            {totalLeave === 0 && (
              <span className="text-gray-400">No leave</span>
            )}
          </div>
          {/* Remarks if present */}
          {remarks && (
            <StandardizedBadge variant="secondary" size="sm" className="truncate max-w-[92px] mt-1">
              {remarks}
            </StandardizedBadge>
          )}
        </div>
      </EnhancedTooltip>
    </TableCell>
  );
};
