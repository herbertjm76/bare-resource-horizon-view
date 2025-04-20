
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

// List of pastel colors, cycle for unique color per code/region
const pastelColors = [
  "#F2FCE2", "#FEF7CD", "#FEC6A1", "#E5DEFF", "#FFDEE2",
  "#FDE1D3", "#D3E4FD", "#F1F0FB"
];

// Example for regions
const regionMap: { [code: string]: string } = {
  US: "Americas",
  GB: "Europe",
  JP: "Asia",
  IN: "Asia",
  DE: "Europe",
  BR: "Americas",
  FR: "Europe",
  AU: "Oceania"
};

// Country List
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
  // ...expand
];

// Returns a unique pastel color for region, within region shifts by code
function pastelColorForRegion(code: string) {
  const region = regionMap[code as keyof typeof regionMap] || "Other";
  // Colors: map region to base index, then offset by hash of code for collisions
  const base = Object.keys(regionMap).indexOf(code) % pastelColors.length;
  return pastelColors[(base + code.charCodeAt(0)) % pastelColors.length];
}

// ISO country flag
const flagEmoji = (iso: string) => 
  iso && iso.length === 2
    ? String.fromCodePoint(...[...iso.toUpperCase()].map(c => 127397 + c.charCodeAt(0)))
    : "🏳️";

// Simulated "Project Locations" DB
const initialLocations = [
  { id: "1", code: "US", city: "New York", region: "Americas" },
  { id: "2", code: "GB", city: "London", region: "Europe" },
  { id: "3", code: "JP", city: "Tokyo", region: "Asia" }
];

const formSchema = z.object({
  code: z.string().length(2, "Country code required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region is required"),
});

type ProjectLocationFormValues = z.infer<typeof formSchema>;
type ProjectLocation = { id: string; code: string; city: string; region: string };

export const CountriesTab = () => {
  const [locations, setLocations] = useState<ProjectLocation[]>(initialLocations);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectLocation | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const form = useForm<ProjectLocationFormValues>({
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

  const handleEdit = (loc: ProjectLocation) => {
    setEditing(loc);
    form.reset({ code: loc.code, city: loc.city, region: loc.region });
    setOpen(true);
  };

  const handleBulkDelete = () => {
    setLocations(locations.filter(l => !selected.includes(l.id)));
    setSelected([]);
    setEditMode(false);
  };

  const handleSelect = (id: string) => {
    setSelected(selected => selected.includes(id) ? selected.filter(x=>x!==id) : [...selected, id]);
  };

  const onSubmit = (values: ProjectLocationFormValues) => {
    const regionVal = values.region || (regionMap[values.code] || "Other");
    const newLoc: ProjectLocation = {
      ...values,
      region: regionVal,
      id: editing ? editing.id : Date.now().toString()
    };
    if (editing) {
      setLocations(locations.map(loc => loc.id === editing.id ? newLoc : loc));
    } else {
      setLocations([...locations, newLoc]);
    }
    setOpen(false);
    form.reset();
    setEditing(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Project Locations</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode(em => !em)}>
            <Edit className="h-4 w-4 mr-2" /> {editMode ? "Done" : "Edit"}
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Track which cities and regions you operate projects in. Colors are auto-generated by country and region.
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
          {locations.length > 0 ? (
            <div className="grid gap-4">
              {locations.map((location) => (
                <div 
                  key={location.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${editMode && "ring-2"}`}
                  style={editMode && selected.includes(location.id) ? { borderColor: "#dc2626", background: "#fee2e2" } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="font-bold px-3 py-1 rounded text-base"
                      style={{ background: pastelColorForRegion(location.code) }}
                    >
                      {location.code}
                    </span>
                    <span>{flagEmoji(location.code)}</span>
                    <span className="font-medium">{location.city}</span>
                    <span className="bg-muted-foreground/10 px-2 py-0.5 rounded text-xs text-muted-foreground ml-2">
                      {location.region}
                    </span>
                  </div>
                  {editMode ? (
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-purple-600"
                      checked={selected.includes(location.id)}
                      onChange={() => handleSelect(location.id)}
                    />
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(location)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md border-dashed">
              No project locations yet. Click "Add Location" to get started.
            </div>
          )}
        </div>
      </CardContent>
      {/* Dialog for add/edit */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} Project Location</DialogTitle>
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
                            {flagEmoji(country.code)} {country.name}
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
                    <FormLabel>City</FormLabel>
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
                <Button type="submit">{editing ? 'Update' : 'Add'} Location</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
