import { NextResponse } from 'next/server';
import { incrementKegiatanViews } from '@/lib/db';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const views = await incrementKegiatanViews(params.id);

    if (views !== null) {
      return NextResponse.json({ success: true, views });
    } else {
      return NextResponse.json({ error: 'Kegiatan not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update views' }, { status: 500 });
  }
}
