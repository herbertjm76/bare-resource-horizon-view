
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  type: z.enum(["role", "location"]),
  reference_id: z.string().min(1, "Please select an item"),
  value: z.number().min(0, "Rate must be greater than or equal to 0"),
  unit: z.enum(["hour", "day", "week"])
});

type AddRateDialogProps = {
  roles: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; city: string; country: string }>;
  onCancel: () => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  editingRate?: any;
};

export const AddRateDialog = ({ roles, locations, onCancel, onSubmit, editingRate }: AddRateDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: editingRate?.type || "role",
      reference_id: editingRate?.reference_id || "",
      value: editingRate?.value || 0,
      unit: editingRate?.unit || "hour"
    }
  });

  useEffect(() => {
    if (editingRate) {
      form.reset({
        type: editingRate.type,
        reference_id: editingRate.reference_id,
        value: editingRate.value,
        unit: editingRate.unit
      });
    }
  }, [editingRate, form]);

  const rateType = form.watch("type");

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <Card className="p-6 max-w-lg w-full mx-auto relative z-50 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-5 h-5 text-brand-accent" />
          <h2 className="text-lg font-semibold text-brand-accent">
            {editingRate ? 'Edit Rate' : 'Set Rate'}
          </h2>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="role">By Roles</SelectItem>
                      <SelectItem value="location">By Locations</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="bg-muted/30 p-6 rounded-lg space-y-6">
              <FormField
                control={form.control}
                name="reference_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{rateType === 'role' ? 'Role' : 'Location'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue 
                          placeholder={`Select ${rateType === 'role' ? 'role' : 'location'}`} 
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {rateType === 'role'
                          ? roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))
                          : locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.city}, {location.country}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-start gap-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Rate Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Per Unit</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hour">Per Hour</SelectItem>
                          <SelectItem value="day">Per Day</SelectItem>
                          <SelectItem value="week">Per Week</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {editingRate ? 'Update Rate' : 'Add Rate'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};
