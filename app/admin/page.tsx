'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article, Event, MobileLibrary } from '@/lib/db';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'articles' | 'events' | 'mobile_libraries'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mobileLibraries, setMobileLibraries] = useState<MobileLibrary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  // Article Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Literasi');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventRegistrationUrl, setEventRegistrationUrl] = useState('');
  const [eventDescription, setEventDescription] = useState('');

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
      const [resArticles, resEvents, resMobileLibs] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/events'),
        fetch('/api/mobile-libraries')
      ]);

      if (resArticles.ok && resEvents.ok && resMobileLibs.ok) {
        setArticles(await resArticles.json());
        setEvents(await resEvents.json());
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

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const articleData = { title, category, date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), excerpt, content, imageUrl: imageUrl || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800' };
    try {
      const res = await fetch(editingId ? `/api/articles/${editingId}` : '/api/articles', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(articleData) });
      if (res.ok) { setShowAddForm(false); resetForm(); fetchData(); } else alert('Gagal menyimpan artikel');
    } catch (err) { console.error(err); alert('Terjadi kesalahan'); } finally { setIsSubmitting(false); }
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const eventData = { title: eventTitle, date: eventDate, time: eventTime, location: eventLocation, price: eventPrice, imageUrl: eventImageUrl, registrationUrl: eventRegistrationUrl, description: eventDescription };
    try {
      const res = await fetch(editingId ? `/api/events/${editingId}` : '/api/events', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventData) });
      if (res.ok) { setShowAddForm(false); resetForm(); fetchData(); } else alert('Gagal menyimpan event');
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

  const handleEditArticle = (article: Article) => {
    setEditingId(article.id); setTitle(article.title); setCategory(article.category); setExcerpt(article.excerpt); setContent(article.content); setImageUrl(article.imageUrl); setShowAddForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditEvent = (event: Event) => {
    setEditingId(event.id); setEventTitle(event.title); setEventDate(event.date); setEventTime(event.time); setEventLocation(event.location); setEventPrice(event.price); setEventImageUrl(event.imageUrl); setEventRegistrationUrl(event.registrationUrl); setEventDescription(event.description); setShowAddForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditMobileLib = (ml: MobileLibrary) => {
    setEditingId(ml.id); setMlTitle(ml.title); setMlDate(ml.date); setMlTime(ml.time); setMlLocation(ml.location); setMlImageUrl(ml.imageUrl); setMlDescription(ml.description); setShowAddForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      try { const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' }); if (res.ok) fetchData(); else alert('Gagal menghapus artikel'); } catch (err) { console.error(err); }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      try { const res = await fetch(`/api/events/${id}`, { method: 'DELETE' }); if (res.ok) fetchData(); else alert('Gagal menghapus event'); } catch (err) { console.error(err); }
    }
  };

  const handleDeleteMobileLib = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal pusling ini?')) {
      try { const res = await fetch(`/api/mobile-libraries/${id}`, { method: 'DELETE' }); if (res.ok) fetchData(); else alert('Gagal menghapus pusling'); } catch (err) { console.error(err); }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    if (activeTab === 'articles') {
      setTitle(''); setCategory('Literasi'); setExcerpt(''); setContent(''); setImageUrl('');
    } else if (activeTab === 'events') {
      setEventTitle(''); setEventDate(''); setEventTime(''); setEventLocation(''); setEventPrice(''); setEventImageUrl(''); setEventRegistrationUrl(''); setEventDescription('');
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
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg shadow-lg shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            </div>
            <div className={`transition-all duration-300 overflow-hidden opacity-100 w-32 ${isDesktopSidebarOpen ? '' : 'md:opacity-0 md:w-0'}`}>
              <h1 className="text-lg font-bold leading-none whitespace-nowrap">Sudin Pusip</h1>
              <p className="text-[10px] text-secondary uppercase tracking-widest font-bold whitespace-nowrap">Admin Panel</p>
            </div>
          </Link>
        </div>
        <nav className="space-y-4 flex-grow w-full">
          <button onClick={() => { setActiveTab('articles'); setShowAddForm(false); resetForm(); }} className={`w-full p-3 rounded-xl font-bold flex items-center cursor-pointer border shadow-inner transition-all justify-start ${isDesktopSidebarOpen ? '' : 'md:justify-center'} ${activeTab === 'articles' ? 'bg-white/10 text-secondary border-white/5' : 'hover:bg-white/5 text-slate-300 hover:text-white border-transparent'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap opacity-100 ml-3 w-auto ${isDesktopSidebarOpen ? '' : 'md:opacity-0 md:w-0 md:ml-0'}`}>Kelola Artikel</span>
          </button>

          <button onClick={() => { setActiveTab('events'); setShowAddForm(false); resetForm(); }} className={`w-full p-3 rounded-xl font-bold flex items-center cursor-pointer border shadow-inner transition-all justify-start ${isDesktopSidebarOpen ? '' : 'md:justify-center'} ${activeTab === 'events' ? 'bg-white/10 text-secondary border-white/5' : 'hover:bg-white/5 text-slate-300 hover:text-white border-transparent'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap opacity-100 ml-3 w-auto ${isDesktopSidebarOpen ? '' : 'md:opacity-0 md:w-0 md:ml-0'}`}>Kelola Event</span>
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
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">
                {activeTab === 'articles' ? 'Daftar Artikel' : activeTab === 'events' ? 'Daftar Event' : 'Daftar Pusling'}
              </h1>
              <p className="text-sm md:text-base text-slate-500">Kelola konten yang muncul di halaman utama website</p>
            </div>
            <button onClick={() => { if (showAddForm) { setShowAddForm(false); resetForm(); } else { resetForm(); setShowAddForm(true); } }} className="w-full md:w-auto bg-primary text-white px-6 md:px-8 py-3 md:py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-xl hover:shadow-primary/20">
              {showAddForm ? (
                <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> Batal</>
              ) : (
                <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> {activeTab === 'articles' ? 'Tambah Artikel Baru' : activeTab === 'events' ? 'Tambah Event Baru' : 'Tambah Jadwal Pusling'}</>
              )}
            </button>
          </div>

          {showAddForm && activeTab === 'articles' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-6 md:mb-8 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></div>
                <h3 className="text-lg md:text-xl font-bold text-primary">{editingId ? 'Edit Artikel' : 'Form Input Artikel'}</h3>
              </div>
              <form onSubmit={handleSubmitArticle} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Judul Artikel</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: Kunjungan Literasi..." required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Kategori Konten</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all bg-white text-slate-600 font-medium"><option>Literasi</option><option>Kearsipan</option><option>Penghargaan</option><option>Event</option></select></div>
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Ringkasan Pendek</label><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all h-24 text-slate-600 font-medium resize-none" placeholder="Tuliskan 1-2 kalimat ringkasan berita..." required /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Isi Artikel Lengkap</label><textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all h-40 md:h-56 text-slate-600 font-medium resize-none" placeholder="Tuliskan seluruh isi berita..." required /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Tautan Gambar (Unsplash/URL)</label><div className="flex flex-col sm:flex-row gap-4"><input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-1 px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="https://..." /><div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">{imageUrl ? <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-slate-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}</div></div></div>
                <div className="flex gap-4 pt-4"><button type="submit" disabled={isSubmitting} className={`flex-1 py-4 md:py-5 rounded-2xl font-extrabold text-white transition-all shadow-lg text-sm md:text-base flex items-center justify-center gap-3 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-light hover:-translate-y-1 active:translate-y-0 shadow-primary/20'}`}>{isSubmitting ? <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses Data...</> : (editingId ? 'Simpan Perubahan' : 'Publikasikan Artikel')}</button></div>
              </form>
            </div>
          )}

          {showAddForm && activeTab === 'events' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-6 md:mb-8 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
                <h3 className="text-lg md:text-xl font-bold text-primary">{editingId ? 'Edit Event' : 'Form Input Event Baru'}</h3>
              </div>
              <form onSubmit={handleSubmitEvent} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Judul Event</label><input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: Seminar Literasi..." required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Tanggal</label><input type="text" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: 25 Agustus 2026" required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Waktu</label><input type="text" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: 09:00 - 12:00 WIB" required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Lokasi</label><input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: Aula Sudin Pusip / Zoom" required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Biaya / Harga</label><input type="text" value={eventPrice} onChange={(e) => setEventPrice(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: Gratis atau Rp 50.000" required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Link Pendaftaran (Opsional)</label><input type="text" value={eventRegistrationUrl} onChange={(e) => setEventRegistrationUrl(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="Contoh: https://forms.gle/..." /></div>
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Deskripsi Event</label><textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all h-32 text-slate-600 font-medium resize-none" placeholder="Deskripsikan event ini..." required /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Tautan Gambar / Poster (Opsional)</label><div className="flex flex-col sm:flex-row gap-4"><input type="text" value={eventImageUrl} onChange={(e) => setEventImageUrl(e.target.value)} className="flex-1 px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="https://..." /><div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">{eventImageUrl ? <img src={eventImageUrl} alt="Preview" className="w-full h-full object-cover" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-slate-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}</div></div></div>
                <div className="flex gap-4 pt-4"><button type="submit" disabled={isSubmitting} className={`flex-1 py-4 md:py-5 rounded-2xl font-extrabold text-white transition-all shadow-lg text-sm md:text-base flex items-center justify-center gap-3 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-light hover:-translate-y-1 active:translate-y-0 shadow-primary/20'}`}>{isSubmitting ? <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses Data...</> : (editingId ? 'Simpan Perubahan' : 'Publikasikan Event')}</button></div>
              </form>
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
                Data {activeTab === 'articles' ? 'Artikel' : activeTab === 'events' ? 'Event' : 'Jadwal Pusling'} Terdaftar
              </h3>
              <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                Total: {activeTab === 'articles' ? articles.length : activeTab === 'events' ? events.length : mobileLibraries.length} Data
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Detail Konten</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      {activeTab === 'articles' ? 'Kategori' : 'Lokasi'}
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      {activeTab === 'articles' ? 'Waktu Rilis' : 'Jadwal'}
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeTab === 'articles' && articles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 md:px-8 py-4 md:py-6">
                        <div className="flex items-center gap-3 md:gap-4"><div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-inner">{article.imageUrl && <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />}</div><div className="min-w-0"><div className="font-bold text-primary truncate max-w-[150px] sm:max-w-xs md:max-w-sm text-sm md:text-base group-hover:text-primary-light transition-colors">{article.title}</div></div></div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6"><span className="px-2 md:px-3 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-bold uppercase tracking-wider border border-primary/10">{article.category}</span></td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-xs md:text-sm text-slate-500 font-medium">{article.date}</td>
                      <td className="px-6 md:px-8 py-4 md:py-6"><div className="flex justify-end gap-2"><button onClick={() => handleEditArticle(article)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-slate-400 hover:bg-primary hover:text-white transition-all bg-white border border-slate-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button><button onClick={() => handleDeleteArticle(article.id)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-slate-400 hover:bg-red-500 hover:text-white transition-all bg-white border border-slate-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button></div></td>
                    </tr>
                  ))}

                  {activeTab === 'events' && events.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 md:px-8 py-4 md:py-6"><div className="flex items-center gap-3 md:gap-4"><div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">{event.imageUrl ? <img src={event.imageUrl} alt="" className="w-full h-full object-cover" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}</div><div className="min-w-0"><div className="font-bold text-primary truncate max-w-[150px] sm:max-w-xs md:max-w-sm text-sm md:text-base group-hover:text-primary-light transition-colors">{event.title}</div></div></div></td>
                      <td className="px-6 md:px-8 py-4 md:py-6"><div className="flex flex-col gap-1"><span className="text-xs text-slate-500 font-bold truncate max-w-[150px]">{event.location}</span><span className={`w-max px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${event.price.toLowerCase() === 'gratis' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>{event.price}</span></div></td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-xs md:text-sm text-slate-500 font-medium"><div className="flex flex-col gap-0.5"><span className="text-slate-700 font-bold">{event.date}</span><span>{event.time}</span></div></td>
                      <td className="px-6 md:px-8 py-4 md:py-6"><div className="flex justify-end gap-2"><button onClick={() => handleEditEvent(event)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-slate-400 hover:bg-primary hover:text-white transition-all bg-white border border-slate-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button><button onClick={() => handleDeleteEvent(event.id)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-slate-400 hover:bg-red-500 hover:text-white transition-all bg-white border border-slate-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button></div></td>
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
            
            {((activeTab === 'articles' && articles.length === 0) || (activeTab === 'events' && events.length === 0) || (activeTab === 'mobile_libraries' && mobileLibraries.length === 0)) && (
              <div className="py-16 md:py-20 text-center flex flex-col items-center gap-4 bg-slate-50/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 md:w-8 md:h-8">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-slate-400 font-medium">
                  Belum ada {activeTab === 'articles' ? 'artikel' : activeTab === 'events' ? 'event' : 'jadwal pusling'} yang terdaftar
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
