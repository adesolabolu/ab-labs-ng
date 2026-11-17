import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getClientSession, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getClientSession();
    if (!session?.clientId) {
      return NextResponse.json({ success: false, error: 'Please sign in again.' }, { status: 401 });
    }

    const body = await req.json();
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';
    const confirmPassword = typeof body?.confirmPassword === 'string' ? body.confirmPassword : '';

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(newPassword);
    await sql`
      UPDATE clients
      SET password_hash = ${passwordHash}
      WHERE id = ${session.clientId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Your password has been updated.',
    });
  } catch (error: any) {
    console.error('Error updating client password:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Could not update password.' },
      { status: 500 }
    );
  }
}
