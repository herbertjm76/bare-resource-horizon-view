import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyInfoEditDialogProps {
  company: any;
  onUpdate: () => void;
}

export const CompanyInfoEditDialog: React.FC<CompanyInfoEditDialogProps> = ({
  company,
  onUpdate
}) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: company?.name || '',
  });

  const handleSave = async () => {
    if (!company?.id) return;

    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.name.trim(),
        })
        .eq('id', company.id);

      if (error) {
        console.error('Update error:', error);
        toast.error('Failed to update company information');
        return;
      }

      toast.success('Company information updated successfully');
      await onUpdate();
      setOpen(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to update company information');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-black/10 text-black/60 hover:text-black"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Company Name</DialogTitle>
          <DialogDescription>
            Update your company name
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter company name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
