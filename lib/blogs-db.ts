import sql from '@/lib/db';
import { BLOG_POSTS, type BlogPost } from '@/data/blogs';

/**
 * Single source of truth for Blog Posts & Editorial Guides.
 *
 * Neon PostgreSQL `blog_posts` table is the authoritative database store.
 * Static `BLOG_POSTS` acts as the initial seed and fallback.
 */

let blogsTableInitialized = false;

export async function ensureBlogsTable(): Promise<void> {
  if (blogsTableInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        category TEXT NOT NULL,
        category_slug TEXT NOT NULL,
        date TEXT NOT NULL,
        read_time TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_role TEXT NOT NULL,
        author_initials TEXT NOT NULL,
        image TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content JSONB NOT NULL,
        published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    blogsTableInitialized = true;
  } catch (err) {
    console.error('Error ensuring blog_posts table:', err);
  }
}

export async function seedBlogsIfEmpty(): Promise<void> {
  try {
    await ensureBlogsTable();
    const countResult = (await sql`SELECT count(*)::int as count FROM blog_posts`) as any[];
    const count = countResult[0]?.count ?? 0;

    if (count === 0) {
      console.log('Seeding blog_posts table in Neon DB from data/blogs.ts...');
      for (const post of BLOG_POSTS) {
        await sql`
          INSERT INTO blog_posts (
            id, slug, title, subtitle, category, category_slug,
            date, read_time, author_name, author_role, author_initials,
            image, excerpt, content, published, created_at, updated_at
          ) VALUES (
            ${post.id}, ${post.slug}, ${post.title}, ${post.subtitle || ''},
            ${post.category}, ${post.categorySlug}, ${post.date}, ${post.readTime},
            ${post.author.name}, ${post.author.role}, ${post.author.initials},
            ${post.image}, ${post.excerpt}, ${JSON.stringify(post.content)}::jsonb,
            TRUE, NOW(), NOW()
          ) ON CONFLICT (slug) DO NOTHING
        `;
      }
      console.log(`Successfully seeded ${BLOG_POSTS.length} blog posts into Neon DB.`);
    }
  } catch (err) {
    console.error('Error seeding blog_posts table:', err);
  }
}

function rowToBlogPost(row: any): BlogPost {
  let content = row.content;
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      content = { lead: row.excerpt || '', sections: [] };
    }
  }

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    subtitle: String(row.subtitle || ''),
    category: String(row.category),
    categorySlug: row.category_slug as any,
    date: String(row.date),
    readTime: String(row.read_time),
    author: {
      name: String(row.author_name || 'aB Labs Editorial'),
      role: String(row.author_role || 'Web Development Specialist'),
      initials: String(row.author_initials || 'AB'),
    },
    image: String(row.image),
    excerpt: String(row.excerpt),
    content: content || { lead: '', sections: [] },
  };
}

export async function getBlogPostsFromDb(options?: {
  categorySlug?: string;
  limit?: number;
  includeUnpublished?: boolean;
}): Promise<BlogPost[]> {
  try {
    await seedBlogsIfEmpty();
    const includeUnpublished = options?.includeUnpublished ?? false;
    const categorySlug = options?.categorySlug;
    const limit = options?.limit ?? 100;

    let rows: any[];
    if (categorySlug && categorySlug !== 'all') {
      if (includeUnpublished) {
        rows = (await sql`
          SELECT * FROM blog_posts
          WHERE category_slug = ${categorySlug}
          ORDER BY created_at DESC
          LIMIT ${limit}
        `) as any[];
      } else {
        rows = (await sql`
          SELECT * FROM blog_posts
          WHERE published = TRUE AND category_slug = ${categorySlug}
          ORDER BY created_at DESC
          LIMIT ${limit}
        `) as any[];
      }
    } else {
      if (includeUnpublished) {
        rows = (await sql`
          SELECT * FROM blog_posts
          ORDER BY created_at DESC
          LIMIT ${limit}
        `) as any[];
      } else {
        rows = (await sql`
          SELECT * FROM blog_posts
          WHERE published = TRUE
          ORDER BY created_at DESC
          LIMIT ${limit}
        `) as any[];
      }
    }

    if (!rows || rows.length === 0) {
      return BLOG_POSTS;
    }

    return rows.map(rowToBlogPost);
  } catch (error) {
    console.error('Error fetching blog posts from Neon DB, falling back to static BLOG_POSTS:', error);
    return BLOG_POSTS;
  }
}

export async function getBlogPostFromDb(slug: string): Promise<BlogPost | null> {
  const clean = String(slug || '').trim();
  if (!clean) return null;

  try {
    await seedBlogsIfEmpty();
    const rows = (await sql`
      SELECT * FROM blog_posts
      WHERE slug = ${clean} OR id = ${clean}
      LIMIT 1
    `) as any[];

    if (rows && rows.length > 0) {
      return rowToBlogPost(rows[0]);
    }
  } catch (error) {
    console.error(`Error querying blog post ${clean} from Neon DB:`, error);
  }

  // Fallback
  return BLOG_POSTS.find((p) => p.slug === clean || p.id === clean) || null;
}

export async function saveBlogPostInDb(post: {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  categorySlug: string;
  date?: string;
  readTime?: string;
  authorName?: string;
  authorRole?: string;
  authorInitials?: string;
  image?: string;
  excerpt: string;
  content: any;
  published?: boolean;
}): Promise<BlogPost> {
  await seedBlogsIfEmpty();
  const id = post.id || `post_${Date.now()}`;
  const date = post.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const readTime = post.readTime || '5 min read';
  const authorName = post.authorName || 'aB Labs Editorial';
  const authorRole = post.authorRole || 'Engineering Team';
  const authorInitials = post.authorInitials || 'AB';
  const image = post.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
  const published = post.published !== undefined ? post.published : true;
  const contentJson = JSON.stringify(post.content || { lead: post.excerpt, sections: [] });

  await sql`
    INSERT INTO blog_posts (
      id, slug, title, subtitle, category, category_slug,
      date, read_time, author_name, author_role, author_initials,
      image, excerpt, content, published, updated_at
    ) VALUES (
      ${id}, ${post.slug}, ${post.title}, ${post.subtitle || ''},
      ${post.category}, ${post.categorySlug}, ${date}, ${readTime},
      ${authorName}, ${authorRole}, ${authorInitials},
      ${image}, ${post.excerpt}, ${contentJson}::jsonb, ${published}, NOW()
    ) ON CONFLICT (slug) DO UPDATE
      SET title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          category = EXCLUDED.category,
          category_slug = EXCLUDED.category_slug,
          read_time = EXCLUDED.read_time,
          author_name = EXCLUDED.author_name,
          author_role = EXCLUDED.author_role,
          author_initials = EXCLUDED.author_initials,
          image = EXCLUDED.image,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          published = EXCLUDED.published,
          updated_at = NOW()
  `;

  const updated = await getBlogPostFromDb(post.slug);
  if (!updated) throw new Error('Failed to retrieve saved blog post');
  return updated;
}

export async function deleteBlogPostFromDb(slug: string): Promise<void> {
  await sql`DELETE FROM blog_posts WHERE slug = ${slug} OR id = ${slug}`;
}
