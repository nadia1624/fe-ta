import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Plus, X, UserPlus } from 'lucide-react';

export default function AssignStaffPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [deskripsi, setDeskripsi] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const agendaList = [
    {
      id: 1,
      judul_kegiatan: 'Pertemuan dengan Camat Se-Kabupaten',
      tanggal: '2026-02-08',
      waktu: '13:00 - 16:00',
      lokasi: 'Aula Kantor Walikota',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jenis: 'Protokol',
      status: 'Belum Ditugaskan'
    },
    {
      id: 2,
      judul_kegiatan: 'Kunjungan Kerja Dinas Kesehatan',
      tanggal: '2026-02-10',
      waktu: '10:00 - 12:00',
      lokasi: 'Kantor Dinas Kesehatan',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jenis: 'Protokol',
      status: 'Belum Ditugaskan'
    },
    {
      id: 3,
      judul_kegiatan: 'Pelantikan Kepala Dinas',
      tanggal: '2026-02-12',
      waktu: '09:00 - 11:00',
      lokasi: 'Aula Kantor Walikota',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jenis: 'Protokol',
      status: 'Belum Ditugaskan'
    },
  ];

  // HANYA Staf Protokol yang bisa dipilih
  const availableStaff = [
    { id: 1, nama: 'Ahmad Hidayat', role: 'Staf Protokol', penugasan_bulan_ini: 5, total_penugasan: 12, status: 'Available' },
    { id: 2, nama: 'Budi Santoso', role: 'Staf Protokol', penugasan_bulan_ini: 3, total_penugasan: 12, status: 'Available' },
    { id: 3, nama: 'Eko Prasetyo', role: 'Staf Protokol', penugasan_bulan_ini: 7, total_penugasan: 12, status: 'Busy' },
    { id: 4, nama: 'Bambang Wijaya', role: 'Staf Protokol', penugasan_bulan_ini: 6, total_penugasan: 12, status: 'Available' },
    { id: 5, nama: 'Dewi Lestari', role: 'Staf Protokol', penugasan_bulan_ini: 4, total_penugasan: 12, status: 'Available' },
    { id: 6, nama: 'Farhan Saputra', role: 'Staf Protokol', penugasan_bulan_ini: 8, total_penugasan: 12, status: 'Busy' },
  ];

  const handleAssign = (agenda: any) => {
    setSelectedAgenda(agenda);
    setSelectedStaff([]);
    setDeskripsi('');
    setShowModal(true);
  };

  const handleStaffSelection = (staffId: number) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const handleSubmit = () => {
    const selectedNames = availableStaff
      .filter(s => selectedStaff.includes(s.id))
      .map(s => s.nama)
      .join(', ');
    alert(`${selectedStaff.length} staf berhasil ditugaskan untuk: ${selectedAgenda.judul_kegiatan}\n\nStaf: ${selectedNames}`);
    setShowModal(false);
  };

  const filteredAgenda = agendaList.filter(agenda =>
    agenda.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agenda.pimpinan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tugaskan Staf Protokol</h1>
        <p className="text-sm text-gray-600 mt-1">Tugaskan staf protokol untuk agenda kegiatan pimpinan</p>
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
              {filteredAgenda.map((agenda) => (
                <div key={agenda.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900 flex-1">{agenda.judul_kegiatan}</p>
                    <Badge variant="warning">{agenda.status}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <p>👤 {agenda.pimpinan}</p>
                    <p>📍 {agenda.lokasi}</p>
                    <p>📅 {new Date(agenda.tanggal).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })} • ⏰ {agenda.waktu}</p>
                    <p>
                      <Badge variant="info" className="text-xs">{agenda.jenis}</Badge>
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleAssign(agenda)} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Tugaskan Staf
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Staf Protokol Tersedia */}
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Staf Protokol Tersedia</h3>
              <p className="text-xs text-gray-500 mt-1">
                Penugasan bulan {new Date(currentYear, currentMonth).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {availableStaff.map((staff) => (
                <div key={staff.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900 mb-1">{staff.nama}</p>
                  <p className="text-sm text-gray-600">{staff.penugasan_bulan_ini} penugasan</p>
                </div>
              ))}
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
                  <h3 className="text-lg font-semibold text-gray-900">Tugaskan Staf Protokol</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedAgenda.judul_kegiatan}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Info Agenda */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Detail Agenda</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>👤 <strong>Pimpinan:</strong> {selectedAgenda.pimpinan}</p>
                    <p>📅 <strong>Tanggal:</strong> {new Date(selectedAgenda.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                    <p>⏰ <strong>Waktu:</strong> {selectedAgenda.waktu}</p>
                    <p>📍 <strong>Lokasi:</strong> {selectedAgenda.lokasi}</p>
                  </div>
                </div>

                {/* Pilih Staf (Multiple) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Staf Protokol <span className="text-red-500">*</span>
                    <span className="text-gray-500 font-normal ml-2">(bisa pilih lebih dari 1)</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {availableStaff.map((staff) => {
                      const isSelected = selectedStaff.includes(staff.id);
                      return (
                        <div
                          key={staff.id}
                          onClick={() => handleStaffSelection(staff.id)}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{staff.nama}</p>
                              <p className="text-xs text-gray-600">{staff.penugasan_bulan_ini} penugasan</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedStaff.length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
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
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Contoh: Bertugas mengatur protokoler acara, koordinasi dengan tim MC dan setting tempat duduk pimpinan"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1"
                    disabled={selectedStaff.length === 0 || !deskripsi.trim()}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Tugaskan {selectedStaff.length > 0 && `(${selectedStaff.length} Staf)`}
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