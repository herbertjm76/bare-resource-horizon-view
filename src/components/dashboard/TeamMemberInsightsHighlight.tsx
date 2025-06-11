
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/resources/filters/SearchInput';
import { Sparkles } from 'lucide-react';

interface TeamMemberInsightsHighlightProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const TeamMemberInsightsHighlight: React.FC<TeamMemberInsightsHighlightProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <Card className="w-full bg-white border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Compact Header with gradient background */}
          <div className="bg-gradient-to-r from-brand-violet to-purple-600 p-4 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-3 translate-x-3"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-2 -translate-x-2"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-0.5 tracking-tight">
                  Member Insights
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Search for team members to access analytics and performance metrics.
                </p>
              </div>
            </div>
          </div>

          {/* Simplified Search section */}
          <div className="p-4">
            <div className="max-w-md mx-auto">
              <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search by name, department, or role..."
                className="h-10 text-sm bg-gray-50/80 border-2 border-gray-200/80 focus-within:border-brand-violet focus-within:bg-white focus-within:shadow-md rounded-lg transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to view detailed insights for team members
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
