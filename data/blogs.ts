export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  categorySlug: 'web-strategy' | 'conversion' | 'payments' | 'local-seo' | 'engineering';
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    initials: string;
  };
  image: string;
  excerpt: string;
  content: {
    lead: string;
    sections: {
      heading: string;
      paragraphs: string[];
      keyTakeaway?: string;
      codeOrMetric?: {
        label: string;
        value: string;
        description: string;
      };
    }[];
  };
}

export const BLOG_CATEGORIES = [
  { id: 'all', label: 'All Guides' },
  { id: 'web-strategy', label: 'Website Tips' },
  { id: 'conversion', label: 'Getting More Sales' },
  { id: 'payments', label: 'Payments & Checkout' },
  { id: 'local-seo', label: 'Google & SEO' },
  { id: 'engineering', label: 'Speed & Tech' }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'why-single-page-websites-hurt-local-seo-nigeria',
    title: 'Why One-Page Websites Lose Customers on Google (And How to Fix It)',
    subtitle: 'How having dedicated pages for each service brings 5x more customer inquiries in Lagos and Abuja.',
    category: 'Website Tips',
    categorySlug: 'web-strategy',
    date: 'Oct 14, 2026',
    readTime: '6 min read',
    author: {
      name: 'Tunde Alabi',
      role: 'Head of Web Development, aB Labs',
      initials: 'TA'
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Having just one long scrolling page makes it difficult for Google to show your business when local customers search in Lagos or Abuja. Here is how having proper pages brings 5x more customer calls.',
    content: {
      lead: 'Many business owners launch a single scrolling website because it seems quick and inexpensive. But after a few months, nobody finds them on Google search, and they spend heavily on ads just to get noticed.',
      sections: [
        {
          heading: 'Why Google Struggles with One-Page Websites',
          paragraphs: [
            'When people search Google in Lagos or Abuja, they search for specific things. Someone looking for "real estate lawyer in Ikeja" wants a page about property law. Someone searching for "company registration" wants a page about business setup.',
            'If your website is just one long page with everything cramped together, Google does not know which keyword to rank you for. Competitors who have a separate page for each service get shown first every single time.'
          ],
          keyTakeaway: 'Google ranks specific pages for specific searches. Cramming 6 different services onto one single page makes Google ignore all of them.'
        },
        {
          heading: 'The Multi-Page Advantage',
          paragraphs: [
            'Giving each of your main services its own clean page lets Google understand exactly what you offer. When a customer searches for that specific service, Google shows your exact page at the top of the results.',
            'Each page can have its own clear phone number, WhatsApp link, and booking form so visitors can contact you immediately.'
          ],
          codeOrMetric: {
            label: 'Customer Inquiry Lift',
            value: '+340%',
            description: 'Average increase in phone calls and inquiries after switching from a single-page site to separate service pages.'
          }
        },
        {
          heading: 'Simple Steps to Fix It',
          paragraphs: [
            'List the top 3 to 5 services your business sells. Create a dedicated page for each one with clear photos, pricing details, and client reviews. Add your business address and phone number on every page so local customers know you are legitimate and close to them.'
          ]
        }
      ]
    }
  },
  {
    id: '2',
    slug: 'speed-to-lead-converting-nigerian-web-traffic-under-5-minutes',
    title: 'How Replying in 5 Minutes on WhatsApp Doubles Your Website Sales',
    subtitle: 'Why fast mobile pages and a direct WhatsApp button turn website visitors into paying clients.',
    category: 'Getting More Sales',
    categorySlug: 'conversion',
    date: 'Oct 10, 2026',
    readTime: '4 min read',
    author: {
      name: 'Amina Bello',
      role: 'Growth Specialist, aB Labs',
      initials: 'AB'
    },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Most website visitors leave if they have to wait for pages to load or fill out long contact forms. Here is how instant WhatsApp buttons and fast-loading mobile sites turn clicks into closed deals.',
    content: {
      lead: 'In Nigeria, business moves fast on WhatsApp. If a prospective customer lands on your website and cannot reach you within 60 seconds, they will click back and call your competitor.',
      sections: [
        {
          heading: 'Why Speed Matters on Nigerian Mobile Networks',
          paragraphs: [
            'Most people visit your site on their phone using mobile data. If your site is heavy and takes more than 3 seconds to open, visitors leave before they even see your products.',
            'A fast website that opens in under one second keeps potential buyers engaged and ready to buy.'
          ],
          codeOrMetric: {
            label: 'Page Speed Goal',
            value: '< 1 Sec',
            description: 'Every aB Labs website template is built to load in under a second on mobile phones in Nigeria.'
          }
        },
        {
          heading: 'Replace Long Forms with 1-Click WhatsApp',
          paragraphs: [
            'Nobody likes filling out long contact forms and waiting 24 hours for an email reply. Adding a direct WhatsApp button with a pre-typed message lets interested clients chat with you immediately while their buying interest is highest.'
          ]
        }
      ]
    }
  },
  {
    id: '3',
    slug: 'building-high-trust-ecommerce-stores-with-paystack-in-2026',
    title: 'How to Stop Customers from Abandoning Their Cart at Checkout',
    subtitle: 'Simple payment setups and trust badges that make shoppers feel safe paying with cards and bank transfers.',
    category: 'Payments & Checkout',
    categorySlug: 'payments',
    date: 'Oct 04, 2026',
    readTime: '5 min read',
    author: {
      name: 'Emeka Nwosu',
      role: 'Payment Systems Lead, aB Labs',
      initials: 'EN'
    },
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Over 70% of online shoppers abandon their order if the checkout looks confusing or card payments fail. Here is how offering bank transfers and clear trust badges boosts your completed orders by 40%.',
    content: {
      lead: 'Selling online in Nigeria requires building trust. If your checkout page looks confusing, or if bank card OTPs fail with no alternative, shoppers will leave and never return.',
      sections: [
        {
          heading: 'Give Buyers Both Card and Bank Transfer Options',
          paragraphs: [
            'Many Nigerian shoppers still prefer paying via instant bank transfer rather than typing their debit card details online. When you use Paystack, customers can pay with card, bank transfer, or USSD code.',
            'If their bank OTP delays, they can simply transfer the money and the order confirms automatically in seconds.'
          ],
          codeOrMetric: {
            label: 'Completed Sales Lift',
            value: '+42%',
            description: 'Increase in successful orders when customers can pay via bank transfer directly at checkout.'
          }
        },
        {
          heading: 'Show Safety and Delivery Badges Clearly',
          paragraphs: [
            'Always show clear delivery times, return policies, and official payment security logos right beside your checkout button. Removing hidden fees and being transparent upfront makes customers confident to pay immediately.'
          ]
        }
      ]
    }
  },
  {
    id: '4',
    slug: 'google-maps-3-pack-playbook-for-lagos-abuja-businesses',
    title: 'How to Rank on the First Page of Google in Lagos & Abuja',
    subtitle: 'The straightforward guide to appearing at the top of Google Maps so nearby customers call you first.',
    category: 'Google & SEO',
    categorySlug: 'local-seo',
    date: 'Sep 28, 2026',
    readTime: '7 min read',
    author: {
      name: 'Tunde Alabi',
      role: 'Head of Web Development, aB Labs',
      initials: 'TA'
    },
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Step-by-step guide to ranking at the top of Google Search and Google Maps so clients in Victoria Island, Ikeja, Lekki, or Abuja call you before your competitors.',
    content: {
      lead: 'When customers in Lagos or Abuja look for a doctor, interior designer, caterer, or property agent, 70% of them tap the top 3 businesses shown on Google Maps. Here is how to make sure your business is one of them.',
      sections: [
        {
          heading: 'Match Your Website and Google Profile Exactly',
          paragraphs: [
            'Google checks your website to verify that your business is real. Your business name, street address, and phone number on your website header and footer must match your Google Business Profile exactly.',
            'When Google sees consistent details across your website and profile, it rewards you with higher rankings in local search.'
          ]
        },
        {
          heading: 'Highlight the Areas You Serve',
          paragraphs: [
            'If you serve clients in Lekki, Ikoyi, Ikeja, or Maitama, mention those locations on your website. Google uses these location mentions to show your business to nearby people searching on their phones.'
          ]
        }
      ]
    }
  },
  {
    id: '5',
    slug: 'nextjs-16-turbopack-vs-wordpress-why-modern-brands-are-migrating',
    title: 'Why Old WordPress Sites Crash and Slow Down (And What to Use Instead)',
    subtitle: 'How modern, clean websites protect your business from plugin hacks, crashes, and sluggish loading.',
    category: 'Speed & Tech',
    categorySlug: 'engineering',
    date: 'Sep 21, 2026',
    readTime: '6 min read',
    author: {
      name: 'Emeka Nwosu',
      role: 'Payment Systems Lead, aB Labs',
      initials: 'EN'
    },
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Old WordPress websites break when plugins update and get hacked easily. Here is why modern, cleanly coded websites protect your business, never crash, and load in under a second.',
    content: {
      lead: 'Many business owners have experienced the frustration of a WordPress site breaking after a plugin update, or getting hacked with spam. Modern websites eliminate those headaches completely.',
      sections: [
        {
          heading: 'No Vulnerable Plugins to Manage',
          paragraphs: [
            'Traditional websites rely on 20 to 30 separate plugins that require constant updates. If one plugin is outdated, hackers can deface your website or crash your store.',
            'Our website templates are built with clean, modern code that does not use messy plugins. Your site stays fast, reliable, and secure 24/7 without ongoing maintenance stress.'
          ],
          codeOrMetric: {
            label: 'Uptime Reliability',
            value: '99.9%',
            description: 'Zero database crashes and zero plugin conflicts on modern static web architectures.'
          }
        }
      ]
    }
  },
  {
    id: '6',
    slug: 'the-death-of-ai-slop-web-design-in-african-tech',
    title: 'Why Cheap AI Websites Scare Away Serious Paying Clients',
    subtitle: 'Why cookie-cutter AI generated websites look fake and how clean, bespoke design makes customers trust you.',
    category: 'Website Tips',
    categorySlug: 'web-strategy',
    date: 'Sep 15, 2026',
    readTime: '5 min read',
    author: {
      name: 'Amina Bello',
      role: 'Growth Specialist, aB Labs',
      initials: 'AB'
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Cheap websites generated by AI tools look fake and amateurish. Serious customers who are about to spend real money want to see professional branding that looks established and trustworthy.',
    content: {
      lead: 'Today, anyone can use an AI tool to generate a website in 5 minutes. But high-paying clients can immediately tell when a site is cheap, and they will hesitate before trusting you with their money.',
      sections: [
        {
          heading: 'Your Website Reflects Your Service Quality',
          paragraphs: [
            'Clients judge your business based on how professional your website looks. If your website has blurry stock photos, generic text, and sloppy layouts, clients assume your service is equally careless.',
            'A clean, well-structured website with crisp typography and real business details gives you the credibility needed to charge premium prices.'
          ]
        }
      ]
    }
  },
  {
    id: '7',
    slug: 'zero-friction-checkout-card-transfer-ussd-stack',
    title: 'How to Never Lose a Sale When Bank Cards Fail at Checkout',
    subtitle: 'Ensuring customers can pay instantly with virtual bank transfers and USSD without leaving your page.',
    category: 'Payments & Checkout',
    categorySlug: 'payments',
    date: 'Sep 08, 2026',
    readTime: '4 min read',
    author: {
      name: 'Emeka Nwosu',
      role: 'Payment Systems Lead, aB Labs',
      initials: 'EN'
    },
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'When bank card OTPs delay or fail in Nigeria, giving customers an instant virtual bank transfer option saves the sale on the spot instead of losing them forever.',
    content: {
      lead: 'Every Nigerian business owner knows that bank card networks can be unpredictable on weekends or evenings. If card payment is your only option, you are losing sales every single week.',
      sections: [
        {
          heading: 'Instant Virtual Account Transfers',
          paragraphs: [
            'With Paystack integrated into your store, when a card transaction fails, the customer is immediately offered a dedicated virtual account number to transfer to. Once they make the transfer from their bank app, the order confirms on screen immediately.'
          ]
        }
      ]
    }
  },
  {
    id: '8',
    slug: 'edge-caching-and-asset-optimization-african-telecoms',
    title: 'How to Make Your Website Open in 1 Second on Any Phone in Nigeria',
    subtitle: 'Fast loading speeds keep customers browsing even on weak 3G and 4G mobile networks.',
    category: 'Speed & Tech',
    categorySlug: 'engineering',
    date: 'Aug 30, 2026',
    readTime: '5 min read',
    author: {
      name: 'Tunde Alabi',
      role: 'Head of Web Development, aB Labs',
      initials: 'TA'
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Even on slow phone data in Lagos traffic, a fast website ensures customers see your products immediately without waiting, leading to higher orders and happier clients.',
    content: {
      lead: 'If your website takes 6 seconds to open on a phone in traffic, prospective clients will tap back to Google and visit someone else. Speed is your biggest competitive advantage.',
      sections: [
        {
          heading: 'Optimized for African Mobile Networks',
          paragraphs: [
            'We compress all images and write clean, lightweight code so your website uses very little mobile data and loads in under a second on MTN, Airtel, and Glo.'
          ]
        }
      ]
    }
  }
];
