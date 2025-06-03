
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
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 sm:gap-4 lg:gap-6">
          {/* Left side - Feature highlight */}
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-brand-violet/10 rounded-lg">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-brand-violet" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Team Member Insights
              </h3>
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
