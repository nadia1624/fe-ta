import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  ArrowLeft, ClipboardList, Calendar, MapPin, Clock, User,
  Loader2, AlertCircle, Users, FileText, TrendingUp
} from 'lucide-react';
import { penugasanApi } from '../../lib/api';

interface SlotStaff {
  tanggal: string;
  id_slot_waktu: string;
  id_user_staff: string;
  kehadiran: string | null;
  staff: { id_user: string; nama: string; email: string } | null;
  slotWaktu: { slot_waktu_mulai: string; slot_waktu_selesai: string } | null;
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
}

export default function DetailLaporanStafMediaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [penugasan, setPenugasan] = useState<PenugasanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const formatTime = (time: string | null | undefined) => {
    if (!time) return '-';
    return time.slice(0, 5);
  };

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
  const themeText = 'text-blue-600';

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
      </div>

      {/* Informasi Penugasan - EXACT MIRROR */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Informasi Penugasan</h3>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
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

      {/* Timeline Laporan Kegiatan - EXACT MIRROR */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-5 h-5 ${themeText}`} />
                <h3 className="text-base font-semibold text-gray-900">Timeline Progress Protokoler</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Laporan kegiatan protokoler dari Tim Protokol</p>
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
              <div className={`absolute left-3 top-4 bottom-4 w-0.5 bg-blue-200`} />

              <div className="space-y-6">
                {penugasan.laporanKegiatans.slice().reverse().map((report, index) => (
                  <div key={report.id_laporan || index} className="flex gap-4">
                    {/* dot */}
                    <div className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow flex items-center justify-center mt-0.5`}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>

                    {/* card */}
                    <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                      {/* top row */}
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-100 text-blue-700">{report.deskripsi_laporan}</Badge>
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
                        <div className={`w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold`}>
                          {report.staff?.nama?.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-[10px] text-gray-500">Dilaporkan oleh: <span className={`font-semibold text-blue-900`}>{report.staff?.nama || '-'}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ringkasan - EXACT MIRROR */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Ringkasan Penugasan</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
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
          Kembali
        </Button>
      </div>
    </div>
  );
}
