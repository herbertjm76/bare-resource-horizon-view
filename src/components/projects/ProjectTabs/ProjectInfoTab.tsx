
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ProjectForm } from "../NewProjectDialog";

interface ProjectInfoTabProps {
  form: ProjectForm;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string }>;
  statusOptions: Array<{ label: string; value: string }>;
  onChange: (key: keyof ProjectForm, value: any) => void;
}

export const ProjectInfoTab: React.FC<ProjectInfoTabProps> = ({
  form,
  managers,
  countries,
  offices,
  officeStages,
  statusOptions,
  onChange
}) => {
  return (
    <div className="space-y-4 py-4">
      {/* Project Code & Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">Project Code</Label>
          <Input
            id="code"
            placeholder="P001"
            value={form.code}
            onChange={(e) => onChange("code", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            placeholder="New Project"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Project Manager */}
      <div>
        <Label htmlFor="manager">Project Manager</Label>
        <Select
          id="manager"
          value={form.manager}
          onValueChange={(value) => onChange("manager", value)}
        >
          <option value="">Select a project manager</option>
          <option value="not_assigned">Not Assigned</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Country & Office */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Select
            id="country"
            value={form.country}
            onValueChange={(value) => onChange("country", value)}
            required
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="office">Office</Label>
          <Select
            id="office"
            value={form.office}
            onValueChange={(value) => onChange("office", value)}
            required
          >
            <option value="">Select an office</option>
            {offices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.emoji ? `${office.emoji} ` : ''}{office.city}, {office.country}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Profit & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="profit">Target Profit %</Label>
          <Input
            id="profit"
            type="number"
            min="0"
            max="100"
            placeholder="30"
            value={form.profit}
            onChange={(e) => onChange("profit", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={form.status || ""}
            onValueChange={(value) => onChange("status", value)}
            required
          >
            <option value="">Select a status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Project Stages */}
      <div>
        <Label htmlFor="stages">Project Stages</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {officeStages.map((stage) => (
            <label 
              key={stage.id} 
              className={`px-3 py-2 border rounded-md cursor-pointer transition-colors duration-200 ${
                form.stages.includes(stage.id) 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background border-input hover:bg-muted'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={form.stages.includes(stage.id)}
                onChange={(e) => {
                  const updatedStages = e.target.checked
                    ? [...form.stages, stage.id]
                    : form.stages.filter(id => id !== stage.id);
                  onChange("stages", updatedStages);
                }}
              />
              {stage.name}
            </label>
          ))}
        </div>
        {officeStages.length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            No stages defined. Please add stages in office settings.
          </p>
        )}
      </div>
    </div>
  );
};
