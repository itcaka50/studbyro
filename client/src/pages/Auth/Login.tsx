import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/auth.context';

export const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Моля, попълни всички полета!');
            return;
        }

        try {
            setIsLoading(true);
            await login({email, password});
            navigate('/');
        } catch (err: any) {
            const backendMessage = err.response?.data?.message;
            setError(backendMessage || 'Неуспешен вход. Провери си данните!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="center-screen">
            <div className="card" style={{maxWidth: '400px'}}>
                <h2 className="card-title">Вход в системата</h2>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Имейл</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={isLoading}
                            placeholder="Въведи твоя имейл"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Парола</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={isLoading}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Проверка...' : 'Влез'}
                    </button>
                </form>
            </div>
        </div>
    );
};
