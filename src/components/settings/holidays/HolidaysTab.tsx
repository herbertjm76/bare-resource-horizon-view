import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { HolidayList } from "./HolidayList";
import { HolidayDialog } from "./HolidayDialog";
import { fetchHolidays, createHoliday, updateHoliday, deleteHolidays } from "./HolidayService";
import { Holiday, HolidayFormValues } from "./types";

// Helper function to consolidate holidays with same name and date
const consolidateHolidays = (holidays: Holiday[]): Holiday[] => {
  const holidayMap = new Map<string, Holiday>();
  
  holidays.forEach(holiday => {
    const key = `${holiday.name}-${holiday.date.toISOString().split('T')[0]}`;
    
    if (holidayMap.has(key)) {
      // Merge offices for holidays with same name and date
      const existing = holidayMap.get(key)!;
      const combinedOffices = [...new Set([...existing.offices, ...holiday.offices])];
      holidayMap.set(key, {
        ...existing,
        offices: combinedOffices
      });
    } else {
      holidayMap.set(key, { ...holiday });
    }
  });
  
  return Array.from(holidayMap.values()).sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );
};

export const HolidaysTab = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [consolidatedHolidays, setConsolidatedHolidays] = useState<Holiday[]>([]);
  const [open, setOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { company } = useCompany();

  useEffect(() => {
    const loadHolidays = async () => {
      if (!company) return;
      
      setLoading(true);
      const data = await fetchHolidays(company.id);
      setHolidays(data);
      setLoading(false);
    };

    loadHolidays();
  }, [company]);

  // Consolidate holidays whenever the holidays array changes
  useEffect(() => {
    const consolidated = consolidateHolidays(holidays);
    setConsolidatedHolidays(consolidated);
  }, [holidays]);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setEditingHoliday(null);
    }
  };

  const handleEdit = (holiday: Holiday) => {
    // When editing, we need to find all database entries for this holiday
    // and combine their offices into one Holiday object for the form
    const holidayName = holiday.name;
    const holidayDate = holiday.date.toISOString().split('T')[0];
    
    // Find all holidays with the same name and date (these represent the same holiday across multiple offices)
    const relatedHolidays = holidays.filter(h => 
      h.name === holidayName && 
      h.date.toISOString().split('T')[0] === holidayDate
    );
    
    // Combine all office IDs
    const allOffices = relatedHolidays.flatMap(h => h.offices);
    
    const combinedHoliday: Holiday = {
      ...holiday,
      offices: allOffices
    };
    
    setEditingHoliday(combinedHoliday);
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    // When selecting a consolidated holiday, we need to select all related database entries
    const selectedHoliday = consolidatedHolidays.find(h => h.id === id);
    if (!selectedHoliday) return;
    
    const holidayName = selectedHoliday.name;
    const holidayDate = selectedHoliday.date.toISOString().split('T')[0];
    
    // Find all related holiday IDs in the original holidays array
    const relatedHolidayIds = holidays
      .filter(h => 
        h.name === holidayName && 
        h.date.toISOString().split('T')[0] === holidayDate
      )
      .map(h => h.id);
    
    setSelected(prev => {
      const isCurrentlySelected = relatedHolidayIds.every(relatedId => prev.includes(relatedId));
      
      if (isCurrentlySelected) {
        // Remove all related IDs
        return prev.filter(selectedId => !relatedHolidayIds.includes(selectedId));
      } else {
        // Add all related IDs
        return [...new Set([...prev, ...relatedHolidayIds])];
      }
    });
  };

  const handleBulkDelete = async () => {
    if (!selected.length || !company) return;
    
    if (!confirm(`Are you sure you want to delete ${selected.length} holiday(s)?`)) return;
    
    setLoading(true);
    const success = await deleteHolidays(selected);
    
    if (success) {
      const updatedHolidays = holidays.filter(h => !selected.includes(h.id));
      setHolidays(updatedHolidays);
      setSelected([]);
      setEditMode(false);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (values: HolidayFormValues) => {
    if (!company) return;
    
    setLoading(true);
    
    if (editingHoliday) {
      // Update existing holiday
      const success = await updateHoliday(editingHoliday.id, values);
      
      if (success) {
        // Reload holidays from the database to get the updated data
        const updatedHolidays = await fetchHolidays(company.id);
        setHolidays(updatedHolidays);
      }
    } else {
      // Create new holiday
      const newHoliday = await createHoliday(values, company.id);
      
      if (newHoliday) {
        // Reload holidays from the database to get the updated data
        const updatedHolidays = await fetchHolidays(company.id);
        setHolidays(updatedHolidays);
      }
    }
    
    setLoading(false);
    setOpen(false);
  };

  const handleAddNew = () => {
    setEditingHoliday(null);
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Office Holidays</CardTitle>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={editMode ? "secondary" : "outline"} 
            onClick={() => {
              setEditMode(!editMode);
              setSelected([]);
            }}
            disabled={loading || open}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "Done" : "Edit"}
          </Button>
          <Button 
            size="sm" 
            onClick={handleAddNew}
            disabled={loading || open}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Holiday
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Manage office holidays and closures. You can assign holidays to multiple office locations.
          </div>
          
          {editMode && selected.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4">
              <span className="text-sm text-muted-foreground">
                {selected.length} holiday(s) selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                disabled={loading}
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}
          
          <HolidayList 
            holidays={consolidatedHolidays}
            selected={selected}
            editMode={editMode}
            onEdit={handleEdit}
            onSelect={handleSelect}
            loading={loading}
          />
        </div>
      </CardContent>

      <HolidayDialog 
        open={open} 
        onOpenChange={onOpenChange} 
        onSubmit={handleSubmit}
        editingHoliday={editingHoliday}
        loading={loading}
      />
    </Card>
  );
};
