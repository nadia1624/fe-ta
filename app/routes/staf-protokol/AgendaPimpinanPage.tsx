import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, List, CalendarDays, Clock, MapPin, User } from 'lucide-react';
import { Link } from 'react-router';

export default function AgendaPimpinanPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // February 2026

  const agendaList = [
    {
      id: 1,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      kegiatan: 'Rapat Koordinasi Bulanan OPD',
      tanggal: '2026-02-05',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama',
      status: 'Selesai'
    },
    {
      id: 2,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      tanggal: '2026-02-05',
      waktu: '14:00 - 16:00',
      tempat: 'Kantor Dinas Kesehatan',
      status: 'Berlangsung'
    },
    {
      id: 3,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      kegiatan: 'Launching Program Smart City',
      tanggal: '2026-02-05',
      waktu: '19:00 - 21:00',
      tempat: 'Gedung Serbaguna',
      status: 'Belum Dimulai'
    },
    {
      id: 4,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      kegiatan: 'Peresmian Gedung Baru RSUD',
      tanggal: '2026-02-10',
      waktu: '10:00 - 12:00',
      tempat: 'RSUD Kota',
      status: 'Belum Dimulai'
    },
    {
      id: 5,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      kegiatan: 'Rapat dengan DPRD',
      tanggal: '2026-02-12',
      waktu: '13:00 - 16:00',
      tempat: 'Gedung DPRD',
      status: 'Belum Dimulai'
    },
    {
      id: 6,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      kegiatan: 'Pembukaan Festival Seni Budaya',
      tanggal: '2026-02-15',
      waktu: '08:00 - 10:00',
      tempat: 'Lapangan Utama Kota',
      status: 'Belum Dimulai'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Berlangsung':
        return <Badge variant="info">Berlangsung</Badge>;
      case 'Selesai':
        return <Badge variant="success">Selesai</Badge>;
      case 'Belum Dimulai':
        return <Badge variant="warning">Belum Dimulai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const getAgendaForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return agendaList.filter(a => a.tanggal === dateStr);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Agenda Pimpinan</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Lihat jadwal kegiatan pimpinan</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4 inline mr-1 md:mr-2" />
            <span className="hidden md:inline">List</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-4 h-4 inline mr-1 md:mr-2" />
            <span className="hidden md:inline">Kalender</span>
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3 md:space-y-4">
          {agendaList.map((agenda) => (
            <Card key={agenda.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1">{agenda.kegiatan}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User className="w-3 h-3" />
                      <span>{agenda.pimpinan}</span>
                      <span className="text-gray-400">•</span>
                      <span>{agenda.jabatan}</span>
                    </div>
                  </div>
                  {getStatusBadge(agenda.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs md:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>
                      {new Date(agenda.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{agenda.waktu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{agenda.tempat}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">{monthName}</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                <div key={day} className="text-center text-xs md:text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const agendas = getAgendaForDate(day);
                const isToday = day === 5; // February 5, 2026

                return (
                  <div
                    key={day}
                    className={`aspect-square border rounded-lg p-1 md:p-2 ${
                      isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } ${agendas.length > 0 ? 'bg-blue-50/50' : 'bg-white'}`}
                  >
                    <div className={`text-xs md:text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day}
                    </div>
                    {agendas.length > 0 && (
                      <div className="mt-1">
                        <div className="text-xs bg-blue-600 text-white rounded px-1 py-0.5 truncate">
                          {agendas.length} agenda
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Agenda Bulan Ini:</p>
              <div className="space-y-2">
                {agendaList.map((agenda) => {
                  const agendaDate = new Date(agenda.tanggal);
                  if (agendaDate.getMonth() === month) {
                    return (
                      <div key={agenda.id} className="flex flex-col md:flex-row md:items-center gap-2 text-xs bg-gray-50 p-2 rounded">
                        <Badge variant="info" className="w-fit">{agendaDate.getDate()}</Badge>
                        <span className="flex-1 text-gray-900">{agenda.kegiatan}</span>
                        <span className="text-gray-600">{agenda.waktu}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
