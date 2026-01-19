import React, { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectAbbreviation, getProjectTooltip } from '@/utils/projectDisplay';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface ProjectAllocationSegmentProps {
  project: {
    id: string;
    name: string;
    code: string;
    abbreviation?: string | null;
    hours: number;
  };
  /** Week capacity in hours */
  capacity: number;
  /** Segment color */
  color?: string;
}

/**
 * Display-only segment for the "Weekly Allocation" bar.
 * (Inline editing removed — use the pencil button on the card instead.)
 */
export const ProjectAllocationSegment: React.FC<ProjectAllocationSegmentProps> = ({
  project,
  capacity,
  color,
}) => {
  const { displayPreference } = useAppSettings();

  const percentage = useMemo(() => {
    if (!capacity) return 0;
    return (project.hours / capacity) * 100;
  }, [project.hours, capacity]);

  const displayText = useMemo(
    () => getProjectAbbreviation({ code: project.code, name: project.name, abbreviation: project.abbreviation }),
    [project.code, project.name, project.abbreviation]
  );

  const tooltipText = useMemo(
    () => getProjectTooltip({ code: project.code, name: project.name }),
    [project.code, project.name]
  );

  const formatted = useMemo(
    () => formatAllocationValue(project.hours, capacity, displayPreference),
    [project.hours, capacity, displayPreference]
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="h-full flex items-center justify-center text-white font-semibold text-sm hover:brightness-110 transition-all border-r border-white/20"
          style={{
            width: `${percentage}%`,
            backgroundColor: color || 'hsl(var(--primary))',
          }}
          role="img"
          aria-label={`${displayText}: ${formatted}`}
        >
          {percentage > 10 && <span>{displayText} • {formatted}</span>}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-semibold">{tooltipText}</p>
        <p className="text-xs">{formatted}</p>
      </TooltipContent>
    </Tooltip>
  );
};
