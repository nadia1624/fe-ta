import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { CheckCircle, Clock, XCircle, FileText, Eye, X, Search, Filter, Loader2, RefreshCw, Calendar, MapPin, Users } from 'lucide-react';
import { agendaApi } from '../../lib/api';

export default function RiwayatPermohonanPage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const getStatusInfo = (request: any) => {
    const latestStatus = request.statusAgendas && request.statusAgendas[0];
    return {
      status: latestStatus ? latestStatus.status_agenda : 'pending',
      catatan: latestStatus ? latestStatus.catatan : '-',
      tanggal: latestStatus ? latestStatus.tanggal_status : '-',
    };
  };

  const filteredData = myRequests.filter(item => {
    const { status } = getStatusInfo(item);

    const matchSearch =
      (item.nomor_surat?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.perihal?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.nama_kegiatan?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

    const matchStatus = filterStatus === 'all' || status === filterStatus;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Disetujui</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Menunggu Verifikasi</Badge>;
      case 'ditolak':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Ditolak</Badge>;
      case 'completed': // If we ever add this
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Selesai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

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
        <Button
          variant="outline"
          onClick={fetchData}
          disabled={loading}
          className="w-full md:w-auto"
        >
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Menunggu</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {myRequests.filter(r => getStatusInfo(r).status === 'pending').length}
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Disetujui</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {myRequests.filter(r => getStatusInfo(r).status === 'disetujui').length}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ditolak</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {myRequests.filter(r => getStatusInfo(r).status === 'ditolak').length}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
                  <option value="pending">Menunggu Verifikasi</option>
                  <option value="disetujui">Disetujui</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filteredData.map((request) => {
              const statusInfo = getStatusInfo(request);
              return (
                <div key={request.id_agenda} className="p-6 hover:bg-gray-50/80 transition-all group">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-lg truncate">{request.perihal}</h4>
                        {getStatusBadge(statusInfo.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.nama_kegiatan}</p>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                        <div className="flex items-center text-xs text-gray-500 gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {request.tanggal_kegiatan ? new Date(request.tanggal_kegiatan).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
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
                        <span className="font-semibold">Buka Detail</span>
                      </Button>
                    </div>
                  </div>

                  {(statusInfo.catatan && statusInfo.catatan !== '-') && (
                    <div className={`mt-4 text-[12px] p-3 rounded-xl border-l-[3px] shadow-sm flex items-start gap-3 ${statusInfo.status === 'disetujui' ? 'bg-green-50/50 text-green-800 border-green-200 border-l-green-500' :
                      statusInfo.status === 'ditolak' ? 'bg-red-50/50 text-red-800 border-red-200 border-l-red-500' :
                        'bg-yellow-50/50 text-yellow-800 border-yellow-200 border-l-yellow-500'
                      }`}>
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
                <Button variant="outline" className="mt-6 rounded-xl px-6" onClick={() => window.location.href = '/pemohon/submit'}>
                  Buat Permohonan Baru
                </Button>
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Detail Permohonan</h3>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Status Section */}
              <div className={`p-4 rounded-lg flex items-center gap-3 border ${getStatusInfo(selectedRequest).status === 'disetujui' ? 'bg-green-50 border-green-200' :
                getStatusInfo(selectedRequest).status === 'ditolak' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                {getStatusInfo(selectedRequest).status === 'disetujui' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                  getStatusInfo(selectedRequest).status === 'ditolak' ? <XCircle className="w-5 h-5 text-red-600" /> :
                    <Clock className="w-5 h-5 text-yellow-600" />}
                <div>
                  <p className="text-xs text-gray-500">Status Permohonan</p>
                  {getStatusBadge(getStatusInfo(selectedRequest).status)}
                </div>
              </div>

              {/* Info Grid */}
              <div className="space-y-5">
                {/* Info Surat */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Informasi Surat</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Nomor Surat</label>
                      <p className="text-sm text-gray-900">{selectedRequest.nomor_surat || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Tanggal Surat</label>
                      <p className="text-sm text-gray-900">{selectedRequest.tanggal_surat || '-'}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="text-xs font-medium text-gray-600">Perihal</label>
                    <p className="text-sm text-gray-900">{selectedRequest.perihal || '-'}</p>
                  </div>

                  {selectedRequest.surat_permohonan && (
                    <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-blue-700 font-medium">
                        <FileText className="w-4 h-4" />
                        Surat Terlampir
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-blue-700 hover:bg-blue-100 h-7"
                        onClick={() => {
                          const path = selectedRequest.surat_permohonan.replace(/\\/g, '/');
                          window.open(`/api/${path}`, '_blank');
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Lihat Surat
                      </Button>
                    </div>
                  )}
                </div>

                {/* Detail Kegiatan */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Detail Kegiatan</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Nama Kegiatan</label>
                      <p className="text-sm text-gray-900">{selectedRequest.nama_kegiatan || '-'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Tanggal Kegiatan</label>
                        <p className="text-sm text-gray-900">
                          {selectedRequest.tanggal_kegiatan ? new Date(selectedRequest.tanggal_kegiatan).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          }) : '-'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Waktu</label>
                        <p className="text-sm text-gray-900">{selectedRequest.waktu_mulai ? `${selectedRequest.waktu_mulai.substring(0, 5)} - ${selectedRequest.waktu_selesai?.substring(0, 5)}` : '-'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Lokasi</label>
                      <p className="text-sm text-gray-900">{selectedRequest.lokasi_kegiatan || '-'}</p>
                    </div>
                    {selectedRequest.keterangan && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Keterangan</label>
                        <p className="text-sm text-gray-900">{selectedRequest.keterangan}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pimpinan yang Diundang */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Pimpinan yang Diundang</h4>
                  {selectedRequest.agendaPimpinans?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRequest.agendaPimpinans.map((ap: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-900 font-medium">
                            {ap.periodeJabatan?.jabatan?.nama_jabatan || ap.id_jabatan}
                          </span>
                          {ap.periodeJabatan?.pimpinan?.nama_pimpinan && (
                            <span className="text-xs text-gray-500">({ap.periodeJabatan.pimpinan.nama_pimpinan})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Tidak ada pimpinan yang diundang</p>
                  )}
                </div>

                {/* Catatan Verifikasi */}
                {getStatusInfo(selectedRequest).catatan !== '-' && (
                  <div className={`p-4 rounded-lg ${getStatusInfo(selectedRequest).status === 'disetujui' ? 'bg-green-50 border border-green-200' :
                    getStatusInfo(selectedRequest).status === 'ditolak' ? 'bg-red-50 border border-red-200' :
                      'bg-yellow-50 border border-yellow-200'
                    }`}>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Catatan Verifikasi:</p>
                    <p className="text-sm text-gray-900">{getStatusInfo(selectedRequest).catatan}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                  Tutup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

