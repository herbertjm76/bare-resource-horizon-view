
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Sample data - in a real app this would come from the database
const mockCountries = [
  { id: "1", name: "United States", abbreviation: "US", city: "New York", color: "#4f46e5" },
  { id: "2", name: "United Kingdom", abbreviation: "UK", city: "London", color: "#0ea5e9" },
  { id: "3", name: "Japan", abbreviation: "JP", city: "Tokyo", color: "#10b981" }
];

const formSchema = z.object({
  name: z.string().min(1, "Country name is required"),
  abbreviation: z.string().min(1, "Abbreviation is required"),
  city: z.string().min(1, "City is required"),
  color: z.string().min(1, "Color is required"),
});

type CountryFormValues = z.infer<typeof formSchema>;

export const CountriesTab = () => {
  const [countries, setCountries] = useState(mockCountries);
  const [open, setOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<(typeof mockCountries)[0] | null>(null);

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
      city: "",
      color: "#4f46e5"
    }
  });

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditingCountry(null);
    }
  };

  const handleEdit = (country: typeof mockCountries[0]) => {
    setEditingCountry(country);
    form.reset({
      name: country.name,
      abbreviation: country.abbreviation,
      city: country.city,
      color: country.color
    });
    setOpen(true);
  };

  const onSubmit = (values: CountryFormValues) => {
    if (editingCountry) {
      // Update existing country
      setCountries(countries.map(country => 
        country.id === editingCountry.id ? { ...country, ...values } : country
      ));
    } else {
      // Add new country
      setCountries([...countries, { id: Date.now().toString(), ...values }]);
    }
    setOpen(false);
    form.reset();
    setEditingCountry(null);
  };

  const colors = [
    "#4f46e5", "#0ea5e9", "#10b981", "#f97316", "#ec4899", 
    "#8b5cf6", "#d946ef", "#6366f1", "#0891b2", "#0d9488"
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Project Countries</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Country
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Configure the countries where your office operates projects.
          </div>
          
          {countries.length > 0 ? (
            <div className="grid gap-4">
              {countries.map((country) => (
                <div 
                  key={country.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: country.color }}
                    />
                    <div>
                      <div className="font-medium">{country.name} ({country.abbreviation})</div>
                      <div className="text-sm text-muted-foreground">{country.city}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(country)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
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

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCountry ? 'Edit' : 'Add'} Project Country</DialogTitle>
            <DialogDescription>
              Enter the details for this project country.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="abbreviation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Abbreviation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., US" {...field} />
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
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal"
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: field.value }}
                              />
                              <span>{field.value}</span>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="grid grid-cols-5 gap-2">
                            {colors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                style={{ backgroundColor: color }}
                                onClick={() => form.setValue('color', color)}
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
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
