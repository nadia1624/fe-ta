import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Calendar, FileText, Users, CheckCircle } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '48', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Agenda', value: '127', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Permohonan Pending', value: '12', icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Agenda Terkonfirmasi', value: '89', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const upcomingAgenda = [
    {
      nama_kegiatan: 'Rapat Koordinasi Bulanan',
      tanggal_kegiatan: '2025-02-01',
      waktu_mulai: '09:00',
      lokasi_kegiatan: 'Ruang Rapat Utama',
      nama_pimpinan: 'Walikota',
      status: 'Terkonfirmasi'
    },
    {
      nama_kegiatan: 'Kunjungan Kerja Dinas Pendidikan',
      tanggal_kegiatan: '2025-02-03',
      waktu_mulai: '10:30',
      lokasi_kegiatan: 'Aula Kantor Walikota',
      nama_pimpinan: 'Walikota',
      status: 'Terkonfirmasi'
    },
    {
      nama_kegiatan: 'Upacara Peringatan Hari Kemerdekaan',
      tanggal_kegiatan: '2025-02-05',
      waktu_mulai: '08:00',
      lokasi_kegiatan: 'Lapangan Upacara',
      nama_pimpinan: 'Wakil Walikota',
      status: 'Terjadwal'
    },
    {
      nama_kegiatan: 'Pertemuan dengan Camat Se-Kabupaten',
      tanggal_kegiatan: '2025-02-08',
      waktu_mulai: '13:00',
      lokasi_kegiatan: 'Aula Kantor Walikota',
      nama_pimpinan: 'Walikota',
      status: 'Terjadwal'
    },
  ];

  const recentRequests = [
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
      nomor_surat: '011/SP/I/2025',
      pemohon: 'Ketua DPRD',
      perihal: 'Rapat koordinasi program kerja',
      tanggal_surat: '2025-01-29',
      status: 'Approved'
    },
    {
      nomor_surat: '010/SP/I/2025',
      pemohon: 'Kepala Dinas Pendidikan',
      perihal: 'Audiensi program beasiswa',
      tanggal_surat: '2025-01-28',
      status: 'Approved'
    },
    {
      nomor_surat: '009/SP/I/2025',
      pemohon: 'Kepala Desa Mekar Sari',
      perihal: 'Permohonan dukungan infrastruktur',
      tanggal_surat: '2025-01-28',
      status: 'Rejected'
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'secondary' as const;
      case 'Approved': return 'default' as const;
      case 'Rejected': return 'destructive' as const;
      case 'Terkonfirmasi': return 'default' as const;
      case 'Terjadwal': return 'outline' as const;
      default: return 'default' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Monitoring sistem dan manajemen data master</p>
      </div>

      {/* KPI Cards */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agenda Mendatang */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Agenda Mendatang</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {upcomingAgenda.map((agenda, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">{agenda.nama_kegiatan}</p>
                    <Badge variant={getStatusVariant(agenda.status)}>{agenda.status}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p>Waktu: {agenda.waktu_mulai} WIB</p>
                    <p>Lokasi: {agenda.lokasi_kegiatan}</p>
                    <p className="text-blue-600 font-medium">{agenda.nama_pimpinan}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permohonan Terbaru */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Permohonan Terbaru</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {recentRequests.map((request, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">{request.nomor_surat}</p>
                    <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{request.pemohon}</p>
                  <p className="text-sm text-gray-500 mb-2">{request.perihal}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(request.tanggal_surat).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}