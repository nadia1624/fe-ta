import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Calendar,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  MapPin,
  Loader2
} from 'lucide-react';
import { dashboardApi } from '../../lib/api';
import { AgendaHariIniList } from '../../components/dashboard/AgendaHariIniList';

export default function StafProtokolDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStafProtokolStats();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching staff protokol stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Tugas',
      value: data?.stats?.totalTasks || '0',
      icon: ClipboardList,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    },
    {
      label: 'Berlangsung',
      value: data?.stats?.onProgress || '0',
      icon: Clock,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    },
    {
      label: 'Selesai',
      value: data?.stats?.completed || '0',
      icon: CheckCircle,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    },
    {
      label: 'Belum Dimulai',
      value: data?.stats?.pending || '0',
      icon: AlertCircle,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6 pb-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Dashboard Staf Protokol</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Kelola tugas protokoler dan laporan kegiatan pimpinan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
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

      {/* Agenda Pimpinan Hari Ini - Full Width */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">Agenda Pimpinan Hari Ini</h3>
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
            </div>
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
              {data?.todayAgendas?.length || 0} Agenda
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AgendaHariIniList agendas={data?.todayAgendas || []} role="staf_protokol" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {/* Tugas Saya - Refined Design */}
        <Card className="border-none shadow-sm h-fit font-sans">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">Tugas Saya</h3>
                  <p className="text-[11px] md:text-xs text-gray-500 font-medium">Tugas yang sedang dikerjakan</p>
                </div>
              </div>
              <Link to="/staff-protokol/tugas-saya">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold">
                  Lihat Semua
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {data?.myTasks?.length > 0 ? (
                data.myTasks.map((task: any) => (
                  <div key={task.id} className="p-6 md:p-8 hover:bg-gray-50/50 transition-colors">
                    <div className="flex flex-col gap-5">
                      {/* Title & Badge */}
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-bold text-lg md:text-xl text-gray-900 leading-tight">
                          {task.judul}
                        </h4>
                        <Badge
                          className={`text-[11px] py-1 px-3 font-semibold rounded-full border-none ${task.status === 'Berlangsung'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                            }`}
                        >
                          {task.status === 'pending' ? 'Belum Dimulai' : task.status}
                        </Badge>
                      </div>

                      {/* Detail Info */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 text-[13px] md:text-sm text-gray-600">
                          <ClipboardList className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Dari: {task.penugasan_dari}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[13px] md:text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">
                            {new Date(task.tanggal).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })} · {task.waktu}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[13px] md:text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{task.lokasi}</span>
                        </div>
                      </div>

                      {/* Instruksi Block */}
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 md:p-5">
                        <p className="text-[13px] font-semibold text-gray-800 mb-2">Instruksi:</p>
                        <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                          {task.instruksi}
                        </p>
                      </div>

                      {/* Progress Placeholder Block */}
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-gray-200">
                          <ClipboardList className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-[13px] font-semibold text-gray-500">Belum Ada Progress</span>
                      </div>

                      {/* Action Button */}
                      <Link to={`/staff-protokol/tugas-detail/${task.id}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 md:py-4 text-xs md:text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
                          <ClipboardList className="w-4 h-4 mr-2" />
                          Update Progress
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-16 text-center bg-gray-50/50">
                  <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-base text-gray-500 font-semibold">Tidak ada tugas aktif saat ini</p>
                  <p className="text-sm text-gray-400 mt-1">Cek kembali nanti untuk penugasan baru</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
