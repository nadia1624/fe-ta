import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Search, Filter, Eye, Calendar, MapPin, Clock, FileText, User, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function LaporanKegiatanPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Data kegiatan protokol untuk staf protokol
  const kegiatanList = [
    {
      id: 1,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      tanggal: '2026-02-10',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama Kantor Walikota',
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Bertugas mengatur protokoler acara, koordinasi dengan MC dan setting tempat duduk pimpinan',
      status_laporan: 'Sudah Dilaporkan',
      progress_count: 4,
      last_update: '2026-02-10 12:15',
      staf_bertugas: ['Ahmad Hidayat', 'Budi Santoso']
    },
    {
      id: 2,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      tanggal: '2026-02-12',
      waktu: '10:00 - 11:30',
      tempat: 'Kantor Dinas Kesehatan',
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Koordinasi protokoler kunjungan, persiapan sambutan dan pengawalan pimpinan',
      status_laporan: 'Sedang Berjalan',
      progress_count: 2,
      last_update: '2026-02-11 16:00',
      staf_bertugas: ['Eko Prasetyo']
    },
    {
      id: 3,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Pelantikan Kepala Dinas',
      tanggal: '2026-02-20',
      waktu: '10:00 - 12:00',
      tempat: 'Aula Kantor Walikota',
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Persiapan dan pelaksanaan protokoler upacara pelantikan',
      status_laporan: 'Belum Dilaporkan',
      progress_count: 1,
      last_update: '2026-02-11 09:00',
      staf_bertugas: ['Bambang Wijaya', 'Dewi Lestari', 'Farhan Saputra']
    },
    {
      id: 4,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Peresmian Jalan Tol Baru',
      tanggal: '2026-02-15',
      waktu: '09:00 - 11:00',
      tempat: 'Gerbang Tol Km 5',
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Mengatur protokoler acara peresmian dan koordinasi dengan instansi terkait',
      status_laporan: 'Sudah Dilaporkan',
      progress_count: 5,
      last_update: '2026-02-15 11:30',
      staf_bertugas: ['Citra Dewi', 'Ahmad Hidayat']
    },
    {
      id: 5,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Rapat Evaluasi Kinerja Triwulan',
      tanggal: '2026-02-25',
      waktu: '13:00 - 16:00',
      tempat: 'Ruang Rapat Lantai 3',
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Persiapan ruangan, koordinasi konsumsi, dan protokoler rapat evaluasi',
      status_laporan: 'Belum Dilaporkan',
      progress_count: 0,
      last_update: '-',
      staf_bertugas: ['Budi Santoso']
    },
    {
      id: 6,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Upacara Peringatan Hari Kemerdekaan',
      tanggal: '2025-08-17',
      waktu: '08:00 - 10:00',
      tempat: 'Lapangan Upacara Kantor Walikota',
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Koordinasi upacara bendera, pengaturan formasi, dan protokoler upacara',
      status_laporan: 'Sudah Dilaporkan',
      progress_count: 6,
      last_update: '2025-08-17 10:30',
      staf_bertugas: ['Bambang Wijaya', 'Eko Prasetyo', 'Farhan Saputra']
    }
  ];

  const filteredKegiatan = kegiatanList.filter((kegiatan) => {
    const matchSearch = 
      kegiatan.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kegiatan.pimpinan_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kegiatan.tempat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || kegiatan.status_laporan === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sudah Dilaporkan':
        return { variant: 'success' as const, icon: CheckCircle };
      case 'Sedang Berjalan':
        return { variant: 'warning' as const, icon: AlertCircle };
      case 'Belum Dilaporkan':
        return { variant: 'danger' as const, icon: XCircle };
      default:
        return { variant: 'default' as const, icon: FileText };
    }
  };

  const stats = [
    {
      label: 'Total Kegiatan',
      value: kegiatanList.length,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Sudah Dilaporkan',
      value: kegiatanList.filter(k => k.status_laporan === 'Sudah Dilaporkan').length,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    {
      label: 'Sedang Berjalan',
      value: kegiatanList.filter(k => k.status_laporan === 'Sedang Berjalan').length,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Belum Dilaporkan',
      value: kegiatanList.filter(k => k.status_laporan === 'Belum Dilaporkan').length,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Laporan Kegiatan Protokol</h1>
        <p className="text-sm text-gray-600 mt-1">
          Kelola laporan kegiatan protokol yang Anda tugaskan
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`border ${stat.borderColor}`}>
            <CardContent className="pt-6">
              <div className={`${stat.bgColor} rounded-lg p-4`}>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kegiatan, pimpinan, atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="Sudah Dilaporkan">Sudah Dilaporkan</option>
                <option value="Sedang Berjalan">Sedang Berjalan</option>
                <option value="Belum Dilaporkan">Belum Dilaporkan</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kegiatan List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredKegiatan.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada kegiatan yang ditemukan</p>
            </CardContent>
          </Card>
        ) : (
          filteredKegiatan.map((kegiatan) => {
            const statusInfo = getStatusBadge(kegiatan.status_laporan);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={kegiatan.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {kegiatan.judul_kegiatan}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User className="w-4 h-4" />
                        <span>{kegiatan.pimpinan_nama}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{kegiatan.pimpinan_jabatan}</span>
                      </div>
                    </div>
                    <Badge variant={statusInfo.variant}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {kegiatan.status_laporan}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Deskripsi Penugasan */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-medium mb-1">Tugas Protokol:</p>
                      <p className="text-sm text-blue-900">{kegiatan.deskripsi_penugasan}</p>
                    </div>

                    {/* Detail Kegiatan */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Tanggal</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(kegiatan.tanggal).toLocaleDateString('id-ID', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Waktu</p>
                          <p className="text-sm font-medium text-gray-900">{kegiatan.waktu}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Tempat</p>
                          <p className="text-sm font-medium text-gray-900">{kegiatan.tempat}</p>
                        </div>
                      </div>
                    </div>

                    {/* Staf Bertugas */}
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-500 mb-2">Staf Bertugas:</p>
                      <div className="flex flex-wrap gap-2">
                        {kegiatan.staf_bertugas.map((staf, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                          >
                            {staf}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          Progress: <span className="font-medium text-gray-700">{kegiatan.progress_count} update</span>
                        </span>
                        {kegiatan.last_update !== '-' && (
                          <>
                            <span>•</span>
                            <span>
                              Update terakhir: <span className="font-medium text-gray-700">
                                {new Date(kegiatan.last_update).toLocaleString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                      
                      <Link to={`/dashboard/staf-protokol/laporan/${kegiatan.id}`}>
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 hover:shadow-md active:scale-95 transition-all">
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Info Footer */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Informasi Laporan Kegiatan Protokol
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Klik tombol "Lihat Detail" untuk melihat detail kegiatan dan menambahkan laporan progress kegiatan protokol. 
                Pastikan setiap tahapan kegiatan didokumentasikan dengan baik dan lengkap dengan foto dokumentasi.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
