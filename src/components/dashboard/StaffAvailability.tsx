
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface StaffMember {
  name: string;
  availability: number;
  role: string;
}

interface StaffAvailabilityProps {
  staffMembers: StaffMember[];
}

export const StaffAvailability: React.FC<StaffAvailabilityProps> = ({ staffMembers }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Staff Availability</h3>
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-2">
          {staffMembers.map((member, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-xl mb-1">
                  <span className="font-medium text-gray-800">{member.name}</span>
                  <span className="text-gray-900">{member.availability}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full">
                  <div 
                    className="h-2 rounded-full bg-theme-primary"
                    style={{ width: `${member.availability}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
