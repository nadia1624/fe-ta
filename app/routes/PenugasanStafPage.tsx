import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Plus, Users, Search } from 'lucide-react';

export default function PenugasanStafPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const penugasanStaf = [
    {
      id: 1,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Persiapan dan pelaksanaan protokoler rapat koordinasi',
      agenda_terkait: 'Rapat Koordinasi Bulanan',
      tanggal_kegiatan: '2025-02-01',
      nama_staf: 'Ahmad Hidayat',
      role_staf: 'Staf Protokol',
      tanggal_penugasan: '2025-01-28',
      status_pelaksanaan: 'On Progress'
    },
    {
      id: 2,
      jenis_penugasan: 'Media',
      deskripsi_penugasan: 'Dokumentasi foto dan video kegiatan',
      agenda_terkait: 'Kunjungan Kerja Dinas Pendidikan',
      tanggal_kegiatan: '2025-02-03',
      nama_staf: 'Siti Nurhaliza',
      role_staf: 'Staf Media',
      tanggal_penugasan: '2025-01-29',
      status_pelaksanaan: 'Not Started'
    },
    {
      id: 3,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Koordinasi pelaksanaan upacara',
      agenda_terkait: 'Upacara Peringatan Hari Kemerdekaan',
      tanggal_kegiatan: '2025-02-05',
      nama_staf: 'Budi Santoso',
      role_staf: 'Staf Protokol',
      tanggal_penugasan: '2025-01-27',
      status_pelaksanaan: 'On Progress'
    },
    {
      id: 4,
      jenis_penugasan: 'Media',
      deskripsi_penugasan: 'Liputan dan dokumentasi upacara',
      agenda_terkait: 'Upacara Peringatan Hari Kemerdekaan',
      tanggal_kegiatan: '2025-02-05',
      nama_staf: 'Dewi Lestari',
      role_staf: 'Staf Media',
      tanggal_penugasan: '2025-01-27',
      status_pelaksanaan: 'Not Started'
    },
    {
      id: 5,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Persiapan acara penerimaan tamu',
      agenda_terkait: 'Rapat Koordinasi Bulanan',
      tanggal_kegiatan: '2025-02-01',
      nama_staf: 'Eko Prasetyo',
      role_staf: 'Staf Protokol',
      tanggal_penugasan: '2025-01-25',
      status_pelaksanaan: 'Completed'
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'On Progress': return 'info';
      case 'Not Started': return 'warning';
      default: return 'default';
    }
  };

  const filteredPenugasan = penugasanStaf.filter(penugasan => {
    const matchesSearch = penugasan.nama_staf.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         penugasan.agenda_terkait.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         penugasan.deskripsi_penugasan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || penugasan.role_staf === filterRole;
    return matchesSearch && matchesFilter;
  });

  const statsProtokol = penugasanStaf.filter(p => p.role_staf === 'Staf Protokol').length;
  const statsMedia = penugasanStaf.filter(p => p.role_staf === 'Staf Media').length;
  const statsCompleted = penugasanStaf.filter(p => p.status_pelaksanaan === 'Completed').length;
  const statsOnProgress = penugasanStaf.filter(p => p.status_pelaksanaan === 'On Progress').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Penugasan Staf</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola penugasan staf protokol dan media</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Staf Protokol</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{statsProtokol}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Staf Media</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{statsMedia}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{statsCompleted}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Progress</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{statsOnProgress}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
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
            placeholder="Cari staf, agenda, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        >
          <option value="all">Semua Role</option>
          <option value="Staf Protokol">Staf Protokol</option>
          <option value="Staf Media">Staf Media</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Daftar Penugasan</h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Agenda Terkait</TableHead>
                <TableHead>Nama Staf</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tanggal Kegiatan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPenugasan.map((penugasan) => (
                <TableRow key={penugasan.id}>
                  <TableCell>
                    <Badge variant={penugasan.jenis_penugasan === 'Protokol' ? 'info' : 'default'}>
                      {penugasan.jenis_penugasan}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{penugasan.deskripsi_penugasan}</p>
                  </TableCell>
                  <TableCell>{penugasan.agenda_terkait}</TableCell>
                  <TableCell className="font-medium">{penugasan.nama_staf}</TableCell>
                  <TableCell className="text-sm text-gray-600">{penugasan.role_staf}</TableCell>
                  <TableCell>
                    {new Date(penugasan.tanggal_kegiatan).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(penugasan.status_pelaksanaan)}>
                      {penugasan.status_pelaksanaan}
                    </Badge>
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