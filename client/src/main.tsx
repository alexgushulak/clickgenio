import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter as Router, redirect, Route} from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CookiesProvider } from 'react-cookie';
import { useCookies } from 'react-cookie';
import { Buffer } from 'buffer';

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

function isExpired(id_token: string) {
    const segments = id_token.split('.');

    if (segments.length !== 3) {
      throw new Error('Not enough or too many segments');
    }

    var payloadSeg = segments[1];

    function base64urlDecode(token: string) {
      const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
      return Buffer.from(base64, 'base64').toString();
    }

    var payload = JSON.parse(base64urlDecode(payloadSeg));
    console.log(payload.exp)
    return true
}

function AuthProvider({children}: any) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'given_name', 'pictureURL', 'credits']);

    const isTokenExpired = cookies.token ? isExpired(cookies.token) : false

    // if (isTokenExpired) {
    //     redirect("/")
    // }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <CookiesProvider defaultSetOptions={{ path: '/' }} />
        <AuthProvider>
            <Router>
                <App />
            </Router>
        </AuthProvider>
    </GoogleOAuthProvider>
)