import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eye, Calendar, X, Search, Filter, List, CalendarDays } from 'lucide-react';

export default function AgendaPimpinanPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPimpinan, setFilterPimpinan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Data agenda (TIDAK ADA status "Menunggu Konfirmasi" - hanya Terkonfirmasi dan Selesai)
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
      created_by: 'Sespri - Ahmad',
      nomor_surat: '012/SP/II/2026',
      perihal: 'Permohonan kehadiran Walikota dalam Rapat Koordinasi OPD',
      pemohon: 'Kepala Bappeda',
      instansi: 'Bappeda Kota'
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
      created_by: 'Kepala Dinas Kesehatan',
      nomor_surat: '013/SP/II/2026',
      perihal: 'Permohonan kunjungan kerja Walikota',
      pemohon: 'Kepala Dinas Kesehatan',
      instansi: 'Dinas Kesehatan Kota'
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
      created_by: 'Sespri - Ahmad',
      nomor_surat: '014/SP/II/2026',
      perihal: 'Undangan pembukaan Festival Seni Budaya',
      pemohon: 'Dinas Pariwisata',
      instansi: 'Dinas Pariwisata dan Kebudayaan'
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
      created_by: 'Sespri - Ahmad',
      nomor_surat: '010/SP/II/2026',
      perihal: 'Rapat pembahasan APBD dengan DPRD',
      pemohon: 'Ketua DPRD',
      instansi: 'DPRD Kota'
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
      created_by: 'RT 05 Kelurahan Maju',
      nomor_surat: '015/SP/II/2026',
      perihal: 'Permohonan audiensi dengan Wakil Walikota',
      pemohon: 'RT 05 Kelurahan Maju',
      instansi: 'Kelurahan Maju'
    },
    {
      id: 6,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Upacara Bendera',
      tanggal: '2026-02-02',
      waktu_mulai: '07:30',
      waktu_selesai: '08:30',
      tempat: 'Halaman Kantor Walikota',
      keterangan: 'Upacara bendera rutin setiap Senin',
      status: 'Selesai',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad',
      nomor_surat: '008/SP/II/2026',
      perihal: 'Agenda rutin upacara bendera',
      pemohon: 'Bagian Protokol',
      instansi: 'Setda Kota'
    },
    {
      id: 7,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Peresmian Jembatan Baru',
      tanggal: '2026-02-06',
      waktu_mulai: '09:00',
      waktu_selesai: '10:30',
      tempat: 'Jembatan Sungai Jernih',
      keterangan: 'Peresmian jembatan penghubung antar desa',
      status: 'Selesai',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad',
      nomor_surat: '009/SP/II/2026',
      perihal: 'Peresmian infrastruktur jembatan',
      pemohon: 'Dinas PU',
      instansi: 'Dinas Pekerjaan Umum'
    },
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

  // Filter & Search
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

  // Get unique pimpinan for filter
  const pimpinanList = Array.from(new Set(agendaList.map(a => a.pimpinan)));

  // Calendar functions
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

  // Stats
  const statsTerkonfirmasi = agendaList.filter(a => a.status === 'Terkonfirmasi').length;
  const statsSelesai = agendaList.filter(a => a.status === 'Selesai').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Agenda Pimpinan</h1>
        <p className="text-sm text-gray-600 mt-1">Lihat jadwal agenda pimpinan (Read Only)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agenda</p>
                <p className="text-3xl font-semibold text-purple-600">{agendaList.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terkonfirmasi</p>
                <p className="text-3xl font-semibold text-green-600">{statsTerkonfirmasi}</p>
              </div>
              <CalendarDays className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-3xl font-semibold text-gray-600">{statsSelesai}</p>
              </div>
              <CalendarDays className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Agenda ({filteredAgenda.length})
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari agenda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterPimpinan}
                  onChange={(e) => setFilterPimpinan(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm appearance-none bg-white"
                >
                  <option value="all">Semua Pimpinan</option>
                  {pimpinanList.map((p, idx) => (
                    <option key={idx} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm appearance-none bg-white"
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
            <div className="p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Prev
                </button>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">{monthName}</h3>
                <button
                  onClick={nextMonth}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Next →
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Days header */}
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                  <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
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
                      className={`aspect-square border rounded-lg p-2 ${
                        isToday ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                      } ${hasAgenda ? 'bg-green-50' : 'bg-white'}`}
                    >
                      <div className="text-sm font-semibold text-gray-900 mb-1">{day}</div>
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
              <div className="mt-6 flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
                  <span className="text-sm text-gray-700">Terkonfirmasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
                  <span className="text-sm text-gray-700">Selesai</span>
                </div>
              </div>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedAgenda && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                {/* Informasi Surat (jika ada) */}
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

                {/* Informasi Pemohon */}
                {selectedAgenda.pemohon && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Informasi Pemohon</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Nama Pemohon</label>
                        <p className="text-sm text-gray-900">{selectedAgenda.pemohon}</p>
                      </div>
                      {selectedAgenda.instansi && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Instansi</label>
                          <p className="text-sm text-gray-900">{selectedAgenda.instansi}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Informasi Pimpinan */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Pimpinan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.pimpinan}</p>
                  <p className="text-xs text-gray-600">{selectedAgenda.jabatan}</p>
                </div>

                {/* Judul Kegiatan */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Judul Kegiatan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.judul_kegiatan}</p>
                </div>

                {/* Tanggal & Waktu */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedAgenda.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Waktu</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedAgenda.waktu_mulai} - {selectedAgenda.waktu_selesai}
                    </p>
                  </div>
                </div>

                {/* Tempat */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Tempat</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.tempat}</p>
                </div>

                {/* Keterangan */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Keterangan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.keterangan}</p>
                </div>

                {/* Status & Sumber */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedAgenda.status)}</div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                    Tutup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
