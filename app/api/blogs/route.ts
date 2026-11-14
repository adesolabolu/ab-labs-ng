import { NextResponse } from 'next/server';
import { getBlogPostsFromDb, getBlogPostFromDb } from '@/lib/blogs-db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');

    if (slug) {
      const post = await getBlogPostFromDb(slug);
      if (!post) {
        return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(
        { success: true, post },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    const posts = await getBlogPostsFromDb({ categorySlug: category || undefined });
    return NextResponse.json(
      { success: true, posts },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
