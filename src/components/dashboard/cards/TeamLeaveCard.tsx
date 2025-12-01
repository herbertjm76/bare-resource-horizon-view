import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TeamLeaveCardProps {
  leaveData?: number[];
  teamMembers?: any[];
  memberUtilizations?: any[];
  viewType?: 'week' | 'month' | 'quarter';
}

export const TeamLeaveCard: React.FC<TeamLeaveCardProps> = ({
  leaveData,
  teamMembers = [],
  memberUtilizations = [],
  viewType = 'month'
}) => {
  // Generate leave data based on view type
  const generateLeaveData = (view: string) => {
    const teamSize = teamMembers.length || 5;
    
    // Calculate total leave from real data
    const totalAnnualLeave = memberUtilizations.reduce((total, member) => total + (member.annualLeave || 0), 0);
    const totalOtherLeave = memberUtilizations.reduce((total, member) => total + (member.otherLeave || 0), 0);
    const totalLeave = totalAnnualLeave + totalOtherLeave;
    
    // Adjust data length based on view
    const dataLength = view === 'week' ? 7 : view === 'month' ? 4 : 3; // week=7days, month=4weeks, quarter=3months
    const baseLeave = totalLeave > 0 ? totalLeave / dataLength : teamSize * 3;
    
    return Array.from({ length: dataLength }, (_, index) => {
      // Create different patterns based on view type
      let multiplier = 1;
      if (view === 'week') {
        multiplier = index === 0 || index === 6 ? 0.2 : 1.5; // Lower weekend usage
      } else if (view === 'month') {
        multiplier = index === 1 || index === 2 ? 1.3 : 0.8; // Higher middle weeks
      } else {
        multiplier = index === 1 ? 1.4 : 0.9; // Higher middle month for quarter
      }
      
      const variation = Math.random() * 1.2 + 0.4; // 40-160% variation
      return Math.round(baseLeave * multiplier * variation);
    });
  };
  
  // Get labels based on view type
  const getLabels = (view: string) => {
    switch (view) {
      case 'week':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      case 'month':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      case 'quarter':
        return ['Month 1', 'Month 2', 'Month 3'];
      default:
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    }
  };
  
  // Get badge text based on view type
  const getBadgeText = (view: string) => {
    switch (view) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'quarter':
        return 'This Quarter';
      default:
        return 'This Month';
    }
  };
  
  const data = leaveData || generateLeaveData(viewType);
  const labels = getLabels(viewType);
  const badgeText = getBadgeText(viewType);
  
  const chartData = labels.map((label, index) => ({
    name: label,
    leave: data[index]
  }));

  return (
    <Card className="rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-theme-primary/10">
            <Calendar className="h-5 w-5 text-theme-primary" />
          </div>
          <span className="text-lg font-semibold text-theme-primary">Team Leave</span>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <div className="relative flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="leaveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--brand-violet))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--brand-violet))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} days`, 'Leave']}
                />
                <Area 
                  type="monotone" 
                  dataKey="leave" 
                  stroke="hsl(var(--brand-violet))" 
                  strokeWidth={3}
                  fill="url(#leaveGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center mt-3">
            <StandardizedBadge variant="secondary" size="sm">
              {badgeText}
            </StandardizedBadge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};