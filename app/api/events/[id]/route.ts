import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  const url = new URL(request.url);
  return NextResponse.redirect(new URL(url.pathname.replace('/events/', '/kegiatan/'), request.url), 301);
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  return NextResponse.redirect(new URL(url.pathname.replace('/events/', '/kegiatan/'), request.url), 301);
}
