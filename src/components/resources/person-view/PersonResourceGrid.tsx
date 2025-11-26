import React from 'react';
import { PersonGridHeader } from './PersonGridHeader';
import { PersonRow } from './PersonRow';
import { DayInfo } from '../grid/types';
import '../modern/workload-resource-grid.css';
import { PersonResourceData } from '@/hooks/usePersonResourceData';

interface PersonResourceGridProps {
  personData: PersonResourceData[];
  days: DayInfo[];
  expandedPeople: string[];
  onTogglePersonExpand: (personId: string) => void;
  selectedDate?: Date;
  periodToShow?: number;
}

export const PersonResourceGrid: React.FC<PersonResourceGridProps> = ({
  personData,
  days,
  expandedPeople,
  onTogglePersonExpand,
  selectedDate,
  periodToShow
}) => {
  // Calculate if we should center align (for 1-month views)
  const shouldCenterAlign = days.length <= 31;
  
  // Calculate total table width: person column (250px) + day columns (30px each)
  const tableWidth = 250 + (days.length * 30);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4">
        <div className="workload-resource-grid-container">
          <div className="workload-resource-table-wrapper">
            <table 
              className="workload-resource-table"
              style={{ 
                width: `${tableWidth}px`,
                minWidth: `${tableWidth}px`
              }}
            >
              <PersonGridHeader days={days} />
              
              <tbody>
                {personData.map((person, index) => (
                  <PersonRow
                    key={person.personId}
                    person={person}
                    days={days}
                    isExpanded={expandedPeople.includes(person.personId)}
                    onToggleExpand={() => onTogglePersonExpand(person.personId)}
                    isEven={index % 2 === 0}
                    selectedDate={selectedDate}
                    periodToShow={periodToShow}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
