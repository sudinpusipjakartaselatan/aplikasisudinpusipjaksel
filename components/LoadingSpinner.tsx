import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ text = "Memuat Data...", fullScreen = false }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
        {/* Animated Ring */}
        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-[spin_1s_linear_infinite]"></div>
        {/* Inner Branding */}
        <div className="w-8 h-8 bg-secondary rounded-full animate-pulse shadow-lg shadow-secondary/50 flex items-center justify-center">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
           </svg>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-base font-bold text-primary dark:text-primary-light animate-pulse tracking-wide">{text}</p>
        <p className="text-xs text-slate-400 font-medium">Mohon tunggu sebentar...</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
