import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Eye, CheckCircle, XCircle, Search } from 'lucide-react';

export default function SuratPermohonanPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const suratPermohonan = [
    {
      id: 1,
      nomor_surat: '001/SP/I/2025',
      pemohon: 'Kepala Dinas Pendidikan',
      instansi_pemohon: 'Dinas Pendidikan Kabupaten',
      tanggal_surat: '2025-01-25',
      perihal: 'Permohonan audiensi terkait program pendidikan',
      status_agenda: 'Approved',
      tanggal_kegiatan_diajukan: '2025-02-03'
    },
    {
      id: 2,
      nomor_surat: '002/SP/I/2025',
      pemohon: 'Ketua DPRD',
      instansi_pemohon: 'DPRD Kabupaten',
      tanggal_surat: '2025-01-26',
      perihal: 'Rapat koordinasi program kerja DPRD',
      status_agenda: 'Pending',
      tanggal_kegiatan_diajukan: '2025-02-10'
    },
    {
      id: 3,
      nomor_surat: '003/SP/I/2025',
      pemohon: 'Kepala Dinas Kesehatan',
      instansi_pemohon: 'Dinas Kesehatan Kabupaten',
      tanggal_surat: '2025-01-27',
      perihal: 'Permohonan penandatanganan MoU Rumah Sakit',
      status_agenda: 'Pending',
      tanggal_kegiatan_diajukan: '2025-02-12'
    },
    {
      id: 4,
      nomor_surat: '004/SP/I/2025',
      pemohon: 'Ketua Ormas Pemuda',
      instansi_pemohon: 'Organisasi Kepemudaan',
      tanggal_surat: '2025-01-28',
      perihal: 'Permohonan dukungan kegiatan bakti sosial',
      status_agenda: 'Rejected',
      tanggal_kegiatan_diajukan: '2025-02-08'
    },
    {
      id: 5,
      nomor_surat: '005/SP/I/2025',
      pemohon: 'Camat Sukamaju',
      instansi_pemohon: 'Kecamatan Sukamaju',
      tanggal_surat: '2025-01-29',
      perihal: 'Permohonan kunjungan kerja Walikota ke Kecamatan',
      status_agenda: 'Pending',
      tanggal_kegiatan_diajukan: '2025-02-15'
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

  const filteredSurat = suratPermohonan.filter(surat => {
    const matchesSearch = surat.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surat.pemohon.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surat.perihal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || surat.status_agenda === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Surat Permohonan</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola surat permohonan agenda kegiatan</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nomor surat, pemohon, atau perihal..."
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
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Daftar Surat Permohonan</h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Surat</TableHead>
                <TableHead>Pemohon</TableHead>
                <TableHead>Instansi</TableHead>
                <TableHead>Tanggal Surat</TableHead>
                <TableHead>Perihal</TableHead>
                <TableHead>Tanggal Kegiatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSurat.map((surat) => (
                <TableRow key={surat.id}>
                  <TableCell className="font-medium">{surat.nomor_surat}</TableCell>
                  <TableCell>{surat.pemohon}</TableCell>
                  <TableCell className="text-sm text-gray-600">{surat.instansi_pemohon}</TableCell>
                  <TableCell>
                    {new Date(surat.tanggal_surat).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{surat.perihal}</p>
                  </TableCell>
                  <TableCell>
                    {new Date(surat.tanggal_kegiatan_diajukan).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(surat.status_agenda)}>
                      {surat.status_agenda}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {surat.status_agenda === 'Pending' && (
                        <>
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}
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