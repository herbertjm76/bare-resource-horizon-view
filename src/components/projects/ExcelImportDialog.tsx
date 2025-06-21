
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { ImportDialogContent } from './import/ImportDialogContent';

interface ExcelImportDialogProps {
  onImportComplete?: () => void;
  trigger?: React.ReactNode;
}

export const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({ 
  onImportComplete,
  trigger 
}) => {
  const [open, setOpen] = useState(false);

  const handleImportComplete = () => {
    setOpen(false);
    if (onImportComplete) {
      onImportComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ImportDialogContent onComplete={handleImportComplete} />
      </DialogContent>
    </Dialog>
  );
};
