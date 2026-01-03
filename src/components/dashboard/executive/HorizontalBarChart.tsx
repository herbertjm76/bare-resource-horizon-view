import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BarData {
  label: string;
  value: number;
  max: number;
  color?: string;
}

interface HorizontalBarChartProps {
  title: string;
  data: BarData[];
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  data
}) => {
  return (
    <Card className="rounded-2xl border-border/50 bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item, idx) => {
          const percentage = (item.value / item.max) * 100;
          const barColor = item.color || 'hsl(var(--primary))';
          
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-muted-foreground">{item.value}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: barColor
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
