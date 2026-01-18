
import React from "react";
import { useAppSettings } from "@/hooks/useAppSettings";
import { formatUtilizationSummary } from "@/utils/allocationDisplay";

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
  const { displayPreference } = useAppSettings();
  const utilization = totalCapacity > 0 ? (totalUsedHours / totalCapacity) * 100 : 0;
  const rate = Math.round(utilization);

  // Theme-connected bar background
  const barBackground = 'hsl(var(--gradient-start))';

  // Compact layout: taller bar for better visibility
  if (compact) {
    return (
      <div className="long-bar w-full relative" style={{ height: 22 }}>
        <div
          className="w-full h-full rounded-sm border bg-muted overflow-hidden relative"
          style={{ borderColor: 'hsl(var(--border))' }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${Math.min(utilization, 100)}%`,
              background: barBackground,
              opacity: 0.85,
            }}
          />

          {utilization > 100 && (
            <div
              className="absolute top-0 right-0 h-full"
              style={{
                width: 6,
                backgroundColor: 'hsl(var(--destructive) / 0.25)',
              }}
            />
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[11px] font-semibold select-none"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              {rate}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Expanded mode
  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="w-[180px] sm:w-[240px] h-5 rounded-full border bg-muted overflow-hidden relative"
        style={{ borderColor: 'hsl(var(--border))' }}
      >
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{
            width: `${Math.min(utilization, 100)}%`,
            background: barBackground,
          }}
        />
        {utilization > 100 && (
          <div
            className="absolute top-0 right-0 h-full w-5"
            style={{
              borderTopRightRadius: 999,
              borderBottomRightRadius: 999,
              backgroundColor: 'hsl(var(--destructive) / 0.24)',
            }}
          />
        )}
      </div>
      <span
        className="text-[13px] font-semibold mt-1 select-none"
        style={{ color: 'hsl(var(--foreground))' }}
      >
        {rate}% used
      </span>
      <span className="text-xs mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
        {formatUtilizationSummary(totalUsedHours, totalCapacity, displayPreference)}
      </span>
    </div>
  );
}
