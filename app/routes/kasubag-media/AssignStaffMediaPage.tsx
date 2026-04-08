import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Plus, X, UserPlus, Loader2, AlertCircle, Search } from 'lucide-react';
import { penugasanApi } from '../../lib/api';
import Swal from 'sweetalert2';

export default function AssignStaffMediaPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [deskripsi, setDeskripsi] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [agendaList, setAgendaList] = useState<any[]>([]);
  const [availableStaff, setAvailableStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [agendasRes, staffRes] = await Promise.all([
          penugasanApi.getAgendasForMediaAssignment(),
          penugasanApi.getStaffMedia()
        ]);

        if (agendasRes.success && staffRes.success) {
          setAgendaList(agendasRes.data || []);
          setAvailableStaff(staffRes.data || []);
        } else {
          setError('Gagal mengambil data dari server');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat menghubungi server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssign = (agenda: any) => {
    setSelectedAgenda(agenda);
    setSelectedStaff([]);
    setDeskripsi('');
    setShowModal(true);
  };

  const handleStaffSelection = (staffId: string) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAgenda || selectedStaff.length === 0 || !deskripsi.trim()) return;

    setSubmitting(true);
    try {
      const res = await penugasanApi.assignStaff({
        id_agenda: selectedAgenda.id_agenda,
        staff_ids: selectedStaff,
        deskripsi_penugasan: deskripsi,
        // The following fields are needed by the current assignStaff but might be redundant if we refactor it further
        // but for now we provide what it expects if it uses them
        tanggal: selectedAgenda.tanggal_kegiatan,
        id_slot_waktu: '', // Backend now computes slots dynamically
        id_jabatan_hadir: '',
        id_periode_hadir: ''
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Staf media berhasil ditugaskan.',
          confirmButtonColor: '#3b82f6'
        });

        // Remove assigned agenda from list
        setAgendaList(prev => prev.filter(a => a.id_agenda !== selectedAgenda.id_agenda));
        setShowModal(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: res.message || 'Gagal menugaskan staf',
          confirmButtonColor: '#9333ea'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat menghubungi server',
        confirmButtonColor: '#9333ea'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAgenda = agendaList.filter(agenda => {
    const pimpinans = (agenda.agendaPimpinans || []).map((ap: any) => ap.periodeJabatan?.pimpinan?.nama_pimpinan || '').join(' ');
    return (
      agenda.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pimpinans.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agenda.lokasi_kegiatan || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 text-center">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-700 font-medium">Gagal memuat data</p>
        <p className="text-sm text-gray-500">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tugaskan Staf Media</h1>
          <p className="text-sm text-gray-600 mt-1">Tugaskan staf media untuk dokumentasi dan peliputan agenda kegiatan pimpinan</p>
        </div>
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Cari agenda atau pimpinan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agenda Perlu Penugasan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Agenda Perlu Penugasan</h3>
              <Badge variant="warning">{filteredAgenda.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {filteredAgenda.map((agenda) => {
                const pimpinans = (agenda.agendaPimpinans || []).map((ap: any) => ap.periodeJabatan?.pimpinan?.nama_pimpinan || '-').join(', ');
                return (
                  <div key={agenda.id_agenda} className="px-6 py-4 hover:bg-gray-50 transition-colors border-l-4 border-blue-500">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900 flex-1">{agenda.nama_kegiatan}</p>
                      <Badge variant="outline" className="whitespace-nowrap ml-2 text-blue-700 bg-blue-50 border-blue-200">
                        {agenda.waktu_mulai.slice(0, 5)} - {agenda.waktu_selesai.slice(0, 5)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-[13px] text-gray-600 mb-3">
                      <p><strong>Pimpinan:</strong> <span className="font-medium text-gray-900">{pimpinans}</span></p>
                      <p><strong>Lokasi:</strong> {agenda.lokasi_kegiatan || '-'}</p>
                      <p><strong>Tanggal:</strong> {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</p>
                    </div>
                    <Button size="sm" onClick={() => handleAssign(agenda)} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Tugaskan Staf
                    </Button>
                  </div>
                );
              })}
              {filteredAgenda.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <p>Tidak ada agenda yang perlu penugasan media</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Staf Media Tersedia */}
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Staf Media Tersedia</h3>
              <p className="text-xs text-gray-500 mt-1">
                Daftar staf yang dapat ditugaskan untuk dokumentasi
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 h-[500px] overflow-y-auto">
              {availableStaff.map((staff) => (
                <div key={staff.id_user} className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    {staff.nama.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{staff.nama}</p>
                    <p className="text-xs text-gray-500">{staff.email}</p>
                  </div>
                </div>
              ))}
              {availableStaff.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <p>Tidak ada staf media yang ditemukan</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Tugaskan Staf */}
      {showModal && selectedAgenda && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Tugaskan Staf Media</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{selectedAgenda.nama_kegiatan}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <div className="space-y-6">
                {/* Info Agenda */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 text-blue-800">Detail Agenda</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><strong>Pimpinan:</strong> {(selectedAgenda.agendaPimpinans || []).map((ap: any) => ap.periodeJabatan?.pimpinan?.nama_pimpinan || '-').join(', ')}</p>
                    <p><strong>Tanggal:</strong> {new Date(selectedAgenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                    <p><strong>Waktu Agenda:</strong> {selectedAgenda.waktu_mulai.slice(0, 5)} - {selectedAgenda.waktu_selesai.slice(0, 5)}</p>
                    <p><strong>Lokasi:</strong> {selectedAgenda.lokasi_kegiatan || '-'}</p>
                  </div>
                </div>

                {/* Pilih Staf (Multiple) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Staf Media <span className="text-red-500">*</span>
                    <span className="text-gray-500 font-normal ml-2">(bisa pilih lebih dari 1)</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {availableStaff.map((staff) => {
                      const isSelected = selectedStaff.includes(staff.id_user);
                      return (
                        <div
                          key={staff.id_user}
                          onClick={() => handleStaffSelection(staff.id_user)}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{staff.nama}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">{staff.email}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedStaff.length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                      ✓ {selectedStaff.length} staf terpilih
                    </div>
                  )}
                </div>

                {/* Deskripsi Penugasan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Penugasan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    placeholder="Contoh: Bertugas melakukan dokumentasi foto dan video, membuat draft berita, serta mengelola publikasi di media sosial"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1" disabled={submitting}>
                    Batal
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={selectedStaff.length === 0 || !deskripsi.trim() || submitting}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    Tugaskan {selectedStaff.length > 0 && `(${selectedStaff.length})`}
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
