import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Image as ImageIcon, ChevronLeft, ChevronRight, Edit, Clock, User, Calendar } from 'lucide-react';

export default function DetailDraftBeritaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - match dengan DraftBeritaMediaPage
  const draftData: Record<string, any> = {
    '1': {
      id: 1,
      judul: 'Walikota Hadiri Rapat Koordinasi Bulanan Februari 2026',
      isi_draft: 'KOTA METRO - Walikota Dr. H. Ahmad Suryadi, M.Si menghadiri rapat koordinasi bulanan yang diselenggarakan di Ruang Rapat Utama pada Senin (10/2/2026). Rapat dihadiri oleh seluruh kepala dinas dan pejabat terkait.\n\nDalam sambutannya, Walikota menekankan pentingnya koordinasi antar instansi untuk mencapai target pembangunan daerah. "Kita harus terus meningkatkan kualitas pelayanan publik dan memastikan semua program berjalan sesuai rencana," ujar Walikota saat membuka acara.\n\nRapat berlangsung selama dua jam dan menghasilkan beberapa kesepakatan penting terkait program prioritas tahun 2026, termasuk infrastruktur, pendidikan, dan kesehatan masyarakat.',
      staf_pengirim: 'Siti Nurhaliza',
      tanggal_kirim: '2026-02-11',
      agenda_terkait: 'Rapat Koordinasi Bulanan OPD',
      status: 'Pending Review',
      revisi_count: 0,
      revisi_history: [],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwcmVwb3J0ZXIlMjBmaWxtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc3MDMwNTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Walikota memberikan sambutan di hadapan para kepala dinas'
        },
        {
          url: 'https://images.unsplash.com/photo-1763674561330-5f87d703ea0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwY292ZXJhZ2UlMjBicm9hZGNhc3R8ZW58MXx8fHwxNzcwMzA1MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Suasana diskusi program prioritas 2026'
        },
        {
          url: 'https://images.unsplash.com/photo-1509981653549-b7b39a320b9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXNtJTIwcGhvdG8lMjBzdG9yeXxlbnwxfHx8fDE3NzAzMDUwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Para peserta rapat mendengarkan paparan program'
        }
      ]
    },
    '2': {
      id: 2,
      judul: 'Kunjungan Kerja Dinas Pendidikan Disambut Baik',
      isi_draft: 'KOTA METRO - Kunjungan kerja dari Dinas Pendidikan Provinsi mendapat sambutan hangat dari Pemerintah Kota pada Selasa (12/2/2026). Pertemuan membahas program peningkatan kualitas pendidikan di kota.\n\nKepala Dinas Pendidikan menyampaikan usulan program beasiswa untuk siswa berprestasi. Walikota merespons positif usulan tersebut dan berkomitmen untuk mendukung program pendidikan. "Pendidikan adalah investasi jangka panjang untuk masa depan kota kita," tegas Walikota.',
      staf_pengirim: 'Dewi Lestari',
      tanggal_kirim: '2026-02-12',
      agenda_terkait: 'Kunjungan Kerja ke Dinas Kesehatan',
      status: 'Revisi',
      revisi_count: 1,
      revisi_history: [
        {
          catatan_revisi: 'Tambahkan kutipan langsung dari Kepala Dinas Pendidikan Provinsi dan detail program beasiswa yang diusulkan',
          tanggal_revisi: '2026-02-12',
          pemberi_revisi: 'Kasubag Media'
        }
      ],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwcmVwb3J0ZXIlMjBmaWxtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc3MDMwNTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Walikota berdiskusi dengan Kepala Dinas Pendidikan'
        }
      ]
    },
    '3': {
      id: 3,
      judul: 'Persiapan Festival Seni Budaya Memasuki Tahap Akhir',
      isi_draft: 'KOTA METRO - Persiapan Festival Seni Budaya Kota Metro 2026 telah memasuki tahap akhir. Panitia pelaksana terus melakukan koordinasi untuk memastikan acara berjalan lancar.',
      staf_pengirim: 'Siti Nurhaliza',
      tanggal_kirim: '2026-02-10',
      agenda_terkait: 'Pembukaan Festival Seni Budaya',
      status: 'Disetujui',
      revisi_count: 0,
      revisi_history: [],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1763674561330-5f87d703ea0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwY292ZXJhZ2UlMjBicm9hZGNhc3R8ZW58MXx8fHwxNzcwMzA1MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Persiapan venue festival seni budaya'
        },
        {
          url: 'https://images.unsplash.com/photo-1509981653549-b7b39a320b9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXNtJTIwcGhvdG8lMjBzdG9yeXxlbnwxfHx8fDE3NzAzMDUwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Tim panitia melakukan koordinasi persiapan'
        }
      ]
    },
    '4': {
      id: 4,
      judul: 'Audiensi dengan Tokoh Masyarakat Membahas Aspirasi',
      isi_draft: 'KOTA METRO - Wakil Walikota Ir. Hj. Siti Rahmawati, M.T menerima kunjungan tokoh masyarakat di Kantor Walikota pada Rabu (5/2/2026). Pertemuan membahas berbagai aspirasi masyarakat terkait pembangunan.',
      staf_pengirim: 'Dewi Lestari',
      tanggal_kirim: '2026-02-06',
      agenda_terkait: 'Audiensi dengan Tokoh Masyarakat',
      status: 'Disetujui',
      revisi_count: 0,
      revisi_history: [],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwcmVwb3J0ZXIlMjBmaWxtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc3MDMwNTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Wakil Walikota mendengarkan aspirasi tokoh masyarakat'
        }
      ]
    }
  };

  const draft = id ? draftData[id] : null;

  if (!draft) {
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
            <p className="text-gray-500">Draft berita tidak ditemukan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNextImage = () => {
    if (draft.foto_dokumentasi && draft.foto_dokumentasi.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === draft.foto_dokumentasi.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (draft.foto_dokumentasi && draft.foto_dokumentasi.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? draft.foto_dokumentasi.length - 1 : prev - 1
      );
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending Review': return 'warning';
      case 'Revisi': return 'info';
      case 'Disetujui': return 'success';
      case 'Ditolak': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Detail Draft Berita</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">Informasi lengkap draft berita</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(draft.status)}>{draft.status}</Badge>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{draft.judul}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  <span>Penulis: <span className="font-medium text-gray-900">{draft.staf_pengirim}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Agenda: <span className="font-medium text-gray-900">{draft.agenda_terkait}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Tanggal: <span className="font-medium text-gray-900">
                    {new Date(draft.tanggal_kirim).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span></span>
                </div>
              </div>
              {draft.revisi_count > 0 && (
                <div className="mt-2">
                  <Badge variant="warning">
                    {draft.revisi_count}x revisi
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          {/* Riwayat Revisi */}
          {draft.revisi_history.length > 0 && (
            <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Riwayat Revisi
              </h4>
              <div className="space-y-3">
                {draft.revisi_history.map((revisi: any, index: number) => (
                  <div key={index} className="border-l-2 border-orange-400 pl-3 bg-white rounded-r-lg p-3">
                    <p className="text-sm text-orange-900 mb-1">{revisi.catatan_revisi}</p>
                    <p className="text-xs text-orange-600">
                      {new Date(revisi.tanggal_revisi).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })} - {revisi.pemberi_revisi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Slider */}
          {draft.foto_dokumentasi && draft.foto_dokumentasi.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-semibold text-gray-900">
                  Gambar Berita ({draft.foto_dokumentasi.length})
                </h4>
              </div>
              
              <div className="relative">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <img 
                    key={currentImageIndex}
                    src={draft.foto_dokumentasi[currentImageIndex].url}
                    alt={draft.foto_dokumentasi[currentImageIndex].caption}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  {draft.foto_dokumentasi.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 hover:scale-110 text-white p-2 md:p-3 rounded-full transition-all active:scale-95"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 hover:scale-110 text-white p-2 md:p-3 rounded-full transition-all active:scale-95"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-black bg-opacity-70 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-medium">
                    {currentImageIndex + 1} / {draft.foto_dokumentasi.length}
                  </div>
                </div>

                {/* Caption */}
                <p className="text-xs md:text-sm text-gray-600 mt-3 text-center italic min-h-[40px] flex items-center justify-center px-4">
                  {draft.foto_dokumentasi[currentImageIndex].caption}
                </p>

                {/* Thumbnail Navigation */}
                {draft.foto_dokumentasi.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {draft.foto_dokumentasi.map((foto: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-purple-600 ring-2 ring-purple-200 scale-105' 
                            : 'border-gray-300 hover:border-purple-400 hover:scale-105'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img 
                          src={foto.url}
                          alt={foto.caption}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Isi Berita */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Isi Berita</h5>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-sm md:text-base text-gray-700 whitespace-pre-line leading-relaxed">{draft.isi_draft}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
          Kembali ke Daftar
        </Button>
        {draft.status === 'Revisi' && (
          <Button 
            variant="default" 
            onClick={() => alert('Fitur upload ulang draft revisi')}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Upload Revisi
          </Button>
        )}
      </div>
    </div>
  );
}