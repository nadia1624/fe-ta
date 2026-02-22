import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Plus, Edit2, Trash2, Eye, Calendar, X,
  AlertTriangle, Search, Filter, List,
  CalendarDays, RefreshCw, CheckCircle,
  Clock, UserCheck, ExternalLink, FileText
} from 'lucide-react';
import { agendaApi, pimpinanApi } from '../../lib/api';
import Swal from 'sweetalert2';

export default function AgendaPimpinanPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [loading, setLoading] = useState(true);
  const [agendaList, setAgendaList] = useState<any[]>([]);
  const [pimpinanOptions, setPimpinanOptions] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPimpinan, setFilterPimpinan] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedPimpinans, setSelectedPimpinans] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nomor_surat: '',
    tanggal_surat: '',
    perihal: '',
    nama_pemohon: '',
    instansi: '',
    alamat: '',
    no_telepon: '',
    email: '',
    nama_kegiatan: '',
    tanggal_kegiatan: '',
    waktu_mulai: '',
    waktu_selesai: '',
    lokasi_kegiatan: '',
    keterangan: '',
    file_surat: null as File | null,
  });

  // For attendance management within detail modal
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedPimpinanItem, setSelectedPimpinanItem] = useState<any>(null);
  const [attendanceForm, setAttendanceForm] = useState({
    status_kehadiran: 'hadir',
    nama_perwakilan: '',
    keterangan: '',
    file_disposisi: null as File | null
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [agendaRes, pimpinanRes] = await Promise.all([
        agendaApi.getLeaderAgendas({}),
        pimpinanApi.getActiveAssignments()
      ]);

      if (agendaRes.success) setAgendaList(agendaRes.data);
      if (pimpinanRes.success) setPimpinanOptions(pimpinanRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
      Swal.fire('Error', 'Gagal mengambil data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const getAgendaForDate = (day: number) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return agendaList.filter(agenda => agenda.tanggal_kegiatan === dateStr);
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedPimpinans([]);
    setFormData({
      nomor_surat: '',
      tanggal_surat: '',
      perihal: '',
      nama_pemohon: '',
      instansi: '',
      alamat: '',
      no_telepon: '',
      email: '',
      nama_kegiatan: '',
      tanggal_kegiatan: '',
      waktu_mulai: '',
      waktu_selesai: '',
      lokasi_kegiatan: '',
      keterangan: '',
      file_surat: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('nomor_surat', formData.nomor_surat);
      data.append('tanggal_surat', formData.tanggal_surat);
      data.append('perihal', formData.perihal);
      data.append('nama_kegiatan', formData.nama_kegiatan);
      data.append('lokasi_kegiatan', formData.lokasi_kegiatan);
      data.append('tanggal_kegiatan', formData.tanggal_kegiatan);
      data.append('waktu_mulai', formData.waktu_mulai);
      data.append('waktu_selesai', formData.waktu_selesai);
      data.append('keterangan', formData.keterangan);

      if (selectedPimpinans.length === 0) {
        Swal.fire('Peringatan', 'Pilih minimal satu pimpinan', 'warning');
        return;
      }

      if (!formData.file_surat) {
        Swal.fire('Peringatan', 'Surat permohonan wajib diupload', 'warning');
        return;
      }

      const invited = selectedPimpinans.map(val => {
        const [id_jabatan, id_periode] = val.split(':');
        return { id_jabatan, id_periode };
      });
      data.append('invited_pimpinan', JSON.stringify(invited));

      data.append('surat_permohonan', formData.file_surat);

      const res = await agendaApi.create(data);
      if (res.success) {
        Swal.fire('Berhasil', 'Agenda berhasil ditambahkan (Langsung Disetujui)', 'success');
        setShowModal(false);
        fetchData();
      } else {
        Swal.fire('Gagal', res.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    }
  };

  const handleOpenAttendance = (pimpinanItem: any) => {
    setSelectedPimpinanItem(pimpinanItem);
    setAttendanceForm({
      status_kehadiran: pimpinanItem.status_kehadiran || 'hadir',
      nama_perwakilan: pimpinanItem.nama_perwakilan || '',
      keterangan: pimpinanItem.keterangan || '',
      file_disposisi: null
    });
    setShowAttendanceForm(true);
  };

  const handleUpdateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('status_kehadiran', attendanceForm.status_kehadiran);
      data.append('nama_perwakilan', attendanceForm.nama_perwakilan);
      data.append('keterangan', attendanceForm.keterangan);
      if (attendanceForm.file_disposisi) {
        data.append('surat_disposisi', attendanceForm.file_disposisi);
      }

      const res = await agendaApi.updateLeaderAttendance(
        selectedAgenda.id_agenda,
        selectedPimpinanItem.id_jabatan,
        selectedPimpinanItem.id_periode,
        data
      );

      if (res.success) {
        Swal.fire('Berhasil', 'Status kehadiran diperbarui', 'success');
        setShowAttendanceForm(false);
        // Refresh details
        const updatedAgendaRes = await agendaApi.getLeaderAgendas({});
        if (updatedAgendaRes.success) {
          setAgendaList(updatedAgendaRes.data);
          const found = updatedAgendaRes.data.find((a: any) => a.id_agenda === selectedAgenda.id_agenda);
          if (found) setSelectedAgenda(found);
        }
      } else {
        Swal.fire('Gagal', res.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    }
  };

  const handlePimpinanToggle = (value: string) => {
    setSelectedPimpinans(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredData = agendaList.filter(item => {
    const matchSearch =
      item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi_kegiatan.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterPimpinan === 'all') return matchSearch;
    const [idJ, idP] = filterPimpinan.split(':');
    return matchSearch && item.agendaPimpinans.some((ap: any) => ap.id_jabatan === idJ && ap.id_periode === idP);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hadir': return <Badge variant="success">Hadir</Badge>;
      case 'tidak_hadir': return <Badge variant="danger">Tidak Hadir</Badge>;
      case 'diwakilkan': return <Badge variant="info">Diwakilkan</Badge>;
      default: return <Badge variant="secondary">Belum Diatur</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agenda Pimpinan</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola jadwal dan agenda pimpinan (Kalender & List)</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'calendar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <CalendarDays className="w-4 h-4" />
              Kalender
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Agenda
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agenda</p>
                <p className="text-2xl font-semibold text-blue-600">{agendaList.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terlaksana</p>
                <p className="text-2xl font-semibold text-green-600">
                  {agendaList.filter(a => a.status_pelaksanaan === 'Terlaksana').length}
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
                <p className="text-sm text-gray-600">Belum Terlaksana</p>
                <p className="text-2xl font-semibold text-orange-600">
                  {agendaList.filter(a => a.status_pelaksanaan === 'Belum Terlaksana').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : viewMode === 'calendar' ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>←</Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>Hari Ini</Button>
                <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>→</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 p-0 md:p-6 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-7 gap-2 text-center font-semibold text-sm text-gray-400 mb-2 uppercase tracking-wide">
                {['Mgg', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {getDaysInMonth(selectedDate).map((day, index) => {
                  const agendas = day ? getAgendaForDate(day) : [];
                  const isToday = day &&
                    day === new Date().getDate() &&
                    selectedDate.getMonth() === new Date().getMonth() &&
                    selectedDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] border rounded-lg p-2 ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                        } ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {agendas.slice(0, 3).map((agenda) => {
                              let dominantColor = 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50';
                              let attendeeName = '';

                              if (agenda.agendaPimpinans && agenda.agendaPimpinans.length > 0) {
                                const hasTidakHadir = agenda.agendaPimpinans.some((l: any) => l.status_kehadiran === 'tidak_hadir');
                                const delegated = agenda.agendaPimpinans.find((l: any) => l.status_kehadiran === 'diwakilkan');
                                const present = agenda.agendaPimpinans.find((l: any) => l.status_kehadiran === 'hadir');

                                if (hasTidakHadir) dominantColor = 'bg-red-50/50 text-red-600 border-red-100 hover:bg-red-50';
                                else if (present) dominantColor = 'bg-green-50/50 text-green-600 border-green-100 hover:bg-green-50';
                                else if (delegated) dominantColor = 'bg-blue-50/50 text-blue-600 border-blue-100 hover:bg-blue-50';

                                if (present) {
                                  attendeeName = present.periodeJabatan?.pimpinan?.nama_pimpinan || '';
                                } else if (delegated) {
                                  attendeeName = delegated.nama_perwakilan || 'Diwakilkan';
                                }
                              }

                              return (
                                <div
                                  key={agenda.id_agenda}
                                  onClick={() => { setSelectedAgenda(agenda); setShowDetailModal(true); }}
                                  className={`text-[10px] p-1.5 rounded cursor-pointer truncate border transition-colors ${dominantColor}`}
                                  title={`${agenda.nama_kegiatan}${attendeeName ? ' - ' + attendeeName : ''}`}
                                >
                                  <strong>{agenda.waktu_mulai.slice(0, 5)}</strong> {agenda.nama_kegiatan}
                                  {attendeeName && (
                                    <div className="mt-0.5 text-[9px] font-medium opacity-80 border-t border-black/10 pt-0.5 truncate">
                                      {attendeeName}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {agendas.length > 3 && (
                              <div className="text-[10px] text-gray-400 font-medium">
                                +{agendas.length - 3} lainnya
                              </div>
                            )}
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari agenda..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterPimpinan}
                    onChange={(e) => setFilterPimpinan(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white"
                  >
                    <option value="all">Semua Pimpinan</option>
                    {pimpinanOptions.map(p => (
                      <option key={`${p.id_jabatan}:${p.id_periode}`} value={`${p.id_jabatan}:${p.id_periode}`}>
                        {p.jabatan?.nama_jabatan} - {p.pimpinan?.nama_pimpinan}
                      </option>
                    ))}
                  </select>
                </div>
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
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((agenda) => (
                  <TableRow key={agenda.id_agenda}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm">{agenda.nama_kegiatan}</p>
                        <p className="text-xs text-gray-500">{agenda.lokasi_kegiatan}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      <p className="text-xs text-gray-500">{agenda.waktu_mulai} - {agenda.waktu_selesai}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {agenda.agendaPimpinans.map((ap: any, i: number) => (
                          <div key={i} className="flex items-center gap-1.5 border rounded-full px-2 py-0.5 bg-gray-50">
                            <span className="text-[10px] font-medium">{ap.periodeJabatan?.pimpinan?.nama_pimpinan}</span>
                            {getStatusBadge(ap.status_kehadiran)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedAgenda(agenda); setShowDetailModal(true); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Tambah Agenda Langsung</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                  <strong>Info:</strong> Agenda ini akan langsung berstatus <strong>Disetujui</strong> karena ditambahkan oleh Sespri.
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pimpinan <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border rounded-lg bg-gray-50">
                    {pimpinanOptions.map((p) => {
                      const value = `${p.id_jabatan}:${p.id_periode}`;
                      return (
                        <label key={value} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedPimpinans.includes(value)}
                            onChange={() => handlePimpinanToggle(value)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-700">
                            {p.pimpinan?.nama_pimpinan}
                            <span className="block text-[10px] text-gray-400">{p.jabatan?.nama_jabatan}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat <span className="text-red-500">*</span></label>
                    <input name="nomor_surat" value={formData.nomor_surat} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Surat</label>
                    <input type="date" name="tanggal_surat" value={formData.tanggal_surat} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perihal <span className="text-red-500">*</span></label>
                  <textarea name="perihal" value={formData.perihal} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" rows={2} required />
                </div>

                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Detail Kegiatan</label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kegiatan <span className="text-red-500">*</span></label>
                      <input name="nama_kegiatan" value={formData.nama_kegiatan} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal <span className="text-red-500">*</span></label>
                        <input type="date" name="tanggal_kegiatan" value={formData.tanggal_kegiatan} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mulai <span className="text-red-500">*</span></label>
                        <input type="time" name="waktu_mulai" value={formData.waktu_mulai} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Selesai <span className="text-red-500">*</span></label>
                        <input type="time" name="waktu_selesai" value={formData.waktu_selesai} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi <span className="text-red-500">*</span></label>
                      <input name="lokasi_kegiatan" value={formData.lokasi_kegiatan} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Surat <span className="text-red-500">*</span></label>
                      <input
                        type="file"
                        onChange={(e) => setFormData(prev => ({ ...prev, file_surat: e.target.files?.[0] || null }))}
                        className="w-full text-sm border p-2 rounded-lg bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Batal</Button>
                  <Button type="submit" className="flex-1">Simpan Agenda</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
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
                    <p className="text-sm font-medium">{selectedAgenda.waktu_mulai} - {selectedAgenda.waktu_selesai} WIB</p>
                    <p className="text-sm">{selectedAgenda.lokasi_kegiatan}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pemohon</label>
                    <p className="text-sm font-medium">{selectedAgenda.pemohon?.nama}</p>
                    <p className="text-xs text-gray-500">{selectedAgenda.pemohon?.instansi}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pimpinan Terkait</label>
                  <div className="space-y-3">
                    {selectedAgenda.agendaPimpinans?.map((ap: any, i: number) => (
                      <div key={i} className="p-3 border rounded-lg bg-gray-50 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold">{ap.periodeJabatan?.pimpinan?.nama_pimpinan}</p>
                            <p className="text-[10px] text-gray-500">{ap.periodeJabatan?.jabatan?.nama_jabatan}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-blue-600 hover:text-blue-700 p-1" onClick={() => handleOpenAttendance(ap)}>
                            <Edit2 className="w-3 h-3 mr-1" /> Atur Kehadiran
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">Status:</span>
                          {getStatusBadge(ap.status_kehadiran)}
                        </div>
                        {ap.status_kehadiran === 'diwakilkan' && (
                          <p className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Diwakili oleh: {ap.nama_perwakilan}</p>
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
                      <button onClick={() => setShowAttendanceForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
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
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Perwakilan</label>
                          <input
                            type="text"
                            value={attendanceForm.nama_perwakilan}
                            onChange={(e) => setAttendanceForm(prev => ({ ...prev, nama_perwakilan: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg text-sm"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catatan</label>
                        <textarea
                          value={attendanceForm.keterangan}
                          onChange={(e) => setAttendanceForm(prev => ({ ...prev, keterangan: e.target.value }))}
                          className="w-full px-4 py-2 border rounded-lg text-sm"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Upload Disposisi (Opsi)</label>
                        <input type="file" onChange={(e) => setAttendanceForm(prev => ({ ...prev, file_disposisi: e.target.files?.[0] || null }))} className="w-full text-xs" />
                      </div>

                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" className="flex-1 text-xs" onClick={() => setShowAttendanceForm(false)}>Batal</Button>
                        <Button type="submit" className="flex-1 text-xs bg-blue-600 hover:bg-blue-700">Simpan Status</Button>
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