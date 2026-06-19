import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const idKegiatan = formData.get('idKegiatan') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (!idKegiatan) {
      return NextResponse.json({ error: 'Missing idKegiatan' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'database', 'image', 'activity', idKegiatan);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize filename
      const originalName = file.name;
      const extension = path.extname(originalName);
      const safeName = `${Date.now()}-${Math.random().toString(36).substring(7)}${extension}`;
      
      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, buffer);
      
      // We will serve this via our new /api/images endpoint
      const fileUrl = `/api/images/activity/${idKegiatan}/${safeName}`;
      uploadedUrls.push(fileUrl);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message, stack: error.stack }, { status: 500 });
  }
}
