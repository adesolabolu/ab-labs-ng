import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getBlogPostsFromDb,
  getBlogPostFromDb,
  saveBlogPostInDb,
  deleteBlogPostFromDb,
} from '@/lib/blogs-db';

export const dynamic = 'force-dynamic';

function revalidateBlog() {
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/', 'page');
}

/** Admin: Returns all posts including unpublished drafts */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const post = await getBlogPostFromDb(slug);
      if (!post) {
        return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, post });
    }

    const posts = await getBlogPostsFromDb({ includeUnpublished: true });
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error('Error in admin blogs GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** Admin: Create or update a blog post */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.slug || !body?.title) {
      return NextResponse.json({ success: false, error: 'slug and title are required' }, { status: 400 });
    }

    const post = await saveBlogPostInDb(body);
    revalidateBlog();
    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Error in admin blogs POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** Admin: Patch update fields on a blog post */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body?.slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
    }

    const existing = await getBlogPostFromDb(body.slug);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }

    const merged = {
      ...existing,
      ...body,
      authorName: body.authorName || existing.author.name,
      authorRole: body.authorRole || existing.author.role,
      authorInitials: body.authorInitials || existing.author.initials,
    };

    const updated = await saveBlogPostInDb(merged);
    revalidateBlog();
    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error('Error in admin blogs PATCH:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** Admin: Delete a blog post */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
    }

    await deleteBlogPostFromDb(slug);
    revalidateBlog();
    return NextResponse.json({ success: true, deletedSlug: slug });
  } catch (error: any) {
    console.error('Error in admin blogs DELETE:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
