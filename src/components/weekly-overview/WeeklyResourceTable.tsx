
import React, { useState } from 'react';
import { format, isSameMonth } from 'date-fns';
import { useWeeklyResourceData } from './hooks/useWeeklyResourceData';
import './weekly-resource-table.css';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  office?: string;
  isPending?: boolean;
  allocations?: Record<string, number | { projectId: string, hours: number }>;
}

interface WeeklyResourceTableProps {
  selectedWeek: Date;
  filters: {
    office: string;
    [key: string]: string;
  };
}

export const WeeklyResourceTable: React.FC<WeeklyResourceTableProps> = ({
  selectedWeek,
  filters,
}) => {
  const { isLoading, error, teamMembers, weekDays, updateAllocation } = useWeeklyResourceData(selectedWeek, filters);
  const { office_stages } = useOfficeSettings();
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  // Handle cell click to begin editing
  const handleCellClick = (memberId: string, date: string) => {
    const editKey = `${memberId}-${date}`;
    setEditingCell(editKey);
    const currentValue = teamMembers.find(m => m.id === memberId)?.allocations?.[date] || '';
    setTempValue(currentValue.toString());
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value);
  };

  // Handle input blur to save changes
  const handleInputBlur = async (memberId: string, date: string) => {
    setEditingCell(null);
    const newValue = parseInt(tempValue, 10);
    
    if (isNaN(newValue)) return;
    
    try {
      await updateAllocation(memberId, date, newValue);
      toast.success('Allocation updated');
    } catch (error) {
      toast.error('Failed to update allocation');
      console.error(error);
    }
  };

  // Handle keyboard events in input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, memberId: string, date: string) => {
    if (e.key === 'Enter') {
      handleInputBlur(memberId, date);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  // Get project count for each team member
  const getProjectCount = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member || !member.allocations) return 0;
    
    // Count unique projects
    const projectSet = new Set<string>();
    Object.entries(member.allocations).forEach(([_, allocationData]) => {
      if (typeof allocationData === 'object' && 'projectId' in allocationData) {
        projectSet.add(allocationData.projectId);
      }
    });
    
    return projectSet.size;
  };

  if (isLoading) {
    return (
      <div className="resource-table-loading">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
        <p className="text-muted-foreground">Loading team resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resource-table-error">
        <p className="text-destructive mb-2">Failed to load resource data</p>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );
  }

  if (!teamMembers.length) {
    return (
      <div className="resource-table-empty">
        <p className="text-muted-foreground">No team members found matching the selected filters.</p>
      </div>
    );
  }

  return (
    <Card className="resource-table-container shadow-sm border">
      <div className="resource-table-scroll h-[calc(100vh-240px)]">
        <table className="resource-table">
          <thead>
            <tr>
              <th className="column-name">Team Member</th>
              <th className="column-office">Office</th>
              
              {weekDays.map((day) => (
                <th 
                  key={day.date} 
                  className={`column-numeric ${day.isAnnualLeave ? 'column-annual-leave' : ''}`}
                >
                  {format(new Date(day.date), 'EEE')}<br/>
                  <span className="text-xs font-normal">
                    {format(new Date(day.date), 'd')}
                  </span>
                </th>
              ))}
              
              <th className="column-remarks">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr 
                key={member.id} 
                className={member.isPending ? 'member-pending' : ''}
              >
                <td className="column-name">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {member.name}
                      {getProjectCount(member.id) > 0 && (
                        <span className="project-count">{getProjectCount(member.id)}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                </td>
                <td className="column-office">
                  {member.office || '—'}
                </td>
                
                {weekDays.map((day) => {
                  const allocation = member.allocations?.[day.date];
                  const editKey = `${member.id}-${day.date}`;
                  const isEditing = editingCell === editKey;
                  
                  return (
                    <td 
                      key={`${member.id}-${day.date}`} 
                      className={`column-numeric ${day.isAnnualLeave ? 'column-annual-leave' : ''}`}
                      onClick={() => !isEditing && handleCellClick(member.id, day.date)}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempValue}
                          onChange={handleInputChange}
                          onBlur={() => handleInputBlur(member.id, day.date)}
                          onKeyDown={(e) => handleInputKeyDown(e, member.id, day.date)}
                          autoFocus
                        />
                      ) : (
                        (allocation && typeof allocation === 'object' && 'hours' in allocation) 
                          ? allocation.hours 
                          : allocation || ''
                      )}
                    </td>
                  );
                })}
                
                <td className="column-remarks">
                  {/* Placeholder for remarks */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
