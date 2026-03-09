import { Navigate } from "react-router";
import { getToken } from "../lib/api";

const roleMap: Record<string, string> = {
    'Admin': '/admin/dashboard',
    'Sespri': '/sespri',
    'Kasubag Protokol': '/kasubag-protokol',
    'Kasubag Media': '/kasubag-media',
    'Ajudan': '/ajudan',
    'Staf Protokol': '/staff-protokol',
    'Staf Media': '/staff-media',
    'Pemohon': '/pemohon',
};

export default function DashboardRedirect() {
    const userRole = localStorage.getItem('userRole');
    const token = getToken();

    if (!userRole || !token) {
        return <Navigate to="/login" replace />;
    }

    const target = roleMap[userRole] || '/admin/dashboard';
    return <Navigate to={target} replace />;
}
