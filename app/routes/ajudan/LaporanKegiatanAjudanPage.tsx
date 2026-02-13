import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eye, X, Search, Filter, Calendar, MapPin, Users, FileText, Image as ImageIcon } from 'lucide-react';

export default function LaporanKegiatanAjudanPage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Ajudan hanya melihat agenda untuk pimpinan yang dia handle
  const currentPimpinan = 'Dr. H. Ahmad Suryadi, M.Si - Walikota';

  const laporanKegiatan = [
    {
      id: 1,
      jadwal_id: 'JDW-001',
      kegiatan: 'Kunjungan Kerja ke Kecamatan Sukamaju',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si - Walikota',
      tanggal: '2026-02-01',
      waktu: '09:00 - 12:00',
      lokasi: 'Kantor Kecamatan Sukamaju',
      status_kehadiran: 'Hadir',
      jumlah_progress: 3,
      staf_assigned: ['Budi Santoso', 'Ani Wijaya'],
      last_updated: '2026-02-01 11:45',
      progress_reports: [
        {
          id: 1,
          tipe: 'Persiapan',
          deskripsi: 'Persiapan acara dan briefing dengan panitia lokal',
          waktu: '08:30',
          foto_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
          pelapor: 'Budi Santoso'
        },
        {
          id: 2,
          tipe: 'Pelaksanaan',
          deskripsi: 'Walikota tiba di lokasi dan sambutan dari Camat',
          waktu: '09:15',
          foto_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
          pelapor: 'Ani Wijaya'
        },
        {
          id: 3,
          tipe: 'Penutupan',
          deskripsi: 'Serah terima bantuan dan foto bersama masyarakat',
          waktu: '11:30',
          foto_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
          pelapor: 'Budi Santoso'
        }
      ]
    },
    {
      id: 2,
      jadwal_id: 'JDW-002',
      kegiatan: 'Rapat Koordinasi SKPD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si - Walikota',
      tanggal: '2026-01-29',
      waktu: '13:00 - 15:00',
      lokasi: 'Ruang Rapat Utama',
      status_kehadiran: 'Hadir',
      jumlah_progress: 2,
      staf_assigned: ['Citra Dewi'],
      last_updated: '2026-01-29 14:50',
      progress_reports: [
        {
          id: 1,
          tipe: 'Pembukaan',
          deskripsi: 'Pembukaan rapat oleh Walikota',
          waktu: '13:10',
          foto_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
          pelapor: 'Citra Dewi'
        },
        {
          id: 2,
          tipe: 'Penutupan',
          deskripsi: 'Kesimpulan dan arahan Walikota',
          waktu: '14:45',
          foto_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
          pelapor: 'Citra Dewi'
        }
      ]
    },
    {
      id: 3,
      jadwal_id: 'JDW-003',
      kegiatan: 'Peresmian Gedung PAUD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si - Walikota',
      tanggal: '2026-01-25',
      waktu: '09:00 - 11:00',
      lokasi: 'PAUD Ceria Mekar Jaya',
      status_kehadiran: 'Diwakilkan',
      perwakilan: 'Ir. Hj. Siti Rahmawati, M.T - Wakil Walikota',
      jumlah_progress: 4,
      staf_assigned: ['Eko Prasetyo'],
      last_updated: '2026-01-25 11:00',
      progress_reports: [
        {
          id: 1,
          tipe: 'Kedatangan',
          deskripsi: 'Wakil Walikota tiba di lokasi',
          waktu: '09:00',
          foto_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
          pelapor: 'Eko Prasetyo'
        },
        {
          id: 2,
          tipe: 'Sambutan',
          deskripsi: 'Sambutan dari pihak sekolah dan Wakil Walikota',
          waktu: '09:20',
          foto_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
          pelapor: 'Eko Prasetyo'
        },
        {
          id: 3,
          tipe: 'Peresmian',
          deskripsi: 'Pemotongan pita dan peresmian gedung',
          waktu: '10:00',
          foto_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
          pelapor: 'Eko Prasetyo'
        },
        {
          id: 4,
          tipe: 'Penutupan',
          deskripsi: 'Penutupan acara dan foto bersama',
          waktu: '10:45',
          foto_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
          pelapor: 'Eko Prasetyo'
        }
      ]
    }
  ];

  const handleDetail = (laporan: any) => {
    setSelectedLaporan(laporan);
    setShowDetailModal(true);
  };

  const filteredData = laporanKegiatan.filter(item => {
    // Filter hanya pimpinan yang di-handle ajudan ini
    if (item.pimpinan !== currentPimpinan) return false;

    const matchSearch = 
      item.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jadwal_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || item.status_kehadiran === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hadir':
        return <Badge variant="success">Hadir</Badge>;
      case 'Diwakilkan':
        return <Badge variant="info">Diwakilkan</Badge>;
      case 'Tidak Hadir':
        return <Badge variant="danger">Tidak Hadir</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Laporan Kegiatan</h1>
        <p className="text-sm text-gray-600 mt-1">Lihat laporan kegiatan untuk {currentPimpinan}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Kegiatan</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {laporanKegiatan.filter(l => l.pimpinan === currentPimpinan).length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hadir</p>
                <p className="text-2xl font-semibold text-green-600">
                  {laporanKegiatan.filter(l => l.pimpinan === currentPimpinan && l.status_kehadiran === 'Hadir').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Diwakilkan</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {laporanKegiatan.filter(l => l.pimpinan === currentPimpinan && l.status_kehadiran === 'Diwakilkan').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Laporan ({filteredData.length})</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari laporan..."
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
                  <option value="Hadir">Hadir</option>
                  <option value="Diwakilkan">Diwakilkan</option>
                  <option value="Tidak Hadir">Tidak Hadir</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredData.map((laporan) => (
              <div key={laporan.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{laporan.kegiatan}</h4>
                          {getStatusBadge(laporan.status_kehadiran)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{laporan.pimpinan}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(laporan.tanggal).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span>•</span>
                          <span>{laporan.waktu}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {laporan.lokasi}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline">
                            {laporan.jumlah_progress} Progress Report
                          </Badge>
                          <span className="text-gray-500">
                            Staf: {laporan.staf_assigned.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDetail(laporan)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Detail
                  </Button>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada laporan yang ditemukan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Detail */}
      {showDetailModal && selectedLaporan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedLaporan.kegiatan}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedLaporan.jadwal_id}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Info Kegiatan */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Informasi Kegiatan</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Pimpinan</label>
                      <p className="text-sm text-gray-900">{selectedLaporan.pimpinan}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Status Kehadiran</label>
                      <div className="mt-1">{getStatusBadge(selectedLaporan.status_kehadiran)}</div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Tanggal</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedLaporan.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Waktu</label>
                      <p className="text-sm text-gray-900">{selectedLaporan.waktu}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-600">Lokasi</label>
                      <p className="text-sm text-gray-900">{selectedLaporan.lokasi}</p>
                    </div>
                    {selectedLaporan.perwakilan && (
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-gray-600">Diwakilkan Oleh</label>
                        <p className="text-sm text-gray-900">{selectedLaporan.perwakilan}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-gray-600">Staf yang Ditugaskan</label>
                      <p className="text-sm text-gray-900">{selectedLaporan.staf_assigned.join(', ')}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Last Updated</label>
                      <p className="text-sm text-gray-900">{selectedLaporan.last_updated}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Reports */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Progress Reports ({selectedLaporan.progress_reports.length})
                  </h4>
                  <div className="space-y-4">
                    {selectedLaporan.progress_reports.map((progress: any, index: number) => (
                      <div key={progress.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{progress.tipe}</Badge>
                              <span className="text-xs text-gray-500">{progress.waktu}</span>
                            </div>
                            <p className="text-sm text-gray-900 mb-2">{progress.deskripsi}</p>
                            <p className="text-xs text-gray-500 mb-3">Pelapor: {progress.pelapor}</p>
                            {progress.foto_url && (
                              <div className="mt-3">
                                <img
                                  src={progress.foto_url}
                                  alt={progress.tipe}
                                  className="w-full max-w-md h-48 object-cover rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                    Tutup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
