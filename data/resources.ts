export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  ctaLabel: string;
  embeddable?: boolean;
  isExternal?: boolean;
  isPlaceholder?: boolean;
}

export const RESOURCES: ResourceItem[] = [
  {
    id: 'streamradar',
    title: 'StreamRadar — Real-Time Live Stream Alerts',
    category: 'Live App · aB Labs',
    description:
      'Instant push alerts the second a creator goes live, plus milestone tracking and top supporter recaps.',
    url: 'https://live.ab-labs.cv',
    ctaLabel: 'Open Live Tool',
    embeddable: true,
    isExternal: true,
  },
  {
    id: 'brand-launch-checklist',
    title: 'Website Launch Readiness Checklist',
    category: 'Sample Resource',
    description:
      'Placeholder card — prepare your logo files, brand colors, domain name, and WhatsApp routing before your 36-hour build.',
    url: '/shop',
    ctaLabel: 'Browse Templates',
    embeddable: false,
    isExternal: false,
    isPlaceholder: true,
  },
  {
    id: 'domain-payments-guide',
    title: 'Domain & Paystack Setup Reference',
    category: 'Sample Resource',
    description:
      'Placeholder card — quick overview of .com.ng domain registration, SSL security, and automated Paystack checkout.',
    url: '/contact-us',
    ctaLabel: 'Ask Our Team',
    embeddable: false,
    isExternal: false,
    isPlaceholder: true,
  },
];
