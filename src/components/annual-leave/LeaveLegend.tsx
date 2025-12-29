import React from 'react';
import { useLeaveTypes } from '@/hooks/leave/useLeaveTypes';

export const LeaveLegend: React.FC = () => {
  const { leaveTypes, isLoading } = useLeaveTypes();

  return (
    <div className="flex items-center justify-center gap-4 py-2 px-2 text-xs flex-wrap">
      {/* Leave Types */}
      {!isLoading && leaveTypes.map((type) => (
        <div key={type.id} className="flex items-center gap-1.5">
          <div 
            className="w-3.5 h-3.5 rounded" 
            style={{ backgroundColor: type.color || '#3B82F6' }} 
          />
          <span className="text-muted-foreground">{type.code}</span>
        </div>
      ))}
      
      {/* Separators */}
      <div className="w-px h-4 bg-border" />
      
      {/* Weekend */}
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 rounded bg-muted/50 border border-border" />
        <span className="text-muted-foreground">Weekend</span>
      </div>
      
      {/* Today */}
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 rounded bg-primary/10 border border-primary/30" />
        <span className="text-muted-foreground">Today</span>
      </div>
    </div>
  );
};
