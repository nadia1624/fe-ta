import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowRight, Search, Filter, TrendingUp, ChevronDown } from 'lucide-react';
import CustomSelect from '../../components/ui/CustomSelect';

export default function LaporanKegiatanPage() {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Laporan Kegiatan</h1>
        <p className="text-sm text-gray-600 mt-1">Laporan dokumentasi dan hasil kegiatan pimpinan (Read Only)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Agenda</p>
                <p className="text-3xl font-semibold text-purple-600">{totalLaporan}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sudah Dilaporkan</p>
                <p className="text-3xl font-semibold text-green-600">{sudahDilaporkan}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Belum Dilaporkan</p>
                <p className="text-3xl font-semibold text-orange-600">{belumDilaporkan}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Laporan Kegiatan ({filteredData.length})</h3>
            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-2 md:gap-3">
              <div className="relative group flex-1 md:flex-none md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari laporan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-blue-100 bg-white rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm shadow-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <CustomSelect
                  value={filterPimpinan}
                  onChange={setFilterPimpinan}
                  options={[
                    { value: 'all', label: 'Semua Pimpinan' },
                    ...pimpinanList.map(p => ({ value: p, label: p }))
                  ]}
                  icon={<Filter className="w-4 h-4" />}
                  className="w-full sm:w-56"
                  placeholder="Pilih Pimpinan"
                />
                <CustomSelect
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={[
                    { value: 'all', label: 'Semua Status' },
                    { value: 'Sudah Dilaporkan', label: 'Sudah Dilaporkan' },
                    { value: 'Belum Dilaporkan', label: 'Belum Dilaporkan' }
                  ]}
                  icon={<Filter className="w-4 h-4" />}
                  className="w-full sm:w-52"
                  placeholder="Pilih Status"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
                    <p className="text-sm">{item.tempat}</p>
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
                      <Link to={`/kasubag-media/laporan-kegiatan/${item.id}`}>
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
                    Tidak ada laporan yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
