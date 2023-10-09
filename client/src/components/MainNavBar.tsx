import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import resumeURL from '../assets/Alex_Gushulak_Software_Resume.pdf';
import SvgIcon from '@mui/material/SvgIcon';
import logo from '../assets/logo.png';
import Avatar from '@mui/material/Avatar';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const websiteName = "Alex Gushulak Portfolio"
const navLinks = [
  { name: "About", 
   path: "#about-me" 
  },
  {
    name: "Work Experience",
    path: "#work-experience",
  },
  {
    name: "Projects",
    path: "#projects",
  }
];

export default function MainNavBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {websiteName}
      </Typography>
      <Divider />
      <List>
        {navLinks.map((link, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton href={link.path} sx={{ textAlign: 'center' }}>
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem key="Resume" disablePadding>
          <ListItemButton href={resumeURL}  sx={{ textAlign: 'center' }}>
            <ListItemText primary="Resume" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const websiteLogo = (
    <Box 
      component="div" mx={2}
      sx={{ height: '42px',flexGrow: 1, textAlign: {xs: 'right', sm: 'left'}, display: { sm: 'block' } }}>
      <a href="/">
        <img src={logo} alt="logo" height="40px"/>
      </a>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', height: '120px'}}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {websiteLogo}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navLinks.map((link, index) => (
              <Button href={link.path} key={index} sx={{ color: "#FFF", 'font-size': {sm: '11px!important', md: '12px!important'}, mx: {sm: 0.5, md: 1} }}>
                {link.name}
              </Button>
            ))}
            <Button variant="outlined" href={resumeURL} key="Resume" sx={{ color: "#64ffd8", 'font-size': '12px!important', mx: {sm: 0, md: 1}  }}>
              Resume
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}