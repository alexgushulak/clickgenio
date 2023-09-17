import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Rocket from '../../public/rocket.png';

const pages = [''];
const settings = [''];

function ResponsiveAppBar() {

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'inline-flex' },
              fontFamily: 'helvetica',
              fontWeight: 700,
              float: 'left',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CLICKGEN.IO<br/>
            <Typography sx={{
              float: 'left',
              position: 'fixed',
              top: '40px',
              fontSize: '10px',
              display: {
                xs: 'none',
                md: 'inline-flex'
              },
            }}>AI Generated Youtube Thumbnails</Typography>
          </Typography>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {
                xs: 'flex',
                md: 'none'
              },
              flexGrow: 1,
              fontFamily: 'helvetica',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CLICKGEN.IO<br/>
            <Typography sx={{
              display: {
                xs: 'flex',
                md: 'none'
              },
              float: 'left',
              position: 'fixed',
              top: '38px',
              fontSize: '10px',
            }}>AI Generated Youtube Thumbnails</Typography>
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;