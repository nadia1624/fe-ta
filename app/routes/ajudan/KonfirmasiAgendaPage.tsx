import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle, Eye, X, UserCheck, Download, FileText } from 'lucide-react';

export default function KonfirmasiAgendaPage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showKonfirmasiModal, setShowKonfirmasiModal] = useState(false);
  const [showDisposisiPreview, setShowDisposisiPreview] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [konfirmasiData, setKonfirmasiData] = useState({
    kehadiran: 'hadir',
    perwakilan_nama: '',
    perwakilan_jabatan: '',
    alasan: '',
    catatan: ''
  });

  const pimpinanOptions = [
    { nama: 'Ir. Hj. Siti Rahmawati, M.T', jabatan: 'Wakil Walikota' },
    { nama: 'Dr. Budi Santoso, M.M', jabatan: 'Sekretaris Daerah' },
    { nama: 'Drs. Andi Wijaya, M.Si', jabatan: 'Asisten Pemerintahan' },
    { nama: 'Ir. Siti Nurhaliza, M.T', jabatan: 'Kepala Bappeda' },
  ];

  const agendaPending = [
    {
      id: 1,
      nomor_surat: '012/SP/II/2026',
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      perihal: 'Permohonan kehadiran Walikota dalam Rapat Koordinasi OPD',
      pemohon: 'Sekretaris Daerah',
      instansi: 'Sekretariat Daerah',
      tanggal_kegiatan: '2026-02-10',
      waktu_mulai: '09:00',
      waktu_selesai: '12:00',
      tempat: 'Ruang Rapat Utama Kantor Walikota',
      pimpinan_diminta: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan_pimpinan: 'Walikota',
      keterangan: 'Rapat koordinasi rutin dengan seluruh kepala OPD',
      status: 'Menunggu Konfirmasi Ajudan',
      tanggal_surat: '2026-02-05'
    },
    {
      id: 2,
      nomor_surat: '013/SP/II/2026',
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      perihal: 'Permohonan kunjungan kerja Walikota',
      pemohon: 'Kepala Dinas Kesehatan',
      instansi: 'Dinas Kesehatan Kota',
      tanggal_kegiatan: '2026-02-12',
      waktu_mulai: '10:00',
      waktu_selesai: '11:30',
      tempat: 'Kantor Dinas Kesehatan',
      pimpinan_diminta: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan_pimpinan: 'Walikota',
      keterangan: 'Monitoring program vaksinasi dan kesehatan masyarakat',
      status: 'Menunggu Konfirmasi Ajudan',
      tanggal_surat: '2026-02-06'
    },
    {
      id: 3,
      nomor_surat: '025/SP/II/2026',
      judul_kegiatan: 'Dialog Interaktif dengan Mahasiswa',
      perihal: 'Permohonan kehadiran Wakil Walikota',
      pemohon: 'BEM Universitas Negeri',
      instansi: 'Universitas Negeri',
      tanggal_kegiatan: '2026-02-14',
      waktu_mulai: '13:00',
      waktu_selesai: '15:00',
      tempat: 'Auditorium Universitas Negeri',
      pimpinan_diminta: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan_pimpinan: 'Wakil Walikota',
      keterangan: 'Dialog tentang pembangunan daerah dan peluang kerja',
      status: 'Menunggu Konfirmasi Ajudan',
      tanggal_surat: '2026-02-08'
    },
  ];

  const handleDetail = (agenda: any) => {
    setSelectedAgenda(agenda);
    setShowDetailModal(true);
  };

  const handleKonfirmasi = (agenda: any) => {
    setSelectedAgenda(agenda);
    setKonfirmasiData({
      kehadiran: 'hadir',
      perwakilan_nama: '',
      perwakilan_jabatan: '',
      alasan: '',
      catatan: ''
    });
    setShowDetailModal(false);
    setShowKonfirmasiModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setKonfirmasiData({
      ...konfirmasiData,
      [name]: value
    });

    if (name === 'perwakilan_nama') {
      const selected = pimpinanOptions.find(p => p.nama === value);
      if (selected) {
        setKonfirmasiData(prev => ({
          ...prev,
          perwakilan_nama: value,
          perwakilan_jabatan: selected.jabatan
        }));
      }
    }
  };

  const handleSubmitKonfirmasi = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (konfirmasiData.kehadiran === 'hadir') {
      alert(`Konfirmasi kehadiran untuk "${selectedAgenda?.judul_kegiatan}"\n\nPimpinan: ${selectedAgenda?.pimpinan_diminta}\nStatus: HADIR SENDIRI`);
    } else {
      alert(`Konfirmasi perwakilan untuk "${selectedAgenda?.judul_kegiatan}"\n\nPimpinan: ${selectedAgenda?.pimpinan_diminta}\nDiwakilkan oleh: ${konfirmasiData.perwakilan_nama}\nSurat Disposisi akan digenerate otomatis`);
      setShowKonfirmasiModal(false);
      setShowDisposisiPreview(true);
    }
  };

  const generateDisposisiContent = () => {
    const today = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const nomorDisposisi = `DIS/${selectedAgenda?.id}/SESPRI/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

    return {
      nomor: nomorDisposisi,
      tanggal: today,
      dari: `${selectedAgenda?.pimpinan_diminta} (${selectedAgenda?.jabatan_pimpinan})`,
      kepada: `${konfirmasiData.perwakilan_nama} (${konfirmasiData.perwakilan_jabatan})`,
      perihal: `Disposisi Perwakilan Kehadiran - ${selectedAgenda?.judul_kegiatan}`,
      agenda: selectedAgenda,
      alasan: konfirmasiData.alasan,
      catatan: konfirmasiData.catatan
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Konfirmasi Agenda Pimpinan</h1>
        <p className="text-sm text-gray-600 mt-1">Konfirmasi kehadiran atau penunjukan perwakilan pimpinan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Perlu Konfirmasi</p>
                <p className="text-2xl font-semibold text-yellow-600">{agendaPending.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hadir Sendiri</p>
                <p className="text-2xl font-semibold text-green-600">12</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Diwakilkan</p>
                <p className="text-2xl font-semibold text-blue-600">5</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Agenda Perlu Konfirmasi ({agendaPending.length})</h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Surat</TableHead>
                <TableHead>Kegiatan</TableHead>
                <TableHead>Pemohon</TableHead>
                <TableHead>Tanggal & Waktu</TableHead>
                <TableHead>Pimpinan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agendaPending.map((agenda) => (
                <TableRow key={agenda.id}>
                  <TableCell className="font-medium text-sm">{agenda.nomor_surat}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{agenda.judul_kegiatan}</p>
                      <p className="text-xs text-gray-500">{agenda.tempat}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{agenda.pemohon}</p>
                      <p className="text-xs text-gray-500">{agenda.instansi}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {agenda.waktu_mulai} - {agenda.waktu_selesai}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{agenda.pimpinan_diminta}</p>
                      <p className="text-xs text-gray-500">{agenda.jabatan_pimpinan}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning">Pending</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDetail(agenda)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleKonfirmasi(agenda)}>
                        <UserCheck className="w-4 h-4 text-green-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Detail */}
      {showDetailModal && selectedAgenda && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detail Agenda</h3>
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Informasi Surat</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Nomor Surat</label>
                      <p className="text-sm text-gray-900">{selectedAgenda.nomor_surat}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Tanggal Surat</label>
                      <p className="text-sm text-gray-900">{selectedAgenda.tanggal_surat}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="text-xs font-medium text-gray-600">Perihal</label>
                    <p className="text-sm text-gray-900">{selectedAgenda.perihal}</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Informasi Pemohon</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Nama Pemohon</label>
                      <p className="text-sm text-gray-900">{selectedAgenda.pemohon}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Instansi</label>
                      <p className="text-sm text-gray-900">{selectedAgenda.instansi}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Judul Kegiatan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.judul_kegiatan}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedAgenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Waktu</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedAgenda.waktu_mulai} - {selectedAgenda.waktu_selesai}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tempat</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.tempat}</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Pimpinan yang Diminta Hadir</h4>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedAgenda.pimpinan_diminta}</p>
                    <p className="text-xs text-gray-600">{selectedAgenda.jabatan_pimpinan}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Keterangan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.keterangan}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                    Tutup
                  </Button>
                  <Button onClick={() => handleKonfirmasi(selectedAgenda)} className="flex-1">
                    Proses Konfirmasi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Konfirmasi Kehadiran */}
      {showKonfirmasiModal && selectedAgenda && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Kehadiran Pimpinan</h3>
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
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900">{selectedAgenda.judul_kegiatan}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(selectedAgenda.tanggal_kegiatan).toLocaleDateString('id-ID')} · {selectedAgenda.waktu_mulai} - {selectedAgenda.waktu_selesai}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">📍 {selectedAgenda.tempat}</p>
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <p className="text-xs font-medium text-gray-700">Pimpinan:</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedAgenda.pimpinan_diminta}</p>
                    <p className="text-xs text-gray-600">{selectedAgenda.jabatan_pimpinan}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Status Kehadiran <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setKonfirmasiData({ ...konfirmasiData, kehadiran: 'hadir' })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        konfirmasiData.kehadiran === 'hadir'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${
                        konfirmasiData.kehadiran === 'hadir' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-semibold text-gray-900">Hadir Sendiri</p>
                      <p className="text-xs text-gray-600 mt-1">Pimpinan akan hadir</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setKonfirmasiData({ ...konfirmasiData, kehadiran: 'wakilkan' })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        konfirmasiData.kehadiran === 'wakilkan'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <UserCheck className={`w-8 h-8 mx-auto mb-2 ${
                        konfirmasiData.kehadiran === 'wakilkan' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-semibold text-gray-900">Diwakilkan</p>
                      <p className="text-xs text-gray-600 mt-1">Tunjuk perwakilan</p>
                    </button>
                  </div>
                </div>

                {konfirmasiData.kehadiran === 'wakilkan' && (
                  <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900">Data Perwakilan</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Perwakilan <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="perwakilan_nama"
                        value={konfirmasiData.perwakilan_nama}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      >
                        <option value="">-- Pilih Perwakilan --</option>
                        {pimpinanOptions.map((p, idx) => (
                          <option key={idx} value={p.nama}>{p.nama} ({p.jabatan})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jabatan Perwakilan
                      </label>
                      <input
                        type="text"
                        name="perwakilan_jabatan"
                        value={konfirmasiData.perwakilan_jabatan}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                        placeholder="Jabatan akan terisi otomatis"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alasan Perwakilan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="alasan"
                        value={konfirmasiData.alasan}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Contoh: Pimpinan ada agenda penting di luar kota"
                        required
                      />
                    </div>
                  </div>
                )}

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

                <div className={`${konfirmasiData.kehadiran === 'hadir' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3`}>
                  <p className={`text-sm ${konfirmasiData.kehadiran === 'hadir' ? 'text-green-900' : 'text-blue-900'}`}>
                    {konfirmasiData.kehadiran === 'hadir' ? (
                      <>
                        <strong>✓ Pimpinan akan hadir sendiri</strong><br />
                        Status agenda akan diupdate menjadi "Terkonfirmasi"
                      </>
                    ) : (
                      <>
                        <strong>📄 Surat Disposisi akan digenerate otomatis</strong><br />
                        Sistem akan membuat surat disposisi kepada perwakilan yang ditunjuk. Sespri akan melakukan konfirmasi manual ke perwakilan tersebut.
                      </>
                    )}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowKonfirmasiModal(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    {konfirmasiData.kehadiran === 'hadir' ? 'Konfirmasi Hadir' : 'Tunjuk Perwakilan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Preview Surat Disposisi */}
      {showDisposisiPreview && selectedAgenda && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Surat Disposisi</h3>
                </div>
                <button
                  onClick={() => setShowDisposisiPreview(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
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
                    <span>: {generateDisposisiContent().nomor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Tanggal</span>
                    <span>: {generateDisposisiContent().tanggal}</span>
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
                    <span>{generateDisposisiContent().dari}</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                    <span className="font-medium">Kepada</span>
                    <span>:</span>
                    <span>{generateDisposisiContent().kepada}</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                    <span className="font-medium">Perihal</span>
                    <span>:</span>
                    <span className="font-semibold">{generateDisposisiContent().perihal}</span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-2">
                  <h5 className="font-semibold text-sm">Detail Kegiatan:</h5>
                  <div className="text-sm space-y-1">
                    <p><strong>Tanggal:</strong> {new Date(selectedAgenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                    <p><strong>Waktu:</strong> {selectedAgenda.waktu_mulai} - {selectedAgenda.waktu_selesai}</p>
                    <p><strong>Tempat:</strong> {selectedAgenda.tempat}</p>
                    <p><strong>Keterangan:</strong> {selectedAgenda.keterangan}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-sm mb-2">Alasan Perwakilan:</p>
                  <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded p-3">
                    {konfirmasiData.alasan}
                  </p>
                </div>

                {konfirmasiData.catatan && (
                  <div>
                    <p className="font-medium text-sm mb-2">Catatan:</p>
                    <p className="text-sm text-gray-700">{konfirmasiData.catatan}</p>
                  </div>
                )}

                <div className="pt-4 border-t-2 border-gray-300 text-right">
                  <p className="text-sm">{generateDisposisiContent().tanggal}</p>
                  <p className="text-sm font-semibold mt-1">Ajudan Pimpinan</p>
                  <div className="h-16"></div>
                  <p className="text-sm font-semibold underline">Eko Prasetyo</p>
                  <p className="text-sm">NIP. 198509122010011002</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowDisposisiPreview(false)} className="flex-1">
                  Tutup
                </Button>
                <Button onClick={() => alert('Download PDF!')} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
