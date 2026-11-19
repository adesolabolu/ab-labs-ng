export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  url: string;
  ctaLabel: string;
  embeddable?: boolean;
  isPlaceholder?: boolean;
}

export const RESOURCES: ResourceItem[] = [
  {
    id: 'streamradar',
    slug: 'streamradar',
    title: 'StreamRadar — Real-Time Live Stream Alerts',
    category: 'Live App · aB Labs',
    description:
      'Instant push alerts the second a creator goes live, plus milestone tracking and top supporter recaps.',
    url: 'https://live.ab-labs.cv',
    ctaLabel: 'Open Resource',
    embeddable: true,
  },
  {
    id: 'tts-live-studio',
    slug: 'tts-live-studio',
    title: 'TTS Live Studio — Free Text-to-Speech for Live Streamers',
    category: 'Live App · aB Labs',
    description:
      'Free Windows desktop app that reads your live stream chat aloud in natural offline voices. Built for TikTok Live Studio.',
    url: 'https://tts.ab-labs.cv',
    ctaLabel: 'Open Resource',
    embeddable: true,
  },
  {
    id: 'domain-payments-guide',
    slug: 'domain-payments-guide',
    title: 'Domain & Paystack Setup Reference',
    category: 'Sample Resource',
    description:
      'Placeholder card — quick overview of .com.ng domain registration, SSL security, and automated Paystack checkout.',
    url: '/contact-us',
    ctaLabel: 'Open Resource',
    embeddable: false,
    isPlaceholder: true,
  },
];
