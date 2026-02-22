import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { FileText, Clock, CheckCircle, XCircle, PlusCircle, Eye, Loader2, RotateCcw, Edit3 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { agendaApi } from '../../lib/api';

export default function PemohonDashboard() {
  const [loading, setLoading] = useState(true);
  const [agendas, setAgendas] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await agendaApi.getMyAgendas();
      if (response.success) {
        setAgendas(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLatestStatus = (agenda: any) => {
    const sorted = agenda.statusAgendas
      ? [...agenda.statusAgendas].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [];
    return sorted[0]?.status_agenda || 'pending';
  };

  const getLatestCatatan = (agenda: any) => {
    const sorted = agenda.statusAgendas
      ? [...agenda.statusAgendas].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [];
    return sorted[0]?.catatan || null;
  };

  // Compute stats from real data
  const totalCount = agendas.length;
  const pendingCount = agendas.filter(a => getLatestStatus(a) === 'pending').length;
  const revisionCount = agendas.filter(a => getLatestStatus(a) === 'revision').length;
  const approvedCount = agendas.filter(a => getLatestStatus(a) === 'approved').length;
  const rejectedCount = agendas.filter(a => getLatestStatus(a) === 'rejected').length;

  const stats = [
    { label: 'Total Permohonan', value: totalCount, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Menunggu', value: pendingCount, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Revisi', value: revisionCount, icon: RotateCcw, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Disetujui', value: approvedCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Ditolak', value: rejectedCount, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  // Latest 3 requests for the summary card
  const recentRequests = agendas.slice(0, 3);

  // Approved agendas for the "Agenda yang Disetujui" card
  const approvedAgendas = agendas.filter(a => getLatestStatus(a) === 'approved').slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Disetujui</Badge>;
      case 'pending':
        return <Badge variant="warning">Menunggu</Badge>;
      case 'revision':
        return <Badge variant="info">Perlu Revisi</Badge>;
      case 'rejected':
        return <Badge variant="danger">Ditolak</Badge>;
      case 'canceled':
        return <Badge variant="secondary">Dibatalkan</Badge>;
      case 'completed':
        return <Badge variant="success">Selesai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Pemohon Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Ajukan dan lacak status permohonan agenda kegiatan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <h3 className="text-lg font-semibold text-gray-900">Permohonan Terbaru</h3>
              <Link to="/dashboard/riwayat-permohonan-pemohon">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {recentRequests.length > 0 ? recentRequests.map((request) => {
                const status = getLatestStatus(request);
                const catatan = getLatestCatatan(request);
                return (
                  <div key={request.id_agenda} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm">{request.perihal}</p>
                      {getStatusBadge(status)}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{request.nomor_surat}</p>
                    {request.tanggal_kegiatan && (
                      <p className="text-xs text-gray-500 mb-2">
                        Tanggal kegiatan: {new Date(request.tanggal_kegiatan).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                    {catatan && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                        <p className="text-xs text-blue-800">{catatan}</p>
                      </div>
                    )}
                    <Link to="/dashboard/riwayat-permohonan-pemohon">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </Link>
                  </div>
                );
              }) : (
                <div className="px-6 py-8 text-center">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ada permohonan</p>
                </div>
              )}
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
              {approvedAgendas.length > 0 ? approvedAgendas.map((agenda) => (
                <div key={agenda.id_agenda} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{agenda.nama_kegiatan || agenda.perihal}</p>
                      {agenda.tanggal_kegiatan && (
                        <p className="text-sm text-gray-600 mb-1">
                          {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                      {agenda.waktu_mulai && (
                        <p className="text-xs text-gray-500">
                          Waktu: {agenda.waktu_mulai.substring(0, 5)} - {agenda.waktu_selesai?.substring(0, 5)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">Lokasi: {agenda.lokasi_kegiatan || '-'}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="px-6 py-8 text-center">
                  <CheckCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ada agenda yang disetujui</p>
                </div>
              )}
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