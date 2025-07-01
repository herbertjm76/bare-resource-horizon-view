
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
    <tr className={`border-b ${rowBgClass} hover:bg-gray-50 h-10`}>
      {/* Fixed counter column */}
      <td className={`counter-column ${rowBgClass} p-0.5 hover:bg-gray-50`}></td>
      
      {/* Add Resource button in project name column */}
      <td className={`project-name-column ${rowBgClass} p-2 hover:bg-gray-50`}>
        <Button 
          variant="default"
          size="sm" 
          className="flex items-center text-xs ml-4"
          onClick={onAddResource}
        >
          <UserPlus className="h-3.5 w-3.5 mr-1.5" />
          Add Resource
        </Button>
      </td>
      
      {/* Empty day columns */}
      {Array.from({ length: daysCount }, (_, index) => (
        <td key={index} className="day-column p-0"></td>
      ))}
    </tr>
  );
};
