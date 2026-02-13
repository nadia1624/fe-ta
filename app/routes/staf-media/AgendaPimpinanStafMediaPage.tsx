import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eye, Calendar, X, Search, Filter, List, CalendarDays } from 'lucide-react';

export default function AgendaPimpinanStafMediaPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPimpinan, setFilterPimpinan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const agendaList = [
    {
      id: 1,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      tanggal: '2026-02-10',
      waktu_mulai: '09:00',
      waktu_selesai: '12:00',
      tempat: 'Ruang Rapat Utama Kantor Walikota',
      keterangan: 'Rapat koordinasi rutin dengan seluruh kepala OPD',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      nomor_surat: '012/SP/II/2026',
      perihal: 'Permohonan kehadiran Walikota dalam Rapat Koordinasi OPD'
    },
    {
      id: 2,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      tanggal: '2026-02-12',
      waktu_mulai: '10:00',
      waktu_selesai: '11:30',
      tempat: 'Kantor Dinas Kesehatan',
      keterangan: 'Monitoring program vaksinasi dan kesehatan masyarakat',
      status: 'Terkonfirmasi',
      sumber: 'Permohonan',
      nomor_surat: '013/SP/II/2026',
      perihal: 'Permohonan kunjungan kerja Walikota'
    },
    {
      id: 3,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Pembukaan Festival Seni Budaya',
      tanggal: '2026-02-15',
      waktu_mulai: '08:00',
      waktu_selesai: '10:00',
      tempat: 'Lapangan Utama Kota',
      keterangan: 'Acara pembukaan festival seni dan budaya daerah',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      nomor_surat: '014/SP/II/2026',
      perihal: 'Undangan pembukaan Festival Seni Budaya'
    },
    {
      id: 4,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Rapat dengan DPRD',
      tanggal: '2026-02-08',
      waktu_mulai: '13:00',
      waktu_selesai: '16:00',
      tempat: 'Gedung DPRD',
      keterangan: 'Rapat pembahasan APBD 2026',
      status: 'Selesai',
      sumber: 'Sespri Input',
      nomor_surat: '010/SP/II/2026',
      perihal: 'Rapat pembahasan APBD dengan DPRD'
    },
    {
      id: 5,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Audiensi dengan Tokoh Masyarakat',
      tanggal: '2026-02-20',
      waktu_mulai: '14:00',
      waktu_selesai: '15:30',
      tempat: 'Kantor Walikota',
      keterangan: 'Mendengarkan aspirasi masyarakat terkait pembangunan',
      status: 'Terkonfirmasi',
      sumber: 'Permohonan',
      nomor_surat: '015/SP/II/2026',
      perihal: 'Permohonan audiensi dengan Wakil Walikota'
    },
    {
      id: 6,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Peresmian Gedung RSUD',
      tanggal: '2026-02-05',
      waktu_mulai: '09:00',
      waktu_selesai: '12:00',
      tempat: 'RSUD Kota',
      keterangan: 'Peresmian gedung baru RSUD',
      status: 'Selesai',
      sumber: 'Sespri Input',
      nomor_surat: '011/SP/II/2026',
      perihal: 'Peresmian infrastruktur RSUD'
    },
    {
      id: 7,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Launching Program Smart City',
      tanggal: '2026-02-05',
      waktu_mulai: '19:00',
      waktu_selesai: '21:00',
      tempat: 'Gedung Serbaguna',
      keterangan: 'Peluncuran program smart city',
      status: 'Selesai',
      sumber: 'Sespri Input',
      nomor_surat: '009/SP/II/2026',
      perihal: 'Launching program digitalisasi kota'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Terkonfirmasi':
        return <Badge variant="success">Terkonfirmasi</Badge>;
      case 'Selesai':
        return <Badge>Selesai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDetail = (agenda: any) => {
    setSelectedAgenda(agenda);
    setShowDetailModal(true);
  };

  const filteredAgenda = agendaList.filter(agenda => {
    const matchesSearch = 
      agenda.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agenda.pimpinan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agenda.tempat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agenda.nomor_surat && agenda.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPimpinan = filterPimpinan === 'all' || agenda.pimpinan === filterPimpinan;
    const matchesStatus = filterStatus === 'all' || agenda.status === filterStatus;
    
    return matchesSearch && matchesPimpinan && matchesStatus;
  });

  const pimpinanList = Array.from(new Set(agendaList.map(a => a.pimpinan)));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAgendaForDate = (day: number) => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredAgenda.filter(agenda => agenda.tanggal === dateStr);
  };

  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(selectedDate);
  const firstDay = getFirstDayOfMonth(selectedDate);
  const monthName = selectedDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  const statsTerkonfirmasi = agendaList.filter(a => a.status === 'Terkonfirmasi').length;
  const statsSelesai = agendaList.filter(a => a.status === 'Selesai').length;

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Agenda Pimpinan</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Lihat jadwal agenda pimpinan (Read Only)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Agenda</p>
                <p className="text-2xl md:text-3xl font-semibold text-purple-600">{agendaList.length}</p>
              </div>
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Terkonfirmasi</p>
                <p className="text-2xl md:text-3xl font-semibold text-green-600">{statsTerkonfirmasi}</p>
              </div>
              <CalendarDays className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Selesai</p>
                <p className="text-2xl md:text-3xl font-semibold text-gray-600">{statsSelesai}</p>
              </div>
              <CalendarDays className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Daftar Agenda ({filteredAgenda.length})
            </h3>
            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-2 md:gap-3">
              <div className="relative flex-1 md:flex-none md:w-56">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari agenda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterPimpinan}
                    onChange={(e) => setFilterPimpinan(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm appearance-none bg-white"
                  >
                    <option value="all">Semua Pimpinan</option>
                    {pimpinanList.map((p, idx) => (
                      <option key={idx} value={p}>{p.split(' ')[0]}...</option>
                    ))}
                  </select>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm appearance-none bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="Terkonfirmasi">Terkonfirmasi</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {viewMode === 'calendar' ? (
            <div className="p-4 md:p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  ← Prev
                </button>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 capitalize">{monthName}</h3>
                <button
                  onClick={nextMonth}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Next →
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {/* Days header */}
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                  <div key={day} className="text-center font-semibold text-xs md:text-sm text-gray-600 py-2">
                    {day}
                  </div>
                ))}

                {/* Empty cells for first week */}
                {Array.from({ length: firstDay }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const agendas = getAgendaForDate(day);
                  const hasAgenda = agendas.length > 0;
                  const isToday =
                    day === new Date().getDate() &&
                    selectedDate.getMonth() === new Date().getMonth() &&
                    selectedDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={day}
                      className={`aspect-square border rounded-lg p-1 md:p-2 ${
                        isToday ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                      } ${hasAgenda ? 'bg-green-50' : 'bg-white'}`}
                    >
                      <div className="text-xs md:text-sm font-semibold text-gray-900 mb-1">{day}</div>
                      {agendas.map((agenda, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-1 py-0.5 rounded mb-1 truncate cursor-pointer ${
                            agenda.status === 'Terkonfirmasi'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => handleDetail(agenda)}
                          title={`${agenda.waktu_mulai} - ${agenda.judul_kegiatan}`}
                        >
                          {agenda.waktu_mulai} {agenda.judul_kegiatan.substring(0, 15)}...
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center gap-4 md:gap-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-green-100 border border-green-300"></div>
                  <span className="text-xs md:text-sm text-gray-700">Terkonfirmasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-gray-100 border border-gray-300"></div>
                  <span className="text-xs md:text-sm text-gray-700">Selesai</span>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop Table View */
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pimpinan</TableHead>
                    <TableHead>Kegiatan</TableHead>
                    <TableHead>Tanggal & Waktu</TableHead>
                    <TableHead>Tempat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgenda.map((agenda) => (
                    <TableRow key={agenda.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{agenda.pimpinan}</p>
                          <p className="text-xs text-gray-500">{agenda.jabatan}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{agenda.judul_kegiatan}</p>
                          {agenda.nomor_surat && (
                            <p className="text-xs text-gray-500">{agenda.nomor_surat}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(agenda.tanggal).toLocaleDateString('id-ID', {
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
                        <p className="text-sm">{agenda.tempat}</p>
                      </TableCell>
                      <TableCell>{getStatusBadge(agenda.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Button variant="ghost" size="sm" onClick={() => handleDetail(agenda)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAgenda.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Tidak ada agenda yang ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Mobile List View (always list, not calendar) */}
          {viewMode === 'list' && (
            <div className="md:hidden divide-y divide-gray-200">
              {filteredAgenda.map((agenda) => (
                <div key={agenda.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{agenda.judul_kegiatan}</h4>
                        <p className="text-xs text-gray-600">{agenda.pimpinan} · {agenda.jabatan}</p>
                      </div>
                      {getStatusBadge(agenda.status)}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>📅 {new Date(agenda.tanggal).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })} · 🕒 {agenda.waktu_mulai} - {agenda.waktu_selesai}</p>
                      <p>📍 {agenda.tempat}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleDetail(agenda)}>
                      <Eye className="w-3 h-3 mr-2" />
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              ))}
              {filteredAgenda.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Tidak ada agenda yang ditemukan
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedAgenda && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Detail Agenda</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {/* Informasi Surat */}
                {selectedAgenda.nomor_surat && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Informasi Surat</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Nomor Surat</label>
                        <p className="text-sm text-gray-900">{selectedAgenda.nomor_surat}</p>
                      </div>
                      {selectedAgenda.perihal && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Perihal</label>
                          <p className="text-sm text-gray-900">{selectedAgenda.perihal}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Informasi Pimpinan */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Pimpinan</label>
                  <p className="text-base font-semibold text-gray-900">{selectedAgenda.pimpinan}</p>
                  <p className="text-sm text-gray-600">{selectedAgenda.jabatan}</p>
                </div>

                {/* Kegiatan */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Kegiatan</label>
                  <p className="text-base text-gray-900">{selectedAgenda.judul_kegiatan}</p>
                </div>

                {/* Tanggal & Waktu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Tanggal</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedAgenda.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Waktu</label>
                    <p className="text-sm text-gray-900">
                      {selectedAgenda.waktu_mulai} - {selectedAgenda.waktu_selesai}
                    </p>
                  </div>
                </div>

                {/* Tempat */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Tempat</label>
                  <p className="text-sm text-gray-900">{selectedAgenda.tempat}</p>
                </div>

                {/* Keterangan */}
                {selectedAgenda.keterangan && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Keterangan</label>
                    <p className="text-sm text-gray-900">{selectedAgenda.keterangan}</p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Status</label>
                  {getStatusBadge(selectedAgenda.status)}
                </div>

                {/* Sumber */}
                {selectedAgenda.sumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Sumber</label>
                    <p className="text-sm text-gray-900">{selectedAgenda.sumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
