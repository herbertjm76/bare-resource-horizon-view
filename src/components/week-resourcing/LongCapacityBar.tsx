import React from "react";

interface LongCapacityBarProps {
  totalUsedHours: number;
  totalCapacity: number;
  compact?: boolean;
}

export const LongCapacityBar: React.FC<LongCapacityBarProps> = ({
  totalUsedHours,
  totalCapacity,
  compact = false
}) => {
  const utilization = totalCapacity > 0 ? (totalUsedHours / totalCapacity) * 100 : 0;
  const rate = Math.round(utilization);

  let barColor = "#6366f1";
  if (rate > 100) barColor = "#ef4444";
  else if (rate >= 95) barColor = "#22c55e";
  else if (rate >= 80) barColor = "#f59e42";
  else if (rate >= 50) barColor = "#3b82f6";

  // more compact layout
  if (compact) {
    return (
      <div className="flex flex-col items-center w-full" style={{ minWidth: 62, maxWidth: 100, fontSize: 11, lineHeight: "14px" }}>
        <div
          className="w-[54px] h-3 rounded border border-gray-300 bg-gray-100 overflow-hidden relative"
          style={{ minWidth: 54, maxWidth: 80, height: 13 }}
        >
          <div
            className="h-full transition-all duration-300 rounded"
            style={{
              width: `${Math.min(utilization, 100)}%`,
              backgroundColor: barColor
            }}
          />
          {utilization > 100 && (
            <div
              className="absolute top-0 right-0 h-full w-3 bg-red-500"
              style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6, opacity: 0.20 }}
            />
          )}
        </div>
        <span className="font-semibold mt-0.5 select-none" style={{
          color:
            rate > 100 ? "#ef4444"
            : rate >= 95 ? "#22c55e"
            : rate >= 80 ? "#f59e42"
            : rate >= 50 ? "#3b82f6"
            : "#737373",
          fontSize: 10,
          marginTop: 2
        }}>
          {rate}%
        </span>
      </div>
    );
  }

  // ... keep existing code (expanded mode/design) ...
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[180px] sm:w-[240px] h-5 rounded-full border border-gray-300 bg-gray-100 overflow-hidden relative">
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{
            width: `${Math.min(utilization, 100)}%`,
            backgroundColor: barColor,
          }}
        />
        {utilization > 100 && (
          <div
            className="absolute top-0 right-0 h-full w-5 bg-red-500"
            style={{ borderTopRightRadius: 999, borderBottomRightRadius: 999, opacity: 0.24 }}
          />
        )}
      </div>
      <span className="text-[13px] font-semibold mt-1 select-none"
        style={{
          color:
            rate > 100 ? "#ef4444"
            : rate >= 95 ? "#22c55e"
            : rate >= 80 ? "#f59e42"
            : rate >= 50 ? "#3b82f6"
            : "#6b7280"
        }}
      >
        {rate}% used
      </span>
      <span className="text-xs text-gray-400 mt-0.5">{totalUsedHours}h of {totalCapacity}h</span>
    </div>
  );
}
