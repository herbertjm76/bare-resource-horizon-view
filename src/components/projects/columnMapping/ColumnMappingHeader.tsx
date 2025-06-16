
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ColumnMappingHeaderProps {
  onDownloadTemplate: () => void;
}

export const ColumnMappingHeader: React.FC<ColumnMappingHeaderProps> = ({
  onDownloadTemplate
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Map your Excel columns to project fields. Required fields are marked with an asterisk (*).
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onDownloadTemplate}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download Template
      </Button>
    </div>
  );
};
