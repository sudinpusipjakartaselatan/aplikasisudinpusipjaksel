import Link from 'next/link';

interface ArticleCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  imageUrl?: string;
}

const ArticleCard = ({ id, title, category, date, excerpt, imageUrl }: ArticleCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover-lift premium-shadow">
      <div className="h-48 relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-slate-300">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-primary uppercase tracking-wider shadow-sm">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <p className="text-xs text-slate-400 font-medium mb-2">{date}</p>
        <Link href={`/articles/${id}`}>
          <h3 className="text-xl font-bold mb-3 text-primary line-clamp-2 leading-tight hover:text-primary-light transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        <Link href={`/articles/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary-light hover:text-primary transition-colors group">
          Baca Selengkapnya
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
