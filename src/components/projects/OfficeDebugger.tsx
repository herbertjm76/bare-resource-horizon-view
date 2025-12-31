
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

const OfficeDebugger = () => {
  const [offices, setOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOffices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('offices')
        .select('*');
      
      if (error) throw error;
      
      logger.debug("Offices fetched:", data);
      setOffices(data || []);
      
      if (data && data.length === 0) {
        toast.info("No offices found in the database.");
      } else {
        toast.success(`Found ${data?.length || 0} offices`);
      }
    } catch (error) {
      logger.error("Error fetching offices:", error);
      toast.error("Failed to fetch offices data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  return (
    <div className="mt-4 p-4 border rounded-2xl">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Office Data Debugger</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={fetchOffices} 
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>
      
      {offices.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Country</th>
              </tr>
            </thead>
            <tbody>
              {offices.map(office => (
                <tr key={office.id} className="border-b">
                  <td className="py-2">{office.id}</td>
                  <td className="py-2">{office.name}</td>
                  <td className="py-2">{office.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-4 text-muted-foreground">
          {loading ? "Loading offices..." : "No offices found in the database"}
        </div>
      )}
      
      <div className="mt-2 text-xs text-muted-foreground">
        To use this data in projects, you need to have offices created in your database.
      </div>
    </div>
  );
};

export default OfficeDebugger;
