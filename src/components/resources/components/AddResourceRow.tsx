
import React from 'react';
import { PlusCircle } from 'lucide-react';

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
    <tr className={`border-b ${rowBgClass} h-6`}>
      {/* Fixed counter column */}
      <td className={`sticky-left-0 ${rowBgClass} z-10 p-0 w-12`}></td>
      
      {/* Resource info column */}
      <td 
        className={`sticky-left-12 ${rowBgClass} z-10 px-1 py-0`} 
        style={{ width: '200px', minWidth: '200px' }}
      >
        <button 
          className="flex items-center text-xs text-muted-foreground hover:text-foreground ml-5"
          onClick={onAddResource}
        >
          <PlusCircle className="h-3 w-3 mr-1" />
          <span>Add resource</span>
        </button>
      </td>
      
      {/* Empty cells for week columns */}
      {Array(weeksCount).fill(0).map((_, index) => (
        <td key={index} className="p-0"></td>
      ))}
      
      {/* Add blank flexible cell */}
      <td className="p-0"></td>
    </tr>
  );
};
