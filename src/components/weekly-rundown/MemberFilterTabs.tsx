import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export type UtilizationZone = 'needs-attention' | 'available' | 'at-capacity' | 'over-allocated' | 'all';

interface MemberFilterTabsProps {
  activeZone: UtilizationZone;
  onZoneChange: (zone: UtilizationZone) => void;
  counts: {
    needsAttention: number;
    available: number;
    atCapacity: number;
    overAllocated: number;
    all: number;
  };
}

export const MemberFilterTabs: React.FC<MemberFilterTabsProps> = ({
  activeZone,
  onZoneChange,
  counts,
}) => {
  return (
    <Tabs value={activeZone} onValueChange={(v) => onZoneChange(v as UtilizationZone)} className="w-full">
      <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
        <TabsTrigger 
          value="needs-attention" 
          className="flex flex-col items-center gap-1 px-2 py-2 h-auto data-[state=active]:bg-background"
        >
          <span className="text-xs font-medium">Needs Attention</span>
          <Badge variant="destructive" className="h-5 min-w-[24px] text-[10px] px-1.5">
            {counts.needsAttention}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger 
          value="available" 
          className="flex flex-col items-center gap-1 px-2 py-2 h-auto data-[state=active]:bg-background"
        >
          <span className="text-xs font-medium">Available</span>
          <Badge variant="default" className="h-5 min-w-[24px] text-[10px] px-1.5 bg-primary/20 text-primary hover:bg-primary/30">
            {counts.available}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger 
          value="at-capacity" 
          className="flex flex-col items-center gap-1 px-2 py-2 h-auto data-[state=active]:bg-background"
        >
          <span className="text-xs font-medium">At Capacity</span>
          <Badge variant="secondary" className="h-5 min-w-[24px] text-[10px] px-1.5">
            {counts.atCapacity}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger 
          value="over-allocated" 
          className="flex flex-col items-center gap-1 px-2 py-2 h-auto data-[state=active]:bg-background"
        >
          <span className="text-xs font-medium">Over-allocated</span>
          <Badge variant="destructive" className="h-5 min-w-[24px] text-[10px] px-1.5">
            {counts.overAllocated}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger 
          value="all" 
          className="flex flex-col items-center gap-1 px-2 py-2 h-auto data-[state=active]:bg-background"
        >
          <span className="text-xs font-medium">All Members</span>
          <Badge variant="outline" className="h-5 min-w-[24px] text-[10px] px-1.5">
            {counts.all}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};