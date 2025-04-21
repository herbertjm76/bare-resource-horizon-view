
import React, { useState, useEffect } from 'react';
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCompany } from "@/context/CompanyContext";

// --- updated schema: add unit ---
const formSchema = z.object({
  type: z.enum(["role", "location"]),
  reference_id: z.string().min(1, "Please select an item"),
  value: z.number().min(0, "Rate must be greater than or equal to 0"),
  unit: z.enum(["hour", "day", "week"])
});

type RateFormValues = z.infer<typeof formSchema>;

type OfficeRole = {
  id: string;
  name: string;
  code: string;
  company_id: string;
};

type OfficeLocation = {
  id: string;
  city: string;
  country: string;
  code: string;
  emoji?: string;
  company_id: string;
};

type OfficeRate = {
  id: string;
  type: "role" | "location";
  reference_id: string;
  value: number;
  unit: "hour" | "day" | "week";
  company_id: string;
};

export const RatesTab = () => {
  const [open, setOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<OfficeRate | null>(null);

  // Backend state
  const [roles, setRoles] = useState<OfficeRole[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [rates, setRates] = useState<OfficeRate[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const { company } = useCompany();

  // Fetch roles, locations, rates from Supabase
  useEffect(() => {
    async function fetchData() {
      if (!company) {
        setRoles([]);
        setLocations([]);
        setRates([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("office_roles").select("*").eq("company_id", company.id);
      
      // Fetch locations
      const { data: locationsData, error: locationsError } = await supabase
        .from("office_locations").select("*").eq("company_id", company.id);
      
      // Fetch rates
      const { data: ratesData, error: ratesError } = await supabase
        .from("office_rates").select("*").eq("company_id", company.id);

      if (rolesError || locationsError || ratesError) {
        toast({
          title: "Error loading data",
          description: rolesError?.message || locationsError?.message || ratesError?.message,
          variant: "destructive"
        });
      } else {
        setRoles(rolesData || []);
        setLocations(locationsData || []);
        
        // Process rates data with proper type casting
        if (ratesData) {
          const typedRates: OfficeRate[] = ratesData.map((rate) => ({
            ...rate,
            value: Number(rate.value),
            type: rate.type as "role" | "location", // Cast the type explicitly
            unit: rate.unit as "hour" | "day" | "week" // Cast the unit explicitly
          }));
          setRates(typedRates);
        } else {
          setRates([]);
        }
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, [open, company]); // refetch when dialog opens (e.g. after adding/updating) or company changes

  const form = useForm<RateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "role",
      reference_id: "",
      value: 0,
      unit: "hour"
    }
  });

  const rateType = form.watch("type");

  const onOpenChange = (openDialog: boolean) => {
    setOpen(openDialog);
    if (!openDialog) {
      form.reset();
      setEditingRate(null);
    }
  };

  const handleEdit = (rate: OfficeRate) => {
    setEditingRate(rate);
    form.reset({
      type: rate.type,
      reference_id: rate.reference_id,
      value: rate.value,
      unit: rate.unit
    });
    setOpen(true);
  };

  async function handleSubmit(values: RateFormValues) {
    if (!company) {
      toast({ title: "No company selected", description: "Please select a company first.", variant: "destructive" });
      return;
    }
    if (editingRate) {
      // Update rate in Supabase
      const { error } = await supabase
        .from("office_rates")
        .update({
          type: values.type,
          reference_id: values.reference_id,
          value: values.value,
          unit: values.unit,
          company_id: company.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingRate.id);
      if (error) {
        toast({ title: "Error updating rate", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Rate updated", description: "The rate was updated successfully." });
        setOpen(false);
        setEditingRate(null);
        form.reset();
      }
    } else {
      // Add new rate
      const { error } = await supabase
        .from("office_rates")
        .insert([
          {
            type: values.type,
            reference_id: values.reference_id,
            value: values.value,
            unit: values.unit,
            company_id: company.id
          }
        ]);
      if (error) {
        toast({ title: "Error adding rate", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Rate added", description: "A new rate was added successfully!" });
        setOpen(false);
        setEditingRate(null);
        form.reset();
      }
    }
  }

  function getDisplayName(type: "role" | "location", reference_id: string) {
    if (type === "role") {
      const role = roles.find((r) => r.id === reference_id);
      return role ? role.name : "Unknown Role";
    } else {
      const location = locations.find((l) => l.id === reference_id);
      return location ? location.city : "Unknown Location";
    }
  }

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
          {loading ? (
            <div className="text-center p-4">Loading rates...</div>
          ) : rates.length > 0 ? (
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
                            <div className="font-medium">{getDisplayName("role", rate.reference_id)}</div>
                            <div className="text-sm text-muted-foreground">
                              ${rate.value}/{rate.unit}
                            </div>
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
                            <div className="font-medium">{getDisplayName("location", rate.reference_id)}</div>
                            <div className="text-sm text-muted-foreground">
                              ${rate.value}/{rate.unit}
                            </div>
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
              Define the rate for a role or location, and choose if it's per hour, day, or week.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                name="reference_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {rateType === 'role' ? 'Role' : 'Location'}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate Value</FormLabel>
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
                      Enter the rate value.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
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
              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {editingRate ? 'Update' : 'Add'} Rate
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
