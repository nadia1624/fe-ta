import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar, List, CalendarDays, Eye, X, Search, Filter, User, CheckCircle, Clock } from 'lucide-react';

export default function AgendaPimpinanPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Informasi Ajudan yang sedang login (1 Ajudan = 1 Pimpinan)
  const ajudanInfo = {
    nama: 'Mayor Arif Wibowo',
    jabatan: 'Ajudan Walikota',
    pimpinan: {
      nama: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota'
    }
  };

  // Data agenda - SEMUA agenda
  const allAgenda = [
    {
      id: 1,
      nomor_surat: '012/SP/II/2026',
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      perihal: 'Permohonan kehadiran Walikota dalam Rapat Koordinasi OPD',
      pemohon: 'Kepala Bappeda',
      instansi: 'Bappeda Kota',
      tanggal_kegiatan: '2026-02-10',
      waktu_mulai: '09:00',
      waktu_selesai: '12:00',
      tempat: 'Ruang Rapat Utama Kantor Walikota',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan_pimpinan: 'Walikota',
      keterangan: 'Rapat koordinasi rutin dengan seluruh kepala OPD',
      status: 'Terkonfirmasi',
      status_kehadiran: 'Hadir',
      status_pelaksanaan: 'Terlaksana',
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
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan_pimpinan: 'Walikota',
      keterangan: 'Monitoring program vaksinasi dan kesehatan masyarakat',
      status: 'Terkonfirmasi',
      status_kehadiran: 'Diwakilkan', // TIDAK DITAMPILKAN - agenda sudah bukan milik pimpinan
      perwakilan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan_perwakilan: 'Wakil Walikota',
      status_pelaksanaan: 'Belum Terlaksana',
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
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan_pimpinan: 'Wakil Walikota',
      keterangan: 'Dialog tentang pembangunan daerah dan peluang kerja',
      status: 'Terkonfirmasi',
      status_kehadiran: 'Hadir',
      status_pelaksanaan: 'Belum Terlaksana',
      tanggal_surat: '2026-02-08'
    },
    {
      id: 4,
      nomor_surat: '018/SP/II/2026',
      judul_kegiatan: 'Peresmian Jalan Tol Baru',
      perihal: 'Permohonan kehadiran Walikota dalam Peresmian Jalan Tol',
      pemohon: 'Direktur PT Jasa Marga',
      instansi: 'PT Jasa Marga Regional III',
      tanggal_kegiatan: '2026-02-16',
      waktu_mulai: '08:00',
      waktu_selesai: '10:00',
      tempat: 'Gerbang Tol Sukamaju',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan_pimpinan: 'Walikota',
      keterangan: 'Peresmian infrastruktur jalan tol baru',
      status: 'Terkonfirmasi',
      status_kehadiran: 'Hadir',
      status_pelaksanaan: 'Belum Terlaksana',
      tanggal_surat: '2026-02-07'
    },
    {
      id: 5,
      nomor_surat: '020/SP/II/2026',
      judul_kegiatan: 'Rapat Koordinasi Sekda dengan OPD',
      perihal: 'Permohonan kehadiran Sekda',
      pemohon: 'Asisten Pemerintahan',
      instansi: 'Setda Kota',
      tanggal_kegiatan: '2026-02-18',
      waktu_mulai: '09:00',
      waktu_selesai: '11:00',
      tempat: 'Ruang Rapat Sekda',
      pimpinan: 'Dr. Budi Santoso, M.M',
      jabatan_pimpinan: 'Sekretaris Daerah',
      keterangan: 'Rapat koordinasi program kerja OPD',
      status: 'Terkonfirmasi',
      status_kehadiran: 'Hadir',
      status_pelaksanaan: 'Belum Terlaksana',
      tanggal_surat: '2026-02-09'
    },
    {
      id: 6,
      nomor_surat: '022/SP/II/2026',
      judul_kegiatan: 'Pelantikan Kepala Dinas',
      perihal: 'Permohonan kehadiran Walikota',
      pemohon: 'Kepala BKD',
      instansi: 'Badan Kepegawaian Daerah',
      tanggal_kegiatan: '2026-02-20',
      waktu_mulai: '10:00',
      waktu_selesai: '12:00',
      tempat: 'Aula Kantor Walikota',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan_pimpinan: 'Walikota',
      keterangan: 'Pelantikan kepala dinas periode 2026-2029',
      status: 'Terkonfirmasi',
      status_kehadiran: 'Hadir',
      status_pelaksanaan: 'Belum Terlaksana',
      tanggal_surat: '2026-02-10'
    },
    {
      id: 7,
      nomor_surat: '008/SP/II/2026',
      judul_kegiatan: 'Launching Program Smart City',
      perihal: 'Permohonan kehadiran Walikota',
      pemohon: 'Kepala Diskominfo',
      instansi: 'Dinas Komunikasi dan Informatika',
      tanggal_kegiatan: '2026-02-08',
      waktu_mulai: '09:00',
      waktu_selesai: '11:00',
      tempat: 'Gedung Serbaguna',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan_pimpinan: 'Walikota',
      keterangan: 'Peluncuran program smart city tahun 2026',
      status: 'Terkonfirmasi',
      status_kehadiran: 'Hadir',
      status_pelaksanaan: 'Terlaksana',
      tanggal_surat: '2026-02-03'
    },
  ];

  // Filter agenda:
  // 1. Hanya untuk pimpinan yang dipegang ajudan
  // 2. Hanya yang status_kehadiran = "Hadir" (bukan "Diwakilkan")
  const agendaPimpinan = allAgenda.filter(
    agenda =>
      agenda.pimpinan === ajudanInfo.pimpinan.nama &&
      agenda.status_kehadiran === 'Hadir' // HANYA yang HADIR, BUKAN Diwakilkan
  );

  const handleDetail = (agenda: any) => {
    setSelectedAgenda(agenda);
    setShowDetailModal(true);
  };

  // Filter dan Search
  const filteredAgenda = agendaPimpinan.filter(agenda => {
    const matchSearch =
      agenda.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agenda.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agenda.pemohon.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'all' || agenda.status_pelaksanaan === filterStatus;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Terkonfirmasi':
        return <Badge variant="success">Terkonfirmasi</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Ditolak':
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPelaksanaanBadge = (pelaksanaan: string) => {
    switch (pelaksanaan) {
      case 'Terlaksana':
        return (
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <Badge variant="success">Terlaksana</Badge>
          </div>
        );
      case 'Belum Terlaksana':
        return (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-orange-600" />
            <Badge variant="warning">Belum Terlaksana</Badge>
          </div>
        );
      default:
        return <Badge>{pelaksanaan}</Badge>;
    }
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAgendaForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredAgenda.filter(agenda => agenda.tanggal_kegiatan === dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Agenda Pimpinan</h1>
        <p className="text-sm text-gray-600 mt-1">Lihat jadwal agenda pimpinan yang Anda dampingi (hanya agenda yang dihadiri)</p>
      </div>

      {/* Banner Info Pimpinan yang Dipegang */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Menampilkan agenda untuk:</p>
              <p className="text-lg font-bold text-gray-900">{ajudanInfo.pimpinan.nama}</p>
              <p className="text-sm text-blue-700 font-semibold">{ajudanInfo.pimpinan.jabatan}</p>
              <p className="text-xs text-gray-500 mt-1">* Hanya agenda yang dihadiri pimpinan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agenda</p>
                <p className="text-2xl font-semibold text-blue-600">{agendaPimpinan.length}</p>
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
                  {agendaPimpinan.filter(a => a.status_pelaksanaan === 'Terlaksana').length}
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
                  {agendaPimpinan.filter(a => a.status_pelaksanaan === 'Belum Terlaksana').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Jadwal Agenda ({filteredAgenda.length})</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari agenda..."
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
                  <option value="Terlaksana">Terlaksana</option>
                  <option value="Belum Terlaksana">Belum Terlaksana</option>
                </select>
              </div>
              <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 rounded ${viewMode === 'calendar'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded ${viewMode === 'list'
                    ? 'bg-blue-600 text-white'
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
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={day}
                      className={`aspect-square border rounded-lg p-2 ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        } ${hasAgenda ? 'bg-green-50' : 'bg-white'}`}
                    >
                      <div className="text-sm font-semibold text-gray-900 mb-1">{day}</div>
                      {agendas.map((agenda, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-1 py-0.5 rounded mb-1 truncate cursor-pointer flex items-center gap-1 ${agenda.status_pelaksanaan === 'Terlaksana'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                            }`}
                          onClick={() => handleDetail(agenda)}
                          title={agenda.judul_kegiatan}
                        >
                          {agenda.status_pelaksanaan === 'Terlaksana' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {agenda.waktu_mulai} {agenda.judul_kegiatan}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
                  <span className="text-xs text-gray-700">Terlaksana</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300"></div>
                  <span className="text-xs text-gray-700">Belum Terlaksana</span>
                </div>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor Surat</TableHead>
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Pemohon</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pelaksanaan</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgenda.map((agenda) => (
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
                    <TableCell>{getStatusBadge(agenda.status)}</TableCell>
                    <TableCell>{getPelaksanaanBadge(agenda.status_pelaksanaan || 'Belum Terlaksana')}</TableCell>
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
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Tidak ada agenda yang ditemukan untuk {ajudanInfo.pimpinan.nama}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Detail (READ ONLY - No Edit/Delete) */}
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
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Pimpinan yang Hadir</h4>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedAgenda.pimpinan}</p>
                    <p className="text-xs text-gray-600">{selectedAgenda.jabatan_pimpinan}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status Agenda</label>
                    <div className="mt-1">{getStatusBadge(selectedAgenda.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status Pelaksanaan</label>
                    <div className="mt-1">{getPelaksanaanBadge(selectedAgenda.status_pelaksanaan)}</div>
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
