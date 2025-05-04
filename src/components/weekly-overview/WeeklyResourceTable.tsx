
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWeeklyResourceData } from './hooks/useWeeklyResourceData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber, calculateUtilization } from './utils';
import "./weekly-resource-table.css";

interface WeeklyResourceTableProps {
  selectedWeek: Date;
  filters: {
    office: string;
  };
}

export const WeeklyResourceTable: React.FC<WeeklyResourceTableProps> = ({
  selectedWeek,
  filters
}) => {
  const {
    allMembers,
    filteredOffices,
    membersByOffice,
    getMemberAllocation,
    handleInputChange,
    getOfficeDisplay,
    isLoading,
    error
  } = useWeeklyResourceData(selectedWeek, filters);

  // Loading state
  if (isLoading) {
    return (
      <div className="resource-table-loading">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground">Loading resources...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="resource-table-error bg-destructive/10 text-destructive p-4 rounded-lg">
        <p className="font-semibold">Error loading data</p>
        <p className="text-sm">{typeof error === 'string' ? error : 'An error occurred while loading data. Please try again later.'}</p>
      </div>
    );
  }

  // Empty state
  if (!allMembers.length) {
    return (
      <div className="resource-table-empty border rounded-lg">
        <p className="text-muted-foreground mb-2">No team members found. Add team members to see the weekly overview.</p>
      </div>
    );
  }

  return (
    <div className="resource-table-container border rounded-lg">
      <ScrollArea className="resource-table-scroll h-[calc(100vh-320px)]">
        <table className="resource-table">
          <TableHeader />
          <TableBody 
            filteredOffices={filteredOffices} 
            membersByOffice={membersByOffice} 
            getMemberAllocation={getMemberAllocation}
            handleInputChange={handleInputChange}
            getOfficeDisplay={getOfficeDisplay}
          />
        </table>
      </ScrollArea>
    </div>
  );
};

// Table Header Component
const TableHeader = () => (
  <thead>
    <tr>
      <th className="column-name">
        <span className="font-medium">Name</span>
      </th>
      
      <th className="column-office">
        <span className="font-medium">Office</span>
      </th>
      
      <TooltipProvider>
        <AbbreviatedHeader abbreviation="PRJ" fullName="Projects" />
        <AbbreviatedHeader abbreviation="CAP" fullName="Capacity" />
        <AbbreviatedHeader abbreviation="UTL" fullName="Utilisation" />
        <AbbreviatedHeader 
          abbreviation="AL" 
          fullName="Annual Leave" 
          className="column-annual-leave"
        />
        <AbbreviatedHeader abbreviation="PH" fullName="Public Holiday" />
        <AbbreviatedHeader abbreviation="VL" fullName="Vacation Leave" />
        <AbbreviatedHeader abbreviation="ML" fullName="Medical Leave" />
        <AbbreviatedHeader abbreviation="OL" fullName="Others" />
      </TooltipProvider>
      
      <th className="column-remarks">
        <span className="font-medium">Remarks</span>
      </th>
    </tr>
  </thead>
);

// Abbreviated header cell with tooltip
const AbbreviatedHeader = ({ 
  abbreviation, 
  fullName,
  className = ""
}: { 
  abbreviation: string;
  fullName: string;
  className?: string;
}) => (
  <th className={`column-numeric ${className}`}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="font-medium cursor-help">{abbreviation}</span>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{fullName}</p>
      </TooltipContent>
    </Tooltip>
  </th>
);

// Table Body Component
const TableBody = ({ 
  filteredOffices, 
  membersByOffice, 
  getMemberAllocation,
  handleInputChange,
  getOfficeDisplay
}: any) => (
  <tbody>
    {filteredOffices.flatMap((office: string) => {
      const members = membersByOffice[office].sort((a: any, b: any) => {
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      });

      return members.map((member: any, memberIndex: number) => (
        <ResourceRow
          key={member.id}
          member={member}
          allocation={getMemberAllocation(member.id)}
          isEven={memberIndex % 2 === 0}
          handleInputChange={handleInputChange}
          getOfficeDisplay={getOfficeDisplay}
        />
      ));
    })}
  </tbody>
);

// Resource Row Component
const ResourceRow = ({ 
  member, 
  allocation, 
  isEven,
  handleInputChange,
  getOfficeDisplay
}: any) => {
  const weeklyCapacity = member.weekly_capacity || 40;
  const utilization = calculateUtilization(allocation.resourcedHours, weeklyCapacity);
  
  return (
    <tr>
      <td className="column-name">
        <div className="flex items-center gap-2">
          <span className={member.isPending ? 'member-pending' : ''}>
            {member.first_name} {member.last_name}
            {member.isPending && <span className="text-muted-foreground text-xs ml-1">(pending)</span>}
          </span>
        </div>
      </td>
      
      <td className="column-office">
        {getOfficeDisplay(member.location || 'N/A')}
      </td>
      
      <td className="column-numeric">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="project-count">{allocation.projects.length}</span>
            </TooltipTrigger>
            <TooltipContent side="right" className="w-64">
              <div className="p-1">
                <strong>Projects:</strong>
                {allocation.projects.length > 0 ? (
                  <ul className="list-disc ml-4 mt-1">
                    {allocation.projects.map((project: string, idx: number) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-muted-foreground">No projects assigned</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
      
      <td className="column-numeric font-bold">
        {formatNumber(allocation.resourcedHours || 0)}
      </td>
      
      <td className="column-numeric">
        {formatNumber(utilization)}%
      </td>
      
      <td className="column-numeric column-annual-leave">
        <EditableNumericField
          value={allocation.annualLeave}
          onChange={(value) => handleInputChange(member.id, 'annualLeave', value)}
        />
      </td>
      
      <td className="column-numeric">
        {allocation.publicHoliday}
      </td>
      
      <td className="column-numeric">
        <EditableNumericField
          value={allocation.vacationLeave}
          onChange={(value) => handleInputChange(member.id, 'vacationLeave', value)}
        />
      </td>
      
      <td className="column-numeric">
        <EditableNumericField
          value={allocation.medicalLeave}
          onChange={(value) => handleInputChange(member.id, 'medicalLeave', value)}
        />
      </td>
      
      <td className="column-numeric">
        <EditableNumericField
          value={allocation.others}
          onChange={(value) => handleInputChange(member.id, 'others', value)}
        />
      </td>
      
      <td className="column-remarks">
        <Textarea 
          value={allocation.remarks}
          onChange={(e) => handleInputChange(member.id, 'remarks', e.target.value)}
          className="min-h-0 h-6 p-1 text-xs resize-none"
        />
      </td>
    </tr>
  );
};

// Editable Numeric Field Component
const EditableNumericField = ({ 
  value, 
  onChange 
}: { 
  value: number;
  onChange: (value: number) => void;
}) => (
  <input
    type="number"
    min="0"
    value={value}
    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    className="w-full h-6 p-0 text-center"
  />
);

export default WeeklyResourceTable;
