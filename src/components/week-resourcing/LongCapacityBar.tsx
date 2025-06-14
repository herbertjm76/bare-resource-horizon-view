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

  // Compact layout with full-width bar and text inside
  if (compact) {
    return (
      <div className="w-full relative" style={{ minWidth: 80, height: 20 }}>
        <div
          className="w-full h-full rounded border border-gray-300 bg-gray-100 overflow-hidden relative"
          style={{ height: 20 }}
        >
          <div
            className="h-full transition-all duration-300 rounded relative"
            style={{
              width: `${Math.min(utilization, 100)}%`,
              backgroundColor: barColor
            }}
          />
          {utilization > 100 && (
            <div
              className="absolute top-0 right-0 h-full w-4 bg-red-500"
              style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4, opacity: 0.20 }}
            />
          )}
          {/* Text overlay inside the bar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className="font-semibold text-white text-xs mix-blend-difference select-none"
              style={{ fontSize: 11 }}
            >
              {rate}%
            </span>
          </div>
        </div>
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
