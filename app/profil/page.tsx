import Image from "next/image";
import profilImg from "@/database/image/profiles/profil.jpeg";
import fungsiSudinImg from "@/database/image/profiles/fungsi-sudin.jpeg";
import fungsiSubbagImg from "@/database/image/profiles/fungsi-subbag.jpeg";
import fungsiSeksiPerpusImg from "@/database/image/profiles/fungsi-seksi-perpus.jpeg";
import fungsiSeksiArsipImg from "@/database/image/profiles/fungsi-seksi-arsip.jpeg";

export default function ProfilPage() {
  const images = [
    { src: profilImg, alt: "Profil", color: "from-blue-500 to-indigo-600" },
    { src: fungsiSudinImg, alt: "Fungsi Sudin", color: "from-teal-400 to-emerald-500" },
    { src: fungsiSubbagImg, alt: "Fungsi Subbag", color: "from-amber-400 to-orange-500" },
    { src: fungsiSeksiPerpusImg, alt: "Fungsi Seksi Perpus", color: "from-purple-500 to-pink-500" },
    { src: fungsiSeksiArsipImg, alt: "Fungsi Seksi Arsip", color: "from-rose-400 to-red-500" },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-slate-50 py-16 px-4 sm:px-8">
      <div className="w-full max-w-4xl flex flex-col gap-16">
        {images.map((img, index) => (
          <div 
            key={index} 
            className="w-full relative group"
          >
            {/* Soft glow effect behind the frame */}
            <div className={`absolute -inset-2 bg-gradient-to-r ${img.color} rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-70 transition duration-500`}></div>
            
            {/* Colored Frame */}
            <div className={`relative bg-gradient-to-br ${img.color} p-3 sm:p-5 md:p-6 rounded-[2rem] shadow-2xl group-hover:-translate-y-3 transition-all duration-500 ease-out`}>
              {/* Inner Image Wrapper */}
              <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl shadow-inner border-2 border-white/30 bg-white">
                <Image 
                  src={img.src} 
                  alt={img.alt}
                  className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  placeholder="blur"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

