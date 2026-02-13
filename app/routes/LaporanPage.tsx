import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Eye, Upload, Search, FileText } from 'lucide-react';

export default function LaporanPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const laporanKegiatan = [
    {
      id: 1,
      agenda_terkait: 'Rapat Koordinasi Bulanan',
      tanggal_kegiatan: '2025-02-01',
      staf_pelapor: 'Ahmad Hidayat',
      role_staf: 'Staf Protokol',
      deskripsi_laporan: 'Pelaksanaan rapat berjalan lancar, dihadiri 45 peserta',
      catatan_laporan: 'Semua protokol terlaksana dengan baik',
      dokumentasi_count: 12,
      tanggal_laporan: '2025-02-01',
      status_laporan: 'Approved'
    },
    {
      id: 2,
      agenda_terkait: 'Kunjungan Kerja Dinas Pendidikan',
      tanggal_kegiatan: '2025-02-03',
      staf_pelapor: 'Siti Nurhaliza',
      role_staf: 'Staf Media',
      deskripsi_laporan: 'Dokumentasi lengkap dengan 25 foto dan 3 video',
      catatan_laporan: 'Semua momen penting berhasil didokumentasikan',
      dokumentasi_count: 28,
      tanggal_laporan: '2025-02-03',
      status_laporan: 'Pending Review'
    },
    {
      id: 3,
      agenda_terkait: 'Upacara Peringatan Hari Kemerdekaan',
      tanggal_kegiatan: '2025-02-05',
      staf_pelapor: 'Budi Santoso',
      role_staf: 'Staf Protokol',
      deskripsi_laporan: 'Koordinasi upacara berjalan sesuai rencana',
      catatan_laporan: 'Tidak ada kendala berarti',
      dokumentasi_count: 5,
      tanggal_laporan: '2025-02-05',
      status_laporan: 'Approved'
    },
    {
      id: 4,
      agenda_terkait: 'Upacara Peringatan Hari Kemerdekaan',
      tanggal_kegiatan: '2025-02-05',
      staf_pelapor: 'Dewi Lestari',
      role_staf: 'Staf Media',
      deskripsi_laporan: 'Dokumentasi foto dan video upacara',
      catatan_laporan: null,
      dokumentasi_count: 35,
      tanggal_laporan: '2025-02-05',
      status_laporan: 'Pending Review'
    },
    {
      id: 5,
      agenda_terkait: 'Rapat Koordinasi Bulanan',
      tanggal_kegiatan: '2025-02-01',
      staf_pelapor: 'Eko Prasetyo',
      role_staf: 'Staf Protokol',
      deskripsi_laporan: 'Persiapan ruangan dan perlengkapan rapat',
      catatan_laporan: 'Semua persiapan selesai 30 menit sebelum acara',
      dokumentasi_count: 8,
      tanggal_laporan: '2025-02-01',
      status_laporan: 'Approved'
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending Review': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'default';
    }
  };

  const filteredLaporan = laporanKegiatan.filter(laporan => {
    const matchesSearch = laporan.agenda_terkait.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         laporan.staf_pelapor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         laporan.deskripsi_laporan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || laporan.status_laporan === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statsTotal = laporanKegiatan.length;
  const statsApproved = laporanKegiatan.filter(l => l.status_laporan === 'Approved').length;
  const statsPending = laporanKegiatan.filter(l => l.status_laporan === 'Pending Review').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Laporan & Dokumentasi</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola laporan kegiatan dan dokumentasi</p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Laporan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Laporan</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{statsTotal}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disetujui</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{statsApproved}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{statsPending}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari agenda, staf, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        >
          <option value="all">Semua Status</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Daftar Laporan Kegiatan</h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agenda Terkait</TableHead>
                <TableHead>Tanggal Kegiatan</TableHead>
                <TableHead>Staf Pelapor</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Dokumentasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLaporan.map((laporan) => (
                <TableRow key={laporan.id}>
                  <TableCell className="font-medium">{laporan.agenda_terkait}</TableCell>
                  <TableCell>
                    {new Date(laporan.tanggal_kegiatan).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>{laporan.staf_pelapor}</TableCell>
                  <TableCell className="text-sm text-gray-600">{laporan.role_staf}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{laporan.deskripsi_laporan}</p>
                    {laporan.catatan_laporan && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {laporan.catatan_laporan}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{laporan.dokumentasi_count} file</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(laporan.status_laporan)}>
                      {laporan.status_laporan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
