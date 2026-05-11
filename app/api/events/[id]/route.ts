import { NextResponse } from 'next/server';
import { updateEvent, deleteEvent } from '@/lib/db';
import { cookies } from 'next/headers';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const params = await context.params;
    const updatedEvent = updateEvent(params.id, data);
    
    if (updatedEvent) {
      return NextResponse.json({ success: true, event: updatedEvent });
    } else {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = await context.params;
  const success = deleteEvent(params.id);
  
  if (success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
}
