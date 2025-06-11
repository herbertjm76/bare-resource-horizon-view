
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';

interface StaffMember {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  availability: number;
  role?: string;
  department?: string;
  location?: string;
}

interface UnifiedStaffStatusCardProps {
  staffData: StaffMember[];
  selectedTimeRange?: string;
}

export const UnifiedStaffStatusCard: React.FC<UnifiedStaffStatusCardProps> = ({
  staffData,
  selectedTimeRange = 'week'
}) => {
  // Get availability status color
  const getAvailabilityColor = (availability: number) => {
    if (availability >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (availability >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (availability >= 40) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getAvailabilityLabel = (availability: number) => {
    if (availability >= 80) return 'Available';
    if (availability >= 60) return 'Moderate';
    if (availability >= 40) return 'Busy';
    return 'Overloaded';
  };

  // Calculate summary stats
  const totalMembers = staffData.length;
  const averageAvailability = totalMembers > 0 
    ? Math.round(staffData.reduce((sum, member) => sum + member.availability, 0) / totalMembers)
    : 0;
  
  const availableMembers = staffData.filter(member => member.availability >= 60).length;

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white h-[600px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        {/* Title inside the card */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            Team Status
          </h2>
          <StandardizedHeaderBadge>
            {availableMembers} Available
          </StandardizedHeaderBadge>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border border-brand-violet/20">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-violet" />
              <div>
                <div className="text-lg font-bold text-brand-violet">{totalMembers}</div>
                <div className="text-xs text-gray-600">Total Members</div>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <div>
                <div className="text-lg font-bold text-emerald-600">{averageAvailability}%</div>
                <div className="text-xs text-gray-600">Avg Availability</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scrollable member list */}
        <ScrollArea className="flex-1">
          <div className="pr-4 space-y-3">
            {staffData.length === 0 ? (
              <div className="py-6 text-center">
                <Users className="h-8 w-8 mx-auto text-gray-300 mb-3" />
                <h3 className="text-base font-medium text-gray-600 mb-1">No Team Members</h3>
                <p className="text-gray-500 text-sm">Start by inviting team members to your workspace.</p>
              </div>
            ) : (
              staffData.map((member) => {
                const displayName = member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unknown Member';
                
                return (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{displayName}</h4>
                        <Badge className={`${getAvailabilityColor(member.availability)} text-xs flex-shrink-0`}>
                          {getAvailabilityLabel(member.availability)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {member.role && (
                          <span className="capitalize">{member.role}</span>
                        )}
                        {member.department && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{member.department}</span>
                          </div>
                        )}
                        {member.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{member.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-lg font-bold text-brand-primary">
                        {member.availability}%
                      </div>
                      <div className="text-xs text-gray-500">available</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
