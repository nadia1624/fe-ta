import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Calendar, Clock, MapPin, FileText, ArrowRight } from 'lucide-react';

export default function PenugasanPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const penugasanList = [
    {
      id: 1,
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal: '2026-02-05',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama',
      status_draft: 'Pending Review',
      deadline: '2026-02-05 18:00'
    },
    {
      id: 2,
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal: '2026-02-05',
      waktu: '14:00 - 16:00',
      tempat: 'Kantor Dinas Kesehatan',
      status_draft: 'Belum Upload',
      deadline: '2026-02-05 20:00'
    },
    {
      id: 3,
      judul_kegiatan: 'Launching Program Smart City',
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      tanggal: '2026-02-03',
      waktu: '19:00 - 21:00',
      tempat: 'Gedung Serbaguna',
      status_draft: 'Disetujui',
      deadline: '2026-02-03 23:00'
    },
    {
      id: 4,
      judul_kegiatan: 'Peresmian Gedung Baru RSUD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal: '2026-02-01',
      waktu: '10:00 - 12:00',
      tempat: 'RSUD Kota',
      status_draft: 'Perlu Revisi',
      deadline: '2026-02-01 20:00'
    },
  ];

  const filteredData = penugasanList.filter(item => {
    const matchSearch = 
      item.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pimpinan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tempat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || item.status_draft === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Belum Upload':
        return <Badge variant="warning">Belum Upload</Badge>;
      case 'Pending Review':
        return <Badge variant="info">Pending Review</Badge>;
      case 'Disetujui':
        return <Badge variant="success">Disetujui</Badge>;
      case 'Perlu Revisi':
        return <Badge variant="danger">Perlu Revisi</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalTugas = penugasanList.length;
  const belumUpload = penugasanList.filter(p => p.status_draft === 'Belum Upload').length;
  const pendingReview = penugasanList.filter(p => p.status_draft === 'Pending Review').length;
  const disetujui = penugasanList.filter(p => p.status_draft === 'Disetujui').length;

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Penugasan Saya</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Daftar tugas dokumentasi dan publikasi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs text-gray-600 mb-1">Total Tugas</p>
            <p className="text-2xl md:text-3xl font-semibold text-purple-600">{totalTugas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs text-gray-600 mb-1">Belum Upload</p>
            <p className="text-2xl md:text-3xl font-semibold text-orange-600">{belumUpload}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs text-gray-600 mb-1">Pending Review</p>
            <p className="text-2xl md:text-3xl font-semibold text-blue-600">{pendingReview}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs text-gray-600 mb-1">Disetujui</p>
            <p className="text-2xl md:text-3xl font-semibold text-green-600">{disetujui}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Daftar Penugasan ({filteredData.length})
            </h3>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari penugasan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm w-full"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm appearance-none bg-white w-full"
                >
                  <option value="all">Semua Status</option>
                  <option value="Belum Upload">Belum Upload</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Perlu Revisi">Perlu Revisi</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View - Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredData.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.judul_kegiatan}</h4>
                    <p className="text-xs text-gray-600">{item.pimpinan}</p>
                  </div>
                  {getStatusBadge(item.status_draft)}
                </div>
                
                <div className="space-y-2 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{item.waktu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{item.tempat}</span>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-3">
                  <p className="text-xs text-orange-800">
                    <strong>Deadline:</strong> {new Date(item.deadline).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <Link to={`/dashboard/upload-draft/${item.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {item.status_draft === 'Belum Upload' ? 'Upload Draft' : 
                     item.status_draft === 'Perlu Revisi' ? 'Upload Revisi' : 'Lihat Detail'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Pimpinan</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Tempat</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{item.judul_kegiatan}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{item.pimpinan}</p>
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
                      <p className="text-xs text-orange-700">
                        {new Date(item.deadline).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status_draft)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Link to={`/dashboard/upload-draft/${item.id}`}>
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
                      Tidak ada penugasan yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
