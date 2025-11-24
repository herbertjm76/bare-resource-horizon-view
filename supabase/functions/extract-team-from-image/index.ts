import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    if (!imageData) {
      throw new Error('No image data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get company_id from authenticated user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      throw new Error('No company found for user');
    }

    // Get existing team members
    const { data: existingProfiles } = await supabaseClient
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('company_id', profile.company_id);

    const { data: existingInvites } = await supabaseClient
      .from('invites')
      .select('first_name, last_name, email')
      .eq('company_id', profile.company_id);

    const existingMembers = [
      ...(existingProfiles || []),
      ...(existingInvites || [])
    ];

    console.log('Calling Lovable AI to extract names from image...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a team member extraction assistant. Extract all person names and available details from the provided image.

IMPORTANT: Look for these fields specifically:
- Name (split into first_name and last_name)
- Role/Job Title (map to "job_title")
- Type (if visible, could be employment type like "Full-time", "Contractor", "Part-time")
- Sector/Department (map to "department")
- Location (office location, city, or country)
- Email (if visible)

Return a JSON array with this EXACT structure:
{
  "people": [
    {
      "first_name": "string",
      "last_name": "string", 
      "job_title": "string or null",
      "department": "string or null (use sector if that's what's shown)",
      "location": "string or null",
      "email": "string or null",
      "employment_type": "string or null (Full-time, Part-time, Contractor, etc)"
    }
  ]
}

Be thorough - extract ALL visible people and their details. If only full names are visible, split intelligently into first_name and last_name.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all person names and details from this image.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI extraction failed');
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    // Parse JSON from AI response (handle markdown code blocks)
    let extractedData;
    try {
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      extractedData = JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response');
    }

    const people = extractedData.people || [];
    
    // Match with existing members
    const results = people.map((person: any) => {
      const existing = existingMembers.find(m => 
        (m.first_name?.toLowerCase() === person.first_name?.toLowerCase() &&
         m.last_name?.toLowerCase() === person.last_name?.toLowerCase()) ||
        (m.email && person.email && m.email.toLowerCase() === person.email.toLowerCase())
      );

      return {
        ...person,
        status: existing ? 'exists' : 'new',
        existingEmail: existing?.email
      };
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        people: results,
        total: results.length,
        new: results.filter(p => p.status === 'new').length,
        existing: results.filter(p => p.status === 'exists').length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in extract-team-from-image:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
