import React from 'react';
import { Input } from '@/components/ui/input';
import { useAppSettings } from '@/hooks/useAppSettings';

interface DayInfo {
  date: Date;
  label: string;
  dayName: string;
  monthLabel: string;
  isWeekend: boolean;
  isSunday: boolean;
  isFirstOfMonth: boolean;
  isEndOfWeek?: boolean;
}

interface AllocationInputCellProps {
  day: DayInfo;
  dayKey: string;
  inputValue: string;
  isLoading: boolean;
  isSaving: boolean;
  onInputChange: (dayKey: string, value: string) => void;
  onInputBlur: (dayKey: string, value: string) => void;
}

export const AllocationInputCell: React.FC<AllocationInputCellProps> = ({
  day,
  dayKey,
  inputValue,
  isLoading,
  isSaving,
  onInputChange,
  onInputBlur,
}) => {
  const { displayPreference } = useAppSettings();

  // Day view: treat 8h as 100% when in percentage mode
  const inputConfig =
    displayPreference === 'percentage'
      ? { step: 5, min: 0, max: 300, placeholder: '0' } // 300% == 24h of an 8h day
      : { step: 0.5, min: 0, max: 24, placeholder: '' };

  const isWeekendClass = day.isWeekend ? 'weekend' : '';
  const isSundayClass = day.isSunday ? 'sunday-border' : '';
  const isFirstOfMonthClass = day.isFirstOfMonth ? 'border-l-2 border-l-brand-primary/40' : '';
  const isEndOfWeekClass = day.isEndOfWeek ? 'border-r border-r-gray-300' : '';

  return (
    <td
      className={`p-0 text-center ${isWeekendClass} ${isSundayClass} ${isFirstOfMonthClass} ${isEndOfWeekClass}`}
      style={{ width: '30px', minWidth: '30px' }}
    >
      <div className="allocation-input-container px-0.5">
        <Input
          type="number"
          min={String(inputConfig.min)}
          max={String(inputConfig.max)}
          step={String(inputConfig.step)}
          value={inputValue}
          onChange={(e) => onInputChange(dayKey, e.target.value)}
          onBlur={(e) => onInputBlur(dayKey, e.target.value)}
          className={`w-full h-5 px-0 text-center text-xs border-gray-200 rounded-md focus:border-brand-violet ${isSaving ? 'bg-gray-50' : ''} ${day.isWeekend ? 'bg-muted/20' : ''}`}
          placeholder={inputConfig.placeholder}
          disabled={isLoading || isSaving}
        />
      </div>
    </td>
  );
};


