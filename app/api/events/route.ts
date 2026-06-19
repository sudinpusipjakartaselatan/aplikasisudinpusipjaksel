import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.redirect(new URL('/api/kegiatan', request.url), 301);
}

export async function POST(request: Request) {
  return NextResponse.redirect(new URL('/api/kegiatan', request.url), 301);
}
