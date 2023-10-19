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
import Badge from '@mui/material/Badge';
import TollIcon from '@mui/icons-material/Toll';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../main';
import { getCredits } from '../services/apiLayer';


export default function Login() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [credits, setCredits] = React.useState<null | number>(null);
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

            console.log(login_info)

            setCookie('token', login_info.data.id_token)
            setCookie('given_name', login_info.data.given_name)
            setCookie('pictureURL', login_info.data.picture)

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

    const buyTokens = () => {
        if (authContext?.isLoggedIn == true) {
            navigate('/purchase')
        } else {
            googleLogin()
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (cookies.token) {
                authContext?.setIsLoggedIn(true);
            }
        
            try {
                const response = await getCredits(cookies.token);
                setCredits(response.credits);
                setCookie('credits', response.credits)
            } catch (error) {
                // Handle any errors that occur while fetching credits.
                console.error('Error fetching credits:', error);
            }
        };

        fetchData()
    }, [setCookie, removeCookie, cookies.credits])
      
    
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
            <Box sx={{ display: authContext?.isLoggedIn ? 'flex' : 'none'}}>
                <Button variant="outlined" sx={{cursor: 'default', display: authContext?.isLoggedIn ? 'flex' : 'none', marginRight: '20px'}}>
                    Credits: {credits}
                </Button>
                <Button variant="contained" onClick={buyTokens} sx={{display: authContext?.isLoggedIn ? 'flex' : 'none', marginRight: '20px'}}>
                    Buy Credits
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
                <MenuItem key="1">
                    <Typography textAlign="center">Support: clickgenio11@gmail.com</Typography>
                </MenuItem>
                <MenuItem key="2" onClick={logout}>
                    <Typography textAlign="center">Logout</Typography>
                </MenuItem>
                </Menu>
            </Box>
        </div>
    )

}