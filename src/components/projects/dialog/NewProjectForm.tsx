
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Hash, FileText, Users, MapPin, Building, Briefcase, TrendingUp, Layers } from 'lucide-react';

interface NewProjectFormProps {
  form: any;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string; color?: string }>;
  departments: Array<{ id: string; name: string }>;
  updateStageApplicability: (stageId: string, isChecked: boolean) => void;
  handleChange: (key: string, value: any) => void;
}

export const NewProjectForm: React.FC<NewProjectFormProps> = ({
  form,
  managers,
  countries,
  offices,
  officeStages,
  departments,
  handleChange
}) => {
  const { project_statuses } = useOfficeSettings();
  const { hideFinancials } = useAppSettings();

  const statusOptions = project_statuses.map(status => ({
    label: status.name,
    value: status.name
  }));

  return (
    <ScrollArea className="h-[450px] pr-4">
      <div className="py-6 space-y-8">
        {/* Essential Info Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            Required
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                Project Code
              </Label>
              <Input
                id="code"
                placeholder="e.g. PRJ-001"
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                className="h-10 bg-muted/30 border-border/50 focus:bg-background transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="abbreviation" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Abbreviation
              </Label>
              <Input
                id="abbreviation"
                placeholder="e.g. WRD"
                value={form.abbreviation || ''}
                onChange={(e) => handleChange("abbreviation", e.target.value)}
                className="h-10 bg-muted/30 border-border/50 focus:bg-background transition-colors"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Project Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Website Redesign"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-10 bg-muted/30 border-border/50 focus:bg-background transition-colors"
            />
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
            Team & Status
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                Project Manager
              </Label>
              <Select 
                value={form.manager || "no_manager"} 
                onValueChange={(val) => handleChange("manager", val === "no_manager" ? "" : val)}
              >
                <SelectTrigger className="h-10 bg-muted/30 border-border/50">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_manager">Not assigned</SelectItem>
                  {managers
                    .filter(m => m.id && m.id.trim() !== "")
                    .map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                Status
              </Label>
              <Select 
                value={form.status || "none"} 
                onValueChange={(value) => handleChange("status", value === "none" ? "" : value)}
              >
                <SelectTrigger className="h-10 bg-muted/30 border-border/50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not selected</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
            Location
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Country
              </Label>
              <Select 
                value={form.country || "no_country"} 
                onValueChange={(value) => handleChange("country", value === "no_country" ? "" : value)}
              >
                <SelectTrigger className="h-10 bg-muted/30 border-border/50">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_country">Not specified</SelectItem>
                  {countries
                    .filter((c) => c && c.trim() !== "")
                    .map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                Office
              </Label>
              <Select 
                value={form.office || "no_office"} 
                onValueChange={(value) => handleChange("office", value === "no_office" ? "" : value)}
              >
                <SelectTrigger className="h-10 bg-muted/30 border-border/50">
                  <SelectValue placeholder="Select office" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_office">Not specified</SelectItem>
                  {offices
                    .filter((office) => office.id && office.id.trim() !== "")
                    .map((office) => (
                      <SelectItem key={office.id} value={office.id}>
                        {office.emoji ? `${office.emoji} ` : ''}{office.city}, {office.country}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {departments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                Department
              </Label>
              <Select 
                value={form.department || "no_dept"} 
                onValueChange={(value) => handleChange("department", value === "no_dept" ? "" : value)}
              >
                <SelectTrigger className="h-10 bg-muted/30 border-border/50">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_dept">Not specified</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </section>

        {/* Financial Section - only show if not opted out */}
        {!hideFinancials && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              Financial
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  Target Profit %
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 20"
                  value={form.profit}
                  onChange={(e) => handleChange("profit", e.target.value)}
                  className="h-10 bg-muted/30 border-border/50 focus:bg-background transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  Average Rate
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 150"
                  value={form.avgRate || ''}
                  onChange={(e) => handleChange("avgRate", e.target.value)}
                  className="h-10 bg-muted/30 border-border/50 focus:bg-background transition-colors"
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </ScrollArea>
  );
};
