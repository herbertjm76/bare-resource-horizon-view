
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/resources/filters/SearchInput';
import { Eye, TrendingUp, Users, Target, Sparkles } from 'lucide-react';

interface TeamMemberInsightsHighlightProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const TeamMemberInsightsHighlight: React.FC<TeamMemberInsightsHighlightProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-brand-violet/20 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-violet/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
      
      <CardContent className="relative p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Left side - Feature highlight */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-brand-violet to-blue-600 rounded-xl shadow-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Team Member Insights
                </h3>
                <p className="text-sm text-brand-violet font-medium">
                  Powered by AI Analytics
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 text-base leading-relaxed max-w-2xl">
              Search for any team member to view their comprehensive utilization metrics, 
              performance insights, and detailed resource allocation analytics.
            </p>
            
            {/* Feature badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-200/50 shadow-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Utilization Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-200/50 shadow-sm">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Performance Metrics</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-200/50 shadow-sm">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Resource Planning</span>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced search bar */}
          <div className="w-full lg:w-96">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Search Team Members
              </label>
              <div className="relative">
                <SearchInput
                  value={searchQuery}
                  onChange={onSearchChange}
                  placeholder="Type a name to get started..."
                  className="bg-white/90 backdrop-blur-sm border-2 border-brand-violet/30 focus-within:border-brand-violet focus-within:ring-4 focus-within:ring-brand-violet/10 rounded-xl shadow-sm text-base h-12 transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 bg-brand-violet rounded-full animate-pulse" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Start typing to see instant results and insights
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
