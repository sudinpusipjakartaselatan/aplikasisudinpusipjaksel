'use client';

import { useState, useEffect } from 'react';
import { parseActivityDate } from '@/utils/dateHelper';

interface CountdownTimerProps {
  dateStr?: string;
  timeStr?: string;
  variant?: 'full' | 'compact';
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
  isFinished: boolean;
}

export default function CountdownTimer({
  dateStr,
  timeStr,
  variant = 'full',
  className = '',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const { startDate, endDate, isValid } = parseActivityDate(dateStr, timeStr);
    if (!isValid || !startDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const now = new Date().getTime();
      const start = startDate.getTime();
      const end = endDate ? endDate.getTime() : start + 3 * 3600 * 1000;

      if (now >= end) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true, isFinished: true };
      }

      if (now >= start) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true, isFinished: false };
      }

      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, isStarted: false, isFinished: false };
    };

    setTimeLeft(calculateTime());

    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [dateStr, timeStr]);

  if (!timeLeft) return null;

  if (timeLeft.isFinished) {
    if (variant === 'compact') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">
          Selesai
        </span>
      );
    }
    return null;
  }

  if (timeLeft.isStarted) {
    if (variant === 'compact') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-sm animate-pulse">
          <span className="w-2 h-2 rounded-full bg-white"></span>
          Sedang Berlangsung
        </span>
      );
    }
    return (
      <div className={`p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-500/30 text-center ${className}`}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs md:text-sm font-black mb-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          LIVE SEKARANG
        </div>
        <p className="text-emerald-800 dark:text-emerald-300 font-extrabold text-base md:text-lg">
          Kegiatan Ini Sedang Berlangsung!
        </p>
      </div>
    );
  }

  // Variant: Compact (used in Cards)
  if (variant === 'compact') {
    let text = '';
    if (timeLeft.days > 0) {
      text = `${timeLeft.days} hari ${timeLeft.hours} jam lagi`;
    } else if (timeLeft.hours > 0) {
      text = `${timeLeft.hours} jam ${timeLeft.minutes} mnt lagi`;
    } else {
      text = `${timeLeft.minutes}m ${timeLeft.seconds}s lagi`;
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{text}</span>
      </span>
    );
  }

  // Variant: Full (used in KegiatanDetailPage)
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-2xl border border-indigo-500/30 ${className}`}>
      {/* Background glow effects */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs md:text-sm font-black uppercase tracking-wider mb-3 shadow-lg shadow-orange-500/30">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          Coming Soon • Segera Dimulai
        </div>

        <h3 className="text-lg md:text-2xl font-black text-white mb-6">
          Hitung Mundur Kegiatan
        </h3>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full max-w-lg">
          {/* Days */}
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/15 shadow-inner">
            <span className="text-2xl sm:text-3xl md:text-5xl font-black text-amber-400 font-mono">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">
              Hari
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/15 shadow-inner">
            <span className="text-2xl sm:text-3xl md:text-5xl font-black text-orange-400 font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">
              Jam
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/15 shadow-inner">
            <span className="text-2xl sm:text-3xl md:text-5xl font-black text-amber-300 font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">
              Menit
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/15 shadow-inner">
            <span className="text-2xl sm:text-3xl md:text-5xl font-black text-rose-400 font-mono animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">
              Detik
            </span>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-300 mt-5 flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-amber-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Jadwal pelaksanaan: <span className="font-semibold text-white">{dateStr} {timeStr ? `(${timeStr})` : ''}</span>
        </p>
      </div>
    </div>
  );
}
