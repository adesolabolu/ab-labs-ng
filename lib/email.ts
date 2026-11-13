/**
 * Transactional Email Dispatcher via Resend API
 */

interface SendCredentialsOptions {
  to: string;
  name: string;
  templateName: string;
  temporaryPassword: string;
  portalUrl: string;
  domainName?: string | null;
}

export async function sendClientCredentialsEmail(options: SendCredentialsOptions): Promise<boolean> {
  const { to, name, templateName, temporaryPassword, portalUrl, domainName } = options;
  const resendApiKey = process.env.RESEND_API_KEY;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d0e; color: #e4e4e7; margin: 0; padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background-color: #141517; border: 1px solid #27272a; border-radius: 16px; padding: 32px; }
          .logo { font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.03em; margin-bottom: 24px; }
          .heading { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 12px; line-height: 1.3; }
          .subtext { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; }
          .card { background-color: #1a1c1e; border: 1px solid #3f3f46; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .label { font-size: 11px; text-transform: uppercase; color: #a1a1aa; letter-spacing: 0.05em; margin-bottom: 4px; }
          .val { font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 14px; }
          .val-code { font-family: monospace; font-size: 18px; color: #10b981; font-weight: 700; letter-spacing: 0.05em; }
          .btn { display: inline-block; background-color: #ffffff; color: #000000; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin-top: 8px; text-align: center; }
          .sla { border-left: 3px solid #10b981; padding-left: 14px; font-size: 13px; color: #34d399; margin: 20px 0; }
          .footer { font-size: 12px; color: #71717a; text-align: center; margin-top: 32px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">aB Labs</div>
          <h1 class="heading">Payment Confirmed: Your Website Build Has Officially Started!</h1>
          <p class="subtext">
            Hello <strong>${name}</strong>, thank you for trusting aB Labs. We have received your order for <strong>${templateName}</strong>${domainName ? ` on <strong>${domainName}</strong>` : ''}.
          </p>

          <div class="sla">
            ⚡ <strong>8-Hour SLA Guarantee:</strong> Our lead engineer is reviewing your project details. We will contact you on WhatsApp within 8 hours to deliver your Phase 1 interactive demo.
          </div>

          <div class="card">
            <div class="label">Your Client Portal Access</div>
            <p style="font-size: 13px; color: #d4d4d8; margin: 0 0 16px;">
              You can instantly upload your logo, select your color preferences, and view your build progress directly in your portal:
            </p>
            <div class="label">Portal Username (Email)</div>
            <div class="val">${to}</div>
            <div class="label">Temporary Access Password</div>
            <div class="val-code">${temporaryPassword}</div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${portalUrl}" class="btn">Open Your Client Portal &rarr;</a>
            </div>
          </div>

          <p class="subtext" style="font-size: 13px;">
            Prefer WhatsApp? No problem at all! You don't have to fill anything out right now if you are busy. We will reach out directly on WhatsApp to gather anything needed.
          </p>

          <div class="footer">
            &copy; ${new Date().getFullYear()} aB Labs &middot; Lagos, Nigeria<br>
            Direct Support: <a href="mailto:hello@ab-labs.cv" style="color: #a1a1aa;">hello@ab-labs.cv</a>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resendApiKey) {
    console.log('ℹ️ [Resend Simulation] No RESEND_API_KEY set. Email would have been sent to:', to);
    console.log('Credentials:', { email: to, temporaryPassword, portalUrl });
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'aB Labs <hello@ab-labs.cv>',
        to: [to],
        subject: `Welcome to aB Labs: Your ${templateName} build is underway!`,
        html,
      }),
    });

    const data = await res.json();
    return !!data.id;
  } catch (err) {
    console.error('Failed to send credentials email via Resend:', err);
    return false;
  }
}
