import React from 'react';
import {useAuth} from '../../context/auth.context';

export const TeacherDashboard = () => {
    const {user} = useAuth();

    return (
        <div>
            <h1>Здравей, доц. {user?.username}! (Преподавателски портал)</h1>
            <p>Управление на учебния процес и студентските постижения.</p>

            <div style={{display: 'flex', gap: '20px', marginTop: '20px'}}>
                <div className="card" style={cardStyle}>
                    <h3>📚 Моите курсове</h3>
                    <p>Преглед на лекции и упражнения</p>
                </div>
                <div className="card" style={cardStyle}>
                    <h3>📝 Оценяване</h3>
                    <p>Въвеждане и редакция на оценки</p>
                </div>
                <div className="card" style={cardStyle}>
                    <h3>📅 Моят график</h3>
                    <p>Седмично разписание по зали</p>
                </div>
                <div className="card" style={cardStyle}>
                    <h3>👥 Студенти</h3>
                    <p>Списъци на записаните в моите групи</p>
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: 1,
    textAlign: 'center' as const,
    backgroundColor: '#f9f9f9'
};
