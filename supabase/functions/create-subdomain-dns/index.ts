import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subdomain } = await req.json();

    if (!subdomain) {
      return new Response(
        JSON.stringify({ error: 'Subdomain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const CLOUDFLARE_API_TOKEN = Deno.env.get('CLOUDFLARE_API_TOKEN');
    const CLOUDFLARE_ZONE_ID = Deno.env.get('CLOUDFLARE_ZONE_ID');

    if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
      console.error('Missing Cloudflare credentials');
      return new Response(
        JSON.stringify({ error: 'DNS service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First, check if a DNS record already exists for this subdomain
    console.log(`Checking for existing DNS record for ${subdomain}.bareresource.com`);
    
    const listResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records?name=${subdomain}.bareresource.com&type=A`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const listResult = await listResponse.json();

    if (!listResponse.ok) {
      console.error('Failed to check existing DNS records:', listResult);
      return new Response(
        JSON.stringify({ error: 'Failed to check existing DNS records', details: listResult }),
        { status: listResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DNS record configuration (DNS only, not proxied)
    const dnsRecord = {
      type: 'A',
      name: subdomain,
      content: '185.158.133.1',
      ttl: 3600, // 1 hour TTL for DNS-only records
      proxied: false // DNS only to avoid Cloudflare proxy issues
    };

    let result;
    
    // If record exists, update it; otherwise create new one
    if (listResult.result && listResult.result.length > 0) {
      const existingRecord = listResult.result[0];
      console.log(`Updating existing DNS record for ${subdomain}.bareresource.com`);
      
      const updateResponse = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records/${existingRecord.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dnsRecord),
        }
      );

      result = await updateResponse.json();

      if (!updateResponse.ok) {
        console.error('Cloudflare API error:', result);
        return new Response(
          JSON.stringify({ error: 'Failed to update DNS record', details: result }),
          { status: updateResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`DNS record updated successfully for ${subdomain}.bareresource.com`);
    } else {
      console.log(`Creating new DNS record for ${subdomain}.bareresource.com`);
      
      const createResponse = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dnsRecord),
        }
      );

      result = await createResponse.json();

      if (!createResponse.ok) {
        console.error('Cloudflare API error:', result);
        return new Response(
          JSON.stringify({ error: 'Failed to create DNS record', details: result }),
          { status: createResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`DNS record created successfully for ${subdomain}.bareresource.com`);
    }

    return new Response(
      JSON.stringify({ success: true, record: result.result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-subdomain-dns:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
