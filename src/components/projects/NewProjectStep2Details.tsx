import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Percent, Building, MapPin, CheckSquare, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logger } from "@/utils/logger";

type OfficeOption = { id: string; city: string; country: string; code?: string; emoji?: string };
type ProjectStatus = string;

interface Props {
  form: {
    country: string;
    profit: string;
    status: ProjectStatus | "";
    office: string;
    avgRate: string;
  };
  countries: string[];
  offices: OfficeOption[];
  statusOptions: { label: string; value: ProjectStatus }[];
  onChange: (key: any, value: any) => void;
  onShowRateCalc: () => void;
}

const NewProjectStep2Details: React.FC<Props> = ({
  form, countries, offices, statusOptions, onChange, onShowRateCalc
}) => {
  
  useEffect(() => {
    logger.debug("NewProjectStep2Details rendered with offices:", offices);
  }, [offices]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-brand-accent">Project Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
            <MapPin className="w-4 h-4" />Project Country<span className="text-destructive">*</span>
          </label>
          <Select value={form.country} onValueChange={v => onChange('country', v)}>
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {/* Profit field hidden for MVP */}
        {/* <div>
          <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
            <Percent className="w-4 h-4" />Target Profit %<span className="text-destructive">*</span>
          </label>
          <Input 
            value={form.profit}
            type="number"
            onChange={e => onChange('profit', e.target.value)} 
            required 
            placeholder="Enter % Profit"
            className="text-base"
          />
        </div> */}
        <div>
          <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
            <CheckSquare className="w-4 h-4" />Project Status<span className="text-destructive">*</span>
          </label>
          <Select value={form.status} onValueChange={v => onChange('status', v)}>
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
            <Building className="w-4 h-4" />Office<span className="text-destructive">*</span>
          </label>
          <Select value={form.office} onValueChange={v => onChange('office', v)}>
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select Office" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {offices.length > 0 ? (
                offices.map(o => (
                  <SelectItem key={o.id} value={o.id}>
                    {`${o.emoji ? `${o.emoji} ` : ''}${o.city}, ${o.country}`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-options" disabled>No offices available</SelectItem>
              )}
            </SelectContent>
          </Select>
          {offices.length === 0 && (
            <p className="text-xs text-destructive mt-1">
              No offices found. Please create an office first.
            </p>
          )}
        </div>
        {/* Average Rate field hidden for MVP */}
        {/* <div className="sm:col-span-2">
          <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
            <Calculator className="w-4 h-4" />Average Rate<span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            <Input 
              value={form.avgRate}
              type="number"
              onChange={e => onChange('avgRate', e.target.value)}
              required 
              placeholder="Enter AVG Rate"
              className="text-base" 
            />
            <Button type="button" variant="outline" onClick={onShowRateCalc} title="Calculate Avg Rate">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Click Calculate to use the rate calculator
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default NewProjectStep2Details;
