import React from 'react';
import {Link, Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../../context/auth.context';

type RequiredRole = 'admin' | 'student' | 'teacher';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    roles?: RequiredRole[];
}

export const ProtectedRoute = ({
    children,
    requireAuth = false,
    roles = []
}: ProtectedRouteProps) => {
    const {user, isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div style={{padding: '20px'}}>Зареждане...</div>;
    }

    if (requireAuth && !isAuthenticated) {
        return (
            <Navigate to="/login" state={{from: location.pathname}} replace />
        );
    }

    if (roles.length > 0) {
        if (!isAuthenticated) {
            return (
                <Navigate
                    to="/login"
                    state={{from: location.pathname}}
                    replace
                />
            );
        }

        const allowed = roles.some(role => {
            if (role === 'admin') return user?.isAdmin;
            if (role === 'student') return !!user?.student;
            if (role === 'teacher') return !!user?.teacher;
            return false;
        });

        if (!allowed) {
            return (
                <div className="card" style={{margin: '20px 0'}}>
                    <h2>Достъпът е отказан</h2>
                    <p style={{color: '#666'}}>
                        Нямате необходимата роля за тази страница.
                    </p>
                    <Link to="/" className="btn btn-primary" style={{width: 'auto'}}>
                        Към начало
                    </Link>
                </div>
            );
        }
    }

    return <>{children}</>;
};
