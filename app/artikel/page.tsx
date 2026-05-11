import Image from "next/image";
import { getArticles } from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const currentPage = isNaN(page) || page < 1 ? 1 : page;
  
  const ITEMS_PER_PAGE = 6;
  const allArticles = getArticles();
  const totalPages = Math.ceil(allArticles.length / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = allArticles.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200"
          alt="Artikel Terkini"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Artikel & Informasi
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Informasi terkini seputar kegiatan, layanan, dan pengumuman dari kami.
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {currentArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentArticles.map((item) => (
                <ArticleCard 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  date={item.date}
                  excerpt={item.excerpt}
                  imageUrl={item.imageUrl}
                />
              ))}
            </div>
            
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              basePath="/artikel" 
            />
          </>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            Belum ada artikel terbaru.
          </div>
        )}
      </div>
    </div>
  );
}
