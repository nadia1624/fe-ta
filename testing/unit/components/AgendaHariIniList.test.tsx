import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AgendaHariIniList } from '../../../app/components/dashboard/AgendaHariIniList';
import '@testing-library/jest-dom';

// Mock Lucide Icons to avoid rendering issues in tests
jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
  Clock: () => <span data-testid="clock-icon" />,
  ClipboardList: () => <span data-testid="clipboard-icon" />,
  MapPin: () => <span data-testid="map-pin-icon" />,
  Camera: () => <span data-testid="camera-icon" />,
}));

const mockAgendas = [
  {
    id_agenda: 1,
    nama_kegiatan: 'Rapat Koordinasi Mingguan',
    waktu_mulai: '08:00:00',
    waktu_selesai: '10:00:00',
    lokasi_kegiatan: 'Ruang Rapat Utama',
    statusAgendas: [{ status_agenda: 'ongoing' }],
    slotAgendaPimpinans: [
      {
        id_jabatan_hadir: 1,
        id_periode_hadir: 1,
        periodeJabatanHadir: {
          pimpinan: { nama_pimpinan: 'Bapak Ahmad' },
          jabatan: { nama_jabatan: 'Kepala Dinas' },
        },
      },
    ],
    penugasans: [
      {
        laporanKegiatans: [
          {
            id_laporan: 1,
            deskripsi_laporan: 'Persiapan',
            catatan_laporan: 'Semua berkas sudah siap.',
            dokumentasi_laporan: 'url1.jpg,url2.jpg',
            createdAt: '2026-04-21T08:00:00Z',
          },
        ],
      },
    ],
  },
  {
    id_agenda: 2,
    nama_kegiatan: 'Kunjungan Lapangan',
    waktu_mulai: '13:00:00',
    waktu_selesai: '15:00:00',
    lokasi_kegiatan: 'Lokasi Proyek A',
    statusAgendas: [{ status_agenda: 'completed' }],
    agendaPimpinans: [
      {
        id_jabatan: 2,
        periodeJabatan: {
          pimpinan: { nama_pimpinan: 'Ibu Siti' },
          jabatan: { nama_jabatan: 'Wakil Kepala' },
        },
      },
    ],
    penugasans: [],
  },
  {
    id_agenda: 3,
    nama_kegiatan: 'Peresmian Gedung',
    waktu_mulai: '10:00:00',
    waktu_selesai: '12:00:00',
    lokasi_kegiatan: 'Gedung Baru',
    statusAgendas: [{ status_agenda: 'delegated' }],
    agendaPimpinans: [
      {
        status_kehadiran: 'diwakilkan',
        nama_perwakilan: 'Bapak Budi',
        periodeJabatan: {
          pimpinan: { nama_pimpinan: 'Gubernur' },
        },
      },
    ],
    penugasans: [],
  },
];

describe('AgendaHariIniList Component', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  describe('Render Testing', () => {
    it('should render the component without error', () => {
      renderWithRouter(<AgendaHariIniList agendas={mockAgendas} role="kasubag_media" />);
      expect(screen.getByText('Rapat Koordinasi Mingguan')).toBeInTheDocument();
    });

    it('should show "Tidak ada agenda hari ini" when agendas is empty', () => {
      renderWithRouter(<AgendaHariIniList agendas={[]} role="kasubag_media" />);
      expect(screen.getByText('Tidak ada agenda hari ini')).toBeInTheDocument();
    });

    it('should handle null agendas gracefully', () => {
      // @ts-ignore - testing runtime safety
      renderWithRouter(<AgendaHariIniList agendas={null} role="kasubag_media" />);
      expect(screen.getByText('Tidak ada agenda hari ini')).toBeInTheDocument();
    });

    it('should handle undefined agendas gracefully', () => {
      // @ts-ignore
      renderWithRouter(<AgendaHariIniList agendas={undefined} role="kasubag_media" />);
      expect(screen.getByText('Tidak ada agenda hari ini')).toBeInTheDocument();
    });
  });

  describe('Data Rendering', () => {
    it('should display correct activity name, pimpinan, jabatan, time, and location', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[0]]} role="kasubag_media" />);
      
      expect(screen.getByText('Rapat Koordinasi Mingguan')).toBeInTheDocument();
      expect(screen.getByText('Bapak Ahmad')).toBeInTheDocument();
      expect(screen.getByText(/Kepala Dinas/)).toBeInTheDocument();
      expect(screen.getByText('08:00 - 10:00')).toBeInTheDocument();
      expect(screen.getByText('Ruang Rapat Utama')).toBeInTheDocument();
    });

    it('should display "-" if pimpinan data is incomplete', () => {
      const incompleteAgenda = [{
        ...mockAgendas[0],
        slotAgendaPimpinans: [],
        agendaPimpinans: [{}] // empty pimpinan data
      }];
      renderWithRouter(<AgendaHariIniList agendas={incompleteAgenda} role="kasubag_media" />);
      
      // Based on logic: pimpinan fallback to attendeeNames.join(', ') which is '-'
      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering (Status)', () => {
    it('should display "Berlangsung" for ongoing status', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[0]]} role="kasubag_media" />);
      expect(screen.getByText('Berlangsung')).toBeInTheDocument();
    });

    it('should display "Selesai" for completed status', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[1]]} role="kasubag_media" />);
      expect(screen.getByText('Selesai')).toBeInTheDocument();
    });

    it('should display "Diwakilkan" for delegated status', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[2]]} role="kasubag_media" />);
      expect(screen.getByText('Diwakilkan')).toBeInTheDocument();
    });
  });

  describe('Progress Reports', () => {
    it('should display report count when reports are available', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[0]]} role="kasubag_media" />);
      expect(screen.getByText(/1 Laporan Progress/)).toBeInTheDocument();
      expect(screen.getByText('Persiapan')).toBeInTheDocument();
      expect(screen.getByText('Semua berkas sudah siap.')).toBeInTheDocument();
      expect(screen.getByText(/2 Foto/)).toBeInTheDocument();
    });

    it('should show "Belum ada update laporan..." when no reports available', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[1]]} role="kasubag_media" />);
      expect(screen.getByText('Belum ada update laporan untuk kegiatan ini')).toBeInTheDocument();
    });
  });

  describe('Role-based Routing', () => {
    const agendaId = mockAgendas[0].id_agenda;

    it('should link to correct path for role: sespri', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[0]]} role="sespri" />);
      const link = screen.getByRole('link', { name: /Lihat Semua Progress/ });
      expect(link).toHaveAttribute('href', '/sespri/laporan-kegiatan-jadwal');
    });

    it('should link to correct path for role: kasubag_protokol', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[0]]} role="kasubag_protokol" />);
      const link = screen.getByRole('link', { name: /Lihat Semua Progress/ });
      expect(link).toHaveAttribute('href', `/kasubag-protokol/laporan-kegiatan/${agendaId}`);
    });

    it('should link to correct path for role: staf_media', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[0]]} role="staf_media" />);
      const link = screen.getByRole('link', { name: /Lihat Semua Progress/ });
      expect(link).toHaveAttribute('href', '/staff-media/tugas-saya');
    });

    it('should link to correct path for role: staf_protokol', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[0]]} role="staf_protokol" />);
      const link = screen.getByRole('link', { name: /Lihat Semua Progress/ });
      expect(link).toHaveAttribute('href', '/staff-protokol/tugas-saya');
    });

    it('should link to default path for other roles', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[0]]} role="kasubag_media" />);
      const link = screen.getByRole('link', { name: /Lihat Semua Progress/ });
      expect(link).toHaveAttribute('href', `/kasubag-media/laporan-kegiatan/${agendaId}`);
    });
  });

  describe('Interaction', () => {
    it('should show "Lihat Semua Progress" button if there are reports', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[0]]} role="kasubag_media" />);
      expect(screen.getByText(/Lihat Semua Progress/)).toBeInTheDocument();
    });

    it('should NOT show "Lihat Semua Progress" button if there are no reports', () => {
      renderWithRouter(<AgendaHariIniList agendas={[mockAgendas[1]]} role="kasubag_media" />);
      expect(screen.queryByText(/Lihat Semua Progress/)).not.toBeInTheDocument();
    });
  });
});
