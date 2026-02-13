import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { FileText, Clock, CheckCircle, XCircle, Calendar, UserCheck, ClipboardList, CheckSquare } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/Button';

export default function SespriDashboard() {
  const stats = [
    { label: 'Perlu Verifikasi', value: '8', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Disetujui Hari Ini', value: '5', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Ditolak', value: '2', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Total Diproses', value: '34', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const pendingRequests = [
    {
      nomor_surat: '012/SP/I/2025',
      pemohon: 'Kepala Dinas Kesehatan',
      perihal: 'Permohonan penandatanganan MoU',
      tanggal_surat: '2025-01-30',
      status: 'Pending'
    },
    {
      nomor_surat: '013/SP/I/2025',
      pemohon: 'Camat Sukamaju',
      perihal: 'Permohonan kunjungan kerja',
      tanggal_surat: '2025-01-30',
      status: 'Pending'
    },
    {
      nomor_surat: '014/SP/I/2025',
      pemohon: 'Ketua DPRD',
      perihal: 'Rapat koordinasi program kerja',
      tanggal_surat: '2025-01-29',
      status: 'Pending'
    },
  ];

  const upcomingAgenda = [
    { kegiatan: 'Rapat Koordinasi Bulanan', tanggal: '2025-02-01', waktu: '09:00' },
    { kegiatan: 'Kunjungan Dinas Pendidikan', tanggal: '2025-02-03', waktu: '10:30' },
    { kegiatan: 'Upacara Peringatan', tanggal: '2025-02-05', waktu: '08:00' },
  ];

  // Today's date untuk contoh (February 4, 2026)
  const today = '2025-02-04';
  
  const todayAgenda = [
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Sespri Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Verifikasi dan kelola surat permohonan masuk</p>
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

      {/* Agenda Hari Ini */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Agenda Pimpinan Hari Ini</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(today).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <Badge variant="info">{todayAgenda.length} Agenda</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {todayAgenda.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {todayAgenda.map((agenda) => (
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
                  <div className={`mt-3 pt-3 border-t ${agenda.progress_reports.length > 0 ? 'border-blue-200' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-2">
                      <ClipboardList className={`w-4 h-4 mt-0.5 ${agenda.progress_reports.length > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          {agenda.progress_reports.length > 0 ? `✓ ${agenda.progress_reports.length} Laporan Progress` : '○ Belum Ada Laporan'}
                        </p>
                        {agenda.progress_reports.length > 0 ? (
                          <div className="space-y-3">
                            {agenda.progress_reports.map((report) => (
                              <div key={report.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start gap-2 mb-2">
                                  <Badge variant="info" className="text-xs">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verification */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Perlu Verifikasi</h3>
              <Link to="/dashboard/verifikasi-permohonan">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {pendingRequests.map((request, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">{request.nomor_surat}</p>
                    <Badge variant="warning">{request.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{request.pemohon}</p>
                  <p className="text-sm text-gray-500 mb-2">{request.perihal}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {new Date(request.tanggal_surat).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <Link to="/dashboard/verifikasi-permohonan">
                      <Button variant="ghost" size="sm">Verifikasi</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Agenda */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Agenda Pimpinan</h3>
              <Link to="/dashboard/agenda-pimpinan">
                <Button variant="outline" size="sm">Lihat Kalender</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {upcomingAgenda.map((agenda, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{agenda.kegiatan}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(agenda.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long'
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Waktu: {agenda.waktu} WIB</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link
          to="/dashboard/verifikasi-permohonan"
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardContent className="p-6 text-center">
            <CheckSquare className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Verifikasi Permohonan</h4>
            <p className="text-sm text-gray-600">Verifikasi & kelola permohonan</p>
          </CardContent>
        </Link>

        <Link
          to="/dashboard/agenda-pimpinan"
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Mengelola Agenda Pimpinan</h4>
            <p className="text-sm text-gray-600">Kelola jadwal pimpinan</p>
          </CardContent>
        </Link>

        <Link
          to="/dashboard/konfirmasi-pengganti"
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardContent className="p-6 text-center">
            <UserCheck className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Konfirmasi Pengganti</h4>
            <p className="text-sm text-gray-600">Kelola perwakilan pimpinan</p>
          </CardContent>
        </Link>

        <Link
          to="/dashboard/laporan-kegiatan-jadwal"
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardContent className="p-6 text-center">
            <ClipboardList className="w-8 h-8 text-teal-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Laporan Kegiatan</h4>
            <p className="text-sm text-gray-600">Lihat laporan kegiatan</p>
          </CardContent>
        </Link>
      </div>
    </div>
  );
}