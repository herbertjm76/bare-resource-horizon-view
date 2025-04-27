
import React from 'react';

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
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Staff Availability</h3>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {staffMembers.map((member, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-800">{member.name}</span>
              <span className="text-gray-600">{member.role}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div 
                className="h-2 rounded-full"
                style={{ 
                  width: `${member.availability}%`, 
                  backgroundColor: member.availability > 80 ? '#4ADE80' : member.availability > 40 ? '#FCD34D' : '#F87171'
                }} 
              />
            </div>
            <span className="text-xs text-gray-500 self-end mt-1">{member.availability}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
