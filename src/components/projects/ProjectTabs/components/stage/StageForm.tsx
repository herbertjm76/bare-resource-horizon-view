
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyPicker } from "../../../components/CurrencyPicker";
import { InvoiceDatePicker } from "../../../components/InvoiceDatePicker";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StageFee } from "../../../hooks/types/projectTypes";
import { MonthCalendar } from "../../../components/datepicker/MonthCalendar";

interface StageFormProps {
  stageId: string;
  stageFeeData: StageFee;
  billingOptions: Array<{ value: string; label: string }>;
  updateStageFee: (stageId: string, data: Partial<StageFee>) => void;
  calculateHours: (fee: string) => string;
  calculateInvoiceAge: (invoiceDate: Date | null) => string;
}

export const StageForm: React.FC<StageFormProps> = ({
  stageId,
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
          <MonthCalendar
            value={stageFeeData.billingMonth instanceof Date ? stageFeeData.billingMonth : undefined}
            onChange={(date) => {
              updateStageFee(stageId, { 
                billingMonth: date || null
              });
            }}
            showIcon={false}
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
            <SelectContent className="z-[60]">
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
          <InvoiceDatePicker
            value={stageFeeData.invoiceDate || undefined}
            onChange={(date) => {
              updateStageFee(stageId, { 
                invoiceDate: date,
                invoiceAge: date ? calculateInvoiceAge(date) : 'N/A'
              });
            }}
            onToday={handleToday}
            showIcon={false}
          />
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
  );
};
