import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Premium Website Templates & Web Agency`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f4ef',
    theme_color: '#0c0b0a',
    icons: [
      {
        src: '/assets/6abc9a73889258d54f8515ca_Favicon%20(256x256).png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}

export const dynamic = 'force-static';
