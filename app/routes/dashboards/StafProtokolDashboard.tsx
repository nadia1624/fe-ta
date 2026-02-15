import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Calendar,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function StafProtokolDashboard() {
  const today = '2026-02-05';

  const stats = [
    {
      label: 'Total Tugas',
      value: '12',
      icon: ClipboardList,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    },
    {
      label: 'Berlangsung',
      value: '3',
      icon: Clock,
      bg: 'bg-orange-50',
      color: 'text-orange-600'
    },
    {
      label: 'Selesai',
      value: '7',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600'
    },
    {
      label: 'Belum Dimulai',
      value: '2',
      icon: AlertCircle,
      bg: 'bg-gray-50',
      color: 'text-gray-600'
    }
  ];

  // Agenda hari ini dengan progress
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
          deskripsi: 'Tim protokol sudah tiba di lokasi pukul 08:00. Setup ruangan, pengaturan tempat duduk pimpinan dan tamu sudah selesai.',
          foto: '4 foto',
          waktu: '08:30'
        },
        {
          id: 2,
          tipe: 'Pelaksanaan',
          deskripsi: 'Penyambutan pimpinan berjalan lancar. Protokoler acara pembukaan sesuai rundown.',
          foto: '6 foto',
          waktu: '09:15'
        },
        {
          id: 3,
          tipe: 'Selesai',
          deskripsi: 'Acara selesai. Pelepasan pimpinan berjalan tertib. Dokumentasi protokoler lengkap.',
          foto: '5 foto',
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
          deskripsi: 'Koordinasi dengan pihak Dinkes sudah dilakukan. Tim protokol akan berangkat pukul 13:30.',
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

  // Tugas saya yang sedang dikerjakan
  const myTasks = [
    {
      id: 1,
      tugas_id: 1,
      judul: 'Protokol Peresmian Gedung RSUD',
      penugasan_dari: 'Kasubag Protokol',
      tanggal: '2026-02-10',
      waktu: '09:00 - 12:00',
      lokasi: 'RSUD Kota',
      status: 'Belum Dimulai',
      instruksi: 'Koordinasi dengan pihak RSUD untuk rundown acara, setup protokol penyambutan pimpinan, pastikan dokumentasi lengkap.',
      jumlah_progress: 0
    },
    {
      id: 2,
      tugas_id: 2,
      judul: 'Protokol Festival Seni Budaya',
      penugasan_dari: 'Kasubag Protokol',
      tanggal: '2026-02-15',
      waktu: '18:00 - 22:00',
      lokasi: 'Taman Budaya',
      status: 'Berlangsung',
      instruksi: 'Koordinasi protokol pembukaan festival, atur jalur VIP untuk pimpinan, siapkan backdrop dan podium.',
      jumlah_progress: 2
    },
    {
      id: 3,
      tugas_id: 3,
      judul: 'Protokol Rapat DPRD',
      penugasan_dari: 'Kasubag Protokol',
      tanggal: '2026-02-12',
      waktu: '10:00 - 14:00',
      lokasi: 'Gedung DPRD',
      status: 'Berlangsung',
      instruksi: 'Setup ruang rapat, koordinasi tempat duduk protokoler, pastikan kelengkapan audio visual.',
      jumlah_progress: 3
    },
    {
      id: 4,
      tugas_id: 4,
      judul: 'Protokol Kunjungan Menteri',
      penugasan_dari: 'Kasubag Protokol',
      tanggal: '2026-02-08',
      waktu: '08:00 - 16:00',
      lokasi: 'Bandara & Balai Kota',
      status: 'Belum Dimulai',
      instruksi: 'Koordinasi penjemputan di bandara, atur jalur protokol, siapkan paspampres, koordinasi dengan keamanan.',
      jumlah_progress: 1
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Dashboard Staf Protokol</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Kelola tugas protokoler dan laporan kegiatan pimpinan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-2 md:p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Agenda Pimpinan Hari Ini</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
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
                <div key={agenda.id} className="px-4 md:px-6 py-4 md:py-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm md:text-base text-gray-900">{agenda.kegiatan}</h4>
                        <Badge
                          variant={
                            agenda.status === 'Berlangsung' ? 'info' :
                              agenda.status === 'Selesai' ? 'success' :
                                'warning'
                          }
                          className="w-fit"
                        >
                          {agenda.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs md:text-sm text-gray-600">
                          <span className="font-medium">{agenda.pimpinan}</span> · {agenda.jabatan}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
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
                          <div className="space-y-2 md:space-y-3">
                            {agenda.progress_reports.map((report) => (
                              <div key={report.id} className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3">
                                <div className="flex flex-col md:flex-row md:items-start gap-2 mb-2">
                                  <Badge variant="info" className="text-xs w-fit">
                                    {report.tipe}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{report.waktu}</span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-900 mb-2">{report.deskripsi}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <span className="inline-flex items-center gap-1">
                                    📷 {report.foto}
                                  </span>
                                </div>
                              </div>
                            ))}
                            <Link to={`/dashboard/laporan-kegiatan-protokol/${agenda.id}`}>
                              <Button variant="outline" size="sm" className="w-full mt-2">
                                Lihat Semua Progress ({agenda.progress_reports.length})
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 md:p-3">
                            <p className="text-xs md:text-sm text-gray-500 italic">
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

      {/* Tugas Saya - Quick Access */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Tugas Saya</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Tugas yang sedang dikerjakan</p>
            </div>
            <Link to="/dashboard/tugas-saya">
              <Button variant="outline" size="sm">Lihat Semua</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {myTasks.map((task) => (
              <div key={task.id} className="px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm md:text-base text-gray-900">{task.judul}</h4>
                      <Badge
                        variant={
                          task.status === 'Berlangsung' ? 'info' :
                            task.status === 'Selesai' ? 'success' :
                              'warning'
                        }
                        className="w-fit"
                      >
                        {task.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 mb-3">
                      <p className="text-xs text-gray-600">
                        📋 Dari: {task.penugasan_dari}
                      </p>
                      <p className="text-xs text-gray-500">
                        📅 {new Date(task.tanggal).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })} · 🕒 {task.waktu}
                      </p>
                      <p className="text-xs text-gray-500">
                        📍 {task.lokasi}
                      </p>
                    </div>

                    {/* Instruksi */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Instruksi:</p>
                      <p className="text-xs text-gray-600">{task.instruksi}</p>
                    </div>

                    {/* Progress Info - Simple */}
                    <div className={`${task.jumlah_progress > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'} border rounded-lg p-2 md:p-3 mb-3`}>
                      <div className="flex items-center gap-2">
                        <ClipboardList className={`w-4 h-4 ${task.jumlah_progress > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-xs font-medium text-gray-700">
                          {task.jumlah_progress > 0
                            ? `${task.jumlah_progress} Progress Dilaporkan`
                            : 'Belum Ada Progress'}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/dashboard/tugas-detail/${task.tugas_id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Update Progress
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
