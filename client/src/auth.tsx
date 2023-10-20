import { createContext, useContext, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const AuthContext = createContext<any>(null)

export const AuthProvider = ({children}: any) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'given_name', 'pictureURL', 'credits']);

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            const login_info = await axios.post(
                `${import.meta.env.VITE_APISERVER}/auth/google`, {
                    code: codeResponse.code,
                });

            setCookie('token', login_info.data.id_token)
            setCookie('given_name', login_info.data.given_name)
            setCookie('pictureURL', login_info.data.picture)

            setIsLoggedIn(true)
        },
        onError: errorResponse => console.log("Google Login Error: ", errorResponse),
    });

    const login = (user: string) => {
        googleLogin()
    }

    const logout = () => {
        removeCookie('token')
        setIsLoggedIn(false)
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}