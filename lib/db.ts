import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

const KEGIATAN_DB_PATH = path.join(process.cwd(), 'database', 'kegiatan.json');
const MOBILE_LIB_DB_PATH = path.join(process.cwd(), 'database', 'mobile-libraries.json');

export interface Kegiatan {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  imageUrls?: string[];
  description: string;
  namaInstansi?: string;
  jumlahSnack?: number;
  jumlahPeserta?: string | number;
  namaNarasumber?: string;
  timPelaksana?: string;
  guru?: string;
  jenisKelamin?: string;
  usia?: string;
}

export interface MobileLibrary {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  description: string;
}

// Check if Upstash Redis credentials exist in environment
const useRedis = () => {
  return !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
};

// Initialize Redis safely
let redis: Redis | null = null;
try {
  if (useRedis()) {
    redis = Redis.fromEnv();
  }
} catch (e) {
  console.warn('Failed to initialize Redis:', e);
}

// ==========================================
// KEGIATAN DATABASE
// ==========================================

export const getKegiatan = async (): Promise<Kegiatan[]> => {
  try {
    if (redis) {
      const data = await redis.get<Kegiatan[]>('kegiatan');
      return data || [];
    }
    if (!fs.existsSync(KEGIATAN_DB_PATH)) return [];
    const data = fs.readFileSync(KEGIATAN_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading Kegiatan DB:', error);
    return [];
  }
};

export const saveKegiatan = async (kegiatan: Kegiatan[]): Promise<boolean> => {
  try {
    if (redis) {
      await redis.set('kegiatan', kegiatan);
      return true;
    }
    if (process.env.VERCEL && !redis) {
      console.warn('Cannot save kegiatan on Vercel without Upstash Redis');
      return false;
    }
    fs.writeFileSync(KEGIATAN_DB_PATH, JSON.stringify(kegiatan, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing Kegiatan DB:', error);
    return false;
  }
};

export const getKegiatanById = async (id: string): Promise<Kegiatan | undefined> => {
  const kegiatan = await getKegiatan();
  return kegiatan.find(e => e.id === id);
};

export const addKegiatan = async (kegiatanItem: Omit<Kegiatan, 'id'>): Promise<Kegiatan | null> => {
  const kegiatan = await getKegiatan();
  const newKegiatan: Kegiatan = {
    ...kegiatanItem,
    id: Date.now().toString(),
  };
  kegiatan.unshift(newKegiatan);
  const success = await saveKegiatan(kegiatan);
  return success ? newKegiatan : null;
};

export const addBulkKegiatan = async (kegiatanItems: Omit<Kegiatan, 'id'>[]): Promise<Kegiatan[] | null> => {
  const kegiatan = await getKegiatan();
  const newItems = kegiatanItems.map((item, index) => ({
    ...item,
    id: (Date.now() + index).toString(),
  }));
  kegiatan.unshift(...newItems);
  const success = await saveKegiatan(kegiatan);
  return success ? newItems : null;
};

export const updateKegiatan = async (id: string, updatedData: Partial<Kegiatan>): Promise<Kegiatan | null> => {
  const kegiatan = await getKegiatan();
  const index = kegiatan.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  const updatedKegiatan = { ...kegiatan[index], ...updatedData, id };
  kegiatan[index] = updatedKegiatan;
  const success = await saveKegiatan(kegiatan);
  return success ? updatedKegiatan : null;
};

export const deleteKegiatan = async (id: string): Promise<boolean> => {
  const kegiatan = await getKegiatan();
  const filtered = kegiatan.filter(e => e.id !== id);
  if (filtered.length === kegiatan.length) return false;
  
  return await saveKegiatan(filtered);
};

// ==========================================
// MOBILE LIBRARIES DATABASE
// ==========================================

export const getMobileLibraries = async (): Promise<MobileLibrary[]> => {
  try {
    if (redis) {
      const data = await redis.get<MobileLibrary[]>('mobileLibraries');
      return data || [];
    }
    if (!fs.existsSync(MOBILE_LIB_DB_PATH)) return [];
    const data = fs.readFileSync(MOBILE_LIB_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading Mobile Libraries DB:', error);
    return [];
  }
};

export const saveMobileLibraries = async (libraries: MobileLibrary[]): Promise<boolean> => {
  try {
    if (redis) {
      await redis.set('mobileLibraries', libraries);
      return true;
    }
    if (process.env.VERCEL && !redis) {
      console.warn('Cannot save mobile libraries on Vercel without Upstash Redis');
      return false;
    }
    fs.writeFileSync(MOBILE_LIB_DB_PATH, JSON.stringify(libraries, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing Mobile Libraries DB:', error);
    return false;
  }
};

export const getMobileLibraryById = async (id: string): Promise<MobileLibrary | undefined> => {
  const libraries = await getMobileLibraries();
  return libraries.find(l => l.id === id);
};

export const addMobileLibrary = async (library: Omit<MobileLibrary, 'id'>): Promise<MobileLibrary | null> => {
  const libraries = await getMobileLibraries();
  const newLibrary: MobileLibrary = {
    ...library,
    id: Date.now().toString(),
  };
  libraries.unshift(newLibrary);
  const success = await saveMobileLibraries(libraries);
  return success ? newLibrary : null;
};

export const updateMobileLibrary = async (id: string, updatedData: Partial<MobileLibrary>): Promise<MobileLibrary | null> => {
  const libraries = await getMobileLibraries();
  const index = libraries.findIndex(l => l.id === id);
  if (index === -1) return null;
  
  const updatedLibrary = { ...libraries[index], ...updatedData, id };
  libraries[index] = updatedLibrary;
  const success = await saveMobileLibraries(libraries);
  return success ? updatedLibrary : null;
};

export const deleteMobileLibrary = async (id: string): Promise<boolean> => {
  const libraries = await getMobileLibraries();
  const filtered = libraries.filter(l => l.id !== id);
  if (filtered.length === libraries.length) return false;
  
  return await saveMobileLibraries(filtered);
};
