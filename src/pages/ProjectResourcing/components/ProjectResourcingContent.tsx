
import React from 'react';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { StreamlinedActionBar } from './StreamlinedActionBar';
import { ModernResourceGrid } from '@/components/resources/modern/ModernResourceGrid';
import { useProjects } from '@/hooks/useProjects';
import { GridLoadingState } from '@/components/resources/grid/GridLoadingState';
import { toast } from 'sonner';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend the jsPDF types
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface MemberFilters {
  practiceArea: string;
  department: string;
  location: string;
  searchTerm: string;
}

interface ProjectResourcingContentProps {
  selectedMonth: Date;
  searchTerm: string;
  sortBy: 'name' | 'code' | 'status' | 'created';
  sortDirection: 'asc' | 'desc';
  filters: {
    office: string;
    country: string;
    manager: string;
    status: string;
    periodToShow: number;
  };
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  officeOptions: string[];
  countryOptions: string[];
  managers: Array<{ id: string; name: string }>;
  activeFiltersCount: number;
  onMonthChange: (date: Date) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onPeriodChange: (period: number) => void;
  onSortChange: (value: 'name' | 'code' | 'status' | 'created') => void;
  onSortDirectionToggle: () => void;
  onDisplayOptionChange: (option: string, value: boolean | string[]) => void;
  onClearFilters: () => void;
  showOnlyControls?: boolean;
  showOnlyGrid?: boolean;
  memberFilters?: MemberFilters;
  // External expand state props (when lifted to parent)
  expandedProjects?: string[];
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onToggleProjectExpand?: (projectId: string) => void;
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
  onClearFilters,
  showOnlyControls = false,
  showOnlyGrid = false,
  memberFilters,
  // External expand state props
  expandedProjects: externalExpandedProjects,
  onExpandAll: externalExpandAll,
  onCollapseAll: externalCollapseAll,
  onToggleProjectExpand: externalToggleProjectExpand
}) => {
  // Fetch projects only for expand all functionality and total count
  const { projects, isLoading } = useProjects(sortBy, sortDirection);
  const [internalExpandedProjects, setInternalExpandedProjects] = React.useState<string[]>([]);
  const [isExporting, setIsExporting] = React.useState(false);

  // Use external state if provided, otherwise use internal state
  const expandedProjects = externalExpandedProjects ?? internalExpandedProjects;

  // Expand all projects
  const expandAll = externalExpandAll ?? (() => {
    if (projects) {
      setInternalExpandedProjects(projects.map((p) => p.id));
    }
  });

  // Collapse all projects
  const collapseAll = externalCollapseAll ?? (() => {
    setInternalExpandedProjects([]);
  });

  // Toggle individual project
  const handleToggleProjectExpand = externalToggleProjectExpand ?? ((projectId: string) => {
    setInternalExpandedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  });

  // Export to PDF
  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      try {
        // Get the table element from the grid
        const table = document.querySelector('.workload-resource-table') as HTMLTableElement;

        if (!table) {
          toast.error('Could not find table data');
          setIsExporting(false);
          return;
        }

        // Create new PDF document in A3 landscape orientation
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a3'
        });

        // Get company name or use default
        const companyName = document.querySelector('.company-name')?.textContent || 'Team';

        // Add header
        pdf.setFontSize(16);
        pdf.text(`${companyName} - Project Resourcing`, 14, 15);

        pdf.setFontSize(12);
        const monthLabel = format(selectedMonth, 'MMMM yyyy');
        pdf.text(monthLabel, 14, 22);

        // Add timestamp
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')}`, 14, 27);
        pdf.setTextColor(0, 0, 0);

        // Get table headers
        const headerRow = table.querySelector('thead tr') as HTMLTableRowElement;
        const headers: string[] = [];
        if (headerRow) {
          Array.from(headerRow.cells).forEach((cell) => {
            headers.push(cell.textContent?.trim() || '');
          });
        }

        // Get table data
        const tableBody = table.querySelector('tbody') as HTMLTableSectionElement;
        const data: any[][] = [];
        if (tableBody) {
          Array.from(tableBody.rows).forEach((row) => {
            const rowData: any[] = [];
            Array.from(row.cells).forEach((cell) => {
              const input = cell.querySelector('input');
              if (input) {
                rowData.push(input.value);
              } else {
                rowData.push(cell.textContent?.trim() || '');
              }
            });
            data.push(rowData);
          });
        }

        // Prepare the table configuration
        autoTable(pdf, {
          startY: 32,
          head: [headers],
          body: data,
          theme: 'grid',
          styles: {
            fontSize: 7,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [110, 89, 165],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 250]
          },
          margin: { top: 30 },
          didDrawPage: (data: any) => {
            const pageCount = pdf.internal.pages.length - 1;
            pdf.setFontSize(8);
            pdf.text(
              `Page ${data.pageNumber} of ${pageCount}`,
              pdf.internal.pageSize.width - 20,
              pdf.internal.pageSize.height - 10
            );
          }
        });

        // Generate file name
        const fileName = `Project_Resourcing_${format(selectedMonth, 'MMM_yyyy')}.pdf`;

        // Save PDF
        pdf.save(fileName);

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

  if (isLoading) {
    return <GridLoadingState />;
  }

  // Show only controls if requested
  if (showOnlyControls) {
    return (
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
    );
  }

  // Show only grid if requested
  if (showOnlyGrid) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1400px] overflow-hidden">
          <ModernResourceGrid
            startDate={selectedMonth}
            periodToShow={filters.periodToShow}
            filters={combinedFilters}
            displayOptions={displayOptions}
            sortBy={sortBy}
            sortDirection={sortDirection}
            expandedProjects={expandedProjects}
            totalProjects={totalProjects}
            onToggleProjectExpand={handleToggleProjectExpand}
            memberFilters={memberFilters}
          />
        </div>
      </div>
    );
  }

  // Default: show both
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

      {/* Centered main grid */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1400px] overflow-hidden">
          <ModernResourceGrid
            startDate={selectedMonth}
            periodToShow={filters.periodToShow}
            filters={combinedFilters}
            displayOptions={displayOptions}
            sortBy={sortBy}
            sortDirection={sortDirection}
            expandedProjects={expandedProjects}
            totalProjects={totalProjects}
            onToggleProjectExpand={handleToggleProjectExpand}
          />
        </div>
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
