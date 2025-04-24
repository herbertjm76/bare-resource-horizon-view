
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useStageColorMap } from './hooks/useProjectColors';
import { ProjectTableHeader } from './table/ProjectTableHeader';
import { ProjectTableRow } from './table/ProjectTableRow';

interface ProjectsTableProps {
  projects: any[];
  loading: boolean;
  error?: string;
  editMode?: boolean;
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  selectedProjects: string[];
  onSelectProject: (projectId: string) => void;
  refetch: () => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  projects, 
  loading, 
  error,
  editMode = false, 
  onEdit, 
  onDelete,
  selectedProjects, 
  onSelectProject,
  refetch
}) => {
  const { office_stages = [] } = useOfficeSettings();
  const stageColorMap = useStageColorMap(office_stages);

  if (loading) {
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
              onEdit={onEdit}
              onDelete={onDelete}
              selected={selectedProjects.includes(project.id)}
              onSelect={onSelectProject}
              stageColorMap={stageColorMap}
              office_stages={office_stages}
              refetch={refetch}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
