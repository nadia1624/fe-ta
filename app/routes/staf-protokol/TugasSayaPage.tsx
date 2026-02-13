import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Calendar, Clock, MapPin, User, ClipboardList, Eye } from 'lucide-react';

export default function TugasSayaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBulan, setFilterBulan] = useState('2026-02');

  // Tugas dengan progress management
  const tugasList = [
    {
      id: 1,
      agenda_id: 1,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      tanggal: '2026-02-05',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama',
      status: 'Selesai',
      jumlah_progress: 3,
      pelapor: 'Staf Protokol - Budi Santoso',
      last_update: '2026-02-05 12:15',
      penugasan_dari: 'Kasubag Protokol - Drs. Budi Hartono',
      tanggal_penugasan: '2026-02-01',
      instruksi: 'Pastikan protokoler penyambutan berjalan sesuai SOP. Koordinasi dengan MC untuk rundown acara.'
    },
    {
      id: 2,
      agenda_id: 2,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      tanggal: '2026-02-05',
      waktu: '14:00 - 16:00',
      tempat: 'Kantor Dinas Kesehatan',
      status: 'Berlangsung',
      jumlah_progress: 2,
      pelapor: 'Staf Protokol - Budi Santoso',
      last_update: '2026-02-05 14:10',
      penugasan_dari: 'Kasubag Protokol - Drs. Budi Hartono',
      tanggal_penugasan: '2026-02-03',
      instruksi: 'Koordinasi dengan pihak Dinkes untuk protokoler penyambutan. Pastikan dokumentasi lengkap.'
    },
    {
      id: 3,
      agenda_id: 3,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Launching Program Smart City',
      tanggal: '2026-02-05',
      waktu: '19:00 - 21:00',
      tempat: 'Gedung Serbaguna',
      status: 'Belum Dimulai',
      jumlah_progress: 1,
      pelapor: 'Staf Protokol - Ani Wijaya',
      last_update: '2026-02-05 09:00',
      penugasan_dari: 'Kasubag Protokol - Drs. Budi Hartono',
      tanggal_penugasan: '2026-02-02',
      instruksi: 'Koordinasi dengan pihak venue untuk protokoler acara malam. Pastikan sound system dan lighting sudah ditest.'
    },
    {
      id: 4,
      agenda_id: 4,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Peresmian Gedung Baru RSUD',
      tanggal: '2026-02-10',
      waktu: '10:00 - 12:00',
      tempat: 'RSUD Kota',
      status: 'Belum Dimulai',
      jumlah_progress: 1,
      pelapor: 'Staf Protokol - Citra Dewi',
      last_update: '2026-02-08 15:30',
      penugasan_dari: 'Kasubag Protokol - Drs. Budi Hartono',
      tanggal_penugasan: '2026-02-01',
      instruksi: 'Survey lokasi dan koordinasi dengan pihak RSUD untuk protokoler peresmian. Perhatikan jalur VIP untuk pimpinan.'
    },
    {
      id: 5,
      agenda_id: 5,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Rapat dengan DPRD',
      tanggal: '2026-02-12',
      waktu: '13:00 - 16:00',
      tempat: 'Gedung DPRD',
      status: 'Belum Dimulai',
      jumlah_progress: 0,
      pelapor: '-',
      last_update: '-',
      penugasan_dari: 'Kasubag Protokol - Drs. Budi Hartono',
      tanggal_penugasan: '2026-02-04',
      instruksi: 'Koordinasi dengan protokol DPRD untuk penyambutan. Pastikan formasi duduk sesuai tata tertib.'
    },
    {
      id: 6,
      agenda_id: 6,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Pembukaan Festival Seni Budaya',
      tanggal: '2026-02-15',
      waktu: '08:00 - 10:00',
      tempat: 'Lapangan Utama Kota',
      status: 'Belum Dimulai',
      jumlah_progress: 0,
      pelapor: '-',
      last_update: '-',
      penugasan_dari: 'Kasubag Protokol - Drs. Budi Hartono',
      tanggal_penugasan: '2026-02-05',
      instruksi: 'Koordinasi protokol upacara pembukaan festival. Pastikan panggung dan jalur pimpinan aman.'
    },
  ];

  const filteredData = tugasList.filter(item => {
    const matchSearch = 
      item.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pimpinan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tempat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchBulan = item.tanggal.startsWith(filterBulan);
    
    return matchSearch && matchStatus && matchBulan;
  });

  const totalTugas = filteredData.length;
  const belumDimulai = filteredData.filter(t => t.status === 'Belum Dimulai').length;
  const berlangsung = filteredData.filter(t => t.status === 'Berlangsung').length;
  const selesai = filteredData.filter(t => t.status === 'Selesai').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Berlangsung':
        return <Badge variant="info">Berlangsung</Badge>;
      case 'Selesai':
        return <Badge variant="success">Selesai</Badge>;
      case 'Belum Dimulai':
        return <Badge variant="warning">Belum Dimulai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Tugas Saya</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">
          Penugasan protokol dari Kasubag dengan pengelolaan progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs text-gray-600 mb-1">Total Tugas</p>
            <p className="text-2xl md:text-3xl font-semibold text-blue-600">{totalTugas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs text-gray-600 mb-1">Belum Dimulai</p>
            <p className="text-2xl md:text-3xl font-semibold text-orange-600">{belumDimulai}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs text-gray-600 mb-1">Berlangsung</p>
            <p className="text-2xl md:text-3xl font-semibold text-blue-600">{berlangsung}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs text-gray-600 mb-1">Selesai</p>
            <p className="text-2xl md:text-3xl font-semibold text-green-600">{selesai}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Daftar Tugas ({filteredData.length})
            </h3>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari tugas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm w-full"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white w-full md:w-auto"
                >
                  <option value="all">Semua Status</option>
                  <option value="Belum Dimulai">Belum Dimulai</option>
                  <option value="Berlangsung">Berlangsung</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <input
                type="month"
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm w-full md:w-auto"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {filteredData.map((tugas) => (
              <div key={tugas.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm md:text-base text-gray-900">{tugas.judul_kegiatan}</h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      <User className="w-3 h-3 inline mr-1" />
                      {tugas.pimpinan} · {tugas.jabatan}
                    </p>
                    <p className="text-xs text-blue-600">
                      <strong>Penugasan dari:</strong> {tugas.penugasan_dari}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tanggal penugasan: {new Date(tugas.tanggal_penugasan).toLocaleDateString('id-ID', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  {getStatusBadge(tugas.status)}
                </div>

                {/* Instruksi */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3 mb-3">
                  <p className="text-xs font-medium text-blue-900 mb-1">📋 Instruksi:</p>
                  <p className="text-xs text-blue-800">{tugas.instruksi}</p>
                </div>

                {/* Info Kegiatan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>
                      {new Date(tugas.tanggal).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{tugas.waktu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="truncate">{tugas.tempat}</span>
                  </div>
                </div>

                {/* Progress Info */}
                <div className={`${tugas.jumlah_progress > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'} border rounded-lg p-2 md:p-3 mb-3`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ClipboardList className={`w-4 h-4 ${tugas.jumlah_progress > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className="text-xs font-medium text-gray-700">
                        {tugas.jumlah_progress > 0 
                          ? `${tugas.jumlah_progress} Progress Dilaporkan` 
                          : 'Belum Ada Progress'}
                      </span>
                    </div>
                    {tugas.jumlah_progress > 0 && (
                      <Badge variant="success" className="text-xs w-fit">{tugas.jumlah_progress}</Badge>
                    )}
                  </div>
                  {tugas.last_update !== '-' && (
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-xs text-gray-600">
                        Update terakhir: {new Date(tugas.last_update).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div>
                  <Link to={`/dashboard/detail-agenda-protokol/${tugas.agenda_id}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Detail Agenda
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Tidak ada tugas yang ditemukan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
