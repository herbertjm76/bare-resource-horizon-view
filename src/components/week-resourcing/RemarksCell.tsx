
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface RemarksCellProps {
  memberId: string;
  initialRemarks?: string;
  onUpdate?: (memberId: string, remarks: string) => void;
}

export const RemarksCell: React.FC<RemarksCellProps> = ({
  memberId,
  initialRemarks = '',
  onUpdate
}) => {
  const [remarks, setRemarks] = useState(initialRemarks);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(memberId, remarks);
    }
  };

  return (
    <div className="w-full">
      {isEditing ? (
        <Input
          value={remarks}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full h-8 text-xs p-1"
          placeholder="Add remarks..."
          autoFocus
        />
      ) : (
        <div
          className="cursor-pointer w-full h-8 flex items-center text-xs px-2 hover:bg-muted/20"
          onClick={() => setIsEditing(true)}
        >
          {remarks || 'Add remarks...'}
        </div>
      )}
    </div>
  );
};
