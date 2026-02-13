import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Clock, XCircle, FileText, Eye, X, Search, Filter } from 'lucide-react';

export default function RiwayatPermohonanPage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const myRequests = [
    {
      id: 1,
      nomor_surat: '005/SP/II/2026',
      perihal: 'Permohonan kunjungan kerja Walikota ke Kecamatan',
      pemohon: 'Camat Sukamaju',
      instansi: 'Kecamatan Sukamaju',
      tanggal_surat: '2026-02-01',
      tanggal_kegiatan: '2026-02-15',
      waktu: '09:00 - 12:00',
      tempat: 'Kantor Kecamatan Sukamaju',
      pimpinan_diminta: 'Dr. H. Ahmad Suryadi, M.Si - Walikota',
      jumlah_peserta: '50',
      tujuan: 'Monitoring pembangunan infrastruktur dan dialog dengan masyarakat',
      status: 'Approved',
      catatan_verifikasi: 'Permohonan disetujui, agenda telah terkonfirmasi',
      verified_date: '2026-02-02',
      verified_by: 'Sespri - Ahmad',
    },
    {
      id: 2,
      nomor_surat: '012/SP/II/2026',
      perihal: 'Permohonan audiensi terkait program pendidikan',
      pemohon: 'Kepala Dinas Pendidikan',
      instansi: 'Dinas Pendidikan Kota',
      tanggal_surat: '2026-02-03',
      tanggal_kegiatan: '2026-02-18',
      waktu: '10:00 - 12:00',
      tempat: 'Ruang Kerja Walikota',
      pimpinan_diminta: 'Dr. H. Ahmad Suryadi, M.Si - Walikota',
      jumlah_peserta: '15',
      tujuan: 'Pembahasan program beasiswa dan infrastruktur sekolah',
      status: 'Pending',
      catatan_verifikasi: 'Sedang dalam proses verifikasi kelengkapan dokumen',
    },
    {
      id: 3,
      nomor_surat: '008/SP/II/2026',
      perihal: 'Permohonan dukungan kegiatan bakti sosial',
      pemohon: 'Ketua RT 05',
      instansi: 'RT 05 RW 02 Kelurahan Sejahtera',
      tanggal_surat: '2026-01-28',
      tanggal_kegiatan: '2026-02-10',
      waktu: '08:00 - 12:00',
      tempat: 'Balai RW 02',
      pimpinan_diminta: 'Dr. H. Ahmad Suryadi, M.Si - Walikota',
      jumlah_peserta: '100',
      tujuan: 'Kegiatan bakti sosial dan pembagian sembako',
      status: 'Rejected',
      catatan_verifikasi: 'Permohonan ditolak karena bentrok dengan agenda prioritas lainnya. Silakan mengajukan jadwal alternatif.',
      verified_date: '2026-01-29',
      verified_by: 'Sespri - Ahmad',
    },
    {
      id: 4,
      nomor_surat: '015/SP/II/2026',
      perihal: 'Permohonan peresmian gedung PAUD baru',
      pemohon: 'Lurah Mekar Jaya',
      instansi: 'Kelurahan Mekar Jaya',
      tanggal_surat: '2026-01-20',
      tanggal_kegiatan: '2026-02-05',
      waktu: '09:00 - 11:00',
      tempat: 'PAUD Ceria Mekar Jaya',
      pimpinan_diminta: 'Ir. Hj. Siti Rahmawati, M.T - Wakil Walikota',
      jumlah_peserta: '75',
      tujuan: 'Peresmian gedung PAUD hasil swadaya masyarakat',
      status: 'Completed',
      catatan_verifikasi: 'Kegiatan telah terlaksana dengan baik',
      verified_date: '2026-01-21',
      verified_by: 'Sespri - Ahmad',
      completed_date: '2026-02-05',
    },
  ];

  const handleDetail = (request: any) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const filteredData = myRequests.filter(item => {
    const matchSearch = 
      item.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemohon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instansi.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success">Disetujui</Badge>;
      case 'Pending':
        return <Badge variant="warning">Menunggu Verifikasi</Badge>;
      case 'Rejected':
        return <Badge variant="danger">Ditolak</Badge>;
      case 'Completed':
        return <Badge variant="info">Selesai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Riwayat Permohonan</h1>
        <p className="text-sm text-gray-600 mt-1">Lihat status dan riwayat semua permohonan yang telah Anda ajukan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {myRequests.filter(r => r.status === 'Pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disetujui</p>
                <p className="text-2xl font-semibold text-green-600">
                  {myRequests.filter(r => r.status === 'Approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-2xl font-semibold text-red-600">
                  {myRequests.filter(r => r.status === 'Rejected').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {myRequests.filter(r => r.status === 'Completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Permohonan ({filteredData.length})</h3>
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
                  <option value="Pending">Menunggu Verifikasi</option>
                  <option value="Approved">Disetujui</option>
                  <option value="Rejected">Ditolak</option>
                  <option value="Completed">Selesai</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredData.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{request.nomor_surat}</h4>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-gray-900 mb-1">{request.perihal}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📅 {new Date(request.tanggal_kegiatan).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}</span>
                          <span>•</span>
                          <span>{request.pemohon}</span>
                          <span>•</span>
                          <span>{request.instansi}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDetail(request)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Detail
                  </Button>
                </div>

                {request.catatan_verifikasi && (
                  <div className={`ml-8 mt-2 text-xs p-2 rounded ${
                    request.status === 'Approved' ? 'bg-green-50 text-green-800 border border-green-200' :
                    request.status === 'Rejected' ? 'bg-red-50 text-red-800 border border-red-200' :
                    request.status === 'Completed' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                    'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  }`}>
                    <strong>Catatan:</strong> {request.catatan_verifikasi}
                  </div>
                )}
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada permohonan yang ditemukan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Detail */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status Permohonan</p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedRequest.status)}
                      {selectedRequest.verified_date && (
                        <span className="text-xs text-gray-500">
                          • Diverifikasi: {selectedRequest.verified_date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info Surat */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Informasi Surat</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Nomor Surat</label>
                      <p className="text-sm text-gray-900">{selectedRequest.nomor_surat}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Tanggal Surat</label>
                      <p className="text-sm text-gray-900">{selectedRequest.tanggal_surat}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="text-xs font-medium text-gray-600">Perihal</label>
                    <p className="text-sm text-gray-900">{selectedRequest.perihal}</p>
                  </div>
                </div>

                {/* Info Pemohon */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nama Pemohon</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedRequest.pemohon}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Instansi</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedRequest.instansi}</p>
                  </div>
                </div>

                {/* Detail Kegiatan */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Tujuan Kegiatan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedRequest.tujuan}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal Kegiatan</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedRequest.tanggal_kegiatan).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Waktu</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedRequest.waktu}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tempat</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedRequest.tempat}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Jumlah Peserta</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedRequest.jumlah_peserta} orang</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Pimpinan yang Diminta</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedRequest.pimpinan_diminta}</p>
                </div>

                {/* Catatan Verifikasi */}
                {selectedRequest.catatan_verifikasi && (
                  <div className={`p-4 rounded-lg ${
                    selectedRequest.status === 'Approved' ? 'bg-green-50 border border-green-200' :
                    selectedRequest.status === 'Rejected' ? 'bg-red-50 border border-red-200' :
                    selectedRequest.status === 'Completed' ? 'bg-blue-50 border border-blue-200' :
                    'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Catatan Verifikasi:</p>
                    <p className="text-sm text-gray-900">{selectedRequest.catatan_verifikasi}</p>
                    {selectedRequest.verified_by && (
                      <p className="text-xs text-gray-600 mt-2">Oleh: {selectedRequest.verified_by}</p>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                    Tutup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
