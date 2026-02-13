import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AgendaPimpinanPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');

  const agendaPimpinan = [
    {
      id: 1,
      nama_pimpinan: 'Walikota',
      kegiatan: 'Rapat Koordinasi Bulanan',
      tanggal: '2025-02-01',
      waktu: '09:00 - 11:00',
      lokasi: 'Ruang Rapat Utama',
      periode: 'Februari 2025',
      status_kehadiran: 'Hadir',
      status_disposisi: 'Approved',
      keterangan: 'Agenda rutin bulanan'
    },
    {
      id: 2,
      nama_pimpinan: 'Walikota',
      kegiatan: 'Kunjungan Kerja Dinas Pendidikan',
      tanggal: '2025-02-03',
      waktu: '10:30 - 12:30',
      lokasi: 'Aula Kantor Walikota',
      periode: 'Februari 2025',
      status_kehadiran: 'Terjadwal',
      status_disposisi: 'Pending',
      keterangan: null
    },
    {
      id: 3,
      nama_pimpinan: 'Wakil Walikota',
      kegiatan: 'Upacara Peringatan Hari Kemerdekaan',
      tanggal: '2025-02-05',
      waktu: '08:00 - 10:00',
      lokasi: 'Lapangan Upacara',
      periode: 'Februari 2025',
      status_kehadiran: 'Terjadwal',
      status_disposisi: 'Approved',
      keterangan: 'Dihadiri Wakil Walikota'
    },
    {
      id: 4,
      nama_pimpinan: 'Walikota',
      kegiatan: 'Pertemuan dengan Camat',
      tanggal: '2025-02-08',
      waktu: '13:00 - 16:00',
      lokasi: 'Aula Kantor Walikota',
      periode: 'Februari 2025',
      status_kehadiran: 'Tidak Hadir',
      status_disposisi: 'Rejected',
      keterangan: 'Bentrok dengan agenda prioritas'
    },
  ];

  const getStatusKehadiranVariant = (status: string) => {
    switch (status) {
      case 'Hadir': return 'success';
      case 'Terjadwal': return 'info';
      case 'Tidak Hadir': return 'danger';
      default: return 'default';
    }
  };

  const getStatusDisposisiVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'default';
    }
  };

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getAgendaForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return agendaPimpinan.filter(agenda => agenda.tanggal === dateStr);
  };

  const days = getDaysInMonth();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Agenda Pimpinan</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola jadwal dan kehadiran pimpinan</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'month' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Bulan
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            Daftar
          </Button>
        </div>
      </div>

      {viewMode === 'month' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Hari Ini
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
              {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
                <div key={day} className="bg-gray-50 px-3 py-2 text-center">
                  <span className="text-xs font-medium text-gray-700">{day}</span>
                </div>
              ))}
              {weeks.map((week, weekIndex) => (
                week.map((day, dayIndex) => {
                  const agendas = day ? getAgendaForDate(day) : [];
                  const isToday = day === new Date().getDate() && 
                                  currentDate.getMonth() === new Date().getMonth() && 
                                  currentDate.getFullYear() === new Date().getFullYear();
                  
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`bg-white min-h-[100px] p-2 ${!day ? 'bg-gray-50' : ''}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {agendas.map((agenda) => (
                              <div
                                key={agenda.id}
                                className="text-xs bg-blue-50 border border-blue-200 rounded px-2 py-1 cursor-pointer hover:bg-blue-100"
                              >
                                <p className="font-medium text-blue-900 truncate">{agenda.kegiatan}</p>
                                <p className="text-blue-700">{agenda.waktu.split(' - ')[0]}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'list' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Daftar Agenda Pimpinan</h3>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pimpinan</TableHead>
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status Kehadiran</TableHead>
                  <TableHead>Status Disposisi</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agendaPimpinan.map((agenda) => (
                  <TableRow key={agenda.id}>
                    <TableCell className="font-medium">{agenda.nama_pimpinan}</TableCell>
                    <TableCell>{agenda.kegiatan}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {new Date(agenda.tanggal).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-600">{agenda.waktu}</p>
                      </div>
                    </TableCell>
                    <TableCell>{agenda.lokasi}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusKehadiranVariant(agenda.status_kehadiran)}>
                        {agenda.status_kehadiran}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusDisposisiVariant(agenda.status_disposisi)}>
                        {agenda.status_disposisi}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {agenda.keterangan || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}