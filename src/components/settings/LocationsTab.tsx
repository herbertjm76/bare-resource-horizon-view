import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { allCountries } from "@/lib/countries";
import CountrySelect from "@/components/ui/CountrySelect";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ItemActions } from './common/ItemActions';

const customIconList = [
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🩷", "🤍", "🖤", "🤎",
  "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪",
  "⬛", "⬜", "🟦", "🟩", "🟨", "🟧", "🟪", "🟫",
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸",
  "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝", "🍍", "🥭", "🥥",
  "🥦", "🥒", "🥕", "🌽", "🍆", "🥔", "🍠", "🧅", "🧄", "🌶️", "🥬", "🍄", "🥗",
  "🚕", "🚗", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴", "🚂", "✈️", "🚀", "🚁"
];

const flagEmoji = (countryCode: string) =>
  countryCode && countryCode.length === 2
    ? String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt(0)))
    : null;

const formSchema = z.object({
  city: z.string().min(1, "City is required"),
  code: z.string().length(2, "Country code is required"),
  country: z.string().min(1, "Country is required"),
  emoji: z.string().optional()
});
type LocationFormValues = z.infer<typeof formSchema>;

type Location = {
  id: string;
  city: string;
  country: string;
  code: string;
  emoji?: string;
  company_id: string;
};

export const LocationsTab = () => {
  const { locations, setLocations, loading: contextLoading } = useOfficeSettings();
  const { company } = useCompany();
  const [open, setOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTargetId, setPickerTargetId] = useState<string | null>(null);

  const fetchLocations = async () => {
    if (!company) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('office_locations')
        .select('*')
        .eq('company_id', company.id);
        
      if (error) throw error;
      
      console.log("Fetched locations:", data);
      if (data) {
        setLocations(data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      fetchLocations();
    }
  }, [company]);

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      code: "",
      country: "",
      emoji: "",
    }
  });

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    form.reset({
      city: location.city,
      code: location.code,
      country: location.country,
      emoji: location.emoji || "",
    });
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDeleteLocation = async (id: string) => {
    if (!company) {
      toast.error('No company selected');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('office_locations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setLocations(locations.filter(location => location.id !== id));
      toast.success('Location deleted successfully');
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
  };

  const handleBulkDelete = async () => {
    if (!company || selected.length === 0) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('office_locations')
        .delete()
        .in('id', selected);
        
      if (error) throw error;
      
      setLocations(locations.filter(row => !selected.includes(row.id)));
      setSelected([]);
      setEditMode(false);
      toast.success("Locations deleted successfully");
    } catch (error) {
      console.error("Error deleting locations:", error);
      toast.error("Failed to delete locations");
    } finally {
      setLoading(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditingLocation(null);
    }
  };

  const openPicker = (id: string) => {
    setPickerTargetId(id);
    setPickerOpen(true);
  };

  const handlePickerSelect = async (emoji: string) => {
    if (!pickerTargetId || !company) {
      setPickerOpen(false);
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('office_locations')
        .update({ emoji })
        .eq('id', pickerTargetId);
        
      if (error) throw error;
      
      setLocations(
        locations.map(loc =>
          loc.id === pickerTargetId
            ? { ...loc, emoji }
            : loc
        )
      );
      toast.success("Icon updated successfully");
    } catch (error) {
      console.error("Error updating location icon:", error);
      toast.error("Failed to update icon");
    } finally {
      setLoading(false);
      setPickerOpen(false);
      setPickerTargetId(null);
    }
  };

  const onSubmit = async (values: LocationFormValues) => {
    if (!company) {
      console.error("No company selected");
      return;
    }

    setLoading(true);
    try {
      const flag = flagEmoji(values.code) || "";
      
      const locationData = {
        city: values.city,
        code: values.code,
        country: values.country,
        emoji: flag,
        company_id: company.id
      };

      if (editingLocation) {
        const { error } = await supabase
          .from('office_locations')
          .update(locationData)
          .eq('id', editingLocation.id);
          
        if (error) throw error;
        
        setLocations(locations.map(row => 
          row.id === editingLocation.id 
            ? { ...locationData, id: editingLocation.id } 
            : row
        ));
        toast.success("Location updated successfully");
      } else {
        const { data, error } = await supabase
          .from('office_locations')
          .insert(locationData)
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setLocations([...locations, data[0]]);
          toast.success("Location added successfully");
        }
      }
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Failed to save location");
    } finally {
      setLoading(false);
      setOpen(false);
      form.reset();
      setEditingLocation(null);
    }
  };

  const isLoading = loading || contextLoading;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Locations</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Manage your office locations. Each location consists of a city and a country.
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : locations.length > 0 ? (
            <div className="grid gap-4">
              {locations.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between p-3 border rounded-md group hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-2xl focus:outline-none hover:scale-110 transition-transform"
                      title="Click to change icon"
                      onClick={() => openPicker(row.id)}
                    >
                      {row.emoji || flagEmoji(row.code)}
                    </button>
                    <span className="font-medium">
                      {row.city}, {row.country} 
                      <span className="text-xs text-muted-foreground ml-1">({row.code})</span>
                    </span>
                  </div>
                  
                  <ItemActions 
                    onDelete={() => handleDeleteLocation(row.id)}
                    showDelete={true}
                    onEdit={() => handleEdit(row)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md border-dashed">
              No locations added yet. Click "Add Location" to get started.
            </div>
          )}
        </div>
      </CardContent>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit' : 'Add'} Location</DialogTitle>
            <DialogDescription>
              Choose a country (searchable), specify city. The icon defaults to the country flag. You can change this to any icon/emoji after creation.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <CountrySelect
                        value={form.watch("country")}
                        onChange={(countryName: string, code?: string) => {
                          form.setValue("country", countryName);
                          form.setValue("code", code || "");
                        }}
                        placeholder="Search or select country"
                        majorCountries={["United States", "United Kingdom", "Canada", "Germany", "France", "India", "China", "Australia", "Japan", "Brazil"]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("code") && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Icon:</span>
                  <span className="text-2xl">{flagEmoji(form.watch("code"))}</span>
                  <span className="text-xs text-muted-foreground">
                    (Icon defaults to the country flag. Can be changed after creation.)
                  </span>
                </div>
              )}
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {editingLocation ? 'Update' : 'Add'} Location
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose an Icon or Emoji</DialogTitle>
            <DialogDescription>
              Click an icon or emoji below to set as icon for this location.
              <br />Flags are not available for icon changes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-8 gap-3 py-2 max-h-56 overflow-y-auto">
            {customIconList.map(emoji => (
              <button
                key={emoji}
                className="text-2xl p-2 rounded hover:scale-110 transition-all bg-muted"
                type="button"
                onClick={() => handlePickerSelect(emoji)}
                aria-label={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LocationsTab;
