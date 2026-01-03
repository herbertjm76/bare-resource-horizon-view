import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface WeekData {
  week: string;
  capacity: number;
  demand: number;
}

interface CapacityForecastChartProps {
  data: WeekData[];
}

export const CapacityForecastChart: React.FC<CapacityForecastChartProps> = ({
  data
}) => {
  const chartConfig = {
    capacity: {
      label: "Team Capacity",
      color: "hsl(var(--primary))",
    },
    demand: {
      label: "Project Demand",
      color: "hsl(var(--destructive))",
    },
  };

  return (
    <Card className="rounded-2xl border-border/50 bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Capacity Forecast (Next 8 Weeks)</CardTitle>
        <p className="text-xs text-muted-foreground">
          Red areas indicate capacity gaps where demand exceeds available resources
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="week" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                fontSize={11}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                fontSize={11}
                label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="capacity"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="demand"
                stroke="hsl(var(--destructive))"
                fill="hsl(var(--destructive))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
