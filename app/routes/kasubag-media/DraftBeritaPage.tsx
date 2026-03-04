import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Eye, MessageSquare, Search, Filter, ChevronDown } from 'lucide-react';
import CustomSelect from '../../components/ui/CustomSelect';

export default function DraftBeritaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const draftBerita = [
    {
      id: 1,
      judul_berita: 'Walikota Hadiri Rapat Koordinasi Bulanan Februari 2025',
      status_draft: 'Disetujui',
      tanggal_kirim: '2025-01-29',
      staf_pengirim: 'Siti Nurhaliza',
      agenda_terkait: 'Rapat Koordinasi Bulanan',
      revisi_count: 1,
      catatan_terakhir: 'Draft sudah bagus, siap publish'
    },
    {
      id: 2,
      judul_berita: 'Walikota Hadiri Kunjungan Kerja ke Kecamatan',
      status_draft: 'Revisi',
      tanggal_kirim: '2025-01-30',
      staf_pengirim: 'Dewi Lestari',
      agenda_terkait: 'Kunjungan Kerja Walikota ke Kecamatan',
      revisi_count: 2,
      catatan_terakhir: 'Perlu tambahan kutipan dari Kepala Dinas'
    },
    {
      id: 3,
      judul_berita: 'Persiapan Upacara Peringatan Hari Kemerdekaan Berjalan Lancar',
      status_draft: 'Pending Review',
      tanggal_kirim: '2025-01-30',
      staf_pengirim: 'Siti Nurhaliza',
      agenda_terkait: 'Upacara Peringatan Hari Kemerdekaan',
      revisi_count: 0,
      catatan_terakhir: null
    },
    {
      id: 4,
      judul_berita: 'Walikota Bertemu Camat Se-Kota Bahas Program Prioritas',
      status_draft: 'Ditolak',
      tanggal_kirim: '2025-01-28',
      staf_pengirim: 'Dewi Lestari',
      agenda_terkait: 'Pertemuan dengan Camat',
      revisi_count: 1,
      catatan_terakhir: 'Agenda dibatalkan, berita tidak perlu dipublish'
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Disetujui': return 'success';
      case 'Pending Review': return 'warning';
      case 'Revisi': return 'info';
      case 'Ditolak': return 'danger';
      default: return 'default';
    }
  };

  const filteredDraft = draftBerita.filter(draft => {
    const matchesSearch = draft.judul_berita.toLowerCase().includes(searchTerm.toLowerCase()) ||
      draft.staf_pengirim.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || draft.status_draft === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Draft Berita</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola draft berita dan dokumentasi kegiatan</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Cari judul berita atau staf pengirim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-blue-100 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"
          />
        </div>
        <CustomSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'Semua Status' },
            { value: 'Pending Review', label: 'Pending Review' },
            { value: 'Revisi', label: 'Revisi' },
            { value: 'Disetujui', label: 'Disetujui' },
            { value: 'Ditolak', label: 'Ditolak' }
          ]}
          icon={<Filter className="w-4 h-4" />}
          className="w-full sm:w-56"
          placeholder="Pilih Status"
        />
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Daftar Draft Berita</h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Berita</TableHead>
                <TableHead>Agenda Terkait</TableHead>
                <TableHead>Staf Pengirim</TableHead>
                <TableHead>Tanggal Kirim</TableHead>
                <TableHead>Revisi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDraft.map((draft) => (
                <TableRow key={draft.id}>
                  <TableCell className="font-medium max-w-xs">
                    <p className="truncate">{draft.judul_berita}</p>
                    {draft.catatan_terakhir && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {draft.catatan_terakhir}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{draft.agenda_terkait}</TableCell>
                  <TableCell>{draft.staf_pengirim}</TableCell>
                  <TableCell>
                    {new Date(draft.tanggal_kirim).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    {draft.revisi_count > 0 ? (
                      <span className="text-sm text-gray-600">{draft.revisi_count}x</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(draft.status_draft)}>
                      {draft.status_draft}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {(draft.status_draft === 'Pending Review' || draft.status_draft === 'Revisi') && (
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
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
    </div>
  );
}