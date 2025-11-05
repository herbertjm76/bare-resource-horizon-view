
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { TeamImportDialogContent } from './import/TeamImportDialogContent';

interface TeamExcelImportDialogProps {
  onImportComplete?: () => void;
  trigger?: React.ReactNode;
}

export const TeamExcelImportDialog: React.FC<TeamExcelImportDialogProps> = ({ 
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
            <UserPlus className="h-4 w-4 mr-2" />
            Import Team
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <TeamImportDialogContent onComplete={handleImportComplete} />
      </DialogContent>
    </Dialog>
  );
};
