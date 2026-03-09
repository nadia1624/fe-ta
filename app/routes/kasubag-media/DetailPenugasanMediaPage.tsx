import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    ArrowLeft, CheckCircle, ClipboardList, Calendar, MapPin, Clock, User,
    Loader2, AlertCircle, Users, FileText, TrendingUp, Newspaper, ExternalLink
} from 'lucide-react';
import { penugasanApi } from '../../lib/api';
import Swal from 'sweetalert2';

interface DokumentasiBerita {
    id_dokumentasi: string;
    file_path: string;
}

interface RevisiDraftBerita {
    id_revisi: string;
    catatan_revisi: string;
    tanggal_revisi: string;
}

interface DraftBerita {
    id_draft_berita: string;
    judul_berita: string;
    isi_draft: string;
    catatan: string | null;
    status_draft: string;
    tanggal_kirim: string;
    dokumentasis: DokumentasiBerita[];
    revisies?: RevisiDraftBerita[];
}

interface LaporanKegiatan {
    id_laporan: string;
    deskripsi_laporan: string;
    catatan_laporan: string;
    dokumentasi_laporan: string | null;
    createdAt: string;
    staff: { id_user: string; nama: string } | null;
}

interface PenugasanDetail {
    id_penugasan: string;
    jenis_penugasan: string;
    deskripsi_penugasan: string;
    tanggal_penugasan: string;
    status: 'pending' | 'progress' | 'selesai' | null;
    status_pelaksanaan: string;
    nama_staf: string[];
    pimpinans: { nama_pimpinan: string; nama_jabatan: string }[];
    agenda: {
        id_agenda: string;
        nama_kegiatan: string;
        tanggal_kegiatan: string;
        waktu_mulai: string;
        waktu_selesai: string;
        lokasi_kegiatan: string;
    } | null;
    laporanKegiatans: LaporanKegiatan[];
    draftBeritas: DraftBerita[];
}

export default function DetailPenugasanMediaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [penugasan, setPenugasan] = useState<PenugasanDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await penugasanApi.getPenugasanDetail(id);
                if (res.success && res.data) {
                    setPenugasan(res.data);
                } else {
                    setError(res.message || 'Penugasan tidak ditemukan');
                }
            } catch (err) {
                setError('Terjadi kesalahan saat menghubungi server');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleTandaiSelesai = async () => {
        if (!id || !penugasan) return;

        const result = await Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin menandai penugasan ini sebagai Selesai?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#7c3aed',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Tandai Selesai',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) return;

        setIsUpdating(true);
        try {
            const res = await penugasanApi.updateStatusPenugasan(id, 'selesai');
            if (res.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Penugasan berhasil ditandai sebagai Selesai.',
                    confirmButtonColor: '#7c3aed'
                });
                setPenugasan(prev => prev ? { ...prev, status: 'selesai', status_pelaksanaan: 'Selesai' } : prev);
            } else {
                Swal.fire({ icon: 'error', title: 'Gagal', text: res.message || 'Gagal memperbarui status', confirmButtonColor: '#7c3aed' });
            }
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat menghubungi server', confirmButtonColor: '#7c3aed' });
        } finally {
            setIsUpdating(false);
        }
    };

    const formatTime = (time: string | null | undefined) => {
        if (!time) return '-';
        return time.slice(0, 5);
    };

    const getStatusInfo = () => {
        if (!penugasan) return { label: 'Unknown', variant: 'default' as any };
        if (penugasan.status === 'selesai' || penugasan.status_pelaksanaan === 'Selesai') return { label: 'Selesai', variant: 'success' as any };
        if (penugasan.laporanKegiatans?.length > 0) return { label: 'Berlangsung', variant: 'info' as any };
        return { label: 'Belum Dimulai', variant: 'warning' as any };
    };

    const getDraftStatusInfo = (status: string) => {
        switch (status) {
            case 'approved': return { label: 'Disetujui', color: 'bg-green-100 text-green-700 border-green-200' };
            case 'draft': return { label: 'Menunggu Review', color: 'bg-amber-100 text-amber-700 border-amber-200' };
            case 'review': return { label: 'Perlu Revisi', color: 'bg-red-100 text-red-700 border-red-200' };
            default: return { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <p className="text-sm">Memuat detail penugasan...</p>
                </div>
            </div>
        );
    }

    if (error || !penugasan) {
        return (
            <div className="space-y-6">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                </Button>
                <Card>
                    <CardContent className="p-8 flex flex-col items-center gap-3 text-center">
                        <AlertCircle className="w-12 h-12 text-red-400" />
                        <p className="text-gray-700 font-medium">Penugasan tidak ditemukan</p>
                        <p className="text-sm text-gray-500">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusInfo = getStatusInfo();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Detail Penugasan Media</h1>
                        <p className="text-sm text-gray-600 mt-0.5">{penugasan.agenda?.nama_kegiatan || '-'}</p>
                    </div>
                </div>

                {penugasan.status !== 'selesai' && penugasan.laporanKegiatans.length > 0 && (
                    <Button
                        onClick={handleTandaiSelesai}
                        disabled={isUpdating}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isUpdating ? 'Memproses...' : 'Tandai Selesai'}
                    </Button>
                )}
            </div>

            {/* Informasi Penugasan */}
            <Card>
                <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Informasi Penugasan</h3>
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                    Agenda Terkait
                                </label>
                                <p className="text-sm text-gray-900 mt-1 font-semibold">
                                    {penugasan.agenda?.nama_kegiatan || '-'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <User className="w-4 h-4 text-purple-600" />
                                    Pimpinan
                                </label>
                                <div className="mt-1 space-y-2">
                                    {penugasan.pimpinans.length > 0
                                        ? penugasan.pimpinans.map((p, idx) => (
                                            <div key={idx}>
                                                <p className="text-sm text-gray-900 font-semibold">{p.nama_pimpinan}</p>
                                                <p className="text-[11px] text-gray-500 uppercase tracking-tight">{p.nama_jabatan}</p>
                                            </div>
                                        ))
                                        : <p className="text-sm text-gray-400 italic">-</p>
                                    }
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                    Tanggal Kegiatan
                                </label>
                                <p className="text-sm text-gray-900 mt-1">
                                    {penugasan.agenda?.tanggal_kegiatan
                                        ? new Date(penugasan.agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })
                                        : '-'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-600" />
                                    Waktu
                                </label>
                                <p className="text-sm text-gray-900 mt-1">
                                    {penugasan.agenda?.waktu_mulai
                                        ? `${formatTime(penugasan.agenda.waktu_mulai)} – ${formatTime(penugasan.agenda.waktu_selesai)}`
                                        : '-'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-purple-600" />
                                    Lokasi
                                </label>
                                <p className="text-sm text-gray-900 mt-1">{penugasan.agenda?.lokasi_kegiatan || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    Staf Media Ditugaskan
                                </label>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {penugasan.nama_staf.length > 0
                                        ? penugasan.nama_staf.map((staf, idx) => (
                                            <Badge key={idx} variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                                                {staf}
                                            </Badge>
                                        ))
                                        : <span className="text-sm text-gray-400 italic">Tidak ada staf</span>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-purple-600" />
                                Deskripsi Penugasan
                            </label>
                            <p className="text-sm text-gray-900 mt-1">
                                {penugasan.deskripsi_penugasan || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ringkasan Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Laporan</p>
                    <p className="text-2xl font-semibold text-purple-600">{penugasan.laporanKegiatans?.length ?? 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Update Progress</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Draft Berita</p>
                    <p className="text-2xl font-semibold text-blue-600">{penugasan.draftBeritas?.length ?? 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Dikirimkan</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Staf Bertugas</p>
                    <p className="text-2xl font-semibold text-green-600">{penugasan.nama_staf.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Orang</p>
                </div>
            </div>

            {/* Draft Berita Section */}
            {penugasan.draftBeritas && penugasan.draftBeritas.length > 0 && (
                <Card className="border-purple-100">
                    <CardHeader className="bg-purple-50/50 border-b border-purple-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Newspaper className="w-5 h-5 text-purple-600" />
                                <h3 className="text-base font-semibold text-purple-900">Draft Berita</h3>
                            </div>
                            <Badge variant="outline" className="border-purple-200 text-purple-700">
                                {penugasan.draftBeritas.length} draft
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {penugasan.draftBeritas.map((draft, draftIdx) => {
                            const draftStatus = getDraftStatusInfo(draft.status_draft);
                            return (
                                <div key={draft.id_draft_berita} className={`border rounded-lg overflow-hidden ${draftIdx > 0 ? 'mt-4' : ''}`}>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm font-semibold text-gray-900">{draft.judul_berita}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={draftStatus.color}>{draftStatus.label}</Badge>
                                            <Link to={`/kasubag-media/review-draft/${draft.id_draft_berita}`}>
                                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-purple-200 text-purple-700">
                                                    <ExternalLink className="w-3 h-3" />
                                                    Review
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div
                                            className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100 max-h-48 overflow-y-auto"
                                            dangerouslySetInnerHTML={{ __html: draft.isi_draft }}
                                        />
                                        {draft.revisies && draft.revisies.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <TrendingUp className="w-4 h-4 text-amber-500" />
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Riwayat Feedback ({draft.revisies.length})</h4>
                                                </div>
                                                <div className="space-y-3 pl-4 border-l-2 border-gray-100 mt-2">
                                                    {[...draft.revisies].sort((a, b) => new Date(b.tanggal_revisi).getTime() - new Date(a.tanggal_revisi).getTime()).map((rev, rIdx) => (
                                                        <div key={rev.id_revisi} className="relative">
                                                            <div className={`absolute -left-[1.35rem] top-1 w-2 h-2 rounded-full border-2 border-white shadow-sm ${rIdx === 0 ? 'bg-amber-500' : 'bg-gray-300'}`} />
                                                            <div className={`p-3 rounded-lg border ${rIdx === 0 ? 'bg-amber-50/50 border-amber-100 shadow-sm' : 'bg-white border-gray-50'}`}>
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className={`text-[10px] font-bold uppercase tracking-tight ${rIdx === 0 ? 'text-amber-700' : 'text-gray-400'}`}>
                                                                        Review Kasubag {rIdx === 0 && '(Terbaru)'}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-400 font-medium italic">
                                                                        {new Date(rev.tanggal_revisi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-700 leading-relaxed font-medium">"{rev.catatan_revisi}"</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {draft.catatan && (!draft.revisies || draft.revisies.length === 0) && (
                                            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                                <p className="text-xs font-bold text-red-800 mb-1">Catatan Revisi (Legacy):</p>
                                                <p className="text-xs text-red-700">{draft.catatan}</p>
                                            </div>
                                        )}
                                        {draft.dokumentasis && draft.dokumentasis.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Dokumentasi Media</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {draft.dokumentasis.map((doc, idx) => {
                                                        const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.file_path || '');
                                                        return (
                                                            <div key={idx} className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                                                                {isImage ? (
                                                                    <img
                                                                        src={`/api/uploads/berita/${doc.file_path}`}
                                                                        alt="Dokumentasi"
                                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
                                                                        onClick={() => window.open(`/api/uploads/berita/${doc.file_path}`, '_blank')}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
                                                                        <FileText className="w-8 h-8 text-purple-400" />
                                                                        <Button
                                                                            variant="secondary"
                                                                            size="sm"
                                                                            className="h-6 text-[10px] px-2"
                                                                            onClick={() => window.open(`/api/uploads/berita/${doc.file_path}`, '_blank')}
                                                                        >
                                                                            Buka File
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Footer Action */}
            <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => navigate(-1)} className="px-12 hover:bg-gray-50">
                    Kembali ke Monitoring
                </Button>
            </div>
        </div>
    );
}
