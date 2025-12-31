
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Users, FileText, Code } from "lucide-react";

type RoleOption = { id: string; name: string };

interface Props {
  form: {
    code: string;
    name: string;
    manager: string;
  };
  managers: RoleOption[];
  onChange: (key: any, value: any) => void;
}

const NewProjectStep1Info: React.FC<Props> = ({ form, managers, onChange }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-brand-accent">Project Information</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
          <Code className="w-4 h-4" />Project Code<span className="text-destructive">*</span>
        </label>
        <Input 
          value={form.code} 
          onChange={e => onChange('code', e.target.value)} 
          required 
          placeholder="Enter Project Code" 
          className="text-base"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
          <FileText className="w-4 h-4" />Project Name<span className="text-destructive">*</span>
        </label>
        <Input 
          value={form.name} 
          onChange={e => onChange('name', e.target.value)}
          required 
          placeholder="Enter Project Name"
          className="text-base" 
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
          <Users className="w-4 h-4" />Project Manager<span className="text-destructive">*</span>
        </label>
        <Select value={form.manager} onValueChange={v => onChange('manager', v)}>
          <SelectTrigger className="text-base">
            <SelectValue placeholder="Select Manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_assigned">Not Assigned</SelectItem>
            {managers.map(m => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

export default NewProjectStep1Info;
