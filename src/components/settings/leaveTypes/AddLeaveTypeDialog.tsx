import React, { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeaveType } from '@/types/leave';
import { 
  Palmtree, 
  Thermometer, 
  Baby, 
  Heart, 
  GraduationCap, 
  FileText,
  Briefcase,
  Home,
  Plane,
  Clock
} from 'lucide-react';

interface AddLeaveTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    code: string;
    color: string;
    icon: string;
    requires_attachment: boolean;
  }) => void;
  editingType: LeaveType | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

const iconOptions = [
  { value: 'palmtree', label: 'Palm Tree', Icon: Palmtree },
  { value: 'thermometer', label: 'Thermometer', Icon: Thermometer },
  { value: 'baby', label: 'Baby', Icon: Baby },
  { value: 'heart', label: 'Heart', Icon: Heart },
  { value: 'graduation-cap', label: 'Graduation', Icon: GraduationCap },
  { value: 'file-text', label: 'Document', Icon: FileText },
  { value: 'briefcase', label: 'Briefcase', Icon: Briefcase },
  { value: 'home', label: 'Home', Icon: Home },
  { value: 'plane', label: 'Travel', Icon: Plane },
  { value: 'clock', label: 'Clock', Icon: Clock },
];

const colorOptions = [
  { value: '#22C55E', label: 'Green' },
  { value: '#EF4444', label: 'Red' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#6B7280', label: 'Gray' },
  { value: '#14B8A6', label: 'Teal' },
  { value: '#F97316', label: 'Orange' },
  { value: '#06B6D4', label: 'Cyan' },
];

export const AddLeaveTypeDialog: React.FC<AddLeaveTypeDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingType,
  isSubmitting,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('file-text');
  const [requiresAttachment, setRequiresAttachment] = useState(false);

  useEffect(() => {
    if (editingType) {
      setName(editingType.name);
      setCode(editingType.code);
      setColor(editingType.color);
      setIcon(editingType.icon || 'file-text');
      setRequiresAttachment(editingType.requires_attachment);
    } else {
      setName('');
      setCode('');
      setColor('#3B82F6');
      setIcon('file-text');
      setRequiresAttachment(false);
    }
  }, [editingType, open]);

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate code from name
    if (!editingType) {
      setCode(value.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    onSubmit({
      name: name.trim(),
      code: code.trim(),
      color,
      icon,
      requires_attachment: requiresAttachment
    });
  };

  const selectedIcon = iconOptions.find(i => i.value === icon);
  const IconComponent = selectedIcon?.Icon || FileText;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingType ? 'Edit Leave Type' : 'Add Leave Type'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Vacation / PTO"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., vacation"
              required
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier (lowercase, no spaces)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      {colorOptions.find(c => c.value === color)?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: c.value }}
                        />
                        {c.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" style={{ color }} />
                      {selectedIcon?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      <div className="flex items-center gap-2">
                        <i.Icon className="w-4 h-4" />
                        {i.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label htmlFor="requires_attachment" className="font-medium">
                Requires Attachment
              </Label>
              <p className="text-xs text-muted-foreground">
                E.g., medical certificate for sick leave
              </p>
            </div>
            <Switch
              id="requires_attachment"
              checked={requiresAttachment}
              onCheckedChange={setRequiresAttachment}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Saving...' : editingType ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
