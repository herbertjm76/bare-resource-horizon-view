
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
    <Card className="w-full bg-gradient-to-br from-brand-violet/5 via-blue-50/50 to-purple-50/50 border-2 border-brand-violet/15 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="p-3 bg-brand-violet/10 rounded-xl border border-brand-violet/20">
                <Eye className="h-6 w-6 text-brand-violet" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Team Member Insights
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                  Search for any team member to view their utilization metrics, performance insights, and resource allocation details.
                </p>
              </div>
              
              {/* Feature Tags */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full border border-gray-200/50">
                  <TrendingUp className="h-3.5 w-3.5 text-brand-violet" />
                  <span className="text-gray-700 font-medium">Utilization Tracking</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full border border-gray-200/50">
                  <Target className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-gray-700 font-medium">Performance Metrics</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full border border-gray-200/50">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-gray-700 font-medium">Resource Planning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="border-t border-gray-200/50 pt-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Search Team Members
              </label>
              <div className="max-w-md">
                <SearchInput
                  value={searchQuery}
                  onChange={onSearchChange}
                  placeholder="Search by name, department, or role..."
                  className="h-12 text-base bg-white/80 border-2 border-gray-200/60 focus-within:border-brand-violet focus-within:bg-white shadow-sm rounded-lg transition-all duration-200"
                />
              </div>
              <p className="text-xs text-gray-500">
                Start typing to filter team members and access their detailed insights
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
