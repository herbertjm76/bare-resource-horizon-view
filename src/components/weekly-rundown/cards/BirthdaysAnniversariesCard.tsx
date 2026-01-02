import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Cake, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, endOfWeek, getMonth, getDate, parseISO, differenceInYears } from 'date-fns';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { generateDemoCelebrations } from '@/data/demoData';

interface BirthdaysAnniversariesCardProps {
  selectedWeek: Date;
}

interface CelebrationMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  type: 'birthday' | 'anniversary';
  date: string;
  years?: number;
}

export const BirthdaysAnniversariesCard: React.FC<BirthdaysAnniversariesCardProps> = ({
  selectedWeek
}) => {
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

  const { data: celebrations = [] } = useQuery({
    queryKey: ['birthdays-anniversaries', isDemoMode ? 'demo' : company?.id, format(weekStart, 'yyyy-MM-dd')],
    queryFn: async () => {
      // Demo mode: return demo celebrations
      if (isDemoMode) {
        return generateDemoCelebrations();
      }

      if (!company?.id) return [];

      // Fetch all profiles with date_of_birth or start_date
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, date_of_birth, start_date')
        .eq('company_id', company.id);

      if (error) throw error;

      const results: CelebrationMember[] = [];
      const currentYear = weekStart.getFullYear();

      profiles?.forEach(profile => {
        // Check birthday
        if (profile.date_of_birth) {
          const dob = parseISO(profile.date_of_birth);
          const dobMonth = getMonth(dob);
          const dobDay = getDate(dob);

          // Check if birthday falls within this week (any year)
          for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
            if (getMonth(d) === dobMonth && getDate(d) === dobDay) {
              results.push({
                id: profile.id,
                first_name: profile.first_name,
                last_name: profile.last_name,
                avatar_url: profile.avatar_url,
                type: 'birthday',
                date: format(d, 'MMM d'),
                years: differenceInYears(d, dob)
              });
              break;
            }
          }
        }

        // Check work anniversary
        if (profile.start_date) {
          const startDate = parseISO(profile.start_date);
          const startMonth = getMonth(startDate);
          const startDay = getDate(startDate);

          // Check if anniversary falls within this week (any year)
          for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
            if (getMonth(d) === startMonth && getDate(d) === startDay) {
              const years = differenceInYears(d, startDate);
              if (years > 0) { // Only show if at least 1 year
                results.push({
                  id: `${profile.id}-anniversary`,
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                  avatar_url: profile.avatar_url,
                  type: 'anniversary',
                  date: format(d, 'MMM d'),
                  years
                });
              }
              break;
            }
          }
        }
      });

      return results;
    },
    enabled: isDemoMode || !!company?.id,
    staleTime: 5 * 60 * 1000
  });

  const birthdays = celebrations.filter(c => c.type === 'birthday');
  const anniversaries = celebrations.filter(c => c.type === 'anniversary');

  return (
    <Card className="h-full flex flex-col min-h-[120px] max-h-[25vh] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
      {/* Background watermark */}
      <span className="absolute -right-2 -bottom-2 text-[80px] text-muted-foreground/5 pointer-events-none leading-none">
        🎉
      </span>
      
      <CardHeader className="flex-shrink-0 pb-1 h-[40px] flex items-start pt-3">
        <CardTitle className="flex items-center justify-between w-full text-xs font-semibold text-foreground uppercase tracking-wide">
          <span>Celebrations</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {celebrations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-grey relative z-10">
        {celebrations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No celebrations this week</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {celebrations.map((person) => {
              const initials = `${person.first_name?.[0] || ''}${person.last_name?.[0] || ''}`.toUpperCase();
              
              return (
                <div key={person.id} className="flex flex-col items-center gap-1.5">
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={person.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-modern text-white text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center ${
                      person.type === 'birthday' ? 'bg-pink-500' : 'bg-amber-500'
                    }`}>
                      {person.type === 'birthday' ? (
                        <Cake className="h-2.5 w-2.5 text-white" />
                      ) : (
                        <Award className="h-2.5 w-2.5 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-foreground">{person.first_name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-[9px] px-1 py-0 h-3.5 ${
                      person.type === 'birthday' 
                        ? 'border-pink-300 text-pink-600' 
                        : 'border-amber-300 text-amber-600'
                    }`}
                  >
                    {person.type === 'birthday' ? '🎂' : `${person.years}yr`}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
