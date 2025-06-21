
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewProjectDialogContent } from './dialog/NewProjectDialogContent';

interface NewProjectDialogProps {
  onProjectCreated?: () => void;
  trigger?: React.ReactNode;
}

export const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ 
  onProjectCreated,
  trigger 
}) => {
  const [open, setOpen] = useState(false);

  const handleProjectCreated = () => {
    setOpen(false);
    if (onProjectCreated) {
      onProjectCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <NewProjectDialogContent onSuccess={handleProjectCreated} />
      </DialogContent>
    </Dialog>
  );
};
