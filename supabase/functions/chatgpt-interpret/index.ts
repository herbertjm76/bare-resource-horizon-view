import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { prompt, maxTokens = 800, temperature = 0.3 } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Sending request to OpenAI for summary interpretation...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert resource management consultant specializing in team workload analysis and optimization. 
            
Your role is to:
- Analyze workload and utilization data
- Identify patterns, risks, and opportunities
- Provide actionable, business-focused recommendations
- Focus on practical solutions for project managers and team leads

Always structure your responses clearly with specific, measurable recommendations.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from OpenAI');
    }

    const content = data.choices[0].message.content;
    const usage = data.usage;

    console.log('Successfully generated interpretation:', {
      contentLength: content.length,
      usage
    });

    return new Response(JSON.stringify({
      success: true,
      content,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chatgpt-interpret function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      content: '',
      error: error.message || 'Failed to interpret summary data'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});