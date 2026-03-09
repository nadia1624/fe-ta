import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Search, Calendar, Clock, MapPin, FileText,
  Loader2, TrendingUp, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router';
import CustomSelect from '../../components/ui/CustomSelect';
import MonthPicker from '../../components/ui/month-picker';
import { penugasanApi } from '../../lib/api';

export default function LaporanKegiatanPage() {
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
        setError(res.message || 'Gagal mengambil data monitoring');
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
      (filterStatus === 'selesai' ? tugas.status === 'selesai' : tugas.status !== 'selesai');

    return matchesSearch && matchesPimpinan && matchesStatus;
  });

  const pimpinanOptions = [
    { value: 'all', label: 'Semua Pimpinan' },
    ...Array.from(new Set(tugasProtokol.flatMap(t => t.pimpinans.map((p: any) => p.nama_pimpinan))))
      .map(nama => ({ value: nama as string, label: nama as string }))
  ];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const totalAgenda = tugasProtokol.length;
  const sudahSelesai = tugasProtokol.filter(t => t.status === 'selesai').length;
  const belumDimulai = tugasProtokol.filter(t => t.status !== 'selesai').length;

  return (
    <div className="space-y-4 md:space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Laporan Kegiatan</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Laporan dokumentasi dan hasil kegiatan pimpinan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Card className="shadow-sm border-gray-100 py-2">
          <CardContent className="p-4 md:p-6 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500 font-medium mb-1">Total Agenda</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{totalAgenda}</p>
              </div>
              <div className="bg-blue-50 p-2 md:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100 py-2">
          <CardContent className="p-4 md:p-6 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500 font-medium mb-1">Selesai</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600">{sudahSelesai}</p>
              </div>
              <div className="bg-green-50 p-2 md:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100 py-2">
          <CardContent className="p-4 md:p-6 pb-2 border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500 font-medium mb-1 border-gray-100">Belum Dimulai</p>
                <p className="text-2xl md:text-3xl font-bold text-orange-600">{belumDimulai}</p>
              </div>
              <div className="bg-orange-50 p-2 md:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-100 overflow-hidden">
        <CardHeader className="border-b border-gray-50 bg-white/50 px-4 md:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900">
              Daftar Laporan Kegiatan ({filteredTugas.length})
            </h3>
            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari laporan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-xs bg-gray-50/50"
                />
              </div>
              <CustomSelect
                value={filterPimpinan}
                onChange={setFilterPimpinan}
                options={pimpinanOptions}
                className="w-full md:w-48 text-xs"
              />
              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'selesai', label: 'Selesai' },
                  { value: 'belum', label: 'Belum Dimulai' }
                ]}
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
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-6">Pimpinan</TableHead>
                    <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kegiatan</TableHead>
                    <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tanggal & Waktu</TableHead>
                    <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tempat</TableHead>
                    <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Progress</TableHead>
                    <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Status</TableHead>
                    <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTugas.map((tugas) => (
                    <TableRow key={tugas.id_penugasan} className="hover:bg-gray-50/50 border-gray-50 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                          {tugas.pimpinans.map((p: any, idx: number) => (
                            <div key={idx} className="mb-1 last:mb-0">
                              <span className="text-[13px] font-semibold text-gray-900 leading-tight block">{p.nama_pimpinan}</span>
                              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{p.nama_jabatan}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[13px] text-gray-700 font-medium leading-relaxed">{tugas.agenda.nama_kegiatan}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-[12px]">
                          <span className="text-gray-900 font-medium">{formatDate(tugas.agenda.tanggal_kegiatan)}</span>
                          <span className="text-gray-500 text-[11px]">{tugas.agenda.waktu_mulai.slice(0, 5)} - {tugas.agenda.waktu_selesai.slice(0, 5)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[12px] text-gray-600 font-medium">{tugas.agenda.lokasi_kegiatan}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[13px] text-blue-600 font-bold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{tugas.laporanKegiatans?.length || 0} update</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={tugas.status === 'selesai' ? 'success' : 'warning'} className="rounded-md font-bold px-2.5 py-0.5 text-[10px] uppercase shadow-sm">
                          {tugas.status || 'proses'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Link to={`/kasubag-media/laporan-kegiatan/${tugas.id_penugasan}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredTugas.length === 0 && (
                <div className="p-16 text-center text-gray-400 bg-white/50">
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
