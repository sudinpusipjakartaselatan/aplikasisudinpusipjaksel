import React from 'react';

interface MobileLibraryCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  description: string;
}

const MobileLibraryCard = ({ title, date, time, location, imageUrl, description }: MobileLibraryCardProps) => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover-lift premium-shadow flex flex-col h-full group relative">
      {/* Top Image Section */}
      <div className="h-48 relative overflow-hidden shrink-0">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-blue-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-blue-200 dark:text-slate-600">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-80"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <span className="px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full text-[10px] font-bold text-primary uppercase tracking-wider shadow-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            {time}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow bg-white dark:bg-slate-900 relative">
        {/* Floating Date Badge */}
        <div className="absolute -top-12 right-6 bg-secondary text-primary w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300 border-2 border-white dark:border-slate-800">
          <span className="text-xl font-black leading-none">{date.split(' ')[0]}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">{date.split(' ')[1]?.substring(0,3)}</span>
        </div>

        <h3 className="text-lg md:text-xl font-bold mb-4 text-heading-text line-clamp-2 leading-tight pr-10">
          {title}
        </h3>
        
        <div className="space-y-4 mb-6 flex-grow">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Lokasi Pusling</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-snug">{location}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileLibraryCard;
