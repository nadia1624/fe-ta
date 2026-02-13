import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Image
} from 'lucide-react';

export default function StafMediaDashboard() {
  const today = '2026-02-05';

  const stats = [
    {
      label: 'Total Tugas',
      value: '15',
      icon: FileText,
      bg: 'bg-purple-50',
      color: 'text-purple-600'
    },
    {
      label: 'Pending Review',
      value: '3',
      icon: Clock,
      bg: 'bg-orange-50',
      color: 'text-orange-600'
    },
    {
      label: 'Disetujui',
      value: '10',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600'
    },
    {
      label: 'Perlu Revisi',
      value: '2',
      icon: AlertCircle,
      bg: 'bg-red-50',
      color: 'text-red-600'
    }
  ];

  // Agenda pimpinan hari ini
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

  // Penugasan saya hari ini (tanpa deadline)
  const myAssignments = [
    {
      id: 1,
      judul_kegiatan: 'Peresmian Gedung RSUD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal: '2026-02-05',
      waktu: '10:00 - 12:00',
      tempat: 'RSUD Kota',
      status_draft: 'Belum Upload',
      penugasan_dari: 'Kasubag Media'
    },
    {
      id: 2,
      judul_kegiatan: 'Festival Seni Budaya',
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      tanggal: '2026-02-05',
      waktu: '18:00 - 22:00',
      tempat: 'Taman Budaya',
      status_draft: 'Draft Diupload',
      penugasan_dari: 'Kasubag Media'
    }
  ];

  // Status draft berita terbaru
  const recentDrafts = [
    {
      id: 1,
      judul_kegiatan: 'Launching Program Smart City',
      judul_draft: 'Walikota Launching Program Smart City untuk Meningkatkan Pelayanan Publik',
      tanggal_upload: '2026-02-04 16:30',
      status: 'Disetujui',
      feedback: 'Draft berita sudah bagus dan siap dipublikasikan'
    },
    {
      id: 2,
      judul_kegiatan: 'Peresmian Gedung Baru RSUD',
      judul_draft: 'Walikota Resmikan Gedung Baru RSUD Senilai Rp 50 Miliar',
      tanggal_upload: '2026-02-03 15:00',
      status: 'Perlu Revisi',
      feedback: 'Mohon ditambahkan kutipan langsung dari Walikota dan perbaiki typo di paragraf 3'
    },
    {
      id: 3,
      judul_kegiatan: 'Rapat Koordinasi Tim Satgas COVID-19',
      judul_draft: 'Walikota Pimpin Rapat Koordinasi Satgas COVID-19',
      tanggal_upload: '2026-02-02 17:00',
      status: 'Pending Review',
      feedback: null
    },
    {
      id: 4,
      judul_kegiatan: 'Sosialisasi Program UMKM',
      judul_draft: 'Pemkot Sosialisasikan Program Bantuan UMKM kepada Pelaku Usaha',
      tanggal_upload: '2026-02-01 14:00',
      status: 'Disetujui',
      feedback: 'Konten bagus, sudah dipublikasikan'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Belum Upload':
        return <Badge variant="warning">Belum Upload</Badge>;
      case 'Draft Diupload':
        return <Badge variant="info">Draft Diupload</Badge>;
      case 'Pending Review':
        return <Badge variant="info">Pending Review</Badge>;
      case 'Disetujui':
        return <Badge variant="success">Disetujui</Badge>;
      case 'Perlu Revisi':
        return <Badge variant="danger">Perlu Revisi</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getAgendaStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return <Badge variant="success">Selesai</Badge>;
      case 'Berlangsung':
        return <Badge variant="info">Berlangsung</Badge>;
      case 'Belum Dimulai':
        return <Badge variant="warning">Belum Dimulai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Dashboard Staf Media</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Kelola draft berita dan dokumentasi kegiatan pimpinan</p>
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

      {/* Agenda Pimpinan Hari Ini */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                  Agenda Pimpinan Hari Ini
                </h3>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {new Date(today).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <Badge variant="secondary">{todayAgenda.length} agenda</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            {todayAgenda.map((agenda) => (
              <div key={agenda.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-1">
                        {agenda.kegiatan}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600">
                        {agenda.pimpinan} · {agenda.jabatan}
                      </p>
                    </div>
                    {getAgendaStatusBadge(agenda.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      {agenda.waktu}
                    </span>
                    <span className="flex items-center gap-1">
                      📍 {agenda.tempat}
                    </span>
                  </div>
                </div>

                {/* Progress Reports from Staff Protokol */}
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <p className="text-xs font-medium text-gray-600 mb-2">Progress Protokol ({agenda.progress_reports.length} update):</p>
                  {agenda.progress_reports.map((report) => (
                    <div key={report.id} className="bg-gray-50 rounded-lg p-3 text-xs">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold text-purple-700">{report.tipe}</span>
                        <span className="text-gray-500">{report.waktu}</span>
                      </div>
                      <p className="text-gray-700 mb-1">{report.deskripsi}</p>
                      <p className="text-gray-500">📷 {report.foto}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Penugasan Saya Hari Ini */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                  Penugasan Saya Hari Ini
                </h3>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Tugas yang harus diselesaikan hari ini</p>
            </div>
            <Link to="/dashboard/tugas-saya-media">
              <Button variant="outline" size="sm">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3">
            {myAssignments.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-1">
                      {task.judul_kegiatan}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                      {task.pimpinan}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>🕒 {task.waktu}</span>
                      <span>📍 {task.tempat}</span>
                      <span>👤 {task.penugasan_dari}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:items-end">
                    {getStatusBadge(task.status_draft)}
                    <Link to={`/dashboard/tugas-saya-media`}>
                      <Button variant="primary" size="sm" className="w-full md:w-auto">
                        <Image className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        {task.status_draft === 'Belum Upload' ? 'Upload Draft' : 'Lihat Detail'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Draft Berita Terbaru */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                  Status Draft Berita Terbaru
                </h3>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Update status review draft berita</p>
            </div>
            <Link to="/dashboard/draft-berita-media">
              <Button variant="outline" size="sm">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {recentDrafts.map((draft) => (
              <div key={draft.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">
                          {draft.judul_draft}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Kegiatan: {draft.judul_kegiatan}
                        </p>
                      </div>
                      {getStatusBadge(draft.status)}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      📅 Upload: {new Date(draft.tanggal_upload).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {draft.feedback && (
                      <div className={`text-xs p-2 rounded-lg mt-2 ${
                        draft.status === 'Perlu Revisi' 
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        <span className="font-medium">
                          {draft.status === 'Perlu Revisi' ? '📝 Catatan Revisi:' : '✅ Feedback:'}
                        </span> {draft.feedback}
                      </div>
                    )}
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