import Container from '@mui/material/Container';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import './splash.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SpaceMan from '../../assets/space.png'
import Button from '@mui/material/Button'
import { TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const splashContainer = {
    height: {xs: '500px', md: '400px'},
    borderRadius: '15px',
}

const websiteHook = {
    fontFamily: 'roboto',
    fontWeight: '700',
    textAlign: 'left',
    padding: '20px',
    color: '#000000',
    fontSize: '50px',
    lineHeight: '1'
}

const buttonStyle = {
    "text-align": "center",
    margin: "0 0px",
    mt: 0,
    fontSize: '14px',
    border: '2px solid black',
    float: 'left',
    width: '40%',
    height: '56px',
    display: 'flex'
}

const textFieldStyle = {
    color: 'black',
    float: 'left',
    marginLeft: '20px',
    width: '40%',
    height: '55px',
    display: 'flex'
}

const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

export default function Splash() {
    return (
        <Container sx={{backgroundColor: 'none', height: '100vh', margin: '30px auto'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <ThemeProvider theme={lightTheme}>
                    <Box className='green-gradient' sx={splashContainer}>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={7}>
                            <div className="title-wrapper">
                                <h1 className="sweet-title">
                                <span data-text="clickgen.io">clickgen.io</span>
                                </h1>
                                <span className="bottom-title">AI Generated Youtube Thumbnails</span>
                            </div>
                                <div>
                                <TextField sx={textFieldStyle} id="outlined-basic" label="Type in Email..." variant="outlined" />
                                <Button
                                    className="btn-hover color-9"
                                    sx={buttonStyle}
                                    color="warning"
                                    variant="contained"
                                    type="submit"
                                >start using clickgen now
                                </Button>   
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <img style={{height: '400px', paddingRight: '30px'}} src={SpaceMan}/>
                            </Grid>
                        </Grid>
                    </Box>
                </ThemeProvider>
                </Grid>
            </Grid>
        </Container>
    )
}