
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  if (!isExpanded) return null;
  
  return (
    <tr className={rowBgClass}>
      {/* Fixed counter column */}
      <td className={`sticky left-0 z-10 p-2 w-12 ${rowBgClass}`}></td>
      
      {/* Add resource button column */}
      <td 
        className={`sticky left-12 z-10 p-1 ${rowBgClass}`} 
        style={{ width: '200px', minWidth: '200px' }}
      >
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 ml-5 text-brand-violet hover:bg-brand-violet/10"
            onClick={onAddResource}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">Add Resource</span>
          </Button>
        </div>
      </td>
      
      {/* Empty cells for week columns */}
      {Array(weeksCount).fill(0).map((_, index) => (
        <td key={index} className="p-0" style={{ width: '10px', minWidth: '10px' }}></td>
      ))}
      
      {/* Add blank flexible cell */}
      <td className="p-0"></td>
    </tr>
  );
};
