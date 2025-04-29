
import React from 'react';
import { UserPlus } from 'lucide-react';
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
    <tr className={`border-b ${rowBgClass}`}>
      <td className={`sticky left-0 z-10 w-12 ${rowBgClass}`}></td>
      <td className={`sticky left-12 z-10 p-2 ${rowBgClass}`}>
        <Button variant="ghost" size="sm" className="ml-8 text-muted-foreground" onClick={onAddResource}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </td>
      
      {Array.from({ length: weeksCount }).map((_, i) => <td key={i} className="p-0 w-8"></td>)}
    </tr>
  );
};
