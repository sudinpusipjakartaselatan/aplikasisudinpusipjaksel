'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="h-8 md:h-10 shrink-0">
            <img src="/api/images/logo/logo-sudin-pusip.png" alt="Logo Sudin Pusip" className="h-full w-auto object-contain" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-secondary ${pathname === '/' ? 'text-heading-text' : 'text-foreground'}`}>Beranda</Link>
          <Link href="/profil" className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-secondary ${pathname === '/profil' ? 'text-heading-text' : 'text-foreground'}`}>Profil</Link>
          <Link href="/layanan" className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-secondary ${pathname === '/layanan' ? 'text-heading-text' : 'text-foreground'}`}>Layanan</Link>
          <Link href="/kegiatan" className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-secondary ${pathname === '/kegiatan' ? 'text-heading-text' : 'text-foreground'}`}>Kegiatan</Link>
          <Link href="/pusling" className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-secondary ${pathname === '/pusling' ? 'text-heading-text' : 'text-foreground'}`}>Pusling</Link>
          <Link href="/kontak" className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-secondary ${pathname === '/kontak' ? 'text-heading-text' : 'text-foreground'}`}>Kontak</Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-foreground"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            )}
          </button>

          <a 
            href="https://wa.me/6281292236799?text=Halo%2C%20saya%20ingin%20menghubungi%20admin%20sudinpusipjaksel"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-light transition-all shadow-sm"
          >
            Hubungi Admin
          </a>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-primary hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-background border-b border-border transition-all duration-300 ease-in-out overflow-hidden shadow-lg ${isMenuOpen ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0 py-0'}`}>
        <nav className="flex flex-col items-center gap-6 px-6">
          <Link href="/" className={`text-base font-semibold transition-colors w-full text-center py-2 ${pathname === '/' ? 'text-heading-text' : 'text-foreground hover:text-primary dark:hover:text-secondary'}`} onClick={() => setIsMenuOpen(false)}>Beranda</Link>
          <Link href="/profil" className={`text-base font-semibold transition-colors w-full text-center py-2 ${pathname === '/profil' ? 'text-heading-text' : 'text-foreground hover:text-primary dark:hover:text-secondary'}`} onClick={() => setIsMenuOpen(false)}>Profil</Link>
          <Link href="/layanan" className={`text-base font-semibold transition-colors w-full text-center py-2 ${pathname === '/layanan' ? 'text-heading-text' : 'text-foreground hover:text-primary dark:hover:text-secondary'}`} onClick={() => setIsMenuOpen(false)}>Layanan</Link>
          <Link href="/kegiatan" className={`text-base font-semibold transition-colors w-full text-center py-2 ${pathname === '/kegiatan' ? 'text-heading-text' : 'text-foreground hover:text-primary dark:hover:text-secondary'}`} onClick={() => setIsMenuOpen(false)}>Kegiatan</Link>
          <Link href="/pusling" className={`text-base font-semibold transition-colors w-full text-center py-2 ${pathname === '/pusling' ? 'text-heading-text' : 'text-foreground hover:text-primary dark:hover:text-secondary'}`} onClick={() => setIsMenuOpen(false)}>Pusling</Link>
          <Link href="/kontak" className={`text-base font-semibold transition-colors w-full text-center py-2 ${pathname === '/kontak' ? 'text-heading-text' : 'text-foreground hover:text-primary dark:hover:text-secondary'}`} onClick={() => setIsMenuOpen(false)}>Kontak</Link>
          <a 
            href="https://wa.me/6281292236799?text=Halo%2C%20saya%20ingin%20menghubungi%20admin%20sudinpusipjaksel"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-primary text-white py-3 rounded-xl font-bold mt-4 hover:bg-primary-light transition-all shadow-sm"
          >
            Hubungi Admin
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
