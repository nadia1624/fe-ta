import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Eye,
  Search,
  Loader2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  History,
  CheckCircle2,
  Clock,
  Newspaper
} from 'lucide-react';
import { beritaApi } from '../../lib/api';

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'approved':
      return { label: 'Disetujui', badgeClass: 'bg-green-100 text-green-700 border-green-200' };
    case 'draft':
      return { label: 'Pending Review', badgeClass: 'bg-amber-100 text-amber-700 border-amber-200' };
    case 'review':
      return { label: 'Perlu Revisi', badgeClass: 'bg-red-100 text-red-700 border-red-200' };
    default:
      return { label: status, badgeClass: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
};

export default function DraftBeritaMediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchMyDrafts();
  }, []);

  const fetchMyDrafts = async () => {
    try {
      setLoading(true);
      const res = await beritaApi.getMyDrafts();
      if (res.success) {
        setDrafts(res.data || []);
      } else {
        setError(res.message || 'Gagal mengambil data draft berita');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  // Grouping logic: 1 row per penugasan (Agenda)
  const groupedData = drafts.reduce((acc: any, draft: any) => {
    const key = draft.id_penugasan;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(draft);
    return acc;
  }, {});

  const latestDrafts = Object.values(groupedData).map((group: any) => {
    // Sort group by date descending (latest first)
    const sortedGroup = [...group].sort((a, b) =>
      new Date(b.tanggal_kirim).getTime() - new Date(a.tanggal_kirim).getTime()
    );
    const latest = sortedGroup[0];
    return {
      ...latest,
      revisions: sortedGroup
    };
  });

  const handleOpenDetail = (draft: any) => {
    setSelectedDraft(draft);
    setCurrentImageIndex(0);
    setShowDetailModal(true);
  };

  const filteredDraft = latestDrafts.filter(draft => {
    const agendaName = draft.penugasan?.agenda?.nama_kegiatan || '';
    const matchesSearch =
      (draft.judul_berita || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendaName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const nextImage = () => {
    if (selectedDraft?.dokumentasis?.length > 0) {
      setCurrentImageIndex((prev) => (prev === selectedDraft.dokumentasis.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (selectedDraft?.dokumentasis?.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedDraft.dokumentasis.length - 1 : prev - 1));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium text-sm">Memuat draft berita Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Draft Berita Saya</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar riwayat dan status draft berita yang telah Anda kirim</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-2xl">
          <Newspaper className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-lg">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
        <input
          type="text"
          placeholder="Cari judul berita atau agenda..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
        />
      </div>

      {/* Table Card */}
      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-50 px-6 py-4">
          <h3 className="text-base font-bold text-gray-800">Riwayat Pengiriman</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-50">
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Judul Berita</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Agenda</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Terakhir Dikirim</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Versi</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDraft.map((draft) => {
                  const statusInfo = getStatusInfo(draft.status_draft);
                  const revisiCount = draft.revisions?.length || 1;

                  return (
                    <TableRow key={draft.id_draft_berita} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                      <TableCell className="px-6 py-5">
                        <div className="max-w-md">
                          <p className="font-bold text-[13px] text-gray-800 line-clamp-2 leading-snug">
                            {draft.judul_berita}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <p className="text-[11px] font-semibold text-gray-600 leading-relaxed max-w-[200px]">
                          {draft.penugasan?.agenda?.nama_kegiatan || '-'}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <p className="text-[11px] text-gray-600 whitespace-nowrap">
                          {draft.tanggal_kirim ? new Date(draft.tanggal_kirim).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : '-'}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <p className="text-[11px] text-gray-600 font-medium">
                          v{revisiCount}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <Badge className={`${statusInfo.badgeClass} rounded-full px-3 py-0.5 text-[9px] font-bold border-none shadow-none uppercase tracking-wide`}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleOpenDetail(draft)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors bg-blue-50/50 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredDraft.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                      <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm italic">Belum ada draft berita yang ditemukan</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* DETAIL MODAL */}
      {showDetailModal && selectedDraft && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
          <Card className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 border-none outline-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <Newspaper className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Detail Draft Berita</h2>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CardContent className="p-0 max-h-[85vh] overflow-y-auto">
              <div className="p-6 md:p-10 space-y-8">
                {/* News Title */}
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                  {selectedDraft.judul_berita}
                </h1>

                {/* Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-y border-gray-50">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Agenda Terkait</p>
                    <p className="text-sm font-bold text-gray-800">{selectedDraft.penugasan?.agenda?.nama_kegiatan || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tanggal Kirim Terakhir</p>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedDraft.tanggal_kirim ? new Date(selectedDraft.tanggal_kirim).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : '-'}
                    </p>
                  </div>
                </div>

                {/* Main Media Player / Gallery */}
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] md:aspect-[21/9] bg-gray-900 rounded-xl overflow-hidden group">
                    {selectedDraft.dokumentasis?.length > 0 ? (
                      <>
                        <img
                          src={`/api/uploads/berita/${selectedDraft.dokumentasis[currentImageIndex].file_path}`}
                          alt="Dokumentasi"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=Gambar+Tidak+Tersedia';
                          }}
                        />

                        {/* Nav Buttons */}
                        {selectedDraft.dokumentasis.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-all z-10 shadow-lg"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-all z-10 shadow-lg"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            {/* Counter */}
                            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                              {currentImageIndex + 1} / {selectedDraft.dokumentasis.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                        <Camera className="w-12 h-12 opacity-20" />
                        <p className="text-xs font-medium italic opacity-40">Tidak ada dokumentasi</p>
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  <p className="text-center text-[11px] text-gray-500 italic mt-2">
                    {selectedDraft.judul_berita}
                  </p>

                  {/* Thumbnails */}
                  {selectedDraft.dokumentasis?.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {selectedDraft.dokumentasis.map((img: any, idx: number) => (
                        <button
                          key={img.id_dokumentasi}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${currentImageIndex === idx ? 'border-blue-500 scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                          <img
                            src={`/api/uploads/berita/${img.file_path}`}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* News Content */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Konten Berita</h3>
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap font-serif bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    {selectedDraft.isi_draft}
                  </div>
                </div>

                {/* Revision History Section */}
                {selectedDraft.revisies?.length > 0 && (
                  <div className="pt-8 border-t border-gray-50">
                    <div className="flex items-center gap-2 mb-6">
                      <History className="w-4 h-4 text-blue-500" />
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Riwayat Feedback ({selectedDraft.revisies.length})</h3>
                    </div>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-100">
                      {[...selectedDraft.revisies].sort((a: any, b: any) => new Date(b.tanggal_revisi).getTime() - new Date(a.tanggal_revisi).getTime()).map((revLog: any, idx: number) => {
                        const isLatest = idx === 0;
                        return (
                          <div key={revLog.id_revisi} className="relative pl-10">
                            <div className={`absolute left-0 top-1.5 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${isLatest ? 'bg-amber-500' : 'bg-gray-200'}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                            <div className={`p-4 rounded-xl border transition-all ${isLatest ? 'bg-amber-50/50 border-amber-200 shadow-sm shadow-amber-500/5' : 'bg-white border-gray-100'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isLatest ? 'text-amber-600' : 'text-gray-400'}`}>
                                  Feedback Kasubag {isLatest && '• TERBARU'}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(revLog.tanggal_revisi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed font-medium italic">
                                "{revLog.catatan_revisi}"
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailModal(false)}
                    className="w-full h-11 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold transition-all"
                  >
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