/**
 * Cleanup Edge Function for Project Resource Allocations
 * 
 * RULE BOOK ENFORCEMENT:
 * This function removes duplicate allocation rows, keeping only the most 
 * recently updated row for each unique (company_id, project_id, resource_id, allocation_date).
 * 
 * Run this once to clean existing corrupted data, then rely on DB constraints 
 * to prevent future duplicates.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DuplicateGroup {
  company_id: string;
  project_id: string;
  resource_id: string;
  allocation_date: string;
  row_count: number;
  ids: string[];
  hours_values: number[];
  updated_ats: string[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user is authenticated and is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's company ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      return new Response(JSON.stringify({ error: 'User has no company' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const companyId = profile.company_id;

    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc('is_admin_for_company', { 
      check_company_id: companyId 
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[cleanup] Starting cleanup for company ${companyId}`);

    // Step 1: Find all duplicate groups
    // We select all rows for this company, then group in JS to find duplicates
    const { data: allAllocations, error: fetchError } = await supabase
      .from('project_resource_allocations')
      .select('id, company_id, project_id, resource_id, allocation_date, hours, updated_at')
      .eq('company_id', companyId)
      .order('updated_at', { ascending: false });

    if (fetchError) {
      console.error('[cleanup] Error fetching allocations:', fetchError);
      throw fetchError;
    }

    console.log(`[cleanup] Found ${allAllocations?.length || 0} total allocation rows`);

    // Group by unique key
    const groups = new Map<string, DuplicateGroup>();
    
    for (const row of allAllocations || []) {
      const key = `${row.company_id}|${row.project_id}|${row.resource_id}|${row.allocation_date}`;
      
      if (!groups.has(key)) {
        groups.set(key, {
          company_id: row.company_id,
          project_id: row.project_id,
          resource_id: row.resource_id,
          allocation_date: row.allocation_date,
          row_count: 0,
          ids: [],
          hours_values: [],
          updated_ats: [],
        });
      }
      
      const group = groups.get(key)!;
      group.row_count++;
      group.ids.push(row.id);
      group.hours_values.push(row.hours);
      group.updated_ats.push(row.updated_at);
    }

    // Find groups with duplicates (row_count > 1)
    const duplicateGroups = Array.from(groups.values()).filter(g => g.row_count > 1);
    
    console.log(`[cleanup] Found ${duplicateGroups.length} duplicate groups`);

    if (duplicateGroups.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No duplicates found',
        stats: {
          totalRows: allAllocations?.length || 0,
          duplicateGroups: 0,
          rowsDeleted: 0,
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 2: For each duplicate group, keep the first ID (most recent updated_at due to ordering)
    // and delete the rest
    const idsToDelete: string[] = [];
    const affectedKeys: string[] = [];

    for (const group of duplicateGroups) {
      // Keep the first ID (most recently updated), delete the rest
      const [keepId, ...deleteIds] = group.ids;
      idsToDelete.push(...deleteIds);
      
      affectedKeys.push(
        `${group.project_id.substring(0, 8)}.../${group.resource_id.substring(0, 8)}.../${group.allocation_date}`
      );
      
      console.log(`[cleanup] Group ${group.allocation_date}: keeping row ${keepId}, deleting ${deleteIds.length} duplicates`);
    }

    // Step 3: Delete the duplicate rows
    if (idsToDelete.length > 0) {
      // Delete in batches to avoid hitting limits
      const batchSize = 100;
      let deletedCount = 0;

      for (let i = 0; i < idsToDelete.length; i += batchSize) {
        const batch = idsToDelete.slice(i, i + batchSize);
        
        const { error: deleteError } = await supabase
          .from('project_resource_allocations')
          .delete()
          .in('id', batch);

        if (deleteError) {
          console.error('[cleanup] Error deleting batch:', deleteError);
          throw deleteError;
        }

        deletedCount += batch.length;
        console.log(`[cleanup] Deleted batch ${Math.ceil((i + 1) / batchSize)}: ${batch.length} rows`);
      }

      console.log(`[cleanup] Cleanup complete. Deleted ${deletedCount} duplicate rows.`);

      return new Response(JSON.stringify({
        success: true,
        message: `Cleaned up ${deletedCount} duplicate allocation rows`,
        stats: {
          totalRows: allAllocations?.length || 0,
          duplicateGroups: duplicateGroups.length,
          rowsDeleted: deletedCount,
          affectedKeys: affectedKeys.slice(0, 10), // Show first 10 affected keys
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'No rows needed deletion',
      stats: {
        totalRows: allAllocations?.length || 0,
        duplicateGroups: duplicateGroups.length,
        rowsDeleted: 0,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[cleanup] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
