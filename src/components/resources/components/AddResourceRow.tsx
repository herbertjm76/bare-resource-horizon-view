
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
        className={`workload-resource-cell project-resource-column`}
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '0',
          zIndex: 20,
          padding: '4px 32px' // More compact padding
        }}
      >
        <Button 
          variant="outline"
          size="sm" 
          className="h-6 text-xs px-2 py-1 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5"
          onClick={onAddResource}
        >
          <UserPlus className="h-3 w-3 mr-1" />
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
