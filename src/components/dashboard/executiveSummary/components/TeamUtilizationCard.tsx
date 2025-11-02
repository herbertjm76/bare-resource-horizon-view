import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface TeamUtilizationCardProps {
  utilizationRate: number;
  utilizationStatus: {
    color: string;
    label: string;
  };
}

export const TeamUtilizationCard: React.FC<TeamUtilizationCardProps> = ({
  utilizationRate,
  utilizationStatus
}) => {
  const isOverCapacity = utilizationRate > 100;
  
  const baseData = [
    {
      name: 'Base',
      value: Math.min(utilizationRate, 100),
      fill: 'white'
    }
  ];
  
  const overflowData = [
    {
      name: 'Overflow',
      value: Math.max(0, utilizationRate - 100),
      fill: '#ec4899'
    }
  ];

  return (
    <Card className="rounded-xl border-0 shadow-sm h-full" style={{ background: 'linear-gradient(135deg, hsl(var(--brand-violet)), hsl(var(--brand-violet) / 0.8))' }}>
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-white/90" />
            <span className="text-[10px] font-medium text-white/90 tracking-wider">TEAM UTILIZATION</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative w-16 h-16 mx-auto mb-2">
            {/* Base ring */}
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="70%" 
                outerRadius="100%" 
                data={baseData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: 'rgba(255,255,255,0.2)' }}
                  dataKey="value"
                  cornerRadius={10}
                  fill="white"
                />
              </RadialBarChart>
            </ResponsiveContainer>
            
            {/* Overflow ring - overlaps like Apple Watch */}
            {isOverCapacity && (
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="75%" 
                    outerRadius="105%" 
                    data={overflowData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      background={false}
                      dataKey="value"
                      cornerRadius={10}
                      fill="#ec4899"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(236, 72, 153, 0.6))' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{Math.round(utilizationRate)}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className="text-[10px] border-white/30 text-white bg-white/15 px-2 py-0.5">
            {utilizationStatus.label}
          </Badge>
          <span className="text-[10px] text-white/70">This Month</span>
        </div>
      </CardContent>
    </Card>
  );
};