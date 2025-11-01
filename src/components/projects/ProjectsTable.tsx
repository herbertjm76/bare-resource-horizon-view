
import React from 'react';
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

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <ProjectTableHeader 
          editMode={editMode} 
          office_stages={office_stages}
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
