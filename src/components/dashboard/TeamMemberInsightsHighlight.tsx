
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/resources/filters/SearchInput';
import { Eye } from 'lucide-react';

interface TeamMemberInsightsHighlightProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const TeamMemberInsightsHighlight: React.FC<TeamMemberInsightsHighlightProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <Card className="w-full bg-gradient-to-r from-brand-violet/10 via-blue-50 to-purple-50 border-[2px] border-brand-violet/20 rounded-lg">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Left side - Feature highlight */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-violet/10 rounded-lg">
                <Eye className="h-4 w-4 text-brand-violet" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                Team Member Insights
              </h3>
            </div>
          </div>

          {/* Right side - Search bar */}
          <div className="flex-1 max-w-full sm:max-w-80">
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search team members..."
              className="w-full bg-white border-brand-violet/20 focus-within:border-brand-violet"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
