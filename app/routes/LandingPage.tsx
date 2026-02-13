import { Link } from 'react-router';
import { Building2, Calendar, FileText, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
  const features = [
    {
      icon: FileText,
      title: 'Pengelolaan Surat Permohonan',
      description: 'Ajukan dan lacak surat permohonan agenda kegiatan secara digital dan real-time'
    },
    {
      icon: Calendar,
      title: 'Manajemen Agenda Pimpinan',
      description: 'Kelola jadwal dan agenda pimpinan dengan sistem terintegrasi dan terstruktur'
    },
    {
      icon: Users,
      title: 'Koordinasi Tim Protokol & Media',
      description: 'Penugasan dan monitoring staf protokol dan media untuk setiap kegiatan'
    },
    {
      icon: CheckCircle,
      title: 'Pelaporan & Dokumentasi',
      description: 'Sistem dokumentasi kegiatan dan pelaporan yang tersentralisasi'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">SIMAP</h1>
                <p className="text-xs text-gray-600">Sistem Informasi Manajemen Agenda Pimpinan</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline">Masuk</Button>
              </Link>
              <Link to="/register">
                <Button>Daftar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6">
              Sistem Informasi Manajemen Agenda Pimpinan
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Platform digital terpadu untuk mengelola surat permohonan, agenda kegiatan pimpinan, 
              penugasan staf protokol dan media, serta pelaporan kegiatan di lingkungan 
              Bagian Protokol dan Komunikasi Pimpinan
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg">
                  Ajukan Permohonan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Login Pegawai
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">Fitur Utama</h3>
            <p className="text-lg text-gray-600">
              Solusi lengkap untuk manajemen agenda dan protokol pimpinan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">Alur Proses</h3>
            <p className="text-lg text-gray-600">
              Proses pengajuan dan pengelolaan agenda yang efisien
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Pengajuan Surat</h4>
              <p className="text-sm text-gray-600">Pemohon mengajukan surat permohonan agenda kegiatan</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Verifikasi</h4>
              <p className="text-sm text-gray-600">Sespri memverifikasi kelengkapan dan kesesuaian permohonan</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Penugasan</h4>
              <p className="text-sm text-gray-600">Kasubag menugaskan staf protokol dan media</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Pelaksanaan</h4>
              <p className="text-sm text-gray-600">Kegiatan terlaksana dengan dokumentasi dan pelaporan</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-semibold text-white mb-4">
            Siap Menggunakan SIMAP?
          </h3>
          <p className="text-lg text-blue-100 mb-8">
            Daftar sekarang dan ajukan permohonan agenda kegiatan dengan mudah
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Daftar Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            &copy; 2025 Bagian Protokol dan Komunikasi Pimpinan
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Sistem Informasi Manajemen Agenda Pimpinan (SIMAP)
          </p>
        </div>
      </footer>
    </div>
  );
}
