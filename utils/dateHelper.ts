import { Kegiatan } from '@/lib/db';

const MONTHS_ID: Record<string, number> = {
  januari: 0, jan: 0,
  februari: 1, feb: 1,
  maret: 2, mar: 2,
  april: 3, apr: 3,
  mei: 4, may: 4,
  juni: 5, jun: 5,
  juli: 6, jul: 6,
  agustus: 7, ags: 7, agu: 7, agt: 7, aug: 7,
  september: 8, sep: 8, sept: 8,
  oktober: 9, okt: 9, oct: 9,
  november: 10, nov: 10,
  desember: 11, des: 11, dec: 11,
};

export interface ParsedDateResult {
  startDate: Date | null;
  endDate: Date | null;
  isValid: boolean;
}

/**
 * Parses date string (e.g. "25 Agustus 2026" or "2026-08-25") and time string (e.g. "09:00 - 12:00 WIB")
 */
export function parseActivityDate(dateStr?: string, timeStr?: string): ParsedDateResult {
  if (!dateStr || typeof dateStr !== 'string') {
    return { startDate: null, endDate: null, isValid: false };
  }

  const cleanDate = dateStr.trim();
  let year: number | null = null;
  let month: number | null = null;
  let day: number | null = null;

  // 1. Try format: "9 Januari 2026" or "25 Agustus 2026"
  const indoMatch = cleanDate.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
  if (indoMatch) {
    day = parseInt(indoMatch[1], 10);
    const mStr = indoMatch[2].toLowerCase();
    if (MONTHS_ID[mStr] !== undefined) {
      month = MONTHS_ID[mStr];
    }
    year = parseInt(indoMatch[3], 10);
  }

  // 2. Try ISO format: YYYY-MM-DD
  if (year === null) {
    const isoMatch = cleanDate.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (isoMatch) {
      year = parseInt(isoMatch[1], 10);
      month = parseInt(isoMatch[2], 10) - 1;
      day = parseInt(isoMatch[3], 10);
    }
  }

  // 3. Try format: DD-MM-YYYY or DD/MM/YYYY
  if (year === null) {
    const dmyMatch = cleanDate.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmyMatch) {
      day = parseInt(dmyMatch[1], 10);
      month = parseInt(dmyMatch[2], 10) - 1;
      year = parseInt(dmyMatch[3], 10);
    }
  }

  if (year === null || month === null || day === null || isNaN(year) || isNaN(month) || isNaN(day)) {
    // Fallback to standard Date.parse
    const fallbackTs = Date.parse(cleanDate);
    if (!isNaN(fallbackTs)) {
      const fbDate = new Date(fallbackTs);
      return { startDate: fbDate, endDate: new Date(fbDate.getTime() + 3 * 3600 * 1000), isValid: true };
    }
    return { startDate: null, endDate: null, isValid: false };
  }

  // Parse time
  let startHour = 8;
  let startMinute = 0;
  let endHour = 17;
  let endMinute = 0;
  let hasEndTime = false;

  if (timeStr && typeof timeStr === 'string') {
    // Look for times like "09:00 - 12:00" or "09.00 - 12.00"
    const times = timeStr.match(/(\d{1,2})[:.](\d{2})/g);
    if (times && times.length > 0) {
      const [h1, m1] = times[0].split(/[:.]/).map(n => parseInt(n, 10));
      startHour = h1;
      startMinute = m1;

      if (times.length > 1) {
        const [h2, m2] = times[1].split(/[:.]/).map(n => parseInt(n, 10));
        endHour = h2;
        endMinute = m2;
        hasEndTime = true;
      }
    }
  }

  const startDate = new Date(year, month, day, startHour, startMinute, 0, 0);
  const endDate = new Date(year, month, day, hasEndTime ? endHour : startHour + 3, hasEndTime ? endMinute : startMinute, 0, 0);

  return {
    startDate,
    endDate,
    isValid: true,
  };
}

export type ActivityStatus = 'upcoming' | 'ongoing' | 'completed';

export function getActivityStatus(
  kegiatanOrDate?: Kegiatan | string,
  timeStr?: string,
  statusOverride?: 'auto' | 'upcoming' | 'ongoing' | 'completed'
): ActivityStatus {
  let date: string | undefined;
  let time: string | undefined;
  let status: 'auto' | 'upcoming' | 'ongoing' | 'completed' | undefined;

  if (typeof kegiatanOrDate === 'object' && kegiatanOrDate !== null) {
    date = kegiatanOrDate.date;
    time = kegiatanOrDate.time;
    status = kegiatanOrDate.status;
  } else {
    date = kegiatanOrDate;
    time = timeStr;
    status = statusOverride;
  }

  // If explicitly set by admin to a fixed status, prioritize it
  if (status && status !== 'auto') {
    return status;
  }

  const { startDate, endDate, isValid } = parseActivityDate(date, time);
  if (!isValid || !startDate) {
    return 'completed';
  }

  const now = new Date();

  if (now < startDate) {
    return 'upcoming';
  }

  if (endDate && now >= startDate && now <= endDate) {
    return 'ongoing';
  }

  return 'completed';
}

/**
 * Sorts activities so:
 * 1. 'ongoing' comes first (happening right now)
 * 2. 'upcoming' comes next (sorted by nearest start date first - soonest)
 * 3. 'completed' comes after (sorted by most recent completed date first)
 */
export function sortKegiatanByStatusAndDate(activities: Kegiatan[]): Kegiatan[] {
  return [...activities].sort((a, b) => {
    const statusA = getActivityStatus(a);
    const statusB = getActivityStatus(b);

    const statusWeight: Record<ActivityStatus, number> = {
      ongoing: 0,
      upcoming: 1,
      completed: 2,
    };

    if (statusWeight[statusA] !== statusWeight[statusB]) {
      return statusWeight[statusA] - statusWeight[statusB];
    }

    const dateA = parseActivityDate(a.date, a.time).startDate?.getTime() || 0;
    const dateB = parseActivityDate(b.date, b.time).startDate?.getTime() || 0;

    // Both are ongoing or upcoming -> soonest first (ascending)
    if (statusA === 'upcoming' || statusA === 'ongoing') {
      if (dateA === 0) return 1;
      if (dateB === 0) return -1;
      return dateA - dateB;
    }

    // Both are completed -> newest first (descending)
    return dateB - dateA;
  });
}
