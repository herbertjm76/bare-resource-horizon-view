
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Printer, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { exportToPDF } from "../utils/exportToPDF";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface WeeklyActionButtonsProps {
  selectedWeek: Date;
  weekLabel: string;
}

export const WeeklyActionButtons: React.FC<WeeklyActionButtonsProps> = ({
  selectedWeek,
  weekLabel,
}) => {
  const handlePrint = () => {
    // Show a toast notification
    toast.info("Preparing print view...");
    
    // Give the browser a moment to display the toast
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleExportPDF = async () => {
    try {
      toast.info("Generating PDF...");
      await exportToPDF(selectedWeek, weekLabel);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export PDF. Please try again.");
    }
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            <span>PDF</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            <span>Print</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
