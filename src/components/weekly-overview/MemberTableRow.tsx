import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Project, MemberAllocation } from './types';

interface MemberTableRowProps {
  member: any;
  allocation: MemberAllocation;
  isEven: boolean;
  getOfficeDisplay: (locationCode: string) => string;
  onInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
  projects: Project[];
}

export const MemberTableRow: React.FC<MemberTableRowProps> = ({
  member,
  allocation,
  isEven,
  getOfficeDisplay,
  onInputChange,
  projects
}) => {
  // Helper to get user initials
  const getUserInitials = (member: any): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (member: any): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Helper to get member display name
  const getMemberDisplayName = (member: any): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

  // Display pill component for read-only data
  const DisplayPill: React.FC<{ value: string | number; className?: string }> = ({ value, className = "" }) => (
    <div className={`
      inline-flex items-center justify-center
      px-3 py-1 
      bg-gradient-to-r from-gray-100 to-gray-200 
      border border-gray-300
      rounded-full 
      text-xs font-medium 
      text-gray-700
      shadow-sm
      min-w-8
      ${className}
    `}>
      {value}
    </div>
  );

  // Manual input component for editable fields
  const ManualInputCell: React.FC<{ 
    value: string | number; 
    field: keyof MemberAllocation;
    placeholder?: string;
  }> = ({ value, field, placeholder = "0" }) => (
    <Input
      type="number"
      min="0"
      max="40"
      value={value}
      onChange={(e) => onInputChange(member.id, field, e.target.value)}
      className="w-12 h-8 text-xs text-center border-2 border-purple-200 rounded-lg bg-purple-50 focus:border-purple-400 focus:bg-purple-100 transition-all"
      placeholder={placeholder}
    />
  );

  return (
    <TableRow className={`${isEven ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/50`}>
      {/* Member Name */}
      <TableCell className="text-left border-r p-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
            <AvatarFallback className="text-xs bg-brand-violet text-white">
              {getUserInitials(member)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-gray-900 truncate">
            {getMemberDisplayName(member)}
          </span>
        </div>
      </TableCell>

      {/* Project Count - Display Pill */}
      <TableCell className="text-center border-r p-2 bg-gray-50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={allocation.projectCount} 
            className="bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 text-purple-800"
          />
        </div>
      </TableCell>

      {/* Project Hours - Display Pill */}
      <TableCell className="text-center border-r p-2 bg-gray-50">
        <div className="flex items-center justify-center">
          <DisplayPill value={`${allocation.projectHours}h`} />
        </div>
      </TableCell>

      {/* Vacation Hours - Display Pill */}
      <TableCell className="text-center border-r p-2 bg-gray-50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={`${allocation.vacationHours}h`}
            className="bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 text-blue-800"
          />
        </div>
      </TableCell>

      {/* General Office Hours - Display Pill */}
      <TableCell className="text-center border-r p-2 bg-gray-50">
        <div className="flex items-center justify-center">
          <DisplayPill value={`${allocation.generalOfficeHours}h`} />
        </div>
      </TableCell>

      {/* Marketing Hours - Display Pill */}
      <TableCell className="text-center border-r p-2 bg-gray-50">
        <div className="flex items-center justify-center">
          <DisplayPill value={`${allocation.marketingHours}h`} />
        </div>
      </TableCell>

      {/* Public Holiday Hours - Display Pill */}
      <TableCell className="text-center border-r p-2 bg-gray-50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={`${allocation.publicHolidayHours}h`}
            className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800"
          />
        </div>
      </TableCell>

      {/* Medical Leave Hours - Display Pill */}
      <TableCell className="text-center border-r p-2 bg-gray-50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={`${allocation.medicalLeaveHours}h`}
            className="bg-gradient-to-r from-red-100 to-red-200 border-red-300 text-red-800"
          />
        </div>
      </TableCell>

      {/* Other Leave (OL) - Manual Input */}
      <TableCell className="text-center border-r p-1">
        <div className="flex items-center justify-center">
          <ManualInputCell 
            value={allocation.otherLeaveHours || 0}
            field="otherLeaveHours"
          />
        </div>
      </TableCell>

      {/* Office Location - Display Pill */}
      <TableCell className="text-center border-r p-2 bg-gray-50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={getOfficeDisplay(member.location)}
            className="bg-gradient-to-r from-green-100 to-green-200 border-green-300 text-green-800"
          />
        </div>
      </TableCell>

      {/* Project allocation cells */}
      {projects.map((project) => (
        <TableCell key={project.id} className="text-center border-r p-2 bg-gray-50">
          <div className="flex items-center justify-center">
            <DisplayPill value="0" />
          </div>
        </TableCell>
      ))}
    </TableRow>
  );
};
