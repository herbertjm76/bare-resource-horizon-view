
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, AlertTriangle, TrendingUp, Plane, Clock } from 'lucide-react';
import { useAnnualLeaveInsights } from '@/hooks/useAnnualLeaveInsights';
import { TeamMember } from '@/components/dashboard/types';

interface AnnualLeaveInsightsProps {
  teamMembers: TeamMember[];
  selectedMonth: Date;
}

export const AnnualLeaveInsights: React.FC<AnnualLeaveInsightsProps> = ({
  teamMembers,
  selectedMonth
}) => {
  const { insights, isLoading } = useAnnualLeaveInsights(teamMembers);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500 text-white text-xs">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 text-white text-xs">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Low</Badge>;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl p-6 border border-brand-violet/10 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-2xl p-6 border border-brand-violet/10 shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 50%, #1E3A8A 100%)'
      }}
    >
      <div className="text-white mb-6">
        <h2 className="text-xl font-bold mb-2">Annual Leave Overview</h2>
        <p className="text-blue-100 text-sm">
          {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} insights and upcoming leave planning
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Next Week Leave */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md text-center">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
            <Plane className="h-4 w-4 text-blue-500" />
            Next Week
          </h3>
          <div className="mb-4">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {insights.nextWeekCount}
            </div>
            <p className="text-xs text-gray-500">
              {insights.nextWeekCount === 1 ? 'person on leave' : 'people on leave'}
            </p>
            {insights.nextWeekCount > 0 && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                insights.nextWeekCount > teamMembers.length * 0.3 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {insights.nextWeekCount > teamMembers.length * 0.3 ? 'High Impact' : 'Manageable'}
              </span>
            )}
          </div>
        </div>

        {/* Next Month Leave */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md text-center">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4 text-green-500" />
            Next Month
          </h3>
          <div className="mb-4">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {insights.nextMonthCount}
            </div>
            <p className="text-xs text-gray-500">
              {insights.nextMonthCount === 1 ? 'person scheduled' : 'people scheduled'}
            </p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
              Plan Ahead
            </span>
          </div>
        </div>

        {/* Peak Week */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md text-center">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Peak Week
          </h3>
          <div className="mb-4">
            {insights.peakWeek ? (
              <>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {insights.peakWeek.count}
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Week of {insights.peakWeek.weekStart}
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  insights.peakWeek.count > teamMembers.length * 0.4 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {insights.peakWeek.count > teamMembers.length * 0.4 ? 'Critical' : 'Monitor'}
                </span>
              </>
            ) : (
              <>
                <div className="text-4xl font-bold text-gray-900 mb-2">0</div>
                <p className="text-xs text-gray-500">No peak identified</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  Balanced
                </span>
              </>
            )}
          </div>
        </div>

        {/* Team Coverage */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md text-center">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            Team Coverage
          </h3>
          <div className="mb-4">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {Math.round((1 - (insights.nextWeekCount / teamMembers.length)) * 100)}%
            </div>
            <p className="text-xs text-gray-500">Available next week</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
              insights.nextWeekCount / teamMembers.length > 0.5 ? 'bg-red-100 text-red-800' : 
              insights.nextWeekCount / teamMembers.length > 0.3 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {insights.nextWeekCount / teamMembers.length > 0.5 ? 'Low Coverage' :
               insights.nextWeekCount / teamMembers.length > 0.3 ? 'Moderate' : 'Good Coverage'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
