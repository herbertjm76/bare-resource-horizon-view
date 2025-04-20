
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Flag } from "lucide-react";
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

// List of all countries for searching in the dropdown (no emojis in list display)
import allCountries from "@/lib/allCountries.json"; // We'll create this helper with all countries

// Get flag emoji from ISO country code
const flagEmoji = (countryCode: string) =>
  countryCode && countryCode.length === 2
    ? String.fromCodePoint(...[...countryCode.toUpperCase()].map(c=>127397+c.charCodeAt(0)))
    : null; // return null if invalid

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
};

export const LocationsTab = () => {
  const { locations, setLocations } = useOfficeSettings();
  const [open, setOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      code: "",
      country: "",
      emoji: ""
    }
  });

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    form.reset({
      city: location.city,
      code: location.code,
      country: location.country,
      emoji: location.emoji
    });
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const handleBulkDelete = () => {
    setLocations(locations.filter(row => !selected.includes(row.id)));
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
    const emojiVal = values.emoji && values.emoji.trim() !== "" ? values.emoji : flagEmoji(values.code) || "";
    const countryObj = allCountries.find(c => c.code === values.code);
    const newEntry: Location = {
      id: editingLocation ? editingLocation.id : Date.now().toString(),
      city: values.city,
      code: values.code,
      country: countryObj ? countryObj.name : values.country,
      emoji: emojiVal
    };
    if (editingLocation) {
      setLocations(locations.map(row => row.id === editingLocation.id ? newEntry : row));
    } else {
      setLocations([...locations, newEntry]);
    }
    setOpen(false);
    form.reset();
    setEditingLocation(null);
  };

  // For searching in the dropdown
  const [countrySearch, setCountrySearch] = useState("");
  const filteredCountries = allCountries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Locations</CardTitle>
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
            Manage your office locations. Each location consists of a city and a country.
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
              {locations.map((row) => (
                <div 
                  key={row.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${editMode && "ring-2"}`}
                  style={editMode && selected.includes(row.id) ? { borderColor: "#dc2626", background: "#fee2e2" } : {}}
                >
                  <div className="flex items-center gap-3">
                    {/* Only show custom emoji, else default to flag */}
                    {row.emoji ? (
                      typeof row.emoji === "string" && row.emoji.length === 2 && /[\uD83C-\uDBFF]{2}/.test(row.emoji) ? (
                        <span className="text-2xl">{row.emoji}</span>
                      ) : (
                        <Flag className="h-6 w-6 text-muted" />
                      )
                    ) : (
                      <span className="text-2xl">{flagEmoji(row.code)}</span>
                    )}
                    <span className="font-medium">{row.city}, {row.country} <span className="text-xs text-muted-foreground ml-1">({row.code})</span></span>
                  </div>
                  {editMode ? (
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-purple-600"
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelect(row.id)}
                    />
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
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
            <DialogTitle>{editingLocation ? 'Edit' : 'Add'} Location</DialogTitle>
            <DialogDescription>
              Choose a country (searchable), specify city. The flag is auto-assigned by country, but can be customized.
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
                    {/* Searchable Dropdown */}
                    <FormControl>
                      <div>
                        <Input
                          className="mb-2"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                        />
                        <select
                          className="w-full bg-background border rounded px-3 py-2"
                          value={field.value}
                          onChange={e => {
                            const code = e.target.value;
                            const c = allCountries.find(k => k.code === code);
                            form.setValue("code", code);
                            form.setValue("country", c ? c.name : code);
                            field.onChange(code);
                            setCountrySearch(""); // clear the search box after select
                          }}
                        >
                          <option value="">Select a country...</option>
                          {filteredCountries.map(country => (
                            <option key={country.code} value={country.code}>
                              {/* country.flag is removed from dropdown options! */} 
                              {country.name} ({country.code})
                            </option>
                          ))}
                        </select>
                      </div>
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
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emoji (optional)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder={flagEmoji(form.watch("code")) || ""}
                          {...field}
                          maxLength={2}
                          className="w-20"
                          disabled={!form.watch("code")}
                        />
                        <Flag className="h-5 w-5 text-muted" />
                        <span className="text-xs text-muted-foreground">
                          Auto-set to flag for country. You may enter another emoji, or leave blank for flag.
                        </span>
                      </div>
                    </FormControl>
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

// File is above 285 lines. This file is getting too long! Please consider breaking it into smaller components for maintainability.

