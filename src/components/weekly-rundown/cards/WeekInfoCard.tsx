import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCardVisibility } from '@/hooks/useCardVisibility';
import { useCustomCardTypes } from '@/hooks/useCustomCards';
import { ManageCustomCardsDialog } from '../ManageCustomCardsDialog';
import { Settings } from 'lucide-react';

interface WeekInfoCardProps {
  selectedWeek: Date;
}

export const WeekInfoCard: React.FC<WeekInfoCardProps> = ({ selectedWeek }) => {
  const { visibility, toggleCard } = useCardVisibility();
  const { data: customCardTypes = [] } = useCustomCardTypes();
  
  const dayName = format(selectedWeek, 'EEE');
  const dayNumber = format(selectedWeek, 'dd');
  const monthName = format(selectedWeek, 'MMM');
  const year = format(selectedWeek, 'yyyy');

  return (
    <Card className="h-full border shadow-sm overflow-hidden min-w-[140px] max-w-[160px]">
      <div className="absolute inset-0 bg-gradient-modern opacity-5"></div>
      <CardContent className="relative p-3 h-full flex flex-col justify-between gap-3">
        <div className="flex flex-col items-center justify-center flex-1 gap-1.5">
          <Calendar className="h-4 w-4 text-primary opacity-70" />
          <div className="text-center space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">{dayName}</p>
            <p className="text-4xl font-bold text-foreground leading-none">{dayNumber}</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{monthName}</p>
            <p className="text-[10px] font-medium text-muted-foreground/70">{year}</p>
          </div>
        </div>

        <div className="flex gap-1.5 justify-center border-t pt-2">
          {/* Card visibility menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
              <DropdownMenuLabel>Visible Cards</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuCheckboxItem 
                checked={visibility.holidays} 
                onCheckedChange={(v) => toggleCard('holidays', v)}
              >
                Holidays
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={visibility.annualLeave} 
                onCheckedChange={(v) => toggleCard('annualLeave', v)}
              >
                Annual Leave
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={visibility.otherLeave} 
                onCheckedChange={(v) => toggleCard('otherLeave', v)}
              >
                Other Leave
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={visibility.notes} 
                onCheckedChange={(v) => toggleCard('notes', v)}
              >
                Notes
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={visibility.available} 
                onCheckedChange={(v) => toggleCard('available', v)}
              >
                Available This Week
              </DropdownMenuCheckboxItem>
              
              {customCardTypes.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Custom Cards</DropdownMenuLabel>
                  {customCardTypes.map(card => (
                    <DropdownMenuCheckboxItem 
                      key={card.id}
                      checked={visibility[`custom_${card.id}`] !== false}
                      onCheckedChange={(v) => toggleCard(`custom_${card.id}`, v)}
                    >
                      {card.icon && <span className="mr-2">{card.icon}</span>}
                      {card.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Manage custom cards button */}
          <ManageCustomCardsDialog iconOnly />
        </div>
      </CardContent>
    </Card>
  );
};
