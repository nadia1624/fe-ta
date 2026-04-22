import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Calendar, CheckCircle, Clock, XCircle, RefreshCw, UserCheck } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { agendaApi, pimpinanApi } from '../../lib/api';
import { isAgendaPast } from '../../lib/dateUtils';

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
          // Filter: keep agendas where at least one of supervised leaders is EITHER:
          // 1. Invited (agendaPimpinans)
          // 2. Present as representative (slotAgendaPimpinans)
          const myAgendas = agendaRes.data.filter((agenda: any) => {
            // Include status filter here too for consistency and to reduce state size
            const latestStatus = agenda.statusAgendas?.[0]?.status_agenda;
            const isApproved = ['approved_sespri', 'approved_ajudan', 'delegated', 'rejected_ajudan', 'completed'].includes(latestStatus);
            if (!isApproved) return false;

            const isInvited = agenda.agendaPimpinans?.some((ap: any) =>
              assignRes.data.some((as: any) => as.id_jabatan === ap.id_jabatan && as.id_periode === ap.id_periode)
            );
            const isRepresentative = agenda.slotAgendaPimpinans?.some((sap: any) =>
              assignRes.data.some((as: any) => as.id_jabatan === sap.id_jabatan_hadir && as.id_periode === sap.id_periode_hadir)
            );
            return isInvited || isRepresentative;
          });
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

  const getParticipationInfo = (agenda: any) => {
    const info: any[] = [];

    // 1. Check if invited
    agenda.agendaPimpinans?.forEach((ap: any) => {
      const assignment = activeAssignments.find(as => as.id_jabatan === ap.id_jabatan && as.id_periode === ap.id_periode);
      if (assignment) {
        info.push({
          type: 'invited',
          nama_pimpinan: assignment.pimpinan?.nama_pimpinan,
          status_kehadiran: ap.status_kehadiran || 'pending'
        });
      }
    });

    // 2. Check if representative
    agenda.slotAgendaPimpinans?.forEach((sap: any) => {
      const assignment = activeAssignments.find(as => as.id_jabatan === sap.id_jabatan_hadir && as.id_periode === sap.id_periode_hadir);
      const isActuallyRepresentative = sap.id_jabatan_diusulkan !== sap.id_jabatan_hadir;

      if (assignment && isActuallyRepresentative) {
        if (!info.some(s => s.status_kehadiran === 'hadir' && s.nama_pimpinan === assignment.pimpinan?.nama_pimpinan)) {
          info.push({
            type: 'representative',
            nama_pimpinan: assignment.pimpinan?.nama_pimpinan,
            status_kehadiran: 'hadir',
            representing: sap.periodeJabatanDiusulkan?.pimpinan?.nama_pimpinan || 'Pimpinan Lain'
          });
        }
      }
    });

    return info;
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
  const todayStr = new Date().toLocaleDateString('en-CA');
  const monthStart = new Date();
  monthStart.setDate(1);
  const monthStartStr = monthStart.toLocaleDateString('en-CA');

  const lastDay = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  const monthEndStr = lastDay.toLocaleDateString('en-CA');

  const pendingConfirmation: any[] = [];
  const todayAgenda: any[] = [];
  const upcomingAgenda: any[] = [];

  let countPending = 0;
  let countConfirmed = 0;
  let countThisMonth = 0;
  let countCanceledOrAbsent = 0;

  agendas.forEach(agenda => {
    const latestStatus = agenda.statusAgendas?.[0]?.status_agenda;
    const isApprovedBySespri = ['approved_sespri', 'approved_ajudan', 'delegated', 'rejected_ajudan', 'completed'].includes(latestStatus);

    if (!isApprovedBySespri) return;

    const isThisMonth = agenda.tanggal_kegiatan >= monthStartStr && agenda.tanggal_kegiatan <= monthEndStr;
    const isToday = agenda.tanggal_kegiatan === todayStr;
    const isFuture = agenda.tanggal_kegiatan > todayStr;

    if (isThisMonth) countThisMonth++;

    const participations = getParticipationInfo(agenda);

    // Logic for Pending
    const hasPending = participations.some(p => p.type === 'invited' && (p.status_kehadiran === 'pending' || !p.status_kehadiran));
    if (hasPending) {
      countPending++;
      pendingConfirmation.push(agenda);
    }

    // Logic for Confirmed
    const isParticipating = participations.some(p => p.status_kehadiran === 'hadir' || p.status_kehadiran === 'diwakilkan');
    if (isParticipating) {
      countConfirmed++;
      if (isToday) todayAgenda.push(agenda);
      else if (isFuture && upcomingAgenda.length < 5) upcomingAgenda.push(agenda);
    }

    // Logic for Absent
    const isAbsent = participations.some(p => p.status_kehadiran === 'tidak_hadir');
    if (isAbsent) {
      countCanceledOrAbsent++;
    }
  });

  const stats = [
    { label: 'Perlu Konfirmasi', value: countPending.toString(), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Agenda Terkonfirmasi', value: countConfirmed.toString(), icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Agenda Bulan Ini', value: countThisMonth.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tidak Hadir', value: countCanceledOrAbsent.toString(), icon: XCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
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

      {/* Stats Cards - Restored Original Style */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Confirmation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Perlu Konfirmasi</h3>
              <Link to="/ajudan/konfirmasi-agenda">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {pendingConfirmation.length > 0 ? pendingConfirmation.slice(0, 5).map((agenda, index) => {
                const myPim = getParticipationInfo(agenda).filter(p => p.type === 'invited');
                return (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900 line-clamp-1 flex-1 pr-4">{agenda.nama_kegiatan}</p>
                      <Badge variant="warning">Perlu Status</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 line-clamp-1">{agenda.lokasi_kegiatan}</p>
                    <p className="text-sm text-gray-500 mb-2">Pimpinan: <span className="font-semibold text-gray-700">{myPim.map(p => p.nama_pimpinan).join(', ')}</span></p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs">
                      <div>
                        <p className="font-semibold text-gray-600">
                          {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-gray-500">{agenda.waktu_mulai.slice(0, 5)} - {agenda.waktu_selesai.slice(0, 5)} WIB</p>
                      </div>
                      {isAgendaPast(agenda.tanggal_kegiatan, agenda.waktu_selesai) ? (
                        <p className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded">Agenda Selesai</p>
                      ) : (
                        <Link to="/ajudan/konfirmasi-agenda">
                          <Button variant="ghost" size="sm" className="text-blue-600 h-8">Tentukan Kehadiran</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              }) : (
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
              {todayAgenda.length > 0 ? todayAgenda.map((agenda, index) => {
                const parts = getParticipationInfo(agenda);
                return (
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
                        <div className="flex flex-wrap gap-2 mt-2">
                          {parts.map((p: any, i: number) => (
                            <div key={i} className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-medium ${p.type === 'representative' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                              <span>{p.nama_pimpinan}</span>
                              {p.type === 'representative' && <span className="opacity-70 font-normal"> (Wakil {p.representing})</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
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
            <Link to="/ajudan/agenda-pimpinan">
              <Button variant="outline" size="sm">Lihat Kalender</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingAgenda.length > 0 ? upcomingAgenda.map((agenda, index) => {
              const parts = getParticipationInfo(agenda);
              const date = new Date(agenda.tanggal_kegiatan);
              let hari = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              if (agenda.tanggal_kegiatan === tomorrow.toLocaleDateString('en-CA')) hari = 'Besok';

              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all bg-white flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">{hari}</p>
                    <p className="text-xs font-semibold text-gray-500">{agenda.waktu_mulai.slice(0, 5)} WIB</p>
                  </div>
                  <p className="font-semibold text-sm text-gray-900 mb-3 line-clamp-2 min-h-[40px] leading-snug">{agenda.nama_kegiatan}</p>
                  <div className="flex items-center justify-between border-t pt-3 mt-auto">
                    <p className="text-[10px] font-medium text-gray-500 line-clamp-1">
                      {parts.map(p => p.nama_pimpinan).join(', ')}
                    </p>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-1 md:col-span-3 py-6 text-center text-sm text-gray-500 border border-dashed rounded-xl">
                Tidak ada agenda mendatang dalam jadwal.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}