
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";

export const ProjectFinancialTabContent: React.FC = () => {
  return (
    <TabsContent value="financial" className="mt-0">
      <div className="py-8 text-center text-muted-foreground">
        Financial project info coming soon.
      </div>
    </TabsContent>
  );
};
