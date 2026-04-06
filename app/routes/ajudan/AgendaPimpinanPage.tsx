import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar, List, CalendarDays, Eye, X, Search, Filter, UserCheck, RefreshCw, Clock, Edit2, FileText, ChevronDown } from 'lucide-react';
import { agendaApi, pimpinanApi } from '../../lib/api';
import CustomSelect from '../../components/ui/CustomSelect';
import Swal from 'sweetalert2';

export default function AgendaPimpinanPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderFilter, setLeaderFilter] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [agendaList, setAgendaList] = useState<any[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [allPimpinan, setAllPimpinan] = useState<any[]>([]);

  // Attendance Form State
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedPimpinanItem, setSelectedPimpinanItem] = useState<any>(null);
  const [attendanceForm, setAttendanceForm] = useState({
    status_kehadiran: 'hadir',
    id_jabatan_perwakilan: '',
    id_periode_perwakilan: 'PD001',
    nama_perwakilan: '',
    keterangan: '',
    representative_type: 'pimpinan' as 'pimpinan' | 'manual'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Get assignments to know which leaders this Ajudan follow
      const assignRes = await pimpinanApi.getActiveAssignments();
      if (assignRes.success) {
        setActiveAssignments(assignRes.data);

        // 2. Get all active pimpinan for delegation selection
        const allPimRes = await pimpinanApi.getAll();
        if (allPimRes.success) {
          setAllPimpinan(allPimRes.data.filter((p: any) => p.status_aktif === 'aktif' || p.status_aktif === 'Aktif'));
        }

        // 3. Get agendas
        const agendaRes = await agendaApi.getLeaderAgendas({});
        if (agendaRes.success) {
          // Filter: only show agendas approved by Sespri or more advanced
          const verifiedAgendas = agendaRes.data.filter((agenda: any) => {
            const latestStatus = agenda.statusAgendas?.[0]?.status_agenda;
            return ['approved_sespri', 'approved_ajudan', 'delegated', 'rejected_ajudan', 'completed'].includes(latestStatus);
          });

          // Filter: keep agendas where at least one of supervised leaders is EITHER:
          // 1. Invited (agendaPimpinans)
          // 2. Present as representative (slotAgendaPimpinans)
          const myAgendas = verifiedAgendas.filter((agenda: any) => {
            const isInvited = agenda.agendaPimpinans?.some((ap: any) =>
              assignRes.data.some((as: any) => as.id_jabatan === ap.id_jabatan && as.id_periode === ap.id_periode)
            );
            const isRepresentative = agenda.slotAgendaPimpinans?.some((sap: any) =>
              assignRes.data.some((as: any) => as.id_jabatan === sap.id_jabatan_hadir && as.id_periode === sap.id_periode_hadir)
            );
            return isInvited || isRepresentative;
          });
          setAgendaList(myAgendas);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAttendance = (ap: any) => {
    setSelectedPimpinanItem(ap);
    setAttendanceForm({
      status_kehadiran: ap.status_kehadiran || 'hadir',
      id_jabatan_perwakilan: ap.id_jabatan_perwakilan || '',
      id_periode_perwakilan: ap.id_periode_perwakilan || 'PD001',
      nama_perwakilan: ap.nama_perwakilan || '',
      keterangan: ap.keterangan || '',
      representative_type: ap.id_jabatan_perwakilan || !ap.nama_perwakilan ? 'pimpinan' : 'manual'
    });
    setShowAttendanceForm(true);
  };

  const handleUpdateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgenda || !selectedPimpinanItem) return;

    try {
      const data = new FormData();
      data.append('status_kehadiran', attendanceForm.status_kehadiran);
      if (attendanceForm.status_kehadiran === 'diwakilkan') {
        if (attendanceForm.representative_type === 'pimpinan') {
          data.append('id_jabatan_perwakilan', attendanceForm.id_jabatan_perwakilan);
          data.append('id_periode_perwakilan', attendanceForm.id_periode_perwakilan);
        } else {
          data.append('nama_perwakilan', attendanceForm.nama_perwakilan);
        }
      }
      data.append('keterangan', attendanceForm.keterangan);

      const res = await agendaApi.updateLeaderAttendance(
        selectedAgenda.id_agenda,
        selectedPimpinanItem.id_jabatan,
        selectedPimpinanItem.id_periode,
        data
      );

      if (res.success) {
        Swal.fire('Berhasil', 'Status kehadiran diperbarui', 'success');
        setShowAttendanceForm(false);
        // Refresh
        const [assignRes, agendaRes] = await Promise.all([
           pimpinanApi.getActiveAssignments(),
           agendaApi.getLeaderAgendas({})
        ]);

        if (assignRes.success && agendaRes.success) {
          const verifiedAgendas = agendaRes.data.filter((agenda: any) => {
            const latestStatus = agenda.statusAgendas?.[0]?.status_agenda;
            return ['approved_sespri', 'approved_ajudan', 'delegated', 'rejected_ajudan', 'completed'].includes(latestStatus);
          });

          const myAgendas = verifiedAgendas.filter((agenda: any) => {
            const isInvited = agenda.agendaPimpinans?.some((ap: any) =>
              assignRes.data.some((as: any) => as.id_jabatan === ap.id_jabatan && as.id_periode === ap.id_periode)
            );
            const isRepresentative = agenda.slotAgendaPimpinans?.some((sap: any) =>
              assignRes.data.some((as: any) => as.id_jabatan === sap.id_jabatan_hadir && as.id_periode === sap.id_periode_hadir)
            );
            return isInvited || isRepresentative;
          });
          setAgendaList(myAgendas);
          const updated = myAgendas.find((a: any) => a.id_agenda === selectedAgenda.id_agenda);
          if (updated) setSelectedAgenda(updated);
        }
      } else {
        Swal.fire('Gagal', res.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Menunggu Verifikasi</Badge>;
      case 'revision':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Revisi</Badge>;
      case 'rejected_sespri':
        return <Badge variant="destructive">Ditolak Sespri</Badge>;
      case 'approved_sespri':
        return <Badge variant="success">Diverifikasi</Badge>;
      case 'approved_ajudan':
        return <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">Disetujui Pimpinan</Badge>;
      case 'delegated':
        return <Badge variant="outline" className="border-indigo-500 text-indigo-600 bg-indigo-50">Diwakilkan</Badge>;
      case 'rejected_ajudan':
        return <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50">Ditolak Pimpinan</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="border-gray-500 text-gray-600 bg-gray-50">Dibatalkan</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-emerald-600 text-emerald-700 bg-emerald-50">Selesai</Badge>;
      default:
        // Handle attendance status badges
        if (status === 'hadir') return <Badge variant="success">Hadir</Badge>;
        if (status === 'tidak_hadir') return <Badge variant="danger">Tidak Hadir</Badge>;
        if (status === 'diwakilkan') return <Badge variant="info">Diwakilkan</Badge>;
        return <Badge variant="secondary">{status || 'Belum Diatur'}</Badge>;
    }
  };

  const filteredData = agendaList.filter(item => {
    const matchSearch =
      item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi_kegiatan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchLeader = leaderFilter === 'all' || 
      item.agendaPimpinans?.some((ap: any) => ap.id_jabatan === leaderFilter) ||
      item.slotAgendaPimpinans?.some((sap: any) => sap.id_jabatan_hadir === leaderFilter);

    return matchSearch && matchLeader;
  });

  const getMyParticipationStatus = (agenda: any) => {
    const status: any[] = [];
    
    // 1. Check if invited
    agenda.agendaPimpinans?.forEach((ap: any) => {
      const assignment = activeAssignments.find(as => as.id_jabatan === ap.id_jabatan && as.id_periode === ap.id_periode);
      if (assignment) {
        status.push({
          type: 'invited',
          id_jabatan: ap.id_jabatan,
          nama_pimpinan: assignment.pimpinan?.nama_pimpinan,
          status_kehadiran: ap.status_kehadiran,
          raw_ap: ap
        });
      }
    });

    // 2. Check if representative
    agenda.slotAgendaPimpinans?.forEach((sap: any) => {
      const assignment = activeAssignments.find(as => as.id_jabatan === sap.id_jabatan_hadir && as.id_periode === sap.id_periode_hadir);
      const isActuallyRepresentative = sap.id_jabatan_diusulkan !== sap.id_jabatan_hadir;
      
      if (assignment && isActuallyRepresentative) {
        // Find the invitation record for the leader being represented to get the disposisi letter
        const originalInvitation = agenda.agendaPimpinans?.find((ap: any) => 
          ap.id_jabatan === sap.id_jabatan_diusulkan && ap.id_periode === sap.id_periode_diusulkan
        );

        // Avoid duplicate if already added as invited (though usually mutually exclusive in slots)
        if (!status.some(s => s.id_jabatan === sap.id_jabatan_hadir && s.type === 'representative')) {
          status.push({
            type: 'representative',
            id_jabatan: sap.id_jabatan_hadir,
            nama_pimpinan: assignment.pimpinan?.nama_pimpinan,
            status_kehadiran: 'hadir',
            representing: originalInvitation?.periodeJabatan?.pimpinan?.nama_pimpinan || sap.periodeJabatanDiusulkan?.pimpinan?.nama_pimpinan || 'Pimpinan Lain',
            surat_disposisi: originalInvitation?.surat_disposisi || null
          });
        }
      }
    });

    return status;
  };

  // Extract unique pimpinan options from agenda list for filtering
  const pimpinanFilterOptions: any[] = [];
  const seenPimpinan = new Set();
  
  // Also collect pimpinan from activeAssignments to ensure we have labels
  activeAssignments.forEach(as => {
    if (!seenPimpinan.has(as.id_jabatan)) {
      seenPimpinan.add(as.id_jabatan);
      pimpinanFilterOptions.push({
        id_jabatan: as.id_jabatan,
        nama_pimpinan: as.pimpinan?.nama_pimpinan
      });
    }
  });

  const calendarDays = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Agenda Pimpinan
          </h1>
          <p className="text-sm text-gray-600 mt-1">Pantau dan konfirmasi kehadiran agenda pimpinan</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <CalendarDays className="w-4 h-4" />
              Kalender
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>
      </div>

      {activeAssignments.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 px-5 py-4 rounded-xl shadow-sm flex items-start sm:items-center gap-4">
          <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Mendampingi Pimpinan</h3>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              {activeAssignments.map((a: any, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 font-medium bg-white border px-2.5 py-1 rounded-md shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {a.pimpinan?.nama_pimpinan}
                  <span className="text-[10px] text-gray-400 font-normal ml-1 border-l pl-1.5">
                    {a.jabatan?.nama_jabatan}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'calendar' ? (
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                  ←
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Hari Ini
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                  →
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 p-0 md:p-6 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-7 gap-2 text-center font-semibold text-sm text-gray-400 mb-2 uppercase tracking-wide">
                {['Mgg', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => <div key={day}>{day}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {calendarDays().map((day, i) => {
                  const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
                  const agendasToday = dateStr ? agendaList.filter(a => a.tanggal_kegiatan === dateStr) : [];
                  const isToday = day && new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                  return (
                    <div
                      key={i}
                      className={`min-h-[100px] border rounded-lg p-2 ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'} ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {agendasToday.map((agenda, idx) => {
                              const myParticipation = getMyParticipationStatus(agenda);

                              // Determine dominant color
                              let dominantColor = 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50';
                              if (myParticipation.length > 0) {
                                const hasTidakHadir = myParticipation.some((p: any) => p.status_kehadiran === 'tidak_hadir');
                                const hasDiwakilkan = myParticipation.some((p: any) => p.status_kehadiran === 'diwakilkan');
                                const hasHadir = myParticipation.some((p: any) => p.status_kehadiran === 'hadir');
                                const hasRepresentative = myParticipation.some((p: any) => p.type === 'representative');

                                if (hasTidakHadir) dominantColor = 'bg-red-50/50 text-red-600 border-red-100 hover:bg-red-50';
                                else if (hasHadir || hasRepresentative) dominantColor = 'bg-green-50/50 text-green-600 border-green-100 hover:bg-green-50';
                                else if (hasDiwakilkan) dominantColor = 'bg-blue-50/50 text-blue-600 border-blue-100 hover:bg-blue-50';
                                
                                // Representative specific highlight in calendar if not overridden by bad status
                                if (hasRepresentative && !hasTidakHadir) {
                                   dominantColor = 'bg-indigo-50/50 text-indigo-600 border-indigo-100 hover:bg-indigo-50';
                                }
                              }

                              return (
                                <div
                                  key={idx}
                                  onClick={() => { setSelectedAgenda(agenda); setShowDetailModal(true); }}
                                  className={`text-[10px] p-1.5 rounded cursor-pointer truncate border transition-colors ${dominantColor}`}
                                  title={agenda.nama_kegiatan}
                                >
                                  <div className="flex items-center gap-1 truncate">
                                    {myParticipation.some(p => p.type === 'representative') && <div className="w-1 h-1 rounded-full bg-indigo-500 flex-shrink-0"></div>}
                                    <strong>{agenda.waktu_mulai.slice(0, 5)}</strong> {agenda.nama_kegiatan}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
          <div className="bg-white rounded-b-xl border-t px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-50 border border-green-200"></div> Hadir</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-50 border border-blue-200"></div> Diwakilkan</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-50 border border-red-200"></div> Tidak Hadir</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white border border-gray-200"></div> Belum Konfirmasi</div>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Daftar Agenda</h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative group flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari agenda atau lokasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-blue-100 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm w-full shadow-sm"
                  />
                </div>
                {activeAssignments.length > 1 && (
                  <CustomSelect
                    value={leaderFilter}
                    onChange={setLeaderFilter}
                    options={[
                      { value: 'all', label: 'Semua Pimpinan' },
                      ...pimpinanFilterOptions.map(opt => ({
                        value: opt.id_jabatan,
                        label: opt.nama_pimpinan || opt.periodeJabatan?.pimpinan?.nama_pimpinan
                      }))
                    ]}
                    icon={<Filter className="w-4 h-4" />}
                    className="w-full sm:w-64"
                    placeholder="Pilih Pimpinan"
                  />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Pimpinan & Status</TableHead>
                  <TableHead>Status Rekap</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((agenda) => {
                  const latestRecord = agenda.statusAgendas?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                  return (
                    <TableRow key={agenda.id_agenda}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm">{agenda.nama_kegiatan}</p>
                          <p className="text-xs text-gray-500">{agenda.lokasi_kegiatan}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="text-xs text-gray-500">{agenda.waktu_mulai.slice(0, 5)} - {agenda.waktu_selesai.slice(0, 5)} WIB</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5 text-[10px]">
                          {getMyParticipationStatus(agenda).map((stat: any, i: number) => (
                            <div key={i} className={`flex items-center gap-1.5 border rounded-full px-2 py-0.5 w-max ${stat.type === 'representative' ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50'}`}>
                              <span className="font-medium">
                                {stat.nama_pimpinan}
                                {stat.type === 'representative' && (
                                  <span className="text-[8px] text-indigo-500 ml-1">
                                    (Wakil {stat.representing})
                                  </span>
                                )}
                              </span>
                              {stat.type === 'representative' && stat.surat_disposisi && (
                                <a
                                  href={`http://localhost:3000/api/${stat.surat_disposisi.replace(/\\/g, '/')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800"
                                  title="Lihat Surat Disposisi"
                                >
                                  <FileText className="w-3 h-3" />
                                </a>
                              )}
                              {getStatusBadge(stat.status_kehadiran)}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(latestRecord?.status_agenda || 'pending')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedAgenda(agenda); setShowDetailModal(true); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      Tidak ada agenda ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Modal Detail */}
      {showDetailModal && selectedAgenda && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Detail Agenda</h3>
                <button onClick={() => setShowDetailModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
            </CardHeader>
            <CardContent className="py-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kegiatan</label>
                    <p className="text-sm font-semibold">{selectedAgenda.nama_kegiatan}</p>
                    <p className="text-xs text-gray-500">{selectedAgenda.perihal}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu & Tempat</label>
                    <p className="text-sm">{new Date(selectedAgenda.tanggal_kegiatan).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-sm font-medium">{selectedAgenda.waktu_mulai.slice(0, 5)} - {selectedAgenda.waktu_selesai.slice(0, 5)} WIB</p>
                    <p className="text-sm">{selectedAgenda.lokasi_kegiatan}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pemohon</label>
                    <p className="text-sm font-medium">{selectedAgenda.pemohon?.nama}</p>
                    <p className="text-xs text-gray-500">{selectedAgenda.pemohon?.instansi}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kehadiran Pimpinan</label>
                  <div className="space-y-3">
                    {getMyParticipationStatus(selectedAgenda).map((stat: any, i: number) => (
                      <div key={i} className={`p-3 border rounded-lg space-y-2 ${stat.type === 'representative' ? 'bg-indigo-50/50 border-indigo-100' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold">
                              {stat.nama_pimpinan}
                              {stat.type === 'representative' && <span className="text-xs text-indigo-600 block">Mewakili: {stat.representing}</span>}
                            </p>
                          </div>
                          {stat.type === 'invited' && (
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] text-blue-600 hover:text-blue-700 p-1" onClick={() => handleOpenAttendance(stat.raw_ap)}>
                              <span className="mr-1">Edit Kehadiran</span> <Edit2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">Status:</span>
                          {getStatusBadge(stat.status_kehadiran)}
                        </div>
                        {stat.type === 'invited' && stat.status_kehadiran === 'diwakilkan' && (
                          <div className="space-y-1">
                            <p className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Diwakili oleh: {stat.raw_ap.nama_perwakilan}</p>
                            {stat.raw_ap.surat_disposisi && (
                              <a
                                href={`http://localhost:3000/api/${stat.raw_ap.surat_disposisi.replace(/\\/g, '/')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] flex items-center gap-1 text-blue-600 hover:underline mt-1"
                              >
                                <FileText className="w-3 h-3" /> Lihat Disposisi
                              </a>
                            )}
                          </div>
                        )}
                        {stat.type === 'representative' && (
                          <div className="space-y-1">
                            <p className="text-[10px] text-indigo-500 italic">Disposisi oleh: {stat.representing}</p>
                            {stat.surat_disposisi && (
                              <a
                                href={`http://localhost:3000/api/${stat.surat_disposisi.replace(/\\/g, '/')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] flex items-center gap-1 text-indigo-600 hover:underline mt-1 font-medium"
                              >
                                <FileText className="w-3 h-3" /> Lihat Surat Disposisi
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {showAttendanceForm && selectedPimpinanItem && (
                <div className="border-t pt-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        Atur Kehadiran: {selectedPimpinanItem.periodeJabatan?.pimpinan?.nama_pimpinan}
                      </h4>
                      <button type="button" onClick={() => setShowAttendanceForm(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateAttendance} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status Kehadiran</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['hadir', 'tidak_hadir', 'diwakilkan'].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setAttendanceForm(prev => ({ ...prev, status_kehadiran: s }))}
                              className={`py-2 px-1 rounded-lg border text-[10px] font-bold uppercase transition-all ${attendanceForm.status_kehadiran === s
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-gray-200 text-gray-500'
                                }`}
                            >
                              {s.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {attendanceForm.status_kehadiran === 'diwakilkan' && (
                        <div className="space-y-4 pt-2 border-t mt-4">
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'pimpinan', label: 'Pimpinan Lain' },
                              { id: 'manual', label: 'Lainnya (Manual)' }
                            ].map((t) => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => setAttendanceForm(prev => ({
                                  ...prev,
                                  representative_type: t.id as any,
                                  nama_perwakilan: '',
                                  id_jabatan_perwakilan: ''
                                }))}
                                className={`py-2 px-4 rounded-lg border text-xs font-bold transition-all duration-300 ${attendanceForm.representative_type === t.id
                                  ? 'bg-blue-100 border-blue-600 text-blue-700'
                                  : 'bg-white border-gray-200 text-gray-500 hover:border-blue-200'
                                  }`}
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>

                          {attendanceForm.representative_type === 'pimpinan' ? (
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pilih Pimpinan</label>
                              <CustomSelect
                                value={attendanceForm.id_jabatan_perwakilan ? `${attendanceForm.id_jabatan_perwakilan}|${attendanceForm.id_periode_perwakilan}` : ''}
                                onChange={(val) => {
                                  if (val) {
                                    const [id_jabatan, id_periode] = val.split('|');
                                    setAttendanceForm(prev => ({ ...prev, id_jabatan_perwakilan: id_jabatan, id_periode_perwakilan: id_periode }));
                                  } else {
                                    setAttendanceForm(prev => ({ ...prev, id_jabatan_perwakilan: '', id_periode_perwakilan: '' }));
                                  }
                                }}
                                options={allPimpinan
                                  .filter(p => 
                                    !selectedAgenda?.agendaPimpinans?.some(
                                      (ap: any) => ap.id_jabatan === p.id_jabatan && ap.id_periode === p.id_periode
                                    ) &&
                                    !activeAssignments.some(
                                      (as: any) => as.id_jabatan === p.id_jabatan && as.id_periode === p.id_periode
                                    )
                                  )
                                  .map((p) => ({
                                    value: `${p.id_jabatan}|${p.id_periode}`,
                                    label: `${p.pimpinan?.nama_pimpinan} (${p.jabatan?.nama_jabatan})`
                                  }))
                                }
                                placeholder="-- Pilih Pimpinan (Aktif) --"
                                className="w-full"
                              />
                            </div>
                          ) : (
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Perwakilan</label>
                              <input
                                type="text"
                                placeholder="Masukkan nama lengkap..."
                                value={attendanceForm.nama_perwakilan}
                                onChange={(e) => setAttendanceForm(prev => ({ ...prev, nama_perwakilan: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg text-sm"
                                required
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catatan</label>
                        <textarea
                          placeholder="Ketik catatan di sini..."
                          value={attendanceForm.keterangan}
                          onChange={(e) => setAttendanceForm(prev => ({ ...prev, keterangan: e.target.value }))}
                          className="w-full px-4 py-2 border rounded-lg text-sm"
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button type="button" variant="ghost" className="flex-1 text-xs" onClick={() => setShowAttendanceForm(false)}>
                          Batal
                        </Button>
                        <Button type="submit" className="flex-1 text-xs bg-blue-600 hover:bg-blue-700">
                          Simpan Status
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t flex justify-end">
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>Tutup</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
