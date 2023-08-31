import Box from '@mui/material/Box';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

export default function Footer() {
    return (
        <div>
        <Divider variant="fullWidth" />
        <Box sx={{ display: 'flex', 'width': '90%', 'margin': '0px auto ', 'padding':'10px', height: '75px' }}>
            <Typography variant="body2" sx={{ color: "#fff", m: 1, 'font-size': '14px', width: '150px', 'padding-top': '2px'}}>Built in Boston.</Typography>
            <Stack direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={1} sx={{mt: 0.4, 'float': 'right!important', 'display': 'flex', 'width': '100%', 'justify-content':'right'}}>
                <Button sx={{display: 'inline-block'}} href="https://www.linkedin.com/in/alex-g-33039513b/">
                <LinkedInIcon  sx={{ color: "#fff", fontSize: 18, m: 1 }} />
                </Button>
                <Button sx={{display: 'inline-block'}} href="https://github.com/alexgushulak">
                <GitHubIcon sx={{ color: "#fff", fontSize: 18, m: 1 }} />
                </Button>   
                <Button sx={{display: 'inline-block'}} href="mailto: alex.gushulak@gmail.com">
                <EmailIcon sx={{ color: "#fff", fontSize: 18, m: 1 }} />
                </Button>
            </Stack>
        </Box>
        </div>
    )
}