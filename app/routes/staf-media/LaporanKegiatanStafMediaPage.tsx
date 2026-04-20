import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Search, Calendar, Clock, MapPin, FileText,
  Loader2, TrendingUp, ArrowRight, User, Filter, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router';
import CustomSelect from '../../components/ui/CustomSelect';
import MonthPicker from '../../components/ui/month-picker';
import { penugasanApi } from '../../lib/api';

export default function LaporanKegiatanStafMediaPage() {
  const [tugasProtokol, setTugasProtokol] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPimpinan, setFilterPimpinan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchTugas = async () => {
    try {
      setLoading(true);
      const res = await penugasanApi.getProtokolAssignments();
      if (res.success) {
        setTugasProtokol(res.data || []);
      } else {
        setError(res.message || 'Gagal mengambil data tugas');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTugas();
  }, []);

  const filteredTugas = tugasProtokol.filter(tugas => {
    const matchesSearch =
      tugas.agenda.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tugas.pimpinans.some((p: any) => p.nama_pimpinan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tugas.agenda.lokasi_kegiatan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPimpinan = filterPimpinan === 'all' ||
      tugas.pimpinans.some((p: any) => p.nama_pimpinan === filterPimpinan);

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'selesai' && tugas.status === 'selesai') ||
      (filterStatus === 'proses' && (tugas.status === 'proses' || tugas.status === 'progress')) ||
      (filterStatus === 'belum' && (tugas.status === 'pending' || tugas.status === 'belum'));

    return matchesSearch && matchesPimpinan && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'selesai':
        return <Badge variant="success">Selesai</Badge>;
      case 'proses':
      case 'progress':
        return <Badge variant="info">Berlangsung</Badge>;
      case 'pending':
      case 'belum':
        return <Badge variant="warning">Belum Dimulai</Badge>;
      default:
        return <Badge>{status || 'Berlangsung'}</Badge>;
    }
  };

  const pimpinanOptions = [
    { value: 'all', label: 'Semua Pimpinan' },
    ...Array.from(new Set(tugasProtokol.flatMap(t => t.pimpinans.map((p: any) => p.nama_pimpinan))))
      .map(nama => ({ value: nama as string, label: nama as string }))
  ];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const statsTotal = tugasProtokol.length;
  const statsSelesai = tugasProtokol.filter(t => t.status === 'selesai').length;
  const statsBerlangsung = tugasProtokol.filter(t => t.status === 'proses' || t.status === 'progress').length;
  const statsBelumDimulai = tugasProtokol.filter(t => t.status === 'pending' || t.status === 'belum').length;

  return (
    <div className="space-y-4 md:space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Laporan Kegiatan</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Laporan dokumentasi dan hasil kegiatan pimpinan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agenda</p>
                <p className="text-2xl font-semibold text-blue-600">{statsTotal}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-2xl font-semibold text-green-600">{statsSelesai}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Berlangsung</p>
                <p className="text-2xl font-semibold text-blue-600">{statsBerlangsung}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Belum Dimulai</p>
                <p className="text-2xl font-semibold text-orange-600">{statsBelumDimulai}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-100 overflow-hidden">
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Daftar Laporan Kegiatan ({filteredTugas.length})
            </h3>
            <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-2 md:gap-3">
              <div className="relative flex-1 md:flex-none md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari laporan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <CustomSelect
                value={filterPimpinan}
                onChange={setFilterPimpinan}
                options={pimpinanOptions}
                icon={<User className="w-4 h-4" />}
                className="w-full md:w-48 text-sm"
              />
              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'selesai', label: 'Selesai' },
                  { value: 'proses', label: 'Berlangsung' },
                  { value: 'belum', label: 'Belum Dimulai' }
                ]}
                icon={<Filter className="w-4 h-4" />}
                className="w-full md:w-36 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm">Memuat data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                    <TableHead className="text-sm font-bold text-gray-900 text-center w-12 py-4">No.</TableHead>
                    <TableHead className="text-sm font-bold text-gray-900 py-4 px-6">Pimpinan</TableHead>
                    <TableHead className="text-sm font-bold text-gray-900 py-4">Kegiatan</TableHead>
                    <TableHead className="text-sm font-bold text-gray-900 py-4">Tanggal & Waktu</TableHead>
                    <TableHead className="text-sm font-bold text-gray-900 py-4">Tempat</TableHead>
                    <TableHead className="text-sm font-bold text-gray-900 py-4 text-center">Progress</TableHead>
                    <TableHead className="text-sm font-bold text-gray-900 py-4 text-center">Status</TableHead>
                    <TableHead className="text-sm font-bold text-gray-900 py-4 text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTugas.map((tugas, index) => (
                    <TableRow key={tugas.id_penugasan} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                      <TableCell className="text-center font-bold text-gray-400 text-xs">{index + 1}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                          {tugas.pimpinans.map((p: any, idx: number) => (
                            <div key={idx} className="mb-1 last:mb-0">
                              <div className="font-medium text-gray-900 text-sm">{p.nama_pimpinan}</div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{p.nama_jabatan}</div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 text-sm">{tugas.agenda.nama_kegiatan}</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{formatDate(tugas.agenda.tanggal_kegiatan)}</div>
                          <div className="text-gray-500">{tugas.agenda.waktu_mulai.slice(0, 5)} - {tugas.agenda.waktu_selesai.slice(0, 5)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        <span className="text-xs text-gray-600 font-medium">{tugas.agenda.lokasi_kegiatan}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">{tugas.laporanKegiatans?.length || 0} update</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(tugas.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Link to={`/staff-media/laporan-kegiatan/${tugas.id_penugasan}`}>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-100 rounded-xl transition-all shadow-sm">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredTugas.length === 0 && (
                <div className="p-16 text-center text-gray-500 bg-white/50">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="text-sm font-medium">Tidak ada laporan ditemukan</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
