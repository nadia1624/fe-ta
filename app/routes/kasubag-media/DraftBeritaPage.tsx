import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Eye, MessageSquare, CheckCircle, XCircle, Image, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DraftBeritaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<any>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'revisi' | 'reject' | 'view'>('view');
  const [catatan, setCatatan] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data untuk draft berita dengan dokumentasi footage berita
  const draftBeritaList = [
    {
      id: 1,
      judul: 'Walikota Hadiri Rapat Koordinasi Bulanan Februari 2025',
      isi_draft: 'Walikota Dr. H. Ahmad Suryadi, M.Si menghadiri rapat koordinasi bulanan yang diselenggarakan di Ruang Rapat Utama pada tanggal 1 Februari 2025. Rapat dihadiri oleh seluruh kepala dinas dan pejabat terkait.\\n\\nDalam sambutannya, Walikota menekankan pentingnya koordinasi antar instansi untuk mencapai target pembangunan daerah. \"Kita harus terus meningkatkan kualitas pelayanan publik,\" ujar Walikota.\\n\\nRapat berlangsung selama dua jam dan menghasilkan beberapa kesepakatan penting terkait program prioritas tahun 2025.',
      staf_pengirim: 'Siti Nurhaliza',
      tanggal_kirim: '2025-01-30',
      agenda_terkait: 'Rapat Koordinasi Bulanan',
      status: 'Pending Review',
      revisi_count: 0,
      revisi_history: [],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwcmVwb3J0ZXIlMjBmaWxtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc3MDMwNTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Footage video wawancara Walikota'
        },
        {
          url: 'https://images.unsplash.com/photo-1763674561330-5f87d703ea0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwY292ZXJhZ2UlMjBicm9hZGNhc3R8ZW58MXx8fHwxNzcwMzA1MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Pengambilan video liputan rapat'
        }
      ]
    },
    {
      id: 2,
      judul: 'Kunjungan Kerja Dinas Pendidikan Disambut Baik',
      isi_draft: 'Kunjungan kerja dari Dinas Pendidikan mendapat sambutan hangat dari pihak Pemkot. Pertemuan membahas program peningkatan kualitas pendidikan di kota.\\n\\nKepala Dinas Pendidikan menyampaikan usulan program beasiswa untuk siswa berprestasi. Walikota merespons positif usulan tersebut dan berkomitmen untuk mendukung program pendidikan.',
      staf_pengirim: 'Dewi Lestari',
      tanggal_kirim: '2025-01-30',
      agenda_terkait: 'Kunjungan Kerja Dinas Pendidikan',
      status: 'Revisi',
      revisi_count: 1,
      revisi_history: [
        {
          catatan_revisi: 'Tambahkan kutipan langsung dari Kepala Dinas Pendidikan dan detail program beasiswa',
          tanggal_revisi: '2025-01-30',
          pemberi_revisi: 'Andi Wijaya (Kasubag Media)'
        }
      ],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1509981653549-b7b39a320b9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXNtJTIwcGhvdG8lMjBzdG9yeXxlbnwxfHx8fDE3NzAzMDUwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Wawancara Kepala Dinas Pendidikan'
        }
      ]
    },
    {
      id: 3,
      judul: 'Persiapan Upacara Peringatan Kemerdekaan Berjalan Lancar',
      isi_draft: 'Persiapan pelaksanaan upacara peringatan hari kemerdekaan telah memasuki tahap akhir. Seluruh staf protokol dan media telah melakukan koordinasi intensif untuk memastikan acara berjalan dengan baik.',
      staf_pengirim: 'Siti Nurhaliza',
      tanggal_kirim: '2025-01-29',
      agenda_terkait: 'Upacara Peringatan Hari Kemerdekaan',
      status: 'Disetujui',
      revisi_count: 0,
      revisi_history: [],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwcmVwb3J0ZXIlMjBmaWxtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc3MDMwNTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Footage persiapan venue upacara'
        },
        {
          url: 'https://images.unsplash.com/photo-1763674561330-5f87d703ea0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwY292ZXJhZ2UlMjBicm9hZGNhc3R8ZW58MXx8fHwxNzcwMzA1MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Dokumentasi video koordinasi tim'
        },
        {
          url: 'https://images.unsplash.com/photo-1509981653549-b7b39a320b9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXNtJTIwcGhvdG8lMjBzdG9yeXxlbnwxfHx8fDE3NzAzMDUwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Video b-roll pelaksanaan gladi bersih'
        }
      ]
    },
    {
      id: 4,
      judul: 'Launching Program Smart City Sukses Dilaksanakan',
      isi_draft: 'Program Smart City resmi diluncurkan oleh Walikota pada Senin malam di Gedung Serbaguna. Acara dihadiri oleh berbagai stakeholder dan masyarakat.\\n\\nWalikota menyatakan bahwa program ini akan membawa perubahan besar bagi pelayanan publik di kota. \"Smart City adalah langkah menuju kota yang lebih modern dan efisien,\" tegasnya.',
      staf_pengirim: 'Maya Sari',
      tanggal_kirim: '2025-02-02',
      agenda_terkait: 'Launching Program Smart City',
      status: 'Disetujui',
      revisi_count: 0,
      revisi_history: [],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwcmVwb3J0ZXIlMjBmaWxtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc3MDMwNTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Video highlight acara launching'
        },
        {
          url: 'https://images.unsplash.com/photo-1509981653549-b7b39a320b9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXNtJTIwcGhvdG8lMjBzdG9yeXxlbnwxfHx8fDE3NzAzMDUwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Wawancara dengan peserta acara'
        }
      ]
    },
    {
      id: 5,
      judul: 'Audiensi Tokoh Masyarakat dengan Wakil Walikota',
      isi_draft: 'Wakil Walikota Ir. Hj. Siti Rahmawati, M.T menerima audiensi dari perwakilan tokoh masyarakat untuk mendengarkan aspirasi terkait pembangunan infrastruktur di wilayah mereka.\\n\\nDalam pertemuan tersebut, berbagai usulan disampaikan dan mendapat tanggapan positif dari pihak pemerintah kota.',
      staf_pengirim: 'Putri Ayu',
      tanggal_kirim: '2025-02-03',
      agenda_terkait: 'Audiensi dengan Tokoh Masyarakat',
      status: 'Pending Review',
      revisi_count: 0,
      revisi_history: [],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1763674561330-5f87d703ea0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwY292ZXJhZ2UlMjBicm9hZGNhc3R8ZW58MXx8fHwxNzcwMzA1MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Footage video audiensi'
        }
      ]
    },
    {
      id: 6,
      judul: 'Pelantikan Kepala Dinas Baru',
      isi_draft: 'Walikota melantik tiga Kepala Dinas baru dalam upacara resmi di Pendopo Kota. Pelantikan berlangsung hikmat dan dihadiri oleh seluruh pejabat pemerintah kota.',
      staf_pengirim: 'Dewi Lestari',
      tanggal_kirim: '2025-02-04',
      agenda_terkait: 'Pelantikan Kepala Dinas',
      status: 'Ditolak',
      revisi_count: 1,
      revisi_history: [
        {
          catatan_revisi: 'Draft tidak memenuhi standar jurnalistik. Perlu dibuat ulang dengan fokus yang lebih baik.',
          tanggal_revisi: '2025-02-04',
          pemberi_revisi: 'Andi Wijaya (Kasubag Media)'
        }
      ],
      foto_dokumentasi: [
        {
          url: 'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwcmVwb3J0ZXIlMjBmaWxtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc3MDMwNTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          caption: 'Video pelantikan'
        }
      ]
    }
  ];

  const filteredData = draftBeritaList.filter(item => {
    const matchSearch = 
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.staf_pengirim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agenda_terkait.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchSearch && matchStatus;
  });

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
      setShowModal(false);
      setCatatan('');
      setTimeout(() => {
        alert(`✓ Draft "${selectedDraft.judul}" berhasil disetujui dan siap dipublikasikan!`);
      }, 300);
    } else if (modalAction === 'revisi') {
      if (!catatan.trim()) {
        alert('⚠️ Mohon isi catatan revisi terlebih dahulu!');
        return;
      }
      setShowModal(false);
      setCatatan('');
      setTimeout(() => {
        alert(`✎ Catatan revisi untuk "${selectedDraft.judul}" berhasil dikirim ke staf media!`);
      }, 300);
    } else if (modalAction === 'reject') {
      if (!catatan.trim()) {
        alert('⚠️ Mohon isi alasan penolakan terlebih dahulu!');
        return;
      }
      setShowModal(false);
      setCatatan('');
      setTimeout(() => {
        alert(`✕ Draft "${selectedDraft.judul}" telah ditolak!`);
      }, 300);
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

  // Stats
  const totalDraft = draftBeritaList.length;
  const pendingReview = draftBeritaList.filter(d => d.status === 'Pending Review').length;
  const disetujui = draftBeritaList.filter(d => d.status === 'Disetujui').length;
  const revisi = draftBeritaList.filter(d => d.status === 'Revisi').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Draft Berita</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola dan review draft berita dari staf media</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Draft</p>
                <p className="text-3xl font-semibold text-purple-600">{totalDraft}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-semibold text-yellow-600">{pendingReview}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Disetujui</p>
                <p className="text-3xl font-semibold text-green-600">{disetujui}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Perlu Revisi</p>
                <p className="text-3xl font-semibold text-blue-600">{revisi}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Draft Berita ({filteredData.length})</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari draft..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm appearance-none bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Revisi">Revisi</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredData.map((draft) => (
              <div key={draft.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{draft.judul}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>Oleh: {draft.staf_pengirim}</span>
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

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-line">{draft.isi_draft}</p>
                </div>

                {/* Foto Dokumentasi */}
                {draft.foto_dokumentasi && draft.foto_dokumentasi.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Image className="w-4 h-4 text-purple-600" />
                      <h5 className="text-sm font-semibold text-gray-900">
                        Dokumentasi Footage ({draft.foto_dokumentasi.length})
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {draft.foto_dokumentasi.slice(0, 3).map((foto: any, index: number) => (
                        <div key={index} className="group relative">
                          <div className="rounded-lg overflow-hidden border border-gray-300 aspect-video bg-gray-100">
                            <img 
                              src={foto.url} 
                              alt={foto.caption}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{foto.caption}</p>
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
                  {(draft.status === 'Pending Review' || draft.status === 'Revisi') && (
                    <>
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
                        Setujui
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Tidak ada draft berita yang ditemukan
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
