import React from 'react';
import { format, getWeek } from 'date-fns';
import { Calendar, Settings, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCardVisibility } from '@/hooks/useCardVisibility';
import { useCustomCardTypes } from '@/hooks/useCustomCards';
import { ManageCustomCardsDialog } from '../ManageCustomCardsDialog';

interface WeekInfoCardProps {
  selectedWeek: Date;
}

export const WeekInfoCard: React.FC<WeekInfoCardProps> = ({ selectedWeek }) => {
  const { visibility, toggleCard } = useCardVisibility();
  const { data: customCardTypes = [] } = useCustomCardTypes();
  
  const weekNumber = getWeek(selectedWeek, { weekStartsOn: 1 });
  const dayName = format(selectedWeek, 'EEEE');
  const dayNumber = format(selectedWeek, 'dd');
  const monthName = format(selectedWeek, 'MMM');
  const year = format(selectedWeek, 'yyyy');

  return (
    <Card className="relative h-full border-2 shadow-md overflow-hidden">
      <div className="absolute inset-0 bg-gradient-modern opacity-10"></div>
      <CardContent className="relative p-3 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col items-center justify-center flex-1">
            <Calendar className="h-4 w-4 text-primary mb-1" />
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground">{dayName}</p>
              <p className="text-2xl font-bold text-foreground leading-none my-1">{dayNumber}</p>
              <p className="text-xs font-medium text-muted-foreground">{monthName}</p>
              <p className="text-xs font-medium text-muted-foreground">{year}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 border-l pl-2">
            <p className="text-xs text-muted-foreground mb-1">Week</p>
            <p className="text-3xl font-bold text-primary leading-none">{weekNumber}</p>
          </div>
        </div>

        <div className="flex gap-1.5 justify-center">
          {/* Card visibility menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-7 w-7">
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
