'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/lib/db';
import Link from 'next/link';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Literasi');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
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

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newArticle = {
      title,
      category,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      excerpt,
      content,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800'
    };

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });

      if (res.ok) {
        setShowAddForm(false);
        resetForm();
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Literasi');
    setExcerpt('');
    setContent('');
    setImageUrl('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Memverifikasi Sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white p-8 hidden md:flex flex-col border-r border-white/5">
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Sudin Pusip</h1>
              <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Admin Panel</p>
            </div>
          </Link>
        </div>
        <nav className="space-y-4 flex-grow">
          <div className="p-3 bg-white/10 rounded-xl text-secondary font-bold flex items-center gap-3 cursor-default border border-white/5 shadow-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Kelola Artikel
          </div>
          <Link href="/" className="p-3 hover:bg-white/5 rounded-xl block text-slate-300 hover:text-white transition-all flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Lihat Website
          </Link>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/10 text-[10px] text-slate-400 text-center">
          Sudin Pusip Jaksel v1.0
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-30">
          <div className="md:hidden flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-white">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              </svg>
            </div>
            <span className="font-bold text-primary">Admin</span>
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
            <div className="hidden sm:flex items-center gap-3 pr-6 border-r border-slate-100">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-primary font-bold text-xs">
                AD
              </div>
              <span className="text-sm font-bold text-slate-700">Administrator</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 font-bold text-sm border border-red-100 group"
            >
              <span>Keluar</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Daftar Artikel</h1>
              <p className="text-slate-500">Kelola konten yang muncul di halaman utama website</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full md:w-auto bg-primary text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-xl hover:shadow-primary/20"
            >
              {showAddForm ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Batal
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Tambah Artikel Baru
                </>
              )}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary">Form Input Artikel</h3>
              </div>

              <form onSubmit={handleAddArticle} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2.5">Judul Artikel</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium"
                      placeholder="Contoh: Kunjungan Literasi RPTRA..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2.5">Kategori Konten</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all bg-white text-slate-600 font-medium"
                    >
                      <option>Literasi</option>
                      <option>Kearsipan</option>
                      <option>Penghargaan</option>
                      <option>Event</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2.5">Ringkasan Pendek</label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all h-24 text-slate-600 font-medium resize-none"
                    placeholder="Tuliskan 1-2 kalimat ringkasan berita..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2.5">Isi Artikel Lengkap</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all h-56 text-slate-600 font-medium resize-none"
                    placeholder="Tuliskan seluruh isi berita secara mendalam..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2.5">Tautan Gambar (Unsplash/URL)</label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-slate-300">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-5 rounded-2xl font-extrabold text-white transition-all shadow-lg ${
                      isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-light hover:-translate-y-1 active:translate-y-0 shadow-primary/20'
                    }`}
                  >
                    {isSubmitting ? 'Memproses Data...' : 'Publikasikan Artikel Sekarang'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-primary">Data Artikel Terdaftar</h3>
              <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                Total: {articles.length} Artikel
              </span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Detail Konten</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Kategori</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Waktu Rilis</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-inner">
                          <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-primary truncate max-w-xs group-hover:text-primary-light transition-colors">{article.title}</div>
                          <div className="text-[10px] text-slate-400 md:hidden mt-1">{article.category} • {article.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <span className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-bold uppercase tracking-wider border border-primary/10">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium hidden md:table-cell">{article.date}</td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm bg-white border border-slate-100">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm bg-white border border-slate-100">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {articles.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center gap-4 bg-slate-50/20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" />
                  </svg>
                </div>
                <p className="text-slate-400 font-medium">Belum ada artikel yang terdaftar</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
