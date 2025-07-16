import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { TimeRange } from '../TimeRangeSelector';


interface WorkloadCardProps {
  workloadData?: number[][];
  projects?: any[];
  teamMembers?: any[];
  preRegisteredMembers?: any[];
  memberUtilizations?: any[];
  selectedTimeRange?: TimeRange;
}

export const WorkloadCard: React.FC<WorkloadCardProps> = ({
  workloadData,
  projects = [],
  teamMembers = [],
  preRegisteredMembers = [],
  memberUtilizations = [],
  selectedTimeRange = 'month'
}) => {
  // Combine all team members and pre-registered members to show ALL resources
  const allResources = [
    ...teamMembers.map(member => ({
      name: member.first_name || member.name || 'Unknown',
      type: 'active',
      id: member.id
    })),
    ...preRegisteredMembers.map(member => ({
      name: member.first_name || member.name || 'Unknown',
      type: 'pending',
      id: member.id
    }))
  ];

  // If no real data, fallback to mock data
  const teamResources = allResources.length > 0 
    ? allResources.map(resource => resource.name)
    : [
        'Sarah Chen',
        'Michael Rodriguez', 
        'Emma Thompson',
        'David Park',
        'Lisa Wang'
      ];

  // Get time period configuration based on selected time range
  const getTimeConfig = () => {
    switch (selectedTimeRange) {
      case 'week':
        return {
          periods: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          columnCount: 6, // 1 for name + 5 for days
          label: 'This Week'
        };
      case 'month':
        return {
          periods: ['W1', 'W2', 'W3', 'W4'],
          columnCount: 5, // 1 for name + 4 for weeks
          label: 'This Month'
        };
      case '3months':
        return {
          periods: ['Month 1', 'Month 2', 'Month 3'],
          columnCount: 4, // 1 for name + 3 for months
          label: '3 Months'
        };
      case '4months':
        return {
          periods: ['Month 1', 'Month 2', 'Month 3', 'Month 4'],
          columnCount: 5, // 1 for name + 4 for months
          label: '4 Months'
        };
      case '6months':
        return {
          periods: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
          columnCount: 7, // 1 for name + 6 for months
          label: '6 Months'
        };
      case 'year':
        return {
          periods: ['Q1', 'Q2', 'Q3', 'Q4'],
          columnCount: 5, // 1 for name + 4 for quarters
          label: 'This Year'
        };
      default:
        return {
          periods: ['W1', 'W2', 'W3', 'W4'],
          columnCount: 5,
          label: 'This Month'
        };
    }
  };

  const timeConfig = getTimeConfig();

  // Generate workload data based on time range using SAME data as Team Utilization card
  const generateWorkload = () => {
    return teamResources.map((resource, index) => {
      // Get the actual team member from the combined resources
      let actualMember;
      if (index < teamMembers.length) {
        actualMember = teamMembers[index];
      } else {
        actualMember = preRegisteredMembers[index - teamMembers.length];
      }
      
      // Use the SAME memberUtilizations data that the Team Utilization card uses
      let baseUtilization = 0;
      if (actualMember && memberUtilizations) {
        const memberData = memberUtilizations.find(m => m.memberId === actualMember.id);
        baseUtilization = memberData?.utilizationRate || 0;
        
        // Debug log for Paul Julius to track the data
        if (memberData?.memberName?.includes('Paul') || actualMember.first_name?.includes('Paul')) {
          console.log('🔍 WORKLOAD CARD - Paul Julius data:', {
            memberName: memberData?.memberName || `${actualMember.first_name} ${actualMember.last_name}`,
            utilizationRate: memberData?.utilizationRate,
            baseUtilization,
            memberData,
            actualMember
          });
        }
      }
      
      return Array.from({ length: timeConfig.periods.length }, () => {
        // Use real utilization with some variation for different periods (can go over 100%)
        return Math.max(0, baseUtilization + (Math.random() - 0.5) * 40);
      });
    });
  };

  const workloadMatrix = generateWorkload();
  
  const getIntensityColor = (intensity: number) => {
    // Green for good utilization (80-120%)
    if (intensity >= 80 && intensity <= 120) return 'bg-green-500';
    
    // Purple shades for under-utilization
    if (intensity < 80) {
      if (intensity <= 20) return 'bg-purple-600';
      if (intensity <= 40) return 'bg-purple-500';
      if (intensity <= 60) return 'bg-purple-400';
      return 'bg-purple-300';
    }
    
    // Purple shades for over-utilization
    if (intensity <= 140) return 'bg-purple-400';
    if (intensity <= 160) return 'bg-purple-500';
    return 'bg-purple-600';
  };

  return (
    <Card className="rounded-2xl border border-purple-500/20 shadow-lg hover:shadow-xl transition-shadow" style={{ background: '#7060A5' }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/90" />
            <span className="text-xs font-semibold text-white/90 tracking-wide">WORKLOAD</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-between h-full">
          {/* Period headers */}
          <div className={`grid gap-1 mb-2 ${
            timeConfig.columnCount === 4 ? 'grid-cols-4' :
            timeConfig.columnCount === 5 ? 'grid-cols-5' :
            timeConfig.columnCount === 6 ? 'grid-cols-6' :
            timeConfig.columnCount === 7 ? 'grid-cols-7' : 'grid-cols-5'
          }`}>
            <div className="text-xs text-white/60"></div>
            {timeConfig.periods.map(period => (
              <div key={period} className="text-xs text-white/80 text-center font-medium">
                {period}
              </div>
            ))}
          </div>
          
          {/* Resource rows with workload */}
          <div className="flex-1 space-y-1">
            {teamResources.map((resource, resourceIndex) => (
              <div key={resource} className={`grid gap-1 items-center ${
                timeConfig.columnCount === 4 ? 'grid-cols-4' :
                timeConfig.columnCount === 5 ? 'grid-cols-5' :
                timeConfig.columnCount === 6 ? 'grid-cols-6' :
                timeConfig.columnCount === 7 ? 'grid-cols-7' : 'grid-cols-5'
              }`}>
                <div className="text-xs text-white/90 font-medium truncate pr-2">
                  {resource.split(' ')[0]}
                </div>
                {workloadMatrix[resourceIndex].map((intensity, periodIndex) => (
                  <div
                    key={periodIndex}
                    className={`h-6 rounded-sm ${getIntensityColor(intensity)} transition-all duration-200 hover:scale-105 relative group`}
                    title={`${Math.round(intensity)}% utilization`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-700 font-medium opacity-0 group-hover:opacity-100">
                        {Math.round(intensity)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-white/60 mt-4 mb-2">
            <span>Under-utilized</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-purple-600"></div>
              <div className="w-3 h-3 rounded-sm bg-purple-400"></div>
              <div className="w-3 h-3 rounded-sm bg-green-500"></div>
              <div className="w-3 h-3 rounded-sm bg-purple-400"></div>
              <div className="w-3 h-3 rounded-sm bg-purple-600"></div>
            </div>
            <span>Over-utilized</span>
          </div>
          
          <div className="text-center">
            <span className="text-xs text-white/60">{timeConfig.label}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};