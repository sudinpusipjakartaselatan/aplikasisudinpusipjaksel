import { NextResponse } from 'next/server';
import { getMobileLibraries, addMobileLibrary } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  const libraries = getMobileLibraries();
  return NextResponse.json(libraries);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newLibrary = addMobileLibrary(data);
    
    if (newLibrary) {
      return NextResponse.json({ success: true, library: newLibrary });
    } else {
      return NextResponse.json({ error: 'Failed to add mobile library' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
