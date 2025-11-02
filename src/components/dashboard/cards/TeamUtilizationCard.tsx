import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface TeamUtilizationCardProps {
  utilizationRate?: number;
  status?: string;
  utilizationStatus?: {
    status: string;
    color: string;
    textColor: string;
  };
}

export const TeamUtilizationCard: React.FC<TeamUtilizationCardProps> = ({
  utilizationRate,
  status,
  utilizationStatus
}) => {
  const actualUtilizationRate = utilizationRate || 150;
  
  const getUtilizationConfig = (rate: number) => {
    if (rate <= 70) {
      return {
        status: 'Under-utilized',
        fill: 'hsl(var(--muted))',
        textColor: 'text-muted-foreground'
      };
    } else if (rate <= 100) {
      return {
        status: 'Optimal',
        fill: 'hsl(var(--brand-violet))',
        textColor: 'text-foreground'
      };
    } else {
      return {
        status: 'Over Capacity',
        fill: 'hsl(var(--brand-violet) / 0.7)',
        textColor: 'text-destructive'
      };
    }
  };
  
  const config = getUtilizationConfig(actualUtilizationRate);
  
  const chartData = [
    {
      name: 'Utilization',
      value: Math.min(actualUtilizationRate, 150),
      fill: config.fill
    }
  ];

  return (
    <Card className="rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-brand-violet/10">
            <TrendingUp className="h-5 w-5 text-brand-violet" />
          </div>
          <span className="text-lg font-semibold text-brand-violet">Team Utilization</span>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center relative p-6">
          <div className="relative w-full h-full max-w-[220px] max-h-[220px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="90%" 
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 150]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: 'hsl(var(--muted) / 0.2)' }}
                  dataKey="value"
                  cornerRadius={10}
                  fill={config.fill}
                  animationDuration={1000}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent text-center">
                {Math.round(actualUtilizationRate)}%
              </div>
              <div className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border text-center ${config.textColor}`}>
                {config.status}
              </div>
            </div>
          </div>

          {/* Modern status legend */}
          <div className="flex justify-center mt-4">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs bg-card/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border max-w-full">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-muted flex-shrink-0" />
                <span className="text-muted-foreground font-medium text-[10px]">Low</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-brand-violet flex-shrink-0" />
                <span className="text-muted-foreground font-medium text-[10px]">Optimal</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-brand-violet/70 flex-shrink-0" />
                <span className="text-muted-foreground font-medium text-[10px]">Over</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center pt-2">
          <Badge variant="outline" className="text-xs bg-card text-muted-foreground border-border shadow-sm">
            This Month
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};