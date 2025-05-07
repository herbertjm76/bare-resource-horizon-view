
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse the request body
    const { company_id_param, month_param } = await req.json();
    
    // Extract year and month from the month_param (format: "YYYY-MM%")
    const [year, month] = month_param.split('-');
    
    // Create date range for the given month
    const startDate = `${year}-${month}-01`;
    const endDate = month === '12' 
      ? `${parseInt(year) + 1}-01-01` 
      : `${year}-${(parseInt(month) + 1).toString().padStart(2, '0')}-01`;

    // Query annual leaves
    const { data, error } = await supabase
      .from('annual_leaves')
      .select('id, member_id, date, hours')
      .eq('company_id', company_id_param)
      .gte('date', startDate)
      .lt('date', endDate);

    if (error) {
      throw error;
    }

    // Return the data
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
