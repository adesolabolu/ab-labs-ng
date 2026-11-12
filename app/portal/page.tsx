import React from 'react';
import { redirect } from 'next/navigation';
import sql from '@/lib/db';
import { getClientSession } from '@/lib/auth';
import { TEMPLATES } from '@/data/templates';
import ClientPortalView from '@/components/ClientPortalView';

export const dynamic = 'force-dynamic';

interface PortalPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function PortalPage({ searchParams }: PortalPageProps) {
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams?.token;

  let client: any = null;

  // 1. If 1-Click Magic Token is passed in the URL (from email or WhatsApp)
  if (token) {
    const clientsByToken = await sql`
      SELECT * FROM clients 
      WHERE portal_access_token = ${token}
      LIMIT 1
    `;
    if (clientsByToken.length > 0) {
      client = clientsByToken[0];
    }
  }

  // 2. Otherwise check active session cookie
  if (!client) {
    const session = await getClientSession();
    if (session?.clientId) {
      const clientsById = await sql`
        SELECT * FROM clients 
        WHERE id = ${session.clientId}
        LIMIT 1
      `;
      if (clientsById.length > 0) {
        client = clientsById[0];
      }
    }
  }

  // 3. If still unauthenticated, redirect to customer login
  if (!client) {
    redirect('/login?redirect=/portal');
  }

  const template = TEMPLATES.find((t) => t.slug === client.template_slug) || null;

  return <ClientPortalView client={client} template={template} />;
}
