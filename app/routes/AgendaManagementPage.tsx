import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Eye, Edit, CheckCircle, Search } from 'lucide-react';
import AgendaDetailModal from '../components/modals/AgendaDetailModal';

export default function AgendaManagementPage() {
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const agendaList = [
    {
      id_agenda: 1,
      nomor_surat: '001/SP/I/2025',
      nama_kegiatan: 'Rapat Koordinasi Bulanan',
      tanggal_kegiatan: '2025-02-01',
      waktu_mulai: '09:00',
      waktu_selesai: '11:00',
      lokasi_kegiatan: 'Ruang Rapat Utama',
      status_agenda: 'Approved',
      catatan_verifikasi: 'Sudah diverifikasi dan disetujui',
      perihal: 'Rapat koordinasi program kerja bulan Februari',
      tanggal_surat: '2025-01-25',
      surat_permohonan: 'surat_001.pdf'
    },
    {
      id_agenda: 2,
      nomor_surat: '002/SP/I/2025',
      nama_kegiatan: 'Kunjungan Kerja Dinas Pendidikan',
      tanggal_kegiatan: '2025-02-03',
      waktu_mulai: '10:30',
      waktu_selesai: '12:30',
      lokasi_kegiatan: 'Aula Kantor Walikota',
      status_agenda: 'Pending',
      catatan_verifikasi: null,
      perihal: 'Permohonan audiensi terkait program pendidikan',
      tanggal_surat: '2025-01-26',
      surat_permohonan: 'surat_002.pdf'
    },
    {
      id_agenda: 3,
      nomor_surat: '003/SP/I/2025',
      nama_kegiatan: 'Upacara Peringatan Hari Kemerdekaan',
      tanggal_kegiatan: '2025-02-05',
      waktu_mulai: '08:00',
      waktu_selesai: '10:00',
      lokasi_kegiatan: 'Lapangan Upacara',
      status_agenda: 'Approved',
      catatan_verifikasi: 'Telah dikonfirmasi oleh Ajudan',
      perihal: 'Pelaksanaan upacara peringatan kemerdekaan',
      tanggal_surat: '2025-01-20',
      surat_permohonan: 'surat_003.pdf'
    },
    {
      id_agenda: 4,
      nomor_surat: '004/SP/I/2025',
      nama_kegiatan: 'Pertemuan dengan Camat Se-Kabupaten',
      tanggal_kegiatan: '2025-02-08',
      waktu_mulai: '13:00',
      waktu_selesai: '16:00',
      lokasi_kegiatan: 'Aula Kantor Bupati',
      status_agenda: 'Rejected',
      catatan_verifikasi: 'Bentrok dengan agenda prioritas lainnya',
      perihal: 'Koordinasi program pembangunan daerah',
      tanggal_surat: '2025-01-28',
      surat_permohonan: 'surat_004.pdf'
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'default';
    }
  };

  const filteredAgenda = agendaList.filter(agenda =>
    agenda.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agenda.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Agenda Management</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola dan verifikasi agenda kegiatan pimpinan</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Agenda</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari agenda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Surat</TableHead>
                <TableHead>Nama Kegiatan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgenda.map((agenda) => (
                <TableRow key={agenda.id_agenda}>
                  <TableCell className="font-medium">{agenda.nomor_surat}</TableCell>
                  <TableCell>{agenda.nama_kegiatan}</TableCell>
                  <TableCell>
                    {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    {agenda.waktu_mulai} - {agenda.waktu_selesai}
                  </TableCell>
                  <TableCell>{agenda.lokasi_kegiatan}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(agenda.status_agenda)}>
                      {agenda.status_agenda}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAgenda(agenda)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {agenda.status_agenda === 'Pending' && (
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedAgenda && (
        <AgendaDetailModal
          agenda={selectedAgenda}
          onClose={() => setSelectedAgenda(null)}
        />
      )}
    </div>
  );
}