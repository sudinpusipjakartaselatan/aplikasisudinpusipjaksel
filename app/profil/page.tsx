import Image from "next/image";

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200"
          alt="Gedung Suku Dinas Perpustakaan"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Profil Kami
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Mengenal lebih dekat Suku Dinas Perpustakaan dan Kearsipan Kota Administrasi Jakarta Selatan.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Visi & Misi</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                <strong>Visi:</strong> Mewujudkan Jakarta sebagai kota yang maju, lestari, dan berbudaya dengan warga yang sejahtera dan tangguh melalui peningkatan literasi dan pengelolaan arsip yang unggul.
              </p>
              <p>
                <strong>Misi:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Meningkatkan kegemaran membaca dan indeks literasi masyarakat.</li>
                <li>Menyelenggarakan pelayanan perpustakaan yang modern, inklusif, dan berbasis teknologi terapan.</li>
                <li>Melakukan pembinaan dan pengawasan pengelolaan arsip daerah secara komprehensif.</li>
                <li>Melestarikan bahan pustaka dan arsip sebagai memori kolektif bangsa.</li>
              </ul>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800"
              alt="Perpustakaan"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Tugas dan Fungsi</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Suku Dinas Perpustakaan dan Kearsipan Kota Administrasi Jakarta Selatan bertugas menyelenggarakan urusan pemerintahan di bidang perpustakaan dan bidang kearsipan. Kami senantiasa berinovasi untuk memberikan pelayanan prima kepada masyarakat luas, pelajar, mahasiswa, dan pemangku kepentingan lainnya.
          </p>
        </div>
      </div>
    </div>
  );
}
