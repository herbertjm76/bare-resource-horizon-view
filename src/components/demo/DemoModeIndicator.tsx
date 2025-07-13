import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Clock } from 'lucide-react';
import { useDemoAuth } from '@/hooks/useDemoAuth';

export const DemoModeIndicator: React.FC = () => {
  const { isDemoMode, exitDemoMode, getRemainingTime } = useDemoAuth();
  
  if (!isDemoMode) return null;

  const remainingMs = getRemainingTime();
  const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-background/90 backdrop-blur-md border rounded-lg p-3 shadow-lg">
      <Badge variant="secondary" className="text-xs">
        <Clock className="w-3 h-3 mr-1" />
        Demo Mode ({remainingMinutes}m left)
      </Badge>
      <Button
        variant="outline"
        size="sm"
        onClick={exitDemoMode}
        className="text-xs"
      >
        <LogOut className="w-3 h-3 mr-1" />
        Exit Demo
      </Button>
    </div>
  );
};