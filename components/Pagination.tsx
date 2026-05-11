import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination = ({ currentPage, totalPages, basePath }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous Arrow */}
      {currentPage > 1 ? (
        <Link 
          href={`${basePath}?page=${currentPage - 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
      ) : (
        <button disabled className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Page Numbers */}
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        const isActive = pageNum === currentPage;
        
        return (
          <Link
            key={pageNum}
            href={`${basePath}?page=${pageNum}`}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all shadow-sm ${
              isActive 
                ? 'bg-primary text-white border border-primary' 
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* Next Arrow */}
      {currentPage < totalPages ? (
        <Link 
          href={`${basePath}?page=${currentPage + 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      ) : (
        <button disabled className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Pagination;
