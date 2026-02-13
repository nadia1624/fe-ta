import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Users, Newspaper, CheckCircle, Clock, Calendar, TrendingUp, FileText, UserCheck, ClipboardList } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/Button';

export default function KasubagMediaDashboard() {
  const stats = [
    { 
      label: 'Total Staf Media', 
      value: '6', 
      icon: Users, 
      iconColor: '#9810FA', 
      bg: 'bg-[#faf5ff]',
      borderColor: 'border-gray-200'
    },
    { 
      label: 'Draft Perlu Review', 
      value: '4', 
      icon: Clock, 
      iconColor: '#D08700', 
      bg: 'bg-[#fefce8]',
      borderColor: 'border-gray-200'
    },
    { 
      label: 'Draft Disetujui', 
      value: '18', 
      icon: CheckCircle, 
      iconColor: '#00A63E', 
      bg: 'bg-[#f0fdf4]',
      borderColor: 'border-gray-200'
    },
    { 
      label: 'Penugasan Aktif', 
      value: '7', 
      icon: Newspaper, 
      iconColor: '#155DFC', 
      bg: 'bg-[#eff6ff]',
      borderColor: 'border-gray-200'
    },
  ];

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

  const bebanKerjaStaf = [
    { nama: 'Siti Nurhaliza', penugasan: 2 },
    { nama: 'Dewi Lestari', penugasan: 2 },
    { nama: 'Rina Kusuma', penugasan: 2 },
    { nama: 'Maya Sari', penugasan: 1 },
  ];

  const draftPerluReview = [
    {
      judul: 'Walikota Hadiri Rapat Koordinasi Februari',
      staf: 'Siti Nurhaliza',
      tanggal: '30 Jan 2025',
      status: 'Pending Review',
      statusBg: 'bg-[#fef3c7]',
      statusColor: 'text-[#92400e]'
    },
    {
      judul: 'Kunjungan Dinas Pendidikan Disambut Baik',
      staf: 'Dewi Lestari',
      tanggal: '30 Jan 2025',
      status: 'Review',
      statusBg: 'bg-[#dbeafe]',
      statusColor: 'text-[#1e40af]'
    },
  ];

  const perluPenugasan = [
    {
      judul: 'Pertemuan dengan Camat Se-Kab',
      tanggal: '08 Feb 2026',
      deskripsi: 'Pertemuan acara pemerintah daerah...',
      status: 'Belum Ditugaskan',
      statusBg: 'bg-[#fef3c7]',
      statusColor: 'text-[#92400e]'
    },
    {
      judul: 'Kunjungan Kerja Dinas Kese...',
      tanggal: '12 Feb 2026',
      deskripsi: 'Koordinasi protokoler kunjungan',
      status: 'Belum Ditugaskan',
      statusBg: 'bg-[#fef3c7]',
      statusColor: 'text-[#92400e]'
    },
    {
      judul: 'Pelantikan Kepala Dinas',
      tanggal: '15 Feb 2026',
      deskripsi: 'Pelantikan aparatur pelaksana pelantikan',
      status: 'Belum Ditugaskan',
      statusBg: 'bg-[#fef3c7]',
      statusColor: 'text-[#92400e]'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold text-[#101828] leading-[32px]">
          Kasubag Media Dashboard
        </h1>
        <p className="text-[14px] text-[#4a5565] leading-[20px] mt-1">
          Kelola penugasan staf media dan review draft berita
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`border ${stat.borderColor}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-[14px] text-[#4a5565] leading-[20px] mb-1">
                      {stat.label}
                    </p>
                    <p className="text-[30px] font-bold text-[#101828] leading-[36px]">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bg} rounded-[10px] p-3 w-[48px] h-[48px] flex items-center justify-center`}>
                    <Icon className="w-6 h-6" style={{ color: stat.iconColor }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agenda Pimpinan Hari Ini with Progress */}
      <Card>
        <CardHeader className="border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#155DFC]" />
                <h3 className="text-[18px] font-bold text-[#101828] leading-[28px]">
                  Agenda Pimpinan Hari Ini
                </h3>
              </div>
              <p className="text-[14px] text-[#4a5565] leading-[20px] mt-1">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-[#dbeafe] px-[10px] py-[2px] rounded-full">
              <span className="text-[12px] font-normal text-[#1447e6] leading-[16px]">
                {agendaHariIni.length} Agenda
              </span>
            </div>
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
                        <h4 className="text-[16px] font-bold text-[#101828]">{agenda.kegiatan}</h4>
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
                        <p className="text-[14px] text-[#4a5565]">
                          <span className="font-medium">{agenda.pimpinan}</span> · {agenda.jabatan}
                        </p>
                        <p className="text-[14px] text-[#6a7282]">
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

      {/* 3 Columns: Beban Kerja, Draft Perlu Review, Perlu Penugasan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Beban Kerja Staf Bulan Ini */}
        <Card>
          <CardHeader className="border-b border-[#e5e7eb]">
            <div>
              <h3 className="text-[18px] font-bold text-[#101828] leading-[28px]">
                Beban Kerja Staf Bulan Ini
              </h3>
              <div className="bg-[#f3f4f6] px-2 py-1 rounded inline-block mt-2">
                <span className="text-[12px] text-[#6b7280]">Tugaskan Staf</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {bebanKerjaStaf.map((staf, index) => (
              <div key={index} className="border-b border-[#e5e7eb] last:border-0 p-4 hover:bg-gray-50 transition-colors">
                <p className="text-[14px] font-medium text-[#101828]">{staf.nama}</p>
                <p className="text-[12px] text-[#6b7280] mt-1">{staf.penugasan} penugasan</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Draft Perlu Review */}
        <Card>
          <CardHeader className="border-b border-[#e5e7eb]">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#101828] leading-[28px]">
                Draft Perlu Review
              </h3>
              <div className="bg-[#dbeafe] px-2 py-1 rounded">
                <span className="text-[12px] text-[#1447e6]">Review Semua</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {draftPerluReview.map((draft, index) => (
              <div key={index} className="border-b border-[#e5e7eb] last:border-0 p-4 hover:bg-gray-50 transition-colors">
                <p className="text-[14px] font-medium text-[#101828] mb-1">{draft.judul}</p>
                <p className="text-[12px] text-[#6b7280] mb-2">Oleh: {draft.staf}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#9ca3af]">{draft.tanggal}</span>
                  <div className={`${draft.statusBg} px-2 py-0.5 rounded`}>
                    <span className={`text-[11px] ${draft.statusColor}`}>{draft.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Perlu Penugasan */}
        <Card>
          <CardHeader className="border-b border-[#e5e7eb]">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#f59e0b]" />
              <h3 className="text-[18px] font-bold text-[#101828] leading-[28px]">
                Perlu Penugasan
              </h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {perluPenugasan.map((item, index) => (
              <div key={index} className="border-b border-[#e5e7eb] last:border-0 p-4 hover:bg-gray-50 transition-colors">
                <p className="text-[14px] font-medium text-[#101828] mb-1">{item.judul}</p>
                <p className="text-[12px] text-[#6b7280] mb-2">{item.deskripsi}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#9ca3af]">📅 {item.tanggal}</span>
                  <Link to="/dashboard/assign-staff-media">
                    <button className="text-[11px] text-[#155DFC] hover:underline">
                      Tugaskan →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/review-draft">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border border-[#e5e7eb]">
            <CardContent className="p-6 text-center">
              <div className="bg-[#eff6ff] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-[#155DFC]" />
              </div>
              <h4 className="text-[16px] font-bold text-[#101828] mb-1">Review Draft</h4>
              <p className="text-[12px] text-[#6b7280]">Review draft berita staf</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/assign-staff-media">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border border-[#e5e7eb]">
            <CardContent className="p-6 text-center">
              <div className="bg-[#dcfce7] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-6 h-6 text-[#00A63E]" />
              </div>
              <h4 className="text-[16px] font-bold text-[#101828] mb-1">Assign Staf Media</h4>
              <p className="text-[12px] text-[#6b7280]">Tugaskan staf dokumentasi</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/laporan-kegiatan-media">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border border-[#e5e7eb]">
            <CardContent className="p-6 text-center">
              <div className="bg-[#faf5ff] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-[#9810FA]" />
              </div>
              <h4 className="text-[16px] font-bold text-[#101828] mb-1">Semua Draft</h4>
              <p className="text-[12px] text-[#6b7280]">Lihat semua draft berita</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
