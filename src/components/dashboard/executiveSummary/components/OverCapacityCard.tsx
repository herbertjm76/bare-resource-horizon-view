import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';

interface OverCapacityCardProps {
  overCapacityHours: number;
  timeRange: string;
}

export const OverCapacityCard: React.FC<OverCapacityCardProps> = ({
  overCapacityHours,
  timeRange
}) => {
  return (
    <Card className="rounded-xl border-0 shadow-sm h-full" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-white/90" />
            <span className="text-[10px] font-medium text-white/90 tracking-wider">OVER CAPACITY</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{overCapacityHours}h</div>
            <div className="w-16 h-1 bg-white/30 rounded-full mx-auto">
              <div className="w-3/4 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className="text-[10px] border-white/30 text-white bg-white/15 px-2 py-0.5">
            Over Capacity
          </Badge>
          <span className="text-[10px] text-white/70">{timeRange}</span>
        </div>
      </CardContent>
    </Card>
  );
};