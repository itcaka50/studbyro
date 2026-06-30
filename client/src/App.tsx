import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/auth.context';

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
                        <Route path="/faculties" element={<FacultiesPage />} />
                        <Route
                            path="/departments"
                            element={<DepartmentsPage />}
                        />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/teachers" element={<TeachersPage />} />
                        <Route path="/students" element={<StudentsPage />} />
                        <Route
                            path="/curriculums"
                            element={<CurriculumsPage />}
                        />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/schedules" element={<SchedulesPage />} />
                        <Route path="/profile" element={<UserProfilePage />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
