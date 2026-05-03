import Hero from '@/components/Hero';
import ArticleCard from '@/components/ArticleCard';
import { getArticles } from '@/lib/db';

export default async function Home() {
  const articles = getArticles();

  return (
    <div className="overflow-x-hidden">
      <Hero />
      
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Berita & <span className="text-secondary">Artikel Terbaru</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Ikuti perkembangan terbaru mengenai kegiatan literasi, layanan kearsipan, dan berbagai agenda menarik lainnya di wilayah Jakarta Selatan.
              </p>
            </div>
            <button className="text-sm font-bold text-primary-light hover:text-primary transition-colors flex items-center gap-2 pb-1 border-b-2 border-primary-light/20 hover:border-primary-light">
              Lihat Semua Berita
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard 
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  category={article.category}
                  date={article.date}
                  excerpt={article.excerpt}
                  imageUrl={article.imageUrl}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400">
                Belum ada artikel terbaru.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Statistics Section */}
      <section className="py-16 md:py-20 bg-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-secondary/5 md:-skew-x-12 md:translate-x-1/4"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 md:bg-transparent md:border-0 md:p-0">
              <p className="text-3xl md:text-5xl font-bold text-secondary mb-2">50K+</p>
              <p className="text-[10px] md:text-sm text-slate-300 font-medium uppercase tracking-widest">Koleksi Buku</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 md:bg-transparent md:border-0 md:p-0">
              <p className="text-3xl md:text-5xl font-bold text-secondary mb-2">120+</p>
              <p className="text-[10px] md:text-sm text-slate-300 font-medium uppercase tracking-widest">Titik Baca</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 md:bg-transparent md:border-0 md:p-0">
              <p className="text-3xl md:text-5xl font-bold text-secondary mb-2">15K+</p>
              <p className="text-[10px] md:text-sm text-slate-300 font-medium uppercase tracking-widest">Anggota Aktif</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 md:bg-transparent md:border-0 md:p-0">
              <p className="text-3xl md:text-5xl font-bold text-secondary mb-2">100%</p>
              <p className="text-[10px] md:text-sm text-slate-300 font-medium uppercase tracking-widest">Layanan Gratis</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 premium-shadow border border-slate-100 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 md:mb-6">
                Siap Menjadi Bagian dari <span className="text-secondary">Warga Literat?</span>
              </h2>
              <p className="text-slate-600 mb-0 leading-relaxed text-base md:text-lg">
                Daftarkan diri Anda sebagai anggota perpustakaan secara online dan nikmati akses ke ribuan koleksi digital kami sekarang juga.
              </p>
            </div>
            <div className="flex shrink-0 w-full md:w-auto">
              <button className="w-full md:w-auto bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold hover:bg-primary-light transition-all premium-shadow text-base md:text-lg">
                Daftar Anggota Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
