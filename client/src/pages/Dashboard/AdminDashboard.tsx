import React from 'react';
import {useAuth} from '../../context/auth.context';
import {useNavigate} from 'react-router-dom';

export const AdminDashboard = () => {
    const {user} = useAuth();
    const navigate = useNavigate();

    const menuButtonStyle = {
        width: 'auto',
        minWidth: '240px',
        padding: '15px',
        textAlign: 'left' as const,
        marginBottom: '10px'
    };

    return (
        <div style={{padding: '20px'}}>
            <h1>Административен Панел</h1>
            <p>
                Добре дошъл, <strong>{user?.username}</strong>! Имаш пълен
                достъп до управлението на системата.
            </p>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    marginTop: '20px'
                }}
            >
                <section>
                    <h3>Потребители</h3>
                    <div
                        style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}
                    >
                        <button
                            className="btn btn-primary"
                            style={menuButtonStyle}
                            onClick={() => navigate('/users')}
                        >
                            👥 Управление на Потребители
                        </button>
                        <button
                            className="btn btn-primary"
                            style={menuButtonStyle}
                            onClick={() => navigate('/students')}
                        >
                            👨‍🎓 Студенти (Справки)
                        </button>
                        <button
                            className="btn btn-primary"
                            style={menuButtonStyle}
                            onClick={() => navigate('/teachers')}
                        >
                            👨‍🏫 Преподаватели (Справки)
                        </button>
                    </div>
                </section>

                <section>
                    <h3>Университетска структура</h3>
                    <div
                        style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}
                    >
                        <button
                            className="btn btn-primary"
                            style={menuButtonStyle}
                            onClick={() => navigate('/faculties')}
                        >
                            🏢 Факултети
                        </button>
                        <button
                            className="btn btn-primary"
                            style={menuButtonStyle}
                            onClick={() => navigate('/departments')}
                        >
                            📂 Катедри
                        </button>
                        <button
                            className="btn btn-primary"
                            style={menuButtonStyle}
                            onClick={() => navigate('/curriculums')}
                        >
                            📋 Учебни планове
                        </button>
                        <button
                            className="btn btn-primary"
                            style={menuButtonStyle}
                            onClick={() => navigate('/courses')}
                        >
                            📚 Курсове
                        </button>
                        <button
                            className="btn btn-primary"
                            style={menuButtonStyle}
                            onClick={() => navigate('/schedules')}
                        >
                            📅 Графици
                        </button>
                    </div>
                </section>
            </div>

            <div style={{marginTop: '40px'}}>
                <h3>Статус на Системата</h3>
                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        marginTop: '15px',
                        flexWrap: 'wrap'
                    }}
                >
                    {[
                        {
                            label: 'Сървър',
                            value: 'На линия (3000)',
                            color: '#28a745'
                        },
                        {label: 'Клиент', value: 'Порт 3001', color: '#007bff'},
                        {
                            label: 'Ниво достъп',
                            value: 'Administrator',
                            color: '#dc3545'
                        }
                    ].map(stat => (
                        <div
                            key={stat.label}
                            className="card"
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                textAlign: 'center',
                                padding: '20px'
                            }}
                        >
                            <h4 style={{margin: 0, color: '#666'}}>
                                {stat.label}
                            </h4>
                            <p
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: stat.color,
                                    margin: '10px 0 0 0'
                                }}
                            >
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
