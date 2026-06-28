import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react';
import {authApi} from '../api/auth.api';

interface User {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
    teacher?: any;
    student?: any;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: {
        email?: string;
        username?: string;
        password: string;
    }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await authApi.getProfile();

                    const userData = response.data.data || response.data.user;
                    setUser(userData);
                } catch (error) {
                    console.error('Невалиден или изтекъл токен', error);
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials: {
        email?: string;
        username?: string;
        password: string;
    }) => {
        const response = await authApi.login(credentials);

        const token = response.data.token || response.data.accessToken;
        const userData = response.data.data || response.data.user;

        if (!token) {
            throw new Error('Сървърът не върна тоукън!');
        }

        localStorage.setItem('token', token);

        setUser(userData);
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth трябва да се използва вътре в AuthProvider!');
    }
    return context;
};
