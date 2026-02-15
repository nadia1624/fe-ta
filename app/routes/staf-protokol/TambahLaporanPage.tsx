import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Upload, Calendar, Clock, MapPin, User, FileText, Image, Check } from 'lucide-react';

export default function TambahLaporanPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tipeProgress, setTipeProgress] = useState('Persiapan');
  const [keterangan, setKeterangan] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Mock data kegiatan
  const kegiatanData: Record<string, any> = {
    '1': {
      id: 1,
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal: '2026-02-05',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama',
      status_laporan: 'Sudah Dilaporkan',
      existing_progress: [
        {
          tipe: 'Persiapan',
          keterangan: 'Tim protokol sudah tiba di lokasi pukul 08:00. Setup ruangan selesai.',
          waktu: '08:30',
          foto_count: 4
        },
        {
          tipe: 'Pelaksanaan',
          keterangan: 'Penyambutan pimpinan berjalan lancar. Protokoler acara pembukaan sesuai rundown.',
          waktu: '09:15',
          foto_count: 6
        },
        {
          tipe: 'Sedang Berlangsung',
          keterangan: 'Acara berjalan sesuai jadwal. Tim protokol memastikan kelancaran acara.',
          waktu: '10:30',
          foto_count: 5
        },
        {
          tipe: 'Selesai',
          keterangan: 'Acara selesai. Pelepasan pimpinan berjalan tertib.',
          waktu: '12:15',
          foto_count: 3
        }
      ]
    },
    '2': {
      id: 2,
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal: '2026-02-05',
      waktu: '14:00 - 16:00',
      tempat: 'Kantor Dinas Kesehatan',
      status_laporan: 'Sedang Diisi',
      existing_progress: [
        {
          tipe: 'Persiapan',
          keterangan: 'Koordinasi dengan pihak Dinas Kesehatan sudah dilakukan.',
          waktu: '10:00',
          foto_count: 2
        },
        {
          tipe: 'Sedang Berlangsung',
          keterangan: 'Tim sudah tiba di lokasi. Penyambutan pimpinan berjalan lancar.',
          waktu: '14:10',
          foto_count: 5
        }
      ]
    },
    '3': {
      id: 3,
      judul_kegiatan: 'Launching Program Smart City',
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      tanggal: '2026-02-05',
      waktu: '19:00 - 21:00',
      tempat: 'Gedung Serbaguna',
      status_laporan: 'Belum Dilaporkan',
      existing_progress: []
    }
  };

  const kegiatan = id ? kegiatanData[id] : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submit
    setTimeout(() => {
      setSubmitting(false);
      alert('Progress laporan berhasil ditambahkan!');
      navigate('/dashboard/staf-protokol');
    }, 2000);
  };

  if (!kegiatan) {
    return (
      <div className="space-y-4 pb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Kegiatan tidak ditemukan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Tambah Laporan Protokol</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">Update progress kegiatan protokoler</p>
          </div>
        </div>
      </div>

      {/* Informasi Kegiatan */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Informasi Kegiatan</h3>
            <Badge variant={kegiatan.status_laporan === 'Sudah Dilaporkan' ? 'success' : 'info'}>
              {kegiatan.status_laporan}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3">
            <div>
              <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Judul Kegiatan
              </label>
              <p className="text-sm md:text-base text-gray-900 mt-1 font-semibold">{kegiatan.judul_kegiatan}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Pimpinan
                </label>
                <p className="text-sm text-gray-900 mt-1">{kegiatan.pimpinan}</p>
                <p className="text-xs text-gray-600">{kegiatan.jabatan}</p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(kegiatan.tanggal).toLocaleDateString('id-ID', {
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
                <p className="text-sm text-gray-900 mt-1">{kegiatan.waktu}</p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Tempat
                </label>
                <p className="text-sm text-gray-900 mt-1">{kegiatan.tempat}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress yang Sudah Ada */}
      {kegiatan.existing_progress && kegiatan.existing_progress.length > 0 && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Progress yang Sudah Dilaporkan ({kegiatan.existing_progress.length})
            </h3>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              {kegiatan.existing_progress.map((prog: any, idx: number) => (
                <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <Badge variant="success">{prog.tipe}</Badge>
                      <span className="text-xs text-gray-500">{prog.waktu}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-900">{prog.keterangan}</p>
                    <p className="text-xs text-gray-600 mt-1">📷 {prog.foto_count} foto</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Tambah Progress */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="border-b border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Tambah Progress Baru</h3>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              {/* Tipe Progress */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Tipe Progress <span className="text-red-500">*</span>
                </label>
                <select
                  value={tipeProgress}
                  onChange={(e) => setTipeProgress(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm md:text-base"
                  required
                >
                  <option value="Persiapan">Persiapan</option>
                  <option value="Pelaksanaan">Pelaksanaan</option>
                  <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Keterangan Progress <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Contoh: Tim protokol sudah tiba di lokasi pukul 08:00. Setup ruangan, pengaturan tempat duduk pimpinan, koordinasi dengan MC sudah selesai."
                  rows={6}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm md:text-base resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {keterangan.length} karakter (minimal 50 karakter)
                </p>
              </div>

              {/* Upload Foto */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Foto Dokumentasi <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Image className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      Klik untuk upload foto atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG hingga 10MB (minimal 2 foto)</p>
                  </label>
                </div>
                {selectedFiles && (
                  <div className="mt-3">
                    <p className="text-xs md:text-sm font-medium text-gray-700 mb-2">
                      {selectedFiles.length} file dipilih:
                    </p>
                    <div className="space-y-1">
                      {Array.from(selectedFiles).map((file, index) => (
                        <p key={index} className="text-xs text-gray-600">
                          • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Panduan */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                <h4 className="text-xs md:text-sm font-semibold text-blue-900 mb-2">📋 Tips Laporan Protokol</h4>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>Laporkan secara kronologis (Persiapan → Pelaksanaan → Sedang Berlangsung → Selesai)</li>
                  <li>Sertakan waktu spesifik saat kegiatan terjadi</li>
                  <li>Jelaskan detail protokoler: penyambutan, koordinasi, pelepasan</li>
                  <li>Upload foto yang jelas dan berkualitas baik</li>
                  <li>Update progress secara real-time saat kegiatan berlangsung</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 order-2 md:order-1"
            disabled={submitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1 order-1 md:order-2"
            disabled={submitting || keterangan.length < 50 || !selectedFiles}
          >
            {submitting ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Progress
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
