import { useState, useEffect, useCallback } from 'react';
import { penugasanApi } from '../../lib/api';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Calendar, MapPin, User, Users, FileText, ClipboardList, Check, Clock, TrendingUp, Image } from 'lucide-react';
import TambahLaporanModal from '../../components/modals/TambahLaporanModal';

export default function TugasDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tugas, setTugas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await penugasanApi.getPenugasanDetail(id);
      if (res.success && res.data) {
        const p = res.data;
        setTugas({
          id: p.id_penugasan,
          agenda_id: p.id_agenda,
          judul_kegiatan: p.agenda?.nama_kegiatan || '-',
          pimpinans: p.pimpinans || [],
          jabatan: p.agenda?.agendaPimpinans?.[0]?.periodeJabatan?.jabatan?.nama_jabatan || '-',
          tanggal: p.agenda?.tanggal_kegiatan || p.tanggal_penugasan,
          waktu: `${p.agenda?.waktu_mulai?.slice(0, 5) || ''} - ${p.agenda?.waktu_selesai?.slice(0, 5) || ''}`,
          tempat: p.agenda?.lokasi_kegiatan || '-',
          status_laporan: p.status_pelaksanaan || '-',
          penugasan_dari: p.kasubag?.nama || 'Kasubag',
          tanggal_penugasan: p.tanggal_penugasan,
          instruksi: p.deskripsi_penugasan,
          staf_ditugaskan: p.nama_staf || [],
          progress_reports: p.laporanKegiatans || [],
          contact_person: p.agenda?.contact_person || '-',
          catatan_agenda: p.agenda?.keterangan || '-',
          kaskpd_pendamping: p.agenda?.kaskpdPendampings?.map((k: any) => k.kaskpd?.nama_instansi).filter(Boolean) || []
        });
      }
    } catch (error) {
      console.error('Error fetching penugasan detail:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat detail tugas...</div>;
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Berlangsung':
        return <Badge variant="info" className="bg-blue-50 text-blue-700 border-blue-100">Berlangsung</Badge>;
      case 'Belum Dimulai':
      case 'Belum Dilaporkan':
        return <Badge variant="warning" className="bg-amber-50 text-amber-700 border-amber-100">Belum Dimulai</Badge>;
      case 'Selesai':
        return <Badge variant="success" className="bg-green-50 text-green-700 border-green-100">Selesai</Badge>;
      default:
        return <Badge className="bg-gray-50 text-gray-700 border-gray-100">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Detail Laporan Kegiatan</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">{tugas.judul_kegiatan}</p>
          </div>
        </div>
        {tugas.status_laporan !== 'Selesai' && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setModalOpen(true)}
            disabled={new Date(tugas.tanggal).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)}
            title={new Date(tugas.tanggal).setHours(0,0,0,0) > new Date().setHours(0,0,0,0) ? "Laporan hanya dapat ditambahkan pada hari H atau setelahnya" : ""}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Progress
          </Button>
        )}
      </div>

      {/* ── Informasi Kegiatan ── */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Informasi Kegiatan</h3>
            {getStatusBadge(tugas.status_laporan)}
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pimpinan */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <User className="w-3.5 h-3.5" /> Pimpinan
              </label>
              <div className="space-y-2">
                {tugas.pimpinans.map((p: any, idx: number) => (
                  <div key={idx}>
                    <p className="text-sm font-medium text-gray-900">{p.nama_pimpinan}</p>
                    <p className="text-[11px] text-gray-500 uppercase">{p.nama_jabatan}</p>
                  </div>
                ))}
                {tugas.pimpinans.length === 0 && <p className="text-sm text-gray-900">-</p>}
              </div>
            </div>

            {/* Waktu */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Clock className="w-3.5 h-3.5" /> Waktu
              </label>
              <p className="text-sm text-gray-900">{tugas.waktu}</p>
            </div>

            {/* Judul Kegiatan */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <FileText className="w-3.5 h-3.5" /> Judul Kegiatan
              </label>
              <p className="text-sm text-gray-900">{tugas.judul_kegiatan}</p>
            </div>

            {/* Tempat */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <MapPin className="w-3.5 h-3.5" /> Tempat
              </label>
              <p className="text-sm text-gray-900">{tugas.tempat}</p>
            </div>

            {/* Tanggal */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Tanggal
              </label>
              <p className="text-sm text-gray-900">
                {new Date(tugas.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Keterangan / Instruksi */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <ClipboardList className="w-3.5 h-3.5" /> Deskripsi Penugasan
              </label>
              <p className="text-sm text-gray-900">{tugas.instruksi || '-'}</p>
            </div>

            {/* Staf Ditugaskan */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Users className="w-3.5 h-3.5" /> Staf Ditugaskan
              </label>
              <div className="flex flex-wrap gap-1.5">
                <p className="text-sm text-gray-900 mt-1">
                  {tugas.staf_ditugaskan.length > 0
                    ? tugas.staf_ditugaskan.join(', ')
                    : <span className="text-gray-400 italic">Tidak ada staf</span>}
                </p>
              </div>
            </div>

            {/* ── Additional Coordination Info ── */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <User className="w-3.5 h-3.5" /> Kontak Person
              </label>
              <p className="text-sm font-semibold text-blue-600">{tugas.contact_person}</p>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Users className="w-3.5 h-3.5" /> KaSKPD Pendamping
              </label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tugas.kaskpd_pendamping.length > 0 ? (
                  tugas.kaskpd_pendamping.map((k: string, i: number) => (
                    <Badge key={i} variant="secondary" className="bg-gray-100 text-[10px] text-gray-700">
                      {k}
                    </Badge>
                  ))
                ) : (
                  <p className="text-[11px] text-gray-400 italic">Tidak ada pendamping</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <ClipboardList className="w-3.5 h-3.5" /> Catatan Agenda
              </label>
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
                <p className="text-sm text-gray-900 italic leading-relaxed">
                  {tugas.catatan_agenda || '-'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Timeline Progress Protokoler ── */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-900">Timeline Progress Protokoler</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Laporan kegiatan protokoler dari Tim Protokol</p>
            </div>
            <Badge variant="info">{tugas.progress_reports.length} Update</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {tugas.progress_reports.length > 0 ? (
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-blue-200" />

              <div className="space-y-6">
                {tugas.progress_reports.map((report: any, index: number) => (
                  <div key={report.id_laporan || index} className="flex gap-4">
                    {/* dot */}
                    <div className="relative z-10 flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>

                    {/* card */}
                    <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-white">
                      {/* top row */}
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="info">{report.deskripsi_laporan}</Badge>
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
                            <Image className="w-3.5 h-3.5" /> Dokumentasi
                          </p>
                          <div className="w-full rounded-lg bg-gray-50 border border-gray-200 overflow-hidden">
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
                      <p className="text-xs text-gray-400 mt-2">Oleh: {report.staff?.nama || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500 mb-4">Belum ada progress yang dilaporkan</p>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setModalOpen(true)}
                disabled={new Date(tugas.tanggal).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)}
                title={new Date(tugas.tanggal).setHours(0,0,0,0) > new Date().setHours(0,0,0,0) ? "Laporan hanya dapat ditambahkan pada hari H atau setelahnya" : ""}
              >
                <Plus className="w-4 h-4 mr-2" />
                Mulai Laporan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Footer Button ── */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => navigate(-1)} className="px-10">
          Kembali ke Daftar
        </Button>
      </div>

      {/* ── Modal ── */}
      <TambahLaporanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        idPenugasan={tugas.id}
        onSuccess={fetchDetail}
      />
    </div>
  );
}