// App.tsx
import React, { useState } from 'react';
import { CssBaseline, Container, Typography, TextField, Button, Box } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { submitData, generateImage } from './services/apiLayer';
import RainbowTesla from './assets/rainbow_tesla.png'
import Tsunami from './assets/tsunami.png'

export default function App() {
  const engineId = 'stable-diffusion-xl-1024-v1-0'
  const apiHost = 'https://api.stability.ai'
  const apiKey = "sk-36jFn0ywSl2ktMvPnqdMdcbJRdI1x3bNLL8Hydd81XrmxWT9"
  const [thumbnailText, setThumbnailText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const handleTextbarChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setThumbnailText(value);
  };

  const trackClick = async () => {
    await submitData(thumbnailText);
    await generateImage(thumbnailText, apiHost, engineId, apiKey, setImageUrl);
    console.log("Ending Post");
    navigate("/submit");
  };

  return (
    <div>
        <CssBaseline />
        <Routes>
          <Route path="/submit" element={<p>Loading</p>} />
          <Route path="/" element={''} />
        </Routes>
          <Container sx={{ mb: 5, mt: 15 }}>
          <img src={imageUrl} />
          <Typography
            variant="h3"
            component="h3"
            sx={{ display: 'block', 'text-align': 'center', margin: '0 auto', mt: 1}}>
            AI Thumbnail Generator
          </Typography>
          <TextField
            fullWidth={true}
            value={thumbnailText}
            onChange={handleTextbarChange}
            id="outlined-multiline-flexible"
            placeholder='A Rainbow Colored Tesla Model 3 Driving Through the Mountains'
            multiline
            maxRows={1}
          />
          <Button
            sx={{ display: 'block', 'text-align': 'center', margin: '0 auto', mt: 1}}
            variant="contained"
            onClick={trackClick}>
            GENERATE THUMBNAIL
          </Button>
          </Container>
          <Container sx={{ display: 'block', margin: '25px auto', 'text-align': 'center'}}>
            <Box
              component="img"
              sx={{
                height: 225,
                width: 400,
                display: 'inline-block',
                margin: '0 auto',
                padding: '10px'
              }}
              alt="The house from the offer."
              src={RainbowTesla}
            />
            <Box
              component="img"
              sx={{
                height: 225,
                width: 400,
                display: 'inline-block',
                margin: '0 auto',
                padding: '10px'
              }}
              alt="The house from the offer."
              src={Tsunami}
            />
        </Container>
    </div>
  )
}
