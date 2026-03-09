import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  ArrowLeft, CheckCircle, ClipboardList, Calendar, MapPin, Clock, User,
  Loader2, AlertCircle, Users, FileText, TrendingUp
} from 'lucide-react';
import { penugasanApi } from '../../lib/api';
import Swal from 'sweetalert2';

interface SlotStaff {
  tanggal: string;
  id_slot_waktu: string;
  id_user_staff: string;
  kehadiran: string | null;
  staff: { id_user: string; nama: string; email: string } | null;
  slotWaktu: { slot_waktu_mulai: string; slot_waktu_selesai: string } | null;
}

interface DokumentasiBerita {
  id_dokumentasi: string;
  file_path: string;
}

interface DraftBerita {
  id_draft_berita: string;
  judul_berita: string;
  isi_draft: string;
  catatan: string | null;
  status_draft: string;
  tanggal_kirim: string;
  dokumentasis: DokumentasiBerita[];
}

interface LaporanKegiatan {
  id_laporan: string;
  deskripsi_laporan: string;
  catatan_laporan: string;
  dokumentasi_laporan: string | null;
  createdAt: string;
  staff: { id_user: string; nama: string } | null;
}

interface PenugasanDetail {
  id_penugasan: string;
  jenis_penugasan: string;
  deskripsi_penugasan: string;
  tanggal_penugasan: string;
  status: 'pending' | 'progress' | 'selesai' | null;
  status_pelaksanaan: string;
  nama_staf: string[];
  pimpinans: { nama_pimpinan: string; nama_jabatan: string }[];
  agenda: {
    id_agenda: string;
    nama_kegiatan: string;
    tanggal_kegiatan: string;
    waktu_mulai: string;
    waktu_selesai: string;
    lokasi_kegiatan: string;
    agendaPimpinans?: any[];
  } | null;
  slotAgendaStaffs: SlotStaff[];
  laporanKegiatans: LaporanKegiatan[];
  draftBeritas: DraftBerita[];
}

export default function DetailPenugasanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [penugasan, setPenugasan] = useState<PenugasanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await penugasanApi.getPenugasanDetail(id);
        if (res.success && res.data) {
          setPenugasan(res.data);
        } else {
          setError(res.message || 'Penugasan tidak ditemukan');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat menghubungi server');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (newStatus: 'pending' | 'progress' | 'selesai') => {
    if (!id || !penugasan) return;

    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menandai penugasan ini sebagai ${newStatus === 'selesai' ? 'Selesai' : 'Berlangsung'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    setIsReviewing(true);
    try {
      const res = await penugasanApi.updateStatusPenugasan(id, newStatus);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Penugasan berhasil ditandai sebagai ${newStatus === 'selesai' ? 'Selesai' : 'Berlangsung'}.`,
          confirmButtonColor: '#2563eb'
        });
        const statusLabel = newStatus === 'selesai' ? 'Selesai' : newStatus === 'progress' ? 'Berlangsung' : 'Belum Dimulai';
        setPenugasan(prev => prev ? { ...prev, status: newStatus, status_pelaksanaan: statusLabel } : prev);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: res.message || 'Gagal memperbarui status',
          confirmButtonColor: '#2563eb'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat menghubungi server',
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const formatTime = (time: string | null | undefined) => {
    if (!time) return '-';
    return time.slice(0, 5);
  };

  // Logic to determine status badge display
  const getDisplayStatus = () => {
    if (!penugasan) return { label: 'Unknown', variant: 'default' as any };

    if (penugasan.status === 'selesai' || penugasan.status_pelaksanaan === 'Selesai') {
      return { label: 'Selesai', variant: 'success' as any };
    }

    if (penugasan.laporanKegiatans && penugasan.laporanKegiatans.length > 0) {
      return { label: 'Berlangsung', variant: 'info' as any };
    }

    return { label: 'Belum Dimulai', variant: 'warning' as any };
  };

  const statusInfo = getDisplayStatus();

  const isMedia = penugasan?.jenis_penugasan === 'media';
  const themeColor = isMedia ? 'purple' : 'blue';
  const themeBg = isMedia ? 'bg-purple-600' : 'bg-blue-600';
  const themeText = isMedia ? 'text-purple-600' : 'text-blue-600';
  const themeBorder = isMedia ? 'border-purple-200' : 'border-blue-200';
  const themeLightBg = isMedia ? 'bg-purple-50' : 'bg-blue-50';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className={`w-8 h-8 animate-spin ${themeText}`} />
          <p className="text-sm">Memuat detail penugasan...</p>
        </div>
      </div>
    );
  }

  if (error || !penugasan) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <Card>
          <CardContent className="p-8 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <p className="text-gray-700 font-medium">Penugasan tidak ditemukan</p>
            <p className="text-sm text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Detail Penugasan</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-600">
                {penugasan.agenda?.nama_kegiatan || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Only show "Tandai Selesai" if already in progress (has reports) */}
        {penugasan.status !== 'selesai' && penugasan.laporanKegiatans.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleUpdateStatus('selesai')}
              disabled={isReviewing}
              className={`${themeBg} hover:opacity-90 text-white transition-opacity`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isReviewing ? 'Memproses...' : 'Tandai Selesai'}
            </Button>
          </div>
        )}
      </div>

      {/* Informasi Penugasan */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Informasi Penugasan</h3>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${themeText}`} />
                  Agenda Terkait
                </label>
                <p className="text-sm text-gray-900 mt-1 font-semibold">
                  {penugasan.agenda?.nama_kegiatan || '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <User className={`w-4 h-4 ${themeText}`} />
                  Pimpinan
                </label>
                <div className="mt-1 space-y-2">
                  {penugasan.pimpinans.map((p, idx) => (
                    <div key={idx}>
                      <p className="text-sm text-gray-900 font-semibold">{p.nama_pimpinan}</p>
                      <p className="text-[11px] text-gray-500 uppercase tracking-tight">{p.nama_jabatan}</p>
                    </div>
                  ))}
                  {penugasan.pimpinans.length === 0 && <p className="text-sm text-gray-900">-</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${themeText}`} />
                  Tanggal Kegiatan
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {penugasan.agenda?.tanggal_kegiatan
                    ? new Date(penugasan.agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                    : '-'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${themeText}`} />
                  Waktu
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {penugasan.agenda?.waktu_mulai
                    ? `${formatTime(penugasan.agenda.waktu_mulai)} – ${formatTime(penugasan.agenda.waktu_selesai)}`
                    : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${themeText}`} />
                  Lokasi
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {penugasan.agenda?.lokasi_kegiatan || '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className={`w-4 h-4 ${themeText}`} />
                  Staf Ditugaskan
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {penugasan.nama_staf.length > 0
                    ? penugasan.nama_staf.join(', ')
                    : <span className="text-gray-400 italic">Tidak ada staf</span>}
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ClipboardList className={`w-4 h-4 ${themeText}`} />
                Deskripsi Penugasan
              </label>
              <p className="text-sm text-gray-900 mt-1">
                {penugasan.deskripsi_penugasan || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Laporan Kegiatan */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-5 h-5 ${themeText}`} />
                <h3 className="text-base font-semibold text-gray-900">Timeline Progress {isMedia ? 'Media' : 'Protokoler'}</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Laporan kegiatan {isMedia ? 'media' : 'protokoler'} dari Tim {isMedia ? 'Media' : 'Protokol'}</p>
            </div>
            <Badge variant="info">{penugasan.laporanKegiatans?.length ?? 0} Update</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {!penugasan.laporanKegiatans || penugasan.laporanKegiatans.length === 0 ? (
            <div className="text-center py-10">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">Belum ada progress yang dilaporkan oleh staf</p>
            </div>
          ) : (
            <div className="relative">
              {/* vertical line */}
              <div className={`absolute left-3 top-4 bottom-4 w-0.5 ${isMedia ? 'bg-purple-200' : 'bg-blue-200'}`} />

              <div className="space-y-6">
                {penugasan.laporanKegiatans.map((report, index) => (
                  <div key={report.id_laporan || index} className="flex gap-4">
                    {/* dot */}
                    <div className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full ${isMedia ? 'bg-purple-600' : 'bg-blue-600'} border-2 border-white shadow flex items-center justify-center mt-0.5`}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>

                    {/* card */}
                    <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                      {/* top row */}
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${isMedia ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{report.deskripsi_laporan}</Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(report.createdAt).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}{', '}
                          {new Date(report.createdAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* catatan */}
                      <p className="text-sm text-gray-700 mb-3">{report.catatan_laporan || '-'}</p>

                      {/* dokumentasi */}
                      {report.dokumentasi_laporan && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                            🖼 Dokumentasi
                          </p>
                          <div className="w-full rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shadow-inner">
                            <img
                              src={`/api/uploads/laporan/${report.dokumentasi_laporan}`}
                              alt="Dokumentasi"
                              className="w-full h-auto max-h-80 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                              onClick={() => window.open(`/api/uploads/laporan/${report.dokumentasi_laporan}`, '_blank')}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Gambar+Tidak+Tersedia';
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* oleh */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <div className={`w-6 h-6 rounded-full ${isMedia ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'} flex items-center justify-center text-[10px] font-bold`}>
                          {report.staff?.nama?.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-[10px] text-gray-500">Dilaporkan oleh: <span className={`font-semibold ${isMedia ? 'text-purple-900' : 'text-blue-900'}`}>{report.staff?.nama || '-'}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Draft Berita Section - ONLY for Media */}
      {isMedia && penugasan.draftBeritas && penugasan.draftBeritas.length > 0 && (
        <Card className="border-purple-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-purple-50/50 border-b border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">Draft Berita & Dokumentasi</h3>
              </div>
              <Badge className={
                penugasan.draftBeritas[0].status_draft === 'approved' ? 'bg-green-100 text-green-700' :
                  penugasan.draftBeritas[0].status_draft === 'draft' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
              }>
                {penugasan.draftBeritas[0].status_draft === 'approved' ? 'Disetujui' :
                  penugasan.draftBeritas[0].status_draft === 'draft' ? 'Perlu Revisi' :
                    'Pending Review'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{penugasan.draftBeritas[0].judul_berita}</h4>
                <div
                  className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100"
                  dangerouslySetInnerHTML={{ __html: penugasan.draftBeritas[0].isi_draft }}
                />
              </div>

              {penugasan.draftBeritas[0].status_draft === 'draft' && penugasan.draftBeritas[0].catatan && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-xs font-bold text-red-800 mb-1">Catatan Revisi:</p>
                  <p className="text-xs text-red-700">{penugasan.draftBeritas[0].catatan}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Dokumentasi Media</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {penugasan.draftBeritas[0].dokumentasis?.map((doc, idx) => (
                    <div key={idx} className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                      {doc.file_path && (doc.file_path.toLowerCase().endsWith('.jpg') || doc.file_path.toLowerCase().endsWith('.jpeg') || doc.file_path.toLowerCase().endsWith('.png') || doc.file_path.toLowerCase().endsWith('.webp')) ? (
                        <img
                          src={`/api/uploads/berita/${doc.file_path}`}
                          alt="Dokumentasi"
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 cursor-pointer"
                          onClick={() => window.open(`/api/uploads/berita/${doc.file_path}`, '_blank')}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
                          <TrendingUp className="w-8 h-8 text-purple-400" />
                          <span className="text-[10px] text-gray-500 font-medium text-center truncate w-full">MEDIA FILE</span>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-6 text-[10px] px-2"
                            onClick={() => window.open(`/api/uploads/berita/${doc.file_path}`, '_blank')}
                          >
                            Buka File
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ringkasan */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Ringkasan Penugasan</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${isMedia ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 text-center`}>
              <p className="text-sm text-gray-600 mb-1">Total Update</p>
              <p className={`text-2xl font-semibold ${themeText}`}>
                {penugasan.laporanKegiatans?.length ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Laporan</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Staf Bertugas</p>
              <p className="text-2xl font-semibold text-green-600">{penugasan.nama_staf.length}</p>
              <p className="text-xs text-gray-500 mt-1">Orang</p>
            </div>
            <div className={`${isMedia ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 text-center`}>
              <p className="text-sm text-gray-600 mb-1">Status Terbaru</p>
              <div className="flex justify-center mt-2">
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Action */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="px-12 hover:bg-gray-50">
          Kembali ke Monitoring
        </Button>
      </div>

    </div>
  );
}

