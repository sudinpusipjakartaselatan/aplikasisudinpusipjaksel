const Hero = () => {
  return (
    <section className="relative py-12 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-secondary/20 border border-secondary/30">
              <span className="text-[10px] md:text-xs font-bold text-heading-text tracking-widest uppercase">Pusat Literasi Jakarta Selatan</span>
            </div>
            <h1 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight text-heading-text">
              Membangun Generasi Literat & Menjaga Warisan Arsip
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Selamat datang di portal resmi Suku Dinas Perpustakaan dan Kearsipan Jakarta Selatan. Temukan ribuan koleksi buku dan layanan kearsipan modern kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-light transition-all premium-shadow flex items-center justify-center gap-2">
                Jelajahi Koleksi
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="bg-card text-heading-text border border-border px-8 py-4 rounded-xl font-bold hover:bg-muted transition-all">
                Layanan Kearsipan
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative order-1 md:order-2 w-full max-w-md md:max-w-none mx-auto">
            <div className="w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden premium-shadow transform md:rotate-3">
               <img 
                 src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200" 
                 alt="Perpustakaan Jakarta Selatan"
                 className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
               />
            </div>
            <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-card p-4 md:p-6 rounded-xl md:rounded-2xl shadow-2xl border border-border hidden sm:block">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-6 md:h-6 text-green-600">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium">Buku Tersedia</p>
                  <p className="text-lg md:text-xl font-bold text-heading-text">50.000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
