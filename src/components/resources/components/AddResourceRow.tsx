
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AddResourceRowProps {
  isExpanded: boolean;
  rowBgClass: string;
  daysCount: number;
  onAddResource: () => void;
}

export const AddResourceRow: React.FC<AddResourceRowProps> = ({
  isExpanded,
  rowBgClass,
  daysCount,
  onAddResource
}) => {
  if (!isExpanded) return null;
  
  return (
    <tr className={`workload-resource-row add-resource-row border-b hover:bg-gray-50 h-10`}>
      {/* Add Resource button spans the full project resource column */}
      <td 
        className={`workload-resource-cell project-resource-column p-2`}
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '0',
          zIndex: 20
        }}
      >
        <Button 
          variant="default"
          size="sm" 
          className="flex items-center text-xs"
          onClick={onAddResource}
        >
          <UserPlus className="h-3.5 w-3.5 mr-1.5" />
          Add Resource
        </Button>
      </td>
      
      {/* Empty day columns */}
      {Array.from({ length: daysCount }, (_, index) => (
        <td key={index} className="workload-resource-cell day-column p-0"></td>
      ))}
    </tr>
  );
};
