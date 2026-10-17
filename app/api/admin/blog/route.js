import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/requireAuth';
import { getAllBlogPosts, saveBlogPost } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const posts = getAllBlogPosts(false); // get all including drafts
    return NextResponse.json({ ok: true, posts });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    return NextResponse.json({ error: 'Erro ao buscar artigos do blog.' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Título e conteúdo são obrigatórios.' }, { status: 400 });
    }

    const saved = saveBlogPost(body, user.email);
    return NextResponse.json({
      ok: true,
      message: 'Artigo criado com sucesso.',
      post: saved,
    });
  } catch (err) {
    console.error('Error creating blog post:', err);
    return NextResponse.json({ error: err.message || 'Erro ao criar artigo.' }, { status: 500 });
  }
}
