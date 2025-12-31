
import React, { useMemo } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { EnhancedWeeklyResourceHeader } from './EnhancedWeeklyResourceHeader';
import { EnhancedTeamMemberRows } from './EnhancedTeamMemberRows';
import { EnhancedProjectTotalsRow } from './EnhancedProjectTotalsRow';
import { MemberAllocation } from './types';
import './css/weekly-table-clean.css';
import { logger } from '@/utils/logger';

interface EnhancedWeeklyResourceTableProps {
  projects: any[];
  members: any[];
  allocations: any[];
  selectedWeek: Date;
  filters: { office: string };
}

export const EnhancedWeeklyResourceTable: React.FC<EnhancedWeeklyResourceTableProps> = ({
  projects,
  members,
  allocations,
  selectedWeek,
  filters
}) => {
  // Process data for child components
  const processedData = useMemo(() => {
    // Group members by office
    const membersByOffice: Record<string, any[]> = {};
    members.forEach(member => {
      const office = member.office || member.location_code || 'Unknown';
      if (!membersByOffice[office]) {
        membersByOffice[office] = [];
      }
      membersByOffice[office].push(member);
    });

    // Get filtered offices
    const filteredOffices = Object.keys(membersByOffice).filter(office => 
      filters.office === 'all' || office === filters.office
    );

    // Create member allocation getter
    const getMemberAllocation = (memberId: string): MemberAllocation => {
      const memberAllocations = allocations.filter(alloc => alloc.user_id === memberId);
      
      const projectAllocations = projects.map(project => {
        const allocation = memberAllocations.find(alloc => alloc.project_id === project.id);
        return {
          projectId: project.id,
          projectName: project.name,
          projectCode: project.code,
          hours: allocation?.hours || 0
        };
      });

      // Calculate total project hours
      const totalProjectHours = projectAllocations.reduce((sum, project) => sum + project.hours, 0);

      return {
        // Original properties
        projectCount: projectAllocations.filter(p => p.hours > 0).length,
        projectHours: totalProjectHours,
        vacationHours: 0,
        generalOfficeHours: 0,
        marketingHours: 0,
        publicHolidayHours: 0,
        medicalLeaveHours: 0,
        annualLeaveHours: 0,
        otherLeaveHours: 0,
        remarks: '',
        
        // Enhanced properties
        id: memberId,
        annualLeave: 0,
        publicHoliday: 0,
        vacationLeave: 0,
        medicalLeave: 0,
        others: 0,
        projects: projectAllocations.filter(p => p.hours > 0).map(p => p.projectCode),
        projectAllocations,
        resourcedHours: totalProjectHours
      };
    };

    // Create office display getter
    const getOfficeDisplay = (locationCode: string): string => {
      // Simple mapping - could be enhanced with actual office names
      return locationCode === 'Unknown' ? 'Unknown Office' : locationCode;
    };

    // Calculate project totals
    const projectTotals: Record<string, number> = {};
    projects.forEach(project => {
      const total = allocations
        .filter(alloc => alloc.project_id === project.id)
        .reduce((sum, alloc) => sum + (alloc.hours || 0), 0);
      projectTotals[project.id] = total;
    });

    // Handle input changes (placeholder - would need actual implementation)
    const handleInputChange = (memberId: string, field: keyof MemberAllocation, value: any) => {
      logger.debug('Input change:', { memberId, field, value });
      // This would need to be implemented to update the allocations
    };

    return {
      filteredOffices,
      membersByOffice,
      getMemberAllocation,
      getOfficeDisplay,
      handleInputChange,
      projectTotals
    };
  }, [members, projects, allocations, filters]);

  return (
    <div className="enhanced-weekly-scroll">
      <div className="enhanced-weekly-container">
        <Table className="enhanced-weekly-table weekly-table">
          <EnhancedWeeklyResourceHeader projects={projects} />
          <TableBody>
            <EnhancedTeamMemberRows 
              filteredOffices={processedData.filteredOffices}
              membersByOffice={processedData.membersByOffice}
              getMemberAllocation={processedData.getMemberAllocation}
              getOfficeDisplay={processedData.getOfficeDisplay}
              handleInputChange={processedData.handleInputChange}
              projects={projects}
            />
            <EnhancedProjectTotalsRow 
              projects={projects}
              projectTotals={processedData.projectTotals}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
