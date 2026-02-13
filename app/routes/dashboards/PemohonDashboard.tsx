import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { FileText, Clock, CheckCircle, XCircle, PlusCircle, Eye } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/Button';

export default function PemohonDashboard() {
  const stats = [
    { label: 'Total Permohonan', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: '3', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Disetujui', value: '8', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Ditolak', value: '1', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const myRequests = [
    {
      nomor_surat: '005/SP/I/2025',
      perihal: 'Permohonan kunjungan kerja Walikota',
      tanggal_surat: '2025-01-29',
      tanggal_kegiatan: '2025-02-15',
      status: 'Approved',
      catatan: 'Permohonan disetujui, menunggu konfirmasi jadwal'
    },
    {
      nomor_surat: '012/SP/I/2025',
      perihal: 'Permohonan audiensi terkait program pendidikan',
      tanggal_surat: '2025-01-30',
      tanggal_kegiatan: '2025-02-18',
      status: 'Pending',
      catatan: 'Sedang dalam proses verifikasi'
    },
    {
      nomor_surat: '008/SP/I/2025',
      perihal: 'Permohonan dukungan kegiatan bakti sosial',
      tanggal_surat: '2025-01-25',
      tanggal_kegiatan: '2025-02-10',
      status: 'Rejected',
      catatan: 'Bentrok dengan agenda prioritas lainnya'
    },
  ];

  const approvedAgenda = [
    {
      kegiatan: 'Kunjungan Kerja Walikota ke Kecamatan Sukamaju',
      tanggal: '2025-02-15',
      waktu: '09:00 - 12:00',
      lokasi: 'Kantor Kecamatan Sukamaju'
    },
    {
      kegiatan: 'Rapat Koordinasi Program Kesehatan',
      tanggal: '2025-02-20',
      waktu: '13:00 - 15:00',
      lokasi: 'Ruang Rapat Walikota'
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'default' as const;
      case 'Pending': return 'secondary' as const;
      case 'Rejected': return 'destructive' as const;
      default: return 'default' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Pemohon Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Ajukan dan lacak status permohonan agenda kegiatan</p>
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

      {/* CTA untuk Ajukan Permohonan */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Ajukan Permohonan Baru</h3>
              <p className="text-sm text-gray-600">
                Isi formulir permohonan agenda kegiatan dengan Walikota/Wakil Walikota
              </p>
            </div>
            <Link to="/dashboard/submit-request">
              <Button size="lg">
                <PlusCircle className="w-5 h-5 mr-2" />
                Buat Permohonan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Permohonan Saya</h3>
              <Link to="/dashboard/riwayat-permohonan-pemohon">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {myRequests.map((request, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">{request.nomor_surat}</p>
                    <Badge variant={getStatusVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.perihal}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Tanggal kegiatan: {new Date(request.tanggal_kegiatan).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  {request.catatan && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                      <p className="text-xs text-blue-800">{request.catatan}</p>
                    </div>
                  )}
                  <Link to="/dashboard/riwayat-permohonan-pemohon">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Approved Agenda */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Agenda yang Disetujui</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {approvedAgenda.map((agenda, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{agenda.kegiatan}</p>
                      <p className="text-sm text-gray-600 mb-1">
                        {new Date(agenda.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">Waktu: {agenda.waktu}</p>
                      <p className="text-xs text-gray-500">Lokasi: {agenda.lokasi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panduan */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Panduan Pengajuan Permohonan</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-semibold">
                1
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Isi Formulir</p>
              <p className="text-xs text-gray-600">Lengkapi data permohonan dan upload surat</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-semibold">
                2
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Verifikasi</p>
              <p className="text-xs text-gray-600">Sespri akan memverifikasi kelengkapan</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-semibold">
                3
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Konfirmasi</p>
              <p className="text-xs text-gray-600">Menunggu konfirmasi jadwal dari Ajudan</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-semibold">
                4
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Pelaksanaan</p>
              <p className="text-xs text-gray-600">Agenda terlaksana sesuai jadwal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/dashboard/submit-request">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <PlusCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Ajukan Permohonan Baru</h4>
              <p className="text-sm text-gray-600">Buat permohonan agenda kegiatan</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/riwayat-permohonan-pemohon">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Riwayat Permohonan</h4>
              <p className="text-sm text-gray-600">Lihat semua riwayat permohonan Anda</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}