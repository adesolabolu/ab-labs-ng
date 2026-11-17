import sql from '@/lib/db';
import { getTemplateWithPricing } from '@/lib/template-pricing';

/**
 * Saves a reusable Paystack card authorization and customer code onto a client record.
 * Only reusable authorizations (cards) are stored for automated monthly renewals.
 */
export async function saveClientAuthorizationFromPaystack(clientId: string, paystackData: any) {
  if (!clientId || !paystackData) return { saved: false };

  const auth = paystackData.authorization;
  const customerCode = paystackData.customer?.customer_code || null;

  if (!auth?.reusable || !auth?.authorization_code) {
    if (customerCode) {
      await sql`
        UPDATE clients
        SET paystack_customer_code = COALESCE(${customerCode}, paystack_customer_code)
        WHERE id = ${clientId}
      `;
    }
    return { saved: false, customerCode };
  }

  const last4 = auth.last4 ? String(auth.last4) : null;
  const brand = auth.card_type || auth.brand || null;

  await sql`
    UPDATE clients
    SET paystack_customer_code = COALESCE(${customerCode}, paystack_customer_code),
        paystack_authorization_code = ${String(auth.authorization_code)},
        card_last4 = ${last4},
        card_brand = ${brand}
    WHERE id = ${clientId}
  `;

  return {
    saved: true,
    authorizationCode: String(auth.authorization_code),
    customerCode,
    last4,
    brand,
  };
}

/**
 * Refunds a small card-verification charge (e.g. ₦50) after saving the card authorization.
 */
export async function refundVerificationCharge(reference: string, secretKey: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.paystack.co/refund', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transaction: reference }),
    });
    const data = await res.json();
    return Boolean(data?.status);
  } catch (err) {
    console.error('[Paystack Refund] Verification refund failed:', err);
    return false;
  }
}

/**
 * Fetches an existing Paystack Plan for the given monthly NGN amount or creates one via Paystack API.
 * Ensures only the monthly maintenance amount appears in Paystack Recurring Plans.
 */
export async function getOrCreatePaystackPlan(amountNgn: number, secretKey: string): Promise<string> {
  const cleanAmount = Math.round(Number(amountNgn));
  if (!Number.isFinite(cleanAmount) || cleanAmount <= 0) {
    throw new Error('Invalid monthly plan amount');
  }

  const existing = (await sql`
    SELECT plan_code FROM paystack_plans WHERE amount_ngn = ${cleanAmount} LIMIT 1
  `) as any[];

  if (existing.length > 0 && existing[0].plan_code) {
    return String(existing[0].plan_code);
  }

  const planName = `aB Labs Monthly Maintenance (₦${cleanAmount.toLocaleString()}/mo)`;
  const res = await fetch('https://api.paystack.co/plan', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: planName,
      interval: 'monthly',
      amount: cleanAmount * 100, // kobo
      currency: 'NGN',
    }),
  });

  const data = await res.json();
  if (!data?.status || !data?.data?.plan_code) {
    throw new Error(data?.message || 'Failed to create Paystack plan');
  }

  const planCode = String(data.data.plan_code);
  await sql`
    INSERT INTO paystack_plans (amount_ngn, plan_code, name)
    VALUES (${cleanAmount}, ${planCode}, ${planName})
    ON CONFLICT (amount_ngn) DO UPDATE SET plan_code = EXCLUDED.plan_code
  `;

  return planCode;
}

/**
 * Activates recurring monthly maintenance billing for a client once their site is live.
 * - Outright clients are marked `outright`.
 * - Clients without a saved card authorization are marked `awaiting_card` with a scheduled `next_billing_date`.
 * - Clients with a saved card authorization get a live Paystack Subscription created on their monthly plan.
 */
export async function activateClientSubscription(
  clientId: string,
  options?: { markLive?: boolean }
) {
  const rows = (await sql`
    SELECT * FROM clients WHERE id = ${clientId} LIMIT 1
  `) as any[];

  if (rows.length === 0) {
    throw new Error('Client not found');
  }

  const client = rows[0];
  const planTypeUpper = String(client.plan_type || '').toUpperCase();

  if (planTypeUpper === 'OUTRIGHT') {
    await sql`
      UPDATE clients
      SET billing_status = 'outright',
          build_phase = CASE WHEN ${Boolean(options?.markLive)} THEN 4 ELSE build_phase END
      WHERE id = ${clientId}
    `;
    return { status: 'outright', message: 'Outright client has no recurring fees.' };
  }

  if (client.paystack_subscription_code) {
    return {
      status: 'active',
      subscriptionCode: client.paystack_subscription_code,
      planCode: client.paystack_plan_code,
    };
  }

  // Resolve authoritative monthly maintenance fee
  let monthlyAmount = Number(client.monthly_amount_ngn || 0);
  if (!monthlyAmount && client.template_slug) {
    const tpl = await getTemplateWithPricing(client.template_slug);
    monthlyAmount = Number(tpl?.monthlyNgn || 5000);
  }
  if (!monthlyAmount) monthlyAmount = 5000;

  // Determine start date: +30 days if Month 1 was already paid upfront (MONTHLY_PACKAGE), else now
  let startDate: Date = client.next_billing_date ? new Date(client.next_billing_date) : new Date();
  if (!client.next_billing_date && planTypeUpper === 'MONTHLY_PACKAGE') {
    startDate = new Date();
    startDate.setDate(startDate.getDate() + 30);
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const isLiveKey = secretKey && !secretKey.includes('placeholder');

  if (!client.paystack_authorization_code || !client.paystack_customer_code || !isLiveKey) {
    await sql`
      UPDATE clients
      SET billing_status = 'awaiting_card',
          monthly_amount_ngn = ${monthlyAmount},
          next_billing_date = ${startDate},
          build_phase = CASE WHEN ${Boolean(options?.markLive)} THEN 4 ELSE build_phase END
      WHERE id = ${clientId}
    `;
    return {
      status: 'awaiting_card',
      monthlyAmount,
      nextBillingDate: startDate.toISOString(),
      message: 'Site marked live. Client can add a card in /portal for automated monthly billing.',
    };
  }

  const planCode = await getOrCreatePaystackPlan(monthlyAmount, secretKey);

  const subRes = await fetch('https://api.paystack.co/subscription', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer: client.paystack_customer_code,
      plan: planCode,
      authorization: client.paystack_authorization_code,
      start_date: startDate.toISOString(),
    }),
  });

  const subData = await subRes.json();
  if (!subData?.status || !subData?.data?.subscription_code) {
    throw new Error(subData?.message || 'Failed to create Paystack subscription');
  }

  const subCode = String(subData.data.subscription_code);
  const emailToken = subData.data.email_token ? String(subData.data.email_token) : null;
  const nextPayment = subData.data.next_payment_date
    ? new Date(subData.data.next_payment_date)
    : startDate;

  await sql`
    UPDATE clients
    SET paystack_plan_code = ${planCode},
        paystack_subscription_code = ${subCode},
        paystack_email_token = ${emailToken},
        monthly_amount_ngn = ${monthlyAmount},
        billing_status = 'active',
        next_billing_date = ${nextPayment},
        build_phase = CASE WHEN ${Boolean(options?.markLive)} THEN 4 ELSE build_phase END
    WHERE id = ${clientId}
  `;

  return {
    status: 'active',
    subscriptionCode: subCode,
    planCode,
    monthlyAmount,
    nextBillingDate: nextPayment.toISOString(),
  };
}
