import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Search, Filter, CheckCircle, Clock, TrendingUp, ArrowRight, ClipboardList, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { penugasanApi } from '../../lib/api';
import CustomSelect from '../../components/ui/CustomSelect';

interface Pimpinan {
  nama_pimpinan: string;
  nama_jabatan: string;
  nama_perwakilan?: string;
  is_representative?: boolean;
  representing?: string;
}

interface Penugasan {
  id_penugasan: string;
  jenis_penugasan: string;
  deskripsi_penugasan: string;
  tanggal_penugasan: string;
  status_pelaksanaan: string;
  nama_staf: string[];
  pimpinans: Pimpinan[];
  agenda: {
    id_agenda: string;
    nama_kegiatan: string;
    tanggal_kegiatan: string;
    waktu_mulai: string;
    waktu_selesai: string;
    lokasi_kegiatan: string;
  } | null;
  laporanKegiatans: any[];
}

export default function MonitorPenugasanPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [penugasanList, setPenugasanList] = useState<Penugasan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await penugasanApi.getMyPenugasan();
        if (res.success && res.data) {
          setPenugasanList(res.data);
        } else {
          setError(res.message || 'Gagal mengambil data penugasan');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat menghubungi server');
      } finally {
        setLoading(false);
      }
    };
    fetchPenugasan();
  }, []);

  const formatTime = (time: string | null | undefined) => {
    if (!time) return '-';
    return time.slice(0, 5); // "HH:MM"
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return <Badge variant="success">Selesai</Badge>;
      case 'Berlangsung':
        return <Badge variant="info">Berlangsung</Badge>;
      case 'Belum Dimulai':
        return <Badge variant="warning">Belum Dimulai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredPenugasan = penugasanList.filter(penugasan => {
    const namaKegiatan = penugasan.agenda?.nama_kegiatan || '';
    const lokasi = penugasan.agenda?.lokasi_kegiatan || '';
    const pimpinansStr = (penugasan.pimpinans || []).map(p => p.nama_pimpinan).join(', ');
    const matchesSearch =
      penugasan.nama_staf.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ||
      namaKegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (penugasan.deskripsi_penugasan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pimpinansStr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || penugasan.status_pelaksanaan === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const statsSelesai = penugasanList.filter(p => p.status_pelaksanaan === 'Selesai').length;
  const statsBerlangsung = penugasanList.filter(p => p.status_pelaksanaan === 'Berlangsung').length;
  const statsBelumDimulai = penugasanList.filter(p => p.status_pelaksanaan === 'Belum Dimulai').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm">Memuat data penugasan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Monitor Penugasan Protokol</h1>
          <p className="text-sm text-gray-600 mt-1">Pantau progress penugasan staf protokol untuk agenda pimpinan</p>
        </div>
        <Card>
          <CardContent className="p-8 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <p className="text-gray-700 font-medium">Gagal memuat data</p>
            <p className="text-sm text-gray-500">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Monitor Penugasan Protokol</h1>
        <p className="text-sm text-gray-600 mt-1">Pantau progress penugasan staf protokol untuk agenda pimpinan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Penugasan</p>
                <p className="text-2xl font-semibold text-blue-600">{penugasanList.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-2xl font-semibold text-green-600">{statsSelesai}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Berlangsung</p>
                <p className="text-2xl font-semibold text-blue-600">{statsBerlangsung}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Belum Dimulai</p>
                <p className="text-2xl font-semibold text-orange-600">{statsBelumDimulai}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Penugasan ({filteredPenugasan.length})</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari penugasan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-blue-100 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm w-full shadow-sm"
                />
              </div>
              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'Selesai', label: 'Selesai' },
                  { value: 'Berlangsung', label: 'Berlangsung' },
                  { value: 'Belum Dimulai', label: 'Belum Dimulai' }
                ]}
                icon={<Filter className="w-4 h-4" />}
                className="w-full sm:w-48"
                placeholder="Pilih Status"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                <TableHead className="text-sm font-bold text-gray-900 text-center w-12 py-4">No.</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Pimpinan</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Kegiatan</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Tanggal & Waktu</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Tempat</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Staf Ditugaskan</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Progress</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Status</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPenugasan.map((penugasan, index) => (
                <TableRow key={penugasan.id_penugasan} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                  <TableCell className="text-center font-bold text-gray-400 text-xs">{index + 1}</TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      {penugasan.pimpinans?.length > 0
                        ? penugasan.pimpinans.map((p, idx) => (
                          <div key={idx}>
                            {p.is_representative ? (
                              <>
                                <div className="font-medium text-gray-900">{p.nama_perwakilan}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">(Wakil {p.nama_pimpinan})</div>
                              </>
                            ) : (
                              <>
                                <div className="font-medium text-gray-900">{p.nama_pimpinan}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{p.nama_jabatan}</div>
                              </>
                            )}
                          </div>
                        ))
                        : <div className="text-gray-400 italic">-</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm text-gray-900 max-w-[200px] truncate" title={penugasan.agenda?.nama_kegiatan}>
                      {penugasan.agenda?.nama_kegiatan || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium">
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {penugasan.agenda?.tanggal_kegiatan
                          ? new Date(penugasan.agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                          : '-'}
                      </div>
                      {penugasan.agenda?.waktu_mulai && (
                        <div className="text-gray-500 font-normal">
                          {formatTime(penugasan.agenda.waktu_mulai)} – {formatTime(penugasan.agenda.waktu_selesai)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 max-w-[150px] truncate" title={penugasan.agenda?.lokasi_kegiatan}>
                      {penugasan.agenda?.lokasi_kegiatan || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {penugasan.nama_staf.length > 0
                        ? penugasan.nama_staf.map((staf, idx) => (
                          <p key={idx} className="text-xs text-gray-700 font-medium px-2 py-0.5 bg-gray-100 rounded-md w-fit">{staf}</p>
                        ))
                        : <p className="text-xs text-gray-400 italic">Tidak ada staf</p>
                      }
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">{penugasan.laporanKegiatans?.length ?? 0} update</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(penugasan.status_pelaksanaan)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/kasubag-protokol/penugasan/${penugasan.id_penugasan}`}>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-100 rounded-xl transition-all shadow-sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPenugasan.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    <ClipboardList className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>Tidak ada penugasan protokol yang ditemukan</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}