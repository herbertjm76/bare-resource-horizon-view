
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
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-brand-violet to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
            
            <div className="relative z-10 flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 tracking-tight">
                  Member Insights
                </h3>
                <p className="text-white/90 text-base leading-relaxed max-w-2xl">
                  Search for any team member to access comprehensive analytics, performance metrics, and resource allocation insights.
                </p>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="p-8 space-y-6">
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50/80 rounded-xl border border-emerald-100/60">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-emerald-700">Utilization Tracking</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50/80 rounded-xl border border-blue-100/60">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-700">Performance Metrics</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50/80 rounded-xl border border-purple-100/60">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-700">Resource Planning</span>
              </div>
            </div>

            {/* Search section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-gray-400" />
                <h4 className="text-lg font-semibold text-gray-900">Find Team Member</h4>
              </div>
              
              <div className="max-w-lg">
                <SearchInput
                  value={searchQuery}
                  onChange={onSearchChange}
                  placeholder="Search by name, department, or role..."
                  className="h-14 text-base bg-gray-50/80 border-2 border-gray-200/80 focus-within:border-brand-violet focus-within:bg-white focus-within:shadow-md rounded-xl transition-all duration-200 px-5"
                />
                <p className="text-sm text-gray-500 mt-2 ml-1">
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
