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

// Validation function for calculated data structure
function validateCalculatedData(data: any): string[] {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Data must be an object');
    return errors;
  }
  
  // Validate teamMembers array
  if (!Array.isArray(data.teamMembers)) {
    errors.push('teamMembers must be an array');
  } else {
    data.teamMembers.forEach((member: any, index: number) => {
      const requiredFields = ['id', 'name', 'utilization', 'availability', 'totalAllocatedHours', 'weeklyCapacity'];
      const enhancedFields = ['projectHours', 'annualLeaveHours', 'otherLeaveHours', 'totalCapacity'];
      
      [...requiredFields, ...enhancedFields].forEach(field => {
        if (typeof member[field] === 'undefined') {
          errors.push(`teamMembers[${index}] missing field: ${field}`);
        }
        if (field !== 'id' && field !== 'name' && typeof member[field] !== 'number') {
          errors.push(`teamMembers[${index}].${field} must be a number`);
        }
      });
    });
  }
  
  // Validate teamMetrics
  if (!data.teamMetrics || typeof data.teamMetrics !== 'object') {
    errors.push('teamMetrics must be an object');
  } else {
    const requiredMetrics = ['totalMembers', 'averageUtilization', 'totalActiveProjects'];
    const enhancedMetrics = ['totalProjectHours', 'totalLeaveHours'];
    
    [...requiredMetrics, ...enhancedMetrics].forEach(field => {
      if (typeof data.teamMetrics[field] !== 'number') {
        errors.push(`teamMetrics.${field} must be a number`);
      }
    });
  }
  
  // Validate projectMetrics
  if (!data.projectMetrics || typeof data.projectMetrics !== 'object') {
    errors.push('projectMetrics must be an object');
  } else {
    if (typeof data.projectMetrics.activeProjects !== 'number') {
      errors.push('projectMetrics.activeProjects must be a number');
    }
    if (typeof data.projectMetrics.totalAllocatedHours !== 'number') {
      errors.push('projectMetrics.totalAllocatedHours must be a number');
    }
    
    // Validate enhanced projectsByStatus
    if (data.projectMetrics.projectsByStatus) {
      const statusFields = ['Planning', 'In Progress', 'On Hold', 'Complete'];
      statusFields.forEach(status => {
        if (typeof data.projectMetrics.projectsByStatus[status] !== 'number') {
          errors.push(`projectMetrics.projectsByStatus.${status} must be a number`);
        }
      });
    }
  }
  
  // Validate enhanced calculationMetadata
  if (data.calculationMetadata) {
    if (typeof data.calculationMetadata.weeksInPeriod !== 'number') {
      errors.push('calculationMetadata.weeksInPeriod must be a number');
    }
    
    if (data.calculationMetadata.dataQuality) {
      const qualityFields = ['profilesWithMissingCapacity', 'allocationsOutOfRange'];
      qualityFields.forEach(field => {
        if (typeof data.calculationMetadata.dataQuality[field] !== 'number') {
          errors.push(`calculationMetadata.dataQuality.${field} must be a number`);
        }
      });
      
      if (!Array.isArray(data.calculationMetadata.dataQuality.calculationWarnings)) {
        errors.push('calculationMetadata.dataQuality.calculationWarnings must be an array');
      }
    }
  }
  
  return errors;
}

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

    // Calculate weeks in the time period for accurate calculations
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / msInWeek);

    // Call ChatGPT to perform calculations
    const prompt = `
You are a data calculation expert for a project management dashboard. You must calculate ALL types of time allocations to ensure accurate utilization metrics.

CONTEXT:
- Time Range: ${timeRange}
- Start Date: ${startDate.toISOString()}
- End Date: ${endDate.toISOString()}
- Current Date: ${now.toISOString()}
- Weeks in Period: ${weeksInPeriod}

DATA:
${JSON.stringify(dataContext, null, 2)}

CRITICAL CALCULATION REQUIREMENTS:

For TOTAL UTILIZATION, you MUST include ALL of these allocation types:
1. PROJECT HOURS: from project_resource_allocations table (where week_start_date is within range)
2. ANNUAL LEAVE: from annual_leaves table (where date is within range, convert daily hours)
3. OTHER LEAVE: from weekly_other_leave table (where week_start_date is within range)
4. HOLIDAYS: Calculate public holidays that fall within the time range (assume 8 hours per holiday for full-time employees)

DETAILED CALCULATION STEPS:

1. For each team member, calculate these components separately:
   a) PROJECT HOURS: Sum all hours from project_resource_allocations where:
      - resource_id matches the member's ID
      - week_start_date is between startDate and endDate
   
   b) ANNUAL LEAVE HOURS: Sum all hours from annual_leaves where:
      - member_id matches the member's ID  
      - date is between startDate and endDate
   
   c) OTHER LEAVE HOURS: Sum all hours from weekly_other_leave where:
      - member_id matches the member's ID
      - week_start_date is between startDate and endDate
   
   d) TOTAL ALLOCATED HOURS = PROJECT HOURS + ANNUAL LEAVE HOURS + OTHER LEAVE HOURS
   
   e) WEEKLY CAPACITY: Use profile.weekly_capacity (default 40 if null)
   
   f) TOTAL CAPACITY = WEEKLY CAPACITY × WEEKS IN PERIOD
   
   g) UTILIZATION PERCENTAGE = (TOTAL ALLOCATED HOURS ÷ TOTAL CAPACITY) × 100
   
   h) AVAILABILITY PERCENTAGE = 100 - UTILIZATION PERCENTAGE (can be negative if overallocated)

2. Team metrics calculation:
   - Use the same allocation logic for consistency
   - Average utilization = sum of all member utilizations ÷ number of members
   - Count only "In Progress" and "Planning" projects as active

3. Project metrics calculation:
   - Count projects by status
   - Sum project hours only (not leave hours) for project metrics

VALIDATION RULES:
- Verify all dates are properly parsed (use Date.parse() if needed)
- Handle null/undefined values gracefully (default to 0)
- Ensure week_start_date comparisons use proper date logic
- Round all percentages to whole numbers
- Log any data inconsistencies in the response

ERROR HANDLING:
- If any calculation fails, return detailed error information
- Validate that all required fields exist before calculations
- Check for division by zero scenarios

Return ONLY a valid JSON object with this enhanced structure:
{
  "teamMembers": [
    {
      "id": "member_id",
      "name": "Full Name", 
      "utilization": number,
      "availability": number,
      "totalAllocatedHours": number,
      "projectHours": number,
      "annualLeaveHours": number,
      "otherLeaveHours": number,
      "weeklyCapacity": number,
      "totalCapacity": number
    }
  ],
  "teamMetrics": {
    "totalMembers": number,
    "averageUtilization": number,
    "totalActiveProjects": number,
    "totalProjectHours": number,
    "totalLeaveHours": number
  },
  "projectMetrics": {
    "activeProjects": number,
    "totalAllocatedHours": number,
    "projectsByStatus": {
      "Planning": number,
      "In Progress": number,
      "On Hold": number,
      "Complete": number
    }
  },
  "calculationMetadata": {
    "weeksInPeriod": number,
    "startDate": "${startDate.toISOString()}",
    "endDate": "${endDate.toISOString()}",
    "dataQuality": {
      "profilesWithMissingCapacity": number,
      "allocationsOutOfRange": number,
      "calculationWarnings": string[]
    }
  }
}
`;

    // Call ChatGPT with retry logic for rate limiting
    let response;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount <= maxRetries) {
      try {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
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

        if (response.ok) {
          console.log('OpenAI API call successful on attempt', retryCount + 1);
          break;
        } else if (response.status === 429) {
          retryCount++;
          if (retryCount <= maxRetries) {
            const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
            console.log(`Rate limited, waiting ${waitTime}ms before retry ${retryCount}/${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          } else {
            const errorData = await response.text();
            console.error('OpenAI API rate limit exceeded after all retries:', errorData);
            throw new Error(`OpenAI API rate limit exceeded: ${response.status}`);
          }
        } else {
          const errorData = await response.text();
          console.error('OpenAI API error:', errorData);
          throw new Error(`OpenAI API error: ${response.status}`);
        }
      } catch (fetchError) {
        if (retryCount === maxRetries) {
          throw fetchError;
        }
        retryCount++;
        const waitTime = Math.pow(2, retryCount) * 1000;
        console.log(`Network error, waiting ${waitTime}ms before retry ${retryCount}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    const aiResponse = await response.json();
    
    // Enhanced error handling and validation
    if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI API');
    }

    const rawContent = aiResponse.choices[0].message.content;
    console.log('Raw ChatGPT response:', rawContent);

    let calculatedData;
    try {
      calculatedData = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw content that failed to parse:', rawContent);
      throw new Error(`Failed to parse ChatGPT response as JSON: ${parseError.message}`);
    }

    // Validate the structure of the calculated data
    const validationErrors = validateCalculatedData(calculatedData);
    if (validationErrors.length > 0) {
      console.error('Data validation errors:', validationErrors);
      throw new Error(`Data validation failed: ${validationErrors.join(', ')}`);
    }

    console.log('ChatGPT calculated data (validated):', calculatedData);

    return new Response(JSON.stringify({
      success: true,
      data: calculatedData,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in dashboard-calculations function:', error);
    
    // If OpenAI fails due to rate limiting, provide fallback calculations
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      console.log('Falling back to direct calculation due to OpenAI rate limit');
      
      try {
        const fallbackData = performFallbackCalculations(dataContext, startDate, endDate, weeksInPeriod);
        
        return new Response(JSON.stringify({
          success: true,
          data: fallbackData,
          timestamp: new Date().toISOString(),
          source: 'fallback_calculation'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (fallbackError) {
        console.error('Fallback calculation also failed:', fallbackError);
      }
    }
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

// Fallback calculation function
function performFallbackCalculations(dataContext: any, startDate: Date, endDate: Date, weeksInPeriod: number) {
  const { profiles, allocations, annualLeaves, otherLeaves, projects } = dataContext;
  
  console.log('Performing fallback calculations with comprehensive allocation logic');
  
  const teamMembers = profiles.map((profile: any) => {
    const memberId = profile.id;
    const weeklyCapacity = profile.weekly_capacity || 40;
    const totalCapacity = weeklyCapacity * weeksInPeriod;
    
    // Calculate project hours
    const projectHours = allocations
      .filter((alloc: any) => {
        if (alloc.resource_id !== memberId) return false;
        const allocDate = new Date(alloc.week_start_date);
        return allocDate >= startDate && allocDate <= endDate;
      })
      .reduce((sum: number, alloc: any) => sum + (alloc.hours || 0), 0);
    
    // Calculate annual leave hours
    const annualLeaveHours = annualLeaves
      .filter((leave: any) => {
        if (leave.member_id !== memberId) return false;
        const leaveDate = new Date(leave.date);
        return leaveDate >= startDate && leaveDate <= endDate;
      })
      .reduce((sum: number, leave: any) => sum + (leave.hours || 0), 0);
    
    // Calculate other leave hours
    const otherLeaveHours = otherLeaves
      .filter((leave: any) => {
        if (leave.member_id !== memberId) return false;
        const leaveDate = new Date(leave.week_start_date);
        return leaveDate >= startDate && leaveDate <= endDate;
      })
      .reduce((sum: number, leave: any) => sum + (leave.hours || 0), 0);
    
    const totalAllocatedHours = projectHours + annualLeaveHours + otherLeaveHours;
    const utilization = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
    const availability = 100 - utilization;
    
    return {
      id: memberId,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
      utilization,
      availability,
      totalAllocatedHours,
      projectHours,
      annualLeaveHours,
      otherLeaveHours,
      weeklyCapacity,
      totalCapacity
    };
  });
  
  // Calculate team metrics
  const totalMembers = teamMembers.length;
  const averageUtilization = totalMembers > 0 
    ? Math.round(teamMembers.reduce((sum: number, member: any) => sum + member.utilization, 0) / totalMembers)
    : 0;
  const activeProjects = projects.filter((project: any) => 
    project.status === 'In Progress' || project.status === 'Planning'
  ).length;
  const totalProjectHours = teamMembers.reduce((sum: number, member: any) => sum + member.projectHours, 0);
  const totalLeaveHours = teamMembers.reduce((sum: number, member: any) => sum + member.annualLeaveHours + member.otherLeaveHours, 0);
  
  // Calculate project metrics
  const projectsByStatus = {
    'Planning': projects.filter((p: any) => p.status === 'Planning').length,
    'In Progress': projects.filter((p: any) => p.status === 'In Progress').length,
    'On Hold': projects.filter((p: any) => p.status === 'On Hold').length,
    'Complete': projects.filter((p: any) => p.status === 'Complete').length
  };
  
  return {
    teamMembers,
    teamMetrics: {
      totalMembers,
      averageUtilization,
      totalActiveProjects: activeProjects,
      totalProjectHours,
      totalLeaveHours
    },
    projectMetrics: {
      activeProjects,
      totalAllocatedHours: totalProjectHours,
      projectsByStatus
    },
    calculationMetadata: {
      weeksInPeriod,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      dataQuality: {
        profilesWithMissingCapacity: profiles.filter((p: any) => !p.weekly_capacity).length,
        allocationsOutOfRange: 0,
        calculationWarnings: ['Fallback calculation used due to OpenAI rate limit']
      }
    }
  };
}
});