
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";

// ROYGBIV spectrum for regions, fallback to gray for 'Other'
const regionColors: Record<string, string> = {
  Americas: "#FFA500",
  Europe: "#4287f5",
  Asia: "#27c94a",
  Oceania: "#B266FF",
  Africa: "#FFD700",
  Other: "#b0b0b0"
};
const pastelShift = ["#FFF6E0", "#E6F7FE", "#F5F0FF", "#E0FFE0", "#FFF1FA", "#F7FFF4"];
const regionMap: { [code: string]: string } = {
  US: "Americas",
  BR: "Americas",
  CA: "Americas",
  GB: "Europe",
  DE: "Europe",
  FR: "Europe",
  JP: "Asia",
  CN: "Asia",
  IN: "Asia",
  SG: "Asia",
  AU: "Oceania"
};
// Added emoji property to countries
const countries = [
  { code: "US", name: "United States", emoji: "🇺🇸" },
  { code: "GB", name: "United Kingdom", emoji: "🇬🇧" },
  { code: "JP", name: "Japan", emoji: "🇯🇵" },
  { code: "SG", name: "Singapore", emoji: "🇸🇬" },
  { code: "DE", name: "Germany", emoji: "🇩🇪" },
  { code: "FR", name: "France", emoji: "🇫🇷" },
  { code: "IN", name: "India", emoji: "🇮🇳" },
  { code: "CN", name: "China", emoji: "🇨🇳" },
  { code: "BR", name: "Brazil", emoji: "🇧🇷" },
  { code: "CA", name: "Canada", emoji: "🇨🇦" },
  { code: "AU", name: "Australia", emoji: "🇦🇺" },
];

function getRegion(code: string) {
  return regionMap[code] || "Other";
}
// A pastel variant per project area in a region
function pastelColorForArea(region: string, index: number) {
  const base = regionColors[region] || regionColors.Other;
  const pastel = pastelShift[index % pastelShift.length];
  return `linear-gradient(90deg, ${base}40 70%, ${pastel} 100%)`;
}

const formSchema = z.object({
  code: z.string().length(2, "Country code required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region is required"),
});

type ProjectAreaFormValues = z.infer<typeof formSchema>;
type ProjectArea = {
  id: string;
  code: string;
  city: string;
  region: string;
  country: string;
  emoji?: string | null;
};

export const CountriesTab = () => {
  const [areas, setAreas] = useState<ProjectArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectArea | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const form = useForm<ProjectAreaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "", city: "", region: "" }
  });

  // Fetch from Supabase
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
        setAreas(
          (data || []).map(loc => ({
            id: loc.id,
            code: loc.code,
            city: loc.city,
            region: getRegion(loc.code),
            country: loc.country,
            emoji: loc.emoji
          }))
        );
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
    form.reset({ code: area.code, city: area.city, region: area.region });
    setOpen(true);
  };

  const handleBulkDelete = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from("office_locations")
      .delete()
      .in("id", selected);
    if (error) setError("Failed to delete area(s).");
    setAreas(areas.filter(a => !selected.includes(a.id)));
    setSelected([]);
    setEditMode(false);
    setLoading(false);
  };

  const handleSelect = (id: string) => {
    setSelected(selected => selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  const onSubmit = async (values: ProjectAreaFormValues) => {
    setLoading(true);
    setError(null);
    const emoji = countries.find(c => c.code === values.code)?.emoji ?? null; // Now works correctly
    const regionVal = values.region || getRegion(values.code);

    if (editing) {
      // Update
      const { error } = await supabase
        .from("office_locations")
        .update({
          code: values.code,
          city: values.city,
          country: countries.find(c => c.code === values.code)?.name || "",
          emoji
        })
        .eq("id", editing.id);
      if (error) setError("Failed to update area.");
      else {
        setAreas(
          areas.map(area => area.id === editing.id
            ? { ...area, ...values, country: countries.find(c => c.code === values.code)?.name || "", emoji }
            : area
          )
        );
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from("office_locations")
        .insert({
          code: values.code,
          city: values.city,
          country: countries.find(c => c.code === values.code)?.name || "",
          emoji
        })
        .select()
        .single();

      if (error) setError("Failed to add area.");
      else if (data) {
        setAreas([...areas, {
          id: data.id,
          code: data.code,
          city: data.city,
          region: regionVal,
          country: data.country,
          emoji: data.emoji
        }]);
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
                Track which cities and regions you operate projects in. Each region is colored by spectrum; backgrounds are auto-generated.
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
                    const region = getRegion(area.code);
                    const bg = pastelColorForArea(region, idx);
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
                          <span className="font-medium">{area.city}</span>
                          <span className="bg-muted-foreground/10 px-2 py-0.5 rounded text-xs text-muted-foreground ml-2">
                            {area.region}
                          </span>
                          {area.emoji && (
                            <span className="ml-2" aria-label={`${area.country} flag`} role="img">
                              {area.emoji}
                            </span>
                          )}
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
      {/* Dialog for add/edit */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} Project Area</DialogTitle>
            <DialogDescription>
              Select a country code, enter city, and assign region. Color is auto-assigned per region.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Code</FormLabel>
                    <FormControl>
                      <select
                        className="w-full bg-background border rounded px-3 py-2"
                        value={field.value}
                        onChange={e => {
                          const code = e.target.value;
                          field.onChange(code);
                          if (regionMap[code]) {
                            form.setValue("region", regionMap[code]);
                          }
                        }}
                        disabled={loading}
                      >
                        <option value="">Select a country...</option>
                        {countries.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.code} {country.name}
                          </option>
                        ))}
                      </select>
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
                    <FormLabel>Location (City)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York" {...field} disabled={loading} />
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
                        placeholder="e.g., Americas"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">Auto-suggested for known codes, or enter a custom region.</span>
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
