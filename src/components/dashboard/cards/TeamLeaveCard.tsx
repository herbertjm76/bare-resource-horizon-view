import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from 'lucide-react';

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
  
  const maxValue = Math.max(...data, 10); // Ensure minimum scale
  const minValue = Math.min(...data);

  return (
    <Card className="rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-brand-violet/10">
            <Calendar className="h-5 w-5 text-brand-violet" />
          </div>
          <span className="text-lg font-semibold text-brand-violet">Team Leave</span>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chart area - taking full remaining height */}
          <div className="relative flex-1 min-h-[120px] bg-card/50 rounded-xl border border-border overflow-hidden">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 280 160">
                <defs>
                  <pattern id="grid" width="40" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 32" fill="none" stroke="hsl(var(--theme-primary))" strokeWidth="0.5" opacity="0.4"/>
                  </pattern>
                  <pattern id="colorGrid" width="40" height="32" patternUnits="userSpaceOnUse">
                    <rect width="40" height="32" fill="hsl(var(--theme-primary) / 0.08)"/>
                    <path d="M 40 0 L 0 0 0 32" fill="none" stroke="hsl(var(--theme-primary))" strokeWidth="0.8" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#colorGrid)" />
              </svg>
            </div>

            <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 280 160">
              {/* Define gradients using theme colors */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--theme-primary))" stopOpacity="0.6"/>
                  <stop offset="50%" stopColor="hsl(var(--theme-primary))" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="hsl(var(--theme-primary))" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--gradient-start))"/>
                  <stop offset="100%" stopColor="hsl(var(--gradient-end))"/>
                </linearGradient>
              </defs>
              
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4].map((line) => (
                <line
                  key={line}
                  x1="0"
                  y1={line * 32}
                  x2="280"
                  y2={line * 32}
                  stroke="hsl(var(--theme-primary))"
                  opacity="0.25"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                />
              ))}
              
              {/* Vertical grid lines for each label */}
              {labels.map((_, index) => (
                <line
                  key={index}
                  x1={(index * 280) / (labels.length - 1)}
                  y1="0"
                  x2={(index * 280) / (labels.length - 1)}
                  y2="160"
                  stroke="hsl(var(--theme-primary))"
                  opacity="0.25"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                />
              ))}
              
              {/* Area fill with S-curve */}
              <path
                d={`M 0 160 ${data.map((value, index) => {
                  const x = (index * 280) / (data.length - 1);
                  const normalizedValue = (value - minValue) / (maxValue - minValue);
                  // Create S-curve effect by using cubic-bezier-like calculation
                  const sCurveValue = normalizedValue < 0.5 
                    ? 2 * normalizedValue * normalizedValue 
                    : 1 - 2 * (1 - normalizedValue) * (1 - normalizedValue);
                  const y = 160 - (sCurveValue * 150); // Use 150 instead of 130 for fuller height
                  return `L ${x} ${y}`;
                }).join(' ')} L 280 160 Z`}
                fill="url(#areaGradient)"
                className="transition-all duration-500"
              />
              
              {/* Line chart with S-curve and Bezier smoothing */}
              <path
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d={(() => {
                  if (data.length < 2) return '';
                  
                  let path = '';
                  for (let i = 0; i < data.length; i++) {
                    const x = (i * 280) / (data.length - 1);
                    const normalizedValue = (data[i] - minValue) / (maxValue - minValue);
                    // Apply S-curve transformation
                    const sCurveValue = normalizedValue < 0.5 
                      ? 2 * normalizedValue * normalizedValue 
                      : 1 - 2 * (1 - normalizedValue) * (1 - normalizedValue);
                    const y = 160 - (sCurveValue * 150);
                    
                    if (i === 0) {
                      path += `M ${x} ${y}`;
                    } else {
                      // Add smooth curves between points
                      const prevX = ((i - 1) * 280) / (data.length - 1);
                      const prevNormalizedValue = (data[i - 1] - minValue) / (maxValue - minValue);
                      const prevSCurveValue = prevNormalizedValue < 0.5 
                        ? 2 * prevNormalizedValue * prevNormalizedValue 
                        : 1 - 2 * (1 - prevNormalizedValue) * (1 - prevNormalizedValue);
                      const prevY = 160 - (prevSCurveValue * 150);
                      
                      const cp1x = prevX + (x - prevX) * 0.3;
                      const cp1y = prevY;
                      const cp2x = x - (x - prevX) * 0.3;
                      const cp2y = y;
                      
                      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
                    }
                  }
                  return path;
                })()}
                className="drop-shadow-sm"
              />
              
              {/* Data points with glow effect using S-curve */}
              {data.map((value, index) => {
                const x = (index * 280) / (data.length - 1);
                const normalizedValue = (value - minValue) / (maxValue - minValue);
                const sCurveValue = normalizedValue < 0.5 
                  ? 2 * normalizedValue * normalizedValue 
                  : 1 - 2 * (1 - normalizedValue) * (1 - normalizedValue);
                const y = 160 - (sCurveValue * 150);
                return (
                  <g key={index}>
                    {/* Glow effect */}
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="hsl(var(--theme-primary))"
                      opacity="0.3"
                      className="animate-pulse"
                    />
                    {/* Main point */}
                    <circle
                      cx={x}
                      cy={y}
                      r="3"
                      fill="hsl(var(--theme-primary))"
                      stroke="white"
                      strokeWidth="2"
                      className="drop-shadow-md"
                    />
                  </g>
                );
              })}
              
              {/* Value labels using S-curve positioning */}
              {data.map((value, index) => {
                const x = (index * 280) / (data.length - 1);
                const normalizedValue = (value - minValue) / (maxValue - minValue);
                const sCurveValue = normalizedValue < 0.5 
                  ? 2 * normalizedValue * normalizedValue 
                  : 1 - 2 * (1 - normalizedValue) * (1 - normalizedValue);
                const y = 160 - (sCurveValue * 150);
                return (
                  <text
                    key={`label-${index}`}
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700"
                    opacity="0.8"
                  >
                    {value}
                  </text>
                );
              })}
            </svg>
          </div>
          
          {/* Dynamic labels with enhanced styling */}
          <div className={`grid gap-1 mt-3 px-2 ${
            viewType === 'week' ? 'grid-cols-7' : 
            viewType === 'month' ? 'grid-cols-4' : 
            'grid-cols-3'
          }`}>
            {labels.map((label, index) => (
              <div key={label} className="text-center">
                <span className={`text-xs font-medium ${
                  viewType === 'week' && (index === 0 || index === 6) 
                    ? 'text-gray-400' 
                    : 'text-gray-600'
                } tracking-wide`}>
                  {label}
                </span>
                <div className={`h-1 w-full mt-1 rounded-full ${
                  data[index] > (maxValue * 0.7) 
                    ? 'bg-brand-violet' 
                    : data[index] > (maxValue * 0.4) 
                    ? 'bg-brand-violet/60' 
                    : 'bg-brand-violet/30'
                }`} />
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-3">
            <Badge variant="outline" className="text-xs bg-card text-muted-foreground border-border px-3 py-1">
              {badgeText}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};