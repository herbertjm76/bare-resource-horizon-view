import React from 'react';
import { LucideIcon, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StandardizedPageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: React.ReactNode;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

export const StandardizedPageHeader: React.FC<StandardizedPageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  children,
  isFullscreen,
  onFullscreenToggle
}) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 mb-3 py-2">
      {/* Left side: Icon, Title, Description */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" style={{ color: 'hsl(var(--theme-primary))' }} />
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight truncate" style={{ color: 'hsl(var(--theme-primary))' }}>
            {title}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground truncate pl-7 sm:pl-8">
          {description}
        </p>
      </div>

      {/* Right side: Children and Fullscreen toggle */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {children}
        {typeof window !== 'undefined' && window.innerWidth >= 768 && onFullscreenToggle && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onFullscreenToggle}
                className="h-8 w-8 p-0"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};