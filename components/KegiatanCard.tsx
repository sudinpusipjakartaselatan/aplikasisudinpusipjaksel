import Link from 'next/link';
import { getActivityStatus } from '@/utils/dateHelper';
import CountdownTimer from './CountdownTimer';

interface KegiatanCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  views?: number;
  status?: 'auto' | 'upcoming' | 'ongoing' | 'completed';
}

const KegiatanCard = ({ id, title, date, time, location, imageUrl, views = 0, status }: KegiatanCardProps) => {
  const currentStatus = getActivityStatus({ id, title, date, time, location, description: '', status });

  return (
    <Link href={`/kegiatan/${id}`} className="bg-card rounded-2xl overflow-hidden border border-border hover-lift premium-shadow flex flex-col h-full group block relative transition-all duration-300">
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

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          {currentStatus === 'upcoming' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30 ring-2 ring-white/60 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Akan Datang
            </span>
          )}
          {currentStatus === 'ongoing' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-white/60 backdrop-blur-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              Berlangsung
            </span>
          )}
          {currentStatus === 'completed' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-slate-200 backdrop-blur-md shadow-sm">
              Selesai
            </span>
          )}
        </div>

        {/* View Count Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md shadow-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            {(views || 0).toLocaleString('id-ID')}
          </span>
        </div>

        {/* Compact Countdown for Upcoming */}
        {currentStatus === 'upcoming' && (
          <div className="absolute bottom-2.5 left-3 right-3 z-10">
            <CountdownTimer dateStr={date} timeStr={time} variant="compact" />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-4 text-heading-text line-clamp-2 leading-tight group-hover:text-primary transition-colors">
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

        <div className="pt-4 border-t border-border mt-auto flex items-center justify-between gap-3">
          <span className="w-full py-3 bg-primary/10 text-primary text-center rounded-xl text-sm font-bold group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            Lihat Detail Kegiatan
          </span>
        </div>
      </div>
    </Link>
  );
};

export default KegiatanCard;
