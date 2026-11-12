export interface DomainExtension {
  ext: string;
  name: string;
  category: string;
  badge?: string;
}

export const SUPPORTED_DOMAIN_EXTENSIONS: DomainExtension[] = [
  { ext: '.com.ng', name: '.com.ng', category: 'Commercial (Nigeria)', badge: 'Popular' },
  { ext: '.name.ng', name: '.name.ng', category: 'Personal & Creators' },
  { ext: '.online', name: '.online', category: 'Modern Brands & Tech' },
  { ext: '.store', name: '.store', category: 'E-Commerce & Retail' },
  { ext: '.website', name: '.website', category: 'General Business' },
  { ext: '.site', name: '.site', category: 'Digital Flagship' },
  { ext: '.live', name: '.live', category: 'Media & Real-Time' },
  { ext: '.space', name: '.space', category: 'Studios & Creatives' },
  { ext: '.lol', name: '.lol', category: 'Culture & Entertainment' },
];
