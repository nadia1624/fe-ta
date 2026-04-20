import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Image,
  Loader2,
  MapPin,
  PencilLine,
  CheckCircle2
} from 'lucide-react';
import { dashboardApi } from '../../lib/api';
import { AgendaHariIniList } from '../../components/dashboard/AgendaHariIniList';

export default function StafMediaDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStafMediaStats();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching staff media stats:', error);
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
      label: 'Total Penugasan',
      value: data?.stats?.totalTasks || '0',
      icon: FileText,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    },
    {
      label: 'Pending Review',
      value: data?.stats?.pendingReview || '0',
      icon: Clock,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    },
    {
      label: 'Disetujui',
      value: data?.stats?.approved || '0',
      icon: CheckCircle,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    },
    {
      label: 'Perlu Revisi',
      value: data?.stats?.revisionNeeded || '0',
      icon: AlertCircle,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="info" className="bg-blue-100 text-blue-700 border-blue-200">Pending Review</Badge>;
      case 'published':
        return <Badge variant="success" className="bg-green-100 text-green-700 border-green-200">Disetujui</Badge>;
      case 'revision':
        return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">Perlu Revisi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Dashboard Staf Media</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Kelola draft berita dan dokumentasi kegiatan pimpinan</p>
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
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
              {data?.todayAgendas?.length || 0} agenda
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AgendaHariIniList agendas={data?.todayAgendas || []} role="staf_media" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Penugasan Saya Hari Ini */}
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">
                  Penugasan Hari Ini
                </h3>
              </div>
              <Link to="/staff-media/tugas-saya">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Lihat Semua
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {data?.myAssignments?.length > 0 ? (
                data.myAssignments.map((task: any) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors border-l-4 border-blue-500">
                    <div className="flex flex-col gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-[14px] text-gray-900 mb-1 leading-tight">
                          {task.judul_kegiatan}
                        </h4>
                        <div className="space-y-1 mt-2">
                          <p className="text-xs text-gray-700"><span className="font-semibold text-blue-700">Pimpinan:</span> {task.pimpinan}</p>
                          <p className="text-[11px] text-gray-500 flex items-center gap-3">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.waktu}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {task.tempat}</span>
                          </p>
                        </div>
                      </div>
                      <Link to={`/staff-media/tugas-saya`}>
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200">
                          <Image className="w-4 h-4 mr-2" />
                          Detail Tugas
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-gray-50/50">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">Tidak ada penugasan hari ini</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Draft Berita Terbaru */}
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">
                  Status Draft Terbaru
                </h3>
              </div>
              <Link to="/staff-media/tugas-saya">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Cek Semua
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {data?.recentDrafts?.length > 0 ? (
                data.recentDrafts.map((draft: any) => (
                  <div key={draft.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-[13px] text-gray-900 mb-1 leading-tight">
                            {draft.judul_draft}
                          </h4>
                          <p className="text-[11px] text-gray-500 font-medium line-clamp-1">
                            Kegiatan: {draft.judul_kegiatan}
                          </p>
                        </div>
                        {getStatusBadge(draft.status)}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-gray-400 font-medium">
                          Diproses: {new Date(draft.tanggal_upload).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {draft.feedback && (
                        <div className={`text-xs p-3 rounded-lg mt-1 border ${draft.status === 'revision'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-green-50 text-green-700 border-green-200'
                          }`}>
                          <p className="flex items-start gap-1.5">
                            <span className="font-bold shrink-0 flex items-center gap-1">
                              {draft.status === 'revision' ? (
                                <><PencilLine className="w-3 h-3" /> Revisi:</>
                              ) : (
                                <><CheckCircle2 className="w-3 h-3" /> Feedback:</>
                              )}
                            </span>
                            <span>{draft.feedback}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-gray-50/50">
                  <p className="text-sm text-gray-500">Belum ada draft berita</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}