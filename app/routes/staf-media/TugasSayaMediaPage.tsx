import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Search, Filter, Calendar, Clock, MapPin, User, Image, Upload, X, FileText, Eye, Edit } from 'lucide-react';

export default function TugasSayaMediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBulan, setFilterBulan] = useState('2026-02');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTugas, setSelectedTugas] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadForm, setUploadForm] = useState({
    judul_draft: '',
    konten_draft: '',
    foto_dokumentasi: [] as File[],
    foto_previews: [] as string[]
  });

  const tugasList = [
    {
      id: 1,
      agenda_id: 1,
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal: '2026-02-10',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama',
      penugasan_dari: 'Kasubag Media - Dra. Siti Aminah, M.Si',
      tanggal_penugasan: '2026-02-08',
      instruksi: 'Buat draft berita terkait rapat koordinasi OPD, sertakan foto dokumentasi minimal 3 foto.',
      status_draft: 'Pending Review',
      draft_uploaded: {
        judul: 'Walikota Pimpin Rapat Koordinasi Bulanan OPD Bahas Program Prioritas 2026',
        konten: 'Kota - Walikota Dr. H. Ahmad Suryadi, M.Si memimpin Rapat Koordinasi Bulanan...',
        tanggal_upload: '2026-02-10 14:30',
        foto_count: 5,
        feedback: null
      }
    },
    {
      id: 2,
      agenda_id: 2,
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal: '2026-02-12',
      waktu: '10:00 - 11:30',
      tempat: 'Kantor Dinas Kesehatan',
      penugasan_dari: 'Kasubag Media - Dra. Siti Aminah, M.Si',
      tanggal_penugasan: '2026-02-10',
      instruksi: 'Dokumentasikan kunjungan kerja Walikota, buat draft berita yang menyoroti program vaksinasi.',
      status_draft: 'Perlu Revisi',
      draft_uploaded: {
        judul: 'Walikota Kunjungi Dinas Kesehatan Tinjau Program Vaksinasi',
        konten: 'Kota - Dalam rangka monitoring program kesehatan masyarakat...',
        tanggal_upload: '2026-02-12 13:00',
        foto_count: 4,
        feedback: 'Mohon ditambahkan kutipan langsung dari Walikota dan data jumlah vaksinasi yang sudah dilakukan.'
      }
    },
    {
      id: 3,
      agenda_id: 3,
      judul_kegiatan: 'Pembukaan Festival Seni Budaya',
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      tanggal: '2026-02-15',
      waktu: '08:00 - 10:00',
      tempat: 'Lapangan Utama Kota',
      penugasan_dari: 'Kasubag Media - Dra. Siti Aminah, M.Si',
      tanggal_penugasan: '2026-02-13',
      instruksi: 'Liputan pembukaan festival, fokus pada keragaman budaya dan partisipasi masyarakat.',
      status_draft: 'Belum Upload',
      draft_uploaded: null
    },
    {
      id: 4,
      agenda_id: 4,
      judul_kegiatan: 'Launching Program Smart City',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal: '2026-02-05',
      waktu: '19:00 - 21:00',
      tempat: 'Gedung Serbaguna',
      penugasan_dari: 'Kasubag Media - Dra. Siti Aminah, M.Si',
      tanggal_penugasan: '2026-02-04',
      instruksi: 'Buat draft berita tentang launching program smart city, highlight fitur-fitur utama.',
      status_draft: 'Disetujui',
      draft_uploaded: {
        judul: 'Walikota Launching Program Smart City untuk Tingkatkan Pelayanan Publik',
        konten: 'Kota - Walikota Dr. H. Ahmad Suryadi, M.Si resmi meluncurkan program Smart City...',
        tanggal_upload: '2026-02-06 10:00',
        foto_count: 6,
        feedback: 'Draft berita sudah bagus dan siap dipublikasikan. Terima kasih!'
      }
    },
    {
      id: 5,
      agenda_id: 5,
      judul_kegiatan: 'Peresmian Gedung Baru RSUD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal: '2026-02-08',
      waktu: '09:00 - 12:00',
      tempat: 'RSUD Kota',
      penugasan_dari: 'Kasubag Media - Dra. Siti Aminah, M.Si',
      tanggal_penugasan: '2026-02-06',
      instruksi: 'Dokumentasikan peresmian gedung RSUD, sertakan info kapasitas dan fasilitas baru.',
      status_draft: 'Disetujui',
      draft_uploaded: {
        judul: 'Walikota Resmikan Gedung Baru RSUD Senilai Rp 50 Miliar',
        konten: 'Kota - Gedung baru RSUD dengan kapasitas 200 tempat tidur resmi diresmikan...',
        tanggal_upload: '2026-02-08 15:00',
        foto_count: 8,
        feedback: 'Konten lengkap dan informatif. Sudah dipublikasikan.'
      }
    }
  ];

  const filteredTugas = tugasList.filter(tugas => {
    const matchSearch =
      tugas.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tugas.pimpinan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tugas.tempat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'all' || tugas.status_draft === filterStatus;
    const matchBulan = tugas.tanggal.startsWith(filterBulan);

    return matchSearch && matchStatus && matchBulan;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Belum Upload':
        return <Badge variant="warning">Belum Upload</Badge>;
      case 'Pending Review':
        return <Badge variant="info">Pending Review</Badge>;
      case 'Disetujui':
        return <Badge variant="success">Disetujui</Badge>;
      case 'Perlu Revisi':
        return <Badge variant="destructive">Perlu Revisi</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleUploadClick = (tugas: any) => {
    setSelectedTugas(tugas);
    if (tugas.draft_uploaded) {
      setUploadForm({
        judul_draft: tugas.draft_uploaded.judul,
        konten_draft: tugas.draft_uploaded.konten,
        foto_dokumentasi: [],
        foto_previews: []
      });
    }
    setShowUploadModal(true);
  };

  const handleDetailClick = (tugas: any) => {
    setSelectedTugas(tugas);
    setShowDetailModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(file => URL.createObjectURL(file));

    setUploadForm({
      ...uploadForm,
      foto_dokumentasi: [...uploadForm.foto_dokumentasi, ...files],
      foto_previews: [...uploadForm.foto_previews, ...newPreviews]
    });
  };

  const removeFoto = (index: number) => {
    const newFotos = [...uploadForm.foto_dokumentasi];
    const newPreviews = [...uploadForm.foto_previews];
    newFotos.splice(index, 1);
    newPreviews.splice(index, 1);

    setUploadForm({
      ...uploadForm,
      foto_dokumentasi: newFotos,
      foto_previews: newPreviews
    });
  };

  const handleSubmitDraft = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.judul_draft || !uploadForm.konten_draft) {
      alert('Mohon lengkapi judul dan konten draft berita');
      return;
    }

    if (uploadForm.foto_dokumentasi.length < 3) {
      alert('Mohon upload minimal 3 foto dokumentasi');
      return;
    }

    console.log('Submit draft:', uploadForm);
    alert('Draft berita berhasil diupload!');
    setShowUploadModal(false);
    setUploadForm({
      judul_draft: '',
      konten_draft: '',
      foto_dokumentasi: [],
      foto_previews: []
    });
  };

  const statsTotal = tugasList.length;
  const statsBelumUpload = tugasList.filter(t => t.status_draft === 'Belum Upload').length;
  const statsPending = tugasList.filter(t => t.status_draft === 'Pending Review').length;
  const statsPerluRevisi = tugasList.filter(t => t.status_draft === 'Perlu Revisi').length;

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Tugas Saya</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Kelola draft berita kegiatan pimpinan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">Total Tugas</p>
            <p className="text-2xl font-semibold text-purple-600">{statsTotal}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">Belum Upload</p>
            <p className="text-2xl font-semibold text-orange-600">{statsBelumUpload}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">Pending Review</p>
            <p className="text-2xl font-semibold text-blue-600">{statsPending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">Perlu Revisi</p>
            <p className="text-2xl font-semibold text-red-600">{statsPerluRevisi}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari tugas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
              >
                <option value="2026-02">Februari 2026</option>
                <option value="2026-01">Januari 2026</option>
                <option value="2025-12">Desember 2025</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="Belum Upload">Belum Upload</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Perlu Revisi">Perlu Revisi</option>
                <option value="Disetujui">Disetujui</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            {filteredTugas.map((tugas) => (
              <Card key={tugas.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Left Side - Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base text-gray-900 mb-1">
                              {tugas.judul_kegiatan}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {tugas.pimpinan} · {tugas.jabatan}
                            </p>
                          </div>
                          {getStatusBadge(tugas.status_draft)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(tugas.tanggal).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {tugas.waktu}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {tugas.tempat}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {tugas.penugasan_dari}
                          </div>
                        </div>
                      </div>

                      {/* Instruksi */}
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-purple-900 mb-1">📋 Instruksi:</p>
                        <p className="text-sm text-purple-800">{tugas.instruksi}</p>
                      </div>

                      {/* Feedback Revisi */}
                      {tugas.draft_uploaded?.feedback && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-red-900 mb-1">📝 Catatan Revisi:</p>
                          <p className="text-sm text-red-800">{tugas.draft_uploaded.feedback}</p>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col gap-2 md:w-48">
                      {tugas.status_draft === 'Belum Upload' ? (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() => handleUploadClick(tugas)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Draft
                        </Button>
                      ) : tugas.status_draft === 'Perlu Revisi' ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full"
                            onClick={() => handleUploadClick(tugas)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Upload Revisi
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleDetailClick(tugas)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat Draft
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDetailClick(tugas)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTugas.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Tidak ada tugas yang ditemukan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload/Edit Draft Modal */}
      {showUploadModal && selectedTugas && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTugas.status_draft === 'Perlu Revisi' ? 'Upload Revisi Draft Berita' : 'Upload Draft Berita'}
                </h3>
                <button onClick={() => setShowUploadModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitDraft} className="space-y-4">
                {/* Info Kegiatan */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">{selectedTugas.judul_kegiatan}</h4>
                  <p className="text-xs text-gray-600">
                    {selectedTugas.pimpinan} · {new Date(selectedTugas.tanggal).toLocaleDateString('id-ID')} · {selectedTugas.waktu}
                  </p>
                </div>

                {/* Judul Draft */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Draft Berita <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={uploadForm.judul_draft}
                    onChange={(e) => setUploadForm({ ...uploadForm, judul_draft: e.target.value })}
                    placeholder="Contoh: Walikota Launching Program Smart City untuk Tingkatkan Pelayanan Publik"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    required
                  />
                </div>

                {/* Konten Draft */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konten Draft Berita <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={uploadForm.konten_draft}
                    onChange={(e) => setUploadForm({ ...uploadForm, konten_draft: e.target.value })}
                    rows={10}
                    placeholder="Tulis konten berita lengkap di sini..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                    required
                  />
                </div>

                {/* Foto Dokumentasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Dokumentasi <span className="text-red-500">*</span> (Min. 3 foto)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Foto
                  </Button>

                  {uploadForm.foto_previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {uploadForm.foto_previews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeFoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Foto yang sudah diupload: {uploadForm.foto_previews.length} foto
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowUploadModal(false)}>
                    Batal
                  </Button>
                  <Button type="submit" variant="default" className="flex-1">
                    {selectedTugas.status_draft === 'Perlu Revisi' ? 'Upload Revisi' : 'Upload Draft'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTugas?.draft_uploaded && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detail Draft Berita</h3>
                <button onClick={() => setShowDetailModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Kegiatan</label>
                  <p className="text-base text-gray-900">{selectedTugas.judul_kegiatan}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Judul Draft</label>
                  <p className="text-base text-gray-900">{selectedTugas.draft_uploaded.judul}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Konten</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedTugas.draft_uploaded.konten}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Upload</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedTugas.draft_uploaded.tanggal_upload).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedTugas.status_draft)}
                  </div>
                </div>
                {selectedTugas.draft_uploaded.feedback && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="text-sm font-medium text-blue-900">Feedback</label>
                    <p className="text-sm text-blue-800 mt-1">{selectedTugas.draft_uploaded.feedback}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
