import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Eye, Search, Filter, CheckCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react';

export default function MonitorPenugasanPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // HANYA untuk jenis Protokol
  const penugasanStaf = [
    {
      id: 1,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Bertugas mengatur protokoler acara, koordinasi dengan MC dan setting tempat duduk pimpinan',
      agenda_terkait: 'Rapat Koordinasi Bulanan OPD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal_kegiatan: '2026-02-10',
      waktu: '09:00 - 12:00',
      lokasi: 'Ruang Rapat Utama',
      nama_staf: ['Ahmad Hidayat', 'Budi Santoso'],
      tanggal_penugasan: '2026-02-05',
      status_pelaksanaan: 'Selesai',
      progress: [
        {
          tipe: 'Persiapan Awal',
          keterangan: 'Survey lokasi dan persiapan peralatan protokoler',
          tanggal: '2026-02-08 10:00',
          dokumentasi: ['foto1.jpg', 'foto2.jpg']
        },
        {
          tipe: 'Pelaksanaan',
          keterangan: 'Koordinasi protokoler berjalan lancar, pimpinan hadir tepat waktu',
          tanggal: '2026-02-10 09:00',
          dokumentasi: ['foto3.jpg', 'foto4.jpg', 'foto5.jpg']
        },
        {
          tipe: 'Selesai',
          keterangan: 'Acara selesai, dokumentasi telah diserahkan',
          tanggal: '2026-02-10 12:30',
          dokumentasi: ['foto6.jpg']
        }
      ]
    },
    {
      id: 2,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Koordinasi protokoler kunjungan, persiapan sambutan dan pengawalan pimpinan',
      agenda_terkait: 'Kunjungan Kerja ke Dinas Kesehatan',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal_kegiatan: '2026-02-12',
      waktu: '10:00 - 11:30',
      lokasi: 'Kantor Dinas Kesehatan',
      nama_staf: ['Eko Prasetyo'],
      tanggal_penugasan: '2026-02-06',
      status_pelaksanaan: 'Berlangsung',
      progress: [
        {
          tipe: 'Persiapan',
          keterangan: 'Koordinasi dengan Dinas Kesehatan sudah dilakukan',
          tanggal: '2026-02-09 14:00',
          dokumentasi: []
        },
        {
          tipe: 'Briefing',
          keterangan: 'Briefing dengan pimpinan selesai dilakukan',
          tanggal: '2026-02-11 16:00',
          dokumentasi: ['briefing.jpg']
        }
      ]
    },
    {
      id: 3,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Persiapan dan pelaksanaan protokoler upacara pelantikan',
      agenda_terkait: 'Pelantikan Kepala Dinas',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal_kegiatan: '2026-02-20',
      waktu: '10:00 - 12:00',
      lokasi: 'Aula Kantor Walikota',
      nama_staf: ['Bambang Wijaya', 'Dewi Lestari', 'Farhan Saputra'],
      tanggal_penugasan: '2026-02-10',
      status_pelaksanaan: 'Belum Dimulai',
      progress: [
        {
          tipe: 'Rapat Koordinasi',
          keterangan: 'Rapat koordinasi awal dengan tim pelaksana',
          tanggal: '2026-02-11 09:00',
          dokumentasi: []
        }
      ]
    },
    {
      id: 4,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Mengatur protokoler acara peresmian dan koordinasi dengan instansi terkait',
      agenda_terkait: 'Peresmian Jalan Tol Baru',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal_kegiatan: '2026-02-16',
      waktu: '08:00 - 10:00',
      lokasi: 'Gerbang Tol Sukamaju',
      nama_staf: ['Ahmad Hidayat', 'Eko Prasetyo'],
      tanggal_penugasan: '2026-02-07',
      status_pelaksanaan: 'Berlangsung',
      progress: [
        {
          tipe: 'Survey Lokasi',
          keterangan: 'Survey lokasi acara dan koordinasi dengan PT Jasa Marga',
          tanggal: '2026-02-09 10:00',
          dokumentasi: ['survey1.jpg', 'survey2.jpg']
        },
        {
          tipe: 'Persiapan Teknis',
          keterangan: 'Persiapan panggung, sound system, dan tata letak',
          tanggal: '2026-02-13 14:00',
          dokumentasi: ['persiapan1.jpg']
        }
      ]
    }
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

  const filteredPenugasan = penugasanStaf.filter(penugasan => {
    const matchesSearch = 
      penugasan.nama_staf.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ||
      penugasan.agenda_terkait.toLowerCase().includes(searchTerm.toLowerCase()) ||
      penugasan.deskripsi_penugasan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || penugasan.status_pelaksanaan === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const statsSelesai = penugasanStaf.filter(p => p.status_pelaksanaan === 'Selesai').length;
  const statsBerlangsung = penugasanStaf.filter(p => p.status_pelaksanaan === 'Berlangsung').length;
  const statsBelumDimulai = penugasanStaf.filter(p => p.status_pelaksanaan === 'Belum Dimulai').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Monitor Penugasan Protokol</h1>
        <p className="text-sm text-gray-600 mt-1">Pantau progress penugasan staf protokol untuk agenda pimpinan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Penugasan</p>
                <p className="text-2xl font-semibold text-blue-600">{penugasanStaf.length}</p>
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
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Penugasan ({filteredPenugasan.length})</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari penugasan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agenda</TableHead>
                <TableHead>Staf Ditugaskan</TableHead>
                <TableHead>Tanggal Kegiatan</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPenugasan.map((penugasan) => (
                <TableRow key={penugasan.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{penugasan.agenda_terkait}</p>
                      <p className="text-xs text-gray-500">👤 {penugasan.pimpinan}</p>
                      <p className="text-xs text-gray-500">📍 {penugasan.lokasi}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {penugasan.nama_staf.map((staf, idx) => (
                        <p key={idx} className="text-sm text-gray-900">{staf}</p>
                      ))}
                      <Badge variant="info" className="text-xs mt-1">{penugasan.jenis_penugasan}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(penugasan.tanggal_kegiatan).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{penugasan.waktu}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">{penugasan.progress.length} update</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(penugasan.status_pelaksanaan)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/dashboard/detail-penugasan/${penugasan.id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPenugasan.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Tidak ada penugasan protokol yang ditemukan
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