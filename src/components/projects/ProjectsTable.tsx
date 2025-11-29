
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useStageColorMap } from './hooks/useProjectColors';
import { useProjectStages } from '@/hooks/useProjectStages';
import { ProjectTableHeader } from './table/ProjectTableHeader';
import { ProjectTableRow } from './table/ProjectTableRow';

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
  saveSignal
}) => {
  const { office_stages = [], loading: officeLoading } = useOfficeSettings();
  const stageColorMap = useStageColorMap(office_stages);
  const { getProjectStageFee, isLoading: stagesLoading } = useProjectStages(projects, office_stages);
  const [expandedColumn, setExpandedColumn] = useState<ColumnKey | null>(null);

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

  const columnWidths: Record<ColumnKey, { default: string; expanded: string }> = {
    code: { default: '80px', expanded: '140px' },
    name: { default: 'auto', expanded: 'auto' },
    pm: { default: '120px', expanded: '200px' },
    status: { default: '140px', expanded: '220px' },
    country: { default: '120px', expanded: '200px' },
    department: { default: '140px', expanded: '240px' },
    stage: { default: '160px', expanded: '260px' }
  };

  const getColumnWidth = (key: ColumnKey) => {
    return expandedColumn === key 
      ? columnWidths[key].expanded 
      : columnWidths[key].default;
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <colgroup>
          {editMode && <col style={{ width: '40px' }} />}
          <col style={{ width: getColumnWidth('code'), transition: 'width 0.2s ease' }} />
          <col style={{ width: getColumnWidth('name'), transition: 'width 0.2s ease' }} />
          <col style={{ width: getColumnWidth('pm'), transition: 'width 0.2s ease' }} />
          <col style={{ width: getColumnWidth('status'), transition: 'width 0.2s ease' }} />
          <col style={{ width: getColumnWidth('country'), transition: 'width 0.2s ease' }} />
          <col style={{ width: getColumnWidth('department'), transition: 'width 0.2s ease' }} />
          <col style={{ width: getColumnWidth('stage'), transition: 'width 0.2s ease' }} />
          {editMode && <col style={{ width: '96px' }} />}
        </colgroup>
        <ProjectTableHeader 
          editMode={editMode} 
          office_stages={office_stages}
          expandedColumn={expandedColumn}
          onColumnClick={setExpandedColumn}
        />
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
