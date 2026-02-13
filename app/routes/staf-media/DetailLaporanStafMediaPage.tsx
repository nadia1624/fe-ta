import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, TrendingUp, Calendar, MapPin, Clock, User } from 'lucide-react';

export default function DetailLaporanStafMediaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - harus match dengan ID dari LaporanKegiatanStafMediaPage
  const laporanData: Record<string, any> = {
    '1': {
      id: 1,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      tanggal: '2026-02-10',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama Kantor Walikota',
      keterangan: 'Rapat koordinasi rutin dengan seluruh kepala OPD membahas program prioritas tahun 2026',
      status_laporan: 'Sudah Dilaporkan',
      progress: [
        {
          tipe: 'Persiapan',
          keterangan: 'Tim protokol sudah tiba di lokasi pukul 08:00. Setup ruangan, pengaturan tempat duduk pimpinan dan tamu, koordinasi dengan MC sudah selesai.',
          tanggal: '2026-02-10 08:30',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          tipe: 'Pelaksanaan',
          keterangan: 'Penyambutan pimpinan berjalan lancar. Protokoler acara pembukaan sesuai rundown. Koordinasi dengan MC lancar.',
          tanggal: '2026-02-10 09:15',
          foto: 'https://images.unsplash.com/photo-1566409031544-1e78a3b9d679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZ292ZXJubWVudCUyMGV2ZW50JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwMjk5NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          tipe: 'Sedang Berlangsung',
          keterangan: 'Acara berjalan sesuai jadwal. Tim protokol memastikan kelancaran acara dan koordinasi dengan semua pihak.',
          tanggal: '2026-02-10 10:30',
          foto: 'https://images.unsplash.com/photo-1627488043116-f66f15a31bfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2lhbCUyMGNlcmVtb255JTIwaW5kb25lc2lhJTIwZG9jdW1lbnRhdGlvbnxlbnwxfHx8fDE3NzAyOTk2MDl8MA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          tipe: 'Selesai',
          keterangan: 'Acara selesai. Pelepasan pimpinan berjalan tertib. Dokumentasi protokoler lengkap dan sudah diserahkan.',
          tanggal: '2026-02-10 12:15',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        }
      ]
    },
    '4': {
      id: 4,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Rapat dengan DPRD',
      tanggal: '2026-02-08',
      waktu: '13:00 - 16:00',
      tempat: 'Gedung DPRD',
      keterangan: 'Rapat pembahasan APBD 2026 dengan dewan',
      status_laporan: 'Sudah Dilaporkan',
      progress: [
        {
          tipe: 'Persiapan',
          keterangan: 'Koordinasi dengan DPRD untuk protokoler acara. Setup tempat duduk pimpinan sudah selesai.',
          tanggal: '2026-02-08 12:00',
          foto: 'https://images.unsplash.com/photo-1566409031544-1e78a3b9d679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZ292ZXJubWVudCUyMGV2ZW50JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwMjk5NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          tipe: 'Pelaksanaan',
          keterangan: 'Penyambutan pimpinan di Gedung DPRD berjalan lancar. Protokoler acara sesuai rundown.',
          tanggal: '2026-02-08 13:15',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          tipe: 'Selesai',
          keterangan: 'Acara selesai. Pelepasan pimpinan berjalan tertib. Dokumentasi protokoler lengkap.',
          tanggal: '2026-02-08 16:15',
          foto: 'https://images.unsplash.com/photo-1627488043116-f66f15a31bfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2lhbCUyMGNlcmVtb255JTIwaW5kb25lc2lhJTIwZG9jdW1lbnRhdGlvbnxlbnwxfHx8fDE3NzAyOTk2MDl8MA&ixlib=rb-4.1.0&q=80&w=1080'
        }
      ]
    },
    '5': {
      id: 5,
      pimpinan_nama: 'Ir. Hj. Siti Rahmawati, M.T',
      pimpinan_jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Audiensi dengan Tokoh Masyarakat',
      tanggal: '2026-02-05',
      waktu: '14:00 - 15:30',
      tempat: 'Kantor Walikota',
      keterangan: 'Mendengarkan aspirasi masyarakat terkait pembangunan',
      status_laporan: 'Sudah Dilaporkan',
      progress: [
        {
          tipe: 'Persiapan',
          keterangan: 'Setup ruang audiensi dan pengaturan tempat duduk untuk pimpinan dan tamu sudah selesai.',
          tanggal: '2026-02-05 13:30',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          tipe: 'Selesai',
          keterangan: 'Acara audiensi selesai. Pimpinan sudah kembali. Dokumentasi protokoler lengkap dan sudah diserahkan.',
          tanggal: '2026-02-05 15:45',
          foto: 'https://images.unsplash.com/photo-1566409031544-1e78a3b9d679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZ292ZXJubWVudCUyMGV2ZW50JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwMjk5NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080'
        }
      ]
    }
  };

  const laporan = id ? laporanData[id] : null;

  if (!laporan) {
    return (
      <div className="space-y-4 md:space-y-6 pb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Laporan tidak ditemukan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sudah Dilaporkan':
        return <Badge variant="success">Sudah Dilaporkan</Badge>;
      case 'Belum Dilaporkan':
        return <Badge variant="warning">Belum Dilaporkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="outline" onClick={() => navigate(-1)} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Detail Laporan Kegiatan</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">{laporan.judul_kegiatan}</p>
          </div>
        </div>
      </div>

      {/* Informasi Kegiatan */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Informasi Kegiatan</h3>
            {getStatusBadge(laporan.status_laporan)}
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <User className="w-3 h-3 md:w-4 md:h-4" />
                  Pimpinan
                </label>
                <p className="text-sm md:text-base text-gray-900 mt-1 font-semibold">{laporan.pimpinan_nama}</p>
                <p className="text-xs text-gray-600">{laporan.pimpinan_jabatan}</p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  Judul Kegiatan
                </label>
                <p className="text-xs md:text-sm text-gray-900 mt-1">{laporan.judul_kegiatan}</p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  Tanggal
                </label>
                <p className="text-xs md:text-sm text-gray-900 mt-1">
                  {new Date(laporan.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  Waktu
                </label>
                <p className="text-xs md:text-sm text-gray-900 mt-1">{laporan.waktu}</p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  Tempat
                </label>
                <p className="text-xs md:text-sm text-gray-900 mt-1">{laporan.tempat}</p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600">Keterangan</label>
                <p className="text-xs md:text-sm text-gray-900 mt-1">{laporan.keterangan}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Progress */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Timeline Progress Dokumentasi</h3>
            </div>
            <Badge variant="info">{laporan.progress.length} Update</Badge>
          </div>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Laporan ini hanya dapat dilihat (Read Only - Staff Media)</p>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            {laporan.progress.map((prog: any, idx: number) => (
              <div key={idx} className="relative pl-6 md:pl-8 pb-4 md:pb-6 border-l-2 border-purple-200 last:border-l-0 last:pb-0">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-purple-600 border-2 border-white"></div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                  <div className="flex items-start justify-between mb-2 md:mb-3">
                    <Badge variant="info">{prog.tipe}</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(prog.tanggal).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-900 mb-3 md:mb-4">{prog.keterangan}</p>
                  
                  {/* Foto Dokumentasi */}
                  {prog.foto && (
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-2">
                        Dokumentasi Foto
                      </label>
                      <div className="rounded-lg overflow-hidden border border-gray-300">
                        <img 
                          src={prog.foto} 
                          alt={`Dokumentasi ${prog.tipe}`}
                          className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Ringkasan</h3>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total Progress</p>
              <p className="text-xl md:text-2xl font-semibold text-purple-600">{laporan.progress.length}</p>
              <p className="text-xs text-gray-500 mt-1">Update Dokumentasi</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-xs md:text-sm text-gray-600 mb-1">Status Laporan</p>
              <div className="mt-2">{getStatusBadge(laporan.status_laporan)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
          Kembali ke Daftar
        </Button>
      </div>
    </div>
  );
}
