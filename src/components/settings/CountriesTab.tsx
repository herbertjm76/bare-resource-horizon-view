
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const CountriesTab = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Project Countries</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Country
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Configure the countries where your office operates projects.
        </div>
      </CardContent>
    </Card>
  );
};
