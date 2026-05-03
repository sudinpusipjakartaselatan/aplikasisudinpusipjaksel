import { getArticleById } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Article Header */}
      <section className="relative py-20 md:py-32 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:gap-3 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Beranda
          </Link>
          <div className="mb-6">
            <span className="px-4 py-1.5 bg-secondary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
              {article.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-slate-500 font-medium">
            Diterbitkan pada {article.date} • Oleh Humas Sudin Pusip
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
          
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-8">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100">
            <h3 className="text-xl font-bold text-primary mb-6">Bagikan Artikel Ini</h3>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>
              <button className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
