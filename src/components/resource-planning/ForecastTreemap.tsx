import React, { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { WeeklyDemandData, ProjectDemand } from '@/hooks/useDemandProjection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type GroupingType = 'department' | 'practice_area';

interface ForecastTreemapProps {
  weeklyDemand: WeeklyDemandData[];
  projectDemands: ProjectDemand[];
  weeklyCapacity: number;
  numberOfWeeks: number;
  grouping: GroupingType;
  onGroupingChange: (value: GroupingType) => void;
  projects: Array<{
    id: string;
    name: string;
    code: string;
    department?: string | null;
  }>;
  departments: Array<{ id: string; name: string }>;
  practiceAreas: Array<{ id: string; name: string }>;
}

// Color palette for treemap nodes
const COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 87%, 65%)',
  'hsl(0, 84%, 60%)',
  'hsl(180, 70%, 45%)',
  'hsl(330, 80%, 60%)',
  'hsl(200, 80%, 50%)',
  'hsl(45, 90%, 55%)',
  'hsl(160, 70%, 40%)',
];

interface TreemapNode {
  name: string;
  size?: number;
  children?: TreemapNode[];
  color?: string;
  projectCount?: number;
}

// Custom content renderer for treemap cells
const CustomizedContent: React.FC<any> = (props) => {
  const { x, y, width, height, name, size, color, depth } = props;
  
  if (width < 30 || height < 30) return null;
  
  const fontSize = Math.min(14, Math.max(10, width / 10));
  const showHours = width > 60 && height > 40;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color || COLORS[depth % COLORS.length],
          stroke: 'hsl(var(--background))',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
        rx={4}
      />
      {width > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - (showHours ? 8 : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={fontSize}
            fontWeight="600"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            {name?.length > 15 ? name.slice(0, 15) + '...' : name}
          </text>
          {showHours && size && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.85)"
              fontSize={fontSize - 2}
            >
              {Math.round(size)}h
            </text>
          )}
        </>
      )}
    </g>
  );
};

export const ForecastTreemap: React.FC<ForecastTreemapProps> = ({
  weeklyDemand,
  projectDemands,
  weeklyCapacity,
  numberOfWeeks,
  grouping,
  onGroupingChange,
  projects,
  departments,
  practiceAreas,
}) => {
  const hasRealData = weeklyDemand.some(week => week.totalDemand > 0);

  // Build project info map
  const projectInfoMap = useMemo(() => {
    const map: Record<string, { name: string; code: string; department?: string | null }> = {};
    projects.forEach(p => {
      map[p.id] = { name: p.name, code: p.code, department: p.department };
    });
    return map;
  }, [projects]);

  // Calculate total hours per project from weekly demand
  const projectTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    weeklyDemand.forEach(week => {
      Object.entries(week.demandByProject).forEach(([projectId, hours]) => {
        totals[projectId] = (totals[projectId] || 0) + hours;
      });
    });
    return totals;
  }, [weeklyDemand]);

  // Generate demo data when no real data exists
  const demoTreemapData: TreemapNode[] = useMemo(() => {
    if (hasRealData) return [];
    
    return [
      {
        name: 'Commercial',
        children: [
          { name: 'Office Tower A', size: 240, color: COLORS[0] },
          { name: 'Retail Center', size: 180, color: COLORS[1] },
        ],
      },
      {
        name: 'Healthcare',
        children: [
          { name: 'Hospital Wing', size: 300, color: COLORS[2] },
          { name: 'Medical Center', size: 120, color: COLORS[3] },
        ],
      },
      {
        name: 'Education',
        children: [
          { name: 'School Campus', size: 200, color: COLORS[4] },
          { name: 'University Hall', size: 150, color: COLORS[5] },
        ],
      },
    ];
  }, [hasRealData]);

  // Build treemap data grouped by department or practice area
  const treemapData: TreemapNode[] = useMemo(() => {
    if (!hasRealData) return demoTreemapData;

    const groupMap: Record<string, { name: string; projects: Record<string, number> }> = {};
    const groupList = grouping === 'department' ? departments : practiceAreas;
    
    // Initialize groups
    groupList.forEach(g => {
      groupMap[g.name] = { name: g.name, projects: {} };
    });
    groupMap['Unassigned'] = { name: 'Unassigned', projects: {} };

    // Assign projects to groups
    Object.entries(projectTotals).forEach(([projectId, hours]) => {
      const projectInfo = projectInfoMap[projectId];
      const projectName = projectInfo?.code || projectInfo?.name || projectId;
      const groupName = projectInfo?.department || 'Unassigned';
      
      // For now we use department field, but could extend for practice_area
      if (!groupMap[groupName]) {
        groupMap[groupName] = { name: groupName, projects: {} };
      }
      groupMap[groupName].projects[projectName] = (groupMap[groupName].projects[projectName] || 0) + hours;
    });

    // Convert to treemap structure
    return Object.values(groupMap)
      .filter(group => Object.keys(group.projects).length > 0)
      .map((group, groupIndex) => ({
        name: group.name,
        children: Object.entries(group.projects).map(([projectName, hours], projIndex) => ({
          name: projectName,
          size: hours,
          color: COLORS[(groupIndex * 3 + projIndex) % COLORS.length],
        })),
      }));
  }, [hasRealData, demoTreemapData, projectTotals, projectInfoMap, departments, practiceAreas, grouping]);

  // Calculate stats
  const totalDemand = weeklyDemand.reduce((sum, w) => sum + w.totalDemand, 0);
  const totalCapacity = weeklyCapacity * numberOfWeeks;
  const utilizationPct = totalCapacity > 0 ? Math.round((totalDemand / totalCapacity) * 100) : 0;
  const effectiveUtilization = hasRealData ? utilizationPct : 85;

  return (
    <div className="space-y-4">
      {/* Demo data indicator */}
      {!hasRealData && (
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <span className="font-medium">Demo Data Preview</span> – Add team compositions to projects to see real demand.
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

      {/* Treemap */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="hsl(var(--background))"
            content={<CustomizedContent />}
          >
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${Math.round(value)} hours`, 'Projected Demand']}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-2 border-t">
        {treemapData.map((group, index) => (
          <div key={group.name} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-muted-foreground">{group.name}:</span>
            <span className="font-medium">
              {Math.round(group.children?.reduce((sum, c) => sum + (c.size || 0), 0) || 0)}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
