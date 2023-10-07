import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import logo from '../assets/logo.png';

export default function ResponsiveAppBar() {

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={logo} style={{'height': '50px', 'borderRadius': '10px'}}></img>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              ml: 1,
              display: { xs: 'none', md: 'inline-flex' },
              fontFamily: 'helvetica',
              fontWeight: 700,
              float: 'left',
              color: 'white',
              textDecoration: 'none',
            }}
          > CLICKGEN.IO
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              ml: 1,
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
          > CLICKGEN.IO
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}