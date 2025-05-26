
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, AlertTriangle, Target } from 'lucide-react';

interface StaffMember {
  first_name: string;
  last_name: string;
  name: string;
  role: string;
  availability: number;
  avatar_url?: string;
}

interface StaffStatusCardProps {
  staffData: StaffMember[];
}

export const StaffStatusCard: React.FC<StaffStatusCardProps> = ({ staffData }) => {
  // Get profile image URL or return default based on gender
  const getProfileImage = (member: StaffMember) => {
    // Check if member has an avatar image
    if (member.avatar_url) {
      return member.avatar_url;
    }
    
    // Use placeholder images as defaults based on name patterns
    // This is a simple approach - in a real app you'd have gender info or user uploads
    const firstName = (member.first_name || '').toLowerCase();
    const isFemale = firstName.includes('melody') || firstName.includes('sarah') || firstName.includes('emma') || firstName.includes('lisa');
    
    if (isFemale) {
      return 'https://images.unsplash.com/photo-1494790108755-2616c86b8e73?w=150&h=150&fit=crop&crop=face';
    } else {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
    }
  };

  // Get initials for avatar fallback
  const getInitials = (member: StaffMember) => {
    const first = member.first_name || '';
    const last = member.last_name || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  // Updated staff categorization with better thresholds
  const atCapacityStaff = staffData.filter(member => member.availability > 90);
  const optimalStaff = staffData.filter(member => member.availability > 65 && member.availability <= 90);
  const readyStaff = staffData.filter(member => member.availability <= 65);

  console.log('Staff categorization:', {
    atCapacity: atCapacityStaff,
    optimal: optimalStaff,
    ready: readyStaff,
    allStaff: staffData
  });

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-brand-violet" />
          Staff Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-6 px-6 pb-6">
            {/* At Capacity Staff (>90%) */}
            {atCapacityStaff.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <h4 className="font-semibold text-red-700">At Capacity ({atCapacityStaff.length})</h4>
                </div>
                <div className="space-y-3">
                  {atCapacityStaff.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={getProfileImage(member)} alt={`${member.first_name} ${member.last_name}`} />
                        <AvatarFallback className="bg-red-200 text-red-800 text-sm">
                          {getInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-800">
                            {member.first_name} {member.last_name}
                          </span>
                          <span className="text-red-600 font-semibold">{member.availability}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-red-100 rounded-full">
                          <div 
                            className="h-1.5 rounded-full bg-red-500"
                            style={{ width: `${Math.min(member.availability, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optimally Allocated Staff (66-90%) */}
            {optimalStaff.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-blue-500" />
                  <h4 className="font-semibold text-blue-700">Optimally Allocated ({optimalStaff.length})</h4>
                </div>
                <div className="space-y-3">
                  {optimalStaff.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={getProfileImage(member)} alt={`${member.first_name} ${member.last_name}`} />
                        <AvatarFallback className="bg-blue-200 text-blue-800 text-sm">
                          {getInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-800">
                            {member.first_name} {member.last_name}
                          </span>
                          <span className="text-blue-600 font-semibold">{member.availability}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-blue-100 rounded-full">
                          <div 
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${member.availability}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ready for Projects Staff (≤65%) */}
            {readyStaff.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-green-500" />
                  <h4 className="font-semibold text-green-700">
                    Ready for Projects ({readyStaff.length})
                    <span className="text-xs font-normal text-gray-500 ml-1">
                      available for new work
                    </span>
                  </h4>
                </div>
                <div className="space-y-3">
                  {readyStaff.slice(0, 4).map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={getProfileImage(member)} alt={`${member.first_name} ${member.last_name}`} />
                        <AvatarFallback className="bg-green-200 text-green-800 text-sm">
                          {getInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-800">
                            {member.first_name} {member.last_name}
                          </span>
                          <span className="text-green-600 font-semibold">{member.availability}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-green-100 rounded-full">
                          <div 
                            className="h-1.5 rounded-full bg-green-500"
                            style={{ width: `${member.availability}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {readyStaff.length > 4 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{readyStaff.length - 4} more available
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
