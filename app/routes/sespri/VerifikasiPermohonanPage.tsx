import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Eye, CheckCircle, XCircle, FileText, Search, Filter, X, RefreshCw, Clock, RotateCcw, AlertTriangle } from 'lucide-react';
import { agendaApi } from '../../lib/api';

type StatusType = 'pending' | 'revision' | 'rejected_sespri' | 'approved_sespri' | 'approved_ajudan' | 'delegated' | 'rejected_ajudan' | 'canceled' | 'completed';

interface Agenda {
  id_agenda: string;
  nomor_surat: string;
  tanggal_surat: string;
  perihal: string;
  surat_permohonan: string | null;
  tanggal_pengajuan: string;
  tanggal_kegiatan: string;
  waktu_mulai: string;
  waktu_selesai: string;
  nama_kegiatan: string;
  lokasi_kegiatan: string;
  contact_person: string;
  keterangan: string;
  pemohon: {
    id_user: string;
    nama: string;
    email: string;
    instansi: string;
    jabatan: string;
    no_hp: string;
  };
  statusAgendas: {
    id_status_agenda: string;
    status_agenda: StatusType;
    tanggal_status: string;
    catatan: string | null;
    sespri?: { id_user: string; nama: string };
    createdAt: string;
  }[];
  agendaPimpinans: {
    id_jabatan: string;
    id_periode: string;
    periodeJabatan?: {
      jabatan?: { nama_jabatan: string };
      pimpinan?: { nama_pimpinan: string };
    };
  }[];
}

const STATUS_CONFIG: Record<StatusType, { label: string; variant: string; icon: any; color: string; bg: string; borderColor: string }> = {
  pending: { label: 'Pending', variant: 'warning', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', borderColor: 'border-l-amber-500' },
  revision: { label: 'Revisi', variant: 'info', icon: RotateCcw, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-l-blue-500' },
  rejected_sespri: { label: 'Ditolak Sespri', variant: 'danger', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', borderColor: 'border-l-red-500' },
  approved_sespri: { label: 'Diverifikasi', variant: 'success', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', borderColor: 'border-l-green-500' },
  approved_ajudan: { label: 'Disetujui Pimpinan', variant: 'success', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-l-emerald-500' },
  delegated: { label: 'Diwakilkan', variant: 'info', icon: RotateCcw, color: 'text-indigo-600', bg: 'bg-indigo-50', borderColor: 'border-l-indigo-500' },
  rejected_ajudan: { label: 'Ditolak Pimpinan', variant: 'danger', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', borderColor: 'border-l-red-500' },
  canceled: { label: 'Dibatalkan', variant: 'secondary', icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-50', borderColor: 'border-l-gray-400' },
  completed: { label: 'Selesai', variant: 'success', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', borderColor: 'border-l-green-500' },
};

function getLatestStatus(agenda: Agenda): StatusType {
  if (!agenda.statusAgendas || agenda.statusAgendas.length === 0) return 'pending';
  const sorted = [...agenda.statusAgendas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return sorted[0].status_agenda;
}

function getLatestStatusRecord(agenda: Agenda) {
  if (!agenda.statusAgendas || agenda.statusAgendas.length === 0) return null;
  const sorted = [...agenda.statusAgendas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return sorted[0];
}

export default function VerifikasiPermohonanPage() {
  const [agendaList, setAgendaList] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerifikasiModal, setShowVerifikasiModal] = useState(false);
  const [selectedPermohonan, setSelectedPermohonan] = useState<Agenda | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [verifikasiData, setVerifikasiData] = useState({
    status: 'approved_sespri' as string,
    catatan: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAgendas = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await agendaApi.getAll();
      if (response.success && response.data) {
        setAgendaList(response.data);
      } else {
        setError(response.message || 'Gagal mengambil data');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  const handleDetail = (agenda: Agenda) => {
    setSelectedPermohonan(agenda);
    setShowDetailModal(true);
  };

  const handleVerifikasi = (agenda: Agenda) => {
    setSelectedPermohonan(agenda);
    setVerifikasiData({ status: 'approved_sespri', catatan: '' });
    setShowVerifikasiModal(true);
  };

  const handleSubmitVerifikasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPermohonan) return;

    setSubmitting(true);
    try {
      const response = await agendaApi.verify(selectedPermohonan.id_agenda, {
        status: verifikasiData.status,
        catatan: verifikasiData.catatan || undefined,
      });

      if (response.success) {
        setShowVerifikasiModal(false);
        fetchAgendas(); // Refresh data
      } else {
        alert(response.message || 'Gagal memverifikasi');
      }
    } catch (err) {
      alert('Gagal terhubung ke server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setVerifikasiData({
      ...verifikasiData,
      [e.target.name]: e.target.value
    });
  };

  const filteredData = agendaList.filter(item => {
    const latestStatus = getLatestStatus(item);
    const matchSearch =
      item.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.pemohon?.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.perihal || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'all' || latestStatus === filterStatus;

    return matchSearch && matchStatus;
  });

  // Count by status
  const statusCounts = agendaList.reduce((acc, item) => {
    const status = getLatestStatus(item);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Verifikasi Permohonan</h1>
          <p className="text-sm text-gray-600 mt-1">Review dan verifikasi surat permohonan masuk</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAgendas} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(Object.keys(STATUS_CONFIG) as StatusType[]).map((status) => {
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          return (
            <Card key={status} className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${config.borderColor} ${filterStatus === status ? 'ring-2 ring-blue-300' : ''}`}
              onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{config.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{statusCounts[status] || 0}</p>
                  </div>
                  <div className={`p-1.5 rounded-lg ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Permohonan</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari permohonan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="revision">Revisi</option>
                  <option value="approved_sespri">Diverifikasi</option>
                  <option value="approved_ajudan">Disetujui Ajudan</option>
                  <option value="delegated">Diwakilkan</option>
                  <option value="rejected_sespri">Ditolak Sespri</option>
                  <option value="rejected_ajudan">Ditolak Ajudan</option>
                  <option value="canceled">Dibatalkan</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <RefreshCw className="w-8 h-8 text-gray-300 mx-auto mb-3 animate-spin" />
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada permohonan ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Nomor Surat</TableHead>
                    <TableHead className="w-[160px]">Pemohon</TableHead>
                    <TableHead className="w-[200px]">Perihal</TableHead>
                    <TableHead className="w-[120px]">Tanggal Kegiatan</TableHead>
                    <TableHead className="w-[100px]">Waktu</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[80px] text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((agenda) => {
                    const latestStatus = getLatestStatus(agenda);
                    const config = STATUS_CONFIG[latestStatus];
                    return (
                      <TableRow key={agenda.id_agenda}>
                        <TableCell className="font-medium truncate max-w-[140px]" title={agenda.nomor_surat}>{agenda.nomor_surat}</TableCell>
                        <TableCell>
                          <div className="max-w-[160px]">
                            <p className="font-medium text-sm truncate" title={agenda.pemohon?.nama}>{agenda.pemohon?.nama || '-'}</p>
                            <p className="text-xs text-gray-500 truncate" title={agenda.pemohon?.instansi}>{agenda.pemohon?.instansi || '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px]">
                          <p className="truncate" title={agenda.perihal}>{agenda.perihal}</p>
                        </TableCell>
                        <TableCell className="text-sm">
                          {agenda.tanggal_kegiatan
                            ? new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-sm">
                          {agenda.waktu_mulai && agenda.waktu_selesai
                            ? `${agenda.waktu_mulai.slice(0, 5)} - ${agenda.waktu_selesai.slice(0, 5)}`
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={config.variant as any}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleDetail(agenda)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {(latestStatus === 'pending' || latestStatus === 'revision') && (
                              <Button variant="ghost" size="sm" onClick={() => handleVerifikasi(agenda)}>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Detail */}
      {showDetailModal && selectedPermohonan && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detail Permohonan</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nomor Surat</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.nomor_surat}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <Badge variant={STATUS_CONFIG[getLatestStatus(selectedPermohonan)].variant as any}>
                        {STATUS_CONFIG[getLatestStatus(selectedPermohonan)].label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Pemohon</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.pemohon?.nama || '-'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Instansi</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.pemohon?.instansi || '-'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Perihal</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.perihal}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Nama Kegiatan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.nama_kegiatan}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal Surat</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedPermohonan.tanggal_surat
                        ? new Date(selectedPermohonan.tanggal_surat).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })
                        : '-'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal Pengajuan</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedPermohonan.tanggal_pengajuan
                        ? new Date(selectedPermohonan.tanggal_pengajuan).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })
                        : '-'
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal Kegiatan</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedPermohonan.tanggal_kegiatan
                        ? new Date(selectedPermohonan.tanggal_kegiatan).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })
                        : '-'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Jam Kegiatan</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedPermohonan.waktu_mulai && selectedPermohonan.waktu_selesai
                        ? `${selectedPermohonan.waktu_mulai.slice(0, 5)} - ${selectedPermohonan.waktu_selesai.slice(0, 5)} WIB`
                        : '-'
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Lokasi Kegiatan</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.lokasi_kegiatan || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact Person</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.contact_person || '-'}</p>
                  </div>
                </div>

                {/* Pimpinan yang diundang */}
                {selectedPermohonan.agendaPimpinans && selectedPermohonan.agendaPimpinans.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pimpinan Diundang</label>
                    <div className="mt-1 space-y-1">
                      {selectedPermohonan.agendaPimpinans.map((ap, i) => (
                        <div key={i} className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {ap.periodeJabatan?.pimpinan?.nama_pimpinan || '-'} — {ap.periodeJabatan?.jabatan?.nama_jabatan || '-'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPermohonan.keterangan && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Keterangan</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.keterangan}</p>
                  </div>
                )}

                {selectedPermohonan.surat_permohonan && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">File Surat</label>
                    <p className="text-sm text-blue-600 mt-1 hover:underline cursor-pointer">
                      {selectedPermohonan.surat_permohonan.split('/').pop()}
                    </p>
                  </div>
                )}

                {/* Status History */}
                {selectedPermohonan.statusAgendas && selectedPermohonan.statusAgendas.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Riwayat Status</label>
                    <div className="space-y-2">
                      {[...selectedPermohonan.statusAgendas]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((s) => (
                          <div key={s.id_status_agenda} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant={STATUS_CONFIG[s.status_agenda]?.variant as any || 'secondary'}>
                                {STATUS_CONFIG[s.status_agenda]?.label || s.status_agenda}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {s.tanggal_status
                                  ? new Date(s.tanggal_status).toLocaleDateString('id-ID', {
                                    day: '2-digit', month: 'short', year: 'numeric'
                                  })
                                  : '-'
                                }
                              </span>
                            </div>
                            {s.catatan && <p className="text-sm text-gray-600 mt-1">{s.catatan}</p>}
                            {s.sespri && <p className="text-xs text-gray-400 mt-1">Oleh: {s.sespri.nama}</p>}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                    Tutup
                  </Button>
                  {(getLatestStatus(selectedPermohonan) === 'pending' || getLatestStatus(selectedPermohonan) === 'revision') && (
                    <Button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleVerifikasi(selectedPermohonan);
                      }}
                      className="flex-1"
                    >
                      Verifikasi
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Verifikasi */}
      {showVerifikasiModal && selectedPermohonan && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Verifikasi Permohonan</h3>
                <button
                  onClick={() => setShowVerifikasiModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitVerifikasi} className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">{selectedPermohonan.nomor_surat}</p>
                  <p className="text-xs text-gray-600 mt-1">{selectedPermohonan.pemohon?.nama || '-'}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedPermohonan.perihal}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Verifikasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={verifikasiData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="approved_sespri">Diverifikasi (Setujui)</option>
                    <option value="revision">Perlu Revisi</option>
                    <option value="rejected_sespri">Ditolak</option>
                    <option value="canceled">Dibatalkan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan
                  </label>
                  <textarea
                    name="catatan"
                    value={verifikasiData.catatan}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Tambahkan catatan atau alasan..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    <strong>Catatan:</strong> Setelah verifikasi, status permohonan akan diperbarui dan pemohon akan diberitahu.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowVerifikasiModal(false)} className="flex-1" disabled={submitting}>
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? 'Memproses...' : 'Submit Verifikasi'}
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