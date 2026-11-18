import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { processMonthlyBillingTick } from '@/lib/billing-engine';

export const dynamic = 'force-dynamic';

async function isAuthorized(req: Request): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization') || '';
  const xCronSecret = req.headers.get('x-cron-secret') || '';

  if (cronSecret && (authHeader === `Bearer ${cronSecret}` || xCronSecret === cronSecret)) {
    return true;
  }

  return await getAdminSession();
}

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const summary = await processMonthlyBillingTick();
  return NextResponse.json({ success: true, summary });
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const summary = await processMonthlyBillingTick();
  return NextResponse.json({ success: true, summary });
}
