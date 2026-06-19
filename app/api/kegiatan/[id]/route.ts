import { NextResponse } from 'next/server';
import { updateKegiatan, deleteKegiatan } from '@/lib/db';
import { cookies } from 'next/headers';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const params = await context.params;
    const updatedKegiatan = updateKegiatan(params.id, data);
    
    if (updatedKegiatan) {
      return NextResponse.json({ success: true, event: updatedKegiatan });
    } else {
      return NextResponse.json({ error: 'Kegiatan not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = await context.params;
  const success = deleteKegiatan(params.id);
  
  if (success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Kegiatan not found' }, { status: 404 });
  }
}
