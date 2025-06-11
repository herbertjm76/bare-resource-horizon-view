
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { StaffStatusCard } from '../staff/StaffStatusCard';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';

interface StaffMember {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  availability: number;
  role: string;
  department?: string;
  location?: string;
  isPending?: boolean;
}

interface UnifiedStaffStatusCardProps {
  staffData: StaffMember[];
  preRegisteredMembers?: any[];
  selectedTimeRange?: string;
}

export const UnifiedStaffStatusCard: React.FC<UnifiedStaffStatusCardProps> = ({
  staffData,
  preRegisteredMembers = [],
  selectedTimeRange = 'week'
}) => {
  // Transform pre-registered members to match the staff data format
  const transformedPreRegistered = preRegisteredMembers.map(member => ({
    id: member.id,
    name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Pending Member',
    first_name: member.first_name || '',
    last_name: member.last_name || '',
    availability: 0, // Pre-registered members have 0% availability
    role: member.role || 'member',
    department: member.department,
    location: member.location,
    isPending: true
  }));

  // Combine active staff and pre-registered members
  const combinedStaffData = [...staffData, ...transformedPreRegistered];

  // Transform staffData to match the expected StaffStatusCard interface
  const transformedStaffData = combinedStaffData.map(member => ({
    ...member,
    name: member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim(),
    first_name: member.first_name || member.name?.split(' ')[0] || '',
    last_name: member.last_name || member.name?.split(' ').slice(1).join(' ') || '',
    role: member.role || 'member' // Ensure role is always defined
  }));

  const availableMembers = transformedStaffData.filter(member => member.availability >= 60).length;

  return (
    <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        {/* Title inside the card */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            Team Status
          </h2>
          <StandardizedHeaderBadge>
            {availableMembers} / {transformedStaffData.length} Available
          </StandardizedHeaderBadge>
        </div>

        {/* Original StaffStatusCard content */}
        <div className="flex-1 overflow-hidden [&_.card]:border-0 [&_.card]:shadow-none [&_.card]:bg-transparent [&_h3]:hidden [&_.flex.items-center.gap-2]:hidden">
          <StaffStatusCard 
            staffData={transformedStaffData} 
            selectedTimeRange={selectedTimeRange as any}
          />
        </div>
      </CardContent>
    </Card>
  );
};
