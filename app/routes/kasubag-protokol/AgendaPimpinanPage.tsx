import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Eye, Calendar, X, Search, Filter, List,
  CalendarDays, RefreshCw, CheckCircle, Clock, FileText
} from 'lucide-react';
import { agendaApi } from '../../lib/api';

export default function AgendaPimpinanPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [loading, setLoading] = useState(true);
  const [agendaList, setAgendaList] = useState<any[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPimpinan, setFilterPimpinan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await agendaApi.getLeaderAgendas({});
      if (res.success && res.data) {
        // Hanya tampilkan agenda yang punya minimal 1 pimpinan terkonfirmasi (hadir/diwakilkan)
        const confirmed = res.data.filter((agenda: any) =>
          agenda.agendaPimpinans?.some((ap: any) =>
            ap.status_kehadiran === 'hadir' || ap.status_kehadiran === 'diwakilkan'
          )
        );
        setAgendaList(confirmed);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(i);
    return days;
  };

  const getAgendaForDate = (day: number) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredData.filter(a => a.tanggal_kegiatan === dateStr);
  };

  const changeMonth = (dir: number) => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + dir);
    setSelectedDate(d);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hadir': return <Badge variant="success">Hadir</Badge>;
      case 'tidak_hadir': return <Badge variant="danger">Tidak Hadir</Badge>;
      case 'diwakilkan': return <Badge variant="info">Diwakilkan</Badge>;
      default: return <Badge variant="secondary">Belum Diatur</Badge>;
    }
  };

  // Extract unique pimpinan options from agenda list
  const pimpinanOptions: any[] = [];
  const seen = new Set();
  agendaList.forEach(a => {
    a.agendaPimpinans?.forEach((ap: any) => {
      const key = `${ap.id_jabatan}:${ap.id_periode}`;
      if (!seen.has(key)) {
        seen.add(key);
        pimpinanOptions.push(ap);
      }
    });
  });

  // Deklarasikan 'now' sebelum digunakan oleh filteredData
  const now = new Date();

  const filteredData = agendaList.filter(item => {
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

  // KPI Calculations
  const statsTotal = agendaList.length;
  let statsTerlaksana = 0;
  let statsBelum = 0;

  agendaList.forEach(a => {
    // Gabungkan tanggal kegiatan dengan waktu mulai
    // Asumsi waktu_mulai berupa string "HH:mm" atau "HH:mm:ss"
    const agendaDateTime = new Date(a.tanggal_kegiatan);
    if (a.waktu_mulai) {
      const [hours, minutes] = a.waktu_mulai.split(':');
      agendaDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    } else {
      // Jika tidak ada waktu mulai, fallback bandingkan hari
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
          <p className="text-sm text-gray-600 mt-1">Jadwal agenda pimpinan yang sudah terkonfirmasi</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors ${viewMode === 'calendar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'}`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Kalender</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors ${viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'}`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Agenda</p>
                <p className="text-2xl font-semibold text-blue-600">{statsTotal}</p>
              </div>
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Terlaksana</p>
                <p className="text-2xl font-semibold text-green-600">{statsTerlaksana}</p>
              </div>
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Belum Terlaksana</p>
                <p className="text-2xl font-semibold text-yellow-600">{statsBelum}</p>
              </div>
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari agenda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterPimpinan}
                  onChange={(e) => setFilterPimpinan(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white w-full sm:w-auto focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">Semua Pimpinan</option>
                  {pimpinanOptions.map(ap => (
                    <option key={`${ap.id_jabatan}:${ap.id_periode}`} value={`${ap.id_jabatan}:${ap.id_periode}`}>
                      {ap.periodeJabatan?.jabatan?.nama_jabatan} - {ap.periodeJabatan?.pimpinan?.nama_pimpinan}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white w-full sm:w-auto focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="terlaksana">Terlaksana</option>
                  <option value="belum">Belum Terlaksana</option>
                </select>
              </div>
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
        /* ====== CALENDAR VIEW ====== */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 capitalize">
                {selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>←</Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>Hari Ini</Button>
                <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>→</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 md:p-6 overflow-x-auto">
            <div className="min-w-[600px] md:min-w-0 p-3 md:p-0">
              <div className="grid grid-cols-7 gap-1 md:gap-2 text-center font-semibold text-xs text-gray-400 mb-2 uppercase tracking-wide">
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
                      className={`min-h-[80px] md:min-h-[110px] border rounded-lg p-1 md:p-2 ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                        } ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                    >
                      {day && (
                        <>
                          <div className={`text-xs font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                            {day}
                          </div>
                          <div className="space-y-0.5">
                            {agendas.slice(0, 3).map((agenda) => {
                              let color = 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50';
                              let attendeeName = '';

                              if (agenda.agendaPimpinans?.length > 0) {
                                const hasTidakHadir = agenda.agendaPimpinans.some((l: any) => l.status_kehadiran === 'tidak_hadir');
                                const delegated = agenda.agendaPimpinans.find((l: any) => l.status_kehadiran === 'diwakilkan');
                                const present = agenda.agendaPimpinans.find((l: any) => l.status_kehadiran === 'hadir');

                                if (hasTidakHadir) color = 'bg-red-50/50 text-red-600 border-red-100 hover:bg-red-50';
                                else if (present) color = 'bg-green-50/50 text-green-600 border-green-100 hover:bg-green-50';
                                else if (delegated) color = 'bg-blue-50/50 text-blue-600 border-blue-100 hover:bg-blue-50';

                                if (present) attendeeName = present.periodeJabatan?.pimpinan?.nama_pimpinan || '';
                                else if (delegated) attendeeName = delegated.nama_perwakilan || 'Diwakilkan';
                              }

                              return (
                                <div
                                  key={agenda.id_agenda}
                                  onClick={() => { setSelectedAgenda(agenda); setShowDetailModal(true); }}
                                  className={`text-[10px] p-1 md:p-1.5 rounded cursor-pointer truncate border transition-colors ${color}`}
                                  title={`${agenda.nama_kegiatan}${attendeeName ? ' - ' + attendeeName : ''}`}
                                >
                                  <strong>{agenda.waktu_mulai?.slice(0, 5)}</strong> {agenda.nama_kegiatan}
                                  {attendeeName && (
                                    <div className="mt-0.5 text-[9px] font-medium opacity-75 border-t border-black/10 pt-0.5 truncate">
                                      {attendeeName}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {agendas.length > 3 && (
                              <div className="text-[10px] text-gray-400 font-medium">+{agendas.length - 3} lainnya</div>
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
          <div className="bg-white rounded-b-xl border-t px-4 py-3">
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-50 border border-green-200" /> Hadir</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-50 border border-blue-200" /> Diwakilkan</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-50 border border-red-200" /> Tidak Hadir</div>
            </div>
          </div>
        </Card>
      ) : (
        /* ====== LIST VIEW — card-based, mobile-friendly ====== */
        <Card>
          <CardHeader>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Daftar Agenda ({filteredData.length})
            </h3>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
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
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      Tidak ada agenda terkonfirmasi yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
                {filteredData.map((agenda) => (
                  <TableRow key={agenda.id_agenda}>
                    <TableCell>
                      <p className="font-semibold text-sm">{agenda.nama_kegiatan}</p>
                      <p className="text-xs text-gray-500">{agenda.lokasi_kegiatan}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">
                        {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-500">{agenda.waktu_mulai?.slice(0, 5)} - {agenda.waktu_selesai?.slice(0, 5)}</p>
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
                        {agenda.agendaPimpinans?.map((ap: any, i: number) => (
                          <div key={i} className="flex flex-col border rounded-lg px-2 py-1 bg-gray-50 w-fit">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-medium">{ap.periodeJabatan?.pimpinan?.nama_pimpinan}</span>
                              {getStatusBadge(ap.status_kehadiran)}
                            </div>
                            {ap.status_kehadiran === 'diwakilkan' && ap.surat_disposisi && (
                              <a
                                href={`http://localhost:3000/${ap.surat_disposisi.replace(/\\/g, '/')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] flex items-center gap-1 text-blue-600 hover:underline mt-1 w-fit"
                              >
                                <FileText className="w-3 h-3" /> Surat Disposisi
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedAgenda(agenda); setShowDetailModal(true); }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )
      }

      {/* Detail Modal */}
      {
        showDetailModal && selectedAgenda && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Detail Agenda</h3>
                  <button onClick={() => setShowDetailModal(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Kiri */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kegiatan</label>
                      <p className="text-sm font-semibold">{selectedAgenda.nama_kegiatan}</p>
                      <p className="text-xs text-gray-500">{selectedAgenda.perihal}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu & Tempat</label>
                      <p className="text-sm">
                        {new Date(selectedAgenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm font-medium">
                        {selectedAgenda.waktu_mulai?.slice(0, 5)} - {selectedAgenda.waktu_selesai?.slice(0, 5)} WIB
                      </p>
                      <p className="text-sm">{selectedAgenda.lokasi_kegiatan}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pemohon</label>
                      <p className="text-sm font-medium">{selectedAgenda.pemohon?.nama || '-'}</p>
                      <p className="text-xs text-gray-500">{selectedAgenda.pemohon?.instansi}</p>
                    </div>
                    {(selectedAgenda.contact_person || selectedAgenda.keterangan) && (
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Catatan Sespri</label>
                        {selectedAgenda.contact_person && (
                          <p className="text-sm font-medium">CP: {selectedAgenda.contact_person}</p>
                        )}
                        {selectedAgenda.keterangan && (
                          <p className="text-sm">Catatan: {selectedAgenda.keterangan}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Kanan */}
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
                              <p className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                Diwakili oleh: {ap.nama_perwakilan}
                              </p>
                              {ap.surat_disposisi && (
                                <a
                                  href={`http://localhost:3000/${ap.surat_disposisi.replace(/\\/g, '/')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] flex items-center gap-1 text-blue-600 hover:underline mt-1"
                                >
                                  <FileText className="w-3 h-3" /> Lihat Disposisi
                                </a>
                              )}
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
        )
      }
    </div >
  );
}