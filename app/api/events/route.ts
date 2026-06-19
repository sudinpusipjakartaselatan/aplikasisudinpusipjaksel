import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Moved to /api/kegiatan' }, { status: 301 });
}

export async function POST() {
  return NextResponse.json({ message: 'Moved' }, { status: 301 });
}
