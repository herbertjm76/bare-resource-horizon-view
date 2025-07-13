import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseClient.auth.getUser(token);
    
    if (!user.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's company
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('company_id')
      .eq('id', user.user.id)
      .single();

    if (!profile?.company_id) {
      return new Response(JSON.stringify({ error: 'No company found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all projects for the company
    const { data: projects } = await supabaseClient
      .from('projects')
      .select('id, name')
      .eq('company_id', profile.company_id);

    // Get all active team members for the company
    const { data: activeMembers } = await supabaseClient
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('company_id', profile.company_id);

    // Get all pending users (pre-registered invites) for the company
    const { data: pendingMembers } = await supabaseClient
      .from('invites')
      .select('id, first_name, last_name')
      .eq('company_id', profile.company_id)
      .eq('status', 'pending')
      .eq('invitation_type', 'pre_registered');

    // Combine active and pending members
    const allMembers = [
      ...(activeMembers || []).map(member => ({ ...member, type: 'active' })),
      ...(pendingMembers || []).map(member => ({ ...member, type: 'pre_registered' }))
    ];

    if (!projects || projects.length === 0 || allMembers.length === 0) {
      return new Response(JSON.stringify({ error: 'No projects or team members found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate 16 weeks starting from July 7, 2025
    const weeks = [];
    const startDate = new Date('2025-07-07');
    for (let i = 0; i < 16; i++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(startDate.getDate() + (i * 7));
      weeks.push(weekDate.toISOString().split('T')[0]);
    }

    // Clear existing allocations for the 16-week period first
    await supabaseClient
      .from('project_resource_allocations')
      .delete()
      .eq('company_id', profile.company_id)
      .gte('week_start_date', weeks[0])
      .lte('week_start_date', weeks[weeks.length - 1]);

    const allocations = [];

    // Create allocation strategy for desired distribution:
    // 80% of members at 40 hours (green)
    // 10% of members under 40 hours (yellow) 
    // 10% of members over 40 hours (red)
    
    const totalMembers = allMembers.length;
    const members40Hours = Math.ceil(totalMembers * 0.8); // 80%
    const membersUnder40 = Math.ceil(totalMembers * 0.1); // 10%
    const membersOver40 = totalMembers - members40Hours - membersUnder40; // remaining ~10%
    
    console.log(`Distribution: ${members40Hours} at 40h, ${membersUnder40} under 40h, ${membersOver40} over 40h`);
    console.log(`Total members: ${totalMembers} (${activeMembers?.length || 0} active + ${pendingMembers?.length || 0} pending)`);
    
    // Shuffle members to randomize assignment
    const shuffledMembers = [...allMembers].sort(() => 0.5 - Math.random());
    
    // Assign members to different workload categories
    const members40HoursList = shuffledMembers.slice(0, members40Hours);
    const membersUnder40List = shuffledMembers.slice(members40Hours, members40Hours + membersUnder40);
    const membersOver40List = shuffledMembers.slice(members40Hours + membersUnder40);
    
    // Ensure we have at least one project to allocate to
    const primaryProject = projects[0];
    
    // Generate allocations for each category
    for (const weekStart of weeks) {
      // 80% - Members with exactly 40 hours (green)
      for (const member of members40HoursList) {
        allocations.push({
          project_id: primaryProject.id,
          resource_id: member.id,
          resource_type: member.type,
          week_start_date: weekStart,
          hours: 40,
          company_id: profile.company_id
        });
      }
      
      // 10% - Members with under 40 hours (yellow)
      for (const member of membersUnder40List) {
        // Random hours between 20-35 for under-utilized
        const hours = Math.floor(Math.random() * 16) + 20; // 20-35 hours
        allocations.push({
          project_id: primaryProject.id,
          resource_id: member.id,
          resource_type: member.type,
          week_start_date: weekStart,
          hours: hours,
          company_id: profile.company_id
        });
      }
      
      // 10% - Members with over 40 hours (red)
      for (const member of membersOver40List) {
        // Random hours between 45-55 for over-allocated
        const hours = Math.floor(Math.random() * 11) + 45; // 45-55 hours
        allocations.push({
          project_id: primaryProject.id,
          resource_id: member.id,
          resource_type: member.type,
          week_start_date: weekStart,
          hours: hours,
          company_id: profile.company_id
        });
      }
    }

    // Insert all allocations
    const { data, error } = await supabaseClient
      .from('project_resource_allocations')
      .insert(allocations);

    if (error) {
      console.error('Error inserting allocations:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generated ${allocations.length} dummy allocations for 16 weeks`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Generated ${allocations.length} dummy hour allocations for 16 weeks (${activeMembers?.length || 0} active + ${pendingMembers?.length || 0} pending members)`,
      projectsProcessed: projects.length,
      membersInvolved: allMembers.length,
      activeMembers: activeMembers?.length || 0,
      pendingMembers: pendingMembers?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating dummy hours:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});