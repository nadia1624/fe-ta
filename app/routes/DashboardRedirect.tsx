import { Navigate } from "react-router";
import { getToken } from "../lib/api";

const roleMap: Record<string, string> = {
    'Admin': '/dashboard/admin',
    'Sespri': '/dashboard/sespri',
    'Kasubag Protokol': '/dashboard/kasubag-protokol',
    'Kasubag Media': '/dashboard/kasubag-media',
    'Ajudan': '/dashboard/ajudan',
    'Staf Protokol': '/dashboard/staf-protokol',
    'Staf Media': '/dashboard/staf-media',
    'Pemohon': '/dashboard/pemohon',
};

export default function DashboardRedirect() {
    const userRole = localStorage.getItem('userRole');
    const token = getToken();

    if (!userRole || !token) {
        return <Navigate to="/login" replace />;
    }

    const target = roleMap[userRole] || '/dashboard/admin';
    return <Navigate to={target} replace />;
}
