import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database', 'articles.json');



// ==========================================
// KEGIATAN DATABASE
// ==========================================

const KEGIATAN_DB_PATH = path.join(process.cwd(), 'database', 'kegiatan.json');

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
  jumlahPeserta?: number;
  namaNarasumber?: string;
  timPelaksana?: string;
  guru?: string;
  jenisKelamin?: string;
  usia?: string;
}

export const getKegiatan = (): Kegiatan[] => {
  try {
    if (!fs.existsSync(KEGIATAN_DB_PATH)) return [];
    const data = fs.readFileSync(KEGIATAN_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading Kegiatan DB:', error);
    return [];
  }
};

export const saveKegiatan = (kegiatan: Kegiatan[]) => {
  try {
    if (process.env.VERCEL) {
      console.warn('Cannot save kegiatan on Vercel (Read-only File System)');
      return false;
    }
    fs.writeFileSync(KEGIATAN_DB_PATH, JSON.stringify(kegiatan, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing Kegiatan DB:', error);
    return false;
  }
};

export const getKegiatanById = (id: string): Kegiatan | undefined => {
  const kegiatan = getKegiatan();
  return kegiatan.find(e => e.id === id);
};

export const addKegiatan = (kegiatanItem: Omit<Kegiatan, 'id'>) => {
  const kegiatan = getKegiatan();
  const newKegiatan: Kegiatan = {
    ...kegiatanItem,
    id: Date.now().toString(),
  };
  kegiatan.unshift(newKegiatan);
  const success = saveKegiatan(kegiatan);
  return success ? newKegiatan : null;
};

export const updateKegiatan = (id: string, updatedData: Partial<Kegiatan>) => {
  const kegiatan = getKegiatan();
  const index = kegiatan.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  const updatedKegiatan = { ...kegiatan[index], ...updatedData, id };
  kegiatan[index] = updatedKegiatan;
  const success = saveKegiatan(kegiatan);
  return success ? updatedKegiatan : null;
};

export const deleteKegiatan = (id: string) => {
  const kegiatan = getKegiatan();
  const filtered = kegiatan.filter(e => e.id !== id);
  if (filtered.length === kegiatan.length) return false;
  
  return saveKegiatan(filtered);
};

// ==========================================
// MOBILE LIBRARIES DATABASE
// ==========================================

const MOBILE_LIB_DB_PATH = path.join(process.cwd(), 'database', 'mobile-libraries.json');

export interface MobileLibrary {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  description: string;
}

export const getMobileLibraries = (): MobileLibrary[] => {
  try {
    if (!fs.existsSync(MOBILE_LIB_DB_PATH)) return [];
    const data = fs.readFileSync(MOBILE_LIB_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading Mobile Libraries DB:', error);
    return [];
  }
};

export const saveMobileLibraries = (libraries: MobileLibrary[]) => {
  try {
    if (process.env.VERCEL) {
      console.warn('Cannot save mobile libraries on Vercel (Read-only File System)');
      return false;
    }
    fs.writeFileSync(MOBILE_LIB_DB_PATH, JSON.stringify(libraries, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing Mobile Libraries DB:', error);
    return false;
  }
};

export const getMobileLibraryById = (id: string): MobileLibrary | undefined => {
  const libraries = getMobileLibraries();
  return libraries.find(l => l.id === id);
};

export const addMobileLibrary = (library: Omit<MobileLibrary, 'id'>) => {
  const libraries = getMobileLibraries();
  const newLibrary: MobileLibrary = {
    ...library,
    id: Date.now().toString(),
  };
  libraries.unshift(newLibrary);
  const success = saveMobileLibraries(libraries);
  return success ? newLibrary : null;
};

export const updateMobileLibrary = (id: string, updatedData: Partial<MobileLibrary>) => {
  const libraries = getMobileLibraries();
  const index = libraries.findIndex(l => l.id === id);
  if (index === -1) return null;
  
  const updatedLibrary = { ...libraries[index], ...updatedData, id };
  libraries[index] = updatedLibrary;
  const success = saveMobileLibraries(libraries);
  return success ? updatedLibrary : null;
};

export const deleteMobileLibrary = (id: string) => {
  const libraries = getMobileLibraries();
  const filtered = libraries.filter(l => l.id !== id);
  if (filtered.length === libraries.length) return false;
  
  return saveMobileLibraries(filtered);
};

