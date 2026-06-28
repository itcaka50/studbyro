import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/auth.context';

export const Navbar = () => {
    const {user, isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    StudByro
                </Link>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Начало
                        </Link>
                    </li>

                    {user?.isAdmin && (
                        <>
                            <li className="nav-item">
                                <Link to="/faculties" className="nav-link">
                                    Факултети
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/departments" className="nav-link">
                                    Катедри
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/courses" className="nav-link">
                                    Курсове
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/curriculums" className="nav-link">
                                    Учебни планове
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/teachers" className="nav-link">
                                    Преподаватели
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/students" className="nav-link">
                                    Студенти
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/users" className="nav-link">
                                    Потребители
                                </Link>
                            </li>
                        </>
                    )}
                </ul>

                <div className="nav-auth">
                    {isAuthenticated ? (
                        <>
                            <span style={{marginRight: '15px'}}>
                                Здравей, <strong>{user?.username}</strong>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="btn btn-danger"
                            >
                                Изход
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Вход
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
