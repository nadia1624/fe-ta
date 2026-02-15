import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowRight, Search, Filter, TrendingUp } from 'lucide-react';

export default function LaporanKegiatanStafMediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPimpinan, setFilterPimpinan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const laporanList = [
    {
      id: 1,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      tanggal: '2026-02-10',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama Kantor Walikota',
      status_laporan: 'Sudah Dilaporkan',
      jumlah_progress: 4
    },
    {
      id: 2,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      tanggal: '2026-02-12',
      waktu: '10:00 - 11:30',
      tempat: 'Kantor Dinas Kesehatan',
      status_laporan: 'Belum Dilaporkan',
      jumlah_progress: 0
    },
    {
      id: 3,
      pimpinan_nama: 'Ir. Hj. Siti Rahmawati, M.T',
      pimpinan_jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Pembukaan Festival Seni Budaya',
      tanggal: '2026-02-15',
      waktu: '08:00 - 10:00',
      tempat: 'Lapangan Utama Kota',
      status_laporan: 'Belum Dilaporkan',
      jumlah_progress: 0
    },
    {
      id: 4,
      pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
      pimpinan_jabatan: 'Walikota',
      judul_kegiatan: 'Rapat dengan DPRD',
      tanggal: '2026-02-08',
      waktu: '13:00 - 16:00',
      tempat: 'Gedung DPRD',
      status_laporan: 'Sudah Dilaporkan',
      jumlah_progress: 3
    },
    {
      id: 5,
      pimpinan_nama: 'Ir. Hj. Siti Rahmawati, M.T',
      pimpinan_jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Audiensi dengan Tokoh Masyarakat',
      tanggal: '2026-02-05',
      waktu: '14:00 - 15:30',
      tempat: 'Kantor Walikota',
      status_laporan: 'Sudah Dilaporkan',
      jumlah_progress: 2
    },
  ];

  const filteredData = laporanList.filter(item => {
    const matchSearch = 
      item.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pimpinan_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tempat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchPimpinan = filterPimpinan === 'all' || item.pimpinan_nama === filterPimpinan;
    const matchStatus = filterStatus === 'all' || item.status_laporan === filterStatus;
    
    return matchSearch && matchPimpinan && matchStatus;
  });

  const pimpinanList = Array.from(new Set(laporanList.map(l => l.pimpinan_nama)));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sudah Dilaporkan':
        return <Badge variant="success">Sudah Dilaporkan</Badge>;
      case 'Belum Dilaporkan':
        return <Badge variant="warning">Belum Dilaporkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalLaporan = laporanList.length;
  const sudahDilaporkan = laporanList.filter(l => l.status_laporan === 'Sudah Dilaporkan').length;
  const belumDilaporkan = laporanList.filter(l => l.status_laporan === 'Belum Dilaporkan').length;

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Laporan Kegiatan</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Laporan dokumentasi dan hasil kegiatan pimpinan (Read Only)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Total Agenda</p>
                <p className="text-2xl md:text-3xl font-semibold text-purple-600">{totalLaporan}</p>
              </div>
              <div className="bg-purple-50 p-2 md:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Sudah Dilaporkan</p>
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
                <p className="text-xs md:text-sm text-gray-600 mb-1">Belum Dilaporkan</p>
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
            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-2 md:gap-3">
              <div className="relative flex-1 md:flex-none md:w-56">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari laporan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterPimpinan}
                    onChange={(e) => setFilterPimpinan(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm appearance-none bg-white"
                  >
                    <option value="all">Semua Pimpinan</option>
                    {pimpinanList.map((p, idx) => (
                      <option key={idx} value={p}>{p.split(' ')[0]}...</option>
                    ))}
                  </select>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm appearance-none bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="Sudah Dilaporkan">Sudah Dilaporkan</option>
                  <option value="Belum Dilaporkan">Belum Dilaporkan</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pimpinan</TableHead>
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Tempat</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{item.pimpinan_nama}</p>
                        <p className="text-xs text-gray-500">{item.pimpinan_jabatan}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{item.judul_kegiatan}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(item.tanggal).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500">{item.waktu}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm max-w-xs truncate">{item.tempat}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">{item.jumlah_progress} update</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status_laporan)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Link to={`/dashboard/detail-laporan-staf-media/${item.id}`}>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Tidak ada laporan yang ditemukan</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredData.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.judul_kegiatan}</h4>
                        <p className="text-xs text-gray-600">
                          {item.pimpinan_nama} · {item.pimpinan_jabatan}
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
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600">{item.jumlah_progress} update</span>
                    </div>
                    <Link to={`/dashboard/detail-laporan-staf-media/${item.id}`}>
                      <Button variant="outline" size="sm">
                        Lihat <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Tidak ada laporan yang ditemukan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
