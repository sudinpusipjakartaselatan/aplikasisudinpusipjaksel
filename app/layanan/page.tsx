import Image from "next/image";
import Link from "next/link";

export default function LayananPage() {
  const services = [
    {
      title: "Layanan Sirkulasi",
      description: "Peminjaman dan pengembalian koleksi buku, majalah, dan bahan pustaka lainnya untuk anggota perpustakaan.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      link: "/layanan#"
    },
    {
      title: "Perpustakaan Keliling",
      description: "Mendekatkan layanan perpustakaan ke sekolah, RPTRA, dan titik kumpul masyarakat menggunakan armada mobil perpustakaan keliling.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      link: "/layanan#"
    },
    {
      title: "Konsultasi Kearsipan",
      description: "Memberikan bimbingan teknis dan konsultasi terkait pengelolaan arsip dinamis dan statis bagi instansi pemerintah dan masyarakat.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      link: "/layanan#"
    },
    {
      title: "Ruang Baca Anak",
      description: "Area khusus anak yang dirancang nyaman, edukatif, dan interaktif untuk menumbuhkan minat baca sejak dini.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      link: "/layanan#"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200"
          alt="Layanan Suku Dinas"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Layanan Kami
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Berbagai fasilitas dan kemudahan yang kami sediakan untuk meningkatkan literasi masyarakat.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Link 
              href={service.link} 
              key={index} 
              className="group bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 rotate-3 group-hover:rotate-0">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-4 group-hover:text-blue-500 transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {service.description}
              </p>
              <div className="mt-8 text-primary font-bold text-sm inline-flex items-center gap-2 group-hover:text-blue-500 transition-colors">
                Pelajari
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
