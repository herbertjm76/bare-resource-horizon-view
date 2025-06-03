
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface EmergencyContactTabProps {
  profile: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
  error: string | null;
}

export const EmergencyContactTab: React.FC<EmergencyContactTabProps> = ({
  profile,
  handleChange,
  saving,
  onSave,
  error
}) => {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-brand-violet" />
          Emergency Contact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="emergency_contact_name">
              Contact Name
            </label>
            <Input
              id="emergency_contact_name"
              name="emergency_contact_name"
              value={profile.emergency_contact_name ?? ""}
              onChange={handleChange}
              className="w-full"
              placeholder="Full name of emergency contact"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="emergency_contact_phone">
              Contact Phone
            </label>
            <Input
              id="emergency_contact_phone"
              name="emergency_contact_phone"
              value={profile.emergency_contact_phone ?? ""}
              onChange={handleChange}
              className="w-full"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          
          <Button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-primary/90"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Emergency Contact"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
