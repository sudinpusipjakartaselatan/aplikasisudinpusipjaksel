import { NextResponse } from 'next/server';
import { addBulkKegiatan } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Data must be an array' }, { status: 400 });
    }

    const newItems = await addBulkKegiatan(data);
    
    if (newItems) {
      return NextResponse.json({ success: true, count: newItems.length });
    } else {
      return NextResponse.json({ error: 'Failed to add bulk kegiatan' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
