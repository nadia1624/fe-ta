import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { FileText, Clock, CheckCircle, XCircle, PlusCircle, Eye, Loader2, RotateCcw, Edit3, ClipboardList } from 'lucide-react';
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
  const approvedCount = agendas.filter(a => {
    const status = getLatestStatus(a);
    return ['approved_sespri', 'approved_ajudan', 'completed'].includes(status);
  }).length;
  const rejectedCount = agendas.filter(a => {
    const status = getLatestStatus(a);
    return ['rejected_sespri', 'rejected_ajudan'].includes(status);
  }).length;

  const stats = [
    { label: 'Total Permohonan', value: totalCount, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Menunggu', value: pendingCount, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Revisi', value: revisionCount, icon: RotateCcw, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Disetujui', value: approvedCount, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ditolak', value: rejectedCount, icon: XCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  // Latest 3 requests for the summary card
  const recentRequests = agendas.slice(0, 3);

  // Approved agendas for the "Agenda yang Disetujui" card
  const approvedAgendas = agendas.filter(a => {
    const s = getLatestStatus(a);
    return ['approved_sespri', 'approved_ajudan', 'completed'].includes(s);
  }).slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved_sespri':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approved by Sespri</Badge>;
      case 'approved_ajudan':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approved by Ajudan</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'revision':
        return <Badge variant="info">Revision</Badge>;
      case 'rejected_sespri':
        return <Badge variant="danger">Rejected by Sespri</Badge>;
      case 'rejected_ajudan':
        return <Badge variant="danger">Rejected by Ajudan</Badge>;
      case 'delegated':
        return <Badge variant="info">Delegated</Badge>;
      case 'canceled':
        return <Badge variant="secondary">Canceled</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
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

      {/* Stats Cards - Restored Original Styles but Blue Icons */}
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
                Isi formulir permohonan agenda kegiatan dengan Walikota/Wakil Walikota/Sekretaris Daerah
              </p>
            </div>
            <Link to="/pemohon/submit-request">
              <Button size="lg">
                <PlusCircle className="w-5 h-5 mr-2" />
                Buat Permohonan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Permohonan Saya */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 leading-none">Permohonan Saya</h3>
            <Link to="/pemohon/riwayat-permohonan">
                <Button variant="outline" size="sm" className="h-8 text-xs text-gray-500 bg-white">Lihat Semua</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {recentRequests.length > 0 ? recentRequests.map((request) => {
                const status = getLatestStatus(request);
                const catatan = getLatestCatatan(request);
                return (
                  <div key={request.id_agenda} className="px-6 py-5 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900 text-[15px] mb-2">{request.nomor_surat}</p>
                        <p className="text-[13px] text-gray-600 mb-1">{request.perihal}</p>
                        {request.tanggal_kegiatan && (
                          <p className="text-[11px] text-gray-400">
                            Tanggal kegiatan: {new Date(request.tanggal_kegiatan).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      <div className="mt-1">
                        <Badge 
                          className={`
                            ${['approved_sespri', 'approved_ajudan', 'completed'].includes(status) ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100' : 
                              status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100' : 
                              ['rejected_sespri', 'rejected_ajudan'].includes(status) ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100' :
                              status === 'revision' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100' :
                              status === 'delegated' ? 'bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-100' :
                              'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100'}
                            px-3 py-0.5 text-[10px] font-bold border rounded-full shadow-none
                          `}
                        >
                          {status === 'approved_sespri' ? 'Approved by Sespri' : 
                           status === 'approved_ajudan' ? 'Approved by Ajudan' :
                           status === 'pending' ? 'Pending' : 
                           status === 'rejected_sespri' ? 'Rejected by Sespri' :
                           status === 'rejected_ajudan' ? 'Rejected by Ajudan' :
                           status === 'revision' ? 'Revision' : 
                           status === 'delegated' ? 'Delegated' :
                           status === 'canceled' ? 'Canceled' :
                           status === 'completed' ? 'Completed' : status}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 mb-4 shadow-sm">
                      <p className="text-[12px] text-blue-800 font-medium">
                        {['approved_sespri', 'approved_ajudan'].includes(status) ? 'Permohonan disetujui, menunggu konfirmasi jadwal' : 
                         status === 'pending' ? 'Sedang dalam proses verifikasi' : 
                         ['rejected_sespri', 'rejected_ajudan'].includes(status) ? (catatan || 'Mohon maaf, permohonan tidak dapat disetujui') :
                         catatan || 'Ada pembaharuan pada status permohonan Anda'}
                      </p>
                    </div>

                    <Link to="/pemohon/riwayat-permohonan" className="inline-flex items-center text-[12px] font-medium text-gray-500 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4 mr-1.5 opacity-70" />
                      Detail
                    </Link>
                  </div>
                );
              }) : (
                <div className="px-6 py-12 text-center">
                  <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-400 tracking-widest">Belum ada permohonan</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agenda yang Disetujui */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="py-4 border-b border-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 leading-none">Agenda yang Disetujui</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {approvedAgendas.length > 0 ? approvedAgendas.map((agenda) => (
                <div key={agenda.id_agenda} className="px-6 py-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-50 p-2.5 rounded-full border border-green-100 mt-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="font-bold text-gray-800 text-[15px] leading-snug">{agenda.nama_kegiatan || agenda.perihal}</p>
                      <div className="space-y-1">
                        {agenda.tanggal_kegiatan && (
                          <p className="text-[13px] text-gray-500 font-medium tracking-tight">
                            {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                        {agenda.waktu_mulai && (
                          <p className="text-[12px] text-gray-400 font-medium">
                            Waktu: {agenda.waktu_mulai.substring(0, 5)} - {agenda.waktu_selesai?.substring(0, 5)}
                          </p>
                        )}
                        <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                          Lokasi: {agenda.lokasi_kegiatan || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="px-6 py-12 text-center">
                  <CheckCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-400 tracking-widest">Belum ada agenda disetujui</p>
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

    </div>
  );
}