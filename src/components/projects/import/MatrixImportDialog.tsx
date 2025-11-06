import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MatrixImportDialogContent } from './MatrixImportDialogContent';

interface MatrixImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export const MatrixImportDialog: React.FC<MatrixImportDialogProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Project Matrix</DialogTitle>
        </DialogHeader>
        <MatrixImportDialogContent 
          onComplete={() => {
            onComplete?.();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
