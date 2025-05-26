
import React from 'react';
import { Building2 } from 'lucide-react';
import { DEPARTMENT_COLORS } from '../constants/teamSummaryConstants';

interface DepartmentsSectionProps {
  departmentStats: Record<string, number>;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ departmentStats }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm text-white/80">Departments</div>
          <div className="text-2xl font-bold text-white">{Object.keys(departmentStats).length}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        {Object.entries(departmentStats)
          .filter(([_, count]) => count > 0)
          .slice(0, 2)
          .map(([dept, count]) => (
            <div key={dept} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${DEPARTMENT_COLORS[dept as keyof typeof DEPARTMENT_COLORS]} opacity-80`}></div>
                <span className="text-white/90">{dept}</span>
              </div>
              <span className="font-medium text-white">{count}</span>
            </div>
          ))}
        
        {Object.keys(departmentStats).length === 0 && (
          <div className="text-sm text-white/70">No departments assigned</div>
        )}
      </div>
    </div>
  );
};
