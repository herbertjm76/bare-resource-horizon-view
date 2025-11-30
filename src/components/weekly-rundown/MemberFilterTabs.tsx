import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UtilizationZone, ZoneCounts } from '@/types/weekly-overview';

interface MemberFilterTabsProps {
  activeZone: UtilizationZone;
  onZoneChange: (zone: UtilizationZone) => void;
  zoneCounts: ZoneCounts;
}

export const MemberFilterTabs: React.FC<MemberFilterTabsProps> = ({
  activeZone,
  onZoneChange,
  zoneCounts,
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
            {zoneCounts['needs-attention']}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger 
          value="available" 
          className="flex flex-col items-center gap-1 px-2 py-2 h-auto data-[state=active]:bg-background"
        >
          <span className="text-xs font-medium">Available</span>
          <Badge variant="default" className="h-5 min-w-[24px] text-[10px] px-1.5 bg-primary/20 text-primary hover:bg-primary/30">
            {zoneCounts['available']}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger 
          value="at-capacity" 
          className="flex flex-col items-center gap-1 px-2 py-2 h-auto data-[state=active]:bg-background"
        >
          <span className="text-xs font-medium">At Capacity</span>
          <Badge variant="secondary" className="h-5 min-w-[24px] text-[10px] px-1.5">
            {zoneCounts['at-capacity']}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger 
          value="over-allocated" 
          className="flex flex-col items-center gap-1 px-2 py-2 h-auto data-[state=active]:bg-background"
        >
          <span className="text-xs font-medium">Over-allocated</span>
          <Badge variant="destructive" className="h-5 min-w-[24px] text-[10px] px-1.5">
            {zoneCounts['over-allocated']}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger 
          value="all" 
          className="flex flex-col items-center gap-1 px-2 py-2 h-auto data-[state=active]:bg-background"
        >
          <span className="text-xs font-medium">All Members</span>
          <Badge variant="outline" className="h-5 min-w-[24px] text-[10px] px-1.5">
            {zoneCounts['all']}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};