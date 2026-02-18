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
