import Image from "next/image";
import { getMobileLibraries } from "@/lib/db";
import MobileLibraryCard from "@/components/MobileLibraryCard";
import Pagination from "@/components/Pagination";

export default async function PuslingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const currentPage = isNaN(page) || page < 1 ? 1 : page;
  
  const ITEMS_PER_PAGE = 6;
  const allLibraries = await getMobileLibraries();
  const totalPages = Math.ceil(allLibraries.length / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLibraries = allLibraries.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1200"
          alt="Jadwal Perpustakaan Keliling"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Perpustakaan Keliling
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Cek jadwal dan lokasi armada perpustakaan keliling kami di wilayah Jakarta Selatan.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {currentLibraries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentLibraries.map((item) => (
                <MobileLibraryCard 
                  key={item.id}
                  id={item.id}
                  title={item.namaLokasi || item.title || 'Lokasi Belum Ditentukan'}
                  date={item.tanggal || item.date || '-'}
                  hari={item.hari}
                  time={item.jamLayanan || item.time || ''}
                  location={item.kelurahan || item.location || '-'}
                  imageUrl={item.imageUrl}
                />
              ))}
            </div>
            
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              basePath="/pusling" 
            />
          </>
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-slate-300">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <p>Belum ada jadwal perpustakaan keliling terbaru saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
