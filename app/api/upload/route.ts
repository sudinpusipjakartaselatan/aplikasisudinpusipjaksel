import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

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

    const uploadedUrls: string[] = [];
    const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

    for (const file of files) {
      const originalName = file.name;
      const extension = path.extname(originalName);
      const safeName = `${Date.now()}-${Math.random().toString(36).substring(7)}${extension}`;

      if (useBlob) {
        // Upload to Vercel Blob
        const blob = await put(`activity/${idKegiatan}/${safeName}`, file, {
          access: 'public',
        });
        uploadedUrls.push(blob.url);
      } else {
        // Fallback to local fs (for local development without Vercel Blob)
        if (process.env.VERCEL) {
          throw new Error('Cannot upload files to Vercel without BLOB_READ_WRITE_TOKEN');
        }

        const uploadDir = path.join(process.cwd(), 'database', 'image', 'activity', idKegiatan);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, safeName);
        fs.writeFileSync(filePath, buffer);
        
        const fileUrl = `/api/images/activity/${idKegiatan}/${safeName}`;
        uploadedUrls.push(fileUrl);
      }
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message, stack: error.stack }, { status: 500 });
  }
}
