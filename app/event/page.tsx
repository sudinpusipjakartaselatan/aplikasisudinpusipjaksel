import Image from "next/image";
import { getEvents } from "@/lib/db";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";

export default async function EventPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const currentPage = isNaN(page) || page < 1 ? 1 : page;
  
  const ITEMS_PER_PAGE = 6;
  const allEvents = getEvents();
  const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = allEvents.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200"
          alt="Agenda Kegiatan & Event"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Agenda Kegiatan
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Ikuti berbagai event, seminar, pelatihan, dan kegiatan menarik yang kami selenggarakan.
            </p>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {currentEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentEvents.map((item) => (
                <EventCard 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  date={item.date}
                  time={item.time}
                  location={item.location}
                  price={item.price}
                  imageUrl={item.imageUrl}
                  registrationUrl={item.registrationUrl}
                />
              ))}
            </div>
            
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              basePath="/event" 
            />
          </>
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-slate-300">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p>Belum ada jadwal kegiatan terbaru saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
