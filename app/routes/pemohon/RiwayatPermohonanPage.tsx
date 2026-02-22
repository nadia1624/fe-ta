import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { CheckCircle, Clock, XCircle, FileText, Eye, X, Search, Filter, Loader2, RefreshCw, Calendar, MapPin, Users, Edit3, RotateCcw, AlertTriangle, Upload, Check } from 'lucide-react';
import { agendaApi, pimpinanApi } from '../../lib/api';
import Swal from 'sweetalert2';

type StatusType = 'pending' | 'revision' | 'rejected_sespri' | 'approved_sespri' | 'approved_ajudan' | 'delegated' | 'rejected_ajudan' | 'canceled' | 'completed';

const STATUS_CONFIG: Record<StatusType, { label: string; variant: string; icon: any; color: string; bg: string; borderColor: string }> = {
  pending: { label: 'Menunggu Verifikasi', variant: 'warning', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', borderColor: 'border-l-amber-500' },
  revision: { label: 'Perlu Revisi', variant: 'info', icon: RotateCcw, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-l-blue-500' },
  rejected_sespri: { label: 'Ditolak Sespri', variant: 'danger', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', borderColor: 'border-l-red-500' },
  approved_sespri: { label: 'Diverifikasi', variant: 'success', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', borderColor: 'border-l-green-500' },
  approved_ajudan: { label: 'Disetujui Pimpinan', variant: 'success', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-l-emerald-500' },
  delegated: { label: 'Diwakilkan', variant: 'info', icon: RotateCcw, color: 'text-indigo-600', bg: 'bg-indigo-50', borderColor: 'border-l-indigo-500' },
  rejected_ajudan: { label: 'Ditolak Pimpinan', variant: 'danger', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', borderColor: 'border-l-red-500' },
  canceled: { label: 'Dibatalkan', variant: 'secondary', icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-50', borderColor: 'border-l-gray-400' },
  completed: { label: 'Selesai', variant: 'success', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', borderColor: 'border-l-green-500' },
};

const KPI_CONFIG = [
  { id: 'waiting', label: 'Menunggu Verifikasi', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', borderColor: 'border-l-amber-500', statuses: ['pending'] },
  { id: 'verified', label: 'Diverifikasi', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', borderColor: 'border-l-green-500', statuses: ['approved_sespri'] },
  { id: 'approved', label: 'Disetujui', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-l-emerald-500', statuses: ['approved_ajudan', 'delegated'] },
  { id: 'rejected', label: 'Ditolak', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', borderColor: 'border-l-red-500', statuses: ['rejected_sespri', 'rejected_ajudan'] },
  { id: 'needs_revision', label: 'Perlu Revisi', icon: RotateCcw, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-l-blue-500', statuses: ['revision'] },
  { id: 'canceled', label: 'Dibatalkan', icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-50', borderColor: 'border-l-gray-400', statuses: ['canceled'] },
  { id: 'completed', label: 'Selesai', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', borderColor: 'border-l-green-500', statuses: ['completed'] },
];

export default function RiwayatPermohonanPage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    nomor_surat: '',
    tanggal_surat: '',
    perihal: '',
    nama_kegiatan: '',
    lokasi_kegiatan: '',
    keterangan: '',
    tanggal_kegiatan: '',
    waktu_mulai: '',
    waktu_selesai: '',
  });
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await agendaApi.getMyAgendas();
      if (response.success) {
        setMyRequests(response.data || []);
      } else {
        setError(response.message || 'Gagal mengambil data riwayat');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = (request: any) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleEdit = (request: any) => {
    setSelectedRequest(request);
    setEditForm({
      nomor_surat: request.nomor_surat || '',
      tanggal_surat: request.tanggal_surat || '',
      perihal: request.perihal || '',
      nama_kegiatan: request.nama_kegiatan || '',
      lokasi_kegiatan: request.lokasi_kegiatan || '',
      keterangan: request.keterangan || '',
      tanggal_kegiatan: request.tanggal_kegiatan || '',
      waktu_mulai: request.waktu_mulai ? request.waktu_mulai.substring(0, 5) : '',
      waktu_selesai: request.waktu_selesai ? request.waktu_selesai.substring(0, 5) : '',
    });
    setEditFile(null);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setEditLoading(true);
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (editFile) formData.append('surat_permohonan', editFile);

      const response = await agendaApi.update(selectedRequest.id_agenda, formData);
      if (response.success) {
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Permohonan berhasil direvisi dan dikirim ulang.', confirmButtonText: 'OK' });
        setShowEditModal(false);
        fetchData();
      } else {
        Swal.fire('Gagal', response.message || 'Gagal memperbarui', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal terhubung ke server', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusInfo = (request: any) => {
    const sorted = request.statusAgendas
      ? [...request.statusAgendas].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [];
    const latest = sorted[0];
    return {
      status: (latest?.status_agenda || 'pending') as StatusType,
      catatan: latest?.catatan || null,
      tanggal: latest?.tanggal_status || null,
    };
  };

  const filteredData = myRequests.filter(item => {
    const { status } = getStatusInfo(item);
    const matchSearch =
      (item.nomor_surat?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.perihal?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.nama_kegiatan?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchStatus = filterStatus === 'all' ||
      (KPI_CONFIG.find(k => k.id === filterStatus)?.statuses.includes(status) || status === filterStatus);
    return matchSearch && matchStatus;
  });

  if (loading && myRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Memuat data riwayat...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Riwayat Permohonan</h1>
          <p className="text-sm text-gray-600 mt-1">Lihat status dan riwayat semua permohonan yang telah Anda ajukan</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="w-full md:w-auto">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <Button variant="ghost" size="sm" onClick={fetchData} className="text-red-700 hover:bg-red-100">Coba Lagi</Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
        {KPI_CONFIG.map((kpi) => {
          const Icon = kpi.icon;
          const count = myRequests.filter(r => kpi.statuses.includes(getStatusInfo(r).status)).length;
          return (
            <Card key={kpi.id} className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${kpi.borderColor} ${filterStatus === kpi.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setFilterStatus(filterStatus === kpi.id ? 'all' : kpi.id)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider leading-tight">{kpi.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{count}</p>
                  </div>
                  <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Daftar Permohonan ({filteredData.length})</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari permohonan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm w-full md:w-64 transition-all"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm appearance-none flex-1 transition-all"
                >
                  <option value="all">Semua Status</option>
                  {KPI_CONFIG.map(kpi => (
                    <option key={kpi.id} value={kpi.id}>{kpi.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filteredData.map((request) => {
              const statusInfo = getStatusInfo(request);
              const config = STATUS_CONFIG[statusInfo.status];
              return (
                <div key={request.id_agenda} className="p-6 hover:bg-gray-50/80 transition-all group">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-lg truncate">{request.perihal}</h4>
                        <Badge variant={config.variant as any}>{config.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.nama_kegiatan}</p>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                        <div className="flex items-center text-xs text-gray-500 gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {request.tanggal_kegiatan ? new Date(request.tanggal_kegiatan).toLocaleDateString('id-ID', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          }) : 'Belum ditentukan'}
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center text-xs text-gray-500 gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                          {request.nomor_surat}
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center text-xs text-gray-500 gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {request.lokasi_kegiatan || '-'}
                        </div>
                      </div>
                      {request.agendaPimpinans?.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span>Pimpinan: </span>
                          <span className="font-medium text-gray-700">
                            {request.agendaPimpinans.map((ap: any) => ap.periodeJabatan?.jabatan?.nama_jabatan || ap.id_jabatan).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDetail(request)}
                        className="rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                      >
                        <Eye className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-semibold">Detail</span>
                      </Button>
                      {statusInfo.status === 'revision' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(request)}
                          className="rounded-xl hover:bg-blue-50 hover:shadow-md transition-all border border-transparent hover:border-blue-100 text-blue-600"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          <span className="font-semibold">Edit & Kirim Ulang</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {statusInfo.catatan && (
                    <div className={`mt-4 text-[12px] p-3 rounded-xl border-l-[3px] shadow-sm flex items-start gap-3 ${config.bg} ${config.color} border-${config.borderColor.replace('border-l-', '')} border border-opacity-30`}>
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70" />
                      <div>
                        <strong className="block mb-0.5 uppercase tracking-wider text-[10px] opacity-70">Catatan Verifikasi</strong>
                        {statusInfo.catatan}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredData.length === 0 && (
              <div className="p-16 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <h4 className="text-gray-900 font-semibold">Tidak ada data</h4>
                <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                  Permohonan yang Anda ajukan akan muncul di sini setelah berhasil dikirimkan.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Detail */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
            <CardHeader className="bg-white border-b sticky top-0 z-10 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detail Permohonan</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Status */}
              {(() => {
                const si = getStatusInfo(selectedRequest);
                const cfg = STATUS_CONFIG[si.status];
                return (
                  <div className={`p-4 rounded-lg flex items-center gap-3 border ${cfg.bg} border-opacity-50`}>
                    <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                    <div>
                      <p className="text-xs text-gray-500">Status Permohonan</p>
                      <Badge variant={cfg.variant as any}>{cfg.label}</Badge>
                    </div>
                  </div>
                );
              })()}

              {/* Info Surat */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Informasi Surat</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-gray-600">Nomor Surat</label><p className="text-sm text-gray-900">{selectedRequest.nomor_surat || '-'}</p></div>
                  <div><label className="text-xs font-medium text-gray-600">Tanggal Surat</label><p className="text-sm text-gray-900">{selectedRequest.tanggal_surat || '-'}</p></div>
                </div>
                <div className="mt-2"><label className="text-xs font-medium text-gray-600">Perihal</label><p className="text-sm text-gray-900">{selectedRequest.perihal || '-'}</p></div>
                {selectedRequest.surat_permohonan && (
                  <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-blue-700 font-medium"><FileText className="w-4 h-4" />Surat Terlampir</div>
                    <Button size="sm" variant="ghost" className="text-xs text-blue-700 hover:bg-blue-100 h-7"
                      onClick={() => { const path = selectedRequest.surat_permohonan.replace(/\\/g, '/'); window.open(`/api/${path}`, '_blank'); }}>
                      <Eye className="w-3.5 h-3.5 mr-1" />Lihat Surat
                    </Button>
                  </div>
                )}
              </div>

              {/* Detail Kegiatan */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Detail Kegiatan</h4>
                <div className="space-y-3">
                  <div><label className="text-xs font-medium text-gray-600">Nama Kegiatan</label><p className="text-sm text-gray-900">{selectedRequest.nama_kegiatan || '-'}</p></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium text-gray-600">Tanggal Kegiatan</label><p className="text-sm text-gray-900">{selectedRequest.tanggal_kegiatan ? new Date(selectedRequest.tanggal_kegiatan).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</p></div>
                    <div><label className="text-xs font-medium text-gray-600">Waktu</label><p className="text-sm text-gray-900">{selectedRequest.waktu_mulai ? `${selectedRequest.waktu_mulai.substring(0, 5)} - ${selectedRequest.waktu_selesai?.substring(0, 5)}` : '-'}</p></div>
                  </div>
                  <div><label className="text-xs font-medium text-gray-600">Lokasi</label><p className="text-sm text-gray-900">{selectedRequest.lokasi_kegiatan || '-'}</p></div>
                  {selectedRequest.keterangan && <div><label className="text-xs font-medium text-gray-600">Keterangan</label><p className="text-sm text-gray-900">{selectedRequest.keterangan}</p></div>}
                </div>
              </div>

              {/* Pimpinan */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Pimpinan yang Diundang</h4>
                {selectedRequest.agendaPimpinans?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRequest.agendaPimpinans.map((ap: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-900 font-medium">{ap.periodeJabatan?.jabatan?.nama_jabatan || ap.id_jabatan}</span>
                        {ap.periodeJabatan?.pimpinan?.nama_pimpinan && <span className="text-xs text-gray-500">({ap.periodeJabatan.pimpinan.nama_pimpinan})</span>}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500 italic">Tidak ada pimpinan yang diundang</p>}
              </div>

              {/* Status History */}
              {selectedRequest.statusAgendas?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Riwayat Status</h4>
                  <div className="space-y-2">
                    {[...selectedRequest.statusAgendas]
                      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((s: any) => {
                        const cfg = STATUS_CONFIG[s.status_agenda as StatusType] || STATUS_CONFIG.pending;
                        return (
                          <div key={s.id_status_agenda} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant={cfg.variant as any}>{cfg.label}</Badge>
                              <span className="text-xs text-gray-500">
                                {s.tanggal_status ? new Date(s.tanggal_status).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                              </span>
                            </div>
                            {s.catatan && <p className="text-sm text-gray-600 mt-1">{s.catatan}</p>}
                            {s.sespri && <p className="text-xs text-gray-400 mt-1">Oleh: {s.sespri.nama}</p>}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">Tutup</Button>
                {getStatusInfo(selectedRequest).status === 'revision' && (
                  <Button onClick={() => { setShowDetailModal(false); handleEdit(selectedRequest); }} className="flex-1">
                    <Edit3 className="w-4 h-4 mr-2" />Edit & Kirim Ulang
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Edit Revisi */}
      {showEditModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
            <CardHeader className="bg-white border-b sticky top-0 z-10 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Edit Permohonan (Revisi)</h3>
                  <p className="text-xs text-gray-500 mt-1">Perbaiki data sesuai catatan dari verifikator, lalu kirim ulang</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Catatan Revisi */}
              {getStatusInfo(selectedRequest).catatan && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-800 mb-1">📝 Catatan dari Verifikator:</p>
                  <p className="text-sm text-amber-900">{getStatusInfo(selectedRequest).catatan}</p>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Surat <span className="text-red-500">*</span></label>
                    <input type="text" value={editForm.nomor_surat} onChange={e => setEditForm({ ...editForm, nomor_surat: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Surat <span className="text-red-500">*</span></label>
                    <input type="date" value={editForm.tanggal_surat} onChange={e => setEditForm({ ...editForm, tanggal_surat: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Perihal <span className="text-red-500">*</span></label>
                  <input type="text" value={editForm.perihal} onChange={e => setEditForm({ ...editForm, perihal: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kegiatan <span className="text-red-500">*</span></label>
                  <input type="text" value={editForm.nama_kegiatan} onChange={e => setEditForm({ ...editForm, nama_kegiatan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kegiatan <span className="text-red-500">*</span></label>
                    <input type="date" value={editForm.tanggal_kegiatan} onChange={e => setEditForm({ ...editForm, tanggal_kegiatan: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Mulai <span className="text-red-500">*</span></label>
                    <input type="time" value={editForm.waktu_mulai} onChange={e => setEditForm({ ...editForm, waktu_mulai: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Selesai <span className="text-red-500">*</span></label>
                    <input type="time" value={editForm.waktu_selesai} onChange={e => setEditForm({ ...editForm, waktu_selesai: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Kegiatan <span className="text-red-500">*</span></label>
                  <input type="text" value={editForm.lokasi_kegiatan} onChange={e => setEditForm({ ...editForm, lokasi_kegiatan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Kegiatan</label>
                  <textarea value={editForm.keterangan} onChange={e => setEditForm({ ...editForm, keterangan: e.target.value })} rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Jelaskan detail kegiatan..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Surat Baru (opsional)</label>
                  <div className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${editFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 cursor-pointer'}`}>
                    {editFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <Check className="w-6 h-6 text-blue-500" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{editFile.name}</p>
                          <p className="text-xs text-gray-500">{(editFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button type="button" onClick={() => setEditFile(null)} className="p-1 hover:bg-white rounded-full text-gray-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-600">Klik untuk upload file baru</p>
                        <p className="text-xs text-gray-400">PDF (max. 5MB)</p>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf"
                          onChange={e => e.target.files?.[0] && setEditFile(e.target.files[0])} />
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900"><strong>Info:</strong> Setelah dikirim ulang, status permohonan akan kembali menjadi <strong>Menunggu Verifikasi</strong>.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="flex-1" disabled={editLoading}>Batal</Button>
                  <Button type="submit" className="flex-1" disabled={editLoading}>
                    {editLoading ? 'Mengirim...' : 'Kirim Ulang Permohonan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
