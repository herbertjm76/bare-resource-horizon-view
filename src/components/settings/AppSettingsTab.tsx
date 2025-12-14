import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const AppSettingsTab: React.FC = () => {
  const { company, refreshCompany } = useCompany();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    work_week_hours: company?.work_week_hours || 40,
    use_hours_or_percentage: company?.use_hours_or_percentage || 'hours',
    start_of_work_week: company?.start_of_work_week || 'Monday',
    opt_out_financials: company?.opt_out_financials || false,
    project_display_preference: company?.project_display_preference || 'code',
    allocation_warning_threshold: company?.allocation_warning_threshold || 150,
    allocation_danger_threshold: company?.allocation_danger_threshold || 180,
    allocation_max_limit: (company as any)?.allocation_max_limit || 200
  });

  const handleSave = async () => {
    if (!company?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          work_week_hours: formData.work_week_hours,
          use_hours_or_percentage: formData.use_hours_or_percentage,
          start_of_work_week: formData.start_of_work_week,
          opt_out_financials: formData.opt_out_financials,
          project_display_preference: formData.project_display_preference,
          allocation_warning_threshold: formData.allocation_warning_threshold,
          allocation_danger_threshold: formData.allocation_danger_threshold,
          allocation_max_limit: formData.allocation_max_limit
        } as any)
        .eq('id', company.id);

      if (error) throw error;

      toast.success('App settings updated successfully');
      refreshCompany();
    } catch (error) {
      console.error('Error updating app settings:', error);
      toast.error('Failed to update app settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Settings</CardTitle>
        <CardDescription>
          Configure application-wide settings for your company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Work Week Hours */}
        <div className="space-y-2">
          <Label htmlFor="work_week_hours">Work Week Hours</Label>
          <Input
            id="work_week_hours"
            type="number"
            min="1"
            max="168"
            value={formData.work_week_hours}
            onChange={(e) => setFormData({ ...formData, work_week_hours: parseInt(e.target.value) || 40 })}
            className="max-w-xs"
          />
          <p className="text-sm text-muted-foreground">
            Standard working hours per week (e.g., 40)
          </p>
        </div>

        {/* Hours or Percentage */}
        <div className="space-y-2">
          <Label htmlFor="use_hours_or_percentage">Display Preference</Label>
          <Select
            value={formData.use_hours_or_percentage}
            onValueChange={(value: 'hours' | 'percentage') => setFormData({ ...formData, use_hours_or_percentage: value })}
          >
            <SelectTrigger id="use_hours_or_percentage" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Choose how to display resource allocations
          </p>
        </div>

        {/* Start of Work Week */}
        <div className="space-y-2">
          <Label htmlFor="start_of_work_week">Start of Work Week</Label>
          <Select
            value={formData.start_of_work_week}
            onValueChange={(value: 'Monday' | 'Sunday' | 'Saturday') => setFormData({ ...formData, start_of_work_week: value })}
          >
            <SelectTrigger id="start_of_work_week" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monday">Monday</SelectItem>
              <SelectItem value="Sunday">Sunday</SelectItem>
              <SelectItem value="Saturday">Saturday</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Select the first day of your work week
          </p>
        </div>

        {/* Opt Out Financials */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="opt_out_financials">Hide Financial Data</Label>
            <p className="text-sm text-muted-foreground">
              Opt out of displaying financial information across the app
            </p>
          </div>
          <Switch
            id="opt_out_financials"
            checked={formData.opt_out_financials}
            onCheckedChange={(checked) => setFormData({ ...formData, opt_out_financials: checked })}
          />
        </div>

        {/* Project Display Preference */}
        <div className="space-y-2">
          <Label htmlFor="project_display_preference">Project Display Preference</Label>
          <Select
            value={formData.project_display_preference}
            onValueChange={(value: 'code' | 'name') => setFormData({ ...formData, project_display_preference: value })}
          >
            <SelectTrigger id="project_display_preference" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="code">Project Code</SelectItem>
              <SelectItem value="name">Project Name</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Choose whether to display projects by code or name in lists
          </p>
        </div>

        {/* Allocation Warning Threshold */}
        <div className="space-y-2">
          <Label htmlFor="allocation_warning_threshold">Warning Threshold (%)</Label>
          <Input
            id="allocation_warning_threshold"
            type="number"
            min="100"
            max="200"
            value={formData.allocation_warning_threshold}
            onChange={(e) => setFormData({ ...formData, allocation_warning_threshold: parseInt(e.target.value) || 150 })}
            className="max-w-xs"
          />
          <p className="text-sm text-muted-foreground">
            Show yellow warning when allocation exceeds this percentage (default: 150%)
          </p>
        </div>

        {/* Allocation Danger Threshold */}
        <div className="space-y-2">
          <Label htmlFor="allocation_danger_threshold">Danger Threshold (%)</Label>
          <Input
            id="allocation_danger_threshold"
            type="number"
            min="100"
            max="200"
            value={formData.allocation_danger_threshold}
            onChange={(e) => setFormData({ ...formData, allocation_danger_threshold: parseInt(e.target.value) || 180 })}
            className="max-w-xs"
          />
          <p className="text-sm text-muted-foreground">
            Show red danger warning when allocation exceeds this percentage (default: 180%)
          </p>
        </div>

        {/* Maximum Allocation Limit */}
        <div className="space-y-2">
          <Label htmlFor="allocation_max_limit">Maximum Allocation Limit (%)</Label>
          <Input
            id="allocation_max_limit"
            type="number"
            min="100"
            max="500"
            value={formData.allocation_max_limit}
            onChange={(e) => setFormData({ ...formData, allocation_max_limit: parseInt(e.target.value) || 200 })}
            className="max-w-xs"
          />
          <p className="text-sm text-muted-foreground">
            Block allocations that exceed this percentage (default: 200%)
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
