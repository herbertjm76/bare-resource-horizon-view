import React, { useMemo, useState, useRef, useEffect } from 'react';
import { WeeklyDemandData, ProjectDemand } from '@/hooks/useDemandProjection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, addWeeks, parseISO, isBefore, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';

type GroupingType = 'department' | 'practice_area';

interface ForecastGanttProps {
  weeklyDemand: WeeklyDemandData[];
  projectDemands: ProjectDemand[];
  weeklyCapacity: number;
  numberOfWeeks: number;
  startDate: Date;
  grouping: GroupingType;
  onGroupingChange: (value: GroupingType) => void;
  projects: Array<{
    id: string;
    name: string;
    code: string;
    department?: string | null;
    contract_start_date?: string | null;
    contract_end_date?: string | null;
  }>;
  departments: Array<{ id: string; name: string }>;
  practiceAreas: Array<{ id: string; name: string }>;
}

// Color palette for groups
const GROUP_COLORS = [
  { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-500/20' },
  { bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-500/20' },
  { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-500/20' },
  { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-500/20' },
  { bg: 'bg-rose-500', text: 'text-rose-500', light: 'bg-rose-500/20' },
  { bg: 'bg-cyan-500', text: 'text-cyan-500', light: 'bg-cyan-500/20' },
  { bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-500/20' },
  { bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-500/20' },
];

interface ProjectRow {
  id: string;
  name: string;
  code: string;
  group: string;
  startDate: Date | null;
  endDate: Date | null;
  totalHours: number;
  weeklyHours: Record<string, number>; // week key -> hours
}

interface GroupedProjects {
  name: string;
  colorIndex: number;
  projects: ProjectRow[];
  totalHours: number;
}

export const ForecastGantt: React.FC<ForecastGanttProps> = ({
  weeklyDemand,
  projectDemands,
  weeklyCapacity,
  numberOfWeeks,
  startDate,
  grouping,
  onGroupingChange,
  projects,
  departments,
  practiceAreas,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  
  const hasRealData = weeklyDemand.some(week => week.totalDemand > 0);

  // Generate week columns
  const weeks = useMemo(() => {
    return Array.from({ length: numberOfWeeks }, (_, i) => {
      const weekStart = addWeeks(startDate, i);
      return {
        key: format(weekStart, 'yyyy-MM-dd'),
        label: format(weekStart, 'MMM d'),
        date: weekStart,
      };
    });
  }, [startDate, numberOfWeeks]);

  // Build project demand by week
  const projectWeeklyDemand = useMemo(() => {
    const demand: Record<string, Record<string, number>> = {};
    weeklyDemand.forEach(week => {
      const weekKey = week.weekKey;
      Object.entries(week.demandByProject).forEach(([projectId, hours]) => {
        if (!demand[projectId]) demand[projectId] = {};
        demand[projectId][weekKey] = hours;
      });
    });
    return demand;
  }, [weeklyDemand]);

  // Build project rows
  const projectRows: ProjectRow[] = useMemo(() => {
    return projects
      .filter(p => p.contract_start_date || p.contract_end_date || projectWeeklyDemand[p.id])
      .map(project => {
        const weeklyHours = projectWeeklyDemand[project.id] || {};
        const totalHours = Object.values(weeklyHours).reduce((sum, h) => sum + h, 0);
        
        return {
          id: project.id,
          name: project.name,
          code: project.code,
          group: project.department || 'Unassigned',
          startDate: project.contract_start_date ? parseISO(project.contract_start_date) : null,
          endDate: project.contract_end_date ? parseISO(project.contract_end_date) : null,
          totalHours,
          weeklyHours,
        };
      });
  }, [projects, projectWeeklyDemand]);

  // Group projects
  const groupedProjects: GroupedProjects[] = useMemo(() => {
    const groupList = grouping === 'department' ? departments : practiceAreas;
    const groupMap: Record<string, GroupedProjects> = {};
    
    groupList.forEach((g, index) => {
      groupMap[g.name] = {
        name: g.name,
        colorIndex: index % GROUP_COLORS.length,
        projects: [],
        totalHours: 0,
      };
    });
    groupMap['Unassigned'] = {
      name: 'Unassigned',
      colorIndex: groupList.length % GROUP_COLORS.length,
      projects: [],
      totalHours: 0,
    };

    projectRows.forEach(project => {
      const groupName = project.group || 'Unassigned';
      if (!groupMap[groupName]) {
        groupMap[groupName] = {
          name: groupName,
          colorIndex: Object.keys(groupMap).length % GROUP_COLORS.length,
          projects: [],
          totalHours: 0,
        };
      }
      groupMap[groupName].projects.push(project);
      groupMap[groupName].totalHours += project.totalHours;
    });

    return Object.values(groupMap)
      .filter(g => g.projects.length > 0)
      .sort((a, b) => b.totalHours - a.totalHours);
  }, [projectRows, departments, practiceAreas, grouping]);

  // Demo data
  const demoGroups: GroupedProjects[] = useMemo(() => {
    if (hasRealData) return [];
    
    const now = new Date();
    return [
      {
        name: 'Commercial',
        colorIndex: 0,
        totalHours: 420,
        projects: [
          { id: '1', name: 'Office Tower A', code: 'OTA', group: 'Commercial', startDate: now, endDate: addWeeks(now, 8), totalHours: 240, weeklyHours: {} },
          { id: '2', name: 'Retail Center', code: 'RTC', group: 'Commercial', startDate: addWeeks(now, 2), endDate: addWeeks(now, 10), totalHours: 180, weeklyHours: {} },
        ],
      },
      {
        name: 'Healthcare',
        colorIndex: 1,
        totalHours: 420,
        projects: [
          { id: '3', name: 'Hospital Wing', code: 'HSP', group: 'Healthcare', startDate: addWeeks(now, -1), endDate: addWeeks(now, 6), totalHours: 300, weeklyHours: {} },
          { id: '4', name: 'Medical Center', code: 'MDC', group: 'Healthcare', startDate: addWeeks(now, 4), endDate: addWeeks(now, 11), totalHours: 120, weeklyHours: {} },
        ],
      },
      {
        name: 'Education',
        colorIndex: 2,
        totalHours: 350,
        projects: [
          { id: '5', name: 'School Campus', code: 'SCH', group: 'Education', startDate: addWeeks(now, 1), endDate: addWeeks(now, 9), totalHours: 200, weeklyHours: {} },
          { id: '6', name: 'University Hall', code: 'UNI', group: 'Education', startDate: addWeeks(now, 3), endDate: addWeeks(now, 12), totalHours: 150, weeklyHours: {} },
        ],
      },
    ];
  }, [hasRealData]);

  const displayGroups = hasRealData ? groupedProjects : demoGroups;

  // Calculate stats
  const totalDemand = weeklyDemand.reduce((sum, w) => sum + w.totalDemand, 0);
  const totalCapacity = weeklyCapacity * numberOfWeeks;
  const utilizationPct = totalCapacity > 0 ? Math.round((totalDemand / totalCapacity) * 100) : 0;
  const effectiveUtilization = hasRealData ? utilizationPct : 85;

  // Calculate bar position for a project
  const getBarStyle = (project: ProjectRow, weekIndex: number, weekDate: Date): { show: boolean; intensity: number } => {
    if (!project.startDate && !project.endDate) {
      // If no dates, show bar for weeks with hours
      const weekKey = weeks[weekIndex].key;
      const hours = project.weeklyHours[weekKey] || 0;
      return { show: hours > 0, intensity: Math.min(1, hours / 40) };
    }

    const weekEnd = addWeeks(weekDate, 1);
    const projectStart = project.startDate || weekDate;
    const projectEnd = project.endDate || addWeeks(startDate, numberOfWeeks);

    // Check if this week overlaps with project duration
    const overlaps = isBefore(projectStart, weekEnd) && isAfter(projectEnd, weekDate);
    
    if (!overlaps) return { show: false, intensity: 0 };

    // Calculate intensity based on weekly hours
    const weekKey = weeks[weekIndex].key;
    const hours = project.weeklyHours[weekKey] || 0;
    const avgHours = project.totalHours / numberOfWeeks;
    const intensity = avgHours > 0 ? Math.min(1, Math.max(0.3, hours / Math.max(avgHours, 20))) : 0.5;
    
    return { show: true, intensity: hours > 0 ? intensity : 0.3 };
  };

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      {/* Demo data indicator */}
      {!hasRealData && (
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <span className="font-medium">Demo Data Preview</span> – Add contract dates and team compositions to see real demand.
          </AlertDescription>
        </Alert>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Group by:</span>
          <Select value={grouping} onValueChange={(v) => onGroupingChange(v as GroupingType)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="practice_area">Practice Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Summary Badges */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="px-3 py-1.5 rounded-full bg-muted">
            <span className="text-muted-foreground">Total Demand: </span>
            <span className="font-medium">{hasRealData ? Math.round(totalDemand) : 1190}h</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-muted">
            <span className="text-muted-foreground">Utilization: </span>
            <span className={effectiveUtilization > 100 ? 'text-destructive font-medium' : 'font-medium'}>
              {effectiveUtilization}%
            </span>
          </div>
          {effectiveUtilization > 100 && (
            <div className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
              Over capacity
            </div>
          )}
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="border rounded-lg overflow-hidden bg-card">
        {/* Header with scroll controls */}
        <div className="flex items-center border-b bg-muted/30">
          <div className="w-48 shrink-0 px-3 py-2 font-medium text-sm border-r">
            Project
          </div>
          <div className="w-20 shrink-0 px-2 py-2 font-medium text-sm text-center border-r">
            Hours
          </div>
          <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0" onClick={scrollLeft}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div ref={scrollRef} className="flex-1 overflow-x-auto scrollbar-thin">
            <div className="flex">
              {weeks.map((week, i) => (
                <div
                  key={week.key}
                  className={cn(
                    "w-16 shrink-0 px-1 py-2 text-xs text-center border-r",
                    i === 0 && "font-medium"
                  )}
                >
                  {week.label}
                </div>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0" onClick={scrollRight}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="max-h-[500px] overflow-y-auto">
          <TooltipProvider>
            {displayGroups.map((group) => {
              const colors = GROUP_COLORS[group.colorIndex];
              const isCollapsed = collapsedGroups.has(group.name);
              
              return (
                <div key={group.name}>
                  {/* Group Header */}
                  <div
                    className={cn(
                      "flex items-center border-b cursor-pointer hover:bg-muted/50 transition-colors",
                      colors.light
                    )}
                    onClick={() => toggleGroup(group.name)}
                  >
                    <div className="w-48 shrink-0 px-3 py-2 flex items-center gap-2 border-r">
                      <div className={cn("w-2.5 h-2.5 rounded-sm", colors.bg)} />
                      <span className="font-medium text-sm">{group.name}</span>
                      <span className="text-xs text-muted-foreground">({group.projects.length})</span>
                    </div>
                    <div className="w-20 shrink-0 px-2 py-2 text-sm text-center font-medium border-r">
                      {Math.round(group.totalHours)}h
                    </div>
                    <div className="flex-1" />
                  </div>

                  {/* Projects */}
                  {!isCollapsed && group.projects.map((project) => (
                    <div key={project.id} className="flex items-center border-b hover:bg-muted/20">
                      <div className="w-48 shrink-0 px-3 py-1.5 border-r">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm truncate cursor-default">
                              <span className="text-muted-foreground">{project.code}</span>
                              <span className="mx-1.5">·</span>
                              <span>{project.name}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="font-medium">{project.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {project.startDate && project.endDate
                                ? `${format(project.startDate, 'MMM d')} - ${format(project.endDate, 'MMM d, yyyy')}`
                                : 'No dates set'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="w-20 shrink-0 px-2 py-1.5 text-xs text-center text-muted-foreground border-r">
                        {Math.round(project.totalHours)}h
                      </div>
                      <div className="w-8 shrink-0" /> {/* Spacer for scroll button */}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex">
                          {weeks.map((week, weekIndex) => {
                            const { show, intensity } = getBarStyle(project, weekIndex, week.date);
                            const weekHours = project.weeklyHours[week.key] || 0;
                            
                            return (
                              <div
                                key={week.key}
                                className="w-16 shrink-0 h-8 px-0.5 py-1 border-r border-muted/50"
                              >
                                {show && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={cn(
                                          "h-full rounded-sm transition-all cursor-default",
                                          colors.bg
                                        )}
                                        style={{ opacity: intensity }}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="font-medium">{project.name}</p>
                                      <p className="text-xs">
                                        Week of {week.label}: {weekHours > 0 ? `${Math.round(weekHours)}h` : 'Active'}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="w-8 shrink-0" /> {/* Spacer for scroll button */}
                    </div>
                  ))}
                </div>
              );
            })}
          </TooltipProvider>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-2 border-t">
        {displayGroups.map((group) => {
          const colors = GROUP_COLORS[group.colorIndex];
          return (
            <div key={group.name} className="flex items-center gap-2 text-sm">
              <div className={cn("w-3 h-3 rounded-sm", colors.bg)} />
              <span className="text-muted-foreground">{group.name}:</span>
              <span className="font-medium">{Math.round(group.totalHours)}h</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
