import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CountrySelect from "@/components/ui/CountrySelect";
import { z, ZodSchema } from "zod";
import { UseFormReturn } from "react-hook-form";
import { countryRegions, getContinentByCountryCode } from "./projectAreaHelpers";
import allCountries from "@/lib/allCountries.json";

export type ProjectAreaFormValues = {
  code: string;
  country: string;
  city?: string;
  region: string;
};

export type ProjectArea = {
  id: string;
  code: string;
  city?: string;
  region: string;
  country: string;
};

interface ProjectAreaFormProps {
  open: boolean;
  loading: boolean;
  editing: ProjectArea | null;
  form: UseFormReturn<ProjectAreaFormValues>;
  onSubmit: (values: ProjectAreaFormValues) => void;
  onOpenChange: (open: boolean) => void;
}

const ProjectAreaForm: React.FC<ProjectAreaFormProps> = ({
  open,
  loading,
  editing,
  form,
  onSubmit,
  onOpenChange,
}) => {
  // Auto-suggest region by continent, always, even if region is already filled
  const handleCountryChange = (countryName: string, countryCode?: string) => {
    form.setValue("country", countryName);

    let suggestedRegion = "";

    if (countryCode) {
      suggestedRegion = getContinentByCountryCode(countryCode);
    } else {
      // Fallback to lookup by name in allCountries and then code
      const country = allCountries.find(c => c.name === countryName);
      if (country) {
        suggestedRegion = getContinentByCountryCode(country.code);
      }
    }

    if (suggestedRegion) {
      form.setValue("region", suggestedRegion, { shouldValidate: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit' : 'Add'} Project Area</DialogTitle>
          <DialogDescription>
            Enter a code, country, city (optional), and assign region.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Unique code"
                      {...field}
                      disabled={loading}
                    />
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
                    <CountrySelect
                      value={field.value}
                      onChange={(value, code) => handleCountryChange(value, code)}
                      disabled={loading}
                      placeholder="Select country"
                    />
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
                    <Input
                      placeholder="City (optional)"
                      {...field}
                      disabled={loading}
                    />
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
                      placeholder="Region"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <span className="text-xs text-muted-foreground">Region is auto-suggested based on country but can be edited.</span>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>{editing ? 'Update' : 'Add'} Area</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAreaForm;
