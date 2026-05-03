import { NextResponse } from 'next/server';
import { getArticleById } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const article = getArticleById(params.id);
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
  return NextResponse.json(article);
}
