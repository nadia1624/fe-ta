import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { FileText, Clock, CheckCircle, XCircle, Calendar, UserCheck, ClipboardList, CheckSquare, Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { dashboardApi } from '../../lib/api';

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
  todayAgendas: Agenda[];
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
          {data.todayAgendas.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {data.todayAgendas.map((agenda) => (
                <div key={agenda.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{agenda.kegiatan}</h4>
                        <Badge
                          variant={
                            agenda.status === 'Berlangsung' ? 'info' :
                              agenda.status === 'Selesai' ? 'success' :
                                'warning'
                          }
                        >
                          {agenda.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{agenda.pimpinan}</span> · {agenda.jabatan}
                        </p>
                        <p className="text-sm text-gray-500">
                          🕒 {agenda.waktu} WIB · 📍 {agenda.tempat}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Reports Section */}
                  <div className={`mt-3 pt-3 border-t ${agenda.progress_reports.length > 0 ? 'border-blue-200' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-2">
                      <ClipboardList className={`w-4 h-4 mt-0.5 ${agenda.progress_reports.length > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          {agenda.progress_reports.length > 0 ? `✓ ${agenda.progress_reports.length} Laporan Progress` : '○ Belum Ada Laporan'}
                        </p>
                        {agenda.progress_reports.length > 0 ? (
                          <div className="space-y-3">
                            {agenda.progress_reports.map((report) => (
                              <div key={report.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start gap-2 mb-2">
                                  <Badge variant="info" className="text-xs">
                                    {report.tipe}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{report.waktu}</span>
                                </div>
                                <p className="text-sm text-gray-900 mb-2">{report.deskripsi}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <span className="inline-flex items-center gap-1">
                                    📷 {report.foto} Foto
                                  </span>
                                </div>
                              </div>
                            ))}
                            <Link to={`/sespri/laporan-kegiatan-jadwal`}>
                              <Button variant="outline" size="sm" className="w-full mt-2">
                                Lihat Semua Progress ({agenda.progress_reports.length})
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-sm text-gray-500 italic">
                              Belum ada update laporan untuk kegiatan ini
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada agenda hari ini</p>
            </div>
          )}
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