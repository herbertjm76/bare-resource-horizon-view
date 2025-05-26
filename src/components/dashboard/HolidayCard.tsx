
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from 'lucide-react';
import { useCompany } from "@/context/CompanyContext";
import { useOfficeSettings } from "@/context/officeSettings";
import { supabase } from '@/integrations/supabase/client';

interface Holiday {
  id: string;
  name: string;
  date: Date;
  end_date?: Date;
  offices: string[];
}

export const HolidayCard: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const { company } = useCompany();
  const { locations } = useOfficeSettings();

  useEffect(() => {
    const loadHolidays = async () => {
      if (!company) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const { data: holidaysData, error } = await supabase
          .from('office_holidays')
          .select('*')
          .eq('company_id', company.id);
        
        if (error) {
          console.error('Error fetching holidays:', error);
          setHolidays([]);
        } else if (holidaysData) {
          // Transform the data and match with location names
          const transformedHolidays: Holiday[] = holidaysData.map(holiday => {
            const location = locations.find(loc => loc.id === holiday.location_id);
            const locationName = location ? `${location.emoji} ${location.city}` : 'Unknown Location';
            
            return {
              id: holiday.id,
              name: holiday.name,
              date: new Date(holiday.date),
              end_date: holiday.end_date ? new Date(holiday.end_date) : undefined,
              offices: [locationName]
            };
          });
          
          setHolidays(transformedHolidays);
        }
      } catch (error) {
        console.error('Error loading holidays:', error);
        setHolidays([]);
      } finally {
        setLoading(false);
      }
    };

    loadHolidays();
  }, [company, locations]);

  const formatDate = (date: Date) => {
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  // Filter to only show upcoming holidays (today and future)
  const upcomingHolidays = holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    return holidayDate >= today;
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-brand-violet" />
          Upcoming Holidays
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50 animate-pulse" />
            <p className="text-sm">Loading holidays...</p>
          </div>
        ) : upcomingHolidays.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming holidays</p>
          </div>
        ) : (
          upcomingHolidays.map((holiday, index) => {
            const dateInfo = formatDate(holiday.date);
            
            return (
              <div key={holiday.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex-shrink-0 text-center min-w-[50px]">
                  <div className="text-xl font-bold text-brand-violet">{dateInfo.day}</div>
                  <div className="text-xs font-medium text-gray-600 uppercase">{dateInfo.month}</div>
                  <div className="text-xs text-gray-500">{dateInfo.weekday}</div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{holiday.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <div className="flex gap-1 flex-wrap">
                      {holiday.offices.map((office, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs py-0 px-1.5">
                          {office}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
