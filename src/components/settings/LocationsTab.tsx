
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

// ISO country list
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
const initialCountries = [
  { id: "1", city: "New York", country: "United States", code: "US", emoji: "🇺🇸" },
  { id: "2", city: "London", country: "United Kingdom", code: "GB", emoji: "🇬🇧" },
  { id: "3", city: "Tokyo", country: "Japan", code: "JP", emoji: "🇯🇵" }
];

const formSchema = z.object({
  city: z.string().min(1, "City is required"),
  code: z.string().length(2, "Country code is required"),
  country: z.string().min(1, "Country is required"),
  emoji: z.string().optional()
});
type CountryFormValues = z.infer<typeof formSchema>;
type Country = {
  id: string;
  city: string;
  country: string;
  code: string;
  emoji?: string;
};

export const LocationsTab = () => {
  // Now "CountriesTab" as per user's naming
  const [countryRows, setCountryRows] = useState<Country[]>(initialCountries);
  const [open, setOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      code: "",
      country: "",
      emoji: ""
    }
  });

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    form.reset({
      city: country.city,
      code: country.code,
      country: country.country,
      emoji: country.emoji
    });
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const handleBulkDelete = () => {
    setCountryRows(countryRows.filter(row => !selected.includes(row.id)));
    setSelected([]);
    setEditMode(false);
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditingCountry(null);
    }
  };

  const onSubmit = (values: CountryFormValues) => {
    const emojiVal = values.emoji && values.emoji.trim() !== "" ? values.emoji : flagEmoji(values.code);
    const countryObj = countries.find(c => c.code === values.code);
    const newEntry: Country = {
      id: editingCountry ? editingCountry.id : Date.now().toString(),
      city: values.city,
      code: values.code,
      country: countryObj ? countryObj.name : values.country,
      emoji: emojiVal
    };
    if (editingCountry) {
      setCountryRows(countryRows.map(row => row.id === editingCountry.id ? newEntry : row));
    } else {
      setCountryRows([...countryRows, newEntry]);
    }
    setOpen(false);
    form.reset();
    setEditingCountry(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Countries</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode(em => !em)}>
            <Edit className="h-4 w-4 mr-2" /> {editMode ? "Done" : "Edit"}
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Country
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Manage your company’s countries. Select a country and city for each office. Flag emoji is auto-generated, but can be changed.
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
          {countryRows.length > 0 ? (
            <div className="grid gap-4">
              {countryRows.map((row) => (
                <div 
                  key={row.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${editMode && "ring-2"}`}
                  style={editMode && selected.includes(row.id) ? { borderColor: "#dc2626", background: "#fee2e2" } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{row.emoji || flagEmoji(row.code)}</span>
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
              No countries added yet. Click "Add Country" to get started.
            </div>
          )}
        </div>
      </CardContent>
      {/* Dialog for add/edit */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCountry ? 'Edit' : 'Add'} Country</DialogTitle>
            <DialogDescription>
              Choose a country (searchable), specify city. Emoji is auto-assigned, but may be customized.
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
                      <select
                        className="w-full bg-background border rounded px-3 py-2"
                        value={field.value}
                        onChange={e => {
                          const code = e.target.value;
                          const c = countries.find(k => k.code === code);
                          form.setValue("code", code);
                          form.setValue("country", c ? c.name : code);
                          field.onChange(code);
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
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emoji (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={flagEmoji(form.watch("code"))}
                        {...field}
                        maxLength={2}
                        className="w-20"
                        disabled={!form.watch("code")}
                      />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">
                      Auto-set to flag. Enter custom emoji or clear to use country flag.
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editingCountry ? 'Update' : 'Add'} Country</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// File is above 270 lines. This file is getting too long! Please consider breaking it into smaller components for maintainability.
