import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LaporanKegiatanPage from '../../../../app/routes/kasubag-media/LaporanKegiatanPage';
import { penugasanApi } from '../../../../app/lib/api';

jest.mock('../../../../app/lib/api', () => ({
  penugasanApi: { getProtokolAssignments: jest.fn() },
}));

jest.mock('react-router', () => ({
  Link: ({ children, to, ...props }: any) => <a href={to || '#'} {...props}>{children}</a>,
}));

jest.mock('../../../../app/components/ui/CustomSelect', () => {
  return function MockCustomSelect({ value, onChange, options }: any) {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options?.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    );
  };
});

jest.mock('../../../../app/components/ui/month-picker', () => {
  return function MockMonthPicker() { return <div data-testid="month-picker" />; };
});

jest.mock('lucide-react', () => ({
  Search: () => <span />,
  Calendar: () => <span />,
  Clock: () => <span />,
  MapPin: () => <span />,
  FileText: () => <span />,
  Loader2: () => <span data-testid="icon-loader" />,
  TrendingUp: () => <span />,
  ArrowRight: () => <span />,
  CheckCircle: () => <span />,
  User: () => <span />,
  Filter: () => <span />,
}));

describe('LaporanKegiatanPage', () => {
  const assignments = [
    {
      id_penugasan: 'P1',
      status: 'selesai',
      laporanKegiatans: [{ id_laporan: 'L1' }],
      agenda: {
        nama_kegiatan: 'Kegiatan Laporan',
        lokasi_kegiatan: 'Lokasi Laporan',
        tanggal_kegiatan: '2099-01-01',
        waktu_mulai: '08:00:00',
        waktu_selesai: '09:00:00',
      },
      pimpinans: [{ nama_pimpinan: 'Pimpinan A', nama_jabatan: 'Walikota' }],
    },
    {
      id_penugasan: 'P2',
      status: 'pending',
      laporanKegiatans: [{ id_laporan: 'L2' }],
      agenda: {
        nama_kegiatan: 'Agenda Progress',
        lokasi_kegiatan: 'Aula Barat',
        tanggal_kegiatan: '2099-01-02',
        waktu_mulai: '10:00:00',
        waktu_selesai: '11:00:00',
      },
      pimpinans: [{ nama_pimpinan: 'Pimpinan B', nama_jabatan: 'Wakil' }],
    },
    {
      id_penugasan: 'P3',
      status: 'pending',
      laporanKegiatans: [],
      agenda: {
        nama_kegiatan: 'Agenda Pending',
        lokasi_kegiatan: 'Balai Kota',
        tanggal_kegiatan: '2099-01-03',
        waktu_mulai: '13:00:00',
        waktu_selesai: '14:00:00',
      },
      pimpinans: [{ nama_pimpinan: 'Pimpinan C', nama_jabatan: 'Sekda' }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders fetched assignment reports and stats', async () => {
    (penugasanApi.getProtokolAssignments as jest.Mock).mockResolvedValue({
      success: true,
      data: assignments,
    });

    render(<LaporanKegiatanPage />);

    await waitFor(() => expect(screen.getByText('Kegiatan Laporan')).toBeInTheDocument());
    expect(screen.getByText(/Daftar Laporan Kegiatan \(3\)/i)).toBeInTheDocument();
    expect(screen.getAllByText('1').length).toBeGreaterThan(2);
    expect(screen.getAllByText('Berlangsung').length).toBeGreaterThan(1);
    expect(screen.getAllByText('Belum Dimulai').length).toBeGreaterThan(1);
  });

  it('filters reports by search, pimpinan, and status', async () => {
    (penugasanApi.getProtokolAssignments as jest.Mock).mockResolvedValue({
      success: true,
      data: assignments,
    });

    render(<LaporanKegiatanPage />);

    await waitFor(() => expect(screen.getByText('Kegiatan Laporan')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/Cari laporan/i), {
      target: { value: 'progress' },
    });
    expect(screen.getByText('Agenda Progress')).toBeInTheDocument();
    expect(screen.queryByText('Kegiatan Laporan')).not.toBeInTheDocument();

    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'Pimpinan B' },
    });
    expect(screen.getByText('Agenda Progress')).toBeInTheDocument();

    fireEvent.change(screen.getAllByRole('combobox')[1], {
      target: { value: 'pending' },
    });
    expect(screen.queryByText('Agenda Progress')).not.toBeInTheDocument();
    expect(screen.getByText(/Tidak ada laporan ditemukan/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Cari laporan/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'all' },
    });
    fireEvent.change(screen.getAllByRole('combobox')[1], {
      target: { value: 'progress' },
    });
    expect(screen.getByText('Agenda Progress')).toBeInTheDocument();
  });

  it('renders empty state for unsuccessful and failed fetches', async () => {
    (penugasanApi.getProtokolAssignments as jest.Mock)
      .mockResolvedValueOnce({ success: false, message: 'Gagal mengambil data monitoring' })
      .mockRejectedValueOnce(new Error('network'));

    const { rerender } = render(<LaporanKegiatanPage />);

    await waitFor(() => {
      expect(screen.getByText(/Tidak ada laporan ditemukan/i)).toBeInTheDocument();
    });

    rerender(<LaporanKegiatanPage />);

    await waitFor(() => {
      expect(screen.getByText(/Tidak ada laporan ditemukan/i)).toBeInTheDocument();
    });
  });
});
