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

  // Display pill component for read-only data with proper styling
  const DisplayPill: React.FC<{ 
    value: string | number; 
    gradientClass: string;
    textClass: string;
  }> = ({ value, gradientClass, textClass }) => (
    <div className={`
      inline-flex items-center justify-center
      px-3 py-1.5 
      ${gradientClass}
      rounded-xl 
      text-xs font-semibold 
      ${textClass}
      shadow-sm
      min-w-10
      border
    `}>
      {value}
    </div>
  );

  // Manual input component for Other Leave with light purple styling
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
      className="w-16 h-9 text-xs text-center rounded-xl border-2 border-purple-300 bg-purple-50 focus:border-purple-500 focus:bg-purple-100 transition-all font-medium"
      placeholder={placeholder}
    />
  );

  return (
    <TableRow className={`${isEven ? 'bg-white' : 'bg-gray-50/30'} hover:bg-gray-100/40 transition-colors`}>
      {/* Member Name */}
      <TableCell className="text-left border-r p-3 rounded-l-xl">
        <div className="flex items-center gap-3">
          <Avatar className="h-7 w-7 flex-shrink-0">
            <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
            <AvatarFallback className="text-xs bg-brand-violet text-white">
              {getUserInitials(member)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-900 truncate">
            {getMemberDisplayName(member)}
          </span>
        </div>
      </TableCell>

      {/* Project Count - Purple gradient pill */}
      <TableCell className="text-center border-r p-3 bg-gray-50/50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={allocation.projectCount}
            gradientClass="bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300"
            textClass="text-purple-800"
          />
        </div>
      </TableCell>

      {/* Project Hours - Default gray gradient pill */}
      <TableCell className="text-center border-r p-3 bg-gray-50/50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={`${allocation.projectHours}h`}
            gradientClass="bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300"
            textClass="text-gray-700"
          />
        </div>
      </TableCell>

      {/* Vacation Hours - Blue gradient pill */}
      <TableCell className="text-center border-r p-3 bg-gray-50/50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={`${allocation.vacationHours}h`}
            gradientClass="bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300"
            textClass="text-blue-800"
          />
        </div>
      </TableCell>

      {/* General Office Hours - Default gray gradient pill */}
      <TableCell className="text-center border-r p-3 bg-gray-50/50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={`${allocation.generalOfficeHours}h`}
            gradientClass="bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300"
            textClass="text-gray-700"
          />
        </div>
      </TableCell>

      {/* Marketing Hours - Default gray gradient pill */}
      <TableCell className="text-center border-r p-3 bg-gray-50/50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={`${allocation.marketingHours}h`}
            gradientClass="bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300"
            textClass="text-gray-700"
          />
        </div>
      </TableCell>

      {/* Public Holiday Hours - Yellow gradient pill */}
      <TableCell className="text-center border-r p-3 bg-gray-50/50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={`${allocation.publicHolidayHours}h`}
            gradientClass="bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300"
            textClass="text-yellow-800"
          />
        </div>
      </TableCell>

      {/* Medical Leave Hours - Red gradient pill */}
      <TableCell className="text-center border-r p-3 bg-gray-50/50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={`${allocation.medicalLeaveHours}h`}
            gradientClass="bg-gradient-to-r from-red-100 to-red-200 border-red-300"
            textClass="text-red-800"
          />
        </div>
      </TableCell>

      {/* Other Leave (OL) - Manual Input with light purple styling */}
      <TableCell className="text-center border-r p-3">
        <div className="flex items-center justify-center">
          <ManualInputCell 
            value={allocation.otherLeaveHours || 0}
            field="otherLeaveHours"
          />
        </div>
      </TableCell>

      {/* Office Location - Green gradient pill */}
      <TableCell className="text-center border-r p-3 bg-gray-50/50">
        <div className="flex items-center justify-center">
          <DisplayPill 
            value={getOfficeDisplay(member.location)}
            gradientClass="bg-gradient-to-r from-green-100 to-green-200 border-green-300"
            textClass="text-green-800"
          />
        </div>
      </TableCell>

      {/* Project allocation cells - Default gray gradient pills */}
      {projects.map((project) => (
        <TableCell key={project.id} className="text-center border-r p-3 bg-gray-50/50 rounded-r-xl last:rounded-r-xl">
          <div className="flex items-center justify-center">
            <DisplayPill 
              value="0"
              gradientClass="bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300"
              textClass="text-gray-700"
            />
          </div>
        </TableCell>
      ))}
    </TableRow>
  );
};
