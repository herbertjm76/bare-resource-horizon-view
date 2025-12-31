
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
import type { StageFee } from "../../../../projects/hooks/types/projectTypes";
import { MonthCalendar } from "../../../components/datepicker/MonthCalendar";
import { logger } from '@/utils/logger';

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
  logger.debug(`StageForm for ${stageId}:`, stageFeeData);
  
  const handleToday = () => {
    const today = new Date();
    const ageString = calculateInvoiceAge(today);
    const ageNumber = parseInt(ageString, 10) || 0;
    updateStageFee(stageId, { 
      invoiceDate: today,
      invoiceAge: ageNumber
    });
  };

  // Safe access to fee value with fallbacks - ensure it's always a string
  const feeValue = String(stageFeeData?.fee || "");
  const statusValue = stageFeeData?.status || "Not Billed";
  const currencyValue = stageFeeData?.currency || "USD";
  
  // Debug the date values
  logger.debug(`Stage ${stageId} billing month:`, stageFeeData?.billingMonth);
  logger.debug(`Stage ${stageId} invoice date:`, stageFeeData?.invoiceDate);
  
  // Ensure billingMonth is a proper Date object if it exists
  let billingMonth: Date | null = null;
  if (stageFeeData?.billingMonth) {
    if (stageFeeData.billingMonth instanceof Date) {
      billingMonth = stageFeeData.billingMonth;
    } else if (typeof stageFeeData.billingMonth === 'string') {
      billingMonth = new Date(stageFeeData.billingMonth);
    }
  }
                        
  // Ensure invoiceDate is a proper Date object if it exists
  const invoiceDate = stageFeeData?.invoiceDate instanceof Date ? stageFeeData.invoiceDate : 
                     (typeof stageFeeData?.invoiceDate === 'string' && stageFeeData.invoiceDate ?
                      new Date(stageFeeData.invoiceDate) : null);

  // Calculate hours based on fee and average rate
  const hours = calculateHours(feeValue);

  // Calculate invoice age based on invoice date - ensure it's a string for display
  const invoiceAgeString = calculateInvoiceAge(invoiceDate);

  return (
    <div className="p-4 space-y-3">
      <div>
        <Label htmlFor={`fee-${stageId}`} className="text-xs">Fee</Label>
        <Input
          id={`fee-${stageId}`}
          type="number"
          placeholder="0.00"
          value={feeValue}
          onChange={(e) => {
            logger.debug(`Updating fee for stage ${stageId} to ${e.target.value}`);
            updateStageFee(stageId, { fee: e.target.value });
          }}
          className="h-8"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Currency</Label>
          <CurrencyPicker
            value={currencyValue}
            onValueChange={(value) => {
              logger.debug(`Updating currency for stage ${stageId} to ${value}`);
              updateStageFee(stageId, { currency: value });
            }}
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
          <Label className="text-xs">Billing Month</Label>
          <MonthCalendar
            value={billingMonth}
            onChange={(date) => {
              logger.debug(`Updating billing month for stage ${stageId} to ${date}`);
              updateStageFee(stageId, { billingMonth: date || null });
            }}
            showIcon={false}
          />
        </div>
        <div>
          <Label className="text-xs">Status</Label>
          <Select
            value={statusValue}
            onValueChange={(value) => {
              logger.debug(`Updating status for stage ${stageId} to ${value}`);
              updateStageFee(stageId, { 
                status: value as "Not Billed" | "Invoiced" | "Paid" | "" 
              });
            }}
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
            value={invoiceDate}
            onChange={(date) => {
              logger.debug(`Updating invoice date for stage ${stageId} to ${date}`);
              const ageString = date ? calculateInvoiceAge(date) : '0';
              const ageNumber = parseInt(ageString, 10) || 0;
              updateStageFee(stageId, { 
                invoiceDate: date,
                invoiceAge: ageNumber
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
            value={invoiceAgeString}
            readOnly
            disabled
            className="h-8 bg-muted"
          />
        </div>
      </div>
    </div>
  );
};
