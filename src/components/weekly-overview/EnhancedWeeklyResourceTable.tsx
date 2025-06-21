
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { EnhancedWeeklyResourceHeader } from './EnhancedWeeklyResourceHeader';
import { EnhancedTeamMemberRows } from './EnhancedTeamMemberRows';
import { EnhancedProjectTotalsRow } from './EnhancedProjectTotalsRow';
import './css/weekly-table-clean.css';

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
  return (
    <div className="enhanced-weekly-scroll">
      <div className="enhanced-weekly-container">
        <Table className="enhanced-weekly-table weekly-table">
          <EnhancedWeeklyResourceHeader projects={projects} />
          <TableBody>
            <EnhancedTeamMemberRows 
              members={members}
              projects={projects}
              allocations={allocations}
              selectedWeek={selectedWeek}
              filters={filters}
            />
            <EnhancedProjectTotalsRow 
              projects={projects}
              members={members}
              allocations={allocations}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
