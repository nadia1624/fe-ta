import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Search, Filter, Calendar, Clock, MapPin, User, Upload, X, FileText, Eye, Edit, Loader2, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import CustomSelect from '../../components/ui/CustomSelect';
import MonthPicker from '../../components/ui/month-picker';
import { penugasanApi, beritaApi } from '../../lib/api';
import Swal from 'sweetalert2';

export default function TugasSayaMediaPage() {
  const [tugasList, setTugasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBulan, setFilterBulan] = useState(new Date().toISOString().slice(0, 7));
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTugas, setSelectedTugas] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadForm, setUploadForm] = useState({
    judul_draft: '',
    konten_draft: '',
    foto_dokumentasi: [] as File[],
    foto_previews: [] as string[],
    existing_dokumentasi: [] as any[],
    deleted_dokumentasi_ids: [] as string[]
  });

  const fetchTugas = async () => {
    try {
      setLoading(true);
      const res = await penugasanApi.getMyPenugasan();
      if (res.success) {
        setTugasList(res.data || []);
      } else {
        setError(res.message || 'Gagal mengambil data tugas');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTugas();
  }, []);

  const filteredTugas = tugasList.filter(tugas => {
    const matchSearch =
      tugas.agenda.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tugas.pimpinans.some((p: any) => p.nama_pimpinan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tugas.agenda.lokasi_kegiatan.toLowerCase().includes(searchTerm.toLowerCase());

    // Map DB status to display status
    const latestDraft = (tugas.draftBeritas && tugas.draftBeritas.length > 0)
      ? tugas.draftBeritas[tugas.draftBeritas.length - 1]
      : null;

    let displayStatus = 'Belum Dimulai';
    if (latestDraft) {
      if (latestDraft.status_draft === 'approved') displayStatus = 'Selesai';
      else if (latestDraft.status_draft === 'draft' || latestDraft.status_draft === 'review') displayStatus = 'Berlangsung';
    }

    const matchStatus = filterStatus === 'all' || displayStatus === filterStatus;
    const matchBulan = tugas.agenda.tanggal_kegiatan.startsWith(filterBulan);

    return matchSearch && matchStatus && matchBulan;
  });

  const getStatusInfo = (tugas: any) => {
    const latestDraft = (tugas.draftBeritas && tugas.draftBeritas.length > 0)
      ? tugas.draftBeritas[tugas.draftBeritas.length - 1]
      : null;

    if (!latestDraft) return { label: 'Belum Upload', variant: 'warning' as any };
    if (latestDraft.status_draft === 'approved') return { label: 'Disetujui', variant: 'success' as any };
    if (latestDraft.status_draft === 'draft') return { label: 'Pending Review', variant: 'warning' as any };
    if (latestDraft.status_draft === 'review') return { label: 'Perlu Revisi', variant: 'destructive' as any };
    return { label: latestDraft.status_draft, variant: 'outline' as any };
  };

  const handleUploadClick = (tugas: any) => {
    setSelectedTugas(tugas);
    const latestDraft = (tugas.draftBeritas && tugas.draftBeritas.length > 0)
      ? tugas.draftBeritas[tugas.draftBeritas.length - 1]
      : null;

    if (latestDraft) {
      setUploadForm({
        judul_draft: latestDraft.judul_berita,
        konten_draft: latestDraft.isi_draft,
        foto_dokumentasi: [],
        foto_previews: [],
        existing_dokumentasi: latestDraft.dokumentasis || [],
        deleted_dokumentasi_ids: []
      });
    } else {
      setUploadForm({
        judul_draft: '',
        konten_draft: '',
        foto_dokumentasi: [],
        foto_previews: [],
        existing_dokumentasi: [],
        deleted_dokumentasi_ids: []
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

  const removeExistingFoto = (id_dokumentasi: string) => {
    setUploadForm(prev => ({
      ...prev,
      existing_dokumentasi: prev.existing_dokumentasi.filter(doc => doc.id_dokumentasi !== id_dokumentasi),
      deleted_dokumentasi_ids: [...prev.deleted_dokumentasi_ids, id_dokumentasi]
    }));
  };

  const handleSubmitDraft = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.judul_draft || !uploadForm.konten_draft) {
      Swal.fire('Peringatan', 'Mohon lengkapi judul dan konten draft berita', 'warning');
      return;
    }

    if (uploadForm.foto_dokumentasi.length + uploadForm.existing_dokumentasi.length < 3 && (!selectedTugas.draftBeritas || selectedTugas.draftBeritas.length === 0)) {
      Swal.fire('Peringatan', 'Mohon upload minimal 3 foto dokumentasi', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('id_penugasan', selectedTugas.id_penugasan);
    formData.append('judul_berita', uploadForm.judul_draft);
    formData.append('isi_draft', uploadForm.konten_draft);

    uploadForm.foto_dokumentasi.forEach(file => {
      formData.append('dokumentasi', file);
    });

    if (uploadForm.deleted_dokumentasi_ids.length > 0) {
      formData.append('deleted_dokumentasi_ids', JSON.stringify(uploadForm.deleted_dokumentasi_ids));
    }

    setIsSubmitting(true);
    try {
      const res = await beritaApi.submitDraft(formData);
      if (res.success) {
        Swal.fire('Berhasil', 'Draft berita berhasil diserahkan untuk direview!', 'success');
        setShowUploadModal(false);
        fetchTugas();
      } else {
        Swal.fire('Gagal', res.message || 'Terjadi kesalahan saat mengunggah draft', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan jaringan', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statsTotal = tugasList.length;
  const statsBelumUpload = tugasList.filter(t => !t.draftBeritas || t.draftBeritas.length === 0).length;
  const statsPending = tugasList.filter(t => t.draftBeritas?.length > 0 && t.draftBeritas[t.draftBeritas.length - 1].status_draft === 'draft').length;
  const statsPerluRevisi = tugasList.filter(t => t.draftBeritas?.length > 0 && t.draftBeritas[t.draftBeritas.length - 1].status_draft === 'review').length;

  if (loading && tugasList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Memuat data tugas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full border-red-100 bg-red-50">
          <CardContent className="pt-6 text-center text-red-900 font-medium">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p>{error}</p>
            <Button onClick={fetchTugas} variant="outline" className="mt-4">Coba Lagi</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Tugas Saya</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Kelola draft berita kegiatan pimpinan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tugas</p>
                <p className="text-2xl font-semibold text-blue-600">{statsTotal}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Belum Upload</p>
                <p className="text-2xl font-semibold text-orange-600">{statsBelumUpload}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-semibold text-blue-600">{statsPending}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Perlu Revisi</p>
                <p className="text-2xl font-semibold text-red-600">{statsPerluRevisi}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative group flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari agenda atau pimpinan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-blue-100 bg-blue-50/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <MonthPicker
                value={filterBulan}
                onChange={setFilterBulan}
                className="w-full sm:w-48"
              />
              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'Selesai', label: 'Selesai' },
                  { value: 'Berlangsung', label: 'Berlangsung' },
                  { value: 'Belum Dimulai', label: 'Belum Dimulai' }
                ]}
                icon={<Filter className="w-4 h-4" />}
                className="w-full sm:w-48"
                placeholder="Pilih Status"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            {filteredTugas.map((tugas) => {
              const statusInfo = getStatusInfo(tugas);
              const latestDraft = (tugas.draftBeritas && tugas.draftBeritas.length > 0)
                ? tugas.draftBeritas[tugas.draftBeritas.length - 1]
                : null;

              return (
                <Card key={tugas.id_penugasan} className="border border-blue-100 group hover:border-blue-200 transition-all shadow-sm">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Left Side - Info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 pr-4">
                              <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {tugas.agenda.nama_kegiatan}
                              </h3>
                              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                {tugas.pimpinans.map((p: any, idx: number) => (
                                  <span key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {p.nama_pimpinan} ({p.nama_jabatan})
                                  </span>
                                ))}
                              </div>
                            </div>
                            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                              </div>
                              {new Date(tugas.agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                                <Clock className="w-3.5 h-3.5 text-blue-600" />
                              </div>
                              {tugas.agenda.waktu_mulai.slice(0, 5)} - {tugas.agenda.waktu_selesai.slice(0, 5)}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                              </div>
                              {tugas.agenda.lokasi_kegiatan}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                                <FileText className="w-3.5 h-3.5 text-gray-600" />
                              </div>
                              Penugasan: {new Date(tugas.tanggal_penugasan).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>

                        {/* Instruksi */}
                        {tugas.deskripsi_penugasan && (
                          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">📋 Instruksi Kasubag:</p>
                            <p className="text-xs text-blue-900/80 leading-relaxed">{tugas.deskripsi_penugasan}</p>
                          </div>
                        )}

                        {/* Feedback Revisi */}
                        {latestDraft?.status_draft === 'draft' && latestDraft.catatan && (
                          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-1">📝 Catatan Revisi:</p>
                            <p className="text-xs text-red-900/80 leading-relaxed">{latestDraft.catatan}</p>
                          </div>
                        )}
                      </div>

                      {/* Right Side - Actions */}
                      <div className="flex flex-col gap-2 md:w-48">
                        {(() => {
                          const isFuture = new Date(tugas.agenda.tanggal_kegiatan).setHours(0,0,0,0) > new Date().setHours(0,0,0,0);
                          const disabledTitle = isFuture ? "Draft berita hanya dapat diserahkan pada hari H atau setelahnya" : "";

                          if (!latestDraft) {
                            return (
                              <Button
                                variant="default"
                                size="sm"
                                className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
                                onClick={() => handleUploadClick(tugas)}
                                disabled={isFuture}
                                title={disabledTitle}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Draft
                              </Button>
                            );
                          } else if (latestDraft.status_draft === 'review') {
                            return (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
                                  onClick={() => handleUploadClick(tugas)}
                                  disabled={isFuture}
                                  title={disabledTitle}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Upload Revisi
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                                  onClick={() => handleDetailClick(tugas)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Lihat Draft
                                </Button>
                              </>
                            );
                          } else {
                            return (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                                onClick={() => handleDetailClick(tugas)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Lihat {latestDraft.status_draft === 'draft' ? 'Progress' : 'Detail'}
                              </Button>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredTugas.length === 0 && (
              <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Tidak ada tugas ditemukan</h3>
                <p className="text-xs text-gray-500 mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda</p>
                <Button variant="ghost" size="sm" className="mt-4 text-blue-600" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>Reset Filter</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload/Edit Draft Modal */}
      {showUploadModal && selectedTugas && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-none">
            <CardHeader className="border-b border-gray-100 px-6 py-4 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-none">
                    {selectedTugas.draftBeritas?.length > 0 && selectedTugas.draftBeritas[selectedTugas.draftBeritas.length - 1].status_draft === 'draft' ? 'Upload Revisi Draft' : 'Upload Draft Berita'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5">{selectedTugas.agenda.nama_kegiatan}</p>
                </div>
                <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
              <form onSubmit={handleSubmitDraft} className="space-y-5">
                {/* Judul Draft */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                    Judul Draft Berita
                    <span className="text-[10px] text-red-500 font-normal">* Wajib diisi</span>
                  </label>
                  <input
                    type="text"
                    value={uploadForm.judul_draft}
                    onChange={(e) => setUploadForm({ ...uploadForm, judul_draft: e.target.value })}
                    placeholder="Masukkan judul berita yang menarik dan informatif..."
                    className="w-full px-4 py-3 border border-blue-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    required
                  />
                </div>

                {/* Konten Draft */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                    Konten Draft Berita
                    <span className="text-[10px] text-red-500 font-normal">* Wajib diisi</span>
                  </label>
                  <textarea
                    value={uploadForm.konten_draft}
                    onChange={(e) => setUploadForm({ ...uploadForm, konten_draft: e.target.value })}
                    rows={12}
                    placeholder="Tuliskan berita lengkap dengan format 5W+1H..."
                    className="w-full px-4 py-3 border border-blue-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all shadow-sm"
                    required
                  />
                </div>

                {/* Dokumentasi */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                    Dokumentasi
                    {(!selectedTugas.draftBeritas || selectedTugas.draftBeritas.length === 0) && (
                      <span className="text-[10px] text-red-500 font-normal">Minimal upload 3 file</span>
                    )}
                  </label>

                  <div className="p-6 border-2 border-dashed border-blue-200 rounded-2xl bg-white hover:border-blue-400 transition-colors flex flex-col items-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Klik untuk upload dokumentasi</p>
                    <p className="text-xs text-gray-500 mt-1">Mendukung format gambar (JPG, PNG) dan video (MP4)</p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                  />

                  {(uploadForm.foto_previews.length > 0 || uploadForm.existing_dokumentasi.length > 0) && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {/* Existing Dokumentasi */}
                      {uploadForm.existing_dokumentasi.map((doc: any, index: number) => (
                        <div key={`existing-${doc.id_dokumentasi}`} className="relative aspect-square group">
                          <img src={`/api/uploads/berita/${doc.file_path}`} alt={`Existing ${index + 1}`} className="w-full h-full object-cover rounded-xl border border-gray-100 shadow-sm opacity-90" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">Lama</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeExistingFoto(doc.id_dokumentasi); }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
                            title="Hapus foto ini"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* New Upload Previews */}
                      {uploadForm.foto_previews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative aspect-square group">
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-xl border border-blue-200 shadow-sm" />
                          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                            <span className="text-white bg-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">Baru</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeFoto(index); }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
                            title="Batal upload"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white/10 backdrop-blur-sm -mx-6 px-6 pb-2">
                  <Button type="button" variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setShowUploadModal(false)}>
                    Batal
                  </Button>
                  <Button type="submit" variant="default" className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl h-11 shadow-lg shadow-blue-200" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Menyerahkan...</>
                    ) : (
                      <><Upload className="w-4 h-4 mr-2" /> Serahkan Draft</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTugas && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-none">
            <CardHeader className="border-b border-gray-100 px-6 py-4 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Detail Draft Berita</h3>
                  <div className="mt-1">
                    {getStatusInfo(selectedTugas).label && <Badge variant={getStatusInfo(selectedTugas).variant}>{getStatusInfo(selectedTugas).label}</Badge>}
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1 bg-gray-50/20">
              {selectedTugas.draftBeritas && selectedTugas.draftBeritas.length > 0 ? (
                (() => {
                  const draft = selectedTugas.draftBeritas[selectedTugas.draftBeritas.length - 1];
                  return (
                    <div className="space-y-6 p-6">
                      <div className="space-y-1 border-l-4 border-blue-500 pl-4 bg-blue-50/30 py-2 rounded-r-xl">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Judul Berita</label>
                        <p className="text-lg font-bold text-gray-900 leading-snug">{draft.judul_berita}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tanggal Kirim</label>
                          <p className="text-sm font-medium text-gray-700">{new Date(draft.tanggal_kirim).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Agenda Utama</label>
                          <p className="text-sm font-medium text-gray-700 truncate">{selectedTugas.agenda.nama_kegiatan}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Isi Berita</label>
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">
                          {draft.isi_draft}
                        </div>
                      </div>

                      {draft.dokumentasis && draft.dokumentasis.length > 0 && (
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dokumentasi Terlampir ({draft.dokumentasis.length})</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {draft.dokumentasis.map((item: any, idx: number) => (
                              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                                onClick={() => window.open(`/api/uploads/berita/${item.file_path}`, '_blank')}>
                                <img
                                  src={`/api/uploads/berita/${item.file_path}`}
                                  alt={`Documentation ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Attachment';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {draft.revisies && draft.revisies.length > 0 && (
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Feedback Kasubag</label>
                          <div className="space-y-2">
                            {[...draft.revisies].sort((a: any, b: any) => new Date(b.tanggal_revisi).getTime() - new Date(a.tanggal_revisi).getTime()).map((revLog: any) => (
                              <div key={revLog.id_revisi} className="bg-amber-50/80 border border-amber-100 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                    <FileText className="w-3.5 h-3.5" />
                                  </div>
                                  <label className="text-xs font-bold text-amber-900 uppercase">
                                    {new Date(revLog.tanggal_revisi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </label>
                                </div>
                                <p className="text-sm text-amber-900 leading-relaxed font-medium italic">"{revLog.catatan_revisi}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {draft.catatan && (!draft.revisies || draft.revisies.length === 0) && (
                        <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <label className="text-xs font-bold text-blue-900 uppercase">Feedback Kasubag (Legacy)</label>
                          </div>
                          <p className="text-sm text-blue-800 leading-relaxed">{draft.catatan}</p>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                    <FileText className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-900 font-bold mb-1">Belum ada draft</p>
                  <p className="text-sm text-gray-500 mb-6">Anda belum menyerahkan draft berita untuk tugas ini.</p>
                  <Button variant="default" onClick={() => { setShowDetailModal(false); handleUploadClick(selectedTugas); }}>Upload Draft Sekarang</Button>
                </div>
              )}
            </CardContent>
            <CardHeader className="border-t border-gray-100 px-6 py-4 bg-white flex-shrink-0">
              <Button variant="outline" className="w-full" onClick={() => setShowDetailModal(false)}>Tutup</Button>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
}
