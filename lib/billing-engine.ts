import sql from '@/lib/db';
import {
  sendAdminBillingAlertEmail,
  sendBillingOverdueWarningEmail,
  sendBillingReminderEmail,
  sendBillingRenewalReceiptEmail,
  sendSiteSuspendedEmail,
} from '@/lib/email';

/**
 * Adds `months` calendar months to `anchor`, clamping the day of month
 * (e.g. Jan 31 + 1 month -> Feb 28/29).
 */
export function addMonthsClamped(anchor: Date, months: number): Date {
  const result = new Date(anchor.getTime());
  const targetDay = anchor.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDayOfTargetMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)
  ).getUTCDate();
  result.setUTCDate(Math.min(targetDay, lastDayOfTargetMonth));
  return result;
}

/**
 * Advances `anchorDate` by 1-month intervals until it is strictly after `now`.
 * Ensures reactivating a suspended project keeps its original monthly cycle day.
 */
export function computeNextAnchoredDate(anchorDate: Date, now: Date = new Date()): Date {
  let step = 1;
  let candidate = addMonthsClamped(anchorDate, step);
  while (candidate.getTime() <= now.getTime() && step < 120) {
    step += 1;
    candidate = addMonthsClamped(anchorDate, step);
  }
  return candidate;
}

/**
 * Marks a project live and sets/advances its anchored next_billing_date upon Paystack confirmation.
 */
export async function activateProjectBilling(projectId: string, clientId: string) {
  const rows = (await sql`
    SELECT id, billing_anchor_date
    FROM client_projects
    WHERE id = ${projectId} AND client_id = ${clientId}
    LIMIT 1
  `) as any[];

  const now = new Date();
  const anchor = rows[0]?.billing_anchor_date ? new Date(rows[0].billing_anchor_date) : now;
  const nextBilling = computeNextAnchoredDate(anchor, now);

  await sql`
    UPDATE client_projects
    SET
      is_live = true,
      billing_status = 'active',
      billing_anchor_date = COALESCE(billing_anchor_date, ${anchor.toISOString()}),
      next_billing_date = ${nextBilling.toISOString()},
      grace_started_at = NULL,
      retry_count = 0,
      last_retry_at = NULL,
      last_reminder_stage = NULL
    WHERE id = ${projectId} AND client_id = ${clientId}
  `;

  await sql`
    UPDATE clients
    SET
      is_live = true,
      billing_status = 'active',
      monthly_status = 'ACTIVE',
      billing_anchor_date = COALESCE(billing_anchor_date, ${anchor.toISOString()}),
      next_billing_date = ${nextBilling.toISOString()}
    WHERE id = ${clientId}
  `;

  return { nextBillingDate: nextBilling.toISOString(), anchorDate: anchor.toISOString() };
}

async function chargeSavedAuthorization(params: {
  email: string;
  amountNgn: number;
  authorizationCode: string;
  clientId: string;
  projectId: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecretKey || paystackSecretKey.includes('placeholder')) {
    return { ok: false, reason: 'Paystack key not configured' };
  }

  try {
    const res = await fetch('https://api.paystack.co/transaction/charge_authorization', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        amount: Math.round(params.amountNgn * 100),
        authorization_code: params.authorizationCode,
        metadata: {
          type: 'monthly_renewal',
          clientId: params.clientId,
          projectId: params.projectId,
        },
      }),
    });
    const data = await res.json();
    if (res.ok && data?.status && data?.data?.status === 'success') {
      return { ok: true };
    }
    return { ok: false, reason: data?.data?.gateway_response || data?.message || 'Charge declined' };
  } catch (err: any) {
    return { ok: false, reason: err?.message || 'Network error' };
  }
}

export interface BillingTickSummary {
  checked: number;
  remindersSent: number;
  chargesSucceeded: number;
  chargesFailed: number;
  suspended: number;
}

/**
 * Runs a single sweep across all active/past_due monthly projects:
 * - Sends 7d, 3d, 1d pre-due reminder emails
 * - Retries saved card up to 4x/day (every ~5.5h) on due date
 * - Alerts client + admin on first failure & starts 36h grace timer
 * - Disconnects live site (is_live = false) after 36h unpaid
 */
export async function processMonthlyBillingTick(): Promise<BillingTickSummary> {
  const summary: BillingTickSummary = {
    checked: 0,
    remindersSent: 0,
    chargesSucceeded: 0,
    chargesFailed: 0,
    suspended: 0,
  };

  const rows = (await sql`
    SELECT
      p.id AS project_id,
      p.client_id,
      p.business_name,
      p.domain_name,
      p.plan_type,
      p.billing_status,
      p.billing_anchor_date,
      p.next_billing_date,
      p.grace_started_at,
      p.retry_count,
      p.last_retry_at,
      p.last_reminder_stage,
      p.monthly_amount_ngn,
      c.email,
      c.name,
      c.portal_access_token,
      c.paystack_authorization_code
    FROM client_projects p
    JOIN clients c ON c.id = p.client_id
    WHERE UPPER(COALESCE(p.plan_type, '')) != 'OUTRIGHT'
      AND p.billing_status IN ('active', 'past_due')
      AND p.next_billing_date IS NOT NULL
  `) as any[];

  const now = new Date();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ng.ab-labs.cv';

  for (const row of rows) {
    summary.checked += 1;
    const due = new Date(row.next_billing_date);
    const amountNgn = Number(row.monthly_amount_ngn || 5000);
    const businessName = row.business_name || row.domain_name || 'Your Website';
    const portalUrl = row.portal_access_token
      ? `${baseUrl}/portal?token=${row.portal_access_token}`
      : `${baseUrl}/portal`;

    if (now.getTime() < due.getTime()) {
      // Pre-due reminder window (7d, 3d, 1d)
      const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
      const stage = String(row.last_reminder_stage || '');

      let nextStage: '7d' | '3d' | '1d' | null = null;
      let daysLeft = 7;

      if (hoursLeft <= 24 && stage !== '1d') {
        nextStage = '1d';
        daysLeft = 1;
      } else if (hoursLeft <= 72 && hoursLeft > 24 && stage !== '3d' && stage !== '1d') {
        nextStage = '3d';
        daysLeft = 3;
      } else if (hoursLeft <= 168 && hoursLeft > 72 && !['7d', '3d', '1d'].includes(stage)) {
        nextStage = '7d';
        daysLeft = 7;
      }

      if (nextStage) {
        await sendBillingReminderEmail({
          to: row.email,
          name: row.name || 'Client',
          businessName,
          amountNgn,
          dueDate: due,
          daysLeft,
          portalUrl,
        });
        await sql`
          UPDATE client_projects
          SET last_reminder_stage = ${nextStage}
          WHERE id = ${row.project_id}
        `;
        summary.remindersSent += 1;
      }
      continue;
    }

    // Due date reached or passed
    if (row.grace_started_at) {
      const graceHours = (now.getTime() - new Date(row.grace_started_at).getTime()) / (1000 * 60 * 60);
      if (graceHours >= 36) {
        await sql`
          UPDATE client_projects
          SET is_live = false,
              billing_status = 'suspended',
              last_reminder_stage = 'suspended'
          WHERE id = ${row.project_id}
        `;
        await sendSiteSuspendedEmail({
          to: row.email,
          name: row.name || 'Client',
          businessName,
          amountNgn,
          portalUrl,
        });
        await sendAdminBillingAlertEmail({
          clientName: row.name || 'Client',
          clientEmail: row.email,
          businessName,
          amountNgn,
          stage: 'suspended',
        });
        summary.suspended += 1;
        continue;
      }
    }

    const retryCount = Number(row.retry_count || 0);
    const hoursSinceLastRetry = row.last_retry_at
      ? (now.getTime() - new Date(row.last_retry_at).getTime()) / (1000 * 60 * 60)
      : 999;

    // Attempt up to 4 retries spaced ~5.5 hours apart
    if (retryCount < 4 && hoursSinceLastRetry >= 5.5) {
      let paid = false;
      if (row.paystack_authorization_code && amountNgn > 0) {
        const charge = await chargeSavedAuthorization({
          email: row.email,
          amountNgn,
          authorizationCode: row.paystack_authorization_code,
          clientId: row.client_id,
          projectId: row.project_id,
        });
        paid = charge.ok;
      }

      if (paid) {
        const anchor = row.billing_anchor_date ? new Date(row.billing_anchor_date) : due;
        const nextDue = computeNextAnchoredDate(anchor, now);
        await sql`
          UPDATE client_projects
          SET is_live = true,
              billing_status = 'active',
              next_billing_date = ${nextDue.toISOString()},
              grace_started_at = NULL,
              retry_count = 0,
              last_retry_at = ${now.toISOString()},
              last_reminder_stage = NULL
          WHERE id = ${row.project_id}
        `;
        await sendBillingRenewalReceiptEmail({
          to: row.email,
          name: row.name || 'Client',
          businessName,
          amountNgn,
          nextBillingDate: nextDue,
          portalUrl,
        });
        summary.chargesSucceeded += 1;
      } else {
        const isFirstFailure = row.last_reminder_stage !== 'overdue';
        await sql`
          UPDATE client_projects
          SET billing_status = 'past_due',
              grace_started_at = COALESCE(grace_started_at, ${now.toISOString()}),
              retry_count = COALESCE(retry_count, 0) + 1,
              last_retry_at = ${now.toISOString()},
              last_reminder_stage = 'overdue'
          WHERE id = ${row.project_id}
        `;
        if (isFirstFailure) {
          await sendBillingOverdueWarningEmail({
            to: row.email,
            name: row.name || 'Client',
            businessName,
            amountNgn,
            portalUrl,
          });
          await sendAdminBillingAlertEmail({
            clientName: row.name || 'Client',
            clientEmail: row.email,
            businessName,
            amountNgn,
            stage: 'overdue',
          });
        }
        summary.chargesFailed += 1;
      }
    }
  }

  return summary;
}
