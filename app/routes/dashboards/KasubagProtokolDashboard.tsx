import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Users, ClipboardList, CheckCircle, Clock, Calendar, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { dashboardApi } from '../../lib/api';
import { AgendaHariIniList } from '../../components/dashboard/AgendaHariIniList';

export default function KasubagProtokolDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Staf Protokol', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Penugasan Aktif', value: '0', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tugas Selesai', value: '0', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'On Progress', value: '0', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]);
  const [agendaHariIni, setAgendaHariIni] = useState<any[]>([]);
  const [bebanKerjaStaf, setBebanKerjaStaf] = useState<any[]>([]);
  const [perluPenugasan, setPerluPenugasan] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getKasubagProtokolStats();
      const data = res.data;

      if (!data) return;

      // 1. Process Stats
      setStats([
        { label: 'Total Staf Protokol', value: String(data.stats.totalStaff), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Penugasan Aktif', value: String(data.stats.activeAssignments), icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Tugas Selesai', value: String(data.stats.completedAssignments), icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'On Progress', value: String(data.stats.onProgressAssignments), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
      ]);

      // 2. Agenda Hari Ini
      setAgendaHariIni(data.todayAgendas);

      // 3. Beban Kerja Staf
      setBebanKerjaStaf(data.workload.map((w: any) => ({
        nama: w.nama,
        penugasan: w.tugas
      })));

      // 4. Perlu Penugasan
      setPerluPenugasan(data.perluPenugasan.map((a: any) => ({
        id: a.id,
        judul: a.kegiatan,
        deskripsi: a.perihal || 'Agenda telah diverifikasi',
        tanggal: new Date(a.tanggal).toLocaleDateString('id-ID')
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Kasubag Protokol
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Kelola penugasan staf protokol dan monitor agenda pimpinan
        </p>
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
                    <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bg} rounded-xl p-2 md:p-3 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agenda Pimpinan Hari Ini - Harmonized Design */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">
                  Agenda Pimpinan Hari Ini
                </h3>
                <p className="text-[11px] md:text-xs text-gray-500 font-medium">
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
              {agendaHariIni.length} Agenda
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AgendaHariIniList agendas={agendaHariIni} role="kasubag_protokol" />
        </CardContent>
      </Card>

      {/* 2 Kolom: Beban Kerja dan Perlu Penugasan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beban Kerja Staf Bulan Ini */}
        <Card>
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                Beban Kerja Staf
              </h3>
              <Badge variant="outline" className="text-gray-500 font-normal">Bulan Ini</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {bebanKerjaStaf.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {bebanKerjaStaf.map((staf, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <p className="text-sm font-semibold text-gray-900">{staf.nama}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>{staf.penugasan} penugasan bulan ini</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Belum ada data penugasan</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Perlu Penugasan */}
        <Card>
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                Perlu Penugasan
              </h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {perluPenugasan.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {perluPenugasan.map((item, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{item.judul}</p>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">{item.deskripsi}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">Tanggal: {item.tanggal}</span>
                      <Link to="/kasubag-protokol/assign-staff">
                        <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 h-7 text-xs px-2 shadow-sm">Tugaskan <ArrowRight className="ml-1 w-3 h-3" /></Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-20" />
                <p className="text-sm">Semua agenda sudah ditugaskan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
