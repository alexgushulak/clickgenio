import Button from '@mui/material/Button';
import { Cookies, useCookies } from 'react-cookie';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../auth';
import { getCredits } from '../services/apiLayer';


export default function Login() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [credits, setCredits] = React.useState<null | number>(null);
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'given_name', 'pictureURL', 'credits', 'isLoggedIn']);
    const navigate = useNavigate();
    const auth = useAuth()

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const buyTokens = () => {
        navigate('/purchase')
    }

    const handleLogout = () => {
        auth.logout()
        handleCloseUserMenu()
    }

    useEffect(() => {
        if (!auth.isAuthorized()) {
            navigate('/')
        }
        
        const fetchData = async () => {
            if (cookies.token) {
                try {
                    const response = await getCredits(cookies.token);
                    setCredits(response.credits);
                    setCookie('credits', response.credits)
                } catch (error) {
                    console.error('Error fetching credits:', error);
                }
            }
        };

        fetchData()

    }, [cookies.credits])
      
    
    return (
        <div id="signInButton" style={{float: 'right'}}>
            <Button
                sx={{
                    width: '100px',
                    display: cookies.isLoggedIn ? 'none' : 'flex'
                }}
                className="btn-hover color-12"
                variant='contained'
                onClick={() => auth.login()}
            >
                Sign in
            </Button>
            <Box sx={{ display: cookies.isLoggedIn ? 'flex' : 'none'}}>
                <Button variant="outlined" sx={{cursor: 'default', display: cookies.isLoggedIn ? 'flex' : 'none', marginRight: '20px'}}>
                    Credits: {credits}
                </Button>
                <Button variant="contained" onClick={buyTokens} sx={{display: cookies.isLoggedIn ? 'flex' : 'none', marginRight: '20px'}}>
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
                    <MenuItem key="2" onClick={handleLogout}>
                        <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </div>
    )

}