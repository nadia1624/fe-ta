import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, User, Clock, Share2, Link as LinkIcon, Newspaper, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import Footer from '../components/layout/Footer';

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function NewsDetailPage() {
  const { id } = useParams();
  const [berita, setBerita] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showCopyAlert, setShowCopyAlert] = useState(false);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = berita?.judul_berita || 'Berita SIMAP';
    
    const shareText = `${text}\n\nBaca selengkapnya di: ${url}`;
    
    switch (platform) {
      case 'x':
        window.open(`https://x.com/intent/post?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setShowCopyAlert(true);
        setTimeout(() => setShowCopyAlert(false), 3000);
        break;
    }
  };


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
            <button 
              onClick={() => handleShare('copy')}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors hidden sm:block"
            >
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
                  {berita.updatedAt ? new Date(berita.updatedAt).toLocaleDateString('id-ID', {
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
              <button 
                onClick={() => handleShare('whatsapp')}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                title="WhatsApp"
              >
                <WhatsAppIcon />
              </button>
              <button 
                onClick={() => handleShare('x')}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                title="X"
              >
                <XIcon />
              </button>

              <button 
                onClick={() => handleShare('copy')}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all transform hover:-translate-y-1 shadow-sm"
                title="Salin Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              
              {showCopyAlert && (
                <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg animate-in fade-in zoom-in duration-300">
                  Link disalin!
                </div>
              )}
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
             <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-lg sm:text-xl text-justify">
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

      <Footer />
    </div>
  );
}
