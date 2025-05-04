
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Printer } from "lucide-react";
import { toast } from "sonner";
import { exportToPDF } from "../utils/exportToPDF";
import { exportToExcel } from "../utils/exportToExcel";

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

  const handleExportExcel = async () => {
    try {
      toast.info("Generating Excel file...");
      await exportToExcel(selectedWeek, weekLabel);
      toast.success("Excel file exported successfully!");
    } catch (error) {
      console.error("Excel export failed:", error);
      toast.error("Failed to export Excel file. Please try again.");
    }
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        className="flex items-center gap-1"
      >
        <Save className="h-4 w-4" />
        <span className="hidden sm:inline">PDF</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportExcel}
        className="flex items-center gap-1"
      >
        <Save className="h-4 w-4" />
        <span className="hidden sm:inline">Excel</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="flex items-center gap-1"
      >
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">Print</span>
      </Button>
    </div>
  );
};
