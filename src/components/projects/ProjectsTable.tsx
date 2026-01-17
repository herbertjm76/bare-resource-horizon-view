import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useStageColorMap } from './hooks/useProjectColors';
import { useProjectStages } from '@/hooks/useProjectStages';
import { ProjectTableHeader } from './table/ProjectTableHeader';
import { ProjectTableRow } from './table/ProjectTableRow';
import { ProjectTableFilterRow } from './table/ProjectTableFilterRow';

interface ProjectsTableProps {
  projects: any[];
  loading: boolean;
  error?: string;
  editMode?: boolean;
  onDelete?: (projectId: string) => void;
  selectedProjects: string[];
  onSelectProject: (projectId: string) => void;
  refetch: () => void;
  saveSignal?: number;
  filters?: { [key: string]: string };
  onFilterChange?: (key: string, value: string) => void;
}

type ColumnKey = 'code' | 'name' | 'pm' | 'status' | 'country' | 'department' | 'stage';

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  projects, 
  loading, 
  error,
  editMode = false,
  onDelete,
  selectedProjects, 
  onSelectProject,
  refetch,
  saveSignal,
  filters = {},
  onFilterChange
}) => {
  const { office_stages = [], loading: officeLoading } = useOfficeSettings();
  const stageColorMap = useStageColorMap(office_stages);
  const { getProjectStageFee, isLoading: stagesLoading } = useProjectStages(projects, office_stages);
  const [expandedColumn, setExpandedColumn] = useState<ColumnKey | null>(null);

  // Extract unique filter options - MUST be before early returns
  const filterOptions = useMemo(() => {
    const statuses = [...new Set(projects.map(p => p.status).filter(Boolean))];
    const countries = [...new Set(projects.map(p => p.country).filter(Boolean))];
    const departments = [...new Set(projects.map(p => p.department).filter(Boolean))];
    const stages = [...new Set(projects.map(p => p.current_stage).filter(Boolean))];
    const managers = [...new Set(projects.map(p => {
      if (p.project_manager) {
        return `${p.project_manager.first_name || ''} ${p.project_manager.last_name || ''}`.trim();
      }
      return null;
    }).filter(Boolean))] as string[];
    return { statuses, countries, departments, stages, managers };
  }, [projects]);

  const handleFilterChange = (key: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  // Only show loading when essential data is loading
  const isTableLoading = loading || stagesLoading || officeLoading;

  if (isTableLoading) {
    return <div className="text-center p-8 border rounded-md border-dashed">Loading projects...</div>;
  }
  if (error) {
    return <div className="p-8 border border-destructive/30 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">{error}</div>;
  }
  if (!projects?.length) {
    return <div className="text-center p-8 border rounded-md border-dashed">No projects found. Click "New Project" to create your first project.</div>;
  }

  const baseWidths: Record<ColumnKey, number> = {
    code: 80,
    name: 200,
    pm: 120,
    status: 140,
    country: 120,
    department: 140,
    stage: 160
  };

  const expandAmount = 120; // Extra pixels for expanded column

  const getColumnWidth = (key: ColumnKey): number => {
    if (!expandedColumn) return baseWidths[key];
    
    if (expandedColumn === key) {
      return baseWidths[key] + expandAmount;
    }
    
    // Contract other columns proportionally
    const totalBase = Object.values(baseWidths).reduce((sum, w) => sum + w, 0);
    const thisColumnBase = baseWidths[key];
    const contractionRatio = thisColumnBase / (totalBase - baseWidths[expandedColumn]);
    const totalContraction = expandAmount;
    
    return Math.max(60, thisColumnBase - (totalContraction * contractionRatio));
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <colgroup>
          {editMode && <col style={{ width: '40px' }} />}
          <col style={{ width: `${getColumnWidth('code')}px`, transition: 'width 0.3s ease' }} />
          <col style={{ width: `${getColumnWidth('name')}px`, transition: 'width 0.3s ease' }} />
          <col style={{ width: `${getColumnWidth('pm')}px`, transition: 'width 0.3s ease' }} />
          <col style={{ width: `${getColumnWidth('status')}px`, transition: 'width 0.3s ease' }} />
          <col style={{ width: `${getColumnWidth('country')}px`, transition: 'width 0.3s ease' }} />
          <col style={{ width: `${getColumnWidth('department')}px`, transition: 'width 0.3s ease' }} />
          <col style={{ width: `${getColumnWidth('stage')}px`, transition: 'width 0.3s ease' }} />
          {editMode && <col style={{ width: '96px' }} />}
        </colgroup>
        <TableHeader>
          <ProjectTableHeader 
            editMode={editMode} 
            office_stages={office_stages}
            expandedColumn={expandedColumn}
            onColumnClick={setExpandedColumn}
          />
          <ProjectTableFilterRow
            editMode={editMode}
            filters={filters}
            onFilterChange={handleFilterChange}
            statuses={filterOptions.statuses}
            countries={filterOptions.countries}
            departments={filterOptions.departments}
            stages={filterOptions.stages}
            managers={filterOptions.managers}
          />
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <ProjectTableRow
              key={project.id}
              project={project}
              editMode={editMode}
              onDelete={onDelete}
              selected={selectedProjects.includes(project.id)}
              onSelect={onSelectProject}
              stageColorMap={stageColorMap}
              office_stages={office_stages}
              getProjectStageFee={getProjectStageFee}
              refetch={refetch}
              saveSignal={saveSignal}
              expandedColumn={expandedColumn}
              onColumnClick={setExpandedColumn}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
