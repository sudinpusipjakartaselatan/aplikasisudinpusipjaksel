import { NextResponse } from 'next/server';
import { getKegiatan, addKegiatan } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  const kegiatan = getKegiatan();
  return NextResponse.json(kegiatan);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newKegiatan = addKegiatan(data);
    
    if (newKegiatan) {
      return NextResponse.json({ success: true, event: newKegiatan }); // Keep event to avoid changing admin dashboard too much at once
    } else {
      return NextResponse.json({ error: 'Failed to add kegiatan' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
