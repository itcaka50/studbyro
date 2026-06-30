import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/auth.context';
import {ProtectedRoute} from './components/auth/ProtectedRoute';

import {Navbar} from './components/layout/Navbar';
import {Login} from './pages/Auth/Login';
import {Dashboard} from './pages/Dashboard';
import {FacultiesPage} from './pages/Academic/FacultiesPage';
import {DepartmentsPage} from './pages/Academic/DepartmentsPage';
import {CoursesPage} from './pages/Academic/CoursesPage';
import {TeachersPage} from './pages/Academic/TeachersPage';
import {StudentsPage} from './pages/Academic/StudentsPage';
import {CurriculumsPage} from './pages/Academic/CurriculumPage';
import {UsersPage} from './pages/Academic/UsersPage';
import {SchedulesPage} from './pages/Academic/SchedulesPage';
import {UserProfilePage} from './pages/Profile/user_profile';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container">
                    {' '}
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute requireAuth>
                                    <UserProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/faculties"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <FacultiesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/departments"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <DepartmentsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/courses"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <CoursesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/teachers"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <TeachersPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/students"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <StudentsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/curriculums"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <CurriculumsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <UsersPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/schedules"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <SchedulesPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
