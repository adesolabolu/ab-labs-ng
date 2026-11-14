import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getActiveVisitors } from '@/lib/presence';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch active visitors in the last 3 minutes
    const activeVisitors = getActiveVisitors();

    // 2. Fetch all registered client accounts from database
    const clients = await sql`
      SELECT 
        id,
        email,
        name,
        phone,
        business_name,
        domain_name,
        domain_status,
        domain_expiry_date,
        template_slug,
        plan_type,
        monthly_status,
        portal_access_token,
        build_phase,
        created_at
      FROM clients
      ORDER BY created_at DESC
    `;

    // 3. Count signed-in visitors among active sessions
    const activeClients = activeVisitors.filter((v) => v.isLoggedIn || !!v.clientEmail);
    const activeGuests = activeVisitors.filter((v) => !v.isLoggedIn && !v.clientEmail);

    return NextResponse.json({
      success: true,
      stats: {
        activeOnlineCount: activeVisitors.length,
        activeClientsCount: activeClients.length,
        activeGuestsCount: activeGuests.length,
        totalRegisteredClients: clients.length,
      },
      activeVisitors,
      clients,
    });
  } catch (error: any) {
    console.error('Error fetching admin user activity:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
