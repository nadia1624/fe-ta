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
  MessageSquare,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  FileText,
  History,
  CheckCircle2,
  Clock,
  RotateCcw,
  Calendar,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router';
import { beritaApi } from '../../lib/api';
import CustomSelect from '../../components/ui/CustomSelect';

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'approved':
      return { label: 'Disetujui', badgeClass: 'bg-green-100 text-green-700 border-green-200' };
    case 'draft':
      return { label: 'Menunggu Review', badgeClass: 'bg-amber-100 text-amber-700 border-amber-200' };
    case 'review':
      return { label: 'Perlu Revisi', badgeClass: 'bg-red-100 text-red-700 border-red-200' };
    default:
      return { label: status, badgeClass: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
};

export default function DraftBeritaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const res = await beritaApi.getAllDrafts();
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

    fetchDrafts();
  }, []);

  // Grouping logic: 1 row per penugasan
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
    const staffName = draft.staff?.nama || '';
    const agendaName = draft.penugasan?.agenda?.nama_kegiatan || '';
    const matchesSearch =
      (draft.judul_berita || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendaName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || draft.status_draft === statusFilter;
    return matchesSearch && matchesStatus;
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
          <p className="text-gray-500 font-medium">Memuat data draft berita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Monitor Draft Berita</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola dan tinjau seluruh draft berita dari staf media</p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Cari judul berita atau staf pengirim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-blue-100 bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
          />
        </div>
        <CustomSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'Semua Status' },
            { value: 'draft', label: 'Menunggu Review' },
            { value: 'approved', label: 'Disetujui' },
            { value: 'review', label: 'Perlu Revisi' },
          ]}
          icon={<Filter className="w-3.5 h-3.5" />}
          className="w-full md:w-48 bg-white border-blue-100 shadow-sm"
          placeholder="Pilih Status"
        />
      </div>

      {/* Table Card */}
      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-50 px-6 py-4">
          <h3 className="text-base font-bold text-gray-800">Daftar Draft Berita</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-transparent border-b border-gray-100">
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul Berita</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Agenda Terkait</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staf Pengirim</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Kirim</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revisi</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDraft.map((draft) => {
                  const statusInfo = getStatusInfo(draft.status_draft);
                  const revisiCount = draft.revisions?.length || 1;

                  return (
                    <TableRow key={draft.id_draft_berita} className="hover:bg-blue-50/30 transition-colors border-b border-gray-100 group">
                      <TableCell className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                            {draft.judul_berita}
                          </p>
                          {draft.catatan && (
                            <p className="text-[10px] text-gray-500 mt-1 line-clamp-1 font-medium italic">
                              {draft.catatan}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight max-w-[180px]">
                            {draft.penugasan?.agenda?.nama_kegiatan || '-'}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            <span className="truncate max-w-[150px]">{draft.penugasan?.agenda?.lokasi_kegiatan || '-'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-gray-900">{draft.staff?.nama || '-'}</span>
                          <span className="text-[10px] text-gray-500">Staf Media</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-900 font-medium whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          {draft.tanggal_kirim ? new Date(draft.tanggal_kirim).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-xs font-semibold text-gray-900">
                             {draft.revisions?.reduce((acc: number, d: any) => acc + (d.revisies?.length || 0), 0) || 0} revisi
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <Badge className={`${statusInfo.badgeClass} text-[10px] px-2 py-0.5 font-semibold text-center border`}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetail(draft)}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 rounded-lg group/btn"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                          </Button>
                          {(draft.status_draft === 'review' || draft.status_draft === 'draft') && (
                            <Link to={`/kasubag-media/review-draft/${draft.id_draft_berita}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 rounded-lg group/btn"
                                title="Review"
                              >
                                <MessageSquare className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
                <Eye className="w-4 h-4 text-amber-500" />
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 border-y border-gray-50">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Penulis</p>
                    <p className="text-sm font-bold text-gray-800">{selectedDraft.staff?.nama || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Agenda</p>
                    <p className="text-sm font-bold text-gray-800">{selectedDraft.penugasan?.agenda?.nama_kegiatan || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tanggal Kirim</p>
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
                          className="w-full h-full object-contain transition-all duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=Gambar+Tidak+Tersedia';
                          }}
                        />

                        {/* Nav Buttons */}
                        {selectedDraft.dokumentasis.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all z-10 shadow-lg"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all z-10 shadow-lg"
                            >
                              <ChevronRight className="w-6 h-6" />
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

                  {/* Thumbnails Navigation */}
                  {selectedDraft.dokumentasis?.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-1 px-1">
                      {selectedDraft.dokumentasis.map((img: any, idx: number) => (
                        <button
                          key={img.id_dokumentasi}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${currentImageIndex === idx
                            ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20'
                            : 'border-transparent opacity-60 hover:opacity-100'
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

                  {/* Caption */}
                  <p className="text-center text-[11px] text-gray-500 italic mt-2">
                    {selectedDraft.judul_berita}
                  </p>
                </div>

                {/* News Content */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Isi Berita</h3>
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                    {selectedDraft.isi_draft}
                  </div>
                </div>

                {/* Revision History Section */}
                {selectedDraft.revisies?.length > 0 && (
                  <div className="pt-8 border-t border-gray-50">
                    <div className="flex items-center gap-2 mb-6">
                      <History className="w-5 h-5 text-blue-500" />
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Riwayat Feedback ({selectedDraft.revisies.length})</h3>
                    </div>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                      {[...selectedDraft.revisies].sort((a: any, b: any) => new Date(b.tanggal_revisi).getTime() - new Date(a.tanggal_revisi).getTime()).map((revLog: any, idx: number) => {
                        const isLatestExt = idx === 0;

                        return (
                          <div key={revLog.id_revisi} className="relative">
                            {/* Dot on Timeline */}
                            <div className={`absolute -left-[2.05rem] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${isLatestExt ? 'bg-amber-500 scale-110' : 'bg-gray-300'}`} />

                            <div className={`p-4 rounded-xl border ${isLatestExt ? 'bg-amber-50/30 border-amber-100 shadow-sm' : 'bg-gray-50/50 border-gray-100'} transition-all`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-[11px] font-bold uppercase tracking-wider ${isLatestExt ? 'text-amber-700' : 'text-gray-500'}`}>
                                  Feedback Kasubag {isLatestExt && '(Terbaru)'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium">
                                  {new Date(revLog.tanggal_revisi).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 italic leading-relaxed">"{revLog.catatan_revisi}"</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 h-11 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold"
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