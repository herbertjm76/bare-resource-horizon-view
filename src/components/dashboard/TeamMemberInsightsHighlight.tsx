
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/resources/filters/SearchInput';
import { Eye, TrendingUp, Users, Target } from 'lucide-react';

interface TeamMemberInsightsHighlightProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const TeamMemberInsightsHighlight: React.FC<TeamMemberInsightsHighlightProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <Card className="bg-gradient-to-r from-brand-violet/10 via-blue-50 to-purple-50 border-2 border-brand-violet/20">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Left side - Feature highlight */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-violet/10 rounded-lg">
                <Eye className="h-5 w-5 text-brand-violet" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Team Member Insights
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Search for any team member to view their utilization metrics, performance insights, and resource allocation details.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>Utilization Tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>Performance Metrics</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Resource Planning</span>
              </div>
            </div>
          </div>

          {/* Right side - Search bar */}
          <div className="w-full lg:w-80">
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search team members..."
              className="bg-white border-brand-violet/20 focus-within:border-brand-violet"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
