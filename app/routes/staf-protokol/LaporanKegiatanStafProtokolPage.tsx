import { useState, useEffect } from 'react';
import { penugasanApi } from '../../lib/api';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowRight, Search, Filter, TrendingUp, User, Clock, CheckCircle, Calendar, MapPin } from 'lucide-react';
import CustomSelect from '../../components/ui/CustomSelect';

export default function LaporanKegiatanStafProtokolPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPimpinan, setFilterPimpinan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [laporanList, setLaporanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaporan = async () => {
      setLoading(true);
      try {
        const res = await penugasanApi.getMyPenugasan();
        if (res.success && res.data) {
          const mappedData = res.data.map((p: any) => ({
            id: p.id_penugasan,
            pimpinans: p.pimpinans || [],
            judul_kegiatan: p.agenda?.nama_kegiatan || '-',
            tanggal: p.agenda?.tanggal_kegiatan || p.tanggal_penugasan,
            waktu: p.agenda ? `${p.agenda.waktu_mulai?.slice(0, 5)} - ${p.agenda.waktu_selesai?.slice(0, 5)}` : '-',
            tempat: p.agenda?.lokasi_kegiatan || '-',
            status_laporan: p.status_pelaksanaan,
            jumlah_progress: p.laporanKegiatans?.length || 0
          }));
          setLaporanList(mappedData);
        }
      } catch (error) {
        console.error('Error fetching laporan kegiatan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaporan();
  }, []);

  const filteredData = laporanList.filter(item => {
    const matchSearch =
      item.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pimpinans.some((p: any) => p.nama_pimpinan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.tempat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchPimpinan = filterPimpinan === 'all' || item.pimpinans.some((p: any) => p.nama_pimpinan === filterPimpinan);
    const matchStatus = filterStatus === 'all' || item.status_laporan === filterStatus;

    return matchSearch && matchPimpinan && matchStatus;
  });

  const pimpinanList = Array.from(new Set(laporanList.flatMap(l => l.pimpinans.map((p: any) => p.nama_pimpinan))));
  const pimpinanOptions = [
    { value: 'all', label: 'Semua Pimpinan' },
    ...pimpinanList.map((p: any) => ({ value: p, label: p }))
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return <Badge variant="success">Selesai</Badge>;
      case 'Berlangsung':
        return <Badge variant="info">Berlangsung</Badge>;
      case 'Belum Dimulai':
        return <Badge variant="warning">Belum Dimulai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const statsTotal = laporanList.length;
  const statsSelesai = laporanList.filter(l => l.status_laporan === 'Selesai').length;
  const statsBerlangsung = laporanList.filter(l => l.status_laporan === 'Berlangsung').length;
  const statsBelumDimulai = laporanList.filter(l => l.status_laporan === 'Belum Dimulai').length;

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Laporan Kegiatan Protokol</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Laporan dokumentasi dan hasil kegiatan pimpinan</p>
      </div>

      {/* Stats */}
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

      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Daftar Laporan Kegiatan ({filteredData.length})
            </h3>
            <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-2 md:gap-3">
              <div className="relative flex-1 md:flex-none md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari laporan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <CustomSelect
                  value={filterPimpinan}
                  onChange={setFilterPimpinan}
                  options={pimpinanOptions}
                  icon={<User className="w-4 h-4" />}
                  className="w-full md:w-56 text-sm"
                  placeholder="Filter Pimpinan"
                />
                <CustomSelect
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={[
                    { value: 'all', label: 'Semua Status' },
                    { value: 'Selesai', label: 'Selesai' },
                    { value: 'Berlangsung', label: 'Berlangsung' },
                    { value: 'Belum Dimulai', label: 'Belum Dimulai' }
                  ]}
                  icon={<Filter className="w-4 h-4" />}
                  className="w-full md:w-48 text-sm"
                  placeholder="Filter Status"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Memuat data laporan kegiatan...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                      <TableHead className="text-sm font-bold text-gray-900 text-center w-12 py-4">No.</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4">Pimpinan</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4">Kegiatan</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4">Tanggal & Waktu</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4">Tempat</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4 text-center">Progress</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4 text-center">Status</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4 text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => (
                      <TableRow key={item.id} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                        <TableCell className="text-center font-bold text-gray-400 text-xs">{index + 1}</TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            {item.pimpinans.map((p: any, idx: number) => (
                              <div key={idx}>
                                <div className="font-medium text-gray-900">{p.nama_pimpinan}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{p.nama_jabatan}</div>
                              </div>
                            ))}
                            {item.pimpinans.length === 0 && <div className="text-gray-400 italic">-</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900 text-sm">{item.judul_kegiatan}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{new Date(item.tanggal).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}</div>
                            <div className="text-gray-500">{item.waktu}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          <span className="text-xs text-gray-600 font-medium">{item.tempat}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">{item.jumlah_progress} update</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(item.status_laporan)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Link to={`/staff-protokol/tugas-detail/${item.id}`}>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-100 rounded-xl transition-all shadow-sm">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredData.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Tidak ada laporan yang ditemukan</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
