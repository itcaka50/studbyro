import React from 'react';
import {useAuth} from '../../context/auth.context';
import {useNavigate} from 'react-router-dom';

export const AdminDashboard = () => {
    const {user} = useAuth();
    const navigate = useNavigate();

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
                    flexWrap: 'wrap',
                    gap: '15px',
                    marginTop: '20px'
                }}
            >
                <button
                    className="btn btn-primary"
                    style={{
                        width: 'auto',
                        minWidth: '220px',
                        padding: '15px',
                        textAlign: 'left'
                    }}
                    onClick={() => navigate('/users')}
                >
                    👥 Управление на Потребители
                </button>

                <button
                    className="btn btn-primary"
                    style={{
                        width: 'auto',
                        minWidth: '220px',
                        padding: '15px',
                        textAlign: 'left'
                    }}
                    onClick={() => navigate('/faculties')}
                >
                    🏢 Управление на Факултети
                </button>

                <button
                    className="btn btn-primary"
                    style={{
                        width: 'auto',
                        minWidth: '220px',
                        padding: '15px',
                        textAlign: 'left'
                    }}
                    onClick={() => navigate('/departments')}
                >
                    📂 Управление на Катедри
                </button>

                <button
                    className="btn btn-primary"
                    style={{
                        width: 'auto',
                        minWidth: '220px',
                        padding: '15px',
                        textAlign: 'left'
                    }}
                    onClick={() => navigate('/courses')}
                >
                    📚 Управление на Курсове
                </button>

                <button
                    className="btn btn-primary"
                    style={{
                        width: 'auto',
                        minWidth: '220px',
                        padding: '15px',
                        textAlign: 'left'
                    }}
                    onClick={() => navigate('/dormitories')}
                >
                    🏠 Одобряване на Общежития
                </button>
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
                    <div
                        className="card"
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            textAlign: 'center',
                            padding: '20px'
                        }}
                    >
                        <h4 style={{margin: 0, color: '#666'}}>Сървър</h4>
                        <p
                            style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#28a745',
                                margin: '10px 0 0 0'
                            }}
                        >
                            На линия (3000)
                        </p>
                    </div>
                    <div
                        className="card"
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            textAlign: 'center',
                            padding: '20px'
                        }}
                    >
                        <h4 style={{margin: 0, color: '#666'}}>Клиент</h4>
                        <p
                            style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#007bff',
                                margin: '10px 0 0 0'
                            }}
                        >
                            Порт 3001
                        </p>
                    </div>
                    <div
                        className="card"
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            textAlign: 'center',
                            padding: '20px'
                        }}
                    >
                        <h4 style={{margin: 0, color: '#666'}}>
                            Ниво на достъп
                        </h4>
                        <p
                            style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#dc3545',
                                margin: '10px 0 0 0'
                            }}
                        >
                            Administrator
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
