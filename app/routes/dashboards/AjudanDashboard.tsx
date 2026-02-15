import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';

export default function AjudanDashboard() {
  const stats = [
    { label: 'Perlu Konfirmasi', value: '5', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Terkonfirmasi', value: '28', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Agenda Bulan Ini', value: '47', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Dibatalkan', value: '3', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const pendingConfirmation = [
    {
      nomor_surat: '012/SP/I/2025',
      kegiatan: 'Permohonan audiensi terkait program pendidikan',
      pemohon: 'Kepala Dinas Pendidikan',
      tanggal_kegiatan: '2025-02-18',
      waktu: '10:00 - 12:00',
      status: 'Pending'
    },
    {
      nomor_surat: '013/SP/I/2025',
      kegiatan: 'Kunjungan kerja Walikota ke Kecamatan',
      pemohon: 'Camat Sukamaju',
      tanggal_kegiatan: '2025-02-15',
      waktu: '09:00 - 12:00',
      status: 'Pending'
    },
  ];

  const todayAgenda = [
    {
      waktu: '09:00 - 11:00',
      kegiatan: 'Rapat Koordinasi Bulanan',
      lokasi: 'Ruang Rapat Utama',
      pimpinan: 'Bupati',
      status_kehadiran: 'Terjadwal'
    },
    {
      waktu: '14:00 - 16:00',
      kegiatan: 'Pertemuan dengan Tim Kesehatan',
      lokasi: 'Ruang Kerja Walikota',
      pimpinan: 'Walikota',
      status_kehadiran: 'Terjadwal'
    },
  ];

  const upcomingAgenda = [
    { hari: 'Besok', kegiatan: 'Kunjungan Dinas Pendidikan', waktu: '10:30', pimpinan: 'Walikota' },
    { hari: '3 Feb', kegiatan: 'Upacara Peringatan', waktu: '08:00', pimpinan: 'Wakil Walikota' },
    { hari: '5 Feb', kegiatan: 'Rapat Evaluasi Program', waktu: '13:00', pimpinan: 'Walikota' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Ajudan Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola dan konfirmasi agenda pimpinan</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Confirmation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Perlu Konfirmasi</h3>
              <Link to="/dashboard/konfirmasi-agenda">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {pendingConfirmation.map((agenda, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">{agenda.nomor_surat}</p>
                    <Badge variant="warning">{agenda.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{agenda.kegiatan}</p>
                  <p className="text-sm text-gray-500 mb-2">Pemohon: {agenda.pemohon}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">
                        {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{agenda.waktu}</p>
                    </div>
                    <Link to="/dashboard/konfirmasi-agenda">
                      <Button variant="ghost" size="sm">Konfirmasi</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Agenda */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Agenda Hari Ini</h3>
              <Badge variant="info">{todayAgenda.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {todayAgenda.map((agenda, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 px-3 py-2 rounded-lg text-center min-w-[80px]">
                      <p className="text-xs text-blue-600 font-medium">
                        {agenda.waktu.split(' - ')[0]}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{agenda.kegiatan}</p>
                      <p className="text-sm text-gray-600 mb-1">{agenda.lokasi}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{agenda.pimpinan}</p>
                        <Badge variant="info">{agenda.status_kehadiran}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Agenda */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Agenda Mendatang</h3>
            <Link to="/dashboard/agenda-pimpinan">
              <Button variant="outline" size="sm">Lihat Kalender</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingAgenda.map((agenda, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <p className="text-xs font-medium text-blue-600 mb-2">{agenda.hari}</p>
                <p className="font-medium text-gray-900 mb-1">{agenda.kegiatan}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-600">{agenda.waktu} WIB</p>
                  <p className="text-xs text-gray-500">{agenda.pimpinan}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/dashboard/konfirmasi-agenda">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Konfirmasi Agenda</h4>
              <p className="text-sm text-gray-600">Approve atau reject agenda</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/agenda-pimpinan">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Kalender Agenda</h4>
              <p className="text-sm text-gray-600">Lihat jadwal lengkap</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/agenda-pimpinan">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Update Kehadiran</h4>
              <p className="text-sm text-gray-600">Update status kehadiran pimpinan</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}