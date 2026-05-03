import { NextResponse } from 'next/server';
import { getArticles, addArticle } from '@/lib/db';

export async function GET() {
  const articles = getArticles();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newArticle = addArticle(body);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 400 });
  }
}
