import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BulkInviteRequest {
  inviteIds: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract and verify the JWT token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Invalid token or user not found:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`User ${user.id} authenticated, verifying company access`);

    // Get the user's company_id from their profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.company_id) {
      console.error("User has no company:", profileError);
      return new Response(
        JSON.stringify({ error: "User does not belong to a company" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userCompanyId = profile.company_id;
    console.log(`User belongs to company: ${userCompanyId}`);

    const { inviteIds }: BulkInviteRequest = await req.json();

    if (!inviteIds || inviteIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "No invite IDs provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Processing ${inviteIds.length} invites for company ${userCompanyId}`);
    console.log(`Requested invite IDs: ${JSON.stringify(inviteIds)}`);

    // Fetch invite details - CRITICAL: Filter by user's company_id
    // Support both pre_registered and email_invite types
    const { data: invites, error: invitesError } = await supabase
      .from("invites")
      .select("id, email, first_name, last_name, code, invitation_type, company_id, status, companies(name, subdomain)")
      .in("id", inviteIds)
      .eq("company_id", userCompanyId); // Only allow invites from user's company

    if (invitesError) {
      console.error("Error fetching invites:", invitesError);
      throw invitesError;
    }

    console.log(`Found ${invites?.length || 0} invites matching requested IDs for company`);
    
    if (invites && invites.length > 0) {
      console.log(`Invite details: ${JSON.stringify(invites.map(i => ({ id: i.id, status: i.status, type: i.invitation_type })))}`);
    }

    // Filter for valid invites (pending status and correct types)
    const validInvites = (invites || []).filter(
      invite => invite.status === 'pending' && 
      (invite.invitation_type === 'pre_registered' || invite.invitation_type === 'email_invite')
    );

    if (validInvites.length === 0) {
      // Provide more helpful error message
      if (!invites || invites.length === 0) {
        console.error(`No invites found with IDs: ${JSON.stringify(inviteIds)} for company ${userCompanyId}`);
        return new Response(
          JSON.stringify({ error: "The selected invites were not found. Please refresh the page and try again." }),
          {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      } else {
        // Invites exist but have wrong status or type
        const statusInfo = invites.map(i => `${i.id}: status=${i.status}, type=${i.invitation_type}`).join(', ');
        console.error(`Invites found but invalid: ${statusInfo}`);
        return new Response(
          JSON.stringify({ error: "The selected invites are not in pending status or have an invalid type." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    // Security check: Ensure we found all requested invites in user's company
    if (validInvites.length !== inviteIds.length) {
      console.warn(`Security: User ${user.id} attempted to access ${inviteIds.length} invites but only ${validInvites.length} are valid`);
      // Don't fail, just proceed with valid ones
    }

    console.log(`Found ${validInvites.length} valid invites to send for company ${userCompanyId}`);

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const invite of validInvites) {
      if (!invite.email) {
        console.warn(`Skipping invite ${invite.id} - no email address`);
        results.failed++;
        results.errors.push(`Invite ${invite.id} has no email address`);
        continue;
      }

      try {
        const companyName = invite.companies?.name || "the team";
        const companySubdomain = invite.companies?.subdomain || "";
        const firstName = invite.first_name || "";
        const inviteUrl = `https://bareresource.com/join/${companySubdomain}/${invite.code}`;

        console.log(`Sending invite to ${invite.email}`);

        const emailResponse = await resend.emails.send({
          from: "Resource <no-reply@bareresource.com>",
          to: [invite.email],
          subject: `Join ${companyName} Resource`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="light">
                <meta name="supported-color-schemes" content="light">
                <style>
                  :root { color-scheme: light; }
                </style>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937 !important; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f3f4f6 !important;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                            <h1 style="color: #ffffff !important; margin: 0; font-size: 28px; font-weight: 700;">You're Invited!</h1>
                          </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                          <td style="background-color: #ffffff !important; padding: 40px;">
                            <p style="font-size: 16px; margin: 0 0 20px 0; color: #1f2937 !important;">Hi${firstName ? ` ${firstName}` : ''},</p>
                            
                            <p style="font-size: 16px; margin: 0 0 30px 0; color: #4b5563 !important; line-height: 1.6;">
                              You've been invited to join <strong style="color: #1f2937 !important;">${companyName}</strong> on Resource. Click the button below to complete your registration and join the team.
                            </p>
                            
                            <!-- Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center" style="padding: 10px 0 30px 0;">
                                  <table cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
                                        <a href="${inviteUrl}" 
                                           style="display: inline-block; padding: 16px 40px; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 16px;">
                                          Accept Invitation
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            
                            <!-- Divider -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                                  <p style="font-size: 12px; color: #6b7280 !important; margin: 0; text-align: center;">
                                    If you didn't expect this invitation, you can safely ignore this email.
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
        });

        console.log(`Email sent successfully to ${invite.email}:`, emailResponse);
        results.successful++;
      } catch (emailError: any) {
        console.error(`Failed to send email to ${invite.email}:`, emailError);
        results.failed++;
        results.errors.push(`Failed to send to ${invite.email}: ${emailError.message}`);
      }
    }

    console.log("Bulk invite results:", results);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: `Successfully sent ${results.successful} invite(s). ${results.failed} failed.`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-bulk-invites function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
