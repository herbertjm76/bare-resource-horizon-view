
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { useHolidays } from '../hooks/useHolidays';

interface Holiday {
  id: string;
  name: string;
  date: string;
  office: string;
  type: 'public' | 'company';
}

interface MockEvent {
  id: number;
  title: string;
  date: string;
  type: string;
  location: string;
  attendees: number | null;
}

type UnifiedEvent = Holiday | MockEvent;

export const UnifiedHolidayCard: React.FC = () => {
  const { holidays, isLoading } = useHolidays();

  // Mock upcoming events for demonstration
  const mockEvents: MockEvent[] = [
    {
      id: 1,
      title: 'Annual Team Retreat',
      date: '2024-07-15',
      type: 'company',
      location: 'Remote',
      attendees: 12
    },
    {
      id: 2,
      title: 'Q3 Planning Session',
      date: '2024-07-22',
      type: 'meeting',
      location: 'Conference Room A',
      attendees: 8
    },
    {
      id: 3,
      title: 'Independence Day',
      date: '2024-07-04',
      type: 'holiday',
      location: 'All Offices',
      attendees: null
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'holiday': return 'bg-red-100 text-red-800 border-red-200';
      case 'company': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isHoliday = (event: UnifiedEvent): event is Holiday => {
    return 'name' in event;
  };

  const getEventTitle = (event: UnifiedEvent): string => {
    return isHoliday(event) ? event.name : event.title;
  };

  const getEventLocation = (event: UnifiedEvent): string => {
    return isHoliday(event) ? event.office : event.location;
  };

  const getEventAttendees = (event: UnifiedEvent): number | null => {
    return isHoliday(event) ? null : event.attendees;
  };

  const allEvents: UnifiedEvent[] = [...(holidays || []), ...mockEvents];
  const upcomingEvents = allEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm bg-white h-[600px]">
        <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Upcoming Events
          </h2>
          <div className="space-y-4 flex-1">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
                <div className="p-1 rounded bg-gray-200 animate-pulse">
                  <div className="h-4 w-4"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white h-[600px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        {/* Title inside the card */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Upcoming Events
          </h2>
          <StandardizedHeaderBadge>
            {upcomingEvents.length} Events
          </StandardizedHeaderBadge>
        </div>
        
        {/* Scrollable events list */}
        <ScrollArea className="flex-1">
          <div className="pr-4 space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="py-6 text-center">
                <Calendar className="h-8 w-8 mx-auto text-gray-300 mb-3" />
                <h3 className="text-base font-medium text-gray-600 mb-1">No Upcoming Events</h3>
                <p className="text-gray-500 text-sm">No events scheduled for the coming weeks.</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div key={isHoliday(event) ? event.id : `mock-${event.id}`} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
                  <div className="p-1 rounded bg-brand-violet/20">
                    <Calendar className="h-4 w-4 text-brand-violet" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{getEventTitle(event)}</h4>
                      <Badge className={`${getEventTypeColor(event.type)} border text-xs`}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{formatDate(event.date)}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {getEventLocation(event) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{getEventLocation(event)}</span>
                        </div>
                      )}
                      {getEventAttendees(event) && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{getEventAttendees(event)} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
