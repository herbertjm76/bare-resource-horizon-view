import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import allCountries from "@/lib/allCountries.json";
import CountrySelect from "@/components/ui/CountrySelect";
import { useToast } from "@/hooks/use-toast";

const pastelColors = [
  "#F2FCE2", "#FEF7CD", "#FEC6A1", "#E5DEFF",
  "#FFDEE2", "#FDE1D3", "#D3E4FD", "#F1F0FB"
];

const countryRegions: Record<string, string[]> = {
  "United States": ["North America"],
  "Canada": ["North America"],
  "Mexico": ["North America", "Latin America"],
  "United Kingdom": ["Europe", "Western Europe"],
  "France": ["Europe", "Western Europe"],
  "Germany": ["Europe", "Western Europe"],
  "Italy": ["Europe", "Southern Europe"],
  "Spain": ["Europe", "Southern Europe"],
  "Russia": ["Europe", "Asia", "Eastern Europe"],
  "China": ["Asia", "East Asia"],
  "Japan": ["Asia", "East Asia"],
  "South Korea": ["Asia", "East Asia"],
  "India": ["Asia", "South Asia"],
  "Australia": ["Oceania"],
  "New Zealand": ["Oceania"],
  "Brazil": ["South America", "Latin America"],
  "Argentina": ["South America", "Latin America"],
  "South Africa": ["Africa"],
  "Nigeria": ["Africa", "West Africa"],
  "Egypt": ["Africa", "North Africa", "Middle East"],
  "Saudi Arabia": ["Middle East"],
  "United Arab Emirates": ["Middle East"]
};

const getContinentByCountryCode = (countryCode: string): string => {
  const continentMap: Record<string, string> = {
    'AF': 'Africa',
    'AS': 'Asia',
    'EU': 'Europe',
    'NA': 'North America',
    'SA': 'South America',
    'OC': 'Oceania',
    'AN': 'Antarctica'
  };
  
  const country = allCountries.find(c => c.code === countryCode);
  if (!country) return "";
  
  for (const [countryName, regions] of Object.entries(countryRegions)) {
    if (country.name === countryName && regions.length > 0) {
      return regions[0];
    }
  }
  
  for (const [prefix, continent] of Object.entries(continentMap)) {
    if (countryCode.startsWith(prefix)) {
      return continent;
    }
  }
  
  return "";
};

function getPastelColor(index: number) {
  return pastelColors[index % pastelColors.length];
}

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  region: z.string().min(1, "Region is required"),
});

type ProjectAreaFormValues = z.infer<typeof formSchema>;

type ProjectArea = {
  id: string;
  code: string;
  city?: string;
  region: string;
  country: string;
};

type DatabaseLocation = {
  id: string;
  code: string;
  city: string | null;
  country: string;
  created_at: string;
  emoji: string | null;
  updated_at: string;
  region: string | null;
};

export const CountriesTab = () => {
  const [areas, setAreas] = useState<ProjectArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectArea | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<ProjectAreaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "", country: "", city: "", region: "" }
  });

  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("office_locations")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        setError("Failed to load project areas.");
        setAreas([]);
      } else {
        const transformedAreas = (data as DatabaseLocation[] || []).map(loc => ({
          id: loc.id,
          code: loc.code,
          city: loc.city ?? "",
          region: loc.region ?? "",
          country: loc.country,
        }));
        setAreas(transformedAreas);
      }
      setLoading(false);
    };
    fetchAreas();
  }, []);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditing(null);
    }
  };

  const handleEdit = (area: ProjectArea) => {
    setEditing(area);
    form.reset({
      code: area.code,
      city: area.city ?? "",
      region: area.region ?? "",
      country: area.country,
    });
    setOpen(true);
  };

  const handleBulkDelete = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from("office_locations")
      .delete()
      .in("id", selected);
    if (error) {
      setError("Failed to delete area(s).");
      toast({
        title: "Error",
        description: "Failed to delete the selected area(s).",
        variant: "destructive"
      });
    } else {
      setAreas(areas.filter(a => !selected.includes(a.id)));
      toast({
        title: "Success",
        description: `${selected.length} area(s) deleted successfully.`,
      });
      setSelected([]);
      setEditMode(false);
      setLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelected(selected => selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  const handleCountryChange = (countryName: string, countryCode?: string) => {
    form.setValue("country", countryName);
    
    if (!form.getValues("region") || !editing) {
      let suggestedRegion = "";
      
      if (countryRegions[countryName] && countryRegions[countryName].length > 0) {
        suggestedRegion = countryRegions[countryName][0];
      } else if (countryCode) {
        const country = allCountries.find(c => c.name === countryName);
        if (country) {
          suggestedRegion = getContinentByCountryCode(country.code);
        }
      }
      
      if (suggestedRegion) {
        form.setValue("region", suggestedRegion);
      }
    }
  };

  const onSubmit = async (values: ProjectAreaFormValues) => {
    setLoading(true);
    setError(null);

    if (editing) {
      const { error } = await supabase
        .from("office_locations")
        .update({
          code: values.code,
          city: values.city || "",
          country: values.country,
          region: values.region
        })
        .eq("id", editing.id);
      if (error) {
        setError("Failed to update area.");
        toast({
          title: "Error",
          description: "Failed to update the area. Please try again.",
          variant: "destructive"
        });
      } else {
        setAreas(
          areas.map(area => area.id === editing.id
            ? { ...area, ...values }
            : area
          )
        );
        toast({
          title: "Success",
          description: "Area updated successfully.",
        });
      }
    } else {
      const { data, error } = await supabase
        .from("office_locations")
        .insert({
          code: values.code,
          city: values.city || "",
          country: values.country,
          region: values.region
        })
        .select()
        .single();

      if (error) {
        setError("Failed to add area.");
        toast({
          title: "Error",
          description: "Failed to add the area. Please try again.",
          variant: "destructive"
        });
        console.error("Error adding area:", error);
      } else if (data) {
        const newArea: ProjectArea = {
          id: data.id,
          code: data.code,
          city: data.city,
          region: data.region || "",
          country: data.country,
        };
        setAreas([...areas, newArea]);
        toast({
          title: "Success",
          description: "Area added successfully.",
        });
      }
    }
    setOpen(false);
    form.reset();
    setEditing(null);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Project Areas</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode(em => !em)}>
            <Edit className="h-4 w-4 mr-2" /> {editMode ? "Done" : "Edit"}
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Area
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                Track which locations you operate projects in, by code, country, city (optional), and region.
              </div>
              {editMode && (
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={selected.length === 0}
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
                  </Button>
                  <span className="text-xs text-muted-foreground">{selected.length} selected</span>
                </div>
              )}
              {areas.length > 0 ? (
                <div className="grid gap-4">
                  {areas.map((area, idx) => {
                    const bg = getPastelColor(idx);
                    return (
                      <div
                        key={area.id}
                        className={`flex items-center justify-between p-3 border rounded-md ${editMode ? "ring-2" : ""}`}
                        style={editMode && selected.includes(area.id) ? { borderColor: "#dc2626", background: "#fee2e2" } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="font-bold px-3 py-1 rounded text-base"
                            style={{ background: bg }}
                          >
                            {area.code}
                          </span>
                          <span className="font-medium">{area.country}</span>
                          {area.city && <span className="ml-2 text-muted-foreground text-xs">{area.city}</span>}
                          <span className="bg-muted-foreground/10 px-2 py-0.5 rounded text-xs text-muted-foreground ml-2">
                            {area.region}
                          </span>
                        </div>
                        {editMode ? (
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-purple-600"
                            checked={selected.includes(area.id)}
                            onChange={() => handleSelect(area.id)}
                          />
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(area)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md border-dashed">
                  No project areas yet. Click "Add Area" to get started.
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} Project Area</DialogTitle>
            <DialogDescription>
              Enter a code, country, city (optional), and assign region.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Unique code"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <CountrySelect
                        value={field.value}
                        onChange={(value, code) => handleCountryChange(value, code)}
                        disabled={loading}
                        placeholder="Select country"
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
                      <Input
                        placeholder="City (optional)"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Region"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">Region is auto-suggested based on country but can be edited.</span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={loading}>{editing ? 'Update' : 'Add'} Area</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
