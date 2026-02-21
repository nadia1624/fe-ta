import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Calendar, Clock, MapPin, User, FileText, ClipboardList, Check } from 'lucide-react';
import { Link } from 'react-router';

export default function TugasDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data tugas
  const tugasData: Record<string, any> = {
    '1': {
      id: 1,
      agenda_id: 1,
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal: '2026-02-05',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama',
      status_laporan: 'Sudah Dilaporkan',
      penugasan_dari: 'Kasubag Protokol - Drs. Budi Hartono',
      tanggal_penugasan: '2026-02-01',
      instruksi: 'Pastikan protokoler penyambutan berjalan sesuai SOP. Koordinasi dengan MC untuk rundown acara.',
      prioritas: 'Tinggi',
      progress_reports: [
        {
          id: 1,
          tipe: 'Persiapan',
          deskripsi: 'Tim protokol sudah tiba di lokasi pukul 08:00. Setup ruangan, pengaturan tempat duduk pimpinan, dan koordinasi MC sudah selesai.',
          foto_count: 4,
          waktu: '08:30',
          tanggal: '2026-02-05'
        },
        {
          id: 2,
          tipe: 'Pelaksanaan',
          deskripsi: 'Penyambutan pimpinan berjalan lancar. Protokoler acara pembukaan sesuai rundown. Koordinasi dengan MC lancar.',
          foto_count: 6,
          waktu: '09:15',
          tanggal: '2026-02-05'
        },
        {
          id: 3,
          tipe: 'Selesai',
          deskripsi: 'Acara selesai. Pelepasan pimpinan berjalan tertib. Dokumentasi protokoler lengkap.',
          foto_count: 3,
          waktu: '12:15',
          tanggal: '2026-02-05'
        }
      ]
    },
    '2': {
      id: 2,
      agenda_id: 2,
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal: '2026-02-05',
      waktu: '14:00 - 16:00',
      tempat: 'Kantor Dinas Kesehatan',
      status_laporan: 'Sedang Diisi',
      penugasan_dari: 'Kasubag Protokol - Drs. Budi Hartono',
      tanggal_penugasan: '2026-02-03',
      instruksi: 'Koordinasi dengan pihak Dinkes untuk protokoler penyambutan. Pastikan dokumentasi lengkap.',
      prioritas: 'Tinggi',
      progress_reports: [
        {
          id: 1,
          tipe: 'Persiapan',
          deskripsi: 'Koordinasi dengan pihak Dinas Kesehatan sudah dilakukan. Tim protokol akan berangkat pukul 13:30.',
          foto_count: 2,
          waktu: '10:00',
          tanggal: '2026-02-05'
        },
        {
          id: 2,
          tipe: 'Sedang Berlangsung',
          deskripsi: 'Tim sudah tiba di lokasi. Penyambutan pimpinan berjalan lancar. Koordinasi protokoler sedang berlangsung.',
          foto_count: 5,
          waktu: '14:10',
          tanggal: '2026-02-05'
        }
      ]
    },
  };

  const tugas = id ? tugasData[id] : null;

  if (!tugas) {
    return (
      <div className="space-y-4 pb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Tugas tidak ditemukan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPrioritasBadge = (prioritas: string) => {
    switch (prioritas) {
      case 'Tinggi':
        return <Badge variant="destructive">Prioritas Tinggi</Badge>;
      case 'Sedang':
        return <Badge variant="info">Prioritas Sedang</Badge>;
      case 'Rendah':
        return <Badge variant="secondary">Prioritas Rendah</Badge>;
      default:
        return <Badge>{prioritas}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Belum Dilaporkan':
        return <Badge variant="warning">Belum Dilaporkan</Badge>;
      case 'Sedang Diisi':
        return <Badge variant="info">Sedang Diisi</Badge>;
      case 'Sudah Dilaporkan':
        return <Badge variant="success">Sudah Dilaporkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Detail Tugas</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Kelola progress laporan protokol</p>
        </div>
      </div>

      {/* Info Penugasan */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{tugas.judul_kegiatan}</h3>
              <div className="flex flex-wrap items-center gap-2">
                {getPrioritasBadge(tugas.prioritas)}
                {getStatusBadge(tugas.status_laporan)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            {/* Penugasan */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-blue-900 mb-1">Ditugaskan oleh:</p>
                  <p className="text-sm text-blue-800">{tugas.penugasan_dari}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-900 mb-1">Tanggal Penugasan:</p>
                  <p className="text-sm text-blue-800">
                    {new Date(tugas.tanggal_penugasan).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs font-medium text-blue-900 mb-1">📋 Instruksi:</p>
                <p className="text-sm text-blue-800">{tugas.instruksi}</p>
              </div>
            </div>

            {/* Info Kegiatan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Pimpinan
                </label>
                <p className="text-sm text-gray-900 mt-1">{tugas.pimpinan}</p>
                <p className="text-xs text-gray-600">{tugas.jabatan}</p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(tugas.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Waktu
                </label>
                <p className="text-sm text-gray-900 mt-1">{tugas.waktu}</p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Tempat
                </label>
                <p className="text-sm text-gray-900 mt-1">{tugas.tempat}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Reports */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                  Progress Laporan ({tugas.progress_reports.length})
                </h3>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Riwayat laporan progress protokol</p>
            </div>
            {tugas.status_laporan !== 'Sudah Dilaporkan' && (
              <Link to={`/dashboard/tambah-laporan-protokol/${tugas.agenda_id}`}>
                <Button variant="default" size="sm" className="w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Progress
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {tugas.progress_reports.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {tugas.progress_reports.map((report: any, index: number) => (
                <div key={report.id} className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="success">{report.tipe}</Badge>
                          <span className="text-xs text-gray-500">Progress #{index + 1}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(report.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{report.waktu}</span>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-900 mb-2">{report.deskripsi}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="info" className="text-xs">📷 {report.foto_count} foto</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500 mb-4">Belum ada progress yang dilaporkan</p>
              <Link to={`/dashboard/tambah-laporan-protokol/${tugas.agenda_id}`}>
                <Button variant="default" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Mulai Laporan
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {tugas.status_laporan !== 'Sudah Dilaporkan' && (
        <div className="flex flex-col md:flex-row gap-3">
          <Link to={`/dashboard/tambah-laporan-protokol/${tugas.agenda_id}`} className="flex-1">
            <Button variant="default" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Progress Baru
            </Button>
          </Link>
          <Link to={`/dashboard/detail-agenda-protokol/${tugas.agenda_id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Lihat Detail Agenda
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
