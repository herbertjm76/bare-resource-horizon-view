
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserPlus } from 'lucide-react';
import { TeamStats } from '../types/teamSummaryTypes';

interface TotalMembersSectionProps {
  stats: TeamStats;
}

export const TotalMembersSection: React.FC<TotalMembersSectionProps> = ({ stats }) => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-card">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-1">Total Members</p>
            <p className="text-2xl font-bold text-foreground mb-1">{stats.totalMembers}</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-3 w-3 text-green-600" />
                  <span className="text-muted-foreground">Active</span>
                </div>
                <span className="font-medium text-foreground">{stats.activeMembers.length}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <UserPlus className="h-3 w-3 text-orange-600" />
                  <span className="text-muted-foreground">Pending</span>
                </div>
                <span className="font-medium text-foreground">{stats.preRegisteredMembers.length}</span>
              </div>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 ml-2">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
