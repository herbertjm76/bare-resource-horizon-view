import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProjectsToolbar from './ProjectsToolbar';
import ProjectsTable from './ProjectsTable';
import { useProjects } from '@/hooks/useProjects';
import { FilterPopover } from '@/components/filters/FilterPopover';
import { QuickStatusManager } from '@/components/projects/QuickStatusManager';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectsListProps {
  onNewProject?: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ onNewProject }) => {
  const { projects, isLoading, error, refetch } = useProjects();
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [editMode, setEditMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSignal, setSaveSignal] = useState(0);
  const [showStatusManager, setShowStatusManager] = useState(false);

  // Extract unique filter options
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
    const offices = [...new Set(projects.map(p => p.office?.name).filter(Boolean))];
    return { statuses, countries, departments, stages, managers, offices };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // Skip empty filters
        
        // Global search filter
        if (key === 'search') {
          const searchLower = value.toLowerCase();
          const code = project.code?.toLowerCase() || '';
          const name = project.name?.toLowerCase() || '';
          const abbreviation = project.abbreviation?.toLowerCase() || '';
          return code.includes(searchLower) || name.includes(searchLower) || abbreviation.includes(searchLower);
        }
        
        // Text search filters (case-insensitive contains)
        if (key === 'code') {
          return project.code?.toLowerCase().includes(value.toLowerCase());
        }
        if (key === 'abbreviation') {
          return project.abbreviation?.toLowerCase().includes(value.toLowerCase());
        }
        if (key === 'name') {
          return project.name?.toLowerCase().includes(value.toLowerCase());
        }
        
        // PM filter - match by full name
        if (key === 'pm') {
          const pmName = project.project_manager 
            ? `${project.project_manager.first_name || ''} ${project.project_manager.last_name || ''}`.trim()
            : '';
          return pmName === value;
        }
        
        // Stage filter
        if (key === 'stage') {
          return project.current_stage === value;
        }
        
        if (key === 'office') {
          return project.office?.name === value;
        }
        
        // @ts-ignore - This is safe as we're only filtering properties that exist
        return project[key] === value;
      });
    });
  }, [projects, filters]);

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== '').length;

  const handleProjectCreated = () => {
    refetch();
  };

  const handleToggleEditMode = (mode: boolean) => {
    // If turning off edit mode, trigger a save signal and then refetch
    if (!mode) {
      setSaveSignal(prev => prev + 1);
      // Refetch after a short delay to allow row saves to complete
      setTimeout(() => refetch(), 400);
    }
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

  const handleSelectAll = () => {
    const allFilteredIds = filteredProjects.map(p => p.id);
    const allSelected = allFilteredIds.every(id => selectedProjects.includes(id));
    
    if (allSelected) {
      // Deselect all filtered projects
      setSelectedProjects(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      // Select all filtered projects
      setSelectedProjects(prev => [...new Set([...prev, ...allFilteredIds])]);
    }
  };

  const allFilteredSelected = useMemo(() => {
    const allFilteredIds = filteredProjects.map(p => p.id);
    return allFilteredIds.length > 0 && allFilteredIds.every(id => selectedProjects.includes(id));
  }, [filteredProjects, selectedProjects]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
  };

  const handleSelectFilterChange = (value: string, filterKey: string) => {
    const newFilters = {
      ...filters,
      [filterKey]: value === "all" ? "" : value
    };
    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({});
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
        <CardHeader className="flex flex-col space-y-4 pb-6">
          {/* Mobile/Tablet Layout: Paragraph on first row, buttons on second row */}
          <div className="block lg:hidden">
            <p className="text-sm text-muted-foreground">
              View and manage all your ongoing projects. Use the filters below to narrow down the list by status, country, or office.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <ProjectsToolbar 
                onProjectCreated={handleProjectCreated}
                editMode={editMode}
                setEditMode={handleToggleEditMode}
                selectedCount={selectedProjects.length}
                onBulkDelete={handleBulkDelete}
                onManageStatuses={() => setShowStatusManager(true)}
                onSelectAll={handleSelectAll}
                allSelected={allFilteredSelected}
                iconOnly={true}
                onNewProject={onNewProject}
              />
              <FilterPopover
                activeFiltersCount={activeFiltersCount}
                onClearFilters={handleClearAllFilters}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select 
                      onValueChange={(value) => handleSelectFilterChange(value, 'status')}
                      value={filters.status || "all"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {filterOptions.statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Country</label>
                    <Select 
                      onValueChange={(value) => handleSelectFilterChange(value, 'country')}
                      value={filters.country || "all"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {filterOptions.countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Office</label>
                    <Select 
                      onValueChange={(value) => handleSelectFilterChange(value, 'office')}
                      value={filters.office || "all"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Office" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Offices</SelectItem>
                        {filterOptions.offices.map((office) => (
                          <SelectItem key={office} value={office}>
                            {office}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FilterPopover>
            </div>
          </div>
          
          {/* Desktop Layout: Original side-by-side layout */}
          <div className="hidden lg:flex flex-row items-center justify-between space-y-0">
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
              onManageStatuses={() => setShowStatusManager(true)}
              onSelectAll={handleSelectAll}
              allSelected={allFilteredSelected}
              iconOnly={false}
              onNewProject={onNewProject}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ProjectsTable
            projects={filteredProjects} 
            loading={isLoading} 
            error={error ? error.message : ''}
            editMode={editMode}
            onDelete={handleDeleteProject}
            selectedProjects={selectedProjects}
            onSelectProject={handleSelectProject}
            refetch={refetch}
            saveSignal={saveSignal}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </CardContent>

        <QuickStatusManager
          open={showStatusManager}
          onOpenChange={setShowStatusManager}
        />

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
