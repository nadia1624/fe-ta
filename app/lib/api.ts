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

// ==================== API Response Type ====================

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

// ==================== Auth API ====================

export const authApi = {
    async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
        console.log('[API] Login request:', { email, password });
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        console.log('[API] Login response:', data);
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
    }
};

