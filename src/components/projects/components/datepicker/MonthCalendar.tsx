
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { toast } from "sonner";

interface MonthCalendarProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  showIcon?: boolean;
}

export const MonthCalendar = ({ 
  value, 
  onChange, 
  showIcon = true 
}: MonthCalendarProps) => {
  const [open, setOpen] = useState(false);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { company } = useCompany();
  
  // Function to format a date as a month-year string
  const formatMonthYear = (date: Date) => format(date, "MMMM yyyy");
  
  // Current date for default view
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Generate months for current year and one year before/after
  const generateMonthsRange = () => {
    const months = [];
    const startDate = new Date(currentYear - 1, 0, 1); // January of previous year
    
    for (let i = 0; i < 36; i++) { // 3 years of months
      const monthDate = addMonths(startDate, i);
      months.push({
        date: new Date(monthDate),
        label: formatMonthYear(monthDate)
      });
    }
    
    return months;
  };
  
  const months = generateMonthsRange();
  
  // Fetch billing months from Supabase
  useEffect(() => {
    const fetchBillingMonths = async () => {
      if (!company?.id) return;
      
      setIsLoading(true);
      try {
        // Get unique billing months from project_fees table
        const { data, error } = await supabase
          .from('project_fees')
          .select('billing_month')
          .eq('company_id', company.id)
          .not('billing_month', 'is', null);
        
        if (error) {
          console.error('Error fetching billing months:', error);
          toast.error('Failed to load billing month data');
          return;
        }
        
        // Extract and format the months
        const formattedMonths = data
          .map(item => item.billing_month)
          .filter(Boolean)
          .map(dateStr => {
            try {
              const date = new Date(dateStr);
              return formatMonthYear(date);
            } catch (e) {
              console.error('Invalid date:', dateStr);
              return null;
            }
          })
          .filter(Boolean);
        
        // Remove duplicates
        setAvailableMonths([...new Set(formattedMonths)]);
        console.log('Available billing months:', formattedMonths);
      } catch (err) {
        console.error('Error in fetchBillingMonths:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBillingMonths();
  }, [company?.id]);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-8",
            !value && "text-muted-foreground"
          )}
        >
          {showIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
          {value ? formatMonthYear(value) : "Select month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 z-[60]" 
        align="start"
      >
        <div className="p-3">
          <div className="space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="ml-2 text-sm">Loading months...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {months.map((month) => {
                    const isSelected = value && 
                      value.getMonth() === month.date.getMonth() && 
                      value.getFullYear() === month.date.getFullYear();
                    
                    const isAvailable = availableMonths.includes(month.label);
                    
                    return (
                      <Button
                        key={month.label}
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "h-8 text-xs",
                          isSelected ? "" : "hover:bg-muted",
                          isAvailable ? "border-blue-300" : ""
                        )}
                        onClick={() => {
                          onChange(month.date);
                          setOpen(false);
                        }}
                      >
                        {month.label}
                      </Button>
                    );
                  })}
                </div>
                {availableMonths.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-2">
                    <span>* Highlighted months have existing billing data</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
