
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { TeamMember } from '@/components/dashboard/types';
import { formatNumber } from '../weekly-overview/utils';
import '../../ui/enhanced-table.css';

interface EnhancedTeamWorkloadTableProps {
  filteredMembers: TeamMember[];
  selectedWeek: Date;
  isLoading: boolean;
}

export const EnhancedTeamWorkloadTable: React.FC<EnhancedTeamWorkloadTableProps> = ({
  filteredMembers,
  selectedWeek,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="enhanced-table-scroll">
        <div className="enhanced-table-container flex items-center justify-center">
          <div className="text-gray-500">Loading team workload data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-table-scroll">
      <div className="enhanced-table-container">
        <Table className="enhanced-table">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky-left" style={{ left: 0, minWidth: '200px' }}>
                Team Member
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '120px' }}>
                Department
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '100px' }}>
                Location
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '100px' }}>
                Weekly Capacity
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '100px' }}>
                Current Load
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '100px' }}>
                Available Hours
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '100px' }}>
                Utilization
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {filteredMembers.map((member, idx) => {
              const weeklyCapacity = member.weekly_capacity || 40;
              const currentLoad = 32; // Mock data - replace with actual calculation
              const availableHours = Math.max(0, weeklyCapacity - currentLoad);
              const utilization = Math.round((currentLoad / weeklyCapacity) * 100);
              
              return (
                <TableRow key={member.id}>
                  <TableCell className="sticky-left font-medium" style={{ left: 0 }}>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {`${member.first_name || ''} ${member.last_name || ''}`.trim()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.position || 'No position'}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className="text-sm text-gray-700">
                      {member.department || 'No department'}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className="text-sm text-gray-700">
                      {member.location || 'No location'}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(weeklyCapacity)}h
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(currentLoad)}h
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className="text-sm font-medium text-green-600">
                      {formatNumber(availableHours)}h
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className={`capacity-indicator ${
                      utilization >= 90 ? 'capacity-high' : 
                      utilization >= 70 ? 'capacity-medium' : 
                      'capacity-low'
                    }`}>
                      {utilization}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
