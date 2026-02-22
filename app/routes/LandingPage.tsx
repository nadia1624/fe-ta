import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Building2, Calendar, FileText, Users, CheckCircle, ArrowRight, Clock, Shield, Newspaper, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';

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
      const res = await fetch('/api/berita/public');
      const data = await res.json();
      if (data.success) {
        setBeritaList(data.data || []);
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
      description: 'Ajukan dan lacak surat permohonan agenda kegiatan secara digital dan real-time.',
      bg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Calendar,
      title: 'Manajemen Agenda',
      description: 'Kelola jadwal dan agenda pimpinan dengan sistem terintegrasi dan terstruktur.',
      bg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      icon: Users,
      title: 'Koordinasi Tim',
      description: 'Penugasan dan monitoring staf protokol dan media untuk setiap kegiatan.',
      bg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Pelaporan & Dokumentasi',
      description: 'Sistem dokumentasi kegiatan dan pelaporan yang tersentralisasi.',
      bg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    }
  ];

  const steps = [
    { num: '01', title: 'Pengajuan Surat', desc: 'Pemohon mengajukan surat permohonan agenda kegiatan melalui platform' },
    { num: '02', title: 'Verifikasi', desc: 'Sespri memverifikasi kelengkapan dan kesesuaian permohonan' },
    { num: '03', title: 'Penugasan', desc: 'Kasubag menugaskan staf protokol dan media untuk kegiatan' },
    { num: '04', title: 'Pelaksanaan', desc: 'Kegiatan terlaksana dengan dokumentasi dan pelaporan lengkap' },
  ];

  const navLinks = [
    { label: 'Beranda', id: 'hero' },
    { label: 'Fitur', id: 'fitur' },
    { label: 'Alur', id: 'alur' },
    { label: 'Berita', id: 'berita' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">SIMAP</h1>
                <p className="text-[10px] text-gray-500 leading-tight hidden sm:block">Sistem Informasi Manajemen Agenda Pimpinan</p>
              </div>
            </div>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="rounded-lg border-gray-200 hover:border-gray-300">Masuk</Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-lg bg-blue-600 hover:bg-blue-700">Daftar</Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenu && (
            <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full rounded-lg">Masuk</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button className="w-full rounded-lg bg-blue-600 hover:bg-blue-700">Daftar</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Image Slider */}
      <section id="hero" className="relative pt-16 min-h-[520px] sm:min-h-[600px] flex items-center overflow-hidden">
        {/* Background slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentSlide === index ? 1 : 0 }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
                <Building2 className="w-3.5 h-3.5" />
                Bagian Protokol dan Komunikasi Pimpinan
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Sistem Informasi Manajemen
                <span className="text-blue-300"> Agenda Pimpinan</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto">
                Platform digital terpadu untuk mengelola surat permohonan, agenda kegiatan pimpinan,
                penugasan staf protokol dan media, serta pelaporan kegiatan.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/register">
                  <Button size="lg" className="rounded-lg bg-blue-600 hover:bg-blue-700 px-8 h-12 text-base">
                    Ajukan Permohonan
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="rounded-lg px-8 h-12 text-base border-white/30 text-black hover:bg-white/10">
                    Login Pegawai
                  </Button>
                </Link>
              </div>
            </div>

            {/* Slide indicators */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/40'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Proses Digital', value: '100%', icon: CheckCircle },
              { label: 'Waktu Respon', value: '<24 Jam', icon: Clock },
              { label: 'Kegiatan/Bulan', value: '50+', icon: Calendar },
              { label: 'Staf Terkoordinasi', value: '20+', icon: Users },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3">
                <stat.icon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm mb-2 uppercase tracking-wide">Fitur Unggulan</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Solusi Lengkap untuk Protokol</h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Mengelola seluruh alur kerja agenda pimpinan dalam satu platform terintegrasi.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`w-11 h-11 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="alur" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm mb-2 uppercase tracking-wide">Alur Proses</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Proses yang Efisien & Transparan</h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Dari pengajuan hingga pelaksanaan, setiap tahapan dapat dipantau secara real-time.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold mb-4">
                    {step.num}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Berita Section */}
      <section id="berita" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm mb-2 uppercase tracking-wide">Berita Terbaru</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Kabar & Kegiatan Pimpinan</h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Informasi terbaru seputar kegiatan dan agenda pimpinan daerah.
            </p>
          </div>

          {beritaList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {beritaList.map((berita) => {
                const photo = berita.dokumentasis?.[0];
                const photoUrl = photo?.file_path ? `/api/${photo.file_path.replace(/\\/g, '/')}` : null;
                return (
                  <article
                    key={berita.id_draft_berita}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Photo */}
                    <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={berita.judul_berita}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-5">
                      {berita.tanggal_kirim && (
                        <p className="text-xs text-gray-500 mb-2">
                          {new Date(berita.tanggal_kirim).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {berita.judul_berita}
                      </h4>
                      {berita.isi_draft && (
                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                          {berita.isi_draft}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Newspaper className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Belum ada berita yang tersedia</p>
              <p className="text-sm text-gray-400 mt-1">Berita kegiatan pimpinan akan tampil di sini</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blue-50 border-y border-blue-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-5">
            <Building2 className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Siap Menggunakan SIMAP?
          </h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Daftar sekarang dan ajukan permohonan agenda kegiatan dengan mudah dan transparan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base font-semibold">
                Daftar Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="rounded-lg border-gray-300 hover:bg-white px-8 h-12 text-base">
                Masuk ke Sistem
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-12 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">SIMAP</p>
                  <p className="text-xs text-gray-500">Manajemen Agenda Pimpinan</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Platform digital terpadu untuk pengelolaan agenda dan protokol pimpinan daerah.
              </p>
            </div>

            {/* Menu Cepat */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Menu Cepat</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollTo(link.id)}
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Akses */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Akses Sistem</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-sm text-gray-500 hover:text-white transition-colors">
                    Masuk
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm text-gray-500 hover:text-white transition-colors">
                    Daftar Akun Pemohon
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 text-center">
            <p className="text-xs text-gray-600">
              &copy; 2025 Bagian Protokol dan Komunikasi Pimpinan. Hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
