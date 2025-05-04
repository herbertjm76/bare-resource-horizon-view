
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddResourceRowProps {
  isExpanded: boolean;
  rowBgClass: string;
  weeksCount: number;
  onAddResource: () => void;
}

export const AddResourceRow: React.FC<AddResourceRowProps> = ({
  isExpanded,
  rowBgClass,
  weeksCount,
  onAddResource
}) => {
  // Don't render if the project isn't expanded
  if (!isExpanded) {
    return null;
  }

  return (
    <tr className={`border-b ${rowBgClass} hover:bg-gray-100 add-resource-row h-6`}>
      {/* Fixed counter column */}
      <td className={`sticky-left-0 ${rowBgClass} z-10 p-0 w-12 hover:bg-gray-100`}></td>
      
      {/* Add resource button column */}
      <td 
        className={`sticky-left-12 ${rowBgClass} z-10 p-0 hover:bg-gray-100`} 
        style={{ width: '200px', minWidth: '200px' }}
      >
        <div className="flex items-center h-6 pl-5">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary p-0 h-5"
            onClick={onAddResource}
          >
            <PlusCircle className="h-3 w-3" />
            <span>Add Resource</span>
          </Button>
        </div>
      </td>
      
      {/* Empty cells for each week */}
      {Array(weeksCount).fill(0).map((_, i) => (
        <td key={i} className="p-0"></td>
      ))}
      
      {/* Add blank flexible cell */}
      <td className="p-0"></td>
    </tr>
  );
};
