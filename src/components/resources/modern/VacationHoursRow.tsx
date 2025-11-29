import React, { useState } from 'react';
import { WeekInfo } from '../hooks/useGridWeeks';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface VacationHoursRowProps {
  memberId: string;
  weeks: WeekInfo[];
  isEven: boolean;
}

export const VacationHoursRow: React.FC<VacationHoursRowProps> = ({
  memberId,
  weeks,
  isEven
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [vacationHours, setVacationHours] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (weekKey: string, value: string) => {
    setVacationHours(prev => ({
      ...prev,
      [weekKey]: value
    }));
  };

  const handleInputBlur = async (weekKey: string, value: string) => {
    if (!company?.id) return;

    const hours = parseInt(value) || 0;
    setIsSaving(true);

    try {
      // Parse week start date
      const weekStartDate = new Date(weekKey);
      
      // Calculate days in the week (Monday to Sunday)
      const daysInWeek = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStartDate);
        day.setDate(day.getDate() + i);
        daysInWeek.push(day.toISOString().split('T')[0]);
      }

      // Distribute hours across weekdays (Monday to Friday)
      const hoursPerDay = Math.floor(hours / 5);
      const remainderHours = hours % 5;

      // Delete existing leave records for this week
      await supabase
        .from('annual_leaves')
        .delete()
        .eq('company_id', company.id)
        .eq('member_id', memberId)
        .in('date', daysInWeek);

      if (hours > 0) {
        // Insert new leave records
        const leaveRecords = [];
        for (let i = 0; i < 5; i++) { // Monday to Friday
          const dayHours = hoursPerDay + (i < remainderHours ? 1 : 0);
          if (dayHours > 0) {
            leaveRecords.push({
              company_id: company.id,
              member_id: memberId,
              date: daysInWeek[i],
              hours: dayHours
            });
          }
        }

        if (leaveRecords.length > 0) {
          const { error } = await supabase
            .from('annual_leaves')
            .insert(leaveRecords);

          if (error) throw error;
        }
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['weekly-leave-details'] });
      queryClient.invalidateQueries({ queryKey: ['member-workload'] });
      
      toast.success('Vacation hours saved');
    } catch (error) {
      console.error('Error saving vacation hours:', error);
      toast.error('Failed to save vacation hours');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <tr className="vacation-hours-row" style={{ backgroundColor: '#f0f9ff' }}>
      <td 
        className="workload-resource-cell project-resource-column"
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '0',
          zIndex: 20,
          textAlign: 'left',
          padding: '8px 16px',
          borderRight: '2px solid rgba(156, 163, 175, 0.8)',
          borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
          backgroundColor: '#f0f9ff'
        }}
      >
        <div style={{ paddingLeft: '32px' }}>
          <span style={{ 
            fontSize: '12px',
            fontWeight: '500',
            color: 'hsl(var(--muted-foreground))',
            fontStyle: 'italic'
          }}>
            Vacation Hours
          </span>
        </div>
      </td>

      {weeks.map((week) => {
        const weekKey = week.weekStartDate.toISOString().split('T')[0];
        
        return (
          <td 
            key={weekKey} 
            className="workload-resource-cell week-column"
            style={{ 
              width: '80px', 
              minWidth: '80px',
              maxWidth: '80px',
              textAlign: 'center',
              padding: '4px',
              borderRight: '1px solid rgba(156, 163, 175, 0.6)',
              borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
              backgroundColor: '#f0f9ff',
              ...(week.isPreviousWeek && {
                opacity: 0.5
              })
            }}
          >
            <input
              type="number"
              min="0"
              max="40"
              value={vacationHours[weekKey] || ''}
              onChange={(e) => handleInputChange(weekKey, e.target.value)}
              onBlur={(e) => handleInputBlur(weekKey, e.target.value)}
              onFocus={(e) => e.target.select()}
              disabled={isSaving || week.isPreviousWeek}
              className="w-full h-full px-1 py-1 text-center border-0 bg-transparent
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white
                text-blue-600 font-medium"
              style={{
                fontSize: '13px',
                lineHeight: '24px',
                height: '28px',
                MozAppearance: 'textfield',
                WebkitAppearance: 'none'
              }}
              placeholder="0"
            />
          </td>
        );
      })}
    </tr>
  );
};
