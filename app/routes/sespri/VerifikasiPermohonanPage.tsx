import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Eye, CheckCircle, XCircle, FileText, Search, Filter, X } from 'lucide-react';

export default function VerifikasiPermohonanPage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerifikasiModal, setShowVerifikasiModal] = useState(false);
  const [selectedPermohonan, setSelectedPermohonan] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [verifikasiData, setVerifikasiData] = useState({
    status: 'Disetujui',
    catatan: ''
  });

  const permohonanList = [
    {
      id: 1,
      nomor_surat: '012/SP/II/2025',
      tanggal_surat: '2025-02-01',
      pemohon: 'Kepala Dinas Kesehatan',
      instansi: 'Dinas Kesehatan Kota',
      perihal: 'Permohonan audiensi terkait program vaksinasi',
      file_surat: 'surat_dinkeskota_012.pdf',
      tanggal_pengajuan: '2025-02-01',
      nama_kegiatan: 'Audiensi Program Vaksinasi',
      tanggal_kegiatan: '2025-02-10',
      lokasi_kegiatan: 'Kantor Walikota',
      jam_mulai: '10:00',
      jam_selesai: '11:30',
      jumlah_peserta: 5,
      status: 'Pending'
    },
    {
      id: 2,
      nomor_surat: '013/SP/II/2025',
      tanggal_surat: '2025-02-02',
      pemohon: 'Camat Sukamaju',
      instansi: 'Kecamatan Sukamaju',
      perihal: 'Permohonan kunjungan kerja monitoring infrastruktur',
      file_surat: 'surat_camat_013.pdf',
      tanggal_pengajuan: '2025-02-02',
      nama_kegiatan: 'Kunjungan Kerja Monitoring Infrastruktur',
      tanggal_kegiatan: '2025-02-12',
      lokasi_kegiatan: 'Kecamatan Sukamaju',
      jam_mulai: '09:00',
      jam_selesai: '11:00',
      jumlah_peserta: 8,
      status: 'Pending'
    },
    {
      id: 3,
      nomor_surat: '014/SP/II/2025',
      tanggal_surat: '2025-02-03',
      pemohon: 'Ketua DPRD',
      instansi: 'DPRD Kota',
      perihal: 'Rapat koordinasi program kerja 2025',
      file_surat: 'surat_dprd_014.pdf',
      tanggal_pengajuan: '2025-02-03',
      nama_kegiatan: 'Rapat Koordinasi Program Kerja 2025',
      tanggal_kegiatan: '2025-02-15',
      lokasi_kegiatan: 'Ruang Rapat DPRD',
      jam_mulai: '13:00',
      jam_selesai: '15:00',
      jumlah_peserta: 15,
      status: 'Disetujui'
    },
    {
      id: 4,
      nomor_surat: '015/SP/II/2025',
      tanggal_surat: '2025-02-01',
      pemohon: 'Kepala Dinas Pendidikan',
      instansi: 'Dinas Pendidikan Kota',
      perihal: 'Permohonan pembukaan event Festival Seni Pelajar',
      file_surat: 'surat_disdik_015.pdf',
      tanggal_pengajuan: '2025-02-01',
      nama_kegiatan: 'Pembukaan Festival Seni Pelajar',
      tanggal_kegiatan: '2025-02-20',
      lokasi_kegiatan: 'Lapangan Utama Kota',
      jam_mulai: '08:00',
      jam_selesai: '10:00',
      jumlah_peserta: 200,
      status: 'Ditolak'
    },
  ];

  const handleDetail = (permohonan: any) => {
    setSelectedPermohonan(permohonan);
    setShowDetailModal(true);
  };

  const handleVerifikasi = (permohonan: any) => {
    setSelectedPermohonan(permohonan);
    setVerifikasiData({
      status: 'Disetujui',
      catatan: ''
    });
    setShowVerifikasiModal(true);
  };

  const handleSubmitVerifikasi = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Permohonan ${selectedPermohonan?.nomor_surat} ${verifikasiData.status}!`);
    setShowVerifikasiModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setVerifikasiData({
      ...verifikasiData,
      [e.target.name]: e.target.value
    });
  };

  const filteredData = permohonanList.filter(item => {
    const matchSearch = 
      item.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemohon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Verifikasi Permohonan</h1>
        <p className="text-sm text-gray-600 mt-1">Review dan verifikasi surat permohonan masuk</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {permohonanList.filter(p => p.status === 'Pending').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disetujui</p>
                <p className="text-2xl font-semibold text-green-600">
                  {permohonanList.filter(p => p.status === 'Disetujui').length}
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
                  {permohonanList.filter(p => p.status === 'Ditolak').length}
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
                <p className="text-2xl font-semibold text-blue-600">{permohonanList.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                  <option value="Pending">Pending</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Surat</TableHead>
                <TableHead>Pemohon</TableHead>
                <TableHead>Perihal</TableHead>
                <TableHead>Tanggal Kegiatan</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((permohonan) => (
                <TableRow key={permohonan.id}>
                  <TableCell className="font-medium">{permohonan.nomor_surat}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{permohonan.pemohon}</p>
                      <p className="text-xs text-gray-500">{permohonan.instansi}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm max-w-xs">{permohonan.perihal}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(permohonan.tanggal_kegiatan).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-sm">{permohonan.jam_mulai} - {permohonan.jam_selesai}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        permohonan.status === 'Disetujui' ? 'success' : 
                        permohonan.status === 'Ditolak' ? 'danger' : 
                        'warning'
                      }
                    >
                      {permohonan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDetail(permohonan)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {permohonan.status === 'Pending' && (
                        <Button variant="ghost" size="sm" onClick={() => handleVerifikasi(permohonan)}>
                          <CheckCircle className="w-4 h-4 text-green-600" />
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
                      <Badge 
                        variant={
                          selectedPermohonan.status === 'Disetujui' ? 'success' : 
                          selectedPermohonan.status === 'Ditolak' ? 'danger' : 
                          'warning'
                        }
                      >
                        {selectedPermohonan.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Pemohon</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.pemohon}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Instansi</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.instansi}</p>
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
                      {new Date(selectedPermohonan.tanggal_surat).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal Pengajuan</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedPermohonan.tanggal_pengajuan).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal Kegiatan</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedPermohonan.tanggal_kegiatan).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Jam Kegiatan</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.jam_mulai} - {selectedPermohonan.jam_selesai} WIB</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Lokasi Kegiatan</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.lokasi_kegiatan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Jumlah Peserta</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPermohonan.jumlah_peserta} orang</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">File Surat</label>
                  <p className="text-sm text-blue-600 mt-1 hover:underline cursor-pointer">{selectedPermohonan.file_surat}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                    Tutup
                  </Button>
                  {selectedPermohonan.status === 'Pending' && (
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
                  <p className="text-xs text-gray-600 mt-1">{selectedPermohonan.pemohon}</p>
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
                    <option value="Disetujui">Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
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
                    <strong>Catatan:</strong> Setelah verifikasi, permohonan akan diteruskan ke pimpinan untuk konfirmasi final.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowVerifikasiModal(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Verifikasi
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