
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectsToolbar from './ProjectsToolbar';
import ProjectsTable from './ProjectsTable';
import { useProjects } from '@/hooks/useProjects';
import { ProjectFilters } from './ProjectFilters';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ProjectsList = () => {
  const { projects, isLoading, error, refetch } = useProjects();
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [editMode, setEditMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // Skip empty filters
        
        if (key === 'office') {
          return project.office?.name === value;
        }
        
        // @ts-ignore - This is safe as we're only filtering properties that exist
        return project[key] === value;
      });
    });
  }, [projects, filters]);

  const handleProjectCreated = () => {
    refetch();
  };

  const handleToggleEditMode = (mode: boolean) => {
    setEditMode(mode);
    if (!mode) {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const deleteProject = async (projectId: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast.success("Project deleted successfully");
      refetch();
      setSelectedProjects(prev => prev.filter(id => id !== projectId));
    } catch (error: any) {
      toast.error("Failed to delete project", {
        description: error.message
      });
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setShowDeleteDialog(true);
  };

  const handleBulkDelete = () => {
    if (selectedProjects.length === 0) return;
    
    setProjectToDelete('bulk');
    setShowDeleteDialog(true);
  };

  const confirmDeleteSelected = async () => {
    if (selectedProjects.length === 0) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .in('id', selectedProjects);

      if (error) throw error;

      toast.success(`${selectedProjects.length} projects deleted successfully`);
      refetch();
      setSelectedProjects([]);
    } catch (error: any) {
      toast.error("Failed to delete projects", {
        description: error.message
      });
      console.error("Error deleting projects:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  return (
    <>      
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              View and manage all your ongoing projects. Use the filters below to narrow down the list by status, country, or office.
            </p>
          </div>
          <ProjectsToolbar 
            onProjectCreated={handleProjectCreated}
            editMode={editMode}
            setEditMode={handleToggleEditMode}
            selectedCount={selectedProjects.length}
            onBulkDelete={handleBulkDelete}
          />
        </CardHeader>
        <CardContent>
          <ProjectFilters 
            onFilterChange={setFilters} 
            currentFilters={filters}
          />
          <ProjectsTable 
            projects={filteredProjects} 
            loading={isLoading} 
            error={error ? error.message : ''}
            editMode={editMode}
            onDelete={handleDeleteProject}
            selectedProjects={selectedProjects}
            onSelectProject={handleSelectProject}
            refetch={refetch}
          />
        </CardContent>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {projectToDelete === 'bulk' 
                  ? `Delete ${selectedProjects.length} project(s)` 
                  : 'Delete project'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {projectToDelete === 'bulk'
                  ? `Are you sure you want to delete ${selectedProjects.length} selected project(s)? This action cannot be undone.`
                  : 'Are you sure you want to delete this project? This action cannot be undone.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => {
                  if (projectToDelete === 'bulk') {
                    confirmDeleteSelected();
                  } else if (projectToDelete) {
                    deleteProject(projectToDelete);
                  }
                }}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </>
  );
};

export default ProjectsList;
