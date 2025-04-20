
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Flag as FlagIcon } from "lucide-react";
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

// ISO country codes and names
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
  // ...add more as needed
];

// Get flag emoji from ISO country code
const flagEmoji = (countryCode: string) =>
  countryCode && countryCode.length === 2
    ? String.fromCodePoint(...[...countryCode.toUpperCase()].map(c=>127397+c.charCodeAt(0)))
    : "🏳️";

// Simulated DB
const initialLocations = [
  { id: "1", city: "New York", country: "United States", code: "US", emoji: "🇺🇸" },
  { id: "2", city: "London", country: "United Kingdom", code: "GB", emoji: "🇬🇧" },
  { id: "3", city: "Tokyo", country: "Japan", code: "JP", emoji: "🇯🇵" }
];

const formSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  code: z.string().length(2, "Country code required"),
  emoji: z.string().optional()
});

type LocationFormValues = z.infer<typeof formSchema>;
type Location = typeof initialLocations[0];

export const LocationsTab = () => {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [open, setOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      country: "",
      code: "",
      emoji: ""
    }
  });

  // Set fields when editing
  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    form.reset({
      city: location.city,
      country: location.country,
      code: location.code,
      emoji: location.emoji
    });
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const handleBulkDelete = () => {
    setLocations(locations.filter(loc => !selected.includes(loc.id)));
    setSelected([]);
    setEditMode(false);
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditingLocation(null);
    }
  };

  const onSubmit = (values: LocationFormValues) => {
    const emojiVal = values.emoji?.trim() ? values.emoji : flagEmoji(values.code);
    const countryObj = countries.find(c => c.code === values.code);
    const newLoc = {
      ...values,
      id: editingLocation ? editingLocation.id : Date.now().toString(),
      country: countryObj ? countryObj.name : values.country,
      emoji: emojiVal
    };
    if (editingLocation) {
      setLocations(locations.map(loc => loc.id === editingLocation.id ? newLoc : loc));
    } else {
      setLocations([...locations, newLoc]);
    }
    setOpen(false);
    form.reset();
    setEditingLocation(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Office Locations</CardTitle>
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
            Manage your office locations here. Select a country, city, and customize the emoji if you wish.
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
                  className={`flex items-center justify-between p-3 border rounded-md ${editMode && "ring-2"} `}
                  style={editMode && selected.includes(location.id) ? { borderColor: "#dc2626", background: "#fee2e2" } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{location.emoji || flagEmoji(location.code)}</span>
                    <span className="font-medium">{location.city}, {location.country} <span className="text-xs text-muted-foreground ml-1">({location.code})</span></span>
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
              No locations added yet. Click "Add Location" to get started.
            </div>
          )}
        </div>
      </CardContent>
      {/* Dialog for add/edit */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit' : 'Add'} Office Location</DialogTitle>
            <DialogDescription>
              Select a country and city. Emoji is auto-assigned, but can be customized.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <select
                        className="w-full bg-background border rounded px-3 py-2"
                        value={field.value}
                        onChange={e => {
                          const code = e.target.value;
                          const c = countries.find(k => k.code === code);
                          form.setValue("code", code);
                          field.onChange(c ? c.name : code);
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
              {/* hidden input for Code, set automatically */}
              <input type="hidden" {...form.register('code')} />
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
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flag Emoji (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 🗽"
                        {...field}
                        maxLength={2}
                        className="w-20"
                      />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">
                      Auto-set to flag. Enter custom emoji or leave blank to use country flag.
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editingLocation ? 'Update' : 'Add'} Location</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
