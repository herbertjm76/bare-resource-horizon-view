
import React, { useState } from 'react';
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

// ROYGBIV spectrum for regions, fallback to gray for 'Other'
const regionColors: Record<string, string> = {
  Americas: "#FFA500", // Orange
  Europe: "#4287f5",   // Blue
  Asia: "#27c94a",     // Green
  Oceania: "#B266FF",  // Violet
  Africa: "#FFD700",   // Yellow
  Other: "#b0b0b0"     // Gray
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
const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];

function getRegion(code: string) {
  return regionMap[code] || "Other";
}
// A pastel variant per project area in a region (different, but close, shades for the same region)
function pastelColorForArea(region: string, index: number) {
  const base = regionColors[region] || regionColors.Other;
  const pastel = pastelShift[index % pastelShift.length];
  // Simple overlay blend for pastel
  return `linear-gradient(90deg, ${base}40 70%, ${pastel} 100%)`; // 40 = ~25% alpha
}

// Simulated DB, no emoji
const initialAreas = [
  { id: "1", code: "US", city: "New York", region: "Americas" },
  { id: "2", code: "GB", city: "London", region: "Europe" },
  { id: "3", code: "JP", city: "Tokyo", region: "Asia" }
];

const formSchema = z.object({
  code: z.string().length(2, "Country code required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region is required"),
});

type ProjectAreaFormValues = z.infer<typeof formSchema>;
type ProjectArea = { id: string; code: string; city: string; region: string };

export const CountriesTab = () => {
  // Now "Project Areas"
  const [areas, setAreas] = useState<ProjectArea[]>(initialAreas);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectArea | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const form = useForm<ProjectAreaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "", city: "", region: "" }
  });

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

  const handleBulkDelete = () => {
    setAreas(areas.filter(l => !selected.includes(l.id)));
    setSelected([]);
    setEditMode(false);
  };

  const handleSelect = (id: string) => {
    setSelected(selected => selected.includes(id) ? selected.filter(x=>x!==id) : [...selected, id]);
  };

  const onSubmit = (values: ProjectAreaFormValues) => {
    const regionVal = values.region || getRegion(values.code);
    const newArea: ProjectArea = {
      ...values,
      region: regionVal,
      id: editing ? editing.id : Date.now().toString()
    };
    if (editing) {
      setAreas(areas.map(area => area.id === editing.id ? newArea : area));
    } else {
      setAreas([...areas, newArea]);
    }
    setOpen(false);
    form.reset();
    setEditing(null);
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
                    className={`flex items-center justify-between p-3 border rounded-md ${editMode && "ring-2"}`}
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
                          // Suggest region if known
                          if (regionMap[code]) {
                            form.setValue("region", regionMap[code]);
                          }
                        }}
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
                      <Input placeholder="e.g., New York" {...field} />
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
                      />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">Auto-suggested for known codes, or enter a custom region.</span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editing ? 'Update' : 'Add'} Area</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// File is above 290 lines. This file is getting too long! Consider breaking it into smaller components.

