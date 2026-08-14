import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup service-role client to bypass RLS securely on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Fallback to anon client if service role key is not configured (e.g. initial dev setup)
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: string): string {
  return str.slice(0, 2000).replace(/<[^>]*>/g, '');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Spam Protection (Honeypot)
    if (body.website && body.website.trim().length > 0) {
      // Return a fake success response to trick bots
      return NextResponse.json({ success: true, message: 'Submission processed (honeypot)' });
    }

    // 2. Validation
    const name = body.name ? sanitize(body.name.trim()) : '';
    const email = body.email ? sanitize(body.email.trim().toLowerCase()) : '';
    const phone = body.phone ? sanitize(body.phone.trim()) : null;
    const address = body.address ? sanitize(body.address.trim()) : null;
    const city = body.city ? sanitize(body.city.trim()) : null;
    const postalCode = body.postal_code ? sanitize(body.postal_code.trim()) : null;
    const propertyType = body.property_type === 'Commercial' ? 'Commercial' : 'Residential';
    const services = Array.isArray(body.services)
      ? body.services.slice(0, 20).map((s: string) => sanitize(s))
      : [];
    const message = body.message ? sanitize(body.message.trim()) : null;
    const photoUrls = Array.isArray(body.photo_urls) ? body.photo_urls.slice(0, 10) : [];

    if (name.length < 2) {
      return NextResponse.json({ error: 'Please provide your full name.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // 3. Save to database
    const { data: insertData, error: insertError } = await supabase
      .from('quote_requests')
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
        status: 'new',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save your quote request. Please try again or call us.' },
        { status: 500 }
      );
    }

    const submissionId = insertData.id;
    const submissionDate = new Date().toLocaleString('en-CA', {
      timeZone: 'America/Vancouver',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    // 4. Send email notifications using Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    const businessEmail = process.env.BUSINESS_EMAIL || 'info@ngmlandscape.ca';

    if (resendApiKey) {
      const servicesList = services.length > 0 ? services.join(', ') : 'Not specified';
      const photoSection =
        photoUrls.length > 0
          ? (photoUrls as string[])
              .map((url: string, i: number) => `<a href="${url}" target="_blank" style="color: #2D5016; font-weight: 600;">Photo ${i + 1}</a>`)
              .join('<br/>')
          : 'No photos uploaded';
      const customerPhone = phone || 'Not provided';
      const fullAddress = [address, city, postalCode].filter(Boolean).join(', ') || 'Not provided';

      // HTML for the business notification
      const businessHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded-2xl: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2D5016;">Najm Garden & Maintenance Ltd.</span>
            <h1 style="color: #1a202c; font-size: 22px; margin-top: 8px; margin-bottom: 0;">New Quote Request</h1>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px; line-height: 1.6; color: #4a5568;">
            <tr>
              <td style="padding: 10px 0; font-weight: 600; width: 150px; border-bottom: 1px solid #edf2f7; color: #2d3748;">Customer Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #edf2f7; color: #2d3748;">Phone Number:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;"><a href="tel:${customerPhone.replace(/[^0-9+]/g, '')}" style="color: #2D5016; text-decoration: none;">${customerPhone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #edf2f7; color: #2d3748;">Email Address:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;"><a href="mailto:${email}" style="color: #2D5016; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #edf2f7; color: #2d3748;">Property Address:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;">${fullAddress}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #edf2f7; color: #2d3748;">Property Type:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;">${propertyType}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #edf2f7; color: #2d3748;">Services Needed:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7; font-weight: 500; color: #1a202c;">${servicesList}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #edf2f7; color: #2d3748;">Project Details:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7; white-space: pre-wrap;">${message || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #edf2f7; color: #2d3748;">Uploaded Photos:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;">${photoSection}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #2d3748;">Submitted On:</td>
              <td style="padding: 10px 0;">${submissionDate}</td>
            </tr>
          </table>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #edf2f7; text-align: center;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">Submission ID: ${submissionId}</p>
            <a href="${req.headers.get('origin') || ''}/admin" style="display: inline-block; margin-top: 16px; background-color: #2D5016; color: white; padding: 10px 20px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 8px;">View in Admin Panel</a>
          </div>
        </div>
      `;

      // HTML for the customer confirmation email
      const customerHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <span style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2D5016;">Najm Garden & Maintenance Ltd.</span>
            <h1 style="color: #1a202c; font-size: 24px; margin-top: 8px; margin-bottom: 0;">We Received Your Request</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">Hi ${name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
            Thank you for requesting a free estimate from <strong>Najm Garden & Maintenance Ltd.</strong> We have received your details and our team is currently reviewing your project request.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
            We will follow up with you shortly to ask any clarifying questions and arrange a convenient time for a free on-site consultation.
          </p>
          
          <div style="margin: 32px 0; padding: 24px; bg-color: #f7fafc; background-color: #f7fafc; border-radius: 12px;">
            <h3 style="margin-top: 0; color: #2d3748; font-size: 15px;">Summary of Services Requested:</h3>
            <p style="font-size: 14px; color: #1a202c; font-weight: 600; margin-bottom: 0;">${servicesList}</p>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #718096;">
            If you need immediate assistance or would like to add details to your request, please do not hesitate to contact us at <a href="tel:7782331599" style="color: #2D5016; font-weight: 600; text-decoration: none;">778-233-1599</a> or email us directly at <a href="mailto:${businessEmail}" style="color: #2D5016; text-decoration: none;">${businessEmail}</a>.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-top: 32px;">
            Best regards,<br/>
            <strong>Najmudin Najm</strong><br/>
            <span style="color: #718096; font-size: 14px; font-weight: 500;">Owner, Najm Garden & Maintenance Ltd.</span>
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #edf2f7; text-align: center; color: #a0aec0; font-size: 12px;">
            <p style="margin: 0 0 4px 0;">Najm Garden & Maintenance Ltd. | Maple Ridge, BC</p>
            <p style="margin: 0;">Phone: 778-233-1599 | Email: ${businessEmail}</p>
          </div>
        </div>
      `;

      try {
        // Send email to business
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Najm Garden & Maintenance <noreply@ngmlandscape.ca>',
            to: [businessEmail],
            reply_to: email,
            subject: `New Quote Request - ${name}`,
            html: businessHtml,
          }),
        });

        // Send confirmation email to customer
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Najm Garden & Maintenance <noreply@ngmlandscape.ca>',
            to: [email],
            subject: 'We Received Your Quote Request - Najm Garden & Maintenance Ltd.',
            html: customerHtml,
          }),
        });
      } catch (emailError) {
        console.error('Resend email sending failure:', emailError);
        // We do not fail form submission since it is successfully saved in the database
      }
    }

    return NextResponse.json({ success: true, id: submissionId });
  } catch (err) {
    console.error('API submit-quote error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or call us at 778-233-1599.' },
      { status: 500 }
    );
  }
}
