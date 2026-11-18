/**
 * Transactional Email Dispatcher via Resend API
 */

// Escape user-controlled text before embedding in HTML.
function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&#39;';
    }
  });
}

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

  // Escape anything user/order-controlled before embedding into the HTML.
  const eTo = escapeHtml(to);
  const eName = escapeHtml(name);
  const eTemplateName = escapeHtml(templateName);
  const eTemporaryPassword = escapeHtml(temporaryPassword);
  const ePortalUrl = escapeHtml(portalUrl);
  const eDomainName = domainName ? escapeHtml(domainName) : null;

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
            Hello <strong>${eName}</strong>, thank you for trusting aB Labs. We have received your order for <strong>${eTemplateName}</strong>${eDomainName ? ` on <strong>${eDomainName}</strong>` : ''}.
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
            <div class="val">${eTo}</div>
            <div class="label">Temporary Access Password</div>
            <div class="val-code">${eTemporaryPassword}</div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${ePortalUrl}" class="btn">Open Your Client Portal &rarr;</a>
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
    if (!res.ok) {
      console.error('Resend API error:', res.status, data);
      return false;
    }
    return !!data.id;
  } catch (err) {
    console.error('Failed to send credentials email via Resend:', err);
    return false;
  }
}

export async function sendOrderConfirmationEmail(options: {
  to: string;
  name: string;
  templateName: string;
  portalUrl: string;
  domainName?: string | null;
}): Promise<boolean> {
  const { to, name, templateName, portalUrl, domainName } = options;
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return true;

  const eName = escapeHtml(name);
  const eTemplateName = escapeHtml(templateName);
  const ePortalUrl = escapeHtml(portalUrl);
  const eDomainName = domainName ? escapeHtml(domainName) : null;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0c0d0e; color: #e4e4e7; margin: 0; padding: 40px 20px;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #141517; border: 1px solid #27272a; border-radius: 16px; padding: 32px;">
          <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 20px;">aB Labs</div>
          <h1 style="font-size: 22px; font-weight: 700; color: #ffffff; margin: 0 0 12px;">Payment Confirmed: ${eTemplateName}</h1>
          <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0 0 24px;">
            Hello <strong>${eName}</strong>, we have received your payment for <strong>${eTemplateName}</strong>${eDomainName ? ` (<strong>${eDomainName}</strong>)` : ''}. This new website project has been added to your existing client portal account, and you can switch between your websites anytime.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${ePortalUrl}" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 8px; text-decoration: none;">Open Your Client Portal &rarr;</a>
          </div>
          <p style="font-size: 12px; color: #71717a; text-align: center; margin-top: 28px;">
            &copy; ${new Date().getFullYear()} aB Labs &middot; Lagos, Nigeria
          </p>
        </div>
      </body>
    </html>
  `;

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
        subject: `Payment Confirmed: Your ${templateName} build is underway!`,
        html,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('Resend API error (confirmation):', res.status, data);
      return false;
    }
    return !!data.id;
  } catch (err) {
    console.error('Failed to send order confirmation email:', err);
    return false;
  }
}

async function sendResendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return true;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'aB Labs Billing <hello@ab-labs.cv>',
        to: [to],
        subject,
        html,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('Resend API error:', res.status, data);
      return false;
    }
    return !!data.id;
  } catch (err) {
    console.error('Failed to send email via Resend:', err);
    return false;
  }
}

function wrapBillingEmail(title: string, bodyHtml: string, ctaLabel?: string, ctaUrl?: string): string {
  const buttonHtml =
    ctaLabel && ctaUrl
      ? `<div style="text-align: center; margin: 24px 0;"><a href="${escapeHtml(ctaUrl)}" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 8px; text-decoration: none;">${escapeHtml(ctaLabel)} &rarr;</a></div>`
      : '';
  return `<!DOCTYPE html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0c0d0e; color: #e4e4e7; margin: 0; padding: 40px 20px;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #141517; border: 1px solid #27272a; border-radius: 16px; padding: 32px;">
      <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 20px;">aB Labs</div>
      <h1 style="font-size: 22px; font-weight: 700; color: #ffffff; margin: 0 0 12px;">${escapeHtml(title)}</h1>
      ${bodyHtml}
      ${buttonHtml}
      <p style="font-size: 12px; color: #71717a; text-align: center; margin-top: 28px;">
        &copy; ${new Date().getFullYear()} aB Labs &middot; Lagos, Nigeria
      </p>
    </div>
  </body>
</html>`;
}

export async function sendBillingReminderEmail(options: {
  to: string;
  name: string;
  businessName: string;
  amountNgn: number;
  dueDate: Date;
  daysLeft: number;
  portalUrl: string;
}): Promise<boolean> {
  const { to, name, businessName, amountNgn, dueDate, daysLeft, portalUrl } = options;
  const formattedDate = dueDate.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
  const dayText = daysLeft <= 1 ? 'tomorrow' : `in ${daysLeft} days`;
  const html = wrapBillingEmail(
    `Upcoming Monthly Renewal (${dayText})`,
    `<p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0 0 16px;">
      Hello <strong>${escapeHtml(name)}</strong>, your monthly hosting &amp; maintenance renewal of <strong>&#8358;${amountNgn.toLocaleString()}</strong> for <strong>${escapeHtml(businessName)}</strong> is due <strong>${escapeHtml(dayText)}</strong> (${escapeHtml(formattedDate)}).
    </p>
    <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin: 0;">
      If your card is saved on file, we will renew it automatically. You can also check or update your billing details in your portal anytime.
    </p>`,
    'Open Client Portal',
    portalUrl
  );
  return sendResendEmail(to, `Reminder: Monthly renewal for ${businessName} due ${dayText}`, html);
}

export async function sendBillingOverdueWarningEmail(options: {
  to: string;
  name: string;
  businessName: string;
  amountNgn: number;
  portalUrl: string;
}): Promise<boolean> {
  const { to, name, businessName, amountNgn, portalUrl } = options;
  const html = wrapBillingEmail(
    'Action Needed: Monthly Payment Failed',
    `<p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0 0 16px;">
      Hello <strong>${escapeHtml(name)}</strong>, we could not process your monthly renewal of <strong>&#8358;${amountNgn.toLocaleString()}</strong> for <strong>${escapeHtml(businessName)}</strong>.
    </p>
    <p style="font-size: 14px; color: #fca5a5; line-height: 1.6; margin: 0;">
      Please complete payment in your portal within <strong>36 hours</strong> so your live website is not disconnected.
    </p>`,
    'Pay Now in Portal',
    portalUrl
  );
  return sendResendEmail(to, `Payment Failed: ${businessName} will go offline in 36 hours`, html);
}

export async function sendSiteSuspendedEmail(options: {
  to: string;
  name: string;
  businessName: string;
  amountNgn: number;
  portalUrl: string;
}): Promise<boolean> {
  const { to, name, businessName, amountNgn, portalUrl } = options;
  const html = wrapBillingEmail(
    'Website Temporarily Disconnected',
    `<p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0 0 16px;">
      Hello <strong>${escapeHtml(name)}</strong>, because the monthly renewal of <strong>&#8358;${amountNgn.toLocaleString()}</strong> for <strong>${escapeHtml(businessName)}</strong> remained unpaid after 36 hours, your live website has been disconnected.
    </p>
    <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin: 0;">
      Click below to reactivate billing and your website will come right back online.
    </p>`,
    'Reactivate Website',
    portalUrl
  );
  return sendResendEmail(to, `Website Offline: Reactivate ${businessName}`, html);
}

export async function sendAdminBillingAlertEmail(options: {
  clientName: string;
  clientEmail: string;
  businessName: string;
  amountNgn: number;
  stage: 'overdue' | 'suspended';
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'boluwatifeadesola9@gmail.com';
  const { clientName, clientEmail, businessName, amountNgn, stage } = options;
  const title =
    stage === 'suspended'
      ? `Site Auto-Disconnected: ${businessName}`
      : `Client Payment Overdue: ${businessName}`;
  const html = wrapBillingEmail(
    title,
    `<p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0 0 12px;">
      <strong>Client:</strong> ${escapeHtml(clientName)} (${escapeHtml(clientEmail)})<br/>
      <strong>Project:</strong> ${escapeHtml(businessName)}<br/>
      <strong>Amount:</strong> &#8358;${amountNgn.toLocaleString()}/mo<br/>
      <strong>Status:</strong> ${stage === 'suspended' ? 'Unpaid after 36h — is_live set to FALSE' : 'Renewal charge failed — 36h grace period started'}
    </p>`
  );
  return sendResendEmail(adminEmail, `[aB Labs Billing] ${title}`, html);
}

export async function sendBillingRenewalReceiptEmail(options: {
  to: string;
  name: string;
  businessName: string;
  amountNgn: number;
  nextBillingDate: Date;
  portalUrl: string;
}): Promise<boolean> {
  const { to, name, businessName, amountNgn, nextBillingDate, portalUrl } = options;
  const formattedNext = nextBillingDate.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
  const html = wrapBillingEmail(
    'Monthly Renewal Confirmed',
    `<p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0 0 16px;">
      Hello <strong>${escapeHtml(name)}</strong>, your monthly payment of <strong>&#8358;${amountNgn.toLocaleString()}</strong> for <strong>${escapeHtml(businessName)}</strong> is confirmed and your website remains live.
    </p>
    <p style="font-size: 13px; color: #34d399; margin: 0;">
      Next billing date: <strong>${escapeHtml(formattedNext)}</strong>
    </p>`,
    'View Billing in Portal',
    portalUrl
  );
  return sendResendEmail(to, `Receipt: ${businessName} renewed until ${formattedNext}`, html);
}
