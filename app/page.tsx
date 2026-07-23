import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import KegiatanCard from '@/components/KegiatanCard';
import MobileLibraryCard from '@/components/MobileLibraryCard';
import { getKegiatan, getMobileLibraries } from '@/lib/db';
import Link from 'next/link';

export default async function Home() {
  const kegiatan = (await getKegiatan()).slice(0, 4); // Show only top 4 kegiatan
  const mobileLibraries = (await getMobileLibraries()).slice(0, 4); // Show only top 4


  return (
    <div className="overflow-x-hidden">
      <Hero />
      
      {/* Events Section */}
      <section className="py-16 md:py-24 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-heading-text mb-4">
                <span className="text-secondary">Agenda</span> Kegiatan
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Jangan lewatkan berbagai kegiatan menarik yang kami selenggarakan. Segera daftarkan diri Anda sebelum kuota penuh!
              </p>
            </div>
            <Link href="/kegiatan" className="text-sm font-bold text-heading-text hover:text-blue-500 transition-colors flex items-center gap-2 pb-1 border-b-2 border-primary-light/20 hover:border-blue-500 shrink-0">
              Lihat Semua Agenda
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {kegiatan.length > 0 ? (
              kegiatan.map((item) => (
                <KegiatanCard 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  date={item.date}
                  time={item.time}
                  location={item.location}
                  imageUrl={item.imageUrl}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-muted-foreground bg-white rounded-3xl border border-border">
                Belum ada jadwal kegiatan terbaru.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Library Section */}
      <section className="py-16 md:py-24 bg-white border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-heading-text mb-4">
                <span className="text-secondary">Jadwal</span> Perpustakaan Keliling
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Kami hadir lebih dekat dengan Anda. Cek jadwal dan lokasi armada perpustakaan keliling kami di wilayah Jakarta Selatan.
              </p>
            </div>
            <Link href="/pusling" className="text-sm font-bold text-heading-text hover:text-blue-500 transition-colors flex items-center gap-2 pb-1 border-b-2 border-primary-light/20 hover:border-blue-500 shrink-0">
              Lihat Semua Jadwal
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {mobileLibraries.length > 0 ? (
              mobileLibraries.map((library) => (
                <MobileLibraryCard 
                  key={library.id}
                  id={library.id}
                  title={library.namaLokasi || library.title || 'Lokasi Belum Ditentukan'}
                  date={library.tanggal || library.date || '-'}
                  hari={library.hari}
                  time={library.jamLayanan || library.time || ''}
                  location={library.kelurahan || library.location || '-'}
                  imageUrl={library.imageUrl}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-muted-foreground bg-slate-50 rounded-3xl border border-border">
                Belum ada jadwal perpustakaan keliling terbaru.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Cultural Section */}
      <section className="py-16 md:py-20 bg-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-secondary/5 md:-skew-x-12 md:translate-x-1/4"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="p-6 md:p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Budayakan Membaca</h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">Jadikan membaca sebagai kebiasaan positif untuk memperluas wawasan dan pengetahuan setiap hari.</p>
            </div>
            
            <div className="p-6 md:p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Tingkatkan Literasi</h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">Membangun generasi cerdas dan berkarakter melalui peningkatan budaya literasi masyarakat.</p>
            </div>
            
            <div className="p-6 md:p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Ruang Berbagi</h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">Jadikan perpustakaan sebagai ruang inklusif untuk bertukar ide, berdiskusi, dan berkolaborasi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-card rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 premium-shadow border border-border text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-4xl font-bold text-heading-text mb-4 md:mb-6">
                Siap Menjadi Bagian dari <span className="text-secondary">Warga Literat?</span>
              </h2>
              <p className="text-muted-foreground mb-0 leading-relaxed text-base md:text-lg">
                Daftarkan diri Anda sebagai anggota perpustakaan secara online dan nikmati akses ke ribuan koleksi digital kami sekarang juga.
              </p>
            </div>
            <div className="flex shrink-0 w-full md:w-auto">
              <button className="w-full md:w-auto bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold hover:bg-primary-light transition-all premium-shadow text-base md:text-lg">
                Daftar Anggota Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
