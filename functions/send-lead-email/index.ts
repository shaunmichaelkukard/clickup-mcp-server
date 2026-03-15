import { createClient } from "npm:@blinkdotnew/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const projectId = Deno.env.get("BLINK_PROJECT_ID");
    const secretKey = Deno.env.get("BLINK_SECRET_KEY");

    if (!projectId || !secretKey) {
      console.error("Missing configuration: BLINK_PROJECT_ID or BLINK_SECRET_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const blink = createClient({ projectId, secretKey });
    const { name, email, company, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Store lead in database
    const lead = await blink.db.leads.create({
      name,
      email,
      company: company || null,
      message,
      status: 'pending',
      userId: 'admin_user' // Use a fixed ID or similar for the main owner
    });

    // 2. Send email notification
    // Note: In a real app, you'd get the admin email from site_settings or a secret
    // For now, let's assume we send it to a support address or the lead itself for testing, 
    // but ideally the user's email.
    await blink.notifications.email({
      to: 'hello@jacksoncartel.com', // The user's requested email
      subject: `New Lead from JacksonCartel: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
          <h2 style="color: #18181b; border-bottom: 2px solid #18181b; padding-bottom: 10px;">New Lead Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <div style="background: #f4f4f5; padding: 15px; border-radius: 4px; margin-top: 15px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #71717a; font-size: 12px; margin-top: 20px;">
            This lead has been saved to your administration dashboard.
          </p>
        </div>
      `,
      text: `New Lead from JacksonCartel\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\nMessage: ${message}`
    });

    return new Response(JSON.stringify({ ok: true, leadId: lead.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in lead-email handler:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

Deno.serve(handler);
