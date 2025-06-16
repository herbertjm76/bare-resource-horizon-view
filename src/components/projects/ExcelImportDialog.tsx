
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { ImportDialogContent } from './import/ImportDialogContent';
import { useExcelImport } from './import/useExcelImport';

interface ExcelImportDialogProps {
  onImportComplete: () => void;
}

export const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({
  onImportComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resetDialog } = useExcelImport(onImportComplete);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetDialog, 300); // Reset after dialog closes
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Projects from Excel
          </DialogTitle>
        </DialogHeader>

        <ImportDialogContent
          onImportComplete={onImportComplete}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
