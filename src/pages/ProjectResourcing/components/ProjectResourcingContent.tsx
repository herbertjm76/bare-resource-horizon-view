
import React from 'react';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import { StreamlinedProjectResourcingHeader } from './StreamlinedProjectResourcingHeader';
import { StreamlinedActionBar } from './StreamlinedActionBar';
import { ModernResourceGrid } from '@/components/resources/modern/ModernResourceGrid';
import { useProjects } from '@/hooks/useProjects';
import { GridLoadingState } from '@/components/resources/grid/GridLoadingState';
import { useProjectResourcingSummary } from '../hooks/useProjectResourcingSummary';
import { toast } from 'sonner';
import { utils, writeFile } from 'xlsx';
import { format } from 'date-fns';

interface ProjectResourcingContentProps {
  selectedMonth: Date;
  searchTerm: string;
  sortBy: 'name' | 'code' | 'status' | 'created';
  sortDirection: 'asc' | 'desc';
  filters: {
    office: string;
    country: string;
    manager: string;
    periodToShow: number;
  };
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  officeOptions: string[];
  countryOptions: string[];
  managers: Array<{id: string, name: string}>;
  activeFiltersCount: number;
  onMonthChange: (date: Date) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onPeriodChange: (period: number) => void;
  onSortChange: (value: 'name' | 'code' | 'status' | 'created') => void;
  onSortDirectionToggle: () => void;
  onDisplayOptionChange: (option: string, value: boolean | string[]) => void;
  onClearFilters: () => void;
}

// Inner component that uses office settings
const ProjectResourcingInner: React.FC<ProjectResourcingContentProps> = ({
  selectedMonth,
  searchTerm,
  sortBy,
  sortDirection,
  filters,
  displayOptions,
  officeOptions,
  countryOptions,
  managers,
  activeFiltersCount,
  onMonthChange,
  onSearchChange,
  onFilterChange,
  onPeriodChange,
  onSortChange,
  onSortDirectionToggle,
  onDisplayOptionChange,
  onClearFilters
}) => {
  // Fetch projects only for expand all functionality and total count
  const { projects } = useProjects(sortBy, sortDirection);
  const [expandedProjects, setExpandedProjects] = React.useState<string[]>([]);
  const [isExporting, setIsExporting] = React.useState(false);
  
  // Expand all projects
  const expandAll = () => {
    if (projects) {
      setExpandedProjects(projects.map(p => p.id));
    }
  };

  // Collapse all projects
  const collapseAll = () => {
    setExpandedProjects([]);
  };

  // Toggle individual project
  const handleToggleProjectExpand = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  // Export to Excel
  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        // Get the table element from the grid
        const table = document.querySelector('.workload-resource-table');
        
        if (!table) {
          toast.error('Could not find table data');
          setIsExporting(false);
          return;
        }
        
        // Create worksheet from table
        const ws = utils.table_to_sheet(table);
        
        // Create workbook and add worksheet
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Project Resourcing');
        
        // Generate file name
        const monthLabel = format(selectedMonth, 'MMM_yyyy');
        const fileName = `Project_Resourcing_${monthLabel}.xlsx`;
        
        // Write file and trigger download
        writeFile(wb, fileName);
        
        // Show success message
        toast.success('Export successful', { 
          description: `Exported to ${fileName}` 
        });
      } catch (error) {
        console.error('Export failed:', error);
        toast.error('Export failed', { 
          description: 'An error occurred while exporting the data.'
        });
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  const totalProjects = projects?.length || 0;

  // Combine filters with search term for filtering
  const combinedFilters = {
    ...filters,
    searchTerm
  };

  return (
    <div className="space-y-3">
      
      {/* Compact Action Bar */}
      <StreamlinedActionBar
        selectedDate={selectedMonth}
        onDateChange={onMonthChange}
        periodToShow={filters.periodToShow}
        onPeriodChange={onPeriodChange}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
        onSortDirectionToggle={onSortDirectionToggle}
        filters={filters}
        searchTerm={searchTerm}
        onFilterChange={onFilterChange}
        onSearchChange={onSearchChange}
        officeOptions={officeOptions}
        countryOptions={countryOptions}
        managers={managers}
        activeFiltersCount={activeFiltersCount}
        displayOptions={displayOptions}
        onDisplayOptionChange={onDisplayOptionChange}
        onClearFilters={onClearFilters}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        expandedProjects={expandedProjects}
        totalProjects={totalProjects}
        onExport={handleExport}
      />
      
      {/* Content-First Main Table */}
      <div className="w-full max-w-full overflow-hidden">
        <ModernResourceGrid
          startDate={selectedMonth}
          periodToShow={filters.periodToShow}
          sortBy={sortBy}
          sortDirection={sortDirection}
          filters={combinedFilters}
          displayOptions={displayOptions}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          expandedProjects={expandedProjects}
          totalProjects={0}
          onToggleProjectExpand={handleToggleProjectExpand}
        />
      </div>
    </div>
  );
};

export const ProjectResourcingContent: React.FC<ProjectResourcingContentProps> = (props) => {
  return (
    <OfficeSettingsProvider>
      <ProjectResourcingInner {...props} />
    </OfficeSettingsProvider>
  );
};
