import {
  agendaApi,
  ajudanAssignmentApi,
  authApi,
  beritaApi,
  clearAuthData,
  dashboardApi,
  getActorSlug,
  getToken,
  kaskpdApi,
  laporanKegiatanApi,
  notificationApi,
  penugasanApi,
  periodeApi,
  pimpinanApi,
  removeToken,
  setToken,
  setUserData,
  userApi,
} from '../../../app/lib/api';

type FetchOptions = RequestInit | undefined;

describe('API Utilities (api.ts)', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    global.fetch = mockFetch as typeof fetch;
    setToken('token-123');
  });

  const mockJsonResponse = (payload: unknown = { success: true, message: 'ok' }) => {
    mockFetch.mockResolvedValue({
      json: async () => payload,
    });

    return payload;
  };

  const expectLastFetchCall = (url: string, matcher?: Partial<RequestInit>) => {
    expect(mockFetch).toHaveBeenLastCalledWith(url, expect.objectContaining(matcher ?? {}));
  };

  const expectJsonHeaders = (options: FetchOptions, token = 'token-123') => {
    expect(options).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      }),
    );
  };

  describe('Token Helpers', () => {
    it('sets, gets, and removes tokens from localStorage', () => {
      setToken('test-token');
      expect(getToken()).toBe('test-token');

      removeToken();
      expect(getToken()).toBeNull();
    });

    it('returns null if token is not set', () => {
      removeToken();
      expect(getToken()).toBeNull();
    });
  });

  describe('User Data Helpers', () => {
    const mockUser = {
      id_user: 'user-123',
      nama: 'John Doe',
      email: 'john@example.com',
      role: { id_role: 'role-1', nama_role: 'Admin' },
    };

    it('saves user data to localStorage correctly', () => {
      setUserData(mockUser);

      expect(localStorage.getItem('userName')).toBe('John Doe');
      expect(localStorage.getItem('userEmail')).toBe('john@example.com');
      expect(localStorage.getItem('userRole')).toBe('Admin');
      expect(localStorage.getItem('userId')).toBe('user-123');
    });

    it('clears all auth data', () => {
      setUserData(mockUser);

      clearAuthData();

      expect(getToken()).toBeNull();
      expect(localStorage.getItem('userName')).toBeNull();
      expect(localStorage.getItem('userEmail')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
      expect(localStorage.getItem('userId')).toBeNull();
    });
  });

  describe('getActorSlug', () => {
    it.each([
      ['Admin', 'admin'],
      ['Sespri', 'sespri'],
      ['Kasubag Protokol', 'kasubag-protokol'],
      ['Kasubag Media', 'kasubag-media'],
      ['Ajudan', 'ajudan'],
      ['Staf Protokol', 'staff-protokol'],
      ['Staff Protokol', 'staff-protokol'],
      ['Staf Media', 'staff-media'],
      ['Staff Media', 'staff-media'],
      ['Pemohon', 'pemohon'],
      ['Unknown', 'user'],
      [null, 'user'],
      ['', 'user'],
      ['ADMIN', 'admin'],
    ])('returns %s as %s', (role, expected) => {
      expect(getActorSlug(role)).toBe(expected);
    });
  });

  describe('authApi', () => {
    it('covers auth endpoints', async () => {
      const loginPayload = mockJsonResponse({ success: true, data: { token: 'new-token' } });
      await expect(authApi.login('test@example.com', 'password123')).resolves.toEqual(loginPayload);
      expectLastFetchCall('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });

      mockJsonResponse();
      await authApi.register({
        nama: 'User',
        email: 'u@example.com',
        password: 'secret',
        instansi: 'Pemkot',
      });
      expectLastFetchCall('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      mockJsonResponse();
      await authApi.getMe();
      expectLastFetchCall('/api/auth/me', {
        headers: {
          Authorization: 'Bearer token-123',
          'Content-Type': 'application/json',
        },
      });

      mockJsonResponse();
      await authApi.updateProfile({ nama: 'Updated' });
      expectLastFetchCall('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify({ nama: 'Updated' }),
      });

      mockJsonResponse();
      await authApi.changePassword({ current_password: 'old', new_password: 'new' });
      expectLastFetchCall('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ current_password: 'old', new_password: 'new' }),
      });

      mockJsonResponse();
      const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' });
      await authApi.uploadFoto(file);
      const uploadCall = mockFetch.mock.calls.at(-1);
      expect(uploadCall?.[0]).toBe('/api/auth/me/foto');
      expect(uploadCall?.[1]).toEqual(
        expect.objectContaining({
          method: 'POST',
          headers: { Authorization: 'Bearer token-123' },
          body: expect.any(FormData),
        }),
      );

      mockJsonResponse();
      await authApi.deleteFoto();
      expectLastFetchCall('/api/auth/me/foto', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer token-123' },
      });

      mockJsonResponse();
      await authApi.forgotPassword('reset@example.com');
      expectLastFetchCall('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'reset@example.com' }),
      });

      mockJsonResponse();
      await authApi.resetPassword('reset-token', 'new-password');
      expectLastFetchCall('/api/auth/reset-password/reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'new-password' }),
      });
    });
  });

  describe('master data APIs', () => {
    it('covers periodeApi CRUD', async () => {
      mockJsonResponse();
      await periodeApi.getAll();
      expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);

      mockJsonResponse();
      await periodeApi.create({ nama_periode: '2026' });
      expectLastFetchCall('/api/periode', {
        method: 'POST',
        body: JSON.stringify({ nama_periode: '2026' }),
      });

      mockJsonResponse();
      await periodeApi.update('periode-1', { aktif: true });
      expectLastFetchCall('/api/periode/periode-1', {
        method: 'PUT',
        body: JSON.stringify({ aktif: true }),
      });

      mockJsonResponse();
      await periodeApi.delete('periode-1');
      expectLastFetchCall('/api/periode/periode-1', { method: 'DELETE' });
    });

    it('covers kaskpdApi CRUD', async () => {
      mockJsonResponse();
      await kaskpdApi.getAll();
      expectLastFetchCall('/api/kaskpd', {
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
      });

      mockJsonResponse();
      await kaskpdApi.create({ nama: 'Kadis' });
      expectLastFetchCall('/api/kaskpd', {
        method: 'POST',
        body: JSON.stringify({ nama: 'Kadis' }),
      });

      mockJsonResponse();
      await kaskpdApi.update('k1', { nama: 'Sekda' });
      expectLastFetchCall('/api/kaskpd/k1', {
        method: 'PUT',
        body: JSON.stringify({ nama: 'Sekda' }),
      });

      mockJsonResponse();
      await kaskpdApi.delete('k1');
      expectLastFetchCall('/api/kaskpd/k1', { method: 'DELETE' });
    });

    it('covers pimpinanApi endpoints', async () => {
      const cases: Array<[string, () => Promise<unknown>, Partial<RequestInit>]> = [
        ['/api/pimpinan', () => pimpinanApi.getAll(), {}],
        ['/api/pimpinan/jabatan', () => pimpinanApi.getJabatan(), {}],
        ['/api/pimpinan/list', () => pimpinanApi.getList(), {}],
        ['/api/pimpinan/active-assignments', () => pimpinanApi.getActiveAssignments(), {}],
        [
          '/api/pimpinan',
          () => pimpinanApi.createOrUpdate({ nama: 'Pimpinan' }),
          { method: 'POST', body: JSON.stringify({ nama: 'Pimpinan' }) },
        ],
        [
          '/api/pimpinan/delete',
          () => pimpinanApi.delete({ id_pimpinan: 'p1' }),
          { method: 'POST', body: JSON.stringify({ id_pimpinan: 'p1' }) },
        ],
        [
          '/api/pimpinan/resend-sync/p1',
          () => pimpinanApi.resendSyncInvitation('p1'),
          { method: 'POST' },
        ],
      ];

      for (const [url, invoke, matcher] of cases) {
        mockJsonResponse();
        await invoke();
        expectLastFetchCall(url, matcher);
        expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);
      }
    });

    it('covers userApi endpoints', async () => {
      const cases: Array<[string, () => Promise<unknown>, Partial<RequestInit>]> = [
        ['/api/users', () => userApi.getAll(), {}],
        ['/api/users', () => userApi.create({ nama: 'User' }), { method: 'POST', body: JSON.stringify({ nama: 'User' }) }],
        ['/api/users/u1', () => userApi.update('u1', { nama: 'Edit' }), { method: 'PUT', body: JSON.stringify({ nama: 'Edit' }) }],
        ['/api/users/delete', () => userApi.delete('u1'), { method: 'POST', body: JSON.stringify({ id_user: 'u1' }) }],
        ['/api/users/roles', () => userApi.getRoles(), {}],
      ];

      for (const [url, invoke, matcher] of cases) {
        mockJsonResponse();
        await invoke();
        expectLastFetchCall(url, matcher);
        expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);
      }
    });

    it('covers ajudanAssignmentApi endpoints', async () => {
      const cases: Array<[string, () => Promise<unknown>, Partial<RequestInit>]> = [
        ['/api/ajudan-assignments', () => ajudanAssignmentApi.getAll(), {}],
        [
          '/api/ajudan-assignments',
          () => ajudanAssignmentApi.create({ id_user: 'u1' }),
          { method: 'POST', body: JSON.stringify({ id_user: 'u1' }) },
        ],
        [
          '/api/ajudan-assignments/set-active',
          () => ajudanAssignmentApi.setActive({ id: 'a1' }),
          { method: 'PUT', body: JSON.stringify({ id: 'a1' }) },
        ],
        [
          '/api/ajudan-assignments/delete',
          () => ajudanAssignmentApi.delete({ id: 'a1' }),
          { method: 'POST', body: JSON.stringify({ id: 'a1' }) },
        ],
      ];

      for (const [url, invoke, matcher] of cases) {
        mockJsonResponse();
        await invoke();
        expectLastFetchCall(url, matcher);
        expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);
      }
    });
  });

  describe('agendaApi', () => {
    it('covers agenda endpoints including FormData requests and query params', async () => {
      mockJsonResponse();
      const createForm = new FormData();
      createForm.append('judul', 'Agenda');
      await agendaApi.create(createForm);
      expectLastFetchCall('/api/agenda', {
        method: 'POST',
        headers: { Authorization: 'Bearer token-123' },
        body: createForm,
      });

      const getCases: Array<[string, () => Promise<unknown>]> = [
        ['/api/agenda/my', () => agendaApi.getMyAgendas()],
        ['/api/agenda/slots', () => agendaApi.getSlots()],
        ['/api/agenda/all', () => agendaApi.getAll()],
      ];

      for (const [url, invoke] of getCases) {
        mockJsonResponse();
        await invoke();
        expectLastFetchCall(url);
        expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);
      }

      mockJsonResponse();
      await agendaApi.verify('agenda-1', {
        status: 'approved',
        catatan: 'ok',
        contact_person: 'cp',
        kaskpd_pendamping: ['k1'],
      });
      expectLastFetchCall('/api/agenda/agenda-1/verify', {
        method: 'POST',
        body: JSON.stringify({
          status: 'approved',
          catatan: 'ok',
          contact_person: 'cp',
          kaskpd_pendamping: ['k1'],
        }),
      });

      mockJsonResponse();
      const updateForm = new FormData();
      updateForm.append('judul', 'Updated');
      await agendaApi.update('agenda-1', updateForm);
      expectLastFetchCall('/api/agenda/agenda-1', {
        method: 'PUT',
        headers: { Authorization: 'Bearer token-123' },
        body: updateForm,
      });

      mockJsonResponse();
      await agendaApi.cancel('agenda-1');
      expectLastFetchCall('/api/agenda/agenda-1/cancel', { method: 'POST' });

      mockJsonResponse();
      await agendaApi.getLeaderAgendas({
        start_date: '2026-01-01',
        end_date: '2026-01-31',
        id_jabatan: 'jab-1',
        id_periode: 'per-1',
      });
      expectLastFetchCall(
        '/api/agenda/leader-agendas?start_date=2026-01-01&end_date=2026-01-31&id_jabatan=jab-1&id_periode=per-1',
      );
      expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);

      mockJsonResponse();
      await agendaApi.updateLeaderAttendance('agenda-1', 'jab-1', 'per-1', { hadir: true });
      expectLastFetchCall('/api/agenda/pimpinan/agenda-1/jab-1/per-1', {
        method: 'PUT',
        body: JSON.stringify({ hadir: true }),
      });

      mockJsonResponse();
      await agendaApi.updateLeaderSlots({ id_agenda: 'agenda-1', slots: [{ id_slot: 's1' }] });
      expectLastFetchCall('/api/agenda/pimpinan/slots', {
        method: 'POST',
        body: JSON.stringify({ id_agenda: 'agenda-1', slots: [{ id_slot: 's1' }] }),
      });
    });
  });

  describe('penugasanApi', () => {
    it('covers assignment endpoints', async () => {
      const getCases: Array<[string, () => Promise<unknown>]> = [
        ['/api/penugasan/staff-protokol', () => penugasanApi.getStaffProtokol()],
        ['/api/penugasan/staff-media', () => penugasanApi.getStaffMedia()],
        ['/api/penugasan/agendas-for-assignment', () => penugasanApi.getAgendasForAssignment()],
        ['/api/penugasan/agendas-for-media-assignment', () => penugasanApi.getAgendasForMediaAssignment()],
        ['/api/penugasan/my-penugasan', () => penugasanApi.getMyPenugasan()],
        ['/api/penugasan/p1', () => penugasanApi.getPenugasanDetail('p1')],
        ['/api/penugasan/protokol-assignments', () => penugasanApi.getProtokolAssignments()],
      ];

      for (const [url, invoke] of getCases) {
        mockJsonResponse();
        await invoke();
        expectLastFetchCall(url);
        expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);
      }

      mockJsonResponse();
      await penugasanApi.assignStaff({
        id_agenda: 'a1',
        tanggal: '2026-04-22',
        id_slot_waktu: 'slot-1',
        id_jabatan_hadir: 'jab-1',
        id_periode_hadir: 'per-1',
        staff_ids: ['u1', 'u2'],
        deskripsi_penugasan: 'Dokumentasi',
      });
      expectLastFetchCall('/api/penugasan/assign', {
        method: 'POST',
        body: JSON.stringify({
          id_agenda: 'a1',
          tanggal: '2026-04-22',
          id_slot_waktu: 'slot-1',
          id_jabatan_hadir: 'jab-1',
          id_periode_hadir: 'per-1',
          staff_ids: ['u1', 'u2'],
          deskripsi_penugasan: 'Dokumentasi',
        }),
      });

      mockJsonResponse();
      await penugasanApi.updateStatusPenugasan('p1', 'selesai');
      expectLastFetchCall('/api/penugasan/p1/review', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'selesai' }),
      });
    });
  });

  describe('beritaApi and laporanKegiatanApi', () => {
    it('covers berita endpoints', async () => {
      mockJsonResponse();
      await beritaApi.getPublicBerita();
      expectLastFetchCall('/api/berita/public', {
        headers: { 'Content-Type': 'application/json' },
      });

      const authCases: Array<[string, () => Promise<unknown>, Partial<RequestInit>]> = [
        ['/api/berita/drafts-review', () => beritaApi.getDraftsReview(), {}],
        ['/api/berita/drafts/all', () => beritaApi.getAllDrafts(), {}],
        ['/api/berita/my-drafts', () => beritaApi.getMyDrafts(), {}],
        ['/api/berita/drafts/d1', () => beritaApi.getDraftDetail('d1'), {}],
        [
          '/api/berita/drafts/d1/review',
          () => beritaApi.reviewDraft('d1', { status_draft: 'approved', catatan: 'Siap' }),
          { method: 'PATCH', body: JSON.stringify({ status_draft: 'approved', catatan: 'Siap' }) },
        ],
      ];

      for (const [url, invoke, matcher] of authCases) {
        mockJsonResponse();
        await invoke();
        expectLastFetchCall(url, matcher);
        expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);
      }

      mockJsonResponse();
      const formData = new FormData();
      formData.append('judul', 'Berita');
      await beritaApi.submitDraft(formData);
      expectLastFetchCall('/api/berita/drafts', {
        method: 'POST',
        headers: { Authorization: 'Bearer token-123' },
        body: formData,
      });
    });

    it('covers laporan kegiatan endpoints', async () => {
      mockJsonResponse();
      const formData = new FormData();
      formData.append('deskripsi', 'Laporan');
      await laporanKegiatanApi.addLaporan(formData);
      expectLastFetchCall('/api/laporan-kegiatan', {
        method: 'POST',
        headers: { Authorization: 'Bearer token-123' },
        body: formData,
      });

      mockJsonResponse();
      await laporanKegiatanApi.getByPenugasan('p1');
      expectLastFetchCall('/api/laporan-kegiatan/penugasan/p1');
      expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);

      mockJsonResponse();
      await laporanKegiatanApi.deleteLaporan('l1');
      expectLastFetchCall('/api/laporan-kegiatan/l1', { method: 'DELETE' });
      expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);
    });
  });

  describe('dashboardApi and notificationApi', () => {
    it('covers dashboard endpoints', async () => {
      const cases: Array<[string, () => Promise<unknown>]> = [
        ['/api/dashboards/admin', () => dashboardApi.getAdminStats()],
        ['/api/dashboards/sespri', () => dashboardApi.getSespriStats()],
        ['/api/dashboards/kasubag-media', () => dashboardApi.getKasubagMediaStats()],
        ['/api/dashboards/kasubag-protokol', () => dashboardApi.getKasubagProtokolStats()],
        ['/api/dashboards/staf-media', () => dashboardApi.getStafMediaStats()],
        ['/api/dashboards/staf-protokol', () => dashboardApi.getStafProtokolStats()],
      ];

      for (const [url, invoke] of cases) {
        mockJsonResponse();
        await invoke();
        expectLastFetchCall(url);
        expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);
      }
    });

    it('covers notification endpoints', async () => {
      mockJsonResponse();
      await notificationApi.subscribe({ endpoint: 'https://push.test/sub' });
      expectLastFetchCall('/api/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify({ endpoint: 'https://push.test/sub' }),
      });
      expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);

      mockJsonResponse();
      await notificationApi.unsubscribe('https://push.test/sub');
      expectLastFetchCall('/api/notifications/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ endpoint: 'https://push.test/sub' }),
      });
      expectJsonHeaders(mockFetch.mock.calls.at(-1)?.[1]);
    });
  });
});
