import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectForm } from "../NewProjectDialog";
import { getDefaultStageColor } from "@/components/settings/utils/stageColorUtils";

interface ProjectStageFeesTabProps {
  form: ProjectForm;
  officeStages: Array<{ id: string; name: string; color?: string }>;
  updateStageFee: (stageId: string, data: Partial<ProjectForm['stageFees'][string]>) => void;
}

export const ProjectStageFeesTab: React.FC<ProjectStageFeesTabProps> = ({
  form,
  officeStages,
  updateStageFee
}) => {
  const getStageNameById = (id: string) => {
    return officeStages.find(stage => stage.id === id)?.name || 'Unknown Stage';
  };

  const selectedStages = officeStages.filter(stage => form.stages.includes(stage.id));
  
  const calculateInvoiceAge = (invoiceDate: Date | null): number => {
    if (!invoiceDate) return 0;
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - invoiceDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const calculateHours = (fee: string): string => {
    if (!fee || !form.avgRate || parseFloat(form.avgRate) === 0) return '';
    const feeValue = parseFloat(fee);
    const rateValue = parseFloat(form.avgRate);
    if (isNaN(feeValue) || isNaN(rateValue) || rateValue === 0) return '';
    return (feeValue / rateValue).toFixed(2);
  };

  const getStageColor = (stageId: string): string => {
    const stage = officeStages.find(s => s.id === stageId);
    console.log("Stage found:", stage);
    return stage?.color || "#E5DEFF"; // Fallback to default color if no color is set
  };

  if (form.stages.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">Please select project stages in the Info tab first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Fee Structure</h3>
        <p className="text-sm text-muted-foreground">
          Define fees and billing information for each project stage
        </p>
      </div>
      
      <ScrollArea className="h-[500px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedStages.map(stage => {
            const stageId = stage.id;
            const stageFeeData = form.stageFees[stageId] || {
              fee: '',
              billingMonth: '',
              status: 'Not Billed',
              invoiceDate: null,
              hours: '',
              invoiceAge: 0
            };
            
            const hours = calculateHours(stageFeeData.fee);
            const invoiceAge = calculateInvoiceAge(stageFeeData.invoiceDate);
            const stageColor = getStageColor(stageId);
            
            if (hours !== stageFeeData.hours) {
              updateStageFee(stageId, { hours });
            }
            
            if (invoiceAge !== stageFeeData.invoiceAge) {
              updateStageFee(stageId, { invoiceAge });
            }
            
            console.log("Stage:", stage.name, "Color:", stageColor);
            
            return (
              <div key={stageId} className="border rounded-lg overflow-hidden bg-white">
                <div 
                  className="p-3"
                  style={{ backgroundColor: stageColor }}
                >
                  <h4 className="font-semibold text-white">
                    {getStageNameById(stageId)}
                  </h4>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`fee-${stageId}`} className="text-xs">Fee</Label>
                      <Input
                        id={`fee-${stageId}`}
                        type="number"
                        placeholder="0.00"
                        value={stageFeeData.fee}
                        onChange={(e) => updateStageFee(stageId, { fee: e.target.value })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`hours-${stageId}`} className="text-xs">Hours</Label>
                      <Input
                        id={`hours-${stageId}`}
                        value={hours}
                        readOnly
                        disabled
                        className="h-8 bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`billingMonth-${stageId}`} className="text-xs">Billing Month</Label>
                      <Input
                        id={`billingMonth-${stageId}`}
                        placeholder="e.g., April 2025"
                        value={stageFeeData.billingMonth}
                        onChange={(e) => updateStageFee(stageId, { 
                          billingMonth: e.target.value 
                        })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Status</Label>
                      <Select
                        value={stageFeeData.status}
                        onValueChange={(value) => updateStageFee(stageId, { 
                          status: value as "Not Billed" | "Invoiced" | "Paid" | "" 
                        })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Billed">Not Billed</SelectItem>
                          <SelectItem value="Invoiced">Invoiced</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Invoice Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-8",
                              !stageFeeData.invoiceDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {stageFeeData.invoiceDate ? (
                              format(stageFeeData.invoiceDate, "PPP")
                            ) : (
                              "Select date"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={stageFeeData.invoiceDate || undefined}
                            onSelect={(date) => updateStageFee(stageId, { 
                              invoiceDate: date || null,
                              invoiceAge: date ? calculateInvoiceAge(date) : 0
                            })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor={`invoiceAge-${stageId}`} className="text-xs">Invoice Age (Days)</Label>
                      <Input
                        id={`invoiceAge-${stageId}`}
                        value={invoiceAge}
                        readOnly
                        disabled
                        className="h-8 bg-muted"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
