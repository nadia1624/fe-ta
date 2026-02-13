import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eye, CheckCircle, MessageSquare, XCircle, Image, Video, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReviewDraftBeritaPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<any>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'revisi' | 'reject' | 'view'>('view');
  const [catatan, setCatatan] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const draftsToReview = [
    {
      id: 1,
      judul: 'Walikota Hadiri Rapat Koordinasi Bulanan Februari 2025',
      isi_draft: 'KOTA METRO - Walikota Dr. H. Ahmad Suryadi, M.Si menghadiri rapat koordinasi bulanan yang diselenggarakan di Ruang Rapat Utama pada Senin (1/2/2025). Rapat dihadiri oleh seluruh kepala dinas dan pejabat terkait.\n\nDalam sambutannya, Walikota menekankan pentingnya koordinasi antar instansi untuk mencapai target pembangunan daerah. "Kita harus terus meningkatkan kualitas pelayanan publik dan memastikan semua program berjalan sesuai rencana," ujar Walikota saat membuka acara.\n\nRapat berlangsung selama dua jam dan menghasilkan beberapa kesepakatan penting terkait program prioritas tahun 2025, termasuk infrastruktur, pendidikan, dan kesehatan masyarakat.',
      staf_pengirim: 'Siti Nurhaliza',
      tanggal_kirim: '2025-01-30',
      agenda_terkait: 'Rapat Koordinasi Bulanan',
      status: 'Pending Review',
      revisi_count: 0,
      revisi_history: [],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwcmVwb3J0ZXIlMjBmaWxtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc3MDMwNTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Walikota memberikan sambutan di hadapan para kepala dinas',
          tipe: 'foto'
        },
        {
          url: 'https://images.unsplash.com/photo-1763674561330-5f87d703ea0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwY292ZXJhZ2UlMjBicm9hZGNhc3R8ZW58MXx8fHwxNzcwMzA1MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Suasana diskusi program prioritas 2025',
          tipe: 'foto'
        },
        {
          url: 'https://images.unsplash.com/photo-1509981653549-b7b39a320b9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXNtJTIwcGhvdG8lMjBzdG9yeXxlbnwxfHx8fDE3NzAzMDUwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Para peserta rapat mendengarkan paparan program',
          tipe: 'foto'
        }
      ]
    },
    {
      id: 2,
      judul: 'Kunjungan Kerja Dinas Pendidikan Disambut Baik',
      isi_draft: 'KOTA METRO - Kunjungan kerja dari Dinas Pendidikan Provinsi mendapat sambutan hangat dari Pemerintah Kota pada Selasa (30/1/2025). Pertemuan membahas program peningkatan kualitas pendidikan di kota.\n\nKepala Dinas Pendidikan menyampaikan usulan program beasiswa untuk siswa berprestasi. Walikota merespons positif usulan tersebut dan berkomitmen untuk mendukung program pendidikan. "Pendidikan adalah investasi jangka panjang untuk masa depan kota kita," tegas Walikota.',
      staf_pengirim: 'Dewi Lestari',
      tanggal_kirim: '2025-01-30',
      agenda_terkait: 'Kunjungan Kerja Dinas Pendidikan',
      status: 'Revisi',
      revisi_count: 1,
      revisi_history: [
        {
          catatan_revisi: 'Tambahkan kutipan langsung dari Kepala Dinas Pendidikan Provinsi dan detail program beasiswa yang diusulkan',
          tanggal_revisi: '2025-01-30',
          pemberi_revisi: 'Kasubag Media'
        }
      ],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwcmVwb3J0ZXIlMjBmaWxtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc3MDMwNTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Walikota berdiskusi dengan Kepala Dinas Pendidikan',
          tipe: 'foto'
        }
      ]
    },
    {
      id: 3,
      judul: 'Persiapan Upacara Peringatan Kemerdekaan Berjalan Lancar',
      isi_draft: 'KOTA METRO - Persiapan pelaksanaan upacara peringatan hari kemerdekaan RI telah memasuki tahap akhir. Seluruh staf protokol dan media telah melakukan koordinasi intensif untuk memastikan acara berjalan dengan baik.\n\nPanitia pelaksana telah melakukan gladi bersih dan memastikan semua peralatan upacara dalam kondisi siap pakai. Upacara akan dipimpin langsung oleh Walikota sebagai inspektur upacara.',
      staf_pengirim: 'Siti Nurhaliza',
      tanggal_kirim: '2025-01-29',
      agenda_terkait: 'Upacara Peringatan Hari Kemerdekaan',
      status: 'Pending Review',
      revisi_count: 0,
      revisi_history: [],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1763674561330-5f87d703ea0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwY292ZXJhZ2UlMjBicm9hZGNhc3R8ZW58MXx8fHwxNzcwMzA1MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Persiapan venue upacara kemerdekaan',
          tipe: 'foto'
        },
        {
          url: 'https://images.unsplash.com/photo-1509981653549-b7b39a320b9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXNtJTIwcGhvdG8lMjBzdG9yeXxlbnwxfHx8fDE3NzAzMDUwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Tim panitia melakukan koordinasi persiapan',
          tipe: 'foto'
        },
        {
          url: 'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwcmVwb3J0ZXIlMjBmaWxtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc3MDMwNTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Gladi bersih upacara bendera',
          tipe: 'foto'
        }
      ]
    },
  ];

  const handleAction = (draft: any, action: 'approve' | 'revisi' | 'reject' | 'view') => {
    setSelectedDraft(draft);
    setModalAction(action);
    setCatatan('');
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const handleNextImage = () => {
    if (selectedDraft && selectedDraft.foto_dokumentasi) {
      setCurrentImageIndex((prev) => 
        prev === selectedDraft.foto_dokumentasi.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedDraft && selectedDraft.foto_dokumentasi) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedDraft.foto_dokumentasi.length - 1 : prev - 1
      );
    }
  };

  // Keyboard navigation for image slider
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (modalAction === 'view' && selectedDraft?.foto_dokumentasi?.length > 1) {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    }
  };

  const handleSubmit = () => {
    if (modalAction === 'approve') {
      alert(`Draft "${selectedDraft.judul}" berhasil disetujui!`);
    } else if (modalAction === 'revisi') {
      if (!catatan.trim()) {
        alert('Mohon isi catatan revisi!');
        return;
      }
      alert(`Catatan revisi untuk "${selectedDraft.judul}" berhasil dikirim!`);
    } else if (modalAction === 'reject') {
      if (!catatan.trim()) {
        alert('Mohon isi alasan penolakan!');
        return;
      }
      alert(`Draft "${selectedDraft.judul}" ditolak!`);
    }
    setShowModal(false);
    setCatatan('');
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Review Draft Berita</h1>
        <p className="text-sm text-gray-600 mt-1">Review dan berikan feedback untuk draft berita dari staf media</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {draftsToReview.map((draft) => (
          <Card key={draft.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{draft.judul}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>Penulis: {draft.staf_pengirim}</span>
                    <span>•</span>
                    <span>
                      {new Date(draft.tanggal_kirim).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    {draft.revisi_count > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-orange-600 font-medium">{draft.revisi_count}x revisi</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Agenda: {draft.agenda_terkait}</p>
                </div>
                <Badge variant={getStatusVariant(draft.status)}>
                  {draft.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Konten Draft Berita */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-line line-clamp-6">{draft.isi_draft}</p>
              </div>

              {/* Gambar Berita / Footage */}
              {draft.foto_dokumentasi && draft.foto_dokumentasi.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Image className="w-4 h-4 text-purple-600" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Gambar Berita ({draft.foto_dokumentasi.length})
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {draft.foto_dokumentasi.map((foto: any, index: number) => (
                      <div key={index} className="group relative">
                        <div className="rounded-lg overflow-hidden border-2 border-gray-300 aspect-video bg-gray-100">
                          <img 
                            src={foto.url} 
                            alt={foto.caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-xs text-gray-700 mt-2 font-medium">{foto.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {draft.revisi_history.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-orange-900 mb-2">Riwayat Revisi:</p>
                  <div className="space-y-2">
                    {draft.revisi_history.map((revisi: any, index: number) => (
                      <div key={index} className="border-l-2 border-orange-300 pl-3">
                        <p className="text-sm text-orange-800">{revisi.catatan_revisi}</p>
                        <p className="text-xs text-orange-600 mt-1">
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

              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => handleAction(draft, 'view')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 hover:shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat Detail
                </button>
                <button 
                  onClick={() => handleAction(draft, 'revisi')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-700 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 hover:border-orange-400 hover:shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Berikan Revisi
                </button>
                <button 
                  onClick={() => handleAction(draft, 'reject')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 hover:border-red-400 hover:shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak
                </button>
                <button 
                  onClick={() => handleAction(draft, 'approve')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 hover:shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Setujui Draft
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedDraft && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalAction === 'approve' && '✓ Setujui Draft Berita'}
                  {modalAction === 'revisi' && '✎ Berikan Revisi'}
                  {modalAction === 'reject' && '✕ Tolak Draft Berita'}
                  {modalAction === 'view' && '👁 Detail Draft Berita'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 active:scale-95 transition-all"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Detail Berita - Mode View */}
                {modalAction === 'view' && (
                  <>
                    {/* Judul */}
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">{selectedDraft.judul}</h4>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Penulis</p>
                        <p className="text-sm font-medium text-gray-900">{selectedDraft.staf_pengirim}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Agenda</p>
                        <p className="text-sm font-medium text-gray-900">{selectedDraft.agenda_terkait}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tanggal Kirim</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selectedDraft.tanggal_kirim).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Image Slider */}
                    {selectedDraft.foto_dokumentasi && selectedDraft.foto_dokumentasi.length > 0 && (
                      <div className="relative">
                        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                          <img 
                            key={currentImageIndex}
                            src={selectedDraft.foto_dokumentasi[currentImageIndex].url}
                            alt={selectedDraft.foto_dokumentasi[currentImageIndex].caption}
                            className="w-full h-full object-cover animate-fadeIn"
                          />
                          
                          {/* Navigation Arrows */}
                          {selectedDraft.foto_dokumentasi.length > 1 && (
                            <>
                              <button
                                onClick={handlePrevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 hover:scale-110 text-white p-3 rounded-full transition-all active:scale-95"
                                aria-label="Previous image"
                              >
                                <ChevronLeft className="w-6 h-6" />
                              </button>
                              <button
                                onClick={handleNextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 hover:scale-110 text-white p-3 rounded-full transition-all active:scale-95"
                                aria-label="Next image"
                              >
                                <ChevronRight className="w-6 h-6" />
                              </button>
                            </>
                          )}

                          {/* Image Counter */}
                          <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                            {currentImageIndex + 1} / {selectedDraft.foto_dokumentasi.length}
                          </div>
                        </div>

                        {/* Caption */}
                        <p className="text-sm text-gray-600 mt-3 text-center italic min-h-[40px] flex items-center justify-center">
                          {selectedDraft.foto_dokumentasi[currentImageIndex].caption}
                        </p>

                        {/* Thumbnail Navigation */}
                        {selectedDraft.foto_dokumentasi.length > 1 && (
                          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                            {selectedDraft.foto_dokumentasi.map((foto: any, index: number) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
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
                    )}

                    {/* Isi Berita */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Isi Berita</h5>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{selectedDraft.isi_draft}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Quick Info for non-view modes */}
                {modalAction !== 'view' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{selectedDraft.judul}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Penulis: {selectedDraft.staf_pengirim}</p>
                      <p>Agenda: {selectedDraft.agenda_terkait}</p>
                      <p>Tanggal Kirim: {new Date(selectedDraft.tanggal_kirim).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</p>
                    </div>
                  </div>
                )}

                {/* Approval Confirmation */}
                {modalAction === 'approve' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-900">
                      Apakah Anda yakin ingin menyetujui draft berita ini? Draft yang disetujui akan dapat dipublikasikan.
                    </p>
                  </div>
                )}

                {/* Revision Notes */}
                {modalAction === 'revisi' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan Revisi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="Jelaskan revisi yang diperlukan secara detail..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Catatan revisi akan dikirim ke staf media untuk diperbaiki
                    </p>
                  </div>
                )}

                {/* Rejection Reason */}
                {modalAction === 'reject' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alasan Penolakan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="Jelaskan alasan penolakan..."
                    />
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-red-900">
                        Draft yang ditolak tidak dapat dipublikasikan dan staf harus membuat ulang draft baru.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition-all"
                  >
                    {modalAction === 'view' ? 'Tutup' : 'Batal'}
                  </button>
                  {modalAction !== 'view' && (
                    <button 
                      className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border active:scale-95 transition-all ${
                        modalAction === 'approve' 
                          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:shadow-lg' 
                          : modalAction === 'reject' 
                          ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:shadow-lg' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:shadow-lg'
                      }`}
                      onClick={handleSubmit}
                    >
                      {modalAction === 'approve' && '✓ Setujui Draft'}
                      {modalAction === 'revisi' && '✎ Kirim Revisi'}
                      {modalAction === 'reject' && '✕ Tolak Draft'}
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
