'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Kegiatan, MobileLibrary } from '@/lib/db';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import ImageCropModal from '@/components/ImageCropModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'kegiatan' | 'mobile_libraries'>('kegiatan');
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [mobileLibraries, setMobileLibraries] = useState<MobileLibrary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  // Kegiatan Form State
  const [kegiatanTitle, setKegiatanTitle] = useState('');
  const [kegiatanDate, setKegiatanDate] = useState('');
  const [kegiatanTime, setKegiatanTime] = useState('');
  const [kegiatanLocation, setKegiatanLocation] = useState('');
  const [kegiatanImageUrls, setKegiatanImageUrls] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [kegiatanFiles, setKegiatanFiles] = useState<File[]>([]);
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [kegiatanDescription, setKegiatanDescription] = useState('');

  // Mobile Library Form State
  const [mlTitle, setMlTitle] = useState('');
  const [mlDate, setMlDate] = useState('');
  const [mlTime, setMlTime] = useState('');
  const [mlLocation, setMlLocation] = useState('');
  const [mlImageUrl, setMlImageUrl] = useState('');
  const [mlDescription, setMlDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resKegiatan, resMobileLibs] = await Promise.all([
        fetch('/api/kegiatan'),
        fetch('/api/mobile-libraries')
      ]);

      if (resKegiatan.ok && resMobileLibs.ok) {
        setKegiatan(await resKegiatan.json());
        setMobileLibraries(await resMobileLibs.json());
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleSubmitKegiatan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let parsedUrls = kegiatanImageUrls.split(/[\n,]+/).map(u => u.trim()).filter(u => u);
    
    if (uploadMethod === 'file' && kegiatanFiles.length > 0) {
       const formData = new FormData();
       kegiatanFiles.forEach(file => formData.append('files', file));
       const tempId = editingId || Date.now().toString();
       formData.append('idKegiatan', tempId);
       
       try {
         const resUpload = await fetch('/api/upload', { method: 'POST', body: formData });
         if (resUpload.ok) {
            const data = await resUpload.json();
            parsedUrls = [...parsedUrls, ...data.urls];
         } else {
            const data = await resUpload.json();
            alert('Gagal upload gambar: ' + (data.error || resUpload.statusText));
            setIsSubmitting(false);
            return;
         }
       } catch (err) {
         console.error(err);
         alert('Gagal upload gambar');
         setIsSubmitting(false);
         return;
       }
    }

    const mainImageUrl = parsedUrls.length > 0 ? parsedUrls[0] : '';
    const kegiatanData = { title: kegiatanTitle, date: kegiatanDate, time: kegiatanTime, location: kegiatanLocation, imageUrl: mainImageUrl, imageUrls: parsedUrls, description: kegiatanDescription };
    try {
      const res = await fetch(editingId ? `/api/kegiatan/${editingId}` : '/api/kegiatan', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(kegiatanData) });
      if (res.ok) { setShowAddForm(false); resetForm(); fetchData(); } else alert('Gagal menyimpan kegiatan');
    } catch (err) { console.error(err); alert('Terjadi kesalahan'); } finally { setIsSubmitting(false); }
  };

  const handleSubmitMobileLib = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mlData = { title: mlTitle, date: mlDate, time: mlTime, location: mlLocation, imageUrl: mlImageUrl, description: mlDescription };
    try {
      const res = await fetch(editingId ? `/api/mobile-libraries/${editingId}` : '/api/mobile-libraries', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mlData) });
      if (res.ok) { setShowAddForm(false); resetForm(); fetchData(); } else alert('Gagal menyimpan jadwal pusling');
    } catch (err) { console.error(err); alert('Terjadi kesalahan'); } finally { setIsSubmitting(false); }
  };

  const handleEditKegiatan = (kegiatan: Kegiatan) => {
    setEditingId(kegiatan.id); setKegiatanTitle(kegiatan.title); setKegiatanDate(kegiatan.date); setKegiatanTime(kegiatan.time); setKegiatanLocation(kegiatan.location); setKegiatanImageUrls(kegiatan.imageUrls ? kegiatan.imageUrls.join('\n') : (kegiatan.imageUrl || '')); setKegiatanDescription(kegiatan.description); setShowAddForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditMobileLib = (ml: MobileLibrary) => {
    setEditingId(ml.id); setMlTitle(ml.title); setMlDate(ml.date); setMlTime(ml.time); setMlLocation(ml.location); setMlImageUrl(ml.imageUrl); setMlDescription(ml.description); setShowAddForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteKegiatan = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      try { const res = await fetch(`/api/kegiatan/${id}`, { method: 'DELETE' }); if (res.ok) fetchData(); else alert('Gagal menghapus kegiatan'); } catch (err) { console.error(err); }
    }
  };

  const handleDeleteMobileLib = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal pusling ini?')) {
      try { const res = await fetch(`/api/mobile-libraries/${id}`, { method: 'DELETE' }); if (res.ok) fetchData(); else alert('Gagal menghapus pusling'); } catch (err) { console.error(err); }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    if (activeTab === 'kegiatan') {
      setKegiatanTitle(''); setKegiatanDate(''); setKegiatanTime(''); setKegiatanLocation(''); setKegiatanImageUrls(''); setKegiatanFiles([]); setUploadMethod('url'); setKegiatanDescription(''); setCropImageSrc(''); setIsCropModalOpen(false);
    } else {
      setMlTitle(''); setMlDate(''); setMlTime(''); setMlLocation(''); setMlImageUrl(''); setMlDescription('');
    }
  };

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleDesktopSidebar = () => setIsDesktopSidebarOpen(!isDesktopSidebarOpen);

  if (loading) {
    return <LoadingSpinner text="Memverifikasi Sesi Akses..." fullScreen={true} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 top-20 bg-black/50 z-20 md:hidden" 
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-20 md:top-0 h-[calc(100vh-5rem)] md:h-screen left-0 z-20 md:z-30 shrink-0 bg-primary text-white flex flex-col border-r border-white/5 transform transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 p-8 ${isDesktopSidebarOpen ? '' : 'md:w-24 md:p-4 md:items-center'}`}>
        <div className={`mb-12 flex items-start w-full justify-start ${isDesktopSidebarOpen ? '' : 'md:justify-center'}`}>
          <Link href="/" className="flex items-center justify-center">
            <div className={`h-8 shrink-0 ${isDesktopSidebarOpen ? 'md:h-10' : 'md:h-8'}`}>
              <img src="/api/images/logo/logo-sudin-pusip.png" alt="Logo Sudin Pusip" className="h-full w-auto object-contain" />
            </div>
          </Link>
        </div>
        <nav className="space-y-4 flex-grow w-full">
          <button onClick={() => { setActiveTab('kegiatan'); setShowAddForm(false); resetForm(); }} className={`w-full p-3 rounded-xl font-bold flex items-center cursor-pointer border shadow-inner transition-all justify-start ${isDesktopSidebarOpen ? '' : 'md:justify-center'} ${activeTab === 'kegiatan' ? 'bg-white/10 text-secondary border-white/5' : 'hover:bg-white/5 text-slate-300 hover:text-white border-transparent'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap opacity-100 ml-3 w-auto ${isDesktopSidebarOpen ? '' : 'md:opacity-0 md:w-0 md:ml-0'}`}>Kelola Kegiatan</span>
          </button>

          <button onClick={() => { setActiveTab('mobile_libraries'); setShowAddForm(false); resetForm(); }} className={`w-full p-3 rounded-xl font-bold flex items-center cursor-pointer border shadow-inner transition-all justify-start ${isDesktopSidebarOpen ? '' : 'md:justify-center'} ${activeTab === 'mobile_libraries' ? 'bg-white/10 text-secondary border-white/5' : 'hover:bg-white/5 text-slate-300 hover:text-white border-transparent'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap opacity-100 ml-3 w-auto ${isDesktopSidebarOpen ? '' : 'md:opacity-0 md:w-0 md:ml-0'}`}>Kelola Pusling</span>
          </button>

          <Link href="/" className={`p-3 hover:bg-white/5 rounded-xl text-slate-300 hover:text-white transition-all flex items-center justify-start ${isDesktopSidebarOpen ? '' : 'md:justify-center'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap opacity-100 ml-3 w-auto ${isDesktopSidebarOpen ? '' : 'md:opacity-0 md:w-0 md:ml-0'}`}>Lihat Website</span>
          </Link>
        </nav>
        
        <div className={`mt-auto border-t border-white/10 text-[10px] text-slate-400 text-center transition-all duration-300 overflow-hidden opacity-100 pt-6 h-auto ${isDesktopSidebarOpen ? '' : 'md:opacity-0 md:pt-0 md:h-0'}`}>
          <span className="whitespace-nowrap">Sudin Pusip Jaksel v1.0</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300">
        <header className="h-20 shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={toggleMobileSidebar} className="md:hidden p-2 rounded-lg bg-slate-100 text-primary hover:bg-slate-200 transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg></button>
            <button onClick={toggleDesktopSidebar} className="hidden md:block p-2 rounded-lg bg-slate-100 text-primary hover:bg-slate-200 transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg></button>
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <div className="hidden sm:flex items-center gap-3 pr-6 border-r border-slate-100"><div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-primary font-bold text-xs">AD</div><span className="text-sm font-bold text-slate-700">Administrator</span></div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 font-bold text-sm border border-red-100 group"><span className="hidden sm:inline">Keluar</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg></button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
            <div>
                {activeTab === 'kegiatan' ? 'Daftar Kegiatan' : 'Daftar Pusling'}
              </h1>
              <p className="text-sm md:text-base text-slate-500">Kelola konten yang muncul di halaman utama website</p>
            </div>
            <button onClick={() => { if (showAddForm) { setShowAddForm(false); resetForm(); } else { resetForm(); setShowAddForm(true); } }} className="w-full md:w-auto bg-primary text-white px-6 md:px-8 py-3 md:py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-xl hover:shadow-primary/20">
              {showAddForm ? (
                <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> Batal</>
              ) : (
                <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> {activeTab === 'kegiatan' ? 'Tambah Kegiatan Baru' : 'Tambah Jadwal Pusling'}</>
              )}
            </button>
          </div>

          {showAddForm && activeTab === 'kegiatan' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-6 md:mb-8 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
                <h3 className="text-lg md:text-xl font-bold text-primary">{editingId ? 'Edit Kegiatan' : 'Form Input Kegiatan Baru'}</h3>
              </div>
              <form onSubmit={handleSubmitKegiatan} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Judul Kegiatan</label><input type="text" value={kegiatanTitle} onChange={(e) => setKegiatanTitle(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: Seminar Literasi..." required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Tanggal</label><input type="text" value={kegiatanDate} onChange={(e) => setKegiatanDate(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: 25 Agustus 2026" required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Waktu</label><input type="text" value={kegiatanTime} onChange={(e) => setKegiatanTime(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: 09:00 - 12:00 WIB" required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Lokasi</label><input type="text" value={kegiatanLocation} onChange={(e) => setKegiatanLocation(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: Aula Sudin Pusip / Zoom" required /></div>
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Deskripsi Kegiatan</label><textarea value={kegiatanDescription} onChange={(e) => setKegiatanDescription(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all h-32 text-slate-600 font-medium resize-none" placeholder="Deskripsikan kegiatan ini..." required /></div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2.5">Metode Upload Gambar / Poster</label>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                      <input type="radio" name="uploadMethod" checked={uploadMethod === 'url'} onChange={() => setUploadMethod('url')} className="w-4 h-4 text-primary" /> Input URL
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                      <input type="radio" name="uploadMethod" checked={uploadMethod === 'file'} onChange={() => setUploadMethod('file')} className="w-4 h-4 text-primary" /> Upload File Lokal
                    </label>
                  </div>
                  {uploadMethod === 'url' ? (
                    <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Tautan Gambar / Poster (Pisahkan dengan koma atau baris baru)</label><div className="flex flex-col sm:flex-row gap-4"><textarea value={kegiatanImageUrls} onChange={(e) => setKegiatanImageUrls(e.target.value)} className="flex-1 px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all h-24 text-slate-600 font-medium resize-none" placeholder="https://image1.jpg&#10;https://image2.jpg" /><div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">{kegiatanImageUrls ? <img src={kegiatanImageUrls.split(/[\n,]+/)[0].trim()} alt="Preview" className="w-full h-full object-cover" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-slate-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}</div></div></div>
                  ) : (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2.5">Pilih File Gambar (Satu per satu)</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            setCropImageSrc(URL.createObjectURL(file));
                            setIsCropModalOpen(true);
                            e.target.value = ''; // reset input
                          }
                        }} 
                        className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium bg-slate-50" 
                      />
                      {kegiatanFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-bold text-slate-700">Gambar yang akan diupload ({kegiatanFiles.length}):</p>
                          <div className="flex flex-wrap gap-3">
                            {kegiatanFiles.map((f, idx) => (
                              <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                <img src={URL.createObjectURL(f)} alt="crop-preview" className="w-full h-full object-cover" />
                                <button 
                                  type="button"
                                  onClick={() => setKegiatanFiles(prev => prev.filter((_, i) => i !== idx))}
                                  className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Hapus
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-4 pt-4"><button type="submit" disabled={isSubmitting} className={`flex-1 py-4 md:py-5 rounded-2xl font-extrabold text-white transition-all shadow-lg text-sm md:text-base flex items-center justify-center gap-3 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-light hover:-translate-y-1 active:translate-y-0 shadow-primary/20'}`}>{isSubmitting ? <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses Data...</> : (editingId ? 'Simpan Perubahan' : 'Publikasikan Kegiatan')}</button></div>
              </form>
              {isCropModalOpen && cropImageSrc && (
                <ImageCropModal 
                  imageSrc={cropImageSrc}
                  onCropCompleteAction={(croppedFile) => {
                    setKegiatanFiles(prev => [...prev, croppedFile]);
                    setIsCropModalOpen(false);
                    setCropImageSrc('');
                  }}
                  onClose={() => {
                    setIsCropModalOpen(false);
                    setCropImageSrc('');
                  }}
                />
              )}
            </div>
          )}

          {showAddForm && activeTab === 'mobile_libraries' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-6 md:mb-8 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg></div>
                <h3 className="text-lg md:text-xl font-bold text-primary">{editingId ? 'Edit Jadwal Pusling' : 'Form Input Jadwal Pusling Baru'}</h3>
              </div>
              <form onSubmit={handleSubmitMobileLib} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Judul / Tema Kunjungan</label><input type="text" value={mlTitle} onChange={(e) => setMlTitle(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: Kunjungan RPTRA Lenteng Agung" required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Tanggal</label><input type="text" value={mlDate} onChange={(e) => setMlDate(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: 15 Oktober 2026" required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Waktu</label><input type="text" value={mlTime} onChange={(e) => setMlTime(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: 09:00 - 14:00 WIB" required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Lokasi Rinci</label><input type="text" value={mlLocation} onChange={(e) => setMlLocation(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: RPTRA Taman Lenteng Agung, Jaksel" required /></div>
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Informasi Tambahan (Fasilitas / Aktivitas)</label><textarea value={mlDescription} onChange={(e) => setMlDescription(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all h-32 text-slate-600 font-medium resize-none" placeholder="Tuliskan informasi kegiatan pusling..." required /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Tautan Gambar Armada / Suasana (Opsional)</label><div className="flex flex-col sm:flex-row gap-4"><input type="text" value={mlImageUrl} onChange={(e) => setMlImageUrl(e.target.value)} className="flex-1 px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="https://..." /><div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">{mlImageUrl ? <img src={mlImageUrl} alt="Preview" className="w-full h-full object-cover" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-slate-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}</div></div></div>
                <div className="flex gap-4 pt-4"><button type="submit" disabled={isSubmitting} className={`flex-1 py-4 md:py-5 rounded-2xl font-extrabold text-white transition-all shadow-lg text-sm md:text-base flex items-center justify-center gap-3 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-light hover:-translate-y-1 active:translate-y-0 shadow-primary/20'}`}>{isSubmitting ? <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses Data...</> : (editingId ? 'Simpan Perubahan' : 'Publikasikan Jadwal')}</button></div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 md:px-8 py-5 md:py-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="font-bold text-primary">
                Data {activeTab === 'kegiatan' ? 'Kegiatan' : 'Jadwal Pusling'} Terdaftar
              </h3>
              <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                Total: {activeTab === 'kegiatan' ? kegiatan.length : mobileLibraries.length} Data
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Detail Konten</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Lokasi
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Jadwal
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">

                  {activeTab === 'kegiatan' && kegiatan.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 md:px-8 py-4 md:py-6"><div className="flex items-center gap-3 md:gap-4"><div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">{item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}</div><div className="min-w-0"><div className="font-bold text-primary truncate max-w-[150px] sm:max-w-xs md:max-w-sm text-sm md:text-base group-hover:text-primary-light transition-colors">{item.title}</div></div></div></td>
                      <td className="px-6 md:px-8 py-4 md:py-6"><div className="flex flex-col gap-1"><span className="text-xs text-slate-500 font-bold truncate max-w-[150px]">{item.location}</span></div></td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-xs md:text-sm text-slate-500 font-medium"><div className="flex flex-col gap-0.5"><span className="text-slate-700 font-bold">{item.date}</span><span>{item.time}</span></div></td>
                      <td className="px-6 md:px-8 py-4 md:py-6"><div className="flex justify-end gap-2"><button onClick={() => handleEditKegiatan(item)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-slate-400 hover:bg-primary hover:text-white transition-all bg-white border border-slate-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button><button onClick={() => handleDeleteKegiatan(item.id)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-slate-400 hover:bg-red-500 hover:text-white transition-all bg-white border border-slate-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button></div></td>
                    </tr>
                  ))}

                  {activeTab === 'mobile_libraries' && mobileLibraries.map((ml) => (
                    <tr key={ml.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 md:px-8 py-4 md:py-6"><div className="flex items-center gap-3 md:gap-4"><div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">{ml.imageUrl ? <img src={ml.imageUrl} alt="" className="w-full h-full object-cover" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-400"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>}</div><div className="min-w-0"><div className="font-bold text-primary truncate max-w-[150px] sm:max-w-xs md:max-w-sm text-sm md:text-base group-hover:text-primary-light transition-colors">{ml.title}</div></div></div></td>
                      <td className="px-6 md:px-8 py-4 md:py-6"><div className="flex flex-col gap-1"><span className="text-xs text-slate-500 font-bold truncate max-w-[150px]">{ml.location}</span></div></td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-xs md:text-sm text-slate-500 font-medium"><div className="flex flex-col gap-0.5"><span className="text-slate-700 font-bold">{ml.date}</span><span>{ml.time}</span></div></td>
                      <td className="px-6 md:px-8 py-4 md:py-6"><div className="flex justify-end gap-2"><button onClick={() => handleEditMobileLib(ml)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-slate-400 hover:bg-primary hover:text-white transition-all bg-white border border-slate-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button><button onClick={() => handleDeleteMobileLib(ml.id)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-slate-400 hover:bg-red-500 hover:text-white transition-all bg-white border border-slate-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {((activeTab === 'articles' && articles.length === 0) || (activeTab === 'kegiatan' && kegiatan.length === 0) || (activeTab === 'mobile_libraries' && mobileLibraries.length === 0)) && (
              <div className="py-16 md:py-20 text-center flex flex-col items-center gap-4 bg-slate-50/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 md:w-8 md:h-8">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-slate-400 font-medium">
                  Belum ada {activeTab === 'articles' ? 'artikel' : activeTab === 'kegiatan' ? 'kegiatan' : 'jadwal pusling'} yang terdaftar
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
