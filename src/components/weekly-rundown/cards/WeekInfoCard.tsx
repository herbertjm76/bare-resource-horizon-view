import React from 'react';
import { format, getWeek } from 'date-fns';
import { Calendar, Settings } from 'lucide-react';
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
  const formattedDate = format(selectedWeek, 'MMMM d, yyyy');

  return (
    <Card className="relative h-full border-2 shadow-md overflow-hidden">
      <div className="absolute inset-0 bg-gradient-modern opacity-10"></div>
      <CardContent className="relative p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Week Overview</h3>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="text-lg font-bold text-foreground">{formattedDate}</p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Week Number</p>
            <p className="text-2xl font-bold text-primary">Week {weekNumber}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {/* Card visibility menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-1" />
                Cards
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
          <ManageCustomCardsDialog />
        </div>
      </CardContent>
    </Card>
  );
};
