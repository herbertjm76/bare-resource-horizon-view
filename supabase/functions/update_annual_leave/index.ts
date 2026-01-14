
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
    const { leave_id_param, hours_param, leave_type_id_param } = await req.json();

    // Build update data
    const updateData: Record<string, unknown> = { hours: hours_param };
    
    // Add leave_type_id if provided
    if (leave_type_id_param !== undefined) {
      updateData.leave_type_id = leave_type_id_param;
    }

    // Update annual leave entry
    const { error } = await supabase
      .from('annual_leaves')
      .update(updateData)
      .eq('id', leave_id_param);

    if (error) {
      throw error;
    }

    // Return success
    return new Response(JSON.stringify({ success: true }), {
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
