import { NextResponse } from 'next/server';

export async function PUT() {
  return NextResponse.json({ message: 'Moved' }, { status: 301 });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Moved' }, { status: 301 });
}
