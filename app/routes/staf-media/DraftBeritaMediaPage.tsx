import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Search, Filter, FileText, Eye, X, Calendar, User, ArrowRight } from 'lucide-react';

export default function DraftBeritaMediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBulan, setFilterBulan] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<any>(null);

  // Riwayat draft berita yang sudah selesai (Disetujui atau Perlu Revisi yang sudah di-handle)
  const draftHistory = [
    {
      id: 1,
      judul_kegiatan: 'Launching Program Smart City',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal_kegiatan: '2026-02-05',
      judul_draft: 'Walikota Launching Program Smart City untuk Meningkatkan Pelayanan Publik',
      konten_draft: 'Kota - Walikota Dr. H. Ahmad Suryadi, M.Si resmi meluncurkan program Smart City yang bertujuan meningkatkan kualitas pelayanan publik melalui digitalisasi. Program ini mencakup integrasi layanan administrasi, transportasi, dan kesehatan berbasis teknologi informasi.\n\n"Smart City adalah komitmen kita untuk memberikan pelayanan terbaik kepada masyarakat," ujar Walikota saat acara launching di Gedung Serbaguna, Rabu (5/2/2026) malam.\n\nProgram ini dilengkapi dengan aplikasi mobile yang memudahkan warga mengakses berbagai layanan publik secara online.',
      tanggal_upload: '2026-02-06 10:00',
      tanggal_review: '2026-02-06 14:30',
      status: 'Disetujui',
      foto_count: 6,
      feedback: 'Draft berita sudah bagus dan siap dipublikasikan. Terima kasih!',
      reviewer: 'Kasubag Media - Dra. Siti Aminah, M.Si'
    },
    {
      id: 2,
      judul_kegiatan: 'Peresmian Gedung Baru RSUD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal_kegiatan: '2026-02-08',
      judul_draft: 'Walikota Resmikan Gedung Baru RSUD Senilai Rp 50 Miliar',
      konten_draft: 'Kota - Gedung baru RSUD dengan kapasitas 200 tempat tidur resmi diresmikan oleh Walikota Dr. H. Ahmad Suryadi, M.Si pada Kamis (8/2/2026). Pembangunan gedung bernilai Rp 50 miliar ini dilakukan untuk meningkatkan pelayanan kesehatan masyarakat.\n\nGedung berlantai 5 ini dilengkapi dengan fasilitas modern termasuk ruang operasi canggih, ICU, dan ruang rawat inap VIP. "Ini adalah wujud nyata komitmen Pemkot dalam meningkatkan akses kesehatan berkualitas bagi seluruh warga," kata Walikota.\n\nDengan penambahan gedung baru ini, RSUD kini memiliki total kapasitas 500 tempat tidur.',
      tanggal_upload: '2026-02-08 15:00',
      tanggal_review: '2026-02-08 16:45',
      status: 'Disetujui',
      foto_count: 8,
      feedback: 'Konten lengkap dan informatif. Sudah dipublikasikan di website resmi.',
      reviewer: 'Kasubag Media - Dra. Siti Aminah, M.Si'
    },
    {
      id: 3,
      judul_kegiatan: 'Sosialisasi Program UMKM',
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      tanggal_kegiatan: '2026-02-03',
      judul_draft: 'Pemkot Sosialisasikan Program Bantuan UMKM kepada Pelaku Usaha',
      konten_draft: 'Kota - Pemerintah Kota melalui Wakil Walikota Ir. Hj. Siti Rahmawati, M.T menggelar sosialisasi program bantuan modal usaha bagi pelaku UMKM di Gedung Serba Guna, Senin (3/2/2026).\n\nProgram ini menyediakan bantuan modal hingga Rp 50 juta dengan bunga rendah untuk mengembangkan usaha mikro dan kecil. "Kami ingin UMKM kita tumbuh dan berkembang menjadi tulang punggung ekonomi daerah," ujar Wawali.\n\nSekitar 200 pelaku UMKM hadir dalam acara sosialisasi tersebut.',
      tanggal_upload: '2026-02-04 14:00',
      tanggal_review: '2026-02-04 16:00',
      status: 'Disetujui',
      foto_count: 5,
      feedback: 'Konten bagus, sudah dipublikasikan. Keep up the good work!',
      reviewer: 'Kasubag Media - Dra. Siti Aminah, M.Si'
    },
    {
      id: 4,
      judul_kegiatan: 'Kunjungan ke Desa Wisata',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal_kegiatan: '2026-02-01',
      judul_draft: 'Walikota Kunjungi Desa Wisata Sukamaju Dorong Pengembangan Pariwisata',
      konten_draft: 'Kota - Walikota Dr. H. Ahmad Suryadi, M.Si mengunjungi Desa Wisata Sukamaju untuk melihat langsung potensi pariwisata yang dikembangkan masyarakat setempat, Sabtu (1/2/2026).\n\nDesa Wisata Sukamaju menawarkan berbagai atraksi budaya dan kuliner khas daerah. Walikota berkomitmen memberikan dukungan untuk pengembangan infrastruktur dan promosi desa wisata.\n\n"Potensi pariwisata di desa ini sangat besar. Kami akan bantu kembangkan agar bisa menarik lebih banyak wisatawan," kata Walikota saat dialog dengan pelaku wisata setempat.',
      tanggal_upload: '2026-02-02 10:00',
      tanggal_review: '2026-02-02 14:20',
      status: 'Disetujui',
      foto_count: 7,
      feedback: 'Sudah bagus, sudah dipublikasikan.',
      reviewer: 'Kasubag Media - Dra. Siti Aminah, M.Si'
    },
    {
      id: 5,
      judul_kegiatan: 'Rapat Koordinasi Tim Satgas COVID-19',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal_kegiatan: '2026-01-30',
      judul_draft: 'Walikota Pimpin Rapat Koordinasi Satgas COVID-19 Bahas Kesiapsiagaan',
      konten_draft: 'Kota - Walikota Dr. H. Ahmad Suryadi, M.Si memimpin rapat koordinasi Tim Satgas COVID-19 untuk membahas kesiapsiagaan menghadapi potensi lonjakan kasus, Kamis (30/1/2026).\n\nRapat dihadiri oleh seluruh anggota satgas, Dinas Kesehatan, dan rumah sakit di wilayah kota. "Kita harus tetap waspada dan siap dengan segala skenario," tegas Walikota.\n\nBeberapa poin penting yang dibahas meliputi penguatan fasilitas kesehatan, ketersediaan obat dan alat medis, serta sosialisasi protokol kesehatan kepada masyarakat.',
      tanggal_upload: '2026-01-30 17:00',
      tanggal_review: '2026-01-31 09:00',
      status: 'Disetujui',
      foto_count: 4,
      feedback: 'Draft lengkap, sudah dipublikasikan.',
      reviewer: 'Kasubag Media - Dra. Siti Aminah, M.Si'
    },
    {
      id: 6,
      judul_kegiatan: 'Upacara Hari Jadi Kota',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal_kegiatan: '2026-01-25',
      judul_draft: 'Walikota Pimpin Upacara Peringatan Hari Jadi Kota ke-150',
      konten_draft: 'Kota - Walikota Dr. H. Ahmad Suryadi, M.Si memimpin upacara peringatan Hari Jadi Kota ke-150 di Lapangan Merdeka, Minggu (25/1/2026). Upacara diikuti oleh ribuan ASN, TNI, Polri, dan masyarakat.\n\n"Setelah 150 tahun, kota kita terus berkembang menjadi kota yang modern namun tetap menjaga nilai-nilai budaya," ujar Walikota dalam pidato upacara.\n\nSerangkaian acara peringatan Hari Jadi Kota dilaksanakan selama sepekan termasuk festival budaya, lomba, dan bazaar UMKM.',
      tanggal_upload: '2026-01-25 16:00',
      tanggal_review: '2026-01-26 10:00',
      status: 'Disetujui',
      foto_count: 10,
      feedback: 'Peliputan sangat baik, foto-foto juga berkualitas. Excellent!',
      reviewer: 'Kasubag Media - Dra. Siti Aminah, M.Si'
    }
  ];

  const filteredDrafts = draftHistory.filter(draft => {
    const matchSearch = 
      draft.judul_draft.toLowerCase().includes(searchTerm.toLowerCase()) ||
      draft.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      draft.pimpinan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || draft.status === filterStatus;
    
    let matchBulan = true;
    if (filterBulan !== 'all') {
      matchBulan = draft.tanggal_kegiatan.startsWith(filterBulan);
    }
    
    return matchSearch && matchStatus && matchBulan;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return <Badge variant="success">Disetujui</Badge>;
      case 'Perlu Revisi':
        return <Badge variant="danger">Perlu Revisi</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDetailClick = (draft: any) => {
    setSelectedDraft(draft);
    setShowDetailModal(true);
  };

  const statsTotal = draftHistory.length;
  const statsDisetujui = draftHistory.filter(d => d.status === 'Disetujui').length;

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Draft Berita</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Riwayat draft berita yang sudah selesai</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Total Draft</p>
                <p className="text-2xl md:text-3xl font-semibold text-purple-600">{statsTotal}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Disetujui</p>
                <p className="text-2xl md:text-3xl font-semibold text-green-600">{statsDisetujui}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari draft berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
              >
                <option value="all">Semua Bulan</option>
                <option value="2026-02">Februari 2026</option>
                <option value="2026-01">Januari 2026</option>
                <option value="2025-12">Desember 2025</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="Disetujui">Disetujui</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Draft</TableHead>
                  <TableHead>Kegiatan & Pimpinan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Foto</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrafts.map((draft) => (
                  <TableRow key={draft.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-2">
                          {draft.judul_draft}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{draft.judul_kegiatan}</p>
                        <p className="text-gray-600 text-xs">{draft.pimpinan}</p>
                        <p className="text-gray-500 text-xs">{draft.jabatan}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <p className="text-gray-600">
                          <span className="font-medium">Kegiatan:</span><br/>
                          {new Date(draft.tanggal_kegiatan).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Upload:</span><br/>
                          {new Date(draft.tanggal_upload).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-medium text-gray-900">
                        📷 {draft.foto_count}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(draft.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link to={`/dashboard/detail-draft-berita/${draft.id}`}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDrafts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Tidak ada draft berita yang ditemukan</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredDrafts.map((draft) => (
              <div key={draft.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                        {draft.judul_draft}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Kegiatan: {draft.judul_kegiatan}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {draft.pimpinan} · {draft.jabatan}
                      </p>
                    </div>
                    <div className="ml-3">
                      {getStatusBadge(draft.status)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(draft.tanggal_kegiatan).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span>📷 {draft.foto_count} foto</span>
                  </div>

                  <Link to={`/dashboard/detail-draft-berita/${draft.id}`} className="w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {filteredDrafts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Tidak ada draft berita yang ditemukan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedDraft && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detail Draft Berita</h3>
                <button onClick={() => setShowDetailModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Info Kegiatan */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Kegiatan</label>
                      <p className="text-gray-900">{selectedDraft.judul_kegiatan}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Tanggal Kegiatan</label>
                      <p className="text-gray-900">
                        {new Date(selectedDraft.tanggal_kegiatan).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Pimpinan</label>
                      <p className="text-gray-900">{selectedDraft.pimpinan}</p>
                      <p className="text-xs text-gray-500">{selectedDraft.jabatan}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Foto</label>
                      <p className="text-gray-900">{selectedDraft.foto_count} foto dokumentasi</p>
                    </div>
                  </div>
                </div>

                {/* Draft */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Judul Draft</label>
                  <p className="text-base font-semibold text-gray-900">{selectedDraft.judul_draft}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Konten Draft</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {selectedDraft.konten_draft}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Upload</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedDraft.tanggal_upload).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Review</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedDraft.tanggal_review).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Status & Feedback */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Status</label>
                  {getStatusBadge(selectedDraft.status)}
                </div>

                {selectedDraft.feedback && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <label className="text-sm font-medium text-green-900 block mb-2">Feedback dari Reviewer</label>
                    <p className="text-sm text-green-800 mb-2">{selectedDraft.feedback}</p>
                    <p className="text-xs text-green-600">— {selectedDraft.reviewer}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}