import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Link as LinkIcon, Newspaper, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';

export default function NewsDetailPage() {
  const { id } = useParams();
  const [berita, setBerita] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchBeritaDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchBeritaDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/berita/public/${id}`);
      const data = await res.json();
      if (data.success) {
        setBerita(data.data);
      }
    } catch (err) {
      console.error('Error fetching berita detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col pt-32 px-4 animate-pulse">
        <div className="max-w-4xl mx-auto w-full">
          <div className="h-4 bg-slate-100 rounded w-24 mb-6" />
          <div className="h-12 bg-slate-100 rounded w-3/4 mb-4" />
          <div className="h-12 bg-slate-100 rounded w-1/2 mb-10" />
          <div className="aspect-video bg-slate-100 rounded-[2.5rem] mb-10" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
            <Newspaper className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Berita Tidak Ditemukan</h2>
          <p className="text-slate-500 font-medium mb-8">
            Maaf, berita yang Anda cari mungkin telah dihapus atau link yang Anda gunakan salah.
          </p>
          <Link to="/berita">
            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10">
              Kembali ke Daftar Berita
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const images = berita.dokumentasis || [];
  const mainImage = images.length > 0 
    ? `/api/uploads/berita/${images[activeImage].file_path.replace(/\\/g, '/')}`
    : null;

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700 font-sans">
      {/* Article Header & Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/berita" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-widest hidden sm:block">Kembali</span>
          </Link>
          
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 brightness-100">
                <img src="/logo-padang.svg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <p className="text-lg font-black tracking-tighter text-slate-900">SIMAP <span className="text-blue-600">NEWS</span></p>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors hidden sm:block">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          {/* Metadata */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-6 text-xs font-bold uppercase tracking-widest">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">Katalog Berita</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {berita.tanggal_kirim ? new Date(berita.tanggal_kirim).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>Oleh {berita.staff?.nama || 'Admin'}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
              {berita.judul_berita}
            </h1>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Bagikan:</p>
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-sky-500 hover:text-white transition-all transform hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all transform hover:-translate-y-1">
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Featured Image & Gallery */}
          <div className="mb-16 space-y-6">
            <div className="aspect-video bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 group relative border border-slate-100">
               {mainImage ? (
                 <img src={mainImage} alt={berita.judul_berita} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon className="w-16 h-16 mb-4" />
                    <p className="font-bold tracking-widest uppercase text-xs">No documentation available</p>
                 </div>
               )}
               
               {images.length > 1 && (
                 <>
                   <button 
                     onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                     className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:text-slate-900 transition-all duration-300"
                   >
                     <ChevronLeft className="w-6 h-6" />
                   </button>
                   <button 
                     onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                     className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:text-slate-900 transition-all duration-300"
                   >
                     <ChevronRight className="w-6 h-6" />
                   </button>
                 </>
               )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${
                      idx === activeImage ? 'border-blue-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img 
                      src={`/api/uploads/berita/${img.file_path.replace(/\\/g, '/')}`} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="prose prose-slate prose-lg lg:prose-xl max-w-none">
             <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-lg sm:text-xl">
               {berita.isi_draft}
             </div>
          </div>

          {/* Interaction Footer */}
          <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
            <Link to="/berita">
              <button className="flex items-center gap-3 text-sm font-bold text-blue-600 uppercase tracking-widest hover:gap-5 transition-all">
                <ArrowLeft className="w-5 h-5" />
                Kembali ke Daftar Berita
              </button>
            </Link>
            
            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-xs font-bold uppercase tracking-widest pt-0.5">Berita Terverifikasi</span>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </div>
        </article>
      </main>

      {/* Footer Minimalist */}
      <footer className="footer bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-12">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 brightness-200 grayscale opacity-80">
                <img src="/logo-padang.svg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <p className="text-base font-black tracking-tighter text-white uppercase">SIMAP <span className="text-blue-400 opacity-60">NEWS</span></p>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
             &copy; {new Date().getFullYear()} DINAS KOMUNIKASI DAN INFORMATIKA KOTA PADANG
          </p>
        </div>
      </footer>
    </div>
  );
}
