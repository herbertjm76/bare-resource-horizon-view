import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyId, timeRange } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting dashboard calculations for company:', companyId, 'timeRange:', timeRange);

    // Fetch all necessary data
    const [
      { data: profiles },
      { data: projects },
      { data: allocations },
      { data: annualLeaves },
      { data: otherLeaves }
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('company_id', companyId),
      supabase.from('projects').select('*').eq('company_id', companyId),
      supabase.from('project_resource_allocations').select('*').eq('company_id', companyId),
      supabase.from('annual_leaves').select('*').eq('company_id', companyId),
      supabase.from('weekly_other_leave').select('*').eq('company_id', companyId)
    ]);

    console.log('Fetched data:', {
      profiles: profiles?.length,
      projects: projects?.length,
      allocations: allocations?.length,
      annualLeaves: annualLeaves?.length,
      otherLeaves: otherLeaves?.length
    });

    // Prepare data for ChatGPT
    const dataContext = {
      timeRange,
      profiles: profiles || [],
      projects: projects || [],
      allocations: allocations || [],
      annualLeaves: annualLeaves || [],
      otherLeaves: otherLeaves || []
    };

    // Calculate date ranges based on timeRange
    const now = new Date();
    let startDate: Date;
    let endDate = new Date(now);

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case '3months':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '4months':
        startDate = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Call ChatGPT to perform calculations
    const prompt = `
You are a data calculation expert for a project management dashboard. Calculate the following metrics consistently:

CONTEXT:
- Time Range: ${timeRange}
- Start Date: ${startDate.toISOString()}
- End Date: ${endDate.toISOString()}
- Current Date: ${now.toISOString()}

DATA:
${JSON.stringify(dataContext, null, 2)}

REQUIRED CALCULATIONS:

1. For each team member, calculate:
   - Total allocated hours in the time period
   - Weekly capacity (from profile.weekly_capacity, default 40)
   - Utilization percentage: (total allocated hours / (weekly capacity * weeks in period)) * 100
   - Availability percentage: 100 - utilization percentage

2. Overall team metrics:
   - Total team members
   - Average team utilization
   - Total active projects
   - Projects by status

3. Project metrics:
   - Active projects count
   - Projects in different stages
   - Total allocated hours across all projects

IMPORTANT RULES:
- Use consistent calculation methods
- Handle edge cases (null values, missing data)
- Round percentages to whole numbers
- Ensure utilization can exceed 100% (overallocation)
- Only count allocations within the specified date range
- Filter allocations by week_start_date being within the range

Return ONLY a valid JSON object with this structure:
{
  "teamMembers": [
    {
      "id": "member_id",
      "name": "Full Name", 
      "utilization": number,
      "availability": number,
      "totalAllocatedHours": number,
      "weeklyCapacity": number
    }
  ],
  "teamMetrics": {
    "totalMembers": number,
    "averageUtilization": number,
    "totalActiveProjects": number
  },
  "projectMetrics": {
    "activeProjects": number,
    "totalAllocatedHours": number
  }
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a precise data calculation assistant. Always return valid JSON with accurate calculations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const calculatedData = JSON.parse(aiResponse.choices[0].message.content);

    console.log('ChatGPT calculated data:', calculatedData);

    return new Response(JSON.stringify({
      success: true,
      data: calculatedData,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in dashboard-calculations function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});