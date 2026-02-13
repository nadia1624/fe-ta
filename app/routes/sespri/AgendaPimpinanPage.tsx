import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2, Eye, Calendar, X, AlertTriangle, Search, Filter, List, CalendarDays } from 'lucide-react';

export default function AgendaPimpinanPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [agendaToDelete, setAgendaToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPimpinan, setFilterPimpinan] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [formData, setFormData] = useState({
    pimpinan_id: '',
    nomor_surat: '',
    tanggal_surat: '',
    perihal: '',
    nama_pemohon: '',
    instansi: '',
    alamat: '',
    no_telepon: '',
    email: '',
    judul_kegiatan: '',
    tanggal: '',
    waktu_mulai: '',
    waktu_selesai: '',
    tempat: '',
    keterangan: '',
    file_surat: null as File | null,
    status: 'Menunggu Konfirmasi'
  });

  const agendaList = [
    {
      id: 1,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      tanggal: '2026-02-10',
      waktu_mulai: '09:00',
      waktu_selesai: '12:00',
      tempat: 'Ruang Rapat Utama Kantor Walikota',
      keterangan: 'Rapat koordinasi rutin dengan seluruh kepala OPD',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 2,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      tanggal: '2026-02-12',
      waktu_mulai: '10:00',
      waktu_selesai: '11:30',
      tempat: 'Kantor Dinas Kesehatan',
      keterangan: 'Monitoring program vaksinasi dan kesehatan masyarakat',
      status: 'Menunggu Konfirmasi',
      sumber: 'Permohonan',
      created_by: 'Kepala Dinas Kesehatan',
      nomor_surat: '012/SP/II/2026'
    },
    {
      id: 3,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Pembukaan Festival Seni Budaya',
      tanggal: '2026-02-15',
      waktu_mulai: '08:00',
      waktu_selesai: '10:00',
      tempat: 'Lapangan Utama Kota',
      keterangan: 'Acara pembukaan festival seni dan budaya daerah',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 4,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Rapat dengan DPRD',
      tanggal: '2026-02-08',
      waktu_mulai: '13:00',
      waktu_selesai: '16:00',
      tempat: 'Gedung DPRD',
      keterangan: 'Rapat pembahasan APBD 2026',
      status: 'Selesai',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 5,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Audiensi dengan Tokoh Masyarakat',
      tanggal: '2026-02-20',
      waktu_mulai: '14:00',
      waktu_selesai: '15:30',
      tempat: 'Kantor Walikota',
      keterangan: 'Mendengarkan aspirasi masyarakat terkait pembangunan',
      status: 'Menunggu Konfirmasi',
      sumber: 'Permohonan',
      created_by: 'RT 05 Kelurahan Maju',
      nomor_surat: '015/SP/II/2026'
    },
    {
      id: 6,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Upacara Bendera',
      tanggal: '2026-02-02',
      waktu_mulai: '07:30',
      waktu_selesai: '08:30',
      tempat: 'Halaman Kantor Walikota',
      keterangan: 'Upacara bendera rutin setiap Senin',
      status: 'Selesai',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 7,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Peresmian Jembatan Baru',
      tanggal: '2026-02-06',
      waktu_mulai: '09:00',
      waktu_selesai: '10:30',
      tempat: 'Jembatan Sungai Jernih',
      keterangan: 'Peresmian jembatan penghubung antar desa',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 8,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Rapat Tim Satgas COVID-19',
      tanggal: '2026-02-04',
      waktu_mulai: '09:00',
      waktu_selesai: '11:00',
      tempat: 'Ruang Rapat Utama',
      keterangan: 'Evaluasi penanganan COVID-19',
      status: 'Selesai',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 9,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Kunjungan Puskesmas',
      tanggal: '2026-02-04',
      waktu_mulai: '13:00',
      waktu_selesai: '15:00',
      tempat: 'Puskesmas Sejahtera',
      keterangan: 'Monitoring pelayanan kesehatan',
      status: 'Selesai',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 10,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Rapat Evaluasi Kinerja',
      tanggal: '2026-02-07',
      waktu_mulai: '10:00',
      waktu_selesai: '12:00',
      tempat: 'Ruang Rapat Utama',
      keterangan: 'Evaluasi kinerja bulanan OPD',
      status: 'Selesai',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 11,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Sosialisasi Program UMKM',
      tanggal: '2026-02-11',
      waktu_mulai: '09:00',
      waktu_selesai: '11:30',
      tempat: 'Aula Dinas Koperasi',
      keterangan: 'Sosialisasi bantuan modal UMKM',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 12,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Pelantikan Pejabat',
      tanggal: '2026-02-13',
      waktu_mulai: '10:00',
      waktu_selesai: '11:00',
      tempat: 'Ruang Aula Utama',
      keterangan: 'Pelantikan Kepala Dinas baru',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 13,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Dialog Interaktif dengan Mahasiswa',
      tanggal: '2026-02-14',
      waktu_mulai: '13:00',
      waktu_selesai: '15:00',
      tempat: 'Universitas Negeri',
      keterangan: 'Dialog tentang pembangunan daerah',
      status: 'Terkonfirmasi',
      sumber: 'Permohonan',
      created_by: 'BEM Universitas Negeri',
      nomor_surat: '025/BEM/II/2026'
    },
    {
      id: 14,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Launching Smart City',
      tanggal: '2026-02-17',
      waktu_mulai: '08:00',
      waktu_selesai: '10:00',
      tempat: 'Gedung ICT Center',
      keterangan: 'Peluncuran program Smart City',
      status: 'Menunggu Konfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 15,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Penghargaan Guru Berprestasi',
      tanggal: '2026-02-18',
      waktu_mulai: '09:00',
      waktu_selesai: '11:00',
      tempat: 'Aula Dinas Pendidikan',
      keterangan: 'Pemberian penghargaan guru berprestasi',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 16,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Safari Jum\'at',
      tanggal: '2026-02-21',
      waktu_mulai: '11:30',
      waktu_selesai: '13:00',
      tempat: 'Masjid Al-Ikhlas',
      keterangan: 'Sholat Jum\'at berjamaah dengan warga',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 17,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Senam Pagi Bersama',
      tanggal: '2026-02-23',
      waktu_mulai: '06:30',
      waktu_selesai: '07:30',
      tempat: 'Lapangan Merdeka',
      keterangan: 'Senam pagi dengan ASN',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 18,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Apel Pagi ASN',
      tanggal: '2026-02-24',
      waktu_mulai: '07:30',
      waktu_selesai: '08:00',
      tempat: 'Halaman Kantor Walikota',
      keterangan: 'Apel pagi rutin ASN',
      status: 'Menunggu Konfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 19,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Rapat Koordinasi SKPD',
      tanggal: '2026-02-25',
      waktu_mulai: '10:00',
      waktu_selesai: '12:00',
      tempat: 'Ruang Rapat Wakil Walikota',
      keterangan: 'Koordinasi program kerja SKPD',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 20,
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      judul_kegiatan: 'Musrenbang Kota',
      tanggal: '2026-02-27',
      waktu_mulai: '08:00',
      waktu_selesai: '16:00',
      tempat: 'Gedung Serbaguna',
      keterangan: 'Musyawarah Perencanaan Pembangunan Kota',
      status: 'Terkonfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
    {
      id: 21,
      pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      judul_kegiatan: 'Peninjauan Pasar Tradisional',
      tanggal: '2026-02-28',
      waktu_mulai: '09:00',
      waktu_selesai: '11:00',
      tempat: 'Pasar Sentral',
      keterangan: 'Peninjauan kondisi dan fasilitas pasar',
      status: 'Menunggu Konfirmasi',
      sumber: 'Sespri Input',
      created_by: 'Sespri - Ahmad'
    },
  ];

  const pimpinanOptions = [
    { id: 1, nama: 'Dr. H. Ahmad Suryadi, M.Si', jabatan: 'Walikota' },
    { id: 2, nama: 'Ir. Hj. Siti Rahmawati, M.T', jabatan: 'Wakil Walikota' },
  ];

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getAgendaForDate = (day: number) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return agendaList.filter(agenda => agenda.tanggal === dateStr);
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedAgenda(null);
    setFormData({
      pimpinan_id: '',
      nomor_surat: '',
      tanggal_surat: '',
      perihal: '',
      nama_pemohon: '',
      instansi: '',
      alamat: '',
      no_telepon: '',
      email: '',
      judul_kegiatan: '',
      tanggal: '',
      waktu_mulai: '',
      waktu_selesai: '',
      tempat: '',
      keterangan: '',
      file_surat: null,
      status: 'Menunggu Konfirmasi'
    });
    setShowModal(true);
  };

  const handleEdit = (agenda: any) => {
    setModalMode('edit');
    setSelectedAgenda(agenda);
    setFormData({
      pimpinan_id: '1',
      nomor_surat: agenda.nomor_surat || '',
      tanggal_surat: agenda.tanggal_surat || '',
      perihal: agenda.perihal || '',
      nama_pemohon: agenda.nama_pemohon || '',
      instansi: agenda.instansi || '',
      alamat: agenda.alamat || '',
      no_telepon: agenda.no_telepon || '',
      email: agenda.email || '',
      judul_kegiatan: agenda.judul_kegiatan,
      tanggal: agenda.tanggal,
      waktu_mulai: agenda.waktu_mulai,
      waktu_selesai: agenda.waktu_selesai,
      tempat: agenda.tempat,
      keterangan: agenda.keterangan,
      file_surat: null,
      status: agenda.status
    });
    setShowModal(true);
  };

  const handleDetail = (agenda: any) => {
    setSelectedAgenda(agenda);
    setShowDetailModal(true);
  };

  const handleDelete = (agenda: any) => {
    setAgendaToDelete(agenda);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (agendaToDelete) {
      alert(`Agenda "${agendaToDelete.judul_kegiatan}" berhasil dihapus!`);
      setShowDeleteModal(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      alert('Agenda berhasil ditambahkan! Menunggu konfirmasi Ajudan.');
    } else {
      alert('Agenda berhasil diupdate!');
    }
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredData = agendaList.filter(item => {
    const matchSearch = 
      item.judul_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pimpinan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tempat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchPimpinan = filterPimpinan === 'all' || item.pimpinan === filterPimpinan;
    
    return matchSearch && matchPimpinan;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agenda Pimpinan</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola jadwal dan agenda pimpinan (Kalender & List)</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Kalender
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Agenda
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu Konfirmasi</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {agendaList.filter(a => a.status === 'Menunggu Konfirmasi').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terkonfirmasi</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {agendaList.filter(a => a.status === 'Terkonfirmasi').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-2xl font-semibold text-green-600">
                  {agendaList.filter(a => a.status === 'Selesai').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{agendaList.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>
                  ←
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                  Hari Ini
                </Button>
                <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>
                  →
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {getDaysInMonth(selectedDate).map((day, index) => {
                const agendas = day ? getAgendaForDate(day) : [];
                const isToday = day && 
                  day === new Date().getDate() && 
                  selectedDate.getMonth() === new Date().getMonth() &&
                  selectedDate.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] border rounded-lg p-2 ${
                      day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                    } ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {agendas.slice(0, 2).map((agenda) => (
                            <div
                              key={agenda.id}
                              onClick={() => handleDetail(agenda)}
                              className={`text-xs p-1 rounded cursor-pointer truncate ${
                                agenda.status === 'Terkonfirmasi' ? 'bg-blue-100 text-blue-700' :
                                agenda.status === 'Menunggu Konfirmasi' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}
                              title={agenda.judul_kegiatan}
                            >
                              {agenda.waktu_mulai} {agenda.judul_kegiatan}
                            </div>
                          ))}
                          {agendas.length > 2 && (
                            <div className="text-xs text-gray-500 pl-1">
                              +{agendas.length - 2} lainnya
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                <span className="text-gray-600">Menunggu Konfirmasi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 rounded"></div>
                <span className="text-gray-600">Terkonfirmasi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded"></div>
                <span className="text-gray-600">Selesai</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Daftar Agenda</h3>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari agenda..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterPimpinan}
                    onChange={(e) => setFilterPimpinan(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
                  >
                    <option value="all">Semua Pimpinan</option>
                    <option value="Dr. H. Ahmad Suryadi, M.Si">Walikota</option>
                    <option value="Ir. Hj. Siti Rahmawati, M.T">Wakil Walikota</option>
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pimpinan</TableHead>
                  <TableHead>Judul Kegiatan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((agenda) => (
                  <TableRow key={agenda.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{agenda.pimpinan}</p>
                        <p className="text-xs text-gray-500">{agenda.jabatan}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{agenda.judul_kegiatan}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(agenda.tanggal).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {agenda.waktu_mulai} - {agenda.waktu_selesai}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          agenda.status === 'Terkonfirmasi' ? 'info' : 
                          agenda.status === 'Selesai' ? 'success' : 
                          'warning'
                        }
                      >
                        {agenda.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleDetail(agenda)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(agenda)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(agenda)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'add' ? 'Tambah Agenda Langsung' : 'Edit Agenda'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {modalMode === 'add' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                      <strong>Info:</strong> Agenda yang ditambahkan akan menunggu konfirmasi dari Ajudan pimpinan.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pimpinan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="pimpinan_id"
                    value={formData.pimpinan_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Pilih Pimpinan...</option>
                    {pimpinanOptions.map((pimpinan) => (
                      <option key={pimpinan.id} value={pimpinan.id}>
                        {pimpinan.nama} - {pimpinan.jabatan}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Surat
                  </label>
                  <input
                    type="text"
                    name="nomor_surat"
                    value={formData.nomor_surat}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="012/SP/II/2026"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Surat
                  </label>
                  <input
                    type="date"
                    name="tanggal_surat"
                    value={formData.tanggal_surat}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perihal
                  </label>
                  <input
                    type="text"
                    name="perihal"
                    value={formData.perihal}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Rapat Koordinasi Bulanan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Pemohon
                  </label>
                  <input
                    type="text"
                    name="nama_pemohon"
                    value={formData.nama_pemohon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nama Pemohon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instansi
                  </label>
                  <input
                    type="text"
                    name="instansi"
                    value={formData.instansi}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Instansi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Alamat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    name="no_telepon"
                    value={formData.no_telepon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="No. Telepon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Kegiatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="judul_kegiatan"
                    value={formData.judul_kegiatan}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Rapat Koordinasi Bulanan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="waktu_mulai"
                      value={formData.waktu_mulai}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Selesai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="waktu_selesai"
                      value={formData.waktu_selesai}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tempat"
                    value={formData.tempat}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ruang Rapat Utama"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan
                  </label>
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Deskripsi kegiatan..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Surat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({
                          ...formData,
                          file_surat: e.target.files[0]
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required={modalMode === 'add'}
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: PDF, JPG, PNG. Maksimal 5MB</p>
                  {formData.file_surat && (
                    <p className="text-sm text-green-600 mt-2">✓ {formData.file_surat.name}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    {modalMode === 'add' ? 'Tambah' : 'Update'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Detail */}
      {showDetailModal && selectedAgenda && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detail Agenda</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pimpinan</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedAgenda.pimpinan}</p>
                    <p className="text-xs text-gray-500">{selectedAgenda.jabatan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <Badge 
                        variant={
                          selectedAgenda.status === 'Terkonfirmasi' ? 'info' : 
                          selectedAgenda.status === 'Selesai' ? 'success' : 
                          'warning'
                        }
                      >
                        {selectedAgenda.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Judul Kegiatan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.judul_kegiatan}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedAgenda.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Waktu</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedAgenda.waktu_mulai} - {selectedAgenda.waktu_selesai} WIB
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tempat</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.tempat}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Keterangan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAgenda.keterangan}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600">Sumber</label>
                      <p className="text-sm text-gray-900">{selectedAgenda.sumber}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Dibuat Oleh</label>
                      <p className="text-sm text-gray-900">{selectedAgenda.created_by}</p>
                    </div>
                  </div>
                  {selectedAgenda.nomor_surat && (
                    <div className="mt-2">
                      <label className="text-xs text-gray-600">Nomor Surat</label>
                      <p className="text-sm text-gray-900">{selectedAgenda.nomor_surat}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                    Tutup
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEdit(selectedAgenda);
                    }} 
                    className="flex-1"
                  >
                    Edit Agenda
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Delete */}
      {showDeleteModal && agendaToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Konfirmasi Hapus Agenda
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">
                      Apakah Anda yakin ingin menghapus agenda berikut?
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                      <p className="text-sm font-semibold text-gray-900">{agendaToDelete.judul_kegiatan}</p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Pimpinan:</span> {agendaToDelete.pimpinan}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Tanggal:</span> {new Date(agendaToDelete.tanggal).toLocaleDateString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Waktu:</span> {agendaToDelete.waktu_mulai} - {agendaToDelete.waktu_selesai}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    <strong>Peringatan:</strong> Data agenda yang dihapus tidak dapat dikembalikan.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowDeleteModal(false)} 
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button 
                    type="button" 
                    variant="danger" 
                    onClick={handleConfirmDelete} 
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Agenda
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