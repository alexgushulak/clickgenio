import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import '../App.css';

export default function Hero() {
  return (
    <Container sx={{minHeight: '550px', 'height': {xs: '90vh', sm:'90vh'}, 'line-height': {xs: '25px', sm: '40px'},'margin-top': {xs: 0, sm: 0}, 'margin': '0 auto', 'margin-bottom': {xs: 0, sm: 0}, 'width': {xs: '90vw', sm: '75vw', md: '55vw',}}} >
    <Container
      className="main-page-container"
      sx={{'vertical-align': 'middle', 'display': 'inline'}}
    >
        <Typography className="main-page-hello" variant="h6" component="div" gutterBottom>
          My name is
        </Typography>
          <Box display="flex">
            <Typography className="main-page-title" variant="h1" component="div" sx={{'font-size': {xs:'10vw  !important',sm:'6vw!important', md:'5.5vw!important'}}}>Alex Gushulak. 🚀</Typography>
          </Box>
        <Typography
          className="main-page-title"
          color="#b7e7da"
          variant="h1"
          component="div"
          gutterBottom
          sx={{'font-size': {xs:'10vw!important',sm:'6vw!important', md:'5vw!important'}}}>
            I Like To Write Code
        </Typography>
        <Typography className="main-page-description" color="#dadada" variant="h6" component="div" gutterBottom>
        As a mechanical engineer turned software engineer, I have a unique blend of technical skills and problem-solving abilities. 
        I'm passionate about building clean and performant full-stack web applications. 
        </Typography>
        <Box mt={3} display="flex" justifyContent="flex-start" alignItems="flex-start">
          <Button href="#projects" className="main-page-button" variant="outlined">Check Out My Latest Work</Button>
        </Box>
        <a href="#about-me">
        <div className="chevron-container">
          <div className="chevron"></div>
          <div className="chevron"></div>
          <div className="chevron"></div>
        </div>
        </a>
    </Container>
    </Container>
  );
}