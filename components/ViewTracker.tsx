'use client';

import { useEffect, useState } from 'react';

interface ViewTrackerProps {
  id: string;
  initialViews?: number;
  className?: string;
  showBadge?: boolean;
}

export default function ViewTracker({
  id,
  initialViews = 0,
  className = '',
  showBadge = true,
}: ViewTrackerProps) {
  const [views, setViews] = useState<number>(initialViews);

  useEffect(() => {
    if (!id) return;

    const storageKey = `kegiatan_viewed_${id}`;
    const alreadyViewed = sessionStorage.getItem(storageKey);

    if (!alreadyViewed) {
      sessionStorage.setItem(storageKey, 'true');

      // Call API to increment view count
      fetch(`/api/kegiatan/${encodeURIComponent(id)}/view`, {
        method: 'POST',
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.views === 'number') {
            setViews(data.views);
          }
        })
        .catch((err) => {
          console.debug('Failed to record view:', err);
        });
    }
  }, [id]);

  if (!showBadge) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
      <span>{views.toLocaleString('id-ID')} dilihat</span>
    </div>
  );
}
