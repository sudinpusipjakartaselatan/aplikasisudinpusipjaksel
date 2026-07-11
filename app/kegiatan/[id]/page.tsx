import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKegiatanById } from "@/lib/db";
import KegiatanCarousel from "@/components/KegiatanCarousel";

export default async function KegiatanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const kegiatan = await getKegiatanById(resolvedParams.id);

  if (!kegiatan) {
    notFound();
  }

  // Fallback to array if only imageUrl exists
  const images = kegiatan.imageUrls && kegiatan.imageUrls.length > 0 
    ? kegiatan.imageUrls 
    : (kegiatan.imageUrl ? [kegiatan.imageUrl] : []);

  return (
    <div className="min-h-screen bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/kegiatan" 
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary mb-8 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Kegiatan
        </Link>

        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-border">
          {images.length > 0 && (
            <KegiatanCarousel imageUrls={images} title={kegiatan.title} />
          )}

          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-heading-text mb-6">
              {kegiatan.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-slate-50 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-primary">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500">Tanggal & Waktu</p>
                  <p className="font-semibold text-slate-700">{kegiatan.date}</p>
                  <p className="text-slate-600">{kegiatan.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-primary">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500">Lokasi</p>
                  <p className="font-semibold text-slate-700">{kegiatan.location}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-10">
              <h3 className="text-xl font-bold text-heading-text mb-4">Deskripsi Kegiatan</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {kegiatan.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
