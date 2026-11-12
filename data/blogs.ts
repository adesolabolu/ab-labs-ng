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
        },
        {
          heading: 'Your Site Loads Before the Customer Blinks',
          paragraphs: [
            'Old WordPress sites query a database on every single page visit. When traffic spikes during a promo or after an Instagram post, the database gets overwhelmed and the site either crawls or shows a white error screen.',
            'Modern websites are compiled ahead of time and served from a global network of servers. The page a customer in Surulere sees is already built and waiting for them, so it appears instantly no matter how many people visit at once.'
          ],
          keyTakeaway: 'A website that goes down during your busiest sales period costs more than the money you saved by building it cheaply.'
        },
        {
          heading: 'You Keep Full Ownership of Your Files',
          paragraphs: [
            'With a traditional site, your files, database, and email all live inside one hosting account. If that host raises prices, gets acquired, or disappears, you are stuck. Exporting a WordPress database and getting it working somewhere else is rarely a smooth process.',
            'When your site is built as a clean modern codebase, the entire thing is just a folder of files you own. It can be moved to any host in minutes, and there is no database to export or repair.'
          ]
        },
        {
          heading: 'What Actually Happens When You Migrate',
          paragraphs: [
            'We inventory every page and image on your old site, then rebuild them in the new structure. Your existing Google rankings are preserved by keeping the same URLs, or by adding redirects from old links to new ones so visitors and search engines never hit a dead page.',
            'The old site usually stays live in the background for two weeks while we compare traffic and fix anything that looks off. No downtime, no lost customers.'
          ]
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
        },
        {
          heading: 'The Tell-Tale Signs of a Generated Website',
          paragraphs: [
            'AI tools leave fingerprints. Fake statistics with no source. Paragraphs that repeat the same idea three different ways. Placeholder names like "John Doe" or "Your Company" buried on an inner page. Stock photos of people who clearly work in an office in another country.',
            'Serious clients may not be able to describe exactly what feels wrong, but they feel it. The reaction is a polite "let me get back to you" that never comes.'
          ],
          keyTakeaway: 'Trust is lost in the first five seconds and is very hard to win back. A cheap-looking site quietly filters out your highest-paying customers.'
        },
        {
          heading: 'Real Photos Beat Perfect Photos',
          paragraphs: [
            'One honest photo of your actual shop, your actual team, or your actual product does more for trust than ten polished stock images. Nigerian buyers are excellent at spotting pictures that do not belong to the business.',
            'A slightly imperfect photo taken on a decent phone in your real location beats a flawless photo of a business that is clearly not yours.'
          ]
        },
        {
          heading: 'What Good Design Actually Costs You',
          paragraphs: [
            'Professional design is not decoration. It is the difference between a visitor believing you will still be in business next year and a visitor closing the tab to look for a competitor who looks established.',
            'If you are selling a service worth hundreds of thousands of naira, a client deciding whether to trust you with that money deserves to see a site that looks like you handle money carefully.'
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
          ],
          codeOrMetric: {
            label: 'Recovered Orders',
            value: '3 in 10',
            description: 'Roughly three out of every ten failed card payments can be recovered when a transfer option is offered on the same screen.'
          }
        },
        {
          heading: 'Never Send Customers to a Different Page to Pay',
          paragraphs: [
            'The most expensive mistake is closing the checkout and sending the customer a bank account number on WhatsApp. By the time they switch apps, find their bank, and type the details, the urgency is gone. Many simply forget.',
            'Keeping the payment step inside your checkout means the basket, the amount, and the order are all already recorded. There is nothing left to retype.'
          ]
        },
        {
          heading: 'Handle the "I Have Paid" Moment Gracefully',
          paragraphs: [
            'A customer who has just sent money wants confirmation, not silence. Your checkout should show a clear "payment received" state and automatically email a receipt.',
            'For transfers that take a minute to reflect, show an honest pending screen with your support number rather than an error. An error screen after a real payment creates panic and a refund request.'
          ],
          keyTakeaway: 'The payment page is where trust is either confirmed or broken. Treat the failed-payment path as carefully as the successful one.'
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
          ],
          codeOrMetric: {
            label: 'Data Per Visit',
            value: '< 400 KB',
            description: 'A well-built business page should cost less than half a megabyte, so visitors on limited data do not hesitate to open it.'
          }
        },
        {
          heading: 'Images Are Almost Always the Problem',
          paragraphs: [
            'A single photo straight off a phone camera can be 5 MB. Put eight of those on your homepage and the page now needs 40 MB before it appears. That is a large chunk of someone\'s data bundle for one visit.',
            'Resizing and converting to modern formats can shrink the same photo by more than 90% with no visible difference on a phone screen.'
          ]
        },
        {
          heading: 'What You Can Check Yourself Today',
          paragraphs: [
            'Open your site on your phone using mobile data, not office WiFi. Count how long until the main headline appears. If you are past three seconds, you are losing visitors before they read a word.',
            'Then run your URL through PageSpeed Insights from Google. Look at the mobile score and the largest image it flags. That image is usually the single easiest fix.'
          ]
        },
        {
          heading: 'Speed Is a Ranking Factor, Not Just a Comfort',
          paragraphs: [
            'Google measures how quickly real users experience your page on mobile. Sites that consistently load slowly get pushed down, especially for competitive local searches.',
            'This means a fast site earns you more free traffic and more completed orders from the same amount of marketing effort.'
          ],
          keyTakeaway: 'Every extra second of load time costs you real customers on Nigerian mobile data. Speed is not a technical nicety, it is revenue.'
        }
      ]
    }
  },
  {
    id: '9',
    slug: 'how-much-should-a-business-website-cost-in-nigeria',
    title: 'How Much Should a Real Business Website Cost in Nigeria?',
    subtitle: 'What you are actually paying for, what is too cheap, and how to spot a quote that will cost you twice.',
    category: 'Website Tips',
    categorySlug: 'web-strategy',
    date: 'Nov 04, 2026',
    readTime: '7 min read',
    author: {
      name: 'Amina Bello',
      role: 'Growth Specialist, aB Labs',
      initials: 'AB'
    },
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Website prices in Nigeria range from fifteen thousand naira to several million. Here is what separates a cheap template that breaks from a site that actually brings customers.',
    content: {
      lead: 'Ask five different people what a website costs and you will get five wildly different answers. The confusion is reasonable, because "a website" can mean anything from a single page with your phone number to a full ecommerce system with inventory, payments, and delivery tracking.',
      sections: [
        {
          heading: 'The Three Real Price Brackets',
          paragraphs: [
            'Under one hundred thousand naira, you are generally buying a pre-made template with your logo dropped on top. That is not automatically bad, and for a brand new business it can be a sensible first step. But nothing about the structure, the wording, or the speed is tailored to your customers.',
            'Between roughly two hundred thousand and eight hundred thousand naira is where real business websites live. You get a considered structure, pages for each service, proper mobile design, payment integration, working contact flows, and someone accountable when something breaks.',
            'Above that you are paying for complexity: custom booking systems, multi-vendor marketplaces, dashboards, or heavy brand work. That is a genuine software project, and it should be quoted like one.'
          ],
          keyTakeaway: 'Price is only meaningful next to scope. A cheap quote for a five-service business site is usually cheap because the work was not done.'
        },
        {
          heading: 'What You Are Actually Paying For',
          paragraphs: [
            'You are not paying for pixels. You are paying for someone to decide which of your services deserve their own page, how the enquiry flow should work on a phone, how fast the site loads on mobile data, and how payment recovers when a card fails.',
            'You are also paying for the boring parts nobody mentions in the sales call: setting up redirects so old links keep working, configuring business email correctly so messages do not land in spam, and making sure your site appears properly when someone shares it on WhatsApp.'
          ]
        },
        {
          heading: 'Warning Signs in a Quote',
          paragraphs: [
            'Watch out for quotes with no page count, no mention of mobile, and a delivery date measured in days. Watch for "free hosting forever" with no explanation of who owns the domain, because the domain is the one thing you must always own in your own name.',
            'The most expensive quote is the one that does not mention who maintains the site after launch. A site with no owner becomes a site nobody can fix six months later.'
          ]
        },
        {
          heading: 'How to Compare Two Quotes Fairly',
          paragraphs: [
            'Write down your actual requirements before you speak to anyone: how many services, whether you need to take payments, whether you need a booking system, and who will update content.',
            'Then ask each person to price the same list, in writing, with the same deliverables. Two quotes with different scopes are not comparable, no matter how different the numbers look. The moment scope is equal, the difference in price finally tells you something real.'
          ]
        },
        {
          heading: 'Think About Return Instead of Cost',
          paragraphs: [
            'A website that brings in two extra clients a month at two hundred thousand naira each has paid for itself many times over within a year. A cheaper site that brings nobody is infinitely more expensive.',
            'The question is not "what is the smallest amount I can spend." It is "what does this site need to do for the business to earn back its cost, and how quickly."'
          ],
          keyTakeaway: 'Measure a website against the customers it brings in, not against the invoice you paid once.'
        }
      ]
    }
  },
  {
    id: '10',
    slug: 'whatsapp-business-catalog-vs-a-real-website',
    title: 'WhatsApp Catalogue or a Real Website: What Should You Use?',
    subtitle: 'WhatsApp is where Nigerian customers actually talk. It is not where they find you. Here is how the two work together.',
    category: 'Getting More Sales',
    categorySlug: 'conversion',
    date: 'Oct 31, 2026',
    readTime: '6 min read',
    author: {
      name: 'Amina Bello',
      role: 'Growth Specialist, aB Labs',
      initials: 'AB'
    },
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Many businesses now run entirely on WhatsApp. It builds trust fast, but it barely gets discovered on Google and cannot scale past one person answering messages.',
    content: {
      lead: 'If you ask a Nigerian small business where they sell, most will say WhatsApp. It is familiar, it is free, and customers trust a human voice on the other end. But relying on it alone quietly caps how large the business can grow.',
      sections: [
        {
          heading: 'What WhatsApp Does Extremely Well',
          paragraphs: [
            'WhatsApp is unmatched for closing a sale once somebody is already interested. A customer can ask a question, you can send a photo, and payment details arrive in one thread. There is no learning curve for either side.',
            'It also carries social proof. A customer who sees their friend\'s number on your profile trusts you faster than they trust any website.'
          ]
        },
        {
          heading: 'Where It Quietly Fails You',
          paragraphs: [
            'Nobody searches WhatsApp for "caterer in Lekki." Customers search Google or Instagram. Without a website, every single new customer must arrive through something you paid for or someone else recommended.',
            'A catalogue also has no structure. There are no categories, no filters, no way to compare two products side by side, and no record of what was viewed before the enquiry. You are answering the same questions all day instead of letting the site answer them.'
          ],
          keyTakeaway: 'WhatsApp converts interest you already have. A website creates interest you did not have.'
        },
        {
          heading: 'The Problems Nobody Mentions',
          paragraphs: [
            'If your number is tied to one phone and that phone is lost, your entire sales channel disappears with it. Business accounts can be reported or restricted, and appeals can take days.',
            'There is also a hard limit: one person can only hold a few conversations at once. Ten simultaneous customers is manageable. Fifty is not. Growth shows up as unanswered messages, which is the most expensive place to have a bottleneck.'
          ]
        },
        {
          heading: 'How They Should Work Together',
          paragraphs: [
            'Your website is the shopfront: products, prices, delivery terms, and a clear story that makes sense to someone who has never heard of you. Google can index it, and you can link to it in every post.',
            'WhatsApp is the counter. Once a customer on the site has seen what they need, a single button opens a chat with the exact product already mentioned. The site does the explaining so the chat can focus on closing.'
          ],
          codeOrMetric: {
            label: 'Pre-Qualified Chats',
            value: '2x faster',
            description: 'Conversations that start from a product page close roughly twice as fast because the customer already knows the price and details.'
          }
        },
        {
          heading: 'What to Do This Week',
          paragraphs: [
            'Put your website link in your WhatsApp Business profile, your Instagram bio, and your Google Business Profile. Then add a WhatsApp button to every product page that opens with the product name already typed in.',
            'That single change turns your site from a brochure into a lead-generating machine, without replacing the channel your customers already trust.'
          ]
        }
      ]
    }
  },
  {
    id: '11',
    slug: 'google-business-profile-photos-that-actually-get-calls',
    title: 'The Google Business Profile Photos That Actually Get You Calls',
    subtitle: 'Which pictures convince a nearby customer to tap "Call" and which ones quietly send them to a competitor.',
    category: 'Google & SEO',
    categorySlug: 'local-seo',
    date: 'Oct 24, 2026',
    readTime: '5 min read',
    author: {
      name: 'Tunde Alabi',
      role: 'Head of Web Development, aB Labs',
      initials: 'TA'
    },
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'When someone searches for a business near them, photos are the first thing they judge. Most Nigerian businesses upload the wrong ones and lose the call.',
    content: {
      lead: 'A customer searching "barber near me" sees three businesses side by side. They are not reading your description. They are looking at the photos, and they decide in under three seconds which one looks safe to walk into.',
      sections: [
        {
          heading: 'Lead With the Shopfront, Not the Logo',
          paragraphs: [
            'The first photo should be the outside of your location, taken in daylight, showing the sign and the street. A customer is trying to answer one question: will I be able to find this place and does it look like a real business?',
            'Your logo does not answer that question. A logo panel full of flat graphics makes your profile look like a directory listing rather than a place a human being can walk into.'
          ],
          keyTakeaway: 'The first photo is not branding. It is proof you exist.'
        },
        {
          heading: 'Show People Actually Working',
          paragraphs: [
            'Photos of staff at work beat photos of empty rooms. A customer wants to sense the atmosphere, the professionalism, and whether anyone looks like they know what they are doing.',
            'If you are a service business, show the result: the finished haircut, the plated food, the cleaned car, the completed installation. Before and after pairs work extremely well and are easy to take.'
          ]
        },
        {
          heading: 'Take the Photos on a Phone, Properly',
          paragraphs: [
            'You do not need a professional camera. You need daylight, a steady hand, and a clean space. Turn on the grid, hold the phone level, and take the photo before noon or after four when the light is soft.',
            'Never upload blurry photos, photos taken at night with a weak flash, or photos with a competitor\'s signage in the background. One bad photo drags down the perceived quality of all the others.'
          ]
        },
        {
          heading: 'Keep Them Fresh',
          paragraphs: [
            'Google shows how recently photos were added, and customers notice a profile that has not changed in two years. Add a few new photos every month: new stock, a new staff member, a completed project.',
            'Fresh photos also give Google a reason to show your profile more, since active listings are treated as more reliable than abandoned ones.'
          ]
        },
        {
          heading: 'Tie It Back to Your Website',
          paragraphs: [
            'Every photo should point to a page that expands on it. A photo of a finished project should link to the service page for that project. That is how you turn a Maps impression into a real enquiry.',
            'This is also why your business name, address, and phone number must match exactly between your website and your Google profile. Inconsistency is one of the most common reasons good businesses stay invisible in local search.'
          ]
        }
      ]
    }
  },
  {
    id: '12',
    slug: 'domain-hosting-and-business-email-you-actually-own',
    title: 'Your Domain, Your Hosting, Your Email: Who Owns What?',
    subtitle: 'The quiet ownership mistakes that leave business owners locked out of their own online presence.',
    category: 'Speed & Tech',
    categorySlug: 'engineering',
    date: 'Oct 18, 2026',
    readTime: '6 min read',
    author: {
      name: 'Emeka Nwosu',
      role: 'Payment Systems Lead, aB Labs',
      initials: 'EN'
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Many businesses discover too late that their web designer owns their domain, their hosting, and even their email. Here is how to make sure you are the real owner.',
    content: {
      lead: 'This happens more often than anyone admits. A business pays for a website, the designer sets everything up under their own accounts, and three years later the relationship ends. Suddenly the business cannot access its own domain, its hosting, or its email inbox.',
      sections: [
        {
          heading: 'The Domain Is Your Address, Not a Subscription',
          paragraphs: [
            'Your domain is the one piece of your online presence that no host can take away, provided it is registered in your name. Register it yourself, with your own email address as the registrant contact.',
            'If someone else registered it for you, ask for the registrar login today. Not the DNS records. The actual account. If they hesitate, that is the answer you needed to hear.'
          ],
          keyTakeaway: 'If you do not control the registrar account, you do not own your domain, no matter what you paid.'
        },
        {
          heading: 'Hosting Can Move, Email Cannot Be Recreated',
          paragraphs: [
            'Hosting is replaceable. If a host raises prices or performs poorly, you export your files and move. That is a weekend task. This is why a website built as clean files rather than a locked database is so much easier to move.',
            'Email is different. Years of customer correspondence, invoices, and password resets live in that inbox. Losing access to business email is losing business records. Always use a business email on your own domain, in an account you control, rather than a free address tied to a personal phone number.'
          ]
        },
        {
          heading: 'Business Email Builds Trust Immediately',
          paragraphs: [
            'A message from name@yourbusiness.com lands differently than one from a random Gmail address with numbers in it. For a customer about to send money, that difference matters.',
            'It also protects you when staff change. A shared info@ address can be handed to a new team member, while a personal address walks out of the door with them.'
          ]
        },
        {
          heading: 'A Simple Checklist Before You Pay Anyone',
          paragraphs: [
            'Confirm the domain will be registered in your name, with your email as the contact. Confirm you will receive the registrar and hosting login details at the end of the project. Confirm the business email is set up on your own account, not the designer\'s.',
            'Ask what happens if you want to move hosts in two years. A good answer describes a normal process. A reluctant answer tells you everything.'
          ]
        },
        {
          heading: 'What Proper Handover Looks Like',
          paragraphs: [
            'At the end of a build you should hold: the registrar login, the hosting or deployment account, the domain records, the email admin account, and the source files. Everything should be documented in one short handover note.',
            'If any of those is missing, the project is not finished, no matter how good the site looks today.'
          ]
        }
      ]
    }
  },
  {
    id: '13',
    slug: 'landing-pages-for-instagram-ads-in-nigeria',
    title: 'Stop Sending Instagram Ad Traffic to Your Homepage',
    subtitle: 'A focused landing page can double the results of the exact same ad budget. Here is how to build one.',
    category: 'Getting More Sales',
    categorySlug: 'conversion',
    date: 'Oct 12, 2026',
    readTime: '5 min read',
    author: {
      name: 'Amina Bello',
      role: 'Growth Specialist, aB Labs',
      initials: 'AB'
    },
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Most businesses pay for Instagram ads and then send that expensive traffic to a busy homepage. A single focused page converts far better for the same money.',
    content: {
      lead: 'You spend money to get someone\'s attention on Instagram. They tap your ad because a specific promise caught them. Then they land on your homepage, which talks about everything you do, and they leave.',
      sections: [
        {
          heading: 'The Promise Must Continue After the Tap',
          paragraphs: [
            'An ad about a discounted bridal package should not land on a page listing catering, rentals, and decoration. The customer was sold one thing, and now they cannot find it. That disconnect is where most ad budget is wasted.',
            'A landing page repeats the exact promise from the ad, shows the exact offer, and gives one clear way to act. Nothing else competes for attention.'
          ],
          keyTakeaway: 'Ad traffic is the most expensive traffic you will ever buy. Do not make it go looking for what the ad promised.'
        },
        {
          heading: 'One Page, One Action',
          paragraphs: [
            'Every landing page should have a single action: buy, book, or message. No navigation menu pulling people away, no related products tempting a detour, no newsletter box competing with the main button.',
            'The button should appear more than once down the page, because people decide at different points. Someone convinced by the testimonials should not have to scroll back up to act.'
          ]
        },
        {
          heading: 'What Belongs on the Page',
          paragraphs: [
            'Work through it in the order a hesitant buyer thinks. What is this? Who is it for? What exactly do I get? What does it cost? Can I trust you? What happens after I pay?',
            'Answer those six questions and you have a page that converts. Skip the third and fifth and you have a pretty page that gets scrolled and abandoned.'
          ]
        },
        {
          heading: 'Proof Beats Adjectives',
          paragraphs: [
            'Replace "world-class service" with a photo of the actual result and a quote from a named customer. Replace "affordable prices" with the real price. Vague praise reads as filler, and buyers have learned to ignore it.',
            'Nigerian customers are especially sensitive to hidden costs. Showing the real total, including delivery, before the click removes the single biggest reason people abandon a checkout page.'
          ],
          codeOrMetric: {
            label: 'Typical Lift',
            value: '1.5–2x',
            description: 'Conversion rate improvement commonly seen when a single-purpose landing page replaces a general homepage as the ad destination.'
          }
        },
        {
          heading: 'Test One Thing at a Time',
          paragraphs: [
            'Do not change the headline, the photo, the price, and the button all at once. You will never learn which change helped. Change one element, run it for a week, compare the numbers.',
            'Start with the headline. It is the fastest thing to change and usually the biggest lever, because it decides whether the rest of the page is read at all.'
          ]
        }
      ]
    }
  },
  {
    id: '14',
    slug: 'protecting-your-business-from-payment-disputes',
    title: 'How to Protect Your Business from Payment Disputes',
    subtitle: 'Clear records, honest checkout pages, and fast refunds keep small disputes from becoming lost revenue.',
    category: 'Payments & Checkout',
    categorySlug: 'payments',
    date: 'Sep 30, 2026',
    readTime: '6 min read',
    author: {
      name: 'Emeka Nwosu',
      role: 'Payment Systems Lead, aB Labs',
      initials: 'EN'
    },
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'A payment dispute can freeze funds and damage your standing with your payment provider. Most disputes are preventable with a few habits at checkout.',
    content: {
      lead: 'Every business that accepts card payments will eventually meet a customer who disputes a charge. It might be a genuine misunderstanding, a family member who used the card, or someone trying to get a free product. How you handle it determines whether it costs you one order or your whole payment account.',
      sections: [
        {
          heading: 'Make the Charge Unmistakable',
          paragraphs: [
            'The most common and most preventable dispute is the one where a customer genuinely does not recognise the charge on their statement. If your business name appears as an unfamiliar string, the customer calls their bank instead of you.',
            'Show your trading name clearly on the checkout page, and make sure it matches how the charge appears. Send a receipt immediately after payment with the amount, the items, and your support contact.'
          ],
          keyTakeaway: 'A dispute is usually a customer who cannot find you, not a customer who wants to cheat you.'
        },
        {
          heading: 'Be Brutally Clear About What They Are Buying',
          paragraphs: [
            'Show the final total including delivery and any fees before the payment step, not after. A customer surprised by a number after paying is a customer who feels tricked, and a tricked customer disputes.',
            'Where delivery is involved, state the expected timeline in plain words: "Lagos mainland, 2 to 3 working days." Vague promises become disputes when the parcel is a day late.'
          ]
        },
        {
          heading: 'Keep Records You Can Actually Produce',
          paragraphs: [
            'If a dispute is raised, the payment provider will ask for evidence: proof of delivery, the customer\'s order details, screenshots of communication. Businesses that cannot produce this within the deadline usually lose automatically.',
            'Store order records with the date, items, amount, delivery address, tracking details, and any chat history. A single organised order record can settle a dispute in minutes.'
          ]
        },
        {
          heading: 'Refund Fast and Refund Honestly',
          paragraphs: [
            'A refund issued quickly is a customer relationship preserved. A refund delayed for weeks is a chargeback, a bad review, and a hit to your provider standing, all at once.',
            'Decide your refund policy in advance and write it where customers can see it. Having the policy visible before purchase removes the argument entirely in most cases.'
          ],
          codeOrMetric: {
            label: 'Preventable Share',
            value: '~70%',
            description: 'Most disputes we see come down to unclear charging names, missing receipts, or surprise fees rather than deliberate fraud.'
          }
        },
        {
          heading: 'Respond, Do Not Ignore',
          paragraphs: [
            'When a dispute lands, respond within the deadline with your evidence and a short, factual explanation. Silence is treated as agreement.',
            'If the dispute is legitimate, refund and move on. Fighting a valid dispute costs more in time and provider goodwill than the order was ever worth.'
          ]
        }
      ]
    }
  }
];
