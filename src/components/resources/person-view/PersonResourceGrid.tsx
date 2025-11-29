import React from 'react';
import { PersonGridHeader } from './PersonGridHeader';
import { PersonRow } from './PersonRow';
import { WeekInfo } from '../hooks/useGridWeeks';
import '../modern/workload-resource-grid.css';
import { PersonResourceData } from '@/hooks/usePersonResourceData';

interface PersonResourceGridProps {
  personData: PersonResourceData[];
  weeks: WeekInfo[];
  expandedPeople: string[];
  onTogglePersonExpand: (personId: string) => void;
  selectedDate?: Date;
  periodToShow?: number;
  onRefresh: () => void;
}

export const PersonResourceGrid: React.FC<PersonResourceGridProps> = ({
  personData,
  weeks,
  expandedPeople,
  onTogglePersonExpand,
  selectedDate,
  periodToShow,
  onRefresh
}) => {
  const tableWidth = 250 + (weeks.length * 80);
 
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
              <PersonGridHeader weeks={weeks} />
              
              <tbody>
                {personData.map((person, index) => (
              <PersonRow
                key={person.personId}
                person={person}
                weeks={weeks}
                isExpanded={expandedPeople.includes(person.personId)}
                onToggleExpand={() => onTogglePersonExpand(person.personId)}
                isEven={index % 2 === 0}
                selectedDate={selectedDate}
                periodToShow={periodToShow}
                onRefresh={onRefresh}
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
