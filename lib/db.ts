import fs from 'fs';
import path from 'path';
import { put, list } from '@vercel/blob';

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
  petugas?: string;
  noPolisi?: string;
  hari?: string;
  tanggal?: string; // Replaces date
  jamLayanan?: string; // Replaces time
  kecamatan?: string;
  kelurahan?: string;
  namaLokasi?: string; // Replaces location or title
  alamatTelepon?: string;
  jarakKeLokasi1?: string | number;
  jarakLokasi1Ke2?: string | number;
  jarakKembali?: string | number;
  totalJarak?: string | number;
  namaPimpinan?: string;
  namaPIC?: string;
  imageUrl?: string;
  
  // Keep legacy for existing data
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
}

// Check if Vercel Blob token is configured
const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

// Cached Blob URLs to optimize consecutive reads
let cachedKegiatanBlobUrl: string | null = null;
let cachedMobileLibBlobUrl: string | null = null;

// ==========================================
// KEGIATAN DATABASE
// ==========================================

export const getKegiatan = async (): Promise<Kegiatan[]> => {
  try {
    if (useBlob()) {
      if (!cachedKegiatanBlobUrl) {
        const { blobs } = await list({ prefix: 'data/kegiatan.json', limit: 1 });
        if (blobs.length > 0) {
          cachedKegiatanBlobUrl = blobs[0].url;
        }
      }

      if (cachedKegiatanBlobUrl) {
        const res = await fetch(`${cachedKegiatanBlobUrl}?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }
      }
    }

    if (fs.existsSync(KEGIATAN_DB_PATH)) {
      const data = fs.readFileSync(KEGIATAN_DB_PATH, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading Kegiatan DB:', error);
    if (fs.existsSync(KEGIATAN_DB_PATH)) {
      try {
        return JSON.parse(fs.readFileSync(KEGIATAN_DB_PATH, 'utf8'));
      } catch {
        return [];
      }
    }
    return [];
  }
};

export const saveKegiatan = async (kegiatan: Kegiatan[]): Promise<boolean> => {
  try {
    if (useBlob()) {
      const blob = await put('data/kegiatan.json', JSON.stringify(kegiatan, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        cacheControlMaxAge: 0,
      });
      cachedKegiatanBlobUrl = blob.url;
    } else if (process.env.VERCEL) {
      console.warn('Cannot save kegiatan on Vercel without BLOB_READ_WRITE_TOKEN');
      return false;
    }

    if (!process.env.VERCEL) {
      fs.writeFileSync(KEGIATAN_DB_PATH, JSON.stringify(kegiatan, null, 2), 'utf8');
    }
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
    if (useBlob()) {
      if (!cachedMobileLibBlobUrl) {
        const { blobs } = await list({ prefix: 'data/mobile-libraries.json', limit: 1 });
        if (blobs.length > 0) {
          cachedMobileLibBlobUrl = blobs[0].url;
        }
      }

      if (cachedMobileLibBlobUrl) {
        const res = await fetch(`${cachedMobileLibBlobUrl}?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }
      }
    }

    if (fs.existsSync(MOBILE_LIB_DB_PATH)) {
      const data = fs.readFileSync(MOBILE_LIB_DB_PATH, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading Mobile Libraries DB:', error);
    if (fs.existsSync(MOBILE_LIB_DB_PATH)) {
      try {
        return JSON.parse(fs.readFileSync(MOBILE_LIB_DB_PATH, 'utf8'));
      } catch {
        return [];
      }
    }
    return [];
  }
};

export const saveMobileLibraries = async (libraries: MobileLibrary[]): Promise<boolean> => {
  try {
    if (useBlob()) {
      const blob = await put('data/mobile-libraries.json', JSON.stringify(libraries, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        cacheControlMaxAge: 0,
      });
      cachedMobileLibBlobUrl = blob.url;
    } else if (process.env.VERCEL) {
      console.warn('Cannot save mobile libraries on Vercel without BLOB_READ_WRITE_TOKEN');
      return false;
    }

    if (!process.env.VERCEL) {
      fs.writeFileSync(MOBILE_LIB_DB_PATH, JSON.stringify(libraries, null, 2), 'utf8');
    }
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

export const addBulkMobileLibraries = async (libraryItems: Omit<MobileLibrary, 'id'>[]): Promise<MobileLibrary[] | null> => {
  const libraries = await getMobileLibraries();
  const newItems = libraryItems.map((item, index) => ({
    ...item,
    id: (Date.now() + index).toString(),
  }));
  libraries.unshift(...newItems);
  const success = await saveMobileLibraries(libraries);
  return success ? newItems : null;
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
