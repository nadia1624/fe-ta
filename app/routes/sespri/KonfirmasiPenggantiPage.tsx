import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { UserCheck, Eye, CheckCircle, XCircle, X, Search, Filter, Edit2, FileText, Download } from 'lucide-react';

export default function KonfirmasiPenggantiPage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showKonfirmasiModal, setShowKonfirmasiModal] = useState(false);
  const [showEditPerwakilan, setShowEditPerwakilan] = useState(false);
  const [showDisposisiModal, setShowDisposisiModal] = useState(false);
  const [selectedPermintaan, setSelectedPermintaan] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [konfirmasiData, setKonfirmasiData] = useState({
    status_konfirmasi: 'Terkonfirmasi',
    perwakilan_baru: '',
    jabatan_baru: '',
    alasan_perubahan: '',
    catatan: ''
  });

  // Data pimpinan options untuk edit perwakilan
  const pimpinanOptions = [
    { nama: 'Ir. Hj. Siti Rahmawati, M.T', jabatan: 'Wakil Walikota' },
    { nama: 'Dr. Budi Santoso, M.M', jabatan: 'Sekretaris Daerah' },
    { nama: 'Drs. Andi Wijaya, M.Si', jabatan: 'Asisten Pemerintahan' },
    { nama: 'Ir. Siti Nurhaliza, M.T', jabatan: 'Kepala Bappeda' },
    { nama: 'H. Bambang Hermawan, S.H', jabatan: 'Kepala Dinas Perhubungan' },
  ];

  const permintaanList = [
    {
      id: 1,
      nomor_surat: '012/SP/II/2026',
      nomor_disposisi: 'DIS/1/SESPRI/2/2026',
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      tanggal: '2026-02-10',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama Kantor Walikota',
      pemohon: 'Sekretaris Daerah',
      instansi: 'Sekretariat Daerah',
      alasan_perwakilan: 'Pimpinan ada agenda mendadak di luar kota',
      perwakilan_nama: 'Ir. Hj. Siti Rahmawati, M.T',
      perwakilan_jabatan: 'Wakil Walikota',
      status: 'Menunggu Konfirmasi Perwakilan',
      tanggal_disposisi: '2026-02-07',
      requested_by: 'Ajudan Walikota'
    },
    {
      id: 2,
      nomor_surat: '025/SP/II/2026',
      nomor_disposisi: 'DIS/2/SESPRI/2/2026',
      pimpinan_nama: 'Ir. Hj. Siti Rahmawati, M.T',
      pimpinan_jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Dialog Interaktif dengan Mahasiswa',
      tanggal: '2026-02-14',
      waktu: '13:00 - 15:00',
      tempat: 'Auditorium Universitas Negeri',
      pemohon: 'BEM Universitas Negeri',
      instansi: 'Universitas Negeri',
      alasan_perwakilan: 'Wakil Walikota sedang cuti',
      perwakilan_nama: 'Dr. Budi Santoso, M.M',
      perwakilan_jabatan: 'Sekretaris Daerah',
      status: 'Menunggu Konfirmasi Perwakilan',
      tanggal_disposisi: '2026-02-09',
      requested_by: 'Ajudan Wakil Walikota'
    },
    {
      id: 3,
      nomor_surat: '013/SP/II/2026',
      nomor_disposisi: 'DIS/3/SESPRI/2/2026',
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      tanggal: '2026-02-06',
      waktu: '10:00 - 11:30',
      tempat: 'Kantor Dinas Kesehatan',
      pemohon: 'Kepala Dinas Kesehatan',
      instansi: 'Dinas Kesehatan Kota',
      alasan_perwakilan: 'Bentrok dengan rapat penting lainnya',
      perwakilan_nama: 'Ir. Hj. Siti Rahmawati, M.T',
      perwakilan_jabatan: 'Wakil Walikota',
      status: 'Terkonfirmasi (Perwakilan)',
      tanggal_disposisi: '2026-02-03',
      tanggal_konfirmasi: '2026-02-04',
      konfirmasi_oleh: 'Sespri - Ahmad',
      requested_by: 'Ajudan Walikota',
      catatan_konfirmasi: 'Wakil Walikota bersedia hadir dan mewakili'
    },
    {
      id: 4,
      nomor_surat: '020/SP/II/2026',
      nomor_disposisi: 'DIS/4/SESPRI/2/2026',
      pimpinan_nama: 'Ir. Hj. Siti Rahmawati, M.T',
      pimpinan_jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Peresmian Gedung Baru RSUD',
      tanggal: '2026-02-02',
      waktu: '16:00 - 17:30',
      tempat: 'RSUD Kota',
      pemohon: 'Direktur RSUD',
      instansi: 'RSUD Kota',
      alasan_perwakilan: 'Sedang dinas luar kota',
      perwakilan_nama: 'Dr. Budi Santoso, M.M',
      perwakilan_jabatan: 'Sekretaris Daerah',
      status: 'Tidak Bersedia',
      tanggal_disposisi: '2026-01-30',
      tanggal_konfirmasi: '2026-02-01',
      konfirmasi_oleh: 'Sespri - Ahmad',
      requested_by: 'Ajudan Wakil Walikota',
      catatan_konfirmasi: 'Sekda sudah ada agenda lain. Perlu penunjukan perwakilan baru.',
      perwakilan_pengganti: 'Drs. Andi Wijaya, M.Si',
      jabatan_pengganti: 'Asisten Pemerintahan',
      status_final: 'Menunggu Konfirmasi Perwakilan'
    },
    {
      id: 5,
      nomor_surat: '018/SP/II/2026',
      nomor_disposisi: 'DIS/5/SESPRI/2/2026',
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Launching Smart City Program',
      tanggal: '2026-02-01',
      waktu: '08:00 - 10:00',
      tempat: 'Gedung ICT Center',
      pemohon: 'Kepala Dinas Kominfo',
      instansi: 'Dinas Komunikasi dan Informatika',
      alasan_perwakilan: 'Sakit',
      perwakilan_nama: 'Dr. Budi Santoso, M.M',
      perwakilan_jabatan: 'Sekretaris Daerah',
      status: 'Dibatalkan',
      tanggal_disposisi: '2026-01-28',
      tanggal_konfirmasi: '2026-01-29',
      konfirmasi_oleh: 'Sespri - Ahmad',
      requested_by: 'Ajudan Walikota',
      catatan_konfirmasi: 'Agenda dibatalkan atas persetujuan pimpinan. Akan dijadwalkan ulang setelah Walikota pulih.'
    },
  ];

  const handleDetail = (permintaan: any) => {
    setSelectedPermintaan(permintaan);
    setShowDetailModal(true);
  };

  const handleKonfirmasi = (permintaan: any) => {
    setSelectedPermintaan(permintaan);
    setKonfirmasiData({
      status_konfirmasi: 'Terkonfirmasi',
      perwakilan_baru: '',
      jabatan_baru: '',
      alasan_perubahan: '',
      catatan: ''
    });
    setShowDetailModal(false);
    setShowKonfirmasiModal(true);
  };

  const handleEditPerwakilan = (permintaan: any) => {
    setSelectedPermintaan(permintaan);
    setKonfirmasiData({
      status_konfirmasi: 'Edit',
      perwakilan_baru: '',
      jabatan_baru: '',
      alasan_perubahan: '',
      catatan: ''
    });
    setShowDetailModal(false);
    setShowEditPerwakilan(true);
  };

  const handleLihatDisposisi = (permintaan: any) => {
    setSelectedPermintaan(permintaan);
    setShowDisposisiModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setKonfirmasiData({
      ...konfirmasiData,
      [name]: value
    });

    // Auto-fill jabatan when perwakilan selected
    if (name === 'perwakilan_baru') {
      const selected = pimpinanOptions.find(p => p.nama === value);
      if (selected) {
        setKonfirmasiData(prev => ({
          ...prev,
          perwakilan_baru: value,
          jabatan_baru: selected.jabatan
        }));
      }
    }
  };

  const handleSubmitKonfirmasi = (e: React.FormEvent) => {
    e.preventDefault();

    if (konfirmasiData.status_konfirmasi === 'Terkonfirmasi') {
      alert(`✓ Konfirmasi Kehadiran Perwakilan\n\nAgenda: ${selectedPermintaan?.judul_kegiatan}\nPerwakilan: ${selectedPermintaan?.perwakilan_nama}\n\nStatus diupdate menjadi: Terkonfirmasi (Perwakilan)`);
    } else if (konfirmasiData.status_konfirmasi === 'Tidak Bersedia') {
      alert(`✗ Perwakilan Tidak Bersedia\n\nAgenda: ${selectedPermintaan?.judul_kegiatan}\nPerwakilan: ${selectedPermintaan?.perwakilan_nama}\n\nAnda dapat:\n1. Edit dan pilih perwakilan baru\n2. Batalkan agenda`);
    } else if (konfirmasiData.status_konfirmasi === 'Dibatalkan') {
      alert(`✗ Agenda Dibatalkan\n\nAgenda: ${selectedPermintaan?.judul_kegiatan}\n\nAgenda dibatalkan atas persetujuan pimpinan (offline).`);
    }

    setShowKonfirmasiModal(false);
  };

  const handleSubmitEditPerwakilan = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`✓ Perwakilan Berhasil Diubah\n\nAgenda: ${selectedPermintaan?.judul_kegiatan}\n\nPerwakilan Lama: ${selectedPermintaan?.perwakilan_nama}\nPerwakilan Baru: ${konfirmasiData.perwakilan_baru}\n\nSurat disposisi baru akan digenerate.`);
    setShowEditPerwakilan(false);
  };

  const filteredData = permintaanList.filter(item => {
    const matchSearch =
      item.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pimpinan_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perwakilan_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemohon.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Menunggu Konfirmasi Perwakilan':
        return <Badge variant="warning">{status}</Badge>;
      case 'Terkonfirmasi (Perwakilan)':
        return <Badge variant="success">{status}</Badge>;
      case 'Tidak Bersedia':
        return <Badge variant="destructive">{status}</Badge>;
      case 'Dibatalkan':
        return <Badge variant="default">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Konfirmasi Pengganti Perwakilan</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola dan konfirmasi kehadiran perwakilan pimpinan yang ditunjuk oleh Ajudan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu Konfirmasi</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {permintaanList.filter(p => p.status === 'Menunggu Konfirmasi Perwakilan').length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terkonfirmasi</p>
                <p className="text-2xl font-semibold text-green-600">
                  {permintaanList.filter(p => p.status === 'Terkonfirmasi (Perwakilan)').length}
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
                <p className="text-sm text-gray-600">Tidak Bersedia</p>
                <p className="text-2xl font-semibold text-red-600">
                  {permintaanList.filter(p => p.status === 'Tidak Bersedia').length}
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
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-blue-600">{permintaanList.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Agenda Diwakilkan</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari agenda..."
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
                  <option value="Menunggu Konfirmasi Perwakilan">Menunggu Konfirmasi</option>
                  <option value="Terkonfirmasi (Perwakilan)">Terkonfirmasi</option>
                  <option value="Tidak Bersedia">Tidak Bersedia</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pimpinan Asli</TableHead>
                <TableHead>Kegiatan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Perwakilan Ditunjuk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((permintaan) => (
                <TableRow key={permintaan.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{permintaan.pimpinan_nama}</p>
                      <p className="text-xs text-gray-500">{permintaan.pimpinan_jabatan}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{permintaan.judul_kegiatan}</p>
                      <p className="text-xs text-gray-500">📍 {permintaan.tempat}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>
                      <p className="font-medium">{new Date(permintaan.tanggal).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
                      <p className="text-xs text-gray-500">{permintaan.waktu}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{permintaan.perwakilan_nama}</p>
                      <p className="text-xs text-gray-500">{permintaan.perwakilan_jabatan}</p>
                      {permintaan.perwakilan_pengganti && (
                        <p className="text-xs text-blue-600 mt-1">
                          → Diganti: {permintaan.perwakilan_pengganti}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(permintaan.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDetail(permintaan)} title="Lihat Detail">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleLihatDisposisi(permintaan)} title="Lihat Surat Disposisi">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </Button>
                      {permintaan.status === 'Menunggu Konfirmasi Perwakilan' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleKonfirmasi(permintaan)} title="Konfirmasi">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditPerwakilan(permintaan)} title="Edit Perwakilan">
                            <Edit2 className="w-4 h-4 text-orange-600" />
                          </Button>
                        </>
                      )}
                      {permintaan.status === 'Tidak Bersedia' && (
                        <Button variant="ghost" size="sm" onClick={() => handleEditPerwakilan(permintaan)} title="Pilih Perwakilan Baru">
                          <Edit2 className="w-4 h-4 text-orange-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Detail */}
      {showDetailModal && selectedPermintaan && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detail Agenda Perwakilan</h3>
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
                {/* Info Surat & Disposisi */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Surat Permohonan</h4>
                    <p className="text-sm font-medium text-gray-900">{selectedPermintaan.nomor_surat}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Surat Disposisi</h4>
                    <p className="text-sm font-medium text-gray-900">{selectedPermintaan.nomor_disposisi}</p>
                  </div>
                </div>

                {/* Pimpinan Asli */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Pimpinan yang Diminta Hadir</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900"><span className="font-medium">Nama:</span> {selectedPermintaan.pimpinan_nama}</p>
                    <p className="text-sm text-gray-900"><span className="font-medium">Jabatan:</span> {selectedPermintaan.pimpinan_jabatan}</p>
                  </div>
                </div>

                {/* Perwakilan */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Perwakilan yang Ditunjuk</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-900"><span className="font-medium">Nama:</span> {selectedPermintaan.perwakilan_nama}</p>
                      <p className="text-sm text-gray-900"><span className="font-medium">Jabatan:</span> {selectedPermintaan.perwakilan_jabatan}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Alasan Perwakilan:</p>
                      <p className="text-sm text-gray-900 italic">{selectedPermintaan.alasan_perwakilan}</p>
                    </div>
                  </div>
                </div>

                {/* Detail Kegiatan */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Judul Kegiatan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedPermintaan.judul_kegiatan}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedPermintaan.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Waktu</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPermintaan.waktu}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tempat</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedPermintaan.tempat}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pemohon</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPermintaan.pemohon}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Instansi</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPermintaan.instansi}</p>
                  </div>
                </div>

                {/* Status & Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Status & Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span>{getStatusBadge(selectedPermintaan.status)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tanggal Disposisi:</span>
                      <span className="text-gray-900">{selectedPermintaan.tanggal_disposisi}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Oleh:</span>
                      <span className="text-gray-900">{selectedPermintaan.requested_by}</span>
                    </div>
                    {selectedPermintaan.tanggal_konfirmasi && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tanggal Konfirmasi:</span>
                          <span className="text-gray-900">{selectedPermintaan.tanggal_konfirmasi}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Dikonfirmasi oleh:</span>
                          <span className="text-gray-900">{selectedPermintaan.konfirmasi_oleh}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {selectedPermintaan.catatan_konfirmasi && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Catatan Konfirmasi:</p>
                    <p className="text-sm text-gray-900">{selectedPermintaan.catatan_konfirmasi}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                    Tutup
                  </Button>
                  <Button onClick={() => handleLihatDisposisi(selectedPermintaan)} variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Lihat Disposisi
                  </Button>
                  {selectedPermintaan.status === 'Menunggu Konfirmasi Perwakilan' && (
                    <Button onClick={() => handleKonfirmasi(selectedPermintaan)} className="flex-1">
                      Konfirmasi
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Konfirmasi */}
      {showKonfirmasiModal && selectedPermintaan && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Kehadiran Perwakilan</h3>
                <button
                  onClick={() => setShowKonfirmasiModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitKonfirmasi} className="space-y-4">
                {/* Info Agenda */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">{selectedPermintaan.judul_kegiatan}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(selectedPermintaan.tanggal).toLocaleDateString('id-ID')} · {selectedPermintaan.waktu}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <p className="text-xs text-gray-600">Perwakilan:</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedPermintaan.perwakilan_nama}</p>
                    <p className="text-xs text-gray-600">{selectedPermintaan.perwakilan_jabatan}</p>
                  </div>
                </div>

                {/* Hasil Konfirmasi Manual */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-900 mb-2">
                    ℹ️ Konfirmasi Manual
                  </p>
                  <p className="text-xs text-blue-800">
                    Sespri telah mengkonfirmasi secara manual (via telepon/WhatsApp/tatap muka) kepada perwakilan yang ditunjuk. Pilih hasil konfirmasi di bawah.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hasil Konfirmasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status_konfirmasi"
                    value={konfirmasiData.status_konfirmasi}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="Terkonfirmasi">✓ Perwakilan Bersedia Hadir</option>
                    <option value="Tidak Bersedia">✗ Perwakilan Tidak Bersedia</option>
                    <option value="Dibatalkan">⊗ Batalkan Agenda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan
                  </label>
                  <textarea
                    name="catatan"
                    value={konfirmasiData.catatan}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Catatan hasil konfirmasi..."
                  />
                </div>

                {/* Info Note */}
                <div className={`${konfirmasiData.status_konfirmasi === 'Terkonfirmasi' ? 'bg-green-50 border-green-200' :
                    konfirmasiData.status_konfirmasi === 'Tidak Bersedia' ? 'bg-red-50 border-red-200' :
                      'bg-gray-50 border-gray-300'
                  } border rounded-lg p-3`}>
                  <p className={`text-sm ${konfirmasiData.status_konfirmasi === 'Terkonfirmasi' ? 'text-green-900' :
                      konfirmasiData.status_konfirmasi === 'Tidak Bersedia' ? 'text-red-900' :
                        'text-gray-900'
                    }`}>
                    {konfirmasiData.status_konfirmasi === 'Terkonfirmasi' ? (
                      <>
                        <strong>✓ Perwakilan Bersedia</strong><br />
                        Status agenda akan diupdate menjadi "Terkonfirmasi (Perwakilan)"
                      </>
                    ) : konfirmasiData.status_konfirmasi === 'Tidak Bersedia' ? (
                      <>
                        <strong>✗ Perwakilan Tidak Bersedia</strong><br />
                        Anda dapat mengedit dan memilih perwakilan baru atau membatalkan agenda
                      </>
                    ) : (
                      <>
                        <strong>⊗ Agenda Dibatalkan</strong><br />
                        Agenda akan dibatalkan atas persetujuan pimpinan (tidak dicatat dalam sistem)
                      </>
                    )}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowKonfirmasiModal(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    Simpan Hasil
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Edit Perwakilan */}
      {showEditPerwakilan && selectedPermintaan && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Perwakilan</h3>
                <button
                  onClick={() => setShowEditPerwakilan(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitEditPerwakilan} className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">{selectedPermintaan.judul_kegiatan}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(selectedPermintaan.tanggal).toLocaleDateString('id-ID')} · {selectedPermintaan.waktu}
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-orange-900 mb-1">Perwakilan Sebelumnya:</p>
                  <p className="text-sm font-semibold text-orange-900">{selectedPermintaan.perwakilan_nama}</p>
                  <p className="text-xs text-orange-700">{selectedPermintaan.perwakilan_jabatan}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perwakilan Baru <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="perwakilan_baru"
                    value={konfirmasiData.perwakilan_baru}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">-- Pilih Perwakilan Baru --</option>
                    {pimpinanOptions.map((p, idx) => (
                      <option key={idx} value={p.nama}>{p.nama} ({p.jabatan})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    name="jabatan_baru"
                    value={konfirmasiData.jabatan_baru}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                    placeholder="Jabatan akan terisi otomatis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Perubahan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="alasan_perubahan"
                    value={konfirmasiData.alasan_perubahan}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Contoh: Perwakilan sebelumnya sudah ada agenda lain"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Tambahan
                  </label>
                  <textarea
                    name="catatan"
                    value={konfirmasiData.catatan}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Catatan tambahan (opsional)"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    <strong>📄 Surat disposisi baru akan digenerate</strong><br />
                    Sistem akan membuat surat disposisi baru kepada perwakilan yang baru ditunjuk
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowEditPerwakilan(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    Simpan & Generate Surat
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Lihat Disposisi */}
      {showDisposisiModal && selectedPermintaan && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Surat Disposisi</h3>
                </div>
                <button
                  onClick={() => setShowDisposisiModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Disposisi Content - Sama seperti yang di Ajudan */}
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 space-y-6">
                <div className="text-center border-b-2 border-gray-900 pb-4">
                  <h2 className="text-xl font-bold text-gray-900">PEMERINTAH KOTA</h2>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">BAGIAN PROTOKOL DAN KOMUNIKASI PIMPINAN</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Jl. Pemerintahan No. 1, Kota · Telp: (021) 12345678
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Nomor</span>
                    <span>: {selectedPermintaan.nomor_disposisi}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Tanggal</span>
                    <span>: {selectedPermintaan.tanggal_disposisi}</span>
                  </div>
                </div>

                <div className="text-center py-2">
                  <h4 className="text-lg font-bold text-gray-900 underline">SURAT DISPOSISI</h4>
                  <p className="text-sm text-gray-600 mt-1">Penugasan Perwakilan Kehadiran Pimpinan</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                    <span className="font-medium">Dari</span>
                    <span>:</span>
                    <span>{selectedPermintaan.pimpinan_nama} ({selectedPermintaan.pimpinan_jabatan})</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                    <span className="font-medium">Kepada</span>
                    <span>:</span>
                    <span className="font-semibold">{selectedPermintaan.perwakilan_nama} ({selectedPermintaan.perwakilan_jabatan})</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                    <span className="font-medium">Perihal</span>
                    <span>:</span>
                    <span>Disposisi Perwakilan Kehadiran - {selectedPermintaan.judul_kegiatan}</span>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Detail Kegiatan:</h5>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                      <span className="font-medium">Judul Kegiatan</span>
                      <span>:</span>
                      <span>{selectedPermintaan.judul_kegiatan}</span>
                    </div>
                    <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                      <span className="font-medium">Tanggal</span>
                      <span>:</span>
                      <span>{new Date(selectedPermintaan.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                      <span className="font-medium">Waktu</span>
                      <span>:</span>
                      <span>{selectedPermintaan.waktu} WIB</span>
                    </div>
                    <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                      <span className="font-medium">Tempat</span>
                      <span>:</span>
                      <span>{selectedPermintaan.tempat}</span>
                    </div>
                    <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                      <span className="font-medium">Pemohon</span>
                      <span>:</span>
                      <span>{selectedPermintaan.pemohon} ({selectedPermintaan.instansi})</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Instruksi:</h5>
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                    <p className="text-sm text-gray-900">
                      Dengan ini menunjuk dan menugaskan Saudara/i untuk <strong>mewakili kehadiran</strong> {selectedPermintaan.pimpinan_nama}
                      pada kegiatan tersebut di atas.
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Alasan Perwakilan:</h5>
                  <p className="text-sm text-gray-700 italic">{selectedPermintaan.alasan_perwakilan}</p>
                </div>

                <div className="flex justify-end mt-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-900">Ajudan Pimpinan,</p>
                    <div className="h-16 flex items-center justify-center">
                      <p className="text-sm text-gray-500 italic">[Tanda Tangan Digital]</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">_____________________</p>
                    <p className="text-xs text-gray-600 mt-1">NIP. _____________________</p>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <p className="text-xs font-semibold text-gray-900 mb-1">Tembusan:</p>
                  <ol className="text-xs text-gray-700 list-decimal list-inside space-y-0.5">
                    <li>Sekretaris Pribadi Pimpinan</li>
                    <li>Arsip</li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => alert('Surat disposisi berhasil didownload!')}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDisposisiModal(false)}
                  className="flex-1"
                >
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
