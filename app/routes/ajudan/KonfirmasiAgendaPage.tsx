import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle, Eye, X, UserCheck, FileText, RefreshCw, Download, Calendar} from 'lucide-react';
import { agendaApi, pimpinanApi } from '../../lib/api';
import CustomSelect from '../../components/ui/CustomSelect';
import { toast } from '../../lib/swal';
import { isAgendaPast } from '../../lib/dateUtils';

export default function KonfirmasiAgendaPage() {
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showKonfirmasiModal, setShowKonfirmasiModal] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [selectedAp, setSelectedAp] = useState<any>(null);

  const [konfirmasiData, setKonfirmasiData] = useState({
    kehadiran: 'hadir',
    perwakilan_id_jabatan: '',
    perwakilan_id_periode: '',
    perwakilan_nama: '', 
    perwakilan_jabatan: '', 
    perwakilan_tipe: 'pimpinan' as 'pimpinan' | 'manual',
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
      const assignRes = await pimpinanApi.getActiveAssignments();
      if (assignRes.success) {
        setActiveAssignments(assignRes.data);
      }

      const pimpinanRes = await pimpinanApi.getAll();
      if (pimpinanRes.success && pimpinanRes.data) {
        setAllPimpinan(pimpinanRes.data.filter((p: any) => p.status_aktif === 'aktif' || p.status_aktif === 'Aktif'));
      }

      const agendaRes = await agendaApi.getLeaderAgendas({});
      if (agendaRes.success) {
        setAgendaList(agendaRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Gagal memuat data dari server');
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
    
    if (name === 'perwakilan_id_jabatan') {
      const val = value;
      if (val) {
        const [jabatan, periode] = val.split('|');
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
    } else {
      setKonfirmasiData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitKonfirmasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgenda || !selectedAp) return;

    // Manual Validation
    if (konfirmasiData.kehadiran === 'wakilkan') {
      if (konfirmasiData.perwakilan_tipe === 'pimpinan' && !konfirmasiData.perwakilan_id_jabatan) {
        return toast.warning('Validasi Gagal', 'Harap pilih pimpinan perwakilan');
      }
      if (konfirmasiData.perwakilan_tipe === 'manual' && !konfirmasiData.perwakilan_nama) {
        return toast.warning('Validasi Gagal', 'Harap isi nama perwakilan');
      }
    }
    if (konfirmasiData.kehadiran === 'tolak' && !konfirmasiData.alasan) {
      return toast.warning('Validasi Gagal', 'Harap isi alasan penolakan');
    }

    try {
      const finalStatus = konfirmasiData.kehadiran === 'wakilkan' ? 'diwakilkan' : (konfirmasiData.kehadiran === 'tolak' ? 'tidak_hadir' : 'hadir');
      const data: any = {
        status_kehadiran: finalStatus,
        keterangan: `${konfirmasiData.alasan ? konfirmasiData.alasan + '. ' : ''}${konfirmasiData.catatan}`
      };

      if (finalStatus === 'diwakilkan') {
        if (konfirmasiData.perwakilan_tipe === 'pimpinan') {
          data.id_jabatan_perwakilan = konfirmasiData.perwakilan_id_jabatan;
          data.id_periode_perwakilan = konfirmasiData.perwakilan_id_periode;
        } else {
          data.nama_perwakilan = konfirmasiData.perwakilan_nama;
        }
      }

      const res = await agendaApi.updateLeaderAttendance(
        selectedAgenda.id_agenda,
        selectedAp.id_jabatan,
        selectedAp.id_periode,
        data
      );

      if (res.success) {
        toast.success('Berhasil', 'Konfirmasi kehadiran berhasil disimpan');
        setShowKonfirmasiModal(false);
        fetchData();
      } else {
        if (res.message?.toLowerCase().includes('bentrok')) {
          toast.warning('Jadwal Bentrok!', undefined, `<p class="text-sm text-gray-600">${res.message}</p>`);
        } else {
          toast.error('Gagal', res.message);
        }
      }
    } catch (error) {
      toast.error('Error', 'Terjadi kesalahan sistem');
    }
  };

  const myPendingTasks: any[] = [];
  const hadirs: any[] = [];
  const diwakilkans: any[] = [];
  const ditolaks: any[] = [];

  agendaList.forEach(agenda => {
    const latestStatus = agenda.statusAgendas?.[0]?.status_agenda;
    const isApprovedBySespri = ['approved_sespri', 'approved_ajudan', 'delegated', 'rejected_ajudan', 'completed'].includes(latestStatus);

    if (!isApprovedBySespri) return;

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Perlu Konfirmasi', value: myPendingTasks.length, icon: UserCheck, color: 'text-blue-600' },
          { label: 'Hadir Sendiri', value: hadirs.length, icon: CheckCircle, color: 'text-green-600' },
          { label: 'Diwakilkan', value: diwakilkans.length, icon: UserCheck, color: 'text-indigo-600' },
          { label: 'Tidak Hadir', value: ditolaks.length, icon: XCircle, color: 'text-red-600' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Agenda Perlu Konfirmasi ({myPendingTasks.length})</h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                <TableHead className="text-sm font-bold text-gray-900 text-center w-12 py-4">No.</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Nomor Surat</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Kegiatan</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Pemohon</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Tanggal & Waktu</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Pimpinan</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myPendingTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    Tidak ada agenda perlu konfirmasi saat ini
                  </TableCell>
                </TableRow>
              ) : myPendingTasks.map((task, index) => (
                <TableRow key={`${task.id_agenda}-${index}`} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                  <TableCell className="text-center font-bold text-gray-400 text-xs">{index + 1}</TableCell>
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
                        {new Date(task.tanggal_kegiatan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-500">{task.waktu_mulai.slice(0, 5)} - {task.waktu_selesai.slice(0, 5)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{task.targetedAp.periodeJabatan?.pimpinan?.nama_pimpinan}</p>
                      <p className="text-xs text-gray-500">{task.targetedAp.periodeJabatan?.jabatan?.nama_jabatan}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDetail(task)} className="h-9 w-9 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleKonfirmasi(task, task.targetedAp)} 
                        disabled={isAgendaPast(task.tanggal_kegiatan, task.waktu_selesai)}
                        className={`h-9 w-9 p-0 rounded-xl ${isAgendaPast(task.tanggal_kegiatan, task.waktu_selesai) 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                        title={isAgendaPast(task.tanggal_kegiatan, task.waktu_selesai) ? "Agenda sudah selesai" : "Konfirmasi Kehadiran"}
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showDetailModal && selectedAgenda && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <h3 className="text-lg font-semibold text-gray-900">Detail Agenda</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 grid grid-cols-2 gap-3">
                <div className="col-span-2 font-semibold text-blue-800 text-sm mb-1">Informasi Surat</div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Nomor Surat</label>
                  <p className="text-sm text-gray-900">{selectedAgenda.nomor_surat}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Tanggal Surat</label>
                  <p className="text-sm text-gray-900">{new Date(selectedAgenda.tanggal_surat).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600">Perihal</label>
                  <p className="text-sm text-gray-900">{selectedAgenda.perihal}</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Informasi Kegiatan</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Nama Kegiatan</label>
                    <p className="text-sm font-medium text-gray-900">{selectedAgenda.nama_kegiatan}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Waktu</label>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedAgenda.waktu_mulai.slice(0, 5)} - {selectedAgenda.waktu_selesai.slice(0, 5)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Tanggal</label>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedAgenda.tanggal_kegiatan).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Lokasi</label>
                    <p className="text-sm font-medium text-gray-900">{selectedAgenda.lokasi_kegiatan}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Kontak Person</label>
                    <p className="text-sm font-medium text-blue-600">{selectedAgenda.contact_person || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-600">KaSKPD Pendamping</label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedAgenda.kaskpdPendampings && selectedAgenda.kaskpdPendampings.length > 0 ? (
                        selectedAgenda.kaskpdPendampings.map((k: any, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px] bg-white border border-gray-200">
                            {k.kaskpd?.nama_instansi}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">Tidak ada pendamping</p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-600">Catatan Agenda</label>
                    <p className="text-sm text-gray-700 mt-1 bg-amber-50/50 p-2 rounded border border-amber-100/50 italic">
                      {selectedAgenda.keterangan || '-'}
                    </p>
                  </div>
                </div>
              </div>


              <div className="pt-2 border-t flex justify-end">
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>Tutup</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showKonfirmasiModal && selectedAgenda && selectedAp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Kehadiran</h3>
                <p className="text-sm text-gray-500">Pilih status kehadiran pimpinan untuk agenda ini</p>
              </div>
              <button onClick={() => setShowKonfirmasiModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Agenda Summary Info */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">{selectedAgenda.nama_kegiatan}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {new Date(selectedAgenda.tanggal_kegiatan).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Pimpinan yang Didampingi</label>
                <p className="text-sm font-bold text-gray-900">{selectedAp.periodeJabatan?.pimpinan?.nama_pimpinan}</p>
                <p className="text-xs text-gray-500">{selectedAp.periodeJabatan?.jabatan?.nama_jabatan}</p>
              </div>

              <form onSubmit={handleSubmitKonfirmasi} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-600">Pilih status kehadiran</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'hadir', label: 'Hadir', icon: CheckCircle, active: 'border-blue-600 bg-blue-50 text-blue-700' },
                      { id: 'wakilkan', label: 'Delegasi', icon: UserCheck, active: 'border-blue-600 bg-blue-50 text-blue-700' },
                      { id: 'tolak', label: 'Tolak', icon: XCircle, active: 'border-blue-600 bg-blue-50 text-blue-700' }
                    ].map(status => (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => setKonfirmasiData({ ...konfirmasiData, kehadiran: status.id as any })}
                        className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                          konfirmasiData.kehadiran === status.id 
                            ? status.active 
                            : 'border-gray-200 hover:border-blue-200 text-gray-400'
                        }`}
                      >
                        <status.icon className="w-6 h-6 mb-2" />
                        <span className="text-xs font-semibold">{status.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {konfirmasiData.kehadiran === 'wakilkan' && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">Detail Perwakilan</span>
                      <div className="flex bg-white rounded-lg border p-1 scale-90">
                        {['pimpinan', 'manual'].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setKonfirmasiData({ 
                              ...konfirmasiData, 
                              perwakilan_tipe: t as any, 
                              perwakilan_nama: '', 
                              perwakilan_id_jabatan: '', 
                              perwakilan_id_periode: '', 
                              perwakilan_jabatan: '' 
                            })}
                            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                              konfirmasiData.perwakilan_tipe === t ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400'
                            }`}
                          >
                            {t === 'pimpinan' ? 'Pimpinan' : 'Manual'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {konfirmasiData.perwakilan_tipe === 'pimpinan' ? (
                      <div className="space-y-3">
                         <CustomSelect
                          value={konfirmasiData.perwakilan_id_jabatan ? `${konfirmasiData.perwakilan_id_jabatan}|${konfirmasiData.perwakilan_id_periode}` : ''}
                          onChange={(val) => handleChange({ target: { name: 'perwakilan_id_jabatan', value: val } } as any)}
                          options={allPimpinan
                            .filter(p => !selectedAgenda?.agendaPimpinans?.some((ap: any) => ap.id_jabatan === p.id_jabatan) && !activeAssignments.some((as: any) => as.id_jabatan === p.id_jabatan))
                            .map((p) => ({ value: `${p.id_jabatan}|${p.id_periode}`, label: `${p.pimpinan?.nama_pimpinan} (${p.jabatan?.nama_jabatan})` }))
                          }
                          placeholder="Pilih pimpinan..."
                          className="bg-white"
                        />
                        {konfirmasiData.perwakilan_jabatan && (
                          <div className="px-3 py-2 bg-white border border-gray-100 rounded-lg">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Jabatan perwakilan</p>
                            <p className="text-xs text-gray-700 font-medium">{konfirmasiData.perwakilan_jabatan}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600 ml-1">Nama & jabatan perwakilan</label>
                        <input
                          type="text"
                          name="perwakilan_nama"
                          value={konfirmasiData.perwakilan_nama}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                          placeholder="Contoh: Budi - Staf Protokol"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 ml-1">
                    {konfirmasiData.kehadiran === 'tolak' ? 'Alasan pembatalan' : 'Catatan tambahan'}
                  </label>
                  <textarea
                    name="alasan"
                    value={konfirmasiData.alasan}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-gray-400"
                    placeholder={konfirmasiData.kehadiran === 'tolak' ? "Berikan alasan..." : "Ketik catatan (opsional)..."}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowKonfirmasiModal(false)} className="flex-1 h-10 text-sm">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold h-10 shadow-sm transition-all active:scale-95">
                    Simpan konfirmasi
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
