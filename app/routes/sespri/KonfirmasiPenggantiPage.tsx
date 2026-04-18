import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { UserCheck, Eye, Search, FileText, X, Edit2, RefreshCw } from 'lucide-react';
import { agendaApi } from '../../lib/api';
import Swal from 'sweetalert2';

export default function KonfirmasiPenggantiPage() {
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [agendaList, setAgendaList] = useState<any[]>([]);

  // State untuk edit Contact Person & Catatan
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editNotesForm, setEditNotesForm] = useState({
    contact_person: '',
    keterangan: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await agendaApi.getLeaderAgendas({});
      if (res.success) {
        setAgendaList(res.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Swal.fire('Error', 'Gagal mengambil data agenda', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter hanya agenda yang memiliki pimpinan yang diwakilkan
  const delegatedAgendas = agendaList.filter(agenda => {
    const hasDelegated = agenda.agendaPimpinans?.some((ap: any) => ap.status_kehadiran === 'diwakilkan');
    if (!hasDelegated) return false;

    const matchSearch =
      agenda.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agenda.lokasi_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agenda.pemohon?.nama?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchSearch;
  });

  const handleDetail = (agenda: any) => {
    setSelectedAgenda(agenda);
    setEditNotesForm({
      contact_person: agenda.contact_person || '',
      keterangan: agenda.keterangan || ''
    });
    setIsEditingNotes(false);
    setShowDetailModal(true);
  };

  const handleSaveNotes = async () => {
    try {
      const data = new FormData();
      data.append('contact_person', editNotesForm.contact_person);
      data.append('keterangan', editNotesForm.keterangan);

      const res = await agendaApi.update(selectedAgenda.id_agenda, data);

      if (res.success) {
        Swal.fire('Berhasil', 'Kontak Person dan Catatan berhasil diperbarui', 'success');
        setIsEditingNotes(false);
        fetchData();

        setSelectedAgenda((prev: any) => ({
          ...prev,
          contact_person: editNotesForm.contact_person,
          keterangan: editNotesForm.keterangan
        }));
      } else {
        Swal.fire('Gagal', res.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem saat menyimpan catatan', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Daftar Perwakilan Pimpinan</h1>
        <p className="text-sm text-gray-600 mt-1">Lihat daftar agenda yang diwakilkan dan kelola catatan tambahan</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Agenda Diwakilkan</p>
              <p className="text-2xl font-semibold text-blue-600">{delegatedAgendas.length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Agenda Diwakilkan</h3>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari agenda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm w-full md:w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
                <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                  <TableHead className="text-sm font-bold text-gray-900 text-center w-12 py-4">No.</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Kegiatan</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Tanggal & Waktu</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Pimpinan & Perwakilan</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4 text-center">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {delegatedAgendas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    Tidak ada perwakilan yang perlu dikonfirmasi
                  </TableCell>
                </TableRow>
              )}
              {delegatedAgendas.map((agenda, index) => (
                <TableRow key={agenda.id_agenda} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                  <TableCell className="text-center font-bold text-gray-400 text-xs">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm">{agenda.nama_kegiatan}</p>
                      <p className="text-xs text-gray-500">{agenda.lokasi_kegiatan}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p className="text-xs text-gray-500">{agenda.waktu_mulai.slice(0, 5)} - {agenda.waktu_selesai.slice(0, 5)}</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {agenda.agendaPimpinans?.filter((ap: any) => ap.status_kehadiran === 'diwakilkan').map((ap: any, i: number) => (
                        <div key={i} className="text-sm">
                          <p className="font-medium">{ap.periodeJabatan?.pimpinan?.nama_pimpinan}</p>
                          <div className="flex flex-col gap-1 mt-0.5">
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 w-fit">Diwakili oleh: {ap.nama_perwakilan}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDetail(agenda)}
                      className="h-9 w-9 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-100 rounded-xl transition-all shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Detail */}
      {showDetailModal && selectedAgenda && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Detail Agenda (Diwakilkan)</h3>
                <button onClick={() => setShowDetailModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
            </CardHeader>
            <CardContent className="py-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kegiatan</label>
                    <p className="text-sm font-semibold">{selectedAgenda.nama_kegiatan}</p>
                    <p className="text-xs text-gray-500">{selectedAgenda.perihal}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu & Tempat</label>
                    <p className="text-sm">{new Date(selectedAgenda.tanggal_kegiatan).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-sm font-medium">{selectedAgenda.waktu_mulai.slice(0, 5)} - {selectedAgenda.waktu_selesai.slice(0, 5)} WIB</p>
                    <p className="text-sm">{selectedAgenda.lokasi_kegiatan}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pemohon</label>
                    <p className="text-sm font-medium">{selectedAgenda.pemohon?.nama}</p>
                    <p className="text-xs text-gray-500">{selectedAgenda.pemohon?.instansi}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kontak & Catatan Khusus</label>
                      {!isEditingNotes && (
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-blue-600 p-1" onClick={() => setIsEditingNotes(true)}>
                          <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                      )}
                    </div>
                    {isEditingNotes ? (
                      <div className="space-y-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">Contact Person (Opsional)</label>
                          <input
                            type="text"
                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5"
                            value={editNotesForm.contact_person}
                            onChange={e => setEditNotesForm(prev => ({ ...prev, contact_person: e.target.value }))}
                            placeholder="Contoh: Bpk. Budi (0812xxxx)"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">Catatan Tambahan (Opsional)</label>
                          <textarea
                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5"
                            rows={2}
                            value={editNotesForm.keterangan}
                            onChange={e => setEditNotesForm(prev => ({ ...prev, keterangan: e.target.value }))}
                            placeholder="Catatan dari sespri..."
                          />
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                            setIsEditingNotes(false);
                            setEditNotesForm({
                              contact_person: selectedAgenda.contact_person || '',
                              keterangan: selectedAgenda.keterangan || ''
                            });
                          }}>Batal</Button>
                          <Button size="sm" className="h-7 text-xs bg-blue-600" onClick={handleSaveNotes}>Simpan</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium">CP: {selectedAgenda.contact_person || '-'}</p>
                        <p className="text-sm">Catatan: {selectedAgenda.keterangan || '-'}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Perwakilan Pimpinan</label>
                  <div className="space-y-3">
                    {selectedAgenda.agendaPimpinans?.filter((ap: any) => ap.status_kehadiran === 'diwakilkan').map((ap: any, i: number) => (
                      <div key={i} className="p-4 border rounded-lg bg-green-50 border-green-200 space-y-3">
                        <div>
                          <p className="text-xs text-green-700 font-medium">Pimpinan Asli:</p>
                          <p className="text-sm font-bold text-gray-900">{ap.periodeJabatan?.pimpinan?.nama_pimpinan}</p>
                          <p className="text-[10px] text-gray-600">{ap.periodeJabatan?.jabatan?.nama_jabatan}</p>
                        </div>

                        <div className="pt-2 border-t border-green-200 border-dashed">
                          <p className="text-xs text-blue-700 font-medium">Diwakilkan Kepada:</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">👤 {ap.nama_perwakilan}</p>
                          {ap.keterangan && (
                            <p className="text-xs text-gray-600 mt-1 italic">"{ap.keterangan}"</p>
                          )}

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>Tutup</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
