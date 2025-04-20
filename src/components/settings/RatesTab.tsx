
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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOfficeSettings, Rate } from "@/context/OfficeSettingsContext";

const formSchema = z.object({
  type: z.enum(["role", "location"]),
  entityId: z.string().min(1, "Please select an item"),
  rate: z.number().min(0, "Rate must be greater than or equal to 0"),
});

type RateFormValues = z.infer<typeof formSchema>;

export const RatesTab = () => {
  const { roles, locations, rates, setRates } = useOfficeSettings();
  const [open, setOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<Rate | null>(null);

  const form = useForm<RateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "role",
      entityId: "",
      rate: 0
    }
  });

  const rateType = form.watch("type");

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditingRate(null);
    }
  };

  const handleEdit = (rate: Rate) => {
    const entityId = rate.type === "role" 
      ? roles.find(r => r.name === rate.name)?.id || ""
      : locations.find(l => l.city === rate.name)?.id || "";
    
    setEditingRate(rate);
    form.reset({
      type: rate.type as "role" | "location",
      entityId,
      rate: rate.value
    });
    setOpen(true);
  };

  const onSubmit = (values: RateFormValues) => {
    const entityName = values.type === "role"
      ? roles.find(r => r.id === values.entityId)?.name || ""
      : locations.find(l => l.id === values.entityId)?.city || "";

    if (editingRate) {
      // Update existing rate
      setRates(rates.map(rate => 
        rate.id === editingRate.id 
          ? { ...rate, type: values.type, name: entityName, value: values.rate } 
          : rate
      ));
    } else {
      // Add new rate
      setRates([...rates, { 
        id: Date.now().toString(), 
        type: values.type,
        name: entityName,
        value: values.rate
      }]);
    }
    setOpen(false);
    form.reset();
    setEditingRate(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Office Rates</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rate
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Set standard rates for different roles and locations in your office.
          </div>
          
          {rates.length > 0 ? (
            <>
              <div className="grid gap-4 mb-6">
                <h3 className="text-sm font-medium">Rates by Role</h3>
                {rates.filter(r => r.type === "role").length > 0 ? (
                  <div className="grid gap-3">
                    {rates
                      .filter(r => r.type === "role")
                      .map((rate) => (
                        <div 
                          key={rate.id}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div>
                            <div className="font-medium">{rate.name}</div>
                            <div className="text-sm text-muted-foreground">${rate.value}/hour</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(rate)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center p-4 border rounded-md border-dashed">
                    No role rates added yet.
                  </div>
                )}
              </div>
              
              <div className="grid gap-4">
                <h3 className="text-sm font-medium">Rates by Location</h3>
                {rates.filter(r => r.type === "location").length > 0 ? (
                  <div className="grid gap-3">
                    {rates
                      .filter(r => r.type === "location")
                      .map((rate) => (
                        <div 
                          key={rate.id}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div>
                            <div className="font-medium">{rate.name}</div>
                            <div className="text-sm text-muted-foreground">${rate.value}/hour</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(rate)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center p-4 border rounded-md border-dashed">
                    No location rates added yet.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-4 border rounded-md border-dashed">
              No rates added yet. Click "Add Rate" to get started.
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRate ? 'Edit' : 'Add'} Rate</DialogTitle>
            <DialogDescription>
              Define the hourly rate for a role or location.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Rate Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="role" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            By Role
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="location" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            By Location
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="entityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {rateType === 'role' ? 'Role' : 'Location'}
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select a ${rateType === 'role' ? 'role' : 'location'}`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rateType === 'role' 
                          ? roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))
                          : locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.city}, {location.country} ({location.code})
                              </SelectItem>
                            ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the hourly rate in USD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{editingRate ? 'Update' : 'Add'} Rate</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
// File is above 290 lines. This file is getting too long! If you’d like, ask me to refactor it for better maintainability.
