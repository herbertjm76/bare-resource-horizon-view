
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AddResourceRowProps {
  isExpanded: boolean;
  rowBgClass: string;
  daysCount: number; // Changed from weeksCount to daysCount
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
      <td className={`sticky-left-0 ${rowBgClass} z-10 p-0.5 w-12 hover:bg-gray-50`}></td>
      
      {/* Add Resource column */}
      <td className={`sticky-left-12 ${rowBgClass} z-10 p-2 hover:bg-gray-50`} colSpan={daysCount + 1}>
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
    </tr>
  );
};
