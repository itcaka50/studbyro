import React from 'react';
import {useAuth} from '../../context/auth.context';

import {GuestDashboard} from './GuestDashboard';
import {StudentDashboard} from './StudentDashboard';
import {AdminDashboard} from './AdminDashboard';
import {TeacherDashboard} from './TeacherDashboard';

export const Dashboard = () => {
    const {user, isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return <div>Зареждане на системата...</div>;
    }

    if (!isAuthenticated) {
        return <GuestDashboard />;
    }

    if (user?.isAdmin) {
        return <AdminDashboard />;
    }

    if (user?.teacher) {
        return <TeacherDashboard />;
    }

    if (user?.student) {
        return <StudentDashboard />;
    }

    return (
        <div>
            <h1>Профилът ви се обработва</h1>
            <p>
                Моля, свържете се с администратор, за да ви назначи роля
                (Студент или Преподавател).
            </p>
        </div>
    );
};
