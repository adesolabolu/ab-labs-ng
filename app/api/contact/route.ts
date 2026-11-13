import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, name, email, topic, field, message, phone } = body;

    const senderName = name || [firstName, lastName].filter(Boolean).join(' ') || 'Prospective Client';
    const contactEmail = email?.trim().toLowerCase();
    const inquiryTopic = topic || field || 'General Inquiry';
    const inquiryMessage = message?.trim();

    if (!contactEmail || !inquiryMessage) {
      return NextResponse.json({ success: false, error: 'Email and message are required' }, { status: 400 });
    }

    // 1. Persist inquiry into Neon PostgreSQL
    await sql`
      INSERT INTO contact_inquiries (
        name,
        email,
        phone,
        subject,
        message,
        template_interest,
        status
      ) VALUES (
        ${senderName},
        ${contactEmail},
        ${phone || null},
        ${inquiryTopic},
        ${inquiryMessage},
        ${inquiryTopic},
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
              .field { margin-bottom: 16px; }
              .label { font-size: 12px; text-transform: uppercase; color: #a1a1aa; letter-spacing: 0.05em; margin-bottom: 4px; }
              .value { font-size: 15px; color: #ffffff; }
              .message-box { background: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-top: 8px; }
              .footer { font-size: 12px; color: #71717a; margin-top: 24px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">🚨 New Inbound Lead — aB Labs</div>
              <div class="field">
                <div class="label">Client Name</div>
                <div class="value">${senderName}</div>
              </div>
              <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${contactEmail}" style="color: #ff8a3d;">${contactEmail}</a></div>
              </div>
              ${phone ? `<div class="field"><div class="label">Phone / WhatsApp</div><div class="value">${phone}</div></div>` : ''}
              <div class="field">
                <div class="label">Topic / Service</div>
                <div class="value">${inquiryTopic}</div>
              </div>
              <div class="field">
                <div class="label">Message</div>
                <div class="message-box">${inquiryMessage}</div>
              </div>
              <div class="footer">Received via https://ng.ab-labs.cv contact form</div>
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
          reply_to: contactEmail,
          subject: `[Lead] ${senderName} — ${inquiryTopic}`,
          html: emailHtml,
        }),
      }).catch((err) => console.error('[Resend Contact Error]:', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully. Our team will contact you shortly.',
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
