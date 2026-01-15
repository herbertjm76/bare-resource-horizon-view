import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface SavePresetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, setAsDefault: boolean) => void;
  isSaving?: boolean;
}

export const SavePresetDialog = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
}: SavePresetDialogProps) => {
  const [name, setName] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), setAsDefault);
      setName('');
      setSetAsDefault(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSetAsDefault(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Save Filter Preset</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="preset-name">Preset Name</Label>
            <Input
              id="preset-name"
              placeholder="e.g., My Active Projects"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="set-default"
              checked={setAsDefault}
              onCheckedChange={(checked) => setSetAsDefault(checked === true)}
            />
            <Label htmlFor="set-default" className="text-sm font-normal cursor-pointer">
              Set as default (auto-apply when opening this view)
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isSaving}>
            {isSaving ? 'Saving...' : 'Save Preset'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
