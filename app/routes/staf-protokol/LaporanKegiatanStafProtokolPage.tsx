import { useState, useEffect } from 'react';
import { penugasanApi } from '../../lib/api';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowRight, Search, Filter, TrendingUp } from 'lucide-react';

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

  const totalLaporan = laporanList.length;
  const sudahDilaporkan = laporanList.filter(l => l.status_laporan === 'Selesai').length;
  const belumDilaporkan = laporanList.filter(l => l.status_laporan === 'Belum Dimulai').length;

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Laporan Kegiatan Protokol</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Laporan dokumentasi dan hasil kegiatan pimpinan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Total Agenda</p>
                <p className="text-2xl md:text-3xl font-semibold text-blue-600">{totalLaporan}</p>
              </div>
              <div className="bg-blue-50 p-2 md:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Selesai</p>
                <p className="text-2xl md:text-3xl font-semibold text-green-600">{sudahDilaporkan}</p>
              </div>
              <div className="bg-green-50 p-2 md:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Belum Dimulai</p>
                <p className="text-2xl md:text-3xl font-semibold text-orange-600">{belumDilaporkan}</p>
              </div>
              <div className="bg-orange-50 p-2 md:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
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
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterPimpinan}
                    onChange={(e) => setFilterPimpinan(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
                  >
                    <option value="all">Semua Pimpinan</option>
                    {pimpinanList.map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Berlangsung">Berlangsung</option>
                  <option value="Belum Dimulai">Belum Dimulai</option>
                </select>
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
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pimpinan</TableHead>
                      <TableHead>Kegiatan</TableHead>
                      <TableHead>Tanggal & Waktu</TableHead>
                      <TableHead>Tempat</TableHead>
                      <TableHead className="text-center">Progress</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map(item => (
                      <TableRow key={item.id}>
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
                          <div className="font-medium text-gray-900">{item.judul_kegiatan}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm">
                            <div>{new Date(item.tanggal).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}</div>
                            <div className="text-gray-500">{item.waktu}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{item.tempat}</TableCell>
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
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredData.map(item => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.judul_kegiatan}</h4>
                            <p className="text-xs text-gray-600">
                              {item.pimpinans.map((p: any) => p.nama_pimpinan).join(', ')}
                            </p>
                          </div>
                          {getStatusBadge(item.status_laporan)}
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>📅 {new Date(item.tanggal).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })} · 🕒 {item.waktu}</p>
                          <p>📍 {item.tempat}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-600">{item.jumlah_progress} update</span>
                        </div>
                        <Link to={`/staff-protokol/tugas-detail/${item.id}`}>
                          <Button variant="outline" size="sm">
                            Lihat <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
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
