import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Calendar, Users, UserCheck, Building2, Loader2 } from 'lucide-react';
import { dashboardApi } from '../../lib/api';

interface AdminStats {
  stats: {
    totalUsers: number;
    totalPimpinan: number;
    totalKaskpd: number;
    totalPeriode: number;
  };
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
      setError('');
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
    { label: 'Total Pengguna', value: data.stats.totalUsers.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Pimpinan', value: data.stats.totalPimpinan.toString(), icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total KaSKPD', value: data.stats.totalKaskpd.toString(), icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Periode', value: data.stats.totalPeriode.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Ringkasan manajemen data sistem</p>
      </div>

      {/* Stats Cards - Aligned with Ajudan Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, index) => {
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
    </div>
  );
}
