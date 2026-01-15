import { Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PinButtonProps {
  isPinned: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default';
  className?: string;
}

export const PinButton = ({
  isPinned,
  onToggle,
  disabled,
  size = 'sm',
  className,
}: PinButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            disabled={disabled}
            className={cn(
              "h-7 w-7 shrink-0",
              isPinned 
                ? "text-primary hover:text-primary/80" 
                : "text-muted-foreground/50 hover:text-muted-foreground opacity-0 group-hover:opacity-100",
              isPinned && "opacity-100",
              className
            )}
          >
            <Pin 
              className={cn(
                size === 'sm' ? "h-3.5 w-3.5" : "h-4 w-4",
                isPinned && "fill-current"
              )} 
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {isPinned ? 'Unpin' : 'Pin to top'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
