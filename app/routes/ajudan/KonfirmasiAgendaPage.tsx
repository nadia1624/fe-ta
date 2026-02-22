import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle, Eye, X, UserCheck, Download, FileText, RefreshCw } from 'lucide-react';
import { agendaApi, pimpinanApi, periodeApi } from '../../lib/api';
import Swal from 'sweetalert2';

export default function KonfirmasiAgendaPage() {
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showKonfirmasiModal, setShowKonfirmasiModal] = useState(false);
  const [showDisposisiPreview, setShowDisposisiPreview] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [selectedAp, setSelectedAp] = useState<any>(null);

  const [konfirmasiData, setKonfirmasiData] = useState({
    kehadiran: 'hadir',
    perwakilan_id_jabatan: '',
    perwakilan_id_periode: '',
    perwakilan_nama: '', // For display
    perwakilan_jabatan: '', // For display
    perwakilan_tipe: 'pimpinan' as 'pimpinan' | 'manual', // NEW
    alasan: '',
    catatan: ''
  });

  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [agendaList, setAgendaList] = useState<any[]>([]);
  const [allPimpinan, setAllPimpinan] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get assignments
      const assignRes = await pimpinanApi.getActiveAssignments();
      if (assignRes.success) {
        setActiveAssignments(assignRes.data);
      }

      // 2. Get active pimpinan for delegation
      const pimpinanRes = await pimpinanApi.getAll();
      if (pimpinanRes.success && pimpinanRes.data) {
        setAllPimpinan(pimpinanRes.data.filter((p: any) => p.status_aktif === 'aktif' || p.status_aktif === 'Aktif'));
      }

      // 3. Get agendas assigned to the Ajudan's leaders
      const agendaRes = await agendaApi.getLeaderAgendas({});
      if (agendaRes.success) {
        setAgendaList(agendaRes.data);
      }

    } catch (error) {
      console.error('Failed to fetch data', error);
      Swal.fire('Error', 'Gagal memuat data dari server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = (agenda: any) => {
    setSelectedAgenda(agenda);
    setShowDetailModal(true);
  };

  const handleKonfirmasi = (agenda: any, ap: any) => {
    setSelectedAgenda(agenda);
    setSelectedAp(ap);
    setKonfirmasiData({
      kehadiran: 'hadir',
      perwakilan_id_jabatan: '',
      perwakilan_id_periode: '',
      perwakilan_nama: '',
      perwakilan_jabatan: '',
      perwakilan_tipe: 'pimpinan',
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

    if (name === 'perwakilan_id_jabatan') {
      if (value) {
        const [jabatan, periode] = value.split('|');
        const selected = allPimpinan.find(p => p.id_jabatan === jabatan && p.id_periode === periode);
        setKonfirmasiData(prev => ({
          ...prev,
          perwakilan_id_jabatan: jabatan,
          perwakilan_id_periode: periode,
          perwakilan_nama: selected ? selected.pimpinan?.nama_pimpinan : '',
          perwakilan_jabatan: selected ? selected.jabatan?.nama_jabatan : ''
        }));
      } else {
        setKonfirmasiData(prev => ({
          ...prev,
          perwakilan_id_jabatan: '',
          perwakilan_id_periode: '',
          perwakilan_nama: '',
          perwakilan_jabatan: ''
        }));
      }
    }
  };

  const handleSubmitKonfirmasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgenda || !selectedAp) return;

    try {
      const data = new FormData();
      let finalStatus = konfirmasiData.kehadiran === 'wakilkan' ? 'diwakilkan' : (konfirmasiData.kehadiran === 'tolak' ? 'tidak_hadir' : 'hadir');
      data.append('status_kehadiran', finalStatus);

      if (finalStatus === 'diwakilkan') {
        if (konfirmasiData.perwakilan_tipe === 'pimpinan') {
          data.append('id_jabatan_perwakilan', konfirmasiData.perwakilan_id_jabatan);
          data.append('id_periode_perwakilan', konfirmasiData.perwakilan_id_periode);
        } else {
          data.append('nama_perwakilan', konfirmasiData.perwakilan_nama);
        }
      }
      data.append('keterangan', `${konfirmasiData.alasan ? konfirmasiData.alasan + '. ' : ''}${konfirmasiData.catatan}`);

      const res = await agendaApi.updateLeaderAttendance(
        selectedAgenda.id_agenda,
        selectedAp.id_jabatan,
        selectedAp.id_periode,
        data
      );

      if (res.success) {
        if (finalStatus === 'hadir') {
          Swal.fire('Berhasil', 'Konfirmasi kehadiran berhasil disimpan', 'success');
          setShowKonfirmasiModal(false);
        } else if (finalStatus === 'tidak_hadir') {
          Swal.fire('Berhasil', 'Konfirmasi tidak hadir berhasil disimpan', 'success');
          setShowKonfirmasiModal(false);
        } else {
          Swal.fire('Berhasil', 'Konfirmasi perwakilan berhasil. Surat disposisi siap digenerate.', 'success');
          setShowKonfirmasiModal(false);
          setShowDisposisiPreview(true);
        }
        fetchData();
      } else {
        Swal.fire('Gagal', res.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    }
  };

  const generateDisposisiContent = () => {
    const today = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const nomorDisposisi = selectedAgenda ? `DIS/${selectedAgenda.id_agenda}/SESPRI/${new Date().getMonth() + 1}/${new Date().getFullYear()}` : '';

    let kepada = `${konfirmasiData.perwakilan_nama} (${konfirmasiData.perwakilan_jabatan})`;
    if (konfirmasiData.perwakilan_tipe === 'manual') {
      kepada = konfirmasiData.perwakilan_nama;
    }

    return {
      nomor: nomorDisposisi,
      tanggal: today,
      dari: selectedAp ? `${selectedAp.periodeJabatan?.pimpinan?.nama_pimpinan} (${selectedAp.periodeJabatan?.jabatan?.nama_jabatan})` : '',
      kepada: kepada,
      perihal: `Disposisi Perwakilan Kehadiran - ${selectedAgenda?.nama_kegiatan}`,
      agenda: selectedAgenda,
      alasan: konfirmasiData.alasan,
      catatan: konfirmasiData.catatan
    };
  };

  const myPendingTasks: any[] = [];
  const hadirs = [];
  const diwakilkans = [];
  const ditolaks = [];

  agendaList.forEach(agenda => {
    agenda.agendaPimpinans?.forEach((ap: any) => {
      const isMine = activeAssignments.some(as => as.id_jabatan === ap.id_jabatan && as.id_periode === ap.id_periode);
      if (isMine) {
        const task = { ...agenda, targetedAp: ap };
        if (!ap.status_kehadiran || ap.status_kehadiran === 'pending') {
          myPendingTasks.push(task);
        } else if (ap.status_kehadiran === 'hadir') {
          hadirs.push(task);
        } else if (ap.status_kehadiran === 'diwakilkan') {
          diwakilkans.push(task);
        } else if (ap.status_kehadiran === 'tidak_hadir') {
          ditolaks.push(task);
        }
      }
    });
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Konfirmasi Agenda Pimpinan</h1>
        <p className="text-sm text-gray-600 mt-1">Konfirmasi kehadiran atau penunjukan perwakilan pimpinan</p>
      </div>

      {/* Stats - Original Simple Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Perlu Konfirmasi</p>
                <p className="text-2xl font-semibold text-yellow-600">{myPendingTasks.length}</p>
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
                <p className="text-2xl font-semibold text-green-600">{hadirs.length}</p>
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
                <p className="text-2xl font-semibold text-blue-600">{diwakilkans.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tidak Hadir</p>
                <p className="text-2xl font-semibold text-red-600">{ditolaks.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Agenda Perlu Konfirmasi ({myPendingTasks.length})</h3>
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
              {myPendingTasks.map((task, index) => (
                <TableRow key={`${task.id_agenda}-${index}`}>
                  <TableCell className="font-medium text-sm">{task.nomor_surat}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{task.nama_kegiatan}</p>
                      <p className="text-xs text-gray-500">{task.lokasi_kegiatan}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{task.pemohon?.nama}</p>
                      <p className="text-xs text-gray-500">{task.pemohon?.instansi}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(task.tanggal_kegiatan).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.waktu_mulai.slice(0, 5)} - {task.waktu_selesai.slice(0, 5)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{task.targetedAp.periodeJabatan?.pimpinan?.nama_pimpinan}</p>
                      <p className="text-xs text-gray-500">{task.targetedAp.periodeJabatan?.jabatan?.nama_jabatan}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning">Pending</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDetail(task)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleKonfirmasi(task, task.targetedAp)}>
                        <UserCheck className="w-4 h-4 text-green-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {myPendingTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    Tidak ada agenda yang perlu dikonfirmasi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Detail Original */}
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
                      <p className="text-sm text-gray-900">{new Date(selectedAgenda.tanggal_surat).toLocaleDateString('id-ID')}</p>
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
                      <p className="text-sm text-gray-900">{selectedAgenda.pemohon?.nama}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Instansi</label>
                      <p className="text-sm text-gray-900">{selectedAgenda.pemohon?.instansi}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Judul Kegiatan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.nama_kegiatan}</p>
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
                    <p className="text-sm text-gray-900 mt-1">{selectedAgenda.waktu_mulai.slice(0, 5)} - {selectedAgenda.waktu_selesai.slice(0, 5)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tempat</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.lokasi_kegiatan}</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Pimpinan yang Diminta Hadir</h4>
                  <div className="space-y-2">
                    {selectedAgenda.agendaPimpinans?.filter((ap: any) =>
                      activeAssignments.some(as => as.id_jabatan === ap.id_jabatan && as.id_periode === ap.id_periode)
                    ).map((ap: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-white p-2 rounded border">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ap.periodeJabatan?.pimpinan?.nama_pimpinan}</p>
                          <p className="text-xs text-gray-600">{ap.periodeJabatan?.jabatan?.nama_jabatan}</p>
                        </div>
                        <Button size="sm" onClick={() => { setShowDetailModal(false); handleKonfirmasi(selectedAgenda, ap); }}>Konfirmasi</Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Keterangan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.keterangan || '-'}</p>
                </div>

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

      {/* Modal Konfirmasi Kehadiran Original */}
      {showKonfirmasiModal && selectedAgenda && selectedAp && (
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
                  <p className="text-sm font-semibold text-gray-900">{selectedAgenda.nama_kegiatan}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(selectedAgenda.tanggal_kegiatan).toLocaleDateString('id-ID')} · {selectedAgenda.waktu_mulai.slice(0, 5)} - {selectedAgenda.waktu_selesai.slice(0, 5)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">📍 {selectedAgenda.lokasi_kegiatan}</p>
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <p className="text-xs font-medium text-gray-700">Pimpinan:</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedAp.periodeJabatan?.pimpinan?.nama_pimpinan}</p>
                    <p className="text-xs text-gray-600">{selectedAp.periodeJabatan?.jabatan?.nama_jabatan}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Status Kehadiran <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setKonfirmasiData({ ...konfirmasiData, kehadiran: 'hadir' })}
                      className={`p-4 border-2 rounded-lg transition-all ${konfirmasiData.kehadiran === 'hadir'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${konfirmasiData.kehadiran === 'hadir' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      <p className="text-sm font-semibold text-gray-900">Hadir Sendiri</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setKonfirmasiData({ ...konfirmasiData, kehadiran: 'wakilkan' })}
                      className={`p-4 border-2 rounded-lg transition-all ${konfirmasiData.kehadiran === 'wakilkan'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      <UserCheck className={`w-6 h-6 mx-auto mb-2 ${konfirmasiData.kehadiran === 'wakilkan' ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                      <p className="text-sm font-semibold text-gray-900">Diwakilkan</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setKonfirmasiData({ ...konfirmasiData, kehadiran: 'tolak' })}
                      className={`p-4 border-2 rounded-lg transition-all ${konfirmasiData.kehadiran === 'tolak'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      <XCircle className={`w-6 h-6 mx-auto mb-2 ${konfirmasiData.kehadiran === 'tolak' ? 'text-red-600' : 'text-gray-400'
                        }`} />
                      <p className="text-sm font-semibold text-gray-900">Tidak Hadir</p>
                    </button>
                  </div>
                </div>

                {konfirmasiData.kehadiran === 'wakilkan' && (
                  <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">Data Perwakilan</h4>
                      <div className="flex bg-white rounded-md border p-1 border-gray-300">
                        <button
                          type="button"
                          onClick={() => setKonfirmasiData({ ...konfirmasiData, perwakilan_tipe: 'pimpinan', perwakilan_nama: '' })}
                          className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${konfirmasiData.perwakilan_tipe === 'pimpinan' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >Dari Sistem</button>
                        <button
                          type="button"
                          onClick={() => setKonfirmasiData({ ...konfirmasiData, perwakilan_tipe: 'manual', perwakilan_id_jabatan: '', perwakilan_id_periode: '', perwakilan_jabatan: '' })}
                          className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${konfirmasiData.perwakilan_tipe === 'manual' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >Manual</button>
                      </div>
                    </div>

                    {konfirmasiData.perwakilan_tipe === 'pimpinan' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih Perwakilan (Aktif) <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="perwakilan_id_jabatan"
                            value={konfirmasiData.perwakilan_id_jabatan ? `${konfirmasiData.perwakilan_id_jabatan}|${konfirmasiData.perwakilan_id_periode}` : ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                          >
                            <option value="">-- Pilih Perwakilan --</option>
                            {allPimpinan.map((p, idx) => (
                              <option key={idx} value={`${p.id_jabatan}|${p.id_periode}`}>
                                {p.pimpinan?.nama_pimpinan} ({p.jabatan?.nama_jabatan})
                              </option>
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
                      </>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama / Jabatan Perwakilan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="perwakilan_nama"
                          value={konfirmasiData.perwakilan_nama}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="Contoh: Bpk. Adi (Asisten Perekonomian)"
                          required
                        />
                      </div>
                    )}

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

                {konfirmasiData.kehadiran === 'tolak' && (
                  <div className="space-y-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alasan Tidak Hadir <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="alasan"
                        value={konfirmasiData.alasan}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        placeholder="Masukkan alasan pimpinan tidak bisa hadir..."
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

                <div className={`${konfirmasiData.kehadiran === 'hadir' ? 'bg-green-50 border-green-200' : (konfirmasiData.kehadiran === 'tolak' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200')} border rounded-lg p-3`}>
                  <p className={`text-sm ${konfirmasiData.kehadiran === 'hadir' ? 'text-green-900' : (konfirmasiData.kehadiran === 'tolak' ? 'text-red-900' : 'text-blue-900')}`}>
                    {konfirmasiData.kehadiran === 'hadir' ? (
                      <>
                        <strong>✓ Pimpinan akan hadir sendiri</strong><br />
                        Status agenda akan diupdate menjadi "Terkonfirmasi"
                      </>
                    ) : konfirmasiData.kehadiran === 'tolak' ? (
                      <>
                        <strong>! Pimpinan tidak dapat hadir</strong><br />
                        Status agenda akan diupdate menjadi "Ditolak / Absen"
                      </>
                    ) : (
                      <>
                        <strong>📄 Surat Disposisi akan digenerate otomatis</strong><br />
                        Sistem akan membuat surat disposisi kepada perwakilan yang ditunjuk.
                      </>
                    )}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowKonfirmasiModal(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    {konfirmasiData.kehadiran === 'hadir' ? 'Konfirmasi Hadir' : (konfirmasiData.kehadiran === 'tolak' ? 'Konfirmasi Tidak Hadir' : 'Tunjuk Perwakilan')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Preview Surat Disposisi Original */}
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
                    <p><strong>Waktu:</strong> {selectedAgenda.waktu_mulai.slice(0, 5)} - {selectedAgenda.waktu_selesai.slice(0, 5)}</p>
                    <p><strong>Tempat:</strong> {selectedAgenda.lokasi_kegiatan}</p>
                    <p><strong>Keterangan:</strong> {selectedAgenda.keterangan || '-'}</p>
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
                  <p className="text-sm font-semibold underline">Agus Santoso</p>
                  <p className="text-sm">NIP. 198509122010011002</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowDisposisiPreview(false)} className="flex-1">
                  Tutup
                </Button>
                <Button onClick={() => window.print()} className="flex-1 border">
                  <Download className="w-4 h-4 mr-2" />
                  Print / Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
