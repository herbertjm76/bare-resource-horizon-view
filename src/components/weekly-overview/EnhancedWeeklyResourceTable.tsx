
import React from 'react';
import { Table, TableBody, TableFooter } from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Target, Calendar, Expand, Shrink } from 'lucide-react';
import { EnhancedWeeklyResourceHeader } from './EnhancedWeeklyResourceHeader';
import { EnhancedTeamMemberRows } from './EnhancedTeamMemberRows';
import { EnhancedProjectTotalsRow } from './EnhancedProjectTotalsRow';
import { Project, MemberAllocation } from './types';
import '@/styles/enhanced-tables.css';

interface EnhancedWeeklyResourceTableProps {
  projects: Project[];
  filteredOffices: string[];
  membersByOffice: Record<string, any[]>;
  getMemberAllocation: (memberId: string) => MemberAllocation;
  getOfficeDisplay: (locationCode: string) => string;
  handleInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
  projectTotals: () => Record<string, number>;
  weekLabel: string;
}

export const EnhancedWeeklyResourceTable: React.FC<EnhancedWeeklyResourceTableProps> = ({
  projects,
  filteredOffices,
  membersByOffice,
  getMemberAllocation,
  getOfficeDisplay,
  handleInputChange,
  projectTotals,
  weekLabel
}) => {
  // Calculate total members across all offices
  const totalMembers = Object.values(membersByOffice).reduce((sum, members) => sum + members.length, 0);
  
  // Calculate active projects (projects with allocations)
  const projectTotalData = projectTotals();
  const activeProjects = Object.values(projectTotalData).filter(total => total > 0).length;

  return (
    <div className="w-full max-w-full space-y-4">
      {/* Enhanced Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-violet" />
            <span className="text-sm font-medium">Weekly Overview</span>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {totalMembers} Team Members
          </Badge>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {projects.length} Projects
          </Badge>
          <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
            {weekLabel}
          </Badge>
        </div>
      </div>

      {/* Enhanced Table Container */}
      <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/30">
        <div className="enhanced-table-scroll">
          <div className="enhanced-table-container">
            <Table className="enhanced-table">
              <EnhancedWeeklyResourceHeader projects={projects} />
              <TableBody>
                <EnhancedTeamMemberRows 
                  filteredOffices={filteredOffices}
                  membersByOffice={membersByOffice}
                  getMemberAllocation={getMemberAllocation}
                  getOfficeDisplay={getOfficeDisplay}
                  handleInputChange={handleInputChange}
                  projects={projects}
                />
              </TableBody>
              <TableFooter>
                <EnhancedProjectTotalsRow 
                  projects={projects}
                  projectTotals={projectTotalData}
                />
              </TableFooter>
            </Table>
          </div>
        </div>
      </Card>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Team Members</p>
              <p className="text-2xl font-bold text-blue-800">{totalMembers}</p>
            </div>
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Active Projects</p>
              <p className="text-2xl font-bold text-emerald-800">{activeProjects}</p>
            </div>
            <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-violet-50 to-violet-100/50 border-violet-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-violet-600 font-medium">Total Projects</p>
              <p className="text-2xl font-bold text-violet-800">{projects.length}</p>
            </div>
            <div className="h-10 w-10 bg-violet-500 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
