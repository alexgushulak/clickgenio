import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import Button from '@mui/material/Button';
import { useCookies } from 'react-cookie';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../main';


export default function Login() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'given_name', 'pictureURL', 'credits']);
    const authContext = useContext(AuthContext);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    
    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            const login_info = await axios.post(
                `${import.meta.env.VITE_APISERVER}/auth/google`, {
                    code: codeResponse.code,
                });

            setCookie('token', login_info.data.id_token)
            setCookie('given_name', login_info.data.payload.given_name)
            setCookie('pictureURL', login_info.data.payload.picture)

            authContext?.setIsLoggedIn(true)
        },
        onError: errorResponse => console.log(errorResponse),
    });

    const navigate = useNavigate();

    const logout = () => {
        removeCookie('token')
        authContext?.setIsLoggedIn(false)
        navigate('/')
    }

    useEffect(() => {
        if (cookies.token) {
            authContext?.setIsLoggedIn(true)
        }
    }, [setCookie, removeCookie])
      
    
    return (
        <div id="signInButton" style={{float: 'right'}}>
            <Button
                sx={{
                    width: '100px',
                    display: authContext?.isLoggedIn ? 'none' : 'flex'
                }}
                className="btn-hover color-12"
                variant='contained'
                onClick={() => googleLogin()}
            >
                Sign in
            </Button>
            <Box sx={{ display: authContext?.isLoggedIn ? 'flex' : 'none' ,flexGrow: 0 }}>
                <Button variant="contained" sx={{display: 'none', marginRight: '20px'}}>
                    Buy Tokens
                </Button>
                <Tooltip title="">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt="AI" imgProps={{ referrerPolicy: "no-referrer"}} src={cookies.pictureURL} />
                    </IconButton>
                </Tooltip>
                <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                >
                <MenuItem key="1" onClick={logout}>
                    <Typography textAlign="center">Logout</Typography>
                </MenuItem>
                </Menu>
            </Box>
        </div>
    )

}