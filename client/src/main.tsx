import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter as Router} from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CookiesProvider } from 'react-cookie';

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

function AuthProvider({children}: any) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

// const AuthWrapper = () => {
//     return isExpired(localStorage.getItem('token')
//       ? <Navigate to="/login" replace />
//       : <Outlet />;
//   };

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <CookiesProvider defaultSetOptions={{ path: '/' }} />
        <AuthProvider>
            <Router>
                <App />
            </Router>
        </AuthProvider>
    </GoogleOAuthProvider>
)