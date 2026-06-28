import React from 'react';
import {useAuth} from '../../context/auth.context';

export const StudentDashboard = () => {
    const {user} = useAuth();

    return (
        <div>
            <h1>Здравей, {user?.username}! (Студентски портал)</h1>

            <div style={{display: 'flex', gap: '20px', marginTop: '20px'}}>
                <div className="card">Моята специалност</div>
                <div className="card">Записване на курсове</div>
            </div>
        </div>
    );
};
