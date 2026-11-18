'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientPortalView from '@/components/ClientPortalView';
import type { Template } from '@/data/templates';

export default function PortalLoader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<{
    loading: boolean;
    client: any | null;
    projects: any[];
    template: Template | null;
  }>({
    loading: true,
    client: null,
    projects: [],
    template: null,
  });

  useEffect(() => {
    let active = true;
    const url = token
      ? `/api/portal/me?token=${encodeURIComponent(token)}`
      : '/api/portal/me';

    fetch(url, { cache: 'no-store' })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace('/login?redirect=/portal');
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (!active || !data) return;
        if (data.success && data.client) {
          setState({
            loading: false,
            client: data.client,
            projects: Array.isArray(data.projects) ? data.projects : [],
            template: data.template || null,
          });
        } else {
          router.replace('/login?redirect=/portal');
        }
      })
      .catch(() => {
        if (active) {
          router.replace('/login?redirect=/portal');
        }
      });

    return () => {
      active = false;
    };
  }, [token, router]);

  if (state.loading || !state.client) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#090a0b',
          color: '#a1a1aa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
        }}
      >
        Loading your client portal...
      </div>
    );
  }

  return <ClientPortalView client={state.client} projects={state.projects} template={state.template} />;
}
