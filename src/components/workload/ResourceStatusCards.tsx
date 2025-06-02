
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/types';

interface ResourceStatusCardsProps {
  members: TeamMember[];
  workloadData: Record<string, Record<string, WorkloadBreakdown>>;
  periodToShow: number;
}

export const ResourceStatusCards: React.FC<ResourceStatusCardsProps> = ({
  members,
  workloadData,
  periodToShow
}) => {
  // Calculate which members need resourcing (low utilization) and are overloaded
  const memberStatus = members.map(member => {
    const weeklyCapacity = member.weekly_capacity || 40;
    const totalCapacity = weeklyCapacity * periodToShow;
    
    const memberData = workloadData[member.id] || {};
    const totalAllocated = Object.values(memberData).reduce((sum, breakdown) => sum + breakdown.total, 0);
    
    const utilization = totalCapacity > 0 ? (totalAllocated / totalCapacity) * 100 : 0;
    
    return {
      member,
      utilization,
      totalAllocated,
      totalCapacity
    };
  });

  const needsResourcing = memberStatus.filter(m => m.utilization < 60);
  const overloaded = memberStatus.filter(m => m.utilization > 100);

  const renderMemberAvatars = (memberList: typeof memberStatus, maxShow: number = 6) => {
    const membersToShow = memberList.slice(0, maxShow);
    const remainingCount = memberList.length - maxShow;

    return (
      <div className="flex items-center justify-center gap-2">
        <div className="flex gap-1">
          {membersToShow.map(({ member }) => (
            <Avatar key={member.id} className="h-8 w-8">
              <AvatarFallback className="text-xs bg-gray-300 text-gray-700">
                {member.first_name?.charAt(0) || '?'}{member.last_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        {remainingCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Needs Resourcing</h3>
                <p className="text-xs text-gray-500">Under 60% utilization</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {needsResourcing.length}
              </Badge>
            </div>
            {needsResourcing.length > 0 ? (
              renderMemberAvatars(needsResourcing)
            ) : (
              <div className="text-xs text-gray-500 italic">All team members well utilized</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Overloaded Staff</h3>
                <p className="text-xs text-gray-500">Over 100% utilization</p>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {overloaded.length}
              </Badge>
            </div>
            {overloaded.length > 0 ? (
              renderMemberAvatars(overloaded)
            ) : (
              <div className="text-xs text-gray-500 italic">No overloaded team members</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
