import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { FileText, Clock, CheckCircle, XCircle, Calendar, Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { dashboardApi } from '../../lib/api';
import { AgendaHariIniList } from '../../components/dashboard/AgendaHariIniList';

interface ProgressReport {
  id: string | number;
  tipe: string;
  waktu: string;
  deskripsi: string;
  foto: number;
}

interface Agenda {
  id: string | number;
  kegiatan: string;
  status: 'Berlangsung' | 'Selesai' | 'Mendatang' | string;
  pimpinan: string;
  jabatan: string;
  waktu: string;
  tempat: string;
  progress_reports: ProgressReport[];
}

interface PendingRequest {
  nomor_surat: string;
  status: string;
  pemohon: string;
  perihal: string;
  tanggal_surat: string;
}

interface UpcomingAgenda {
  kegiatan: string;
  tanggal: string;
  waktu: string;
}

interface SespriStats {
  stats: {
    pendingVerification: number;
    approvedToday: number;
    rejected: number;
    totalProcessed: number;
  };
  todayAgendas: any[]; // Changed to any[] since AgendaHariIniList processes raw data
  pendingRequests: PendingRequest[];
  upcomingAgenda: UpcomingAgenda[];
}

export default function SespriDashboard() {
  const [data, setData] = useState<SespriStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardApi.getSespriStats();
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Memuat data dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
        <p className="text-red-700 font-bold mb-2">Terjadi Kesalahan</p>
        <p className="text-red-600 text-sm">{error || 'Data tidak tersedia'}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const stats = [
    { label: 'Perlu Verifikasi', value: data.stats.pendingVerification.toString(), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Disetujui Hari Ini', value: data.stats.approvedToday.toString(), icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ditolak', value: data.stats.rejected.toString(), icon: XCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Diproses', value: data.stats.totalProcessed.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
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
            <Card key={index} className="border-none shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-2 md:p-3 rounded-xl`}>
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
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Agenda Pimpinan Hari Ini</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <Badge variant="info">{data.todayAgendas.length} Agenda</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AgendaHariIniList agendas={data.todayAgendas} role="sespri" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verification */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Perlu Verifikasi</h3>
              <Link to="/sespri/verifikasi-permohonan">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {data.pendingRequests.length > 0 ? (
                data.pendingRequests.map((request, index) => (
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
                      <Link to="/sespri/verifikasi-permohonan">
                        <Button variant="ghost" size="sm">Verifikasi</Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-gray-500 italic font-medium">
                  Tidak ada permohonan perlu verifikasi
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Agenda */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Agenda Pimpinan</h3>
              <Link to="/sespri/agenda-pimpinan">
                <Button variant="outline" size="sm">Lihat Kalender</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {data.upcomingAgenda.length > 0 ? (
                data.upcomingAgenda.map((agenda, index) => (
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
                ))
              ) : (
                <div className="px-6 py-12 text-center text-gray-500 italic font-medium">
                  Tidak ada agenda mendatang
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}