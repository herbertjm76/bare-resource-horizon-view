
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { HolidayList } from "./HolidayList";
import { HolidayDialog } from "./HolidayDialog";
import { fetchHolidays, createHoliday, updateHoliday, deleteHolidays } from "./HolidayService";
import { Holiday, HolidayFormValues } from "./types";

export const HolidaysTab = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
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

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setEditingHoliday(null);
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!selected.length || !company) return;
    
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
        // Update local state
        setHolidays(prev => prev.map(holiday => 
          holiday.id === editingHoliday.id
            ? { 
                ...holiday, 
                name: values.name,
                date: values.date,
                offices: values.offices
              }
            : holiday
        ));
      }
    } else {
      // Create new holiday
      const newHoliday = await createHoliday(values, company.id);
      
      if (newHoliday) {
        // Update local state
        setHolidays(prev => [...prev, newHoliday]);
      }
    }
    
    setLoading(false);
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Office Holidays</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode(em => !em)} disabled={loading}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button size="sm" onClick={() => setOpen(true)} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Holiday
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Manage office holidays and closures.
          </div>
          {editMode && (
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={selected.length === 0 || loading}
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
              </Button>
              <span className="text-xs text-muted-foreground">{selected.length} selected</span>
            </div>
          )}
          
          <HolidayList 
            holidays={holidays}
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
