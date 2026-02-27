import { Outlet, useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import { getToken } from '../lib/api';

export default function AuthGuard() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = getToken();

        if (!token) {
            // Redirect to login if no token is found
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [navigate, location.pathname]);

    return <Outlet />;
}
