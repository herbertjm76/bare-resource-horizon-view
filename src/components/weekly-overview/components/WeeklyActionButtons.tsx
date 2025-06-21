
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { FileDown, ChevronDown, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { utils, writeFile } from 'xlsx';
import { exportToPDF } from '../utils/exportToPDF';

interface WeeklyActionButtonsProps {
  selectedWeek: Date;
  weekLabel: string;
}

export const WeeklyActionButtons: React.FC<WeeklyActionButtonsProps> = ({
  selectedWeek,
  weekLabel
}) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExportToExcel = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        // Get the table element
        const table = document.querySelector('.weekly-table');
        
        if (!table) {
          toast.error('Could not find table data');
          setIsExporting(false);
          return;
        }
        
        // Create worksheet from table
        const ws = utils.table_to_sheet(table);
        
        // Create workbook and add worksheet
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Weekly Overview');
        
        // Generate file name
        const fileName = `Weekly_Overview_${weekLabel.replace(/\s+/g, '_')}.xlsx`;
        
        // Write file and trigger download
        writeFile(wb, fileName);
        
        // Show success message
        toast.success('Export successful', { 
          description: `Exported to ${fileName}` 
        });
      } catch (error) {
        console.error('Export failed:', error);
        toast.error('Export failed', { 
          description: 'An error occurred while exporting the data.'
        });
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  const handleExportToPDF = async () => {
    setIsExporting(true);
    
    try {
      await exportToPDF(selectedWeek, weekLabel);
      toast.success('PDF Export successful', { 
        description: `Weekly overview exported to PDF`
      });
    } catch (error) {
      console.error('PDF Export failed:', error);
      toast.error('PDF Export failed', { 
        description: 'An error occurred while exporting to PDF.'
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="px-4 flex items-center gap-1" disabled={isExporting}>
          <FileDown className="h-4 w-4 mr-1" />
          <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        <DropdownMenuItem 
          onClick={handleExportToPDF}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export to PDF
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleExportToExcel}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handlePrint}
          className="cursor-pointer"
        >
          Print View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
