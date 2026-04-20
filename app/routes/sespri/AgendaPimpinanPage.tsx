import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Plus, Edit2, Trash2, Eye, Calendar as CalendarIcon, X,
  AlertTriangle, Search, Filter, List,
  CalendarDays, RefreshCw, CheckCircle,
  Clock, UserCheck, ExternalLink, FileText, Building, Phone
} from 'lucide-react';
import { agendaApi, pimpinanApi, kaskpdApi } from '../../lib/api';
import CustomSelect from '../../components/ui/CustomSelect';
import MultiSelect from '../../components/ui/MultiSelect';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { TimePicker } from '../../components/ui/time-picker';
import { cn } from '../../components/ui/utils';
import moment from 'moment';
import 'moment/locale/id';
import { toast } from '../../lib/swal';

moment.locale('id');

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
  const [filterStatus, setFilterStatus] = useState('all');
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
    contact_person: '',
    file_surat: null as File | null,
  });

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editNotesForm, setEditNotesForm] = useState({
    contact_person: '',
    keterangan: '',
    kaskpd_pendamping: [] as string[]
  });
  const [kaskpdList, setKaskpdList] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [agendaRes, pimpinanRes, kaskpdRes] = await Promise.all([
        agendaApi.getLeaderAgendas({}),
        pimpinanApi.getActiveAssignments(),
        kaskpdApi.getAll()
      ]);

      if (agendaRes.success) setAgendaList(agendaRes.data);
      if (pimpinanRes.success) setPimpinanOptions(pimpinanRes.data);
      if (kaskpdRes.success) setKaskpdList(kaskpdRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Gagal mengambil data');
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
    return filteredData.filter(agenda => agenda.tanggal_kegiatan === dateStr);
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const handleSaveNotes = async () => {
    try {
      const data = new FormData();
      data.append('contact_person', editNotesForm.contact_person);
      data.append('keterangan', editNotesForm.keterangan);
      data.append('kaskpd_pendamping', JSON.stringify(editNotesForm.kaskpd_pendamping));

      const res = await agendaApi.update(selectedAgenda.id_agenda, data);

      if (res.success) {
        toast.success('Berhasil', 'Agenda berhasil diperbarui');
        setIsEditingNotes(false);
        fetchData(); // Refresh the main list

        // Update the selected agenda with the full reloaded data from server
        // This now includes the updated kaskpdPendampings associations
        if (res.data) {
          setSelectedAgenda(res.data);
        }
      } else {
        toast.error('Gagal', res.message);
      }
    } catch (error) {
      toast.error('Error', 'Terjadi kesalahan sistem saat menyimpan catatan');
    }
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
      contact_person: '',
      file_surat: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Date validation: must be after today
    const todayStr = moment().format('YYYY-MM-DD');
    if (formData.tanggal_kegiatan <= todayStr) {
      return toast.error('Error', 'Tanggal kegiatan harus setelah hari ini (minimal besok)');
    }

    // Time validation: end time > start time
    if (formData.waktu_selesai <= formData.waktu_mulai) {
      return toast.error('Error', 'Waktu selesai tidak boleh lebih awal dari waktu mulai.');
    }

    // File validation
    if (!formData.file_surat) {
      return toast.warning('Peringatan', 'Surat permohonan wajib diupload');
    }
    if (formData.file_surat.size > 5 * 1024 * 1024) {
      return toast.error('Error', 'Ukuran file surat permohonan maksimal 5 MB');
    }

    if (selectedPimpinans.length === 0) {
      return toast.warning('Peringatan', 'Pilih minimal satu pimpinan');
    }

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
      if (formData.contact_person) {
        data.append('contact_person', formData.contact_person);
      }

      const invited = selectedPimpinans.map(val => {
        const [id_jabatan, id_periode] = val.split(':');
        return { id_jabatan, id_periode };
      });
      data.append('invited_pimpinan', JSON.stringify(invited));

      data.append('surat_permohonan', formData.file_surat);

      const res = await agendaApi.create(data);
      if (res.success) {
        toast.success('Berhasil', 'Agenda berhasil ditambahkan (Langsung Disetujui)');
        setShowModal(false);
        fetchData();
      } else {
        toast.error('Gagal', res.message);
      }
    } catch (error) {
      toast.error('Error', 'Terjadi kesalahan sistem');
    }
  };

  const handleDateSelect = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: moment(date).format('YYYY-MM-DD') }));
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

  // Deklarasikan 'now' sebelum digunakan oleh filteredData
  const now = new Date();

  // Extract unique pimpinan options from agenda list for filtering
  const pimpinanFilterOptions: any[] = [];
  const seenPimpinan = new Set();
  agendaList.forEach(a => {
    a.agendaPimpinans?.forEach((ap: any) => {
      const key = `${ap.id_jabatan}:${ap.id_periode}`;
      if (!seenPimpinan.has(key)) {
        seenPimpinan.add(key);
        pimpinanFilterOptions.push(ap);
      }
    });
  });

  const filteredData = agendaList.filter(item => {
    // 0. Exclude canceled agendas
    const latestStatus = item.statusAgendas?.[0]?.status_agenda;
    if (latestStatus === 'canceled') return false;

    // 1. Search filter
    const matchSearch =
      item.nama_kegiatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi_kegiatan?.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Pimpinan filter
    let matchPimpinan = true;
    if (filterPimpinan !== 'all') {
      const [idJ, idP] = filterPimpinan.split(':');
      matchPimpinan = item.agendaPimpinans?.some((ap: any) =>
        ap.id_jabatan?.toString() === idJ && ap.id_periode?.toString() === idP
      );
    }

    // 3. Status filter (Terlaksana vs Belum)
    let matchStatus = true;
    if (filterStatus !== 'all') {
      const agendaDateTime = new Date(item.tanggal_kegiatan);
      if (item.waktu_mulai) {
        const [hours, minutes] = item.waktu_mulai.split(':');
        agendaDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      } else {
        agendaDateTime.setHours(23, 59, 59, 999);
      }
      const isPast = agendaDateTime < now;

      if (filterStatus === 'terlaksana') matchStatus = isPast;
      if (filterStatus === 'belum') matchStatus = !isPast;
    }

    return matchSearch && matchPimpinan && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hadir': return <Badge variant="success">Hadir</Badge>;
      case 'tidak_hadir': return <Badge variant="danger">Tidak Hadir</Badge>;
      case 'diwakilkan': return <Badge variant="info">Diwakilkan</Badge>;
      default: return <Badge variant="secondary">Belum Diatur</Badge>;
    }
  };

  // KPI Calculations


  const statsTotal = agendaList.length;
  let statsTerlaksana = 0;
  let statsBelum = 0;

  agendaList.forEach(a => {
    const agendaDateTime = new Date(a.tanggal_kegiatan);
    if (a.waktu_mulai) {
      const [hours, minutes] = a.waktu_mulai.split(':');
      agendaDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    } else {
      agendaDateTime.setHours(23, 59, 59, 999);
    }

    if (agendaDateTime < now) {
      statsTerlaksana++;
    } else {
      statsBelum++;
    }
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Agenda Pimpinan</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola jadwal dan agenda pimpinan</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-2 md:px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors ${viewMode === 'calendar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Kalender</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 md:px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors ${viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
          <Button onClick={handleAdd} size="sm" className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Tambah Agenda</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agenda</p>
                <p className="text-2xl font-semibold text-blue-600">{statsTotal}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terlaksana</p>
                <p className="text-2xl font-semibold text-green-600">{statsTerlaksana}</p>
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
                <p className="text-2xl font-semibold text-yellow-600">{statsBelum}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari agenda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-blue-100 bg-white rounded-xl text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <CustomSelect
                value={filterPimpinan}
                onChange={setFilterPimpinan}
                options={[
                  { value: 'all', label: 'Semua Pimpinan' },
                  ...pimpinanFilterOptions.map(p => ({
                    value: `${p.id_jabatan}:${p.id_periode}`,
                    label: `${p.periodeJabatan?.jabatan?.nama_jabatan} - ${p.periodeJabatan?.pimpinan?.nama_pimpinan}`
                  }))
                ]}
                icon={<Filter className="w-4 h-4" />}
                className="w-full sm:w-64"
                placeholder="Pilih Pimpinan"
              />
              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'terlaksana', label: 'Terlaksana' },
                  { value: 'belum', label: 'Belum Terlaksana' }
                ]}
                icon={<Filter className="w-4 h-4" />}
                className="w-full sm:w-48"
                placeholder="Pilih Status"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
                                  onClick={() => {
                                    setSelectedAgenda(agenda);
                                    setEditNotesForm({
                                      contact_person: agenda.contact_person || '',
                                      keterangan: agenda.keterangan || '',
                                      kaskpd_pendamping: agenda.kaskpdPendampings?.map((kp: any) => kp.id_ka_skpd) || []
                                    });
                                    setIsEditingNotes(false);
                                    setShowDetailModal(true);
                                  }}
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
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Daftar Agenda ({filteredData.length})
            </h3>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                  <TableHead className="text-sm font-bold text-gray-900 text-center w-12 py-4">No.</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Kegiatan</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Tanggal & Waktu</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Pimpinan & Status</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      Tidak ada agenda terkonfirmasi yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
                {filteredData.map((agenda, index) => (
                  <TableRow key={agenda.id_agenda} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                    <TableCell className="text-center font-bold text-gray-400 text-xs">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm">{agenda.nama_kegiatan}</p>
                        <p className="text-xs text-gray-500">{agenda.lokasi_kegiatan}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      <p className="text-xs text-gray-500">{agenda.waktu_mulai} - {agenda.waktu_selesai}</p>
                      {/* Terlaksana indicator check */}
                      {(() => {
                        const agendaDateTime = new Date(agenda.tanggal_kegiatan);
                        if (agenda.waktu_mulai) {
                          const [hours, minutes] = agenda.waktu_mulai.split(':');
                          agendaDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
                        } else {
                          agendaDateTime.setHours(23, 59, 59, 999);
                        }
                        const isPast = agendaDateTime < now;
                        return isPast ? (
                          <span className="inline-block mt-1 text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                            SELESAI
                          </span>
                        ) : null;
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        {agenda.agendaPimpinans.map((ap: any, i: number) => (
                          <div key={i} className="flex flex-col border rounded-lg px-2 py-1 bg-gray-50 w-fit">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-medium">{ap.periodeJabatan?.pimpinan?.nama_pimpinan}</span>
                              {getStatusBadge(ap.status_kehadiran)}
                            </div>
                            </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-100 rounded-xl transition-all shadow-sm"
                        onClick={() => {
                        setSelectedAgenda(agenda);
                        setEditNotesForm({ 
                          contact_person: agenda.contact_person || '', 
                          keterangan: agenda.keterangan || '',
                          kaskpd_pendamping: agenda.kaskpdPendampings?.map((kp: any) => kp.id_ka_skpd) || []
                        });
                        setIsEditingNotes(false);
                        setShowDetailModal(true);
                      }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card >
      )
      }

      {/* Modal Add/Edit */}
      {
        showModal && (
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "flex w-full items-center justify-between px-4 py-2 bg-white border rounded-lg text-left text-sm transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none",
                              !formData.tanggal_surat && "text-gray-400"
                            )}
                          >
                            <span>{formData.tanggal_surat ? moment(formData.tanggal_surat).format('DD MMMM YYYY') : "Pilih tanggal"}</span>
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.tanggal_surat ? new Date(formData.tanggal_surat) : undefined}
                            onSelect={(date) => handleDateSelect('tanggal_surat', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal <span className="text-red-500">*</span></label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className={cn(
                                  "flex w-full items-center justify-between px-4 py-2 bg-white border rounded-lg text-left text-sm transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none",
                                  !formData.tanggal_kegiatan && "text-gray-400"
                                )}
                              >
                                <span>{formData.tanggal_kegiatan ? moment(formData.tanggal_kegiatan).format('DD MMMM YYYY') : "Pilih tanggal"}</span>
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={formData.tanggal_kegiatan ? new Date(formData.tanggal_kegiatan) : undefined}
                                onSelect={(date) => handleDateSelect('tanggal_kegiatan', date)}
                                initialFocus
                                disabled={(date) => {
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  return date <= today;
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mulai <span className="text-red-500">*</span></label>
                          <TimePicker
                            value={formData.waktu_mulai}
                            onChange={(val) => setFormData(prev => ({ ...prev, waktu_mulai: val }))}
                            placeholder="08:00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Selesai <span className="text-red-500">*</span></label>
                          <TimePicker
                            value={formData.waktu_selesai}
                            onChange={(val) => setFormData(prev => ({ ...prev, waktu_selesai: val }))}
                            placeholder="10:00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi <span className="text-red-500">*</span></label>
                        <input name="lokasi_kegiatan" value={formData.lokasi_kegiatan} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Surat <span className="text-red-500">*</span></label>
                        <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file && file.size > 5 * 1024 * 1024) {
                              toast.error('Error', 'Ukuran file surat permohonan maksimal 5 MB');
                              e.target.value = '';
                              setFormData(prev => ({ ...prev, file_surat: null }));
                            } else {
                              setFormData(prev => ({ ...prev, file_surat: file }));
                            }
                          }}
                          className="w-full text-sm border p-2 rounded-lg bg-white"
                          accept=".pdf"
                          required
                        />
                        <p className="text-[10px] text-gray-500">PDF maksimal 5 MB</p>
                        </div>
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
        )
      }

      {/* Modal Detail */}
      {
        showDetailModal && selectedAgenda && (
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
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kontak, Catatan & Pendamping</label>
                        {!isEditingNotes && (
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] text-blue-600 p-1" onClick={() => setIsEditingNotes(true)}>
                            <Edit2 className="w-3 h-3 mr-1" /> Edit
                          </Button>
                        )}
                      </div>
                      {isEditingNotes ? (
                        <div className="space-y-4 bg-blue-50/30 p-4 rounded-xl border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="grid gap-4">
                            <div className="relative group">
                              <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 block ml-1">Contact Person</label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                  type="text"
                                  className="w-full text-sm bg-white border border-blue-100 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none pl-9 pr-3 py-2 transition-all"
                                  value={editNotesForm.contact_person}
                                  onChange={e => setEditNotesForm(prev => ({ ...prev, contact_person: e.target.value }))}
                                  placeholder="Nama CP & No. Telp (Opsional)"
                                />
                              </div>
                            </div>

                            <div className="relative group">
                              <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 block ml-1">Catatan Tambahan</label>
                              <div className="relative">
                                <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
                                <textarea
                                  className="w-full text-sm bg-white border border-blue-100 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none pl-9 pr-3 py-2 min-h-[80px] transition-all"
                                  value={editNotesForm.keterangan}
                                  onChange={e => setEditNotesForm(prev => ({ ...prev, keterangan: e.target.value }))}
                                  placeholder="Tambahkan catatan khusus sespri di sini..."
                                />
                              </div>
                            </div>

                            <div className="group">
                              <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 block ml-1">KaSKPD Pendamping</label>
                              <MultiSelect
                                value={editNotesForm.kaskpd_pendamping}
                                onChange={(vals) => setEditNotesForm(prev => ({ ...prev, kaskpd_pendamping: vals }))}
                                options={kaskpdList.map(k => ({ value: k.id_ka_skpd, label: k.nama_instansi }))}
                                placeholder="Pilih instansi pendamping..."
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2 border-t border-blue-100/50">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-xs font-medium text-gray-500 hover:bg-gray-100" 
                              onClick={() => {
                                setIsEditingNotes(false);
                                setEditNotesForm({
                                  contact_person: selectedAgenda.contact_person || '',
                                  keterangan: selectedAgenda.keterangan || '',
                                  kaskpd_pendamping: selectedAgenda.kaskpdPendampings?.map((kp: any) => kp.id_ka_skpd) || []
                                });
                              }}
                            >
                              Batal
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 px-4" 
                              onClick={handleSaveNotes}
                            >
                              Simpan Perubahan
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                          <div className="grid grid-cols-1 gap-4">
                            {/* CP Row */}
                            <div className="flex items-center gap-3 group">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <Phone className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Contact Person</p>
                                <p className="text-sm font-semibold text-gray-800">{selectedAgenda.contact_person || 'Tidak ada kontak'}</p>
                              </div>
                            </div>

                            {/* Notes Row */}
                            <div className="flex items-start gap-3 group">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 mt-0.5">
                                <FileText className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Catatan Khusus</p>
                                <p className="text-sm text-gray-700 leading-relaxed font-normal">
                                  {selectedAgenda.keterangan || <span className="italic text-gray-400">Belum ada catatan tambahan</span>}
                                </p>
                              </div>
                            </div>

                            {/* KASKPD Row */}
                            <div className="flex items-start gap-3 group border-t border-gray-100 pt-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 mt-0.5">
                                <Building className="w-4 h-4 text-amber-600 group-hover:text-white transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">KaSKPD Pendamping</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {selectedAgenda.kaskpdPendampings && selectedAgenda.kaskpdPendampings.length > 0 ? (
                                    selectedAgenda.kaskpdPendampings.map((kp: any) => (
                                      <Badge 
                                        key={kp.id_ka_skpd} 
                                        variant="secondary" 
                                        className="bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:text-amber-700 transition-all font-medium py-1 px-2.5 rounded-full shadow-sm"
                                      >
                                        {kp.kaskpd?.nama_instansi}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm italic text-gray-400">Belum ada instansi pendamping</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">Status:</span>
                            {getStatusBadge(ap.status_kehadiran)}
                          </div>
                          {ap.status_kehadiran === 'diwakilkan' && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Diwakili oleh: {ap.nama_perwakilan}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


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