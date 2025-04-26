import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CurrencySelect } from "./CurrencySelect";
import { BillingMonthPicker } from "../../components/BillingMonthPicker";
import { CurrencyPicker } from "../../components/CurrencyPicker";

interface StageFee {
  fee: string;
  billingMonth: string;
  status: "Not Billed" | "Invoiced" | "Paid" | "";
  invoiceDate: Date | null;
  hours: string;
  invoiceAge: string | number;
  currency: string;
}

interface StageCardProps {
  stageId: string;
  stageName: string;
  stageColor: string;
  stageFeeData: StageFee;
  billingOptions: Array<{ value: string; label: string }>;
  updateStageFee: (stageId: string, data: Partial<StageFee>) => void;
  calculateHours: (fee: string) => string;
  calculateInvoiceAge: (invoiceDate: Date | null) => string;
}

export const StageCard: React.FC<StageCardProps> = ({
  stageId,
  stageName,
  stageColor,
  stageFeeData,
  billingOptions,
  updateStageFee,
  calculateHours,
  calculateInvoiceAge,
}) => {
  const handleToday = () => {
    const today = new Date();
    updateStageFee(stageId, { 
      invoiceDate: today,
      invoiceAge: calculateInvoiceAge(today)
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div 
        className="p-3 text-white"
        style={{ backgroundColor: stageColor }}
      >
        <h4 className="font-semibold">{stageName}</h4>
      </div>
      
      <div className="p-4 space-y-3">
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Currency</Label>
            <CurrencyPicker
              value={stageFeeData.currency}
              onValueChange={(value) => updateStageFee(stageId, { currency: value })}
            />
          </div>
          <div>
            <Label htmlFor={`hours-${stageId}`} className="text-xs">Hours</Label>
            <Input
              id={`hours-${stageId}`}
              value={calculateHours(stageFeeData.fee)}
              readOnly
              disabled
              className="h-8 bg-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Billing Month</Label>
            <BillingMonthPicker
              value={stageFeeData.billingMonth ? new Date(stageFeeData.billingMonth) : undefined}
              onChange={(date) => {
                updateStageFee(stageId, { 
                  billingMonth: date ? date.toISOString() : '' 
                });
              }}
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
                  {stageFeeData.invoiceDate ? (
                    format(stageFeeData.invoiceDate, "MM/dd/yyyy")
                  ) : (
                    "Select date"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={stageFeeData.invoiceDate || undefined}
                  onSelect={(date) => {
                    updateStageFee(stageId, { 
                      invoiceDate: date,
                      invoiceAge: date ? calculateInvoiceAge(date) : 'N/A'
                    });
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  formatters={{
                    formatCaption: (date, options) => {
                      const year = format(date, "yyyy");
                      const month = format(date, "MMMM");
                      return (
                        <div className="flex items-center justify-between w-full px-8">
                          <span>{month}</span>
                          <span>{year}</span>
                        </div>
                      );
                    }
                  }}
                  footer={
                    <div className="mt-3 p-3">
                      <Button
                        variant="outline"
                        className="w-full text-sm"
                        onClick={handleToday}
                        type="button"
                      >
                        Today
                      </Button>
                    </div>
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor={`invoiceAge-${stageId}`} className="text-xs">Invoice Age (Days)</Label>
            <Input
              id={`invoiceAge-${stageId}`}
              value={calculateInvoiceAge(stageFeeData.invoiceDate)}
              readOnly
              disabled
              className="h-8 bg-muted"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
