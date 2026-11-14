import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      name,
      email,
      topic,
      field,
      message,
      phone,
      template_interest,
      templateSlug,
      templateName,
      inquiry_type,
      plan_type,
      businessName,
    } = body;

    const senderName = name || [firstName, lastName].filter(Boolean).join(' ') || businessName || 'Prospective Client';
    const contactEmail = email?.trim().toLowerCase() || null;
    const isDemo = inquiry_type === 'DEMO_REQUEST' || Boolean(templateName || templateSlug);
    const resolvedInquiryType = isDemo ? 'DEMO_REQUEST' : 'CONTACT';
    const targetTemplate = templateName || template_interest || templateSlug || null;
    const inquiryTopic = isDemo
      ? `Demo Request: ${targetTemplate || 'Website Foundation'}`
      : (topic || field || 'General Inquiry');
    const inquiryMessage = message?.trim() || (isDemo ? `Requested free brand demo for ${targetTemplate || 'template'}. Business: ${businessName || 'Not specified'}. Phone: ${phone || 'Not specified'}.` : '');

    if (!isDemo && !contactEmail) {
      return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 });
    }

    if (isDemo && !phone && !contactEmail) {
      return NextResponse.json({ success: false, error: 'Please provide your WhatsApp / phone number' }, { status: 400 });
    }

    if (!isDemo && !inquiryMessage) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    // 1. Persist inquiry into Neon PostgreSQL
    await sql`
      INSERT INTO contact_inquiries (
        name,
        email,
        phone,
        business_name,
        subject,
        message,
        template_interest,
        inquiry_type,
        plan_type,
        status
      ) VALUES (
        ${senderName},
        ${contactEmail},
        ${phone || null},
        ${businessName || null},
        ${inquiryTopic},
        ${inquiryMessage},
        ${targetTemplate},
        ${resolvedInquiryType},
        ${plan_type || null},
        'NEW'
      )
    `;

    // 2. Dispatch notification email via Resend if API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && !resendApiKey.includes('placeholder')) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0c0d0e; color: #f4f4f5; margin: 0; padding: 24px; }
              .card { max-width: 580px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px; }
              .header { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 20px; border-bottom: 1px solid #27272a; padding-bottom: 16px; }
              .badge { display: inline-block; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; background: ${isDemo ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)'}; color: ${isDemo ? '#22c55e' : '#3b82f6'}; border: 1px solid ${isDemo ? '#22c55e40' : '#3b82f640'}; }
              .field { margin-bottom: 16px; }
              .label { font-size: 12px; text-transform: uppercase; color: #a1a1aa; letter-spacing: 0.05em; margin-bottom: 4px; }
              .value { font-size: 15px; color: #ffffff; }
              .message-box { background: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-top: 8px; }
              .footer { font-size: 12px; color: #71717a; margin-top: 24px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">${isDemo ? '⚡ Free Brand Demo Request' : '📬 Inbound Contact Lead'}</span>
              <div class="header">${isDemo ? 'New Demo Request' : 'New Inbound Lead'} — aB Labs</div>
              <div class="field">
                <div class="label">Client Name</div>
                <div class="value">${senderName}</div>
              </div>
              <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${contactEmail}" style="color: #ff8a3d;">${contactEmail}</a></div>
              </div>
              ${phone ? `<div class="field"><div class="label">Phone / WhatsApp</div><div class="value"><a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="color: #22c55e;">${phone}</a></div></div>` : ''}
              ${businessName ? `<div class="field"><div class="label">Business / Brand</div><div class="value">${businessName}</div></div>` : ''}
              ${targetTemplate ? `<div class="field"><div class="label">Template Foundation</div><div class="value"><strong>${targetTemplate}</strong></div></div>` : ''}
              ${plan_type ? `<div class="field"><div class="label">Plan Preference</div><div class="value">${plan_type}</div></div>` : ''}
              <div class="field">
                <div class="label">Topic / Service</div>
                <div class="value">${inquiryTopic}</div>
              </div>
              <div class="field">
                <div class="label">Message / Details</div>
                <div class="message-box">${inquiryMessage}</div>
              </div>
              <div class="footer">Received via https://ng.ab-labs.cv • View in Admin Portal: https://ng.ab-labs.cv/admin</div>
            </div>
          </body>
        </html>
      `;

      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'aB Labs Inquiries <inquiries@ab-labs.cv>',
          to: ['hello@ab-labs.cv'],
          reply_to: contactEmail || 'hello@ab-labs.cv',
          subject: isDemo ? `⚡ [Demo Request] ${senderName} — ${targetTemplate || 'Template'}` : `[Lead] ${senderName} — ${inquiryTopic}`,
          html: emailHtml,
        }),
      }).catch((err) => console.error('[Resend Contact Error]:', err));
    }

    return NextResponse.json({
      success: true,
      message: isDemo
        ? 'Your demo request has been received! Our engineering team will prepare your preview and reach out shortly.'
        : 'Inquiry received successfully. Our team will contact you shortly.',
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
