import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Plus, X, UserPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { penugasanApi } from '../../lib/api';

export default function AssignStaffPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [deskripsi, setDeskripsi] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [agendaSlots, setAgendaSlots] = useState<any[]>([]);
  const [availableStaff, setAvailableStaff] = useState<any[]>([]);

  // Status Modal State
  const [statusModal, setStatusModal] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [agendasRes, staffRes] = await Promise.all([
        penugasanApi.getAgendasForAssignment(),
        penugasanApi.getStaffProtokol()
      ]);

      if (agendasRes.success) setAgendaSlots(agendasRes.data);
      if (staffRes.success) setAvailableStaff(staffRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = (agenda: any) => {
    setSelectedSlot(agenda);
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
    if (!selectedSlot || selectedStaff.length === 0 || !deskripsi.trim()) return;

    setSubmitting(true);
    try {
      const res = await penugasanApi.assignStaff({
        id_agenda: selectedSlot.id_agenda,
        staff_ids: selectedStaff,
        deskripsi_penugasan: deskripsi,
        tanggal: '',
        id_slot_waktu: '',
        id_jabatan_hadir: '',
        id_periode_hadir: ''
      } as any);

      if (res.success) {
        setShowModal(false);
        setStatusModal({
          show: true,
          type: 'success',
          message: 'Staf protokol berhasil ditugaskan untuk seluruh slot agenda ini'
        });
        fetchData();
      } else {
        setStatusModal({
          show: true,
          type: 'error',
          message: 'Gagal menugaskan staf: ' + res.message
        });
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setStatusModal({
        show: true,
        type: 'error',
        message: 'Terjadi kesalahan sistem saat mencoba menugaskan staf'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAgenda = agendaSlots.filter(agenda =>
    agenda.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agenda.slotAgendaPimpinans?.some((s: any) => s.periodeJabatanHadir?.pimpinan?.nama.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tugaskan Staf Protokol</h1>
          <p className="text-sm text-gray-600 mt-1">Tugaskan staf protokol untuk per agenda kegiatan pimpinan yang terkonfirmasi</p>
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
              <h3 className="text-lg font-semibold text-gray-900">Agenda Terkonfirmasi</h3>
              <Badge variant="warning">{filteredAgenda.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredAgenda.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredAgenda.map((agenda) => {
                  const sortedSlots = [...(agenda.slotAgendaPimpinans || [])].sort((a, b) =>
                    (a.slotWaktu?.waktu_mulai || '').localeCompare(b.slotWaktu?.waktu_mulai || '')
                  );

                  const firstSlot = sortedSlots[0];
                  const lastSlot = sortedSlots[sortedSlots.length - 1];
                  const pimpinanName = firstSlot?.periodeJabatanHadir?.pimpinan?.nama || 'N/A';
                  const startTime = firstSlot?.slotWaktu?.waktu_mulai || '--:--';
                  const endTime = lastSlot?.slotWaktu?.waktu_selesai || '--:--';

                  return (
                    <div key={agenda.id_agenda} className="px-6 py-4 hover:bg-gray-50 transition-colors border-l-4 border-blue-500">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-gray-900 flex-1">{agenda.nama_kegiatan}</p>
                        <Badge variant="outline" className="whitespace-nowrap ml-2 text-blue-700 bg-blue-50 border-blue-200">
                          {startTime} - {endTime}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>👤 <strong>{pimpinanName}</strong></p>
                        <p>📍 {agenda.lokasi_kegiatan}</p>
                        <p>📅 {new Date(agenda.tanggal_kegiatan || '').toLocaleDateString('id-ID', {
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
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Tidak ada agenda yang perlu penugasan saat ini
              </div>
            )}
          </CardContent>
        </Card>

        {/* Staf Protokol Tersedia */}
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daftar Staf Protokol</h3>
              <p className="text-xs text-gray-500 mt-1">
                Staf yang tersedia di unit Protokol
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Tugaskan Staf */}
      {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Tugaskan Staf Protokol</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{selectedSlot.nama_kegiatan}</p>
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
              <div className="space-y-4">
                {/* Info Agenda */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 text-blue-800">Detail Agenda</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    {/* Access first slot for summary info */}
                    {(() => {
                      const sortedSlots = [...(selectedSlot.slotAgendaPimpinans || [])].sort((a, b) =>
                        (a.slotWaktu?.waktu_mulai || '').localeCompare(b.slotWaktu?.waktu_mulai || '')
                      );
                      const firstSlot = sortedSlots[0];
                      const lastSlot = sortedSlots[sortedSlots.length - 1];
                      const pimpinanName = firstSlot?.periodeJabatanHadir?.pimpinan?.nama || 'N/A';
                      const startTime = firstSlot?.slotWaktu?.waktu_mulai || '--:--';
                      const endTime = lastSlot?.slotWaktu?.waktu_selesai || '--:--';

                      return (
                        <>
                          <p>👤 <strong>Pimpinan:</strong> {pimpinanName}</p>
                          <p>📅 <strong>Tanggal:</strong> {new Date(selectedSlot.tanggal_kegiatan || '').toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}</p>
                          <p>⏰ <strong>Waktu Agenda:</strong> {startTime} - {endTime}</p>
                          <p>📍 <strong>Lokasi:</strong> {selectedSlot.lokasi_kegiatan}</p>
                          <p className="mt-2 text-xs text-blue-600 italic">✓ Penugasan akan otomatis diterapkan ke seluruh ({selectedSlot.slotAgendaPimpinans?.length}) slot pimpinan hadir pada agenda ini.</p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Pilih Staf (Multiple) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Staf Protokol <span className="text-red-500">*</span>
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
                    placeholder="Contoh: Bertugas mengatur protokoler acara, koordinasi dengan tim MC dan setting tempat duduk pimpinan"
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

      {/* Result Notification Modal */}
      {statusModal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <Card className="max-w-sm w-full shadow-2xl border-0 overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className={`h-2 ${statusModal.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
            <CardContent className="p-8 text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${statusModal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                {statusModal.type === 'success' ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  <AlertCircle className="w-10 h-10" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {statusModal.type === 'success' ? 'Berhasil!' : 'Gagal!'}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {statusModal.message}
              </p>
              <Button
                onClick={() => setStatusModal({ ...statusModal, show: false })}
                className={`w-full py-6 text-base font-semibold transition-all ${statusModal.type === 'success'
                    ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'
                    : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200'
                  }`}
              >
                {statusModal.type === 'success' ? 'Mengerti' : 'Coba Lagi'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}