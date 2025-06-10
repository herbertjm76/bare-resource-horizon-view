
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/resources/filters/SearchInput';
import { Search, TrendingUp, Users, Target, Sparkles } from 'lucide-react';

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
          <div className="bg-gradient-to-r from-brand-violet to-purple-600 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-3 -translate-x-3"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 tracking-tight">
                  Member Insights
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Search for team members to access analytics and performance metrics.
                </p>
              </div>
            </div>
          </div>

          {/* Compact Content section */}
          <div className="p-5 space-y-4">
            {/* Compact feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 bg-emerald-50/80 rounded-lg border border-emerald-100/60">
                <div className="p-1.5 bg-emerald-100 rounded-md">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-emerald-700">Utilization Tracking</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50/80 rounded-lg border border-blue-100/60">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <Target className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-700">Performance Metrics</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50/80 rounded-lg border border-purple-100/60">
                <div className="p-1.5 bg-purple-100 rounded-md">
                  <Users className="h-3.5 w-3.5 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-purple-700">Resource Planning</span>
              </div>
            </div>

            {/* Compact Search section */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <h4 className="text-base font-semibold text-gray-900">Find Team Member</h4>
              </div>
              
              <div className="max-w-lg mx-auto">
                <SearchInput
                  value={searchQuery}
                  onChange={onSearchChange}
                  placeholder="Search by name, department, or role..."
                  className="h-11 text-sm bg-gray-50/80 border-2 border-gray-200/80 focus-within:border-brand-violet focus-within:bg-white focus-within:shadow-md rounded-lg transition-all duration-200 px-4"
                />
                <p className="text-xs text-gray-500 mt-1.5 ml-1 text-center">
                  Start typing to discover detailed insights for any team member
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
