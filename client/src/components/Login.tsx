import Button from '@mui/material/Button';
import { useCookies } from 'react-cookie';
import React, { useState, useEffect, useContext } from 'react';
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
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'given_name', 'pictureURL', 'credits']);
    const auth = useAuth()

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const navigate = useNavigate();

    const buyTokens = () => {
        if (auth.isLoggedIn == true) {
            navigate('/purchase')
        } else {
            auth.login()
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (cookies.token) {
                try {
                    const response = await getCredits(cookies.token);
                    setCredits(response.credits);
                    setCookie('credits', response.credits)
                } catch (error) {
                    // Handle any errors that occur while fetching credits.
                    console.error('Error fetching credits:', error);
                }
            }
        };

        fetchData()
    }, [setCookie, removeCookie])
      
    
    return (
        <div id="signInButton" style={{float: 'right'}}>
            <Button
                sx={{
                    width: '100px',
                    display: auth.isLoggedIn ? 'none' : 'flex'
                }}
                className="btn-hover color-12"
                variant='contained'
                onClick={() => auth.login()}
            >
                Sign in
            </Button>
            <Box sx={{ display: auth.isLoggedIn ? 'flex' : 'none'}}>
                <Button variant="outlined" sx={{cursor: 'default', display: auth.isLoggedIn ? 'flex' : 'none', marginRight: '20px'}}>
                    Credits: {credits}
                </Button>
                <Button variant="contained" onClick={buyTokens} sx={{display: auth.isLoggedIn ? 'flex' : 'none', marginRight: '20px'}}>
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
                    <MenuItem key="2" onClick={auth.logout}>
                        <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </div>
    )

}