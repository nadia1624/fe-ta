import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Users, ClipboardList, CheckCircle, Clock, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/Button';

export default function KasubagProtokolDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const stats = [
    { label: 'Total Staf Protokol', value: '8', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Penugasan Aktif', value: '12', icon: ClipboardList, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Tugas Selesai', value: '28', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'On Progress', value: '9', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  // Agenda Hari Ini dengan Progress Detail
  const agendaHariIni = [
    {
      id: 1,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      kegiatan: 'Rapat Koordinasi Bulanan OPD',
      tanggal: '2026-02-05',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama',
      status: 'Selesai',
      progress_reports: [
        {
          id: 1,
          tipe: 'Persiapan',
          deskripsi: 'Tim protokol sudah tiba di lokasi pukul 08:00. Setup ruangan, pengaturan tempat duduk pimpinan, dan koordinasi MC sudah selesai.',
          foto: '4 foto',
          waktu: '08:30'
        },
        {
          id: 2,
          tipe: 'Pelaksanaan',
          deskripsi: 'Penyambutan pimpinan berjalan lancar. Protokoler acara pembukaan sesuai rundown. Koordinasi dengan MC lancar.',
          foto: '6 foto',
          waktu: '09:15'
        },
        {
          id: 3,
          tipe: 'Selesai',
          deskripsi: 'Acara selesai. Pelepasan pimpinan berjalan tertib. Dokumentasi protokoler lengkap.',
          foto: '3 foto',
          waktu: '12:15'
        }
      ]
    },
    {
      id: 2,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      tanggal: '2026-02-05',
      waktu: '14:00 - 16:00',
      tempat: 'Kantor Dinas Kesehatan',
      status: 'Berlangsung',
      progress_reports: [
        {
          id: 1,
          tipe: 'Persiapan',
          deskripsi: 'Koordinasi dengan pihak Dinas Kesehatan sudah dilakukan. Tim protokol akan berangkat pukul 13:30.',
          foto: '2 foto',
          waktu: '10:00'
        },
        {
          id: 2,
          tipe: 'Sedang Berlangsung',
          deskripsi: 'Tim sudah tiba di lokasi. Penyambutan pimpinan berjalan lancar. Koordinasi protokoler sedang berlangsung.',
          foto: '5 foto',
          waktu: '14:10'
        }
      ]
    },
    {
      id: 3,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      kegiatan: 'Launching Program Smart City',
      tanggal: '2026-02-05',
      waktu: '19:00 - 21:00',
      tempat: 'Gedung Serbaguna',
      status: 'Belum Dimulai',
      progress_reports: [
        {
          id: 1,
          tipe: 'Persiapan',
          deskripsi: 'Survey lokasi sudah dilakukan kemarin. Rundown acara sudah final. Koordinasi dengan pihak venue sudah selesai.',
          foto: '3 foto',
          waktu: '09:00'
        }
      ]
    }
  ];

  // Beban Kerja Staf Per Bulan (hanya staf protokol)
  const staffWorkload = [
    { nama: 'Ahmad Hidayat', penugasan_bulan_ini: 6 },
    { nama: 'Budi Santoso', penugasan_bulan_ini: 8 },
    { nama: 'Cahya Pratama', penugasan_bulan_ini: 5 },
    { nama: 'Dedi Kurniawan', penugasan_bulan_ini: 7 },
    { nama: 'Eko Prasetyo', penugasan_bulan_ini: 4 },
    { nama: 'Fajar Ramadhan', penugasan_bulan_ini: 9 },
  ];

  const pendingAssignments = [
    {
      agenda: 'Pertemuan dengan Camat Se-Kabupaten',
      tanggal: '2026-02-08',
      deskripsi: 'Pertemuan koordinasi dengan seluruh camat',
      status: 'Belum Ditugaskan'
    },
    {
      agenda: 'Launching Program Smart City',
      tanggal: '2026-02-12',
      deskripsi: 'Acara peluncuran program smart city',
      status: 'Belum Ditugaskan'
    },
    {
      agenda: 'Pelantikan Kepala Dinas',
      tanggal: '2026-02-15',
      deskripsi: 'Upacara pelantikan pejabat',
      status: 'Belum Ditugaskan'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Kasubag Protokol</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola penugasan dan monitor staf protokol</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agenda Pimpinan Hari Ini with Progress */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Agenda Pimpinan Hari Ini</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Badge variant="info">{agendaHariIni.length} Agenda</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {agendaHariIni.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {agendaHariIni.map((agenda) => (
                <div key={agenda.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{agenda.kegiatan}</h4>
                        <Badge 
                          variant={
                            agenda.status === 'Berlangsung' ? 'info' : 
                            agenda.status === 'Selesai' ? 'success' : 
                            'warning'
                          }
                        >
                          {agenda.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{agenda.pimpinan}</span> · {agenda.jabatan}
                        </p>
                        <p className="text-sm text-gray-500">
                          🕒 {agenda.waktu} · 📍 {agenda.tempat}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Reports Section */}
                  <div className={`mt-3 pt-3 border-t ${agenda.progress_reports.length > 0 ? 'border-green-200' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-2">
                      <ClipboardList className={`w-4 h-4 mt-0.5 ${agenda.progress_reports.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          {agenda.progress_reports.length > 0 ? `✓ ${agenda.progress_reports.length} Laporan Progress` : '○ Belum Ada Laporan'}
                        </p>
                        {agenda.progress_reports.length > 0 ? (
                          <div className="space-y-3">
                            {agenda.progress_reports.map((report) => (
                              <div key={report.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-start gap-2 mb-2">
                                  <Badge variant="success" className="text-xs">
                                    {report.tipe}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{report.waktu}</span>
                                </div>
                                <p className="text-sm text-gray-900 mb-2">{report.deskripsi}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <span className="inline-flex items-center gap-1">
                                    📷 {report.foto}
                                  </span>
                                </div>
                              </div>
                            ))}
                            <Link to={`/dashboard/detail-laporan-protokol/${agenda.id}`}>
                              <Button variant="outline" size="sm" className="w-full mt-2">
                                Lihat Semua Progress ({agenda.progress_reports.length})
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-sm text-gray-500 italic">
                              Belum ada update laporan untuk kegiatan ini
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada agenda hari ini</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2 Kolom: Beban Kerja Staf dan Perlu Penugasan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beban Kerja Staf Per Bulan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Beban Kerja Staf</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(currentYear, currentMonth).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {staffWorkload.map((staff, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900 mb-1">{staff.nama}</p>
                  <p className="text-sm text-gray-600">{staff.penugasan_bulan_ini} penugasan</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Perlu Penugasan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Perlu Penugasan</h3>
              </div>
              <Badge variant="warning">{pendingAssignments.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {pendingAssignments.map((assignment, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900 text-sm mb-2">{assignment.agenda}</p>
                  <p className="text-sm text-gray-600 mb-2">{assignment.deskripsi}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      📅 {new Date(assignment.tanggal).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <Link to="/dashboard/assign-staff-protokol">
                      <Button variant="ghost" size="sm" className="text-blue-600">Tugaskan →</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/dashboard/assign-staff-protokol">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Tugaskan Staf</h4>
              <p className="text-sm text-gray-600">Assign staf protokol untuk agenda</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/agenda-pimpinan-kasubag-protokol">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-green-200">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Agenda Pimpinan</h4>
              <p className="text-sm text-gray-600">Lihat jadwal pimpinan</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/laporan-kegiatan-protokol">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Laporan Kegiatan</h4>
              <p className="text-sm text-gray-600">Lihat laporan kegiatan</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
