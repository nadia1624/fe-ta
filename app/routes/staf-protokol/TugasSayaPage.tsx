import { useState, useEffect, useRef } from 'react';
import { penugasanApi } from '../../lib/api';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Search, Filter, Calendar, Clock, MapPin, User, ClipboardList, Eye, ChevronDown, TrendingUp, CheckCircle } from 'lucide-react';
import MonthPicker from '../../components/ui/month-picker';
import CustomSelect from '../../components/ui/CustomSelect';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'Belum Dimulai', label: 'Belum Dimulai' },
  { value: 'Berlangsung', label: 'Berlangsung' },
  { value: 'Selesai', label: 'Selesai' },
];

export default function TugasSayaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBulan, setFilterBulan] = useState(new Date().toISOString().slice(0, 7));
  const [tugasList, setTugasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Data loading
  useEffect(() => {
    const fetchTugas = async () => {
      setLoading(true);
      try {
        const res = await penugasanApi.getMyPenugasan();
        if (res.success && res.data) {
          const mappedTugas = res.data.map((p: any) => ({
            id: p.id_penugasan,
            agenda_id: p.id_agenda,
            pimpinan: (p.pimpinans || []).map((ld: any) => ld.nama_pimpinan).join(', ') || '-',
            jabatan: p.agenda?.agendaPimpinans?.[0]?.periodeJabatan?.jabatan?.nama_jabatan || '-',
            judul_kegiatan: p.agenda?.nama_kegiatan || '-',
            tanggal: p.agenda?.tanggal_kegiatan || p.tanggal_penugasan,
            waktu: `${p.agenda?.waktu_mulai?.slice(0, 5) || ''} - ${p.agenda?.waktu_selesai?.slice(0, 5) || ''}`,
            tempat: p.agenda?.lokasi_kegiatan || '-',
            status: p.status_pelaksanaan,
            jumlah_progress: p.laporanKegiatans?.length || 0,
            pelapor: p.laporanKegiatans?.[0]?.staff?.nama || '-',
            last_update: p.laporanKegiatans?.length > 0
              ? p.laporanKegiatans[p.laporanKegiatans.length - 1].createdAt
              : '-',
            penugasan_dari: p.kasubag?.nama || 'Kasubag Protokol',
            tanggal_penugasan: p.tanggal_penugasan,
            instruksi: p.deskripsi_penugasan
          }));
          setTugasList(mappedTugas);
        }
      } catch (error) {
        console.error('Error fetching tugas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTugas();
  }, []);

  const filteredData = tugasList.filter(item => {
    const matchSearch =
      item.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pimpinan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tempat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchBulan = item.tanggal.startsWith(filterBulan);
    return matchSearch && matchStatus && matchBulan;
  });

  const totalTugas = filteredData.length;
  const belumDimulai = filteredData.filter(t => t.status === 'Belum Dimulai').length;
  const berlangsung = filteredData.filter(t => t.status === 'Berlangsung').length;
  const selesai = filteredData.filter(t => t.status === 'Selesai').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Berlangsung': return <Badge variant="info">Berlangsung</Badge>;
      case 'Selesai': return <Badge variant="success">Selesai</Badge>;
      case 'Belum Dimulai': return <Badge variant="warning">Belum Dimulai</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const selectedLabel = STATUS_OPTIONS.find(o => o.value === filterStatus)?.label || 'Semua Status';

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Tugas Saya</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">
          Penugasan protokol dari Kasubag dengan pengelolaan progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tugas</p>
                <p className="text-2xl font-semibold text-blue-600">{totalTugas}</p>
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
                <p className="text-2xl font-semibold text-green-600">{selesai}</p>
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
                <p className="text-2xl font-semibold text-blue-600">{berlangsung}</p>
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
                <p className="text-2xl font-semibold text-orange-600">{belumDimulai}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Daftar Tugas ({filteredData.length})
            </h3>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">

              {/* Search */}
              <div className="relative w-full md:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari tugas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-blue-100 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm w-full shadow-sm"
                />
              </div>

              {/* Status Select */}
              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                options={STATUS_OPTIONS}
                icon={<Filter className="w-4 h-4" />}
                className="w-full md:w-52"
              />

              {/* Month Picker */}
              <MonthPicker
                value={filterBulan}
                onChange={setFilterBulan}
                className="w-full md:w-52"
              />

            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          {loading ? (
            <div className="py-12 text-center text-gray-500">Memuat data penugasan...</div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {filteredData.map((tugas) => (
                <div key={tugas.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm md:text-base text-gray-900">{tugas.judul_kegiatan}</h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        <User className="w-3 h-3 inline mr-1" />
                        {tugas.pimpinan} · {tugas.jabatan}
                      </p>
                      <p className="text-xs text-blue-600">
                        <strong>Penugasan dari:</strong> {tugas.penugasan_dari}
                      </p>
                      <p className="text-xs text-gray-500">
                        Tanggal penugasan: {new Date(tugas.tanggal_penugasan).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                    {getStatusBadge(tugas.status)}
                  </div>

                  {/* Instruksi */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3 mb-3">
                    <p className="text-xs font-medium text-blue-900 mb-1 flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5" /> Instruksi:</p>
                    <p className="text-xs text-blue-800">{tugas.instruksi}</p>
                  </div>

                  {/* Info Kegiatan */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{new Date(tugas.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{tugas.waktu}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">{tugas.tempat}</span>
                    </div>
                  </div>

                  {/* Progress Info */}
                  <div className={`${tugas.jumlah_progress > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'} border rounded-lg p-2 md:p-3 mb-3`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ClipboardList className={`w-4 h-4 ${tugas.jumlah_progress > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-xs font-medium text-gray-700">
                          {tugas.jumlah_progress > 0 ? `${tugas.jumlah_progress} Progress Dilaporkan` : 'Belum Ada Progress'}
                        </span>
                      </div>
                      {tugas.jumlah_progress > 0 && (
                        <Badge variant="success" className="text-xs w-fit">{tugas.jumlah_progress}</Badge>
                      )}
                    </div>
                    {tugas.last_update !== '-' && (
                      <div className="mt-2 pt-2 border-t border-green-200">
                        <p className="text-xs text-gray-600">
                          Update terakhir: {new Date(tugas.last_update).toLocaleString('id-ID', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <Link to={`/staff-protokol/tugas-detail/${tugas.id}`}>
                    <Button variant="default" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Detail & Laporan Progress
                    </Button>
                  </Link>
                </div>
              ))}

              {filteredData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Tidak ada tugas yang ditemukan</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}