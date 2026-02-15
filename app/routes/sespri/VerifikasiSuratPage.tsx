import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function VerifikasiSuratPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<any>(null);

  const suratPending = [
    {
      id: 1,
      nomor_surat: '012/SP/I/2025',
      pemohon: 'Kepala Dinas Kesehatan',
      instansi: 'Dinas Kesehatan Kabupaten',
      tanggal_surat: '2025-01-30',
      perihal: 'Permohonan penandatanganan MoU Rumah Sakit',
      tanggal_kegiatan: '2025-02-12',
      status: 'Pending'
    },
    {
      id: 2,
      nomor_surat: '013/SP/I/2025',
      pemohon: 'Camat Sukamaju',
      instansi: 'Kecamatan Sukamaju',
      tanggal_surat: '2025-01-29',
      perihal: 'Permohonan kunjungan kerja Walikota ke Kecamatan',
      tanggal_kegiatan: '2025-02-15',
      status: 'Pending'
    },
  ];

  const handleVerify = (surat: any, action: 'approve' | 'reject') => {
    setSelectedSurat(surat);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Verifikasi Surat Permohonan</h1>
        <p className="text-sm text-gray-600 mt-1">Review dan verifikasi kelengkapan surat permohonan masuk</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Surat Perlu Verifikasi ({suratPending.length})</h3>
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
              {suratPending.map((surat) => (
                <TableRow key={surat.id}>
                  <TableCell className="font-medium">{surat.nomor_surat}</TableCell>
                  <TableCell>{surat.pemohon}</TableCell>
                  <TableCell className="text-sm text-gray-600">{surat.instansi}</TableCell>
                  <TableCell>
                    {new Date(surat.tanggal_surat).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{surat.perihal}</TableCell>
                  <TableCell>
                    {new Date(surat.tanggal_kegiatan).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning">{surat.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleVerify(surat, 'approve')}>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleVerify(surat, 'reject')}>
                        <XCircle className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showModal && selectedSurat && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Verifikasi Surat</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Verifikasi
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Tambahkan catatan verifikasi..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button className="flex-1" onClick={() => setShowModal(false)}>
                    Simpan Verifikasi
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