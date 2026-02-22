import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Calendar, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { agendaApi, pimpinanApi } from '../../lib/api';

export default function AjudanDashboard() {
  const [loading, setLoading] = useState(true);
  const [agendas, setAgendas] = useState<any[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const assignRes = await pimpinanApi.getActiveAssignments();
      if (assignRes.success) {
        setActiveAssignments(assignRes.data);

        const agendaRes = await agendaApi.getLeaderAgendas({});
        if (agendaRes.success) {
          const myAgendas = agendaRes.data.filter((agenda: any) =>
            agenda.agendaPimpinans?.some((ap: any) =>
              assignRes.data.some((as: any) => as.id_jabatan === ap.id_jabatan && as.id_periode === ap.id_periode)
            )
          );
          myAgendas.sort((a: any, b: any) => new Date(a.tanggal_kegiatan).getTime() - new Date(b.tanggal_kegiatan).getTime());
          setAgendas(myAgendas);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hadir': return <Badge variant="success">Hadir</Badge>;
      case 'tidak_hadir': return <Badge variant="danger">Tidak Hadir</Badge>;
      case 'diwakilkan': return <Badge variant="info">Diwakilkan</Badge>;
      default: return <Badge variant="warning">Belum Konfirmasi</Badge>;
    }
  };

  // derived data calculations
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  let countPending = 0;
  let countConfirmed = 0;
  let countCanceledOrAbsent = 0;
  let countThisMonth = 0;

  const pendingConfirmation: any[] = [];
  const todayAgenda: any[] = [];
  const upcomingAgenda: any[] = [];

  agendas.forEach(agenda => {
    const isThisMonth = agenda.tanggal_kegiatan.startsWith(currentMonthStr);
    const isToday = agenda.tanggal_kegiatan === todayStr;
    const isFuture = agenda.tanggal_kegiatan > todayStr;

    if (isThisMonth) countThisMonth++;

    // get only the pimpinan records this ajudan is responsible for
    const myPimpinans = agenda.agendaPimpinans?.filter((ap: any) =>
      activeAssignments.some(as => as.id_jabatan === ap.id_jabatan && as.id_periode === ap.id_periode)
    ) || [];

    myPimpinans.forEach((ap: any) => {
      const status = ap.status_kehadiran || 'pending';
      const pimpinanName = ap.periodeJabatan?.pimpinan?.nama_pimpinan || 'Pimpinan';

      if (status === 'pending' || !status) {
        countPending++;
        // avoid duplicating the same agenda in pending list if multiple leaders are pending
        if (!pendingConfirmation.some(p => p.id_agenda === agenda.id_agenda)) {
          pendingConfirmation.push({ ...agenda, pimpinanName });
        }
      } else if (status === 'hadir' || status === 'diwakilkan') {
        countConfirmed++;
      } else if (status === 'tidak_hadir') {
        countCanceledOrAbsent++;
      }
    });

    // Filter for today/upcoming: only include if at least one leader is 'hadir'
    const attendingLeaders = myPimpinans.filter((ap: any) => ap.status_kehadiran === 'hadir');

    if (attendingLeaders.length > 0) {
      if (isToday) {
        todayAgenda.push({
          ...agenda,
          pimpinanNames: attendingLeaders.map((ap: any) => ap.periodeJabatan?.pimpinan?.nama_pimpinan).join(', '),
          status_kehadiran: 'hadir'
        });
      } else if (isFuture && upcomingAgenda.length < 5) {
        let hari = new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        // Calculate if tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (agenda.tanggal_kegiatan === tomorrow.toLocaleDateString('en-CA')) hari = 'Besok';

        upcomingAgenda.push({
          ...agenda,
          hari,
          pimpinanNames: attendingLeaders.map((ap: any) => ap.periodeJabatan?.pimpinan?.nama_pimpinan).join(', ')
        });
      }
    }
  });

  const stats = [
    { label: 'Perlu Konfirmasi', value: countPending.toString(), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Terkonfirmasi', value: countConfirmed.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Agenda Bulan Ini', value: countThisMonth.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tidak Hadir', value: countCanceledOrAbsent.toString(), icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

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
              {pendingConfirmation.length > 0 ? pendingConfirmation.slice(0, 5).map((agenda, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900 line-clamp-1 flex-1 pr-4">{agenda.nama_kegiatan}</p>
                    <Badge variant="warning">Perlu Status</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 line-clamp-1">{agenda.lokasi_kegiatan}</p>
                  <p className="text-sm text-gray-500 mb-2">Pimpinan: <span className="font-semibold text-gray-700">{agenda.pimpinanName}</span></p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t">
                    <div>
                      <p className="text-xs font-semibold text-gray-600">
                        {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{agenda.waktu_mulai.slice(0, 5)} - {agenda.waktu_selesai.slice(0, 5)} WIB</p>
                    </div>
                    <Link to="/dashboard/agenda-pimpinan-ajudan">
                      <Button variant="ghost" size="sm" className="text-blue-600">Tentukan Kehadiran</Button>
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="px-6 py-8 text-center text-sm text-gray-500">
                  Tidak ada agenda yang perlu dikonfirmasi saat ini.
                </div>
              )}
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
              {todayAgenda.length > 0 ? todayAgenda.map((agenda, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg text-center min-w-[70px]">
                      <p className="text-sm text-blue-700 font-bold">
                        {agenda.waktu_mulai.slice(0, 5)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">{agenda.nama_kegiatan}</p>
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1 line-clamp-1"><Clock className="w-3 h-3" /> {agenda.lokasi_kegiatan}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{agenda.pimpinanNames}</p>
                        {getStatusBadge(agenda.status_kehadiran)}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="px-6 py-8 text-center text-sm text-gray-500">
                  Tidak ada agenda untuk hari ini.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Agenda */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Agenda Mendatang</h3>
            <Link to="/dashboard/agenda-pimpinan-ajudan">
              <Button variant="outline" size="sm">Lihat Kalender</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingAgenda.length > 0 ? upcomingAgenda.map((agenda, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">{agenda.hari}</p>
                  <p className="text-xs font-semibold text-gray-500">{agenda.waktu_mulai.slice(0, 5)} WIB</p>
                </div>
                <p className="font-semibold text-sm text-gray-900 mb-3 line-clamp-2 min-h-[40px]">{agenda.nama_kegiatan}</p>
                <div className="flex items-center justify-between border-t pt-3 mt-auto">
                  <p className="text-[10px] font-medium text-gray-500 line-clamp-1">{agenda.pimpinanNames}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-1 md:col-span-3 py-6 text-center text-sm text-gray-500 border border-dashed rounded-xl">
                Tidak ada agenda mendatang dalam jadwal.
              </div>
            )}
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
        <Link to="/dashboard/agenda-pimpinan-ajudan">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Kalender Agenda</h4>
              <p className="text-sm text-gray-600">Lihat jadwal lengkap</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/agenda-pimpinan-ajudan">
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