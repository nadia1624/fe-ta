import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Calendar, FileText, Users, CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { dashboardApi } from '../../lib/api';

interface AdminStats {
  stats: {
    totalUsers: number;
    totalAgenda: number;
    pendingRequests: number;
    confirmedAgendas: number;
  };
  recentRequests: any[];
  upcomingAgenda: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardApi.getAdminStats();
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

  const kpiStats = [
    { label: 'Total Users', value: data.stats.totalUsers.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Agenda', value: data.stats.totalAgenda.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Permohonan Pending', value: data.stats.pendingRequests.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Agenda Terkonfirmasi', value: data.stats.confirmedAgendas.toString(), icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('pending') || s.includes('revisi')) return 'secondary' as const;
    if (s.includes('approved') || s.includes('terkonfirmasi') || s.includes('selesai')) return 'default' as const;
    if (s.includes('rejected') || s.includes('batal')) return 'destructive' as const;
    return 'outline' as const;
  };

  const formatStatus = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 'Menunggu';
    if (s === 'approved_sespri') return 'Disetujui Sespri';
    if (s === 'approved_ajudan') return 'Terkonfirmasi';
    if (s === 'rejected_sespri') return 'Ditolak Sespri';
    if (s === 'rejected_ajudan') return 'Ditolak Ajudan';
    if (s === 'revision') return 'Revisi';
    if (s === 'delegated') return 'Diwakilkan';
    return status;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Monitoring sistem dan manajemen data master</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-none shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agenda Mendatang */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold text-gray-900">Agenda Mendatang</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {data.upcomingAgenda.length > 0 ? (
                data.upcomingAgenda.map((agenda, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{agenda.nama_kegiatan}</p>
                      <Badge variant={getStatusVariant(agenda.status)} className="capitalize shrink-0">{agenda.status}</Badge>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-medium text-gray-700">
                          {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </p>
                      <p className="ml-5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        Waktu: <span className="font-semibold text-gray-700">{agenda.waktu_mulai} WIB</span>
                      </p>
                      <p className="ml-5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        Lokasi: <span className="font-semibold text-gray-700">{agenda.lokasi_kegiatan}</span>
                      </p>
                      <p className="ml-5 text-blue-600 font-bold tracking-tight">{agenda.nama_pimpinan}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-400 text-sm italic font-medium">Tidak ada agenda mendatang terkonfirmasi</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permohonan Terbaru */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold text-gray-900">Permohonan Terbaru</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {data.recentRequests.length > 0 ? (
                data.recentRequests.map((request, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{request.nomor_surat}</p>
                      <Badge variant={getStatusVariant(request.status)} className="shrink-0">{formatStatus(request.status)}</Badge>
                    </div>
                    <p className="text-xs text-blue-600 font-bold mb-1">{request.pemohon}</p>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">{request.perihal}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100 w-fit">
                      {new Date(request.tanggal_surat).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-400 text-sm italic font-medium">Belum ada permohonan masuk</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}