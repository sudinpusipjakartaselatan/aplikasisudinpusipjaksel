'use client';

import { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold leading-none text-primary">Sudin Pusip</h1>
            <p className="text-[9px] md:text-[10px] font-semibold text-secondary uppercase tracking-widest">Jakarta Selatan</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Beranda</Link>
          <Link href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Profil</Link>
          <Link href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Layanan</Link>
          <Link href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Berita</Link>
          <Link href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Kontak</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-light transition-all premium-shadow">
            Layanan Online
          </button>
          
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
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0 py-0'}`}>
        <nav className="flex flex-col items-center gap-6 px-6">
          <Link href="/" className="text-base font-semibold text-foreground hover:text-primary transition-colors w-full text-center py-2" onClick={() => setIsMenuOpen(false)}>Beranda</Link>
          <Link href="#" className="text-base font-semibold text-foreground hover:text-primary transition-colors w-full text-center py-2" onClick={() => setIsMenuOpen(false)}>Profil</Link>
          <Link href="#" className="text-base font-semibold text-foreground hover:text-primary transition-colors w-full text-center py-2" onClick={() => setIsMenuOpen(false)}>Layanan</Link>
          <Link href="#" className="text-base font-semibold text-foreground hover:text-primary transition-colors w-full text-center py-2" onClick={() => setIsMenuOpen(false)}>Berita</Link>
          <Link href="#" className="text-base font-semibold text-foreground hover:text-primary transition-colors w-full text-center py-2" onClick={() => setIsMenuOpen(false)}>Kontak</Link>
          <button className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-4">
            Layanan Online
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
