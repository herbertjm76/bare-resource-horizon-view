
import React from 'react';
import { Users, UserCheck, UserPlus } from 'lucide-react';
import { TeamStats } from '../types/teamSummaryTypes';

interface TotalMembersSectionProps {
  stats: TeamStats;
}

export const TotalMembersSection: React.FC<TotalMembersSectionProps> = ({ stats }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-white/20 rounded-lg">
          <Users className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-xs text-white/80">Total Members</div>
          <div className="text-xl font-bold text-white">{stats.totalMembers}</div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <UserCheck className="h-3 w-3 text-green-300" />
            <span className="text-white/90">Active</span>
          </div>
          <span className="font-medium text-white">{stats.activeMembers.length}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <UserPlus className="h-3 w-3 text-orange-300" />
            <span className="text-white/90">Pending</span>
          </div>
          <span className="font-medium text-white">{stats.preRegisteredMembers.length}</span>
        </div>
      </div>
    </div>
  );
};
