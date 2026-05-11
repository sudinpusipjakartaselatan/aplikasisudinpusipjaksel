import Link from 'next/link';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  imageUrl?: string;
  registrationUrl: string;
}

const EventCard = ({ id, title, date, time, location, price, imageUrl, registrationUrl }: EventCardProps) => {
  const isFree = price.toLowerCase() === 'gratis';

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover-lift premium-shadow flex flex-col h-full group">
      <div className="h-48 relative overflow-hidden shrink-0">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-slate-300">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${isFree ? 'bg-green-500/90 text-white' : 'bg-secondary/90 text-primary'}`}>
            {price}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-4 text-heading-text line-clamp-2 leading-tight">
          {title}
        </h3>
        
        <div className="space-y-3 mb-6 flex-grow">
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span>{date}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span>{time}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border mt-auto">
          {registrationUrl ? (
            <a 
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-primary text-white text-center rounded-xl text-sm font-bold hover:bg-primary-light transition-all shadow-md hover:shadow-lg"
            >
              Daftar Sekarang
            </a>
          ) : (
            <button disabled className="block w-full py-3 bg-slate-100 text-slate-400 text-center rounded-xl text-sm font-bold cursor-not-allowed">
              Pendaftaran Ditutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
