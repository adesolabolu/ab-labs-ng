import React, { Suspense } from 'react';
import PortalLoader from '@/components/PortalLoader';

export const metadata = {
  title: 'Client Portal | aB Labs',
  description: 'Manage your website build, brand assets, and live domain status.',
};

export default function PortalPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <PortalLoader />
    </Suspense>
  );
}
