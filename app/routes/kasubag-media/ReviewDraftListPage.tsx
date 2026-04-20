import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    Search,
    Eye,
    Calendar,
    User,
    Clock,
    MessageSquare,
    AlertCircle,
    Loader2,
    FileText,
    CheckCircle2,
    X,
    ChevronLeft,
    ChevronRight,
    ImageIcon,
    History,
    Newspaper
} from 'lucide-react';
import { Link } from 'react-router';
import { beritaApi } from '../../lib/api';
import MonthPicker from '../../components/ui/month-picker';
import { toast } from '../../lib/swal';

export default function ReviewDraftListPage() {
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBulan, setFilterBulan] = useState(new Date().toISOString().slice(0, 7));

    // Detail Modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDraft, setSelectedDraft] = useState<any>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => { fetchReviewDrafts(); }, []);

    const fetchReviewDrafts = async () => {
        try {
            setLoading(true);
            const res = await beritaApi.getDraftsReview();
            if (res.success) setDrafts(res.data || []);
            else setError(res.message || 'Gagal mengambil data');
        } catch { setError('Terjadi kesalahan'); }
        finally { setLoading(false); }
    };

    const filteredDrafts = drafts.filter(draft => {
        const matchesSearch =
            draft.judul_berita.toLowerCase().includes(searchTerm.toLowerCase()) ||
            draft.staff?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            draft.penugasan?.agenda?.nama_kegiatan?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMonth = !filterBulan || !draft.tanggal_kirim || draft.tanggal_kirim.startsWith(filterBulan);
        return matchesSearch && matchesMonth;
    });

    const openDetail = (draft: any) => {
        setSelectedDraft(draft);
        setCurrentImageIndex(0);
        setShowDetailModal(true);
    };

    const handleApprove = async (draft: any) => {
        const { isConfirmed } = await toast.confirm(
            'Setujui Draft Berita?',
            `Draft <strong>"${draft.judul_berita}"</strong> akan ditandai sebagai disetujui.`
        );
        if (!isConfirmed) return;
        try {
            const res = await beritaApi.reviewDraft(draft.id_draft_berita, { status_draft: 'approved', catatan: '' });
            if (res.success) {
                toast.success('Disetujui!', 'Draft berhasil disetujui.');
                fetchReviewDrafts();
                setShowDetailModal(false);
            } else {
                toast.error('Gagal', res.message);
            }
        } catch {
            toast.error('Gagal', 'Terjadi kesalahan.');
        }
    };

    const formatDate = (dateStr: string) =>
        dateStr ? new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

    const getLatestRevisi = (revisies: any[]) => {
        if (!revisies?.length) return null;
        return [...revisies].sort((a, b) => new Date(b.tanggal_revisi).getTime() - new Date(a.tanggal_revisi).getTime())[0];
    };

    if (loading && drafts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium text-sm">Memuat draft yang perlu direview...</p>
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Review Draft Berita</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Draft yang menunggu persetujuan Anda</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold rounded-full self-start sm:self-center">
                    {filteredDrafts.length} Menunggu Review
                </Badge>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Cari judul, staf, atau agenda..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm bg-white"
                    />
                </div>
                <MonthPicker value={filterBulan} onChange={setFilterBulan} className="w-full sm:w-44" />
                <Button variant="outline" size="sm" onClick={fetchReviewDrafts} className="h-10 rounded-xl px-4 text-sm font-medium">
                    Refresh
                </Button>
            </div>

            {/* Content */}
            {error ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                    <p className="text-gray-500 text-sm">{error}</p>
                    <Button onClick={fetchReviewDrafts} variant="outline" size="sm" className="mt-3 rounded-xl">Coba Lagi</Button>
                </div>
            ) : filteredDrafts.length > 0 ? (
                <div className="space-y-4">
                    {filteredDrafts.map((draft) => {
                        const latestRevisi = getLatestRevisi(draft.revisies);
                        return (
                            <Card key={draft.id_draft_berita} className="border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all rounded-2xl overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="h-0.5 bg-blue-500" />
                                    <div className="p-5 md:p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 text-base leading-snug mb-1.5">
                                                    {draft.judul_berita}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <User className="w-3 h-3" />{draft.staff?.nama || '-'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" />{formatDate(draft.tanggal_kirim)}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3 h-3" />{draft.penugasan?.agenda?.nama_kegiatan || '-'}
                                                    </span>
                                                    {draft.revisies?.length > 0 && (
                                                        <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                                                            <History className="w-3 h-3" />{draft.revisies.length}x revisi
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-lg shrink-0">
                                                Pending Review
                                            </Badge>
                                        </div>

                                        {/* Content Snippet */}
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                            {draft.isi_draft?.replace(/<[^>]*>/g, '') || '-'}
                                        </p>

                                        {/* Images */}
                                        {draft.dokumentasis?.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                                                    <ImageIcon className="w-3 h-3" /> Gambar ({draft.dokumentasis.length})
                                                </p>
                                                <div className="flex gap-2 overflow-x-auto pb-1">
                                                    {draft.dokumentasis.slice(0, 4).map((img: any, idx: number) => (
                                                        <div
                                                            key={img.id_dokumentasi}
                                                            onClick={() => openDetail(draft)}
                                                            className="relative w-24 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity border border-gray-200"
                                                        >
                                                            <img src={`/api/uploads/berita/${img.file_path}`} className="w-full h-full object-cover" alt="" />
                                                            {idx === 3 && draft.dokumentasis.length > 4 && (
                                                                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center text-white text-xs font-bold">
                                                                    +{draft.dokumentasis.length - 4}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Revision Note */}
                                        {latestRevisi && (
                                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
                                                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-wider mb-1">Catatan Revisi Terakhir</p>
                                                <p className="text-xs text-blue-900 leading-relaxed italic">"{latestRevisi.catatan_revisi}"</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl h-9 text-xs border-gray-200 text-gray-600 hover:bg-gray-50 font-medium gap-1.5"
                                                onClick={() => openDetail(draft)}
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Lihat Detail
                                            </Button>
                                            <Link to={`/kasubag-media/review-draft/${draft.id_draft_berita}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-xl h-9 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 font-medium gap-1.5"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5" /> Berikan Revisi
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                className="rounded-xl h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 gap-1.5 ml-auto"
                                                onClick={() => handleApprove(draft)}
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Setujui Draft
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-blue-200" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-700 mb-1">Semua Draft Sudah Direview</h3>
                    <p className="text-gray-400 text-xs max-w-xs">Tidak ada draft berita yang menunggu review saat ini.</p>
                    {searchTerm && (
                        <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')} className="mt-3 text-blue-600 hover:bg-blue-50 text-xs rounded-xl">
                            Bersihkan Pencarian
                        </Button>
                    )}
                </div>
            )}

            {/* ===== DETAIL MODAL ===== */}
            {showDetailModal && selectedDraft && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
                    <Card className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 border-none outline-none">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-50 rounded-lg">
                                    <Newspaper className="w-4 h-4 text-blue-600" />
                                </div>
                                <h2 className="text-sm font-bold text-gray-800 tracking-wide">Detail Draft Berita</h2>
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
                                        <p className="text-sm font-bold text-gray-800">{formatDate(selectedDraft.tanggal_kirim)}</p>
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
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=Gambar+Tidak+Tersedia'; }}
                                                />
                                                {selectedDraft.dokumentasis.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={() => setCurrentImageIndex(p => p === 0 ? selectedDraft.dokumentasis.length - 1 : p - 1)}
                                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all z-10 shadow-lg"
                                                        >
                                                            <ChevronLeft className="w-6 h-6" />
                                                        </button>
                                                        <button
                                                            onClick={() => setCurrentImageIndex(p => p === selectedDraft.dokumentasis.length - 1 ? 0 : p + 1)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all z-10 shadow-lg"
                                                        >
                                                            <ChevronRight className="w-6 h-6" />
                                                        </button>
                                                        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                                            {currentImageIndex + 1} / {selectedDraft.dokumentasis.length}
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                                <ImageIcon className="w-12 h-12 opacity-20" />
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
                                                    <img src={`/api/uploads/berita/${img.file_path}`} className="w-full h-full object-cover" alt="" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Caption */}
                                    <p className="text-center text-[11px] text-gray-500 italic mt-2">{selectedDraft.judul_berita}</p>
                                </div>

                                {/* News Content */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Isi Berita</h3>
                                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap font-serif bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        {selectedDraft.isi_draft?.replace(/<[^>]*>/g, '') || '-'}
                                    </div>
                                </div>

                                {/* Revision History Section */}
                                {selectedDraft.revisies?.length > 0 && (
                                    <div className="pt-8 border-t border-gray-50">
                                        <div className="flex items-center gap-2 mb-6">
                                            <History className="w-5 h-5 text-blue-500" />
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Riwayat Feedback ({selectedDraft.revisies.length})
                                            </h3>
                                        </div>
                                        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                            {[...selectedDraft.revisies]
                                                .sort((a: any, b: any) => new Date(b.tanggal_revisi).getTime() - new Date(a.tanggal_revisi).getTime())
                                                .map((revLog: any, idx: number) => {
                                                    const isLatest = idx === 0;
                                                    return (
                                                        <div key={revLog.id_revisi} className="relative">
                                                            <div className={`absolute -left-[2.05rem] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${isLatest ? 'bg-blue-500 scale-110' : 'bg-gray-300'}`} />
                                                            <div className={`p-4 rounded-xl border ${isLatest ? 'bg-blue-50/30 border-blue-100 shadow-sm' : 'bg-gray-50/50 border-gray-100'}`}>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isLatest ? 'text-blue-700' : 'text-gray-500'}`}>
                                                                        Feedback Kasubag {isLatest && '(Terbaru)'}
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
                                <div className="pt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-50">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDetailModal(false)}
                                        className="h-11 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold"
                                    >
                                        Tutup
                                    </Button>
                                    <div className="flex gap-2">
                                        <Link to={`/kasubag-media/review-draft/${selectedDraft.id_draft_berita}`}>
                                            <Button variant="outline" className="h-11 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold gap-2">
                                                <MessageSquare className="w-4 h-4" /> Berikan Revisi
                                            </Button>
                                        </Link>
                                        <Button
                                            className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 gap-2"
                                            onClick={() => { setShowDetailModal(false); handleApprove(selectedDraft); }}
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Setujui Draft
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
