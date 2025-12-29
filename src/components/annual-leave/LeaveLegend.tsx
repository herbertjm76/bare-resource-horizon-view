import React from 'react';

export const LeaveLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-4 py-2 px-2 text-xs flex-wrap">
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 rounded" style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6, #10B981)' }} />
        <span className="text-muted-foreground">Full Day (Leave Type Color)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 rounded opacity-50" style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6, #10B981)' }} />
        <span className="text-muted-foreground">Half Day (50% opacity)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 rounded bg-muted/50 border border-border" />
        <span className="text-muted-foreground">Weekend</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 rounded bg-primary/10 border border-primary/30" />
        <span className="text-muted-foreground">Today</span>
      </div>
    </div>
  );
};
