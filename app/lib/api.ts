// API Service Layer - Auth endpoints

const API_BASE_URL = '/api';

// ==================== Token Helpers ====================

export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function setToken(token: string): void {
    localStorage.setItem('token', token);
}

export function removeToken(): void {
    localStorage.removeItem('token');
}

export function setUserData(user: { id_user: string; nama: string; email: string; role: { id_role: string; nama_role: string } }): void {
    localStorage.setItem('userRole', user.role.nama_role);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.nama);
    localStorage.setItem('userId', user.id_user);
}

export function clearAuthData(): void {
    removeToken();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
}

export function getActorSlug(roleName: string | null): string {
    const role = roleName?.toLowerCase() || '';
    if (role === 'admin') return 'admin';
    if (role === 'sespri') return 'sespri';
    if (role === 'kasubag protokol') return 'kasubag-protokol';
    if (role === 'kasubag media') return 'kasubag-media';
    if (role === 'ajudan') return 'ajudan';
    if (role === 'staf protokol' || role === 'staff protokol') return 'staff-protokol';
    if (role === 'staf media' || role === 'staff media') return 'staff-media';
    if (role === 'pemohon') return 'pemohon';
    return 'user';
}

// ==================== API Response Type ====================

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

// ==================== Auth API ====================

export const authApi = {
    async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
        console.log('[API] Login request:', { email });
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        return data;
    },

    async register(data: {
        nama: string;
        email: string;
        password: string;
        instansi?: string;
        alamat?: string;
        no_hp?: string;
        jabatan?: string;
    }): Promise<ApiResponse> {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async getMe(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async updateProfile(data: { nama?: string; email?: string; no_hp?: string }): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async changePassword(data: { current_password: string; new_password: string }): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async uploadFoto(file: File): Promise<ApiResponse> {
        const token = getToken();
        const formData = new FormData();
        formData.append('foto', file);
        const res = await fetch(`${API_BASE_URL}/auth/me/foto`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        return res.json();
    },

    async deleteFoto(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/auth/me/foto`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return res.json();
    },

    async forgotPassword(email: string): Promise<ApiResponse> {
        const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return res.json();
    },

    async resetPassword(token: string, password: string): Promise<ApiResponse> {
        const res = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        return res.json();
    },
};

// ==================== Periode API ====================

export const periodeApi = {
    async getAll(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/periode`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async create(data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/periode`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async update(id: string, data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/periode/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/periode/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },
};

// ==================== KASKPD API ====================

export const kaskpdApi = {
    async getAll(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/kaskpd`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async create(data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/kaskpd`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async update(id: string, data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/kaskpd/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/kaskpd/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },
};

// ==================== Pimpinan API ====================

export const pimpinanApi = {
    async getAll(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/pimpinan`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getJabatan(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/pimpinan/jabatan`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getList(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/pimpinan/list`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getActiveAssignments(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/pimpinan/active-assignments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async createOrUpdate(data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/pimpinan`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async delete(data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/pimpinan/delete`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async resendSyncInvitation(id_pimpinan: string): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/pimpinan/resend-sync/${id_pimpinan}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },
};

export const userApi = {
    async getAll(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async create(data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async update(id: string, data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async delete(id_user: string): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/users/delete`, {
            method: 'POST', // or DELETE if strict
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_user }),
        });
        return res.json();
    },

    async getRoles(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/users/roles`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    }
};

export const ajudanAssignmentApi = {
    async getAll(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/ajudan-assignments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async create(data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/ajudan-assignments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async setActive(data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/ajudan-assignments/set-active`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async delete(data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/ajudan-assignments/delete`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },
};

// ==================== Agenda API ====================

export const agendaApi = {
    async create(formData: FormData): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/agenda`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Do not set Content-Type for FormData, browser will set it with boundary
            },
            body: formData,
        });
        return res.json();
    },

    async getMyAgendas(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/agenda/my`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getSlots(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/agenda/slots`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getAll(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/agenda/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async verify(id_agenda: string, data: { 
        status: string; 
        catatan?: string;
        contact_person?: string;
        kaskpd_pendamping?: string[];
    }): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/agenda/${id_agenda}/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async update(id_agenda: string, formData: FormData): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/agenda/${id_agenda}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        return res.json();
    },

    async cancel(id_agenda: string): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/agenda/${id_agenda}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getLeaderAgendas(params: { start_date?: string; end_date?: string; id_jabatan?: string; id_periode?: string }): Promise<ApiResponse> {
        const token = getToken();
        const queryParams = new URLSearchParams(params as any).toString();
        const res = await fetch(`${API_BASE_URL}/agenda/leader-agendas?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async updateLeaderAttendance(id_agenda: string, id_jabatan: string, id_periode: string, data: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/agenda/pimpinan/${id_agenda}/${id_jabatan}/${id_periode}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async updateLeaderSlots(data: { id_agenda: string; slots: any[] }): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/agenda/pimpinan/slots`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    }
};

// ==================== Penugasan API ====================

export const penugasanApi = {
    async getStaffProtokol(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/penugasan/staff-protokol`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getStaffMedia(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/penugasan/staff-media`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getAgendasForAssignment(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/penugasan/agendas-for-assignment`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getAgendasForMediaAssignment(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/penugasan/agendas-for-media-assignment`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async assignStaff(data: {
        id_agenda: string;
        tanggal: string;
        id_slot_waktu: string;
        id_jabatan_hadir: string;
        id_periode_hadir: string;
        staff_ids: string[];
        deskripsi_penugasan: string;
    }): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/penugasan/assign`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async getMyPenugasan(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/penugasan/my-penugasan`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getPenugasanDetail(id: string): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/penugasan/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async updateStatusPenugasan(id: string, status: 'pending' | 'progress' | 'selesai'): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/penugasan/${id}/review`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        return res.json();
    },

    async getProtokolAssignments(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/penugasan/protokol-assignments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },
};

// ==================== Berita API ====================

export const beritaApi = {
    async getPublicBerita(): Promise<ApiResponse> {
        const res = await fetch(`${API_BASE_URL}/berita/public`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return res.json();
    },

    async getDraftsReview(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/berita/drafts-review`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getAllDrafts(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/berita/drafts/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getMyDrafts(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/berita/my-drafts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getDraftDetail(id: string): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/berita/drafts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async reviewDraft(id: string, data: { status_draft: string, catatan?: string }): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/berita/drafts/${id}/review`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    async submitDraft(formData: FormData): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/berita/drafts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        return res.json();
    }
};

// ==================== Laporan Kegiatan API ====================

export const laporanKegiatanApi = {
    async addLaporan(formData: FormData): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/laporan-kegiatan`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        return res.json();
    },

    async getByPenugasan(id_penugasan: string): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/laporan-kegiatan/penugasan/${id_penugasan}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async deleteLaporan(id_laporan: string): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/laporan-kegiatan/${id_laporan}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },
};

// ==================== Dashboard API ====================

export const dashboardApi = {
    async getAdminStats(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/dashboards/admin`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },

    async getSespriStats(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/dashboards/sespri`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },
    async getKasubagMediaStats(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/dashboards/kasubag-media`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },
    async getKasubagProtokolStats(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/dashboards/kasubag-protokol`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },
    async getStafMediaStats(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/dashboards/staf-media`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    },
    async getStafProtokolStats(): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/dashboards/staf-protokol`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.json();
    }
};

// ==================== Notification API ====================

export const notificationApi = {
    async subscribe(subscription: any): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
        });
        return res.json();
    },

    async unsubscribe(endpoint: string): Promise<ApiResponse> {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/notifications/unsubscribe`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoint }),
        });
        return res.json();
    }
};
