import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QuotePayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  property_type?: string;
  services?: string[];
  message?: string;
  photo_urls?: string[];
  website?: string; // honeypot field
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: string): string {
  return str.slice(0, 2000).replace(/<[^>]*>/g, "");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: QuotePayload = await req.json();

    // --- Validation ---
    if (!body.name || body.name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Please provide your full name." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.email || !isValidEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Honeypot: if "website" is filled, it's a bot
    if (body.website && body.website.trim().length > 0) {
      // Pretend success to not tip off the bot
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const name = sanitize(body.name.trim());
    const email = sanitize(body.email.trim().toLowerCase());
    const phone = body.phone ? sanitize(body.phone.trim()) : null;
    const address = body.address ? sanitize(body.address.trim()) : null;
    const city = body.city ? sanitize(body.city.trim()) : null;
    const postalCode = body.postal_code ? sanitize(body.postal_code.trim()) : null;
    const propertyType = body.property_type === "Commercial" ? "Commercial" : "Residential";
    const services = Array.isArray(body.services) ? body.services.slice(0, 20).map(sanitize) : [];
    const message = body.message ? sanitize(body.message.trim()) : null;
    const photoUrls = Array.isArray(body.photo_urls) ? body.photo_urls.slice(0, 10) : [];

    // --- Save to database ---
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: insertData, error: insertError } = await supabase
      .from("quote_requests")
      .insert({
        name,
        email,
        phone,
        address,
        city,
        postal_code: postalCode,
        property_type: propertyType,
        services,
        message,
        photo_urls: photoUrls,
        status: "new",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save your request. Please try again or call us." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const submissionId = insertData.id;
    const submissionDate = new Date().toLocaleString("en-CA", {
      timeZone: "America/Vancouver",
      dateStyle: "full",
      timeStyle: "short",
    });

    // --- Send emails via Resend ---
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const businessEmail = Deno.env.get("BUSINESS_EMAIL") || "info@ngmlandscape.ca";

    if (resendApiKey) {
      const servicesList = services.length > 0 ? services.join(", ") : "Not specified";
      const photoSection = photoUrls.length > 0
        ? photoUrls.map((url, i) => `<a href="${url}" target="_blank">Photo ${i + 1}</a>`).join("<br/>")
        : "No photos uploaded";
      const customerPhone = phone || "Not provided";
      const fullAddress = [address, city, postalCode].filter(Boolean).join(", ") || "Not provided";

      // Email to business
      const businessHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #2D5016; font-size: 24px; margin-bottom: 24px;">New Quote Request - Najm Garden & Maintenance Ltd.</h1>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px; line-height: 1.6;">
            <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Customer Name:</td><td>${name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Phone:</td><td>${customerPhone}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Email:</td><td>${email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Property Address:</td><td>${fullAddress}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Property Type:</td><td>${propertyType}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Services:</td><td>${servicesList}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Project Description:</td><td>${message || "Not provided"}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Photos:</td><td>${photoSection}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Submission Date:</td><td>${submissionDate}</td></tr>
          </table>
          <p style="margin-top: 24px; color: #666; font-size: 13px;">Submission ID: ${submissionId}</p>
        </div>
      `;

      // Email to customer
      const customerHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #2D5016; font-size: 22px;">Najm Garden & Maintenance Ltd.</h1>
          </div>
          <h2 style="font-size: 20px; color: #333;">We Received Your Quote Request</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #555;">Hi ${name},</p>
          <p style="font-size: 15px; line-height: 1.6; color: #555;">
            Thank you for reaching out to Najm Garden & Maintenance Ltd. We have received your quote request
            and our team will review the information you provided. We will follow up with you shortly to discuss
            your project.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #555;">
            If you have any questions in the meantime, feel free to call us at <a href="tel:7782331599" style="color: #2D5016;">778-233-1599</a>
            or email us at <a href="mailto:info@ngmlandscape.ca" style="color: #2D5016;">info@ngmlandscape.ca</a>.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #555;">Best regards,<br/>Najm Garden & Maintenance Ltd.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 32px;" />
          <p style="font-size: 12px; color: #999; text-align: center;">Maple Ridge, BC | 778-233-1599</p>
        </div>
      `;

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Najm Garden <noreply@ngmlandscape.ca>",
            to: [businessEmail],
            subject: `New Quote Request - ${name}`,
            html: businessHtml,
          }),
        });

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Najm Garden <noreply@ngmlandscape.ca>",
            to: [email],
            subject: "We Received Your Quote Request - Najm Garden & Maintenance Ltd.",
            html: customerHtml,
          }),
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
        // Don't fail the request — the data is saved
      }
    }

    return new Response(
      JSON.stringify({ success: true, id: submissionId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again or call us at 778-233-1599." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
