import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Newspaper, ArrowLeft, Clock, Search, ExternalLink, Calendar, ChevronRight } from 'lucide-react';
import { NewsSlider } from '../components/NewsSlider';
import Footer from '../components/layout/Footer';

export default function NewsListPage() {
  const [beritaList, setBeritaList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  useEffect(() => {
    fetchBerita(currentPage);
    // Scroll to top on mount or page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const fetchBerita = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/berita/public?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setBeritaList(data.data?.data || []);
        if (data.data?.pagination) {
          setTotalPages(data.data.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error('Error fetching berita:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBerita = beritaList.filter(b => 
    b.judul_berita.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.isi_draft && b.isi_draft.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100 selection:text-blue-700 font-sans">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm uppercase tracking-widest hidden sm:block">Kembali ke Beranda</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/logo-padang.svg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900">SIMAP <span className="text-blue-600">NEWS</span></h1>
            </div>
          </div>
          
          <div className="w-10 sm:w-40" /> {/* Spacer */}
        </div>
      </nav>

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <p className="text-blue-600 font-bold text-xs mb-3 uppercase tracking-[0.2em]">Pusat Informasi</p>
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                Eksplorasi Semua <br />
                <span className="text-blue-600">Berita & Kegiatan</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                Temukan arsip lengkap dokumentasi kegiatan pimpinan dan rilis berita terbaru dari Bagian Protokol dan Komunikasi Pimpinan.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-4 border border-slate-100 animate-pulse">
                  <div className="aspect-video bg-slate-100 rounded-[2rem] mb-6" />
                  <div className="h-4 bg-slate-100 rounded w-1/4 mb-4" />
                  <div className="h-6 bg-slate-100 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : filteredBerita.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
                {filteredBerita.map((berita) => (
                  <article
                    key={berita.id_draft_berita}
                    className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                  >
                    {/* Photo Slider */}
                    <div className="aspect-video bg-slate-100 overflow-hidden relative">
                      <NewsSlider dokumentasis={berita.dokumentasis} judul={berita.judul_berita} />
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                         </div>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none pt-0.5">
                          {berita.tanggal_kirim ? new Date(berita.tanggal_kirim).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                      
                      <h4 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors tracking-tight">
                        {berita.judul_berita}
                      </h4>
                      
                      {berita.isi_draft && (
                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium mb-8 flex-1">
                          {berita.isi_draft}
                        </p>
                      )}
                      
                      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                        <Link 
                          to={`/berita/${berita.id_draft_berita}`}
                          className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest group/btn hover:text-blue-600 transition-colors"
                        >
                          Baca Selengkapnya
                          <ArrowLeft className="w-4 h-4 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl text-sm font-bold transition-all ${
                          currentPage === page 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-slate-900 text-2xl font-bold mb-3">Berita tidak ditemukan</h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto">
                Maaf, kami tidak menemukan berita yang cocok dengan kata kunci "{searchTerm}".
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
