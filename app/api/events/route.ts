import { NextResponse } from 'next/server';
import { getEvents, addEvent } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  const events = getEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newEvent = addEvent(data);
    
    if (newEvent) {
      return NextResponse.json({ success: true, event: newEvent });
    } else {
      return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
