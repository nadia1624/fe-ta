import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Building2, Calendar, FileText, Users, CheckCircle, ArrowRight, Clock, Shield, Newspaper, ChevronRight, ChevronLeft, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { NewsSlider } from '../components/NewsSlider';
import Footer from '../components/layout/Footer';


const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1600&q=80',
    alt: 'Rapat pimpinan'
  },
  {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
    alt: 'Kegiatan protokol'
  },
  {
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1600&q=80',
    alt: 'Gedung pemerintahan'
  },
];


export default function LandingPage() {
  const [beritaList, setBeritaList] = useState<any[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchBerita();
  }, []);

  // Auto-slide every 5 seconds
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const fetchBerita = async () => {
    try {
      const res = await fetch('/api/berita/public?limit=6');
      const data = await res.json();
      if (data.success) {
        setBeritaList(data.data?.data || []);
      }
    } catch (err) {
      console.error('Error fetching berita:', err);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  const features = [
    {
      icon: FileText,
      title: 'Pengelolaan Surat',
      description: 'Layanan administrasi surat permohonan agenda pimpinan yang terintegrasi secara digital dan real-time.'
    },
    {
      icon: Calendar,
      title: 'Manajemen Agenda',
      description: 'Kelola jadwal dan koordinasi agenda pimpinan melalui sistem yang terstruktur dan aman.'
    },
    {
      icon: Users,
      title: 'Koordinasi Tim',
      description: 'Penugasan dan monitoring staf protokol dan media untuk setiap kegiatan.',
    },
    {
      icon: Shield,
      title: 'Pelaporan & Dokumentasi',
      description: 'Sistem dokumentasi kegiatan dan pelaporan yang tersentralisasi.'
    }
  ];

  const steps = [
    { num: '01', title: 'Pengajuan Surat', desc: 'Pemohon mengajukan surat permohonan agenda kegiatan melalui platform' },
    { num: '02', title: 'Verifikasi', desc: 'Sespri memverifikasi kelengkapan dan kesesuaian permohonan' },
    { num: '03', title: 'Penugasan', desc: 'Kasubag menugaskan staf protokol dan media untuk kegiatan' },
    { num: '04', title: 'Pelaksanaan', desc: 'Kegiatan terlaksana dengan dokumentasi dan pelaporan lengkap' },
  ];

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Fitur', id: 'fitur' },
    { label: 'Alur', id: 'alur' },
    { label: 'Berita', id: 'berita' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl h-16 sm:h-20 flex items-center justify-between px-6">
            {/* Logo */}
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => scrollTo('hero')}>
              <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img src="/logo-padang.svg" alt="Logo Kota Padang" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">SIMAP</h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1 hidden sm:block">Sistem Informasi Manajemen Agenda Pimpinan</p>
              </div>
            </div>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <button className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                  Masuk
                </button>
              </Link>
              <Link to="/register">
                <button className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl active:scale-95">
                  Daftar Sekarang
                </button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-6 h-6 text-slate-600" /> : <Menu className="w-6 h-6 text-slate-600" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenu && (
            <div className="lg:hidden mt-2 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4 animate-fadeIn">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="block w-full text-left px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link to="/login" className="w-full">
                  <button className="w-full px-4 py-3 text-sm font-bold text-slate-700 bg-slate-50 rounded-xl">Masuk</button>
                </Link>
                <Link to="/register" className="w-full">
                  <button className="w-full px-4 py-3 text-sm font-bold text-white bg-slate-900 rounded-xl shadow-lg">Daftar Sekarang</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background immersive slider */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: currentSlide === index ? 1 : 0 }}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover scale-105"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-brightness-[0.8]" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight">
            Manajemen <br /> 
            Agenda Pimpinan
          </h2>

          <p className="text-lg sm:text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            Transformasi digital untuk pengelolaan protokol, koordinasi tim media, dan monitoring agenda pemerintahan dalam satu dashboard yang efisien dan transparan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-2xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3">
                Mulai Pengajuan
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <button 
              onClick={() => scrollTo('fitur')}
              className="w-full sm:w-auto px-10 h-16 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Pelajari Fitur
              <ChevronRight className="w-5 h-5 opacity-60" />
            </button>
          </div>

          {/* Slide Indicator Overlay */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentSlide === i ? 'w-12 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-blue-600 font-bold text-xs mb-3 uppercase tracking-[0.2em]">Layanan Unggulan</p>
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">Manajemen Agenda Terpadu</h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Sistem digital yang dirancang untuk mempermudah koordinasi agenda pimpinan, pengelolaan surat permohonan, dan dokumentasi kegiatan dalam satu platform terintegrasi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group bg-white hover:bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-blue-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] relative overflow-hidden">
                  {/* Hover Accent */}
                  <div className="absolute top-0 left-0 w-2 h-0 group-hover:h-full bg-blue-600 transition-all duration-500" />
                  
                  <div className="w-14 h-14 bg-blue-50/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm border border-blue-100/50">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">{feature.title}</h4>
                  <p className="text-slate-500 group-hover:text-slate-600 transition-colors text-sm leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-50 rounded-full blur-[100px] opacity-50" />
      </section>

      {/* Process Section */}
      <section id="alur" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-100 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.04),rgba(255,255,255,0))]" />
         <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-blue-600 font-bold text-xs mb-3 uppercase tracking-[0.2em]">Workflow</p>
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">Alur Kerja Digital</h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Setiap langkah dirancang untuk transparansi dan kecepatan maksimal dalam pelayanan pimpinan.
            </p>
          </div>

          <div className="relative">
             {/* Connection Line */}
             <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-slate-200/0 via-slate-300 to-slate-200/0" />
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="group relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center text-3xl font-black text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-200">
                    {step.num}
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors tracking-tight">{step.title}</h4>
                  <p className="text-slate-500 group-hover:text-slate-600 transition-colors text-sm leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              ))}
             </div>
          </div>
        </div>
      </section>

      {/* Berita Section */}
      <section id="berita" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="text-left">
              <p className="text-blue-600 font-bold text-xs mb-3 uppercase tracking-[0.2em]">Latest Update</p>
              <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Berita Terbaru</h3>
            </div>
            
            <div className="flex items-center gap-6">
              <p className="text-slate-500 max-w-md font-medium text-right hidden lg:block">
                Ikuti kabar terbaru dan monitoring dokumentasi kegiatan pimpinan secara transparan.
              </p>
              <Link to="/berita">
                <button className="px-6 h-12 bg-white border-2 border-slate-100 hover:border-blue-600 hover:text-blue-600 text-slate-900 font-bold rounded-xl transition-all duration-300 flex items-center gap-2 group shadow-sm hover:shadow-md whitespace-nowrap">
                  Semua Berita
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform cursor-pointer" />
                </button>
              </Link>
            </div>
          </div>

          {beritaList.length > 0 ? (
            <div className="flex flex-col gap-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {beritaList.slice(0, 3).map((berita) => (
                  <article
                    key={berita.id_draft_berita}
                    className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2"
                  >
                  {/* Photo Slider */}
                  <div className="aspect-video bg-slate-100 overflow-hidden relative">
                    <NewsSlider dokumentasis={berita.dokumentasis} judul={berita.judul_berita} />
                  </div>
                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600" />
                       </div>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none pt-0.5">
                        {berita.tanggal_kirim ? new Date(berita.tanggal_kirim).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors tracking-tight">
                      {berita.judul_berita}
                    </h4>
                    {berita.isi_draft && (
                      <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium mb-8">
                        {berita.isi_draft}
                      </p>
                    )}
                    <Link to={`/berita/${berita.id_draft_berita}`}>
                      <button className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                        Detail Lengkap
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-900 text-xl font-bold mb-2">Belum ada berita yang tersedia</p>
              <p className="text-slate-400 font-medium">Monitoring harian akan muncul di panel ini</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-100 relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(37,99,235,0.07),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Card */}
            <h3 className="text-3xl sm:text-5xl text-center font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Siap Mengelola Agenda <br className="hidden sm:block" />
              <span className="text-blue-600">Dengan Lebih Mudah?</span>
            </h3>
            <p className="text-slate-500 text-lg sm:text-xl text-center mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Gunakan sistem manajemen agenda untuk mengatur jadwal, tugas protokol, dan koordinasi pimpinan secara efisien.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
                  Daftar Akun
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 h-14 bg-white hover:bg-white/15 border border-white/15 text-slate-900 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                  Login Sistem
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              </Link>
            </div>
        </div>

        {/* Decor */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-slate-300/30 rounded-full blur-3xl pointer-events-none" />
      </section>

      <Footer navLinks={navLinks} scrollTo={scrollTo} />
    </div>
  );
}
