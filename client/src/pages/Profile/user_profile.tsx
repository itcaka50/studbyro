import React, {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../../context/auth.context';
import {usersApi} from '../../api/users.api';
import {
    getPasswordValidationError,
    PASSWORD_REQUIREMENTS_MESSAGE
} from '../../utils/password';

export const UserProfilePage = () => {
    const {user, isAuthenticated, isLoading, refreshUser} = useAuth();

    const [profileForm, setProfileForm] = useState({
        username: '',
        name: '',
        email: '',
        phoneNumber: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [profileMessage, setProfileMessage] = useState('');
    const [profileError, setProfileError] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileForm({
                username: user.username ?? '',
                name: user.name ?? '',
                email: user.email ?? '',
                phoneNumber: (user as {phoneNumber?: string}).phoneNumber ?? ''
            });
        }
    }, [user]);

    if (isLoading) {
        return <div style={{padding: '20px'}}>Зареждане...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMessage('');
        setProfileError('');

        try {
            setIsSavingProfile(true);
            await usersApi.updateProfile({
                username: profileForm.username,
                name: profileForm.name,
                email: profileForm.email,
                phoneNumber: profileForm.phoneNumber || undefined
            });
            await refreshUser();
            setProfileMessage('Профилът е обновен успешно!');
        } catch (err: any) {
            setProfileError(
                err.response?.data?.message || 'Грешка при обновяване на профила.'
            );
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage('');
        setPasswordError('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Новата парола и потвърждението не съвпадат.');
            return;
        }

        const validationError = getPasswordValidationError(
            passwordForm.newPassword
        );
        if (validationError) {
            setPasswordError(validationError);
            return;
        }

        try {
            setIsSavingPassword(true);
            await usersApi.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setPasswordMessage('Паролата е сменена успешно!');
        } catch (err: any) {
            setPasswordError(
                err.response?.data?.message || 'Грешка при смяна на паролата.'
            );
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div style={{padding: '20px', maxWidth: '720px'}}>
            <h1>Моят профил</h1>
            <p style={{color: '#666', marginBottom: '24px'}}>
                Обновете личните си данни или сменете паролата си. Само вие
                можете да промените паролата на акаунта си.
            </p>

            <div className="card" style={{marginBottom: '24px'}}>
                <h3>Лични данни</h3>
                {profileError && (
                    <div className="alert-error">{profileError}</div>
                )}
                {profileMessage && (
                    <div
                        style={{
                            color: '#166534',
                            backgroundColor: '#dcfce7',
                            padding: '10px',
                            borderRadius: '4px',
                            marginBottom: '12px'
                        }}
                    >
                        {profileMessage}
                    </div>
                )}
                <form onSubmit={handleProfileSubmit}>
                    <div className="form-group">
                        <label>Потребителско име</label>
                        <input
                            className="form-control"
                            value={profileForm.username}
                            onChange={e =>
                                setProfileForm({
                                    ...profileForm,
                                    username: e.target.value
                                })
                            }
                            required
                            disabled={isSavingProfile}
                        />
                    </div>
                    <div className="form-group">
                        <label>Пълно име</label>
                        <input
                            className="form-control"
                            value={profileForm.name}
                            onChange={e =>
                                setProfileForm({
                                    ...profileForm,
                                    name: e.target.value
                                })
                            }
                            required
                            disabled={isSavingProfile}
                        />
                    </div>
                    <div className="form-group">
                        <label>Имейл</label>
                        <input
                            type="email"
                            className="form-control"
                            value={profileForm.email}
                            onChange={e =>
                                setProfileForm({
                                    ...profileForm,
                                    email: e.target.value
                                })
                            }
                            required
                            disabled={isSavingProfile}
                        />
                    </div>
                    <div className="form-group">
                        <label>Телефон (по избор)</label>
                        <input
                            className="form-control"
                            value={profileForm.phoneNumber}
                            onChange={e =>
                                setProfileForm({
                                    ...profileForm,
                                    phoneNumber: e.target.value
                                })
                            }
                            disabled={isSavingProfile}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSavingProfile}
                        style={{width: 'auto'}}
                    >
                        {isSavingProfile ? 'Запазване...' : 'Запази профила'}
                    </button>
                </form>
            </div>

            <div className="card">
                <h3>Смяна на парола</h3>
                {passwordError && (
                    <div className="alert-error">{passwordError}</div>
                )}
                {passwordMessage && (
                    <div
                        style={{
                            color: '#166534',
                            backgroundColor: '#dcfce7',
                            padding: '10px',
                            borderRadius: '4px',
                            marginBottom: '12px'
                        }}
                    >
                        {passwordMessage}
                    </div>
                )}
                <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label>Текуща парола</label>
                        <input
                            type="password"
                            className="form-control"
                            value={passwordForm.currentPassword}
                            onChange={e =>
                                setPasswordForm({
                                    ...passwordForm,
                                    currentPassword: e.target.value
                                })
                            }
                            required
                            disabled={isSavingPassword}
                        />
                    </div>
                    <div className="form-group">
                        <label>Нова парола</label>
                        <input
                            type="password"
                            className="form-control"
                            value={passwordForm.newPassword}
                            onChange={e =>
                                setPasswordForm({
                                    ...passwordForm,
                                    newPassword: e.target.value
                                })
                            }
                            required
                            minLength={8}
                            disabled={isSavingPassword}
                        />
                        <small style={{color: '#666'}}>
                            {PASSWORD_REQUIREMENTS_MESSAGE}
                        </small>
                    </div>
                    <div className="form-group">
                        <label>Потвърди новата парола</label>
                        <input
                            type="password"
                            className="form-control"
                            value={passwordForm.confirmPassword}
                            onChange={e =>
                                setPasswordForm({
                                    ...passwordForm,
                                    confirmPassword: e.target.value
                                })
                            }
                            required
                            minLength={8}
                            disabled={isSavingPassword}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSavingPassword}
                        style={{width: 'auto'}}
                    >
                        {isSavingPassword ? 'Запазване...' : 'Смени паролата'}
                    </button>
                </form>
            </div>
        </div>
    );
};
