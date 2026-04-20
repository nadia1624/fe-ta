import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  CheckCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  ClipboardList,
  TrendingUp
} from 'lucide-react';
import { beritaApi } from '../../lib/api';
import { toast } from '../../lib/swal';

export default function ReviewDraftBeritaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchDraftDetail();
    }
  }, [id]);

  const fetchDraftDetail = async () => {
    try {
      setLoading(true);
      const res = await beritaApi.getDraftDetail(id!);
      if (res.success) {
        setDraft(res.data);
        // Pre-fill catatan if exists
        if (res.data?.catatan) {
          setCatatan(res.data.catatan);
        }
      } else {
        setError(res.message || 'Gagal mengambil detail draft berita');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status: 'approved' | 'review') => {
    if (status === 'review' && !catatan.trim()) {
      toast.warning('Catatan Diperlukan', 'Mohon berikan catatan revisi agar staf tahu apa yang perlu diperbaiki.');
      return;
    }

    const confirmText = status === 'approved'
      ? 'Setujui draft berita ini untuk dipublikasikan?'
      : 'Kirim kembali draft ini untuk direvisi?';

    const { isConfirmed } = await toast.confirm(
      'Konfirmasi',
      confirmText
    );

    if (isConfirmed) {
      try {
        setSubmitting(true);
        const res = await beritaApi.reviewDraft(id!, { status_draft: status, catatan });
        if (res.success) {
          toast.success('Berhasil', res.message);
          // Refetch to get updated status and history
          fetchDraftDetail();
        } else {
          toast.error('Gagal', res.message);
        }
      } catch (err) {
        toast.error('Kesalahan', 'Terjadi kesalahan saat memproses permintaan');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const nextImage = () => {
    if (draft?.dokumentasis?.length > 0) {
      setCurrentImageIndex((prev) => (prev === draft.dokumentasis.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (draft?.dokumentasis?.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? draft.dokumentasis.length - 1 : prev - 1));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Disetujui</Badge>;
      case 'draft':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending Review</Badge>;
      case 'review':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Perlu Revisi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Memuat detail draft...</p>
        </div>
      </div>
    );
  }

  if (error || !draft) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full border-red-100 bg-red-50">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Draft Tidak Ditemukan</h3>
            <p className="text-red-700 text-sm mb-6">{error || 'Data draft tidak tersedia.'}</p>
            <Button onClick={() => navigate(-1)} className="bg-red-600 hover:bg-red-700">
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isReviewable = draft.status_draft === 'draft';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="rounded-full h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{draft.judul_berita}</h1>
            <p className="text-xs text-gray-500">Direview sebagai Kasubag Media</p>
          </div>
        </div>
        {getStatusBadge(draft.status_draft)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Content & Documentation */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Isi Berita</h3>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: draft.isi_draft }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Revision History for this version */}
          {draft.revisies && draft.revisies.length > 0 && (
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-amber-50/50 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-amber-900">Riwayat Catatan Review</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {draft.revisies.map((revLog: any) => (
                  <div key={revLog.id_revisi} className="relative pl-4 border-l-2 border-amber-200 py-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Catatan Review</p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(revLog.tanggal_revisi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{revLog.catatan_revisi}"</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Documentation Section */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Dokumentasi &amp; Media</h3>
                <span className="text-xs font-medium text-gray-500">
                  {draft.dokumentasis?.length || 0} File
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {draft.dokumentasis?.length > 0 ? (
                <div className="relative group bg-gray-900 aspect-video md:aspect-[21/9] overflow-hidden flex items-center justify-center">
                  {(() => {
                    const currentFile = draft.dokumentasis[currentImageIndex].file_path;
                    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(currentFile);

                    if (isImage) {
                      return (
                        <img
                          src={`/api/uploads/berita/${currentFile}`}
                          alt="Dokumentasi"
                          className="w-full h-full object-contain cursor-pointer"
                          onClick={() => window.open(`/api/uploads/berita/${currentFile}`, '_blank')}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Gambar+Tidak+Tersedia';
                          }}
                        />
                      );
                    } else {
                      return (
                        <div className="flex flex-col items-center gap-4 text-white">
                          <TrendingUp className="w-16 h-16 text-blue-400" />
                          <div className="text-center">
                            <p className="text-sm font-bold">File Media</p>
                            <p className="text-[10px] opacity-60 mt-1">{currentFile}</p>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.open(`/api/uploads/berita/${currentFile}`, '_blank')}
                          >
                            Open Media File
                          </Button>
                        </div>
                      );
                    }
                  })()}

                  {draft.dokumentasis.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-2.5 rounded-full transition-all z-10 hover:bg-black/60 shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-2.5 rounded-full transition-all z-10 hover:bg-black/60 shadow-lg"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50">
                  <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm italic">Tidak ada dokumentasi terlampir</p>
                </div>
              )}

              {draft.dokumentasis?.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50 border-t border-gray-100">
                  {draft.dokumentasis.map((doc: any, idx: number) => {
                    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.file_path);
                    return (
                      <button
                        key={doc.id_dokumentasi}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-20 h-14 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-200 ${currentImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-100 scale-105' : 'border-transparent hover:border-blue-300'
                          }`}
                      >
                        {isImage ? (
                          <img
                            src={`/api/uploads/berita/${doc.file_path}`}
                            className="w-full h-full object-cover"
                            alt=""
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Informasi Draft</h3>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Staf Pengirim</p>
                  <p className="text-sm font-semibold text-gray-900">{draft.staff?.nama}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Agenda Terkait</p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {draft.penugasan?.agenda?.nama_kegiatan}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal Kirim</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {draft.tanggal_kirim ? new Date(draft.tanggal_kirim).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Panel — conditional based on status */}
          {isReviewable ? (
            <Card className="border-none shadow-sm ring-1 ring-blue-100 bg-blue-50/30">
              <CardHeader>
                <h3 className="font-bold text-blue-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Review &amp; Catatan
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <textarea
                    className="w-full min-h-[120px] p-3 text-sm border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none transition-all placeholder:text-gray-400 shadow-inner"
                    placeholder="Berikan masukan atau catatan revisi di sini..."
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-500 italic">
                    * Catatan wajib diisi jika Anda mengirimkan permintaan revisi.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Button
                    onClick={() => handleReview('approved')}
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold h-11 shadow-md hover:shadow-lg transition-all rounded-xl gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {submitting ? 'Memproses...' : 'Setujui & Terbitkan'}
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleReview('review')}
                      disabled={submitting}
                      variant="outline"
                      className="border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 font-semibold h-11 rounded-xl bg-white gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Revisi
                    </Button>
                    <Button
                      onClick={() => navigate(-1)}
                      variant="ghost"
                      className="text-gray-500 h-11 rounded-xl hover:bg-gray-100"
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={`border-none shadow-sm ring-1 ${draft.status_draft === 'approved' ? 'ring-green-200 bg-green-50/30' : 'ring-red-200 bg-red-50/30'}`}>
              <CardHeader>
                <h3 className={`font-bold flex items-center gap-2 ${draft.status_draft === 'approved' ? 'text-green-900' : 'text-red-900'}`}>
                  {draft.status_draft === 'approved'
                    ? <><CheckCircle className="w-4 h-4" /> Draft Sudah Disetujui</>
                    : <><MessageSquare className="w-4 h-4" /> Dikembalikan untuk Revisi (Status: Perlu Tindakan Staf)</>
                  }
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {draft.catatan && (
                  <div className={`p-3 rounded-xl border text-sm leading-relaxed ${draft.status_draft === 'approved' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Catatan Review:</p>
                    <p>{draft.catatan}</p>
                  </div>
                )}
                {!draft.catatan && (
                  <p className="text-sm text-gray-500 italic">Tidak ada catatan tambahan.</p>
                )}
                <Button onClick={() => navigate(-1)} variant="outline" className="w-full mt-2">
                  Kembali
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
