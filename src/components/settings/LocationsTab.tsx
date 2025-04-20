
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
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Sample data - in a real app this would come from the database
const mockLocations = [
  { id: "1", city: "New York", country: "USA", color: "#4f46e5" },
  { id: "2", city: "London", country: "UK", color: "#0ea5e9" },
  { id: "3", city: "Tokyo", country: "Japan", color: "#10b981" }
];

const formSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  color: z.string().min(1, "Color is required"),
});

type LocationFormValues = z.infer<typeof formSchema>;

export const LocationsTab = () => {
  const [locations, setLocations] = useState(mockLocations);
  const [open, setOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<(typeof mockLocations)[0] | null>(null);

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      country: "",
      color: "#4f46e5"
    }
  });

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditingLocation(null);
    }
  };

  const handleEdit = (location: typeof mockLocations[0]) => {
    setEditingLocation(location);
    form.reset({
      city: location.city,
      country: location.country,
      color: location.color
    });
    setOpen(true);
  };

  const onSubmit = (values: LocationFormValues) => {
    if (editingLocation) {
      // Update existing location
      setLocations(locations.map(loc => 
        loc.id === editingLocation.id ? { ...loc, ...values } : loc
      ));
    } else {
      // Add new location
      setLocations([...locations, { id: Date.now().toString(), ...values }]);
    }
    setOpen(false);
    form.reset();
    setEditingLocation(null);
  };

  const colors = [
    "#4f46e5", "#0ea5e9", "#10b981", "#f97316", "#ec4899", 
    "#8b5cf6", "#d946ef", "#6366f1", "#0891b2", "#0d9488"
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Office Locations</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Manage your office locations.
          </div>
          
          {locations.length > 0 ? (
            <div className="grid gap-4">
              {locations.map((location) => (
                <div 
                  key={location.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: location.color }}
                    />
                    <span className="font-medium">{location.city}, {location.country}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(location)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
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
            <DialogTitle>{editingLocation ? 'Edit' : 'Add'} Office Location</DialogTitle>
            <DialogDescription>
              Enter the details for this office location.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., USA" {...field} />
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
                <Button type="submit">{editingLocation ? 'Update' : 'Add'} Location</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
