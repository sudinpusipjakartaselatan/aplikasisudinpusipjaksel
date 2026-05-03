import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-lg font-bold leading-none text-white">Sudin Pusip</h1>
                <p className="text-[10px] font-semibold text-secondary uppercase tracking-widest">Jakarta Selatan</p>
              </div>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed text-center md:text-left">
              Melayani masyarakat Jakarta Selatan dalam peningkatan literasi dan penyelamatan arsip daerah yang berharga.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-6 text-secondary">Tautan Cepat</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li><Link href="#" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Layanan Perpustakaan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Layanan Kearsipan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Agenda Kegiatan</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-6 text-secondary">Kontak Kami</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-secondary shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-left">Jl. Gandaria Tengah V No.3, Kramat Pela, Kec. Kby. Baru, Jakarta Selatan</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-secondary shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>(021) 7208151</span>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-6 text-secondary">Media Sosial</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-400 text-[10px] md:text-xs">
            © 2024 Sudin Perpustakaan dan Kearsipan Kota Administrasi Jakarta Selatan.
          </p>
          <div className="flex gap-6 text-[10px] md:text-xs text-slate-400">
            <Link href="#" className="hover:text-white">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
